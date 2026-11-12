const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const workspace = path.resolve(__dirname, '../..');
const args = process.argv.slice(2);
const command = args.shift();
const option = (name) => {
  const index = args.indexOf(`--${name}`);
  return index < 0 ? undefined : args[index + 1];
};
const root = path.resolve(option('root') || path.join(workspace, 'docs/expeditions/v2/coordination'));
if (!root.startsWith(workspace + path.sep)) throw new Error('Mailbox must stay inside this workspace');
const actors = new Set(['codex', 'claude', 'scrum']);
const actor = (name) => {
  if (!actors.has(name)) throw new Error('Actor must be codex, claude or scrum');
  return name;
};
const safeId = (value) => {
  if (!/^[a-zA-Z0-9][a-zA-Z0-9-]{0,95}$/.test(value || '')) throw new Error('Invalid ID');
  return value;
};
for (const dir of ['messages', 'acks', 'locks']) fs.mkdirSync(path.join(root, dir), {recursive: true});
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeNew = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2), {flag: 'wx'});
const print = (value) => console.log(JSON.stringify(value, null, 2));
const unread = (who) => fs.readdirSync(path.join(root, 'messages')).filter(name => name.endsWith('.json')).sort().map(name => read(path.join(root, 'messages', name))).filter(message => message.to === who && !fs.existsSync(path.join(root, 'acks', `${message.id}-${who}.json`)));

async function main() {
  if (command === 'send') {
    const from = actor(args[0]), to = actor(args[1]);
    let body = option('text');
    if (option('file')) {
      const file = path.resolve(workspace, option('file'));
      if (!file.startsWith(workspace + path.sep)) throw new Error('Message file must stay inside workspace');
      body = fs.readFileSync(file, 'utf8');
    }
    if (!body || body.length > 64000) throw new Error('Provide --text or --file, maximum64000 characters');
    const id = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
    const message = {id, from, to, createdAt: new Date().toISOString(), subject: option('subject') || 'Handoff', body};
    const temporary = path.join(root, 'messages', `${id}.tmp`);
    writeNew(temporary, message);
    fs.renameSync(temporary, path.join(root, 'messages', `${id}.json`));
    print({sent: id, to});
  } else if (command === 'read' || command === 'watch') {
    const who = actor(args[0]);
    const seconds = Number(option('seconds') || 30);
    if (!Number.isFinite(seconds) || seconds < 0 || seconds > 45) throw new Error('Watch duration must be0..45 seconds');
    const until = Date.now() + (command === 'watch' ? seconds * 1000 : 0);
    let messages;
    do {
      messages = unread(who);
      if (messages.length || Date.now() >= until) break;
      await new Promise(resolve => setTimeout(resolve, 1000));
    } while (true);
    print({actor: who, messages});
  } else if (command === 'ack') {
    const who = actor(args[0]), id = safeId(args[1]);
    const message = read(path.join(root, 'messages', `${id}.json`));
    if (message.to !== who) throw new Error('Only recipient can acknowledge');
    const file = path.join(root, 'acks', `${id}-${who}.json`);
    if (!fs.existsSync(file)) writeNew(file, {messageId: id, actor: who, acknowledgedAt: new Date().toISOString()});
    print({acknowledged: id});
  } else if (command === 'claim') {
    const who = actor(args[0]), resource = safeId(args[1]);
    const file = path.join(root, 'locks', `${resource}.json`);
    try {
      writeNew(file, {actor: who, resource, claimedAt: new Date().toISOString()});
      print({claimed: resource, actor: who});
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
      print({claimed: false, resource, existing: read(file)});
      process.exitCode = 2;
    }
  } else if (command === 'release') {
    const who = actor(args[0]), resource = safeId(args[1]);
    const file = path.join(root, 'locks', `${resource}.json`);
    if (read(file).actor !== who) throw new Error('Only lock owner can release; never steal a stale lock');
    fs.unlinkSync(file);
    print({released: resource});
  } else if (command === 'status') {
    print({pending: Object.fromEntries([...actors].map(who => [who, unread(who).length])), locks: fs.readdirSync(path.join(root, 'locks')).filter(name => name.endsWith('.json')).map(name => read(path.join(root, 'locks', name)))});
  } else {
    print({usage: ['send <from> <to> --subject title --text body|--file workspace-path', 'read <actor>', 'watch <actor> --seconds 30', 'ack <actor> <message-id>', 'claim <actor> <task-id|final-build>', 'release <actor> <resource>', 'status'], notice: 'Shared local messages and advisory locks only. Does not invoke a model or wake a stopped chat.'});
  }
}
main().catch(error => {console.error(error.message); process.exitCode = 1;});
