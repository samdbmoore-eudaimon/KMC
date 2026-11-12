const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { transformSync } = require('esbuild');
const { JSDOM } = require('jsdom');
const React = require('react');
const { createRoot } = require('react-dom/client');

const source = fs.readFileSync(path.join(__dirname, '..', 'WallabyMaths.jsx'), 'utf8');
const screen = source.slice(source.indexOf('const JOEY_LOBBY_ERROR ='), source.indexOf('/* ---------------- card UI components'));
const dom = new JSDOM('<div id="root"></div>', { pretendToBeVisual: true });
global.window = dom.window;
global.document = dom.window.document;
global.IS_REACT_ACT_ENVIRONMENT = true;
const polls = [];
const intervals = new Map();
let timerId = 0;
const stub = () => null;
const scope = {
  React, ...React,
  getJoeyLobby: () => new Promise(resolve => polls.push(resolve)),
  setJoeyReady: async () => ({ ok: true, state: 'ready' }),
  setJoeyNotReady: async () => ({ ok: true }),
  loadJSON: stub, getJoeyMatch: stub,
  DECK_SLOT_PREFIX: {}, SET_DISPLAY_NAMES: { primary: 'Ninefold Orchard' },
  JOEY_TUTORIAL_TILE: '', NFO_CARD_LAB_CHALLENGE: '', PRIMARY_TILE_CARDS: '',
  NFO_UI_ART: {}, JOEY_ART: {}, T: {}, LITE_CARD: {},
  Card: ({ children }) => React.createElement('div', null, children),
  AvatarBadge: stub, RefreshCw: stub, Users: stub, BookOpen: stub, Swords: stub,
  setInterval: (fn, ms) => { intervals.set(++timerId, { fn, ms }); return timerId; },
  clearInterval: id => intervals.delete(id),
};
const code = transformSync(screen + '\nreturn JoeyPlayScreen;', { loader: 'jsx', format: 'cjs' }).code;
const Screen = new Function(...Object.keys(scope), code)(...Object.values(scope));
const root = createRoot(document.getElementById('root'));
const props = { progress: {}, activeModule: 'primary', currentProfile: { id: 'a', name: 'Alice' }, entitlement: { accountId: 'family' }, setScreen: stub, setJoeyMultiplayerMatch: stub };
const lobby = (ready, players = []) => ({ ok: true, ready_state: ready ? 'ready' : null, ready_players: players });
async function click(text) {
  const button = [...document.querySelectorAll('button')].find(b => b.textContent.includes(text));
  assert.ok(button, `Missing button: ${text}`);
  await React.act(async () => button.click());
}

(async () => {
  await React.act(async () => root.render(React.createElement(Screen, props)));
  await click('Challenge a Player');
  assert.equal(polls.length, 1);
  const olderPoll = polls.shift();
  await click('Ready to play');
  await React.act(async () => polls.shift()(lobby(true, [{ profile_id: 'b', name: 'Bob' }])));
  assert.ok(document.body.textContent.includes('Bob'));
  await React.act(async () => olderPoll(lobby(false)));
  assert.ok(document.body.textContent.includes('Stop waiting'), 'A delayed pre-ready poll must not turn readiness off');
  assert.ok(document.body.textContent.includes('Bob'), 'A delayed poll must not erase a newer ready-player list');
  assert.ok([...intervals.values()].some(t => t.ms === 30000), 'Readiness renewal must remain active');
  const poll = [...intervals.values()].find(t => t.ms === 2500);
  await React.act(async () => { poll.fn(); poll.fn(); });
  const first = polls.shift();
  const second = polls.shift();
  await React.act(async () => second(lobby(true, [{ profile_id: 'c', name: 'Charlie' }])));
  await React.act(async () => first(lobby(true)));
  assert.ok(document.body.textContent.includes('Charlie'), 'Overlapping polls must preserve the latest list');
  await React.act(async () => { poll.fn(); poll.fn(); });
  const slowFirst = polls.shift();
  const slowSecond = polls.shift();
  await React.act(async () => slowFirst(lobby(true, [{ profile_id: 'd', name: 'Daisy' }])));
  assert.ok(document.body.textContent.includes('Daisy'), 'Slow connections must still update while a newer poll is pending');
  await React.act(async () => slowSecond(lobby(true, [{ profile_id: 'b', name: 'Bob' }])));
  assert.ok(document.body.textContent.includes('Bob'));
  await React.act(async () => root.unmount());
  dom.window.close();
  console.log('Joey Challenge Hall polling regression passed');
})().catch(error => { console.error(error); process.exitCode = 1; dom.window.close(); });
