// A minimal stand-in for a Cloudflare D1 binding, backed by Node's built-in
// node:sqlite (no wrangler/Miniflare needed to test the accounts Worker).
// Only implements the subset of the D1 API worker.js actually calls:
// prepare(sql).bind(...args).run()/.first()/.all(), and env.DB.batch([...]),
// where every statement passed to batch() is expected to be run (worker.js
// never batches SELECTs).
import { DatabaseSync } from "node:sqlite";

function wrapStatement(db, sql, args) {
  return {
    async run() {
      const info = db.prepare(sql).run(...args);
      return { success: true, meta: { changes: Number(info.changes), last_row_id: info.lastInsertRowid } };
    },
    async first() {
      const row = db.prepare(sql).get(...args);
      return row === undefined ? null : row;
    },
    async all() {
      const rows = db.prepare(sql).all(...args);
      return { success: true, results: rows };
    },
  };
}

export function createTestD1(schemaSql) {
  const db = new DatabaseSync(":memory:");
  // schema.sql is an append-only migration log applied to one already-running
  // production D1 database, not a from-scratch schema — migration 6 drops a
  // column (report_token) that only ever existed on that live DB (added by the
  // now-retired migration 5, never present in the CREATE TABLE above it). A
  // fresh test database never had it, so skip that one statement.
  const fromScratchSql = schemaSql.replace(/ALTER TABLE accounts DROP COLUMN report_token;/, "");
  db.exec(fromScratchSql);
  return {
    prepare(sql) {
      const bound = wrapStatement(db, sql, []);
      bound.bind = (...args) => wrapStatement(db, sql, args);
      return bound;
    },
    async batch(statements) {
      const results = [];
      for (const statement of statements) results.push(await statement.run());
      return results;
    },
    _raw: db,
  };
}
