const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {spawnSync} = require('node:child_process');
const workspace = path.resolve(__dirname, '../..');

test('messages survive reading, only recipient acknowledges, claims exclude competitors and paths stay local', () => {
  const base = path.join(workspace, '.cache', 'orchard-mailbox-tests');
  fs.mkdirSync(base, {recursive: true});
  const root = fs.mkdtempSync(path.join(base, 'run-'));
  const run = (...args) => spawnSync(process.execPath, [path.join(__dirname, 'orchard-agent-mailbox.cjs'), ...args, '--root', root], {encoding: 'utf8'});
  const parse = result => {assert.equal(result.status, 0, result.stderr); return JSON.parse(result.stdout);};
  try {
    const sent = parse(run('send', 'codex', 'claude', '--text', 'Interface ready', '--subject', 'C-05'));
    assert.equal(parse(run('read', 'claude')).messages[0].body, 'Interface ready');
    assert.equal(parse(run('read', 'claude')).messages.length, 1);
    assert.equal(parse(run('read', 'codex')).messages.length, 0);
    assert.equal(run('ack', 'codex', sent.sent).status, 1);
    parse(run('ack', 'claude', sent.sent));
    parse(run('ack', 'claude', sent.sent));
    assert.equal(parse(run('read', 'claude')).messages.length, 0);
    parse(run('claim', 'claude', 'final-build'));
    assert.equal(run('claim', 'codex', 'final-build').status, 2);
    assert.equal(run('release', 'codex', 'final-build').status, 1);
    parse(run('release', 'claude', 'final-build'));
    parse(run('claim', 'codex', 'final-build'));
    assert.equal(run('claim', 'codex', '../outside').status, 1);
    assert.equal(parse(run('watch', 'claude', '--seconds', '0')).messages.length, 0);
    assert.equal(parse(run('status')).locks.length, 1);
    const outside = spawnSync(process.execPath, [path.join(__dirname, 'orchard-agent-mailbox.cjs'), 'status', '--root', path.dirname(workspace)], {encoding: 'utf8'});
    assert.equal(outside.status, 1);
  } finally {
    assert(root.startsWith(base + path.sep));
    fs.rmSync(root, {recursive: true, force: true});
  }
});
