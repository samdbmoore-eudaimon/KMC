const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { JSDOM, VirtualConsole } = require("jsdom");
const { freshProgress, freshModuleProgress } = require("../wm-progress.js");
const { randomDisplayName } = require("../wm-names.js");

const html = fs.readFileSync(path.join(__dirname, "../WallabyMaths.html"), "utf8")
  .replace(/(data:[\w.+/-]+;base64,)[A-Za-z0-9+/=]{200,}/g, "$1AA==");
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function until(read, message) {
  for (let i = 0; i < 400; i++) {
    const result = read();
    if (result) return result;
    await wait(20);
  }
  assert.fail(message);
}

async function roundTrip(accountType) {
  const accountId = `account-${accountType}`;
  const profileId = `player-${accountType}`;
  const progress = freshProgress();
  progress.modules.primary = { ...freshModuleProgress(), tutorialSeen: true, stars: 12 };
  let remote = {
    profile_id: profileId, name: randomDisplayName(), avatar: "🦘", active_module: "primary",
    progress, revision: 7, updated_at: Date.now(),
  };
  let releaseList;
  const delayedList = new Promise((resolve) => { releaseList = resolve; });
  let failPull = true;
  let failPush = accountType === "personal";
  let saves = 0;
  let signIns = 0;
  const errors = [];
  const certificate = Buffer.from(JSON.stringify({
    account_id: accountId, account_type: accountType, status: "lifetime", pin_hash: "mock-pin", valid_until: Date.now() + 60000,
  })).toString("base64url") + ".AA";
  const isPupil = accountType === "seat";
  const credentials = isPupil
    ? { school_code: "test-primary", username: "blue-otter", pin: "01234567" }
    : { email: "family@example.test", password: "test-password" };

  function openBrowser({ holdAutosave = false } = {}) {
    const virtualConsole = new VirtualConsole();
    virtualConsole.on("jsdomError", (error) => errors.push(error));
    return new JSDOM(html, {
      url: "https://wallaby.test/", runScripts: "dangerously", virtualConsole,
      beforeParse(window) {
        window.crypto.subtle = { importKey: async () => ({}), verify: async () => true };
        window.TextEncoder = TextEncoder;
        window.TextDecoder = TextDecoder;
        const schedule = window.setTimeout.bind(window);
        window.setTimeout = (fn, delay, ...args) => schedule(fn, delay === 5000 ? 0 : holdAutosave && delay === 1000 ? 60000 : delay, ...args);
        window.fetch = async (url, options) => {
          const route = new URL(url).pathname;
          if (route === (isPupil ? "/account/school-login" : "/account/login")) {
            assert.deepEqual(JSON.parse(options.body), credentials);
            signIns += 1;
            return { json: async () => ({ ok: true, session_token: accountId, certificate }) };
          }
          assert.equal(options.headers.Authorization, `Bearer ${accountId}`);
          if (route === "/account/profiles") {
            await delayedList;
            const { progress: _, ...shell } = remote;
            return { json: async () => ({ ok: true, profiles: [shell] }) };
          }
          if (route === `/account/profiles/${profileId}`) {
            return { json: async () => failPull ? { ok: false, error: "network" } : { ok: true, ...remote } };
          }
          assert.equal(route, `/account/profiles/${profileId}/progress`);
          const body = JSON.parse(options.body);
          assert.equal(body.revision, remote.revision);
          assert.equal(options.keepalive, true);
          await wait(50);
          if (failPush) {
            failPush = false;
            return { json: async () => ({ ok: false, error: "network" }) };
          }
          saves += 1;
          remote = { ...remote, ...body, revision: remote.revision + 1, updated_at: Date.now() };
          return { json: async () => ({ ok: true, revision: remote.revision, updated_at: remote.updated_at }) };
        };
      },
    });
  }

  const findButton = (browser, name) => [...browser.window.document.querySelectorAll("button")].find((el) => el.textContent.trim() === name);
  async function clickButton(browser, name) {
    const button = await until(() => findButton(browser, name), `Missing button ${name}`);
    button.click();
  }
  const body = (browser) => browser.window.document.getElementById("root").textContent;
  async function begin(browser) {
    const start = await until(() => browser.window.document.querySelector('[aria-label="Click to begin"]'), "Missing title screen");
    start.click();
  }
  async function signIn(browser) {
    await begin(browser);
    await clickButton(browser, isPupil ? "I'm a school user" : "I'm a family / personal user");
    await clickButton(browser, isPupil ? "I'm a pupil" : "I already have an account");
    const form = await until(() => browser.window.document.querySelector("form"), "Missing sign-in form");
    const setValue = Object.getOwnPropertyDescriptor(browser.window.HTMLInputElement.prototype, "value").set;
    const fields = isPupil
      ? { '[name="organization"]': credentials.school_code, '[name="username"]': credentials.username, '[inputmode="numeric"]': credentials.pin }
      : { '[name="email"]': credentials.email, '[type="password"]': credentials.password };
    for (const [selector, value] of Object.entries(fields)) {
      const input = form.querySelector(selector);
      setValue.call(input, value);
      input.dispatchEvent(new browser.window.Event("input", { bubbles: true }));
    }
    await clickButton(browser, isPupil ? "Sign in" : "Log in");
  }
  const localSave = (browser) => JSON.parse(browser.window.localStorage.getItem(`kq:wm_prof3_${profileId}`));
  const first = openBrowser({ holdAutosave: true });
  let second;
  try {
    await signIn(first);
    await until(() => body(first).includes("Finding your players"), "Missing cloud lookup state");
    assert.ok(!body(first).includes("Create a player"));
    releaseList();
    await until(() => body(first).includes(remote.name), "Cloud player did not appear");
    await clickButton(first, "Play");
    await until(() => body(first).includes("saved progress couldn’t be loaded"), "Missing failed restore message");
    assert.equal(localSave(first), null);
    assert.equal(saves, 0);
    failPull = false;
    const initialDev = first.window.kqDev;
    await clickButton(first, "Play");
    await until(() => localSave(first)?.modules.primary.stars === 12, "Cloud progress did not load");
    await until(() => first.window.document.querySelector('[title="Logout so the next player can sign in"]'), "Missing logout");
    await until(() => first.window.kqDev && first.window.kqDev !== initialDev, "Primary player controls did not initialise");

    first.window.kqDev.passAllMocks();
    await until(() => {
      if (errors.length) throw errors[0];
      return localSave(first)?.modules.primary.mocks[10];
    }, "Progress was not saved locally");
    assert.equal(saves, 0);
    await clickButton(first, "Logout");
    await until(() => first.window.document.querySelector('[title="Confirm log out"]'), "Missing logout confirmation");
    await clickButton(first, "Yes");
    await until(() => !first.window.localStorage.getItem("kq:wm_account_session"), "Logout did not finish");
    assert.equal(saves, 1);
    assert.equal(remote.progress.modules.primary.mocks[10], true);

    second = openBrowser();
    await signIn(second);
    await until(() => body(second).includes(remote.name), "Cloud player did not appear in a clean browser");
    assert.equal(signIns, 2);
    await clickButton(second, "Play");
    await until(() => localSave(second)?.modules.primary.mocks[10], "Clean browser did not restore the last session");
    assert.equal(localSave(second).modules.primary.stars, 12);
    await until(() => second.window.document.querySelector('[title="Logout so the next player can sign in"]'), "Restored player did not enter the game");
    second.window.kqDev.grantCard("addy");
    await until(() => localSave(second)?.cards.addy, "Card was not saved locally");
    await until(() => remote.progress.cards.addy, "Progress did not sync automatically while signed in");
    assert.deepEqual(errors, []);
  } finally {
    first.window.close();
    second?.window.close();
  }
}

(async () => {
  await roundTrip("seat");
  await roundTrip("personal");
  console.log("School and personal account save and restore regressions passed");
})().catch((error) => { console.error(error); process.exitCode = 1; });
