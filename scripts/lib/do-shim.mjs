// A minimal stand-in for a Cloudflare Durable Object namespace binding, so
// joey-room.js (the JoeyMatchRoom class) can be exercised end-to-end —
// through the same env.JOEY_MATCH_ROOM.idFromName(...).get(...).fetch(...)
// calls worker.js/joey-lobby.js/joey-match.js make in production — with no
// wrangler/Miniflare dependency, same philosophy as d1-shim.mjs for D1.
//
// Only implements what those callers actually use: idFromName/get/fetch, plus
// a couple of test-only escape hatches (`_alarm`, `_now`) real code never
// touches. WebSocket hibernation (acceptWebSocket/getTags/getWebSockets) is
// stubbed just enough that joey-room.js's HTTP paths run untouched; the
// stubs record what would have happened so a test can assert on it, but they
// do not model a real WebSocket — see the delivery report for why the
// WebSocket transport itself still needs a real Miniflare/two-browser pass
// before deploy.
export function createTestDurableObjectNamespace(DOClass, env) {
  const rooms = new Map();

  function roomFor(name) {
    if (rooms.has(name)) return rooms.get(name);
    const data = new Map();
    const sent = []; // { profileId, message } — every ws.send() a stub socket "received"
    const sockets = new Map(); // profileId -> [{ send, close, readyState }]
    let alarmTime = null;
    const storage = {
      async get(key) { return data.has(key) ? data.get(key) : undefined; },
      async put(key, value) { data.set(key, value); },
      async delete(key) { data.delete(key); },
      async setAlarm(time) { alarmTime = time; },
      async deleteAlarm() { alarmTime = null; },
    };
    const state = {
      storage,
      acceptWebSocket(server, tags = []) {
        const profileId = tags[0];
        const list = sockets.get(profileId) || [];
        server._profileId = profileId;
        list.push(server);
        sockets.set(profileId, list);
      },
      getTags(ws) { return ws._profileId ? [ws._profileId] : []; },
      getWebSockets(tag) {
        if (tag) return sockets.get(tag) || [];
        return [...sockets.values()].flat();
      },
    };
    const instance = new DOClass(state, env);
    const room = { data, storage, sockets, sent, instance, get alarmTime() { return alarmTime; } };
    rooms.set(name, room);
    return room;
  }

  return {
    idFromName(name) { return String(name); },
    get(id) {
      const room = roomFor(id);
      return {
        fetch: (request) => room.instance.fetch(request),
        alarm: () => room.instance.alarm(),
        _room: room,
      };
    },
  };
}

// A fake WebSocket good enough to drive JoeyMatchRoom's hibernation-style
// handlers (webSocketMessage/webSocketClose) directly in a test, without a
// real network socket.
export function createTestSocket(profileId) {
  const received = [];
  return {
    _profileId: profileId,
    readyState: 1,
    send(message) { received.push(message); },
    close() { this.readyState = 3; },
    get messages() { return received.map((m) => JSON.parse(m)); },
  };
}
