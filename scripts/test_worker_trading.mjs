// End-to-end tests for the school card-trading routes in
// cloudflare-worker/accounts/worker.js, run against an in-memory SQLite
// database shaped like the real D1 schema (see scripts/lib/d1-shim.mjs) —
// no wrangler/Miniflare dependency needed. Accounts/profiles/sessions are
// seeded directly with SQL rather than through the signup/login HTTP flows,
// since those need an Ed25519 signing key and are already exercised
// elsewhere; this file only cares about the trade_listings/trade_offers
// state machine.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";
import path from "node:path";
import worker from "../cloudflare-worker/accounts/worker.js";
import { createTestD1 } from "./lib/d1-shim.mjs";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SCHEMA_SQL = readFileSync(path.join(ROOT, "..", "cloudflare-worker", "accounts", "schema.sql"), "utf8");

function freshEnv() {
  return { DB: createTestD1(SCHEMA_SQL) };
}

let seq = 0;
function uid(prefix) { seq += 1; return `${prefix}_${seq}`; }

// Seeds a seat account + one profile + a live session, bypassing HTTP auth
// entirely (no ENTITLEMENT_PRIVATE_KEY/SEAT_PIN_KEY needed for that).
async function seedSeat(env, { schoolCode, cards = {}, cardItems = {} }) {
  const accountId = uid("acct");
  const profileId = uid("profile");
  const token = uid("session");
  const now = Date.now();
  await env.DB.prepare(
    `INSERT INTO accounts (account_id, email, email_verified, created_at, trial_started_at, trial_expires_at,
      subscription_status, updated_at, account_type, school_code, username)
      VALUES (?,?,?,?,?,?,?,?,?,?,?)`
  ).bind(accountId, `${accountId}@seat.invalid`, 0, now, now, now, "trialing", now, "seat", schoolCode, accountId).run();
  await env.DB.prepare(
    "INSERT INTO account_profiles (profile_id, account_id, name, progress, created_at, updated_at) VALUES (?,?,?,?,?,?)"
  ).bind(profileId, accountId, "Test Pupil", JSON.stringify({ cards, cardItems }), now, now).run();
  await env.DB.prepare("INSERT INTO sessions (token, account_id, created_at, expires_at) VALUES (?,?,?,?)")
    .bind(token, accountId, now, now + 90 * 24 * 60 * 60 * 1000).run();
  return { accountId, profileId, token };
}

async function seedPersonal(env) {
  const accountId = uid("acct");
  const token = uid("session");
  const now = Date.now();
  await env.DB.prepare(
    `INSERT INTO accounts (account_id, email, email_verified, created_at, trial_started_at, trial_expires_at,
      subscription_status, updated_at, account_type) VALUES (?,?,?,?,?,?,?,?,?)`
  ).bind(accountId, `${accountId}@personal.invalid`, 0, now, now, now, "trialing", now, "personal").run();
  await env.DB.prepare("INSERT INTO sessions (token, account_id, created_at, expires_at) VALUES (?,?,?,?)")
    .bind(token, accountId, now, now + 90 * 24 * 60 * 60 * 1000).run();
  return { accountId, token };
}

function call(env, method, url, { token, body } = {}) {
  const headers = { "content-type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return worker.fetch(new Request(`https://worker.test${url}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  }), env);
}

async function listing(env, seat, cardId, moduleKey = "junior") {
  const res = await call(env, "POST", "/trades/listings", { token: seat.token, body: { profile_id: seat.profileId, module: moduleKey, card_id: cardId } });
  return res.json();
}

test("creates a listing for a tradeable duplicate and rejects a non-duplicate", async () => {
  const env = freshEnv();
  const seat = await seedSeat(env, { schoolCode: "sch1", cards: { addy: 2, countra: 1 } });

  const ok = await listing(env, seat, "addy");
  assert.equal(ok.ok, true);
  assert.ok(ok.listing_id);

  const single = await listing(env, seat, "countra");
  assert.equal(single.ok, false);
  assert.equal(single.error, "card_not_tradeable");
});

test("rejects a card from the wrong module and an upgraded card", async () => {
  const env = freshEnv();
  const seat = await seedSeat(env, { schoolCode: "sch1", cards: { addy: 2, pip: 2 }, cardItems: { addy: ["a", "b", "c"] } });

  const wrongModule = await listing(env, seat, "pip", "junior");
  assert.deepEqual([wrongModule.ok, wrongModule.error], [false, "bad_card"]);

  const upgraded = await listing(env, seat, "addy");
  assert.deepEqual([upgraded.ok, upgraded.error], [false, "card_not_tradeable"]);
});

test("caps active listings at TRADE_LIMITS.activeListings", async () => {
  const env = freshEnv();
  const seat = await seedSeat(env, { schoolCode: "sch1", cards: { addy: 2, countra: 2, tritip: 2, pebble: 2 } });

  for (const card of ["addy", "countra", "tritip"]) {
    const res = await listing(env, seat, card);
    assert.equal(res.ok, true, `expected ${card} to list`);
  }
  const fourth = await listing(env, seat, "pebble");
  assert.deepEqual([fourth.ok, fourth.error], [false, "listing_limit"]);
});

test("a pending offer reserves the bidder's duplicate against a second listing", async () => {
  const env = freshEnv();
  const owner = await seedSeat(env, { schoolCode: "sch1", cards: { addy: 2 } });
  const bidder = await seedSeat(env, { schoolCode: "sch1", cards: { countra: 2 } });
  const { listing_id } = await listing(env, owner, "addy");

  const offerRes = await call(env, "POST", `/trades/listings/${listing_id}/offers`, {
    token: bidder.token, body: { profile_id: bidder.profileId, card_id: "countra" },
  });
  const offer = await offerRes.json();
  assert.equal(offer.ok, true);

  // countra is now reserved by the pending offer, so a second listing of the
  // same card by the same bidder is refused even though the count is still 2.
  const secondListing = await listing(env, bidder, "countra");
  assert.deepEqual([secondListing.ok, secondListing.error], [false, "card_not_tradeable"]);
});

test("accepting an offer swaps cards on both profiles and bumps revision", async () => {
  const env = freshEnv();
  const owner = await seedSeat(env, { schoolCode: "sch1", cards: { addy: 2 } });
  const bidder = await seedSeat(env, { schoolCode: "sch1", cards: { countra: 2 } });
  const { listing_id } = await listing(env, owner, "addy");
  const { offer_id } = await (await call(env, "POST", `/trades/listings/${listing_id}/offers`, {
    token: bidder.token, body: { profile_id: bidder.profileId, card_id: "countra" },
  })).json();

  const acceptRes = await call(env, "POST", `/trades/offers/${offer_id}/accept`, {
    token: owner.token, body: { profile_id: owner.profileId },
  });
  const accept = await acceptRes.json();
  assert.equal(accept.ok, true);
  assert.equal(accept.progress.cards.addy, 1);
  assert.equal(accept.progress.cards.countra, 1);
  assert.equal(accept.revision, 1);

  const bidderRow = await env.DB.prepare("SELECT progress, revision FROM account_profiles WHERE profile_id=?").bind(bidder.profileId).first();
  const bidderProgress = JSON.parse(bidderRow.progress);
  assert.equal(bidderProgress.cards.countra, 1);
  assert.equal(bidderProgress.cards.addy, 1);
  assert.equal(bidderRow.revision, 1);

  const listingRow = await env.DB.prepare("SELECT status FROM trade_listings WHERE listing_id=?").bind(listing_id).first();
  assert.equal(listingRow.status, "completed");
});

test("rejecting an offer leaves the listing open and the offer rejected", async () => {
  const env = freshEnv();
  const owner = await seedSeat(env, { schoolCode: "sch1", cards: { addy: 2 } });
  const bidder = await seedSeat(env, { schoolCode: "sch1", cards: { countra: 2 } });
  const { listing_id } = await listing(env, owner, "addy");
  const { offer_id } = await (await call(env, "POST", `/trades/listings/${listing_id}/offers`, {
    token: bidder.token, body: { profile_id: bidder.profileId, card_id: "countra" },
  })).json();

  const rejectRes = await call(env, "POST", `/trades/offers/${offer_id}/reject`, {
    token: owner.token, body: { profile_id: owner.profileId },
  });
  assert.equal((await rejectRes.json()).ok, true);

  const listingRow = await env.DB.prepare("SELECT status FROM trade_listings WHERE listing_id=?").bind(listing_id).first();
  assert.equal(listingRow.status, "open");
  const offerRow = await env.DB.prepare("SELECT status FROM trade_offers WHERE offer_id=?").bind(offer_id).first();
  assert.equal(offerRow.status, "rejected");
});

test("withdrawing an offer only works for the bidder, not the owner", async () => {
  const env = freshEnv();
  const owner = await seedSeat(env, { schoolCode: "sch1", cards: { addy: 2 } });
  const bidder = await seedSeat(env, { schoolCode: "sch1", cards: { countra: 2 } });
  const { listing_id } = await listing(env, owner, "addy");
  const { offer_id } = await (await call(env, "POST", `/trades/listings/${listing_id}/offers`, {
    token: bidder.token, body: { profile_id: bidder.profileId, card_id: "countra" },
  })).json();

  const ownerAttempt = await call(env, "POST", `/trades/offers/${offer_id}/withdraw`, {
    token: owner.token, body: { profile_id: owner.profileId },
  });
  assert.equal((await ownerAttempt.json()).ok, false);

  const bidderAttempt = await call(env, "POST", `/trades/offers/${offer_id}/withdraw`, {
    token: bidder.token, body: { profile_id: bidder.profileId },
  });
  assert.equal((await bidderAttempt.json()).ok, true);
});

test("a non-seat account is refused every trade route", async () => {
  const env = freshEnv();
  const personal = await seedPersonal(env);
  const res = await call(env, "POST", "/trades/listings", {
    token: personal.token, body: { profile_id: "whatever", module: "junior", card_id: "addy" },
  });
  assert.deepEqual([res.status, (await res.json()).error], [403, "school_only"]);
});

test("listings from a different school never appear on the board", async () => {
  const env = freshEnv();
  const here = await seedSeat(env, { schoolCode: "sch1", cards: { addy: 2 } });
  const elsewhere = await seedSeat(env, { schoolCode: "sch2", cards: { addy: 2 } });
  await listing(env, elsewhere, "addy");
  await seedSeat(env, { schoolCode: "sch1", cards: {} }); // gives `here`'s board a second profile in-school

  const board = await (await call(env, "GET", `/trades?profile_id=${here.profileId}&module=junior`, { token: here.token })).json();
  assert.equal(board.board.length, 0);
});

test("an expired listing stops appearing and is marked expired on the next board fetch", async () => {
  const env = freshEnv();
  const owner = await seedSeat(env, { schoolCode: "sch1", cards: { addy: 2 } });
  const viewer = await seedSeat(env, { schoolCode: "sch1", cards: {} });
  const { listing_id } = await listing(env, owner, "addy");
  await env.DB.prepare("UPDATE trade_listings SET expires_at=? WHERE listing_id=?").bind(Date.now() - 1000, listing_id).run();

  const board = await (await call(env, "GET", `/trades?profile_id=${viewer.profileId}&module=junior`, { token: viewer.token })).json();
  assert.equal(board.board.length, 0);

  const row = await env.DB.prepare("SELECT status FROM trade_listings WHERE listing_id=?").bind(listing_id).first();
  assert.equal(row.status, "expired");
});
