import assert from 'node:assert/strict';
import {
  TYPE,
  playCard,
} from './joey-battle.js';
import {
  JOEY_MULLIGAN_MS,
  JOEY_TURN_MS,
  createMultiplayerMatch,
  validateMultiplayerDeck,
  applyMultiplayerAction,
  advanceMultiplayerTimeouts,
  concedeMultiplayerMatch,
  getMultiplayerPlayerView,
} from './joey-multiplayer.js';

function deck(prefix, { logicAffinity = false } = {}) {
  return Array.from({ length: 15 }, (_, index) => ({
    id: `${prefix}_${index}`,
    name: `${prefix} card ${index}`,
    r: 'common',
    bv: 10,
    s: [index % 4 + 1, 2, 3, 2, 1],
    primaryType: logicAffinity && index < 3 ? 2 : index % 2,
    set: null,
  }));
}

function create(now = 1_000) {
  return createMultiplayerMatch({
    matchId: 'match-1',
    moduleKey: 'primary',
    groupKey: 'family:account-a',
    sideA: { accountId: 'account-a', profileId: 'profile-a', name: 'Amber Wren' },
    sideB: { accountId: 'account-a', profileId: 'profile-b', name: 'Silver Fox' },
    sideADeck: deck('a', { logicAffinity: true }),
    sideBDeck: deck('b'),
    now,
    random: () => 0.25,
  });
}

function act(match, profileId, actionId, action, now) {
  return applyMultiplayerAction(match, {
    profileId,
    expectedRevision: match.revision,
    actionId,
    action,
    now,
  });
}

function finishMulligans(match, now = 2_000) {
  let result = act(match, 'profile-a', 'mulligan-a', { type: 'submit_mulligan', hand_indices: [0, 1] }, now);
  assert.equal(result.ok, true);
  result = act(result.match, 'profile-b', 'mulligan-b', { type: 'submit_mulligan', hand_indices: [] }, now + 1);
  assert.equal(result.ok, true);
  assert.equal(result.match.phase, 'gameplay');
  return result.match;
}

function activeProfile(match) {
  return match.battleState.currentTurn === 'player' ? 'profile-a' : 'profile-b';
}

function waitingProfile(match) {
  return activeProfile(match) === 'profile-a' ? 'profile-b' : 'profile-a';
}

{
  console.log('test: deck validation');
  const valid = validateMultiplayerDeck(deck('valid'));
  assert.equal(valid.ok, true);
  assert.equal(valid.totalBV, 150);
  assert.equal(validateMultiplayerDeck(deck('short').slice(0, 14)).error, 'invalid_deck_size');
  const duplicates = Array.from({ length: 15 }, (_, index) => ({ ...deck('dup')[index], id: index < 3 ? 'same' : `other_${index}` }));
  assert.equal(validateMultiplayerDeck(duplicates).error, 'too_many_copies');
}

{
  console.log('test: match creation');
  const match = create();
  assert.equal(match.phase, 'mulligan');
  assert.equal(match.mulligan.side_a.deadlineAt, 1_000 + JOEY_MULLIGAN_MS);
  assert.throws(() => createMultiplayerMatch({
    matchId: 'bad', moduleKey: 'primary', groupKey: 'family:x',
    sideA: { accountId: 'x', profileId: 'same', name: 'One' },
    sideB: { accountId: 'x', profileId: 'same', name: 'Two' },
    sideADeck: deck('x'), sideBDeck: deck('y'),
  }), /same_profile/);
}

{
  console.log('test: redacted views');
  const match = create();
  const viewA = getMultiplayerPlayerView(match, 'profile-a', 1_100);
  const viewB = getMultiplayerPlayerView(match, 'profile-b', 1_100);
  assert.equal(viewA.self.profileId, 'profile-a');
  assert.equal(viewB.self.profileId, 'profile-b');
  assert.equal(viewA.battleState.player.hand.every(card => !card.hidden), true);
  assert.equal(viewA.battleState.ai.hand.filter(card => !card.hidden).length, 1);
  assert.equal(viewB.battleState.ai.hand.every(card => card.hidden), true);
  assert.equal('deck' in viewA.battleState.player, false);
  assert.equal('deck' in viewA.battleState.ai, false);
  assert.equal(viewA.battleState.player.reserveDeck.every(card => card.hidden), true);
  assert.equal(viewA.battleState.laneSchedule[0].length, 3);
  assert.equal(viewA.battleState.laneSchedule.slice(1).every(round => round === null), true);
  assert.equal(JSON.stringify(viewA).includes('account-a'), false);
  assert.equal(getMultiplayerPlayerView(match, 'stranger'), null);
}

{
  console.log('test: mulligan and idempotency');
  let match = create();
  const first = act(match, 'profile-a', 'm-a', { type: 'submit_mulligan', hand_indices: [0, 1] }, 2_000);
  assert.equal(first.ok, true);
  assert.equal(first.match.revision, 1);
  assert.equal(first.match.mulligan.side_a.confirmed, true);
  const repeated = applyMultiplayerAction(first.match, {
    profileId: 'profile-a', expectedRevision: 0, actionId: 'm-a',
    action: { type: 'submit_mulligan', hand_indices: [0, 1] }, now: 2_001,
  });
  assert.equal(repeated.ok, true);
  assert.equal(repeated.duplicate, true);
  assert.equal(repeated.match.revision, 1);
  const second = act(repeated.match, 'profile-b', 'm-b', { type: 'submit_mulligan', hand_indices: [] }, 2_002);
  match = second.match;
  assert.equal(match.phase, 'gameplay');
  assert.equal(match.revision, 2);
  assert.equal(match.turnDeadlineAt, 2_002 + JOEY_TURN_MS);
}

{
  console.log('test: mulligan timeout');
  const timed = advanceMultiplayerTimeouts(create(), 1_000 + JOEY_MULLIGAN_MS);
  assert.equal(timed.changed, true);
  assert.equal(timed.match.phase, 'gameplay');
  assert.equal(timed.match.mulligan.side_a.confirmed, true);
  assert.equal(timed.match.mulligan.side_b.confirmed, true);
}

{
  console.log('test: turn and revision rejection');
  let match = finishMulligans(create());
  const actor = activeProfile(match);
  const waiter = waitingProfile(match);
  const outOfTurn = act(match, waiter, 'wrong-turn', { type: 'pass' }, 2_100);
  assert.equal(outOfTurn.ok, false);
  assert.equal(outOfTurn.error, 'not_your_turn');
  const stale = applyMultiplayerAction(match, {
    profileId: actor, expectedRevision: match.revision - 1, actionId: 'stale', action: { type: 'pass' }, now: 2_100,
  });
  assert.equal(stale.ok, false);
  assert.equal(stale.error, 'revision_conflict');
}

{
  console.log('test: turn timeout and consecutive play');
  let match = finishMulligans(create());
  const timedOutProfile = activeProfile(match);
  const timedOutInternal = match.battleState.currentTurn;
  const timeout = advanceMultiplayerTimeouts(match, match.turnDeadlineAt);
  match = timeout.match;
  assert.equal(timeout.changed, true);
  assert.equal(match.battleState[timedOutInternal].hasPassed, true);
  assert.notEqual(activeProfile(match), timedOutProfile);
  const remaining = activeProfile(match);
  const lane = match.battleState.activeLanes[0];
  const beforeDeadline = match.turnDeadlineAt;
  const play = act(match, remaining, 'consecutive-play', { type: 'play_card', hand_index: 0, lane }, beforeDeadline - 5_000);
  assert.equal(play.ok, true);
  assert.equal(activeProfile(play.match), remaining);
  assert.equal(play.match.turnDeadlineAt, beforeDeadline - 5_000 + JOEY_TURN_MS);
}

{
  console.log('test: second-player interactive ability');
  let match = finishMulligans(create());
  match.battleState.currentTurn = 'ai';
  match.battleState.ai.typeBonuses.affinity = [TYPE.ARITHMETIC];
  match.battleState.ai.oncePerRound.arithmeticAffinity = false;
  const lane = match.battleState.activeLanes[0];
  const contribution = match.battleState.ai.hand[0].s[lane];
  match.battleState.ai.laneScores[lane] = 0;
  match.battleState.player.laneScores[lane] = contribution;
  match.turnStartedAt = 3_000;
  match.turnDeadlineAt = 3_000 + JOEY_TURN_MS;
  const play = act(match, 'profile-b', 'interactive-b', { type: 'play_card', hand_index: 0, lane }, 3_100);
  assert.equal(play.ok, true);
  assert.equal(play.match.battleState.pendingAbility?.who, 'ai');
  const viewA = getMultiplayerPlayerView(play.match, 'profile-a', 3_100);
  const viewB = getMultiplayerPlayerView(play.match, 'profile-b', 3_100);
  assert.deepEqual(viewA.battleState.pendingAbility, { type: 'opponentChoice', who: 'ai' });
  assert.equal(viewB.battleState.pendingAbility.type, 'arithmeticAffinity');
  const resolved = advanceMultiplayerTimeouts(play.match, play.match.turnDeadlineAt);
  assert.equal(resolved.match.battleState.pendingAbility, null);
  assert.equal(resolved.match.battleState.ai.hasPassed, false);
  assert.equal(resolved.match.battleState.currentTurn, 'player');
}

{
  console.log('test: solo AI ability defaults');
  const state = create().battleState;
  state.currentTurn = 'ai';
  state.ai.typeBonuses.affinity = [TYPE.ARITHMETIC];
  state.ai.oncePerRound.arithmeticAffinity = false;
  const lane = state.activeLanes[0];
  state.player.laneScores[lane] = state.ai.hand[0].s[lane];
  const played = playCard(state, 'ai', 0, lane);
  assert.equal(played.pendingAbility, null);
  assert.equal(played.currentTurn, 'player');
}

{
  console.log('test: late action');
  let match = finishMulligans(create());
  const actor = activeProfile(match);
  const late = applyMultiplayerAction(match, {
    profileId: actor,
    expectedRevision: match.revision,
    actionId: 'too-late',
    action: { type: 'pass' },
    now: match.turnDeadlineAt,
  });
  assert.equal(late.ok, false);
  assert.equal(late.error, 'deadline_expired');
  assert.equal(late.match.revision, match.revision + 1);
}

{
  console.log('test: concession');
  const match = finishMulligans(create());
  const conceded = concedeMultiplayerMatch(match, 'profile-a', 9_000);
  assert.equal(conceded.ok, true);
  assert.equal(conceded.match.status, 'completed');
  assert.equal(conceded.match.completionReason, 'concession');
  assert.equal(conceded.match.winnerSide, 'side_b');
  const winnerView = getMultiplayerPlayerView(conceded.match, 'profile-b', 9_000);
  assert.equal(winnerView.winner, 'player');
  assert.equal(winnerView.battleState.winner, 'player');
}

console.log('Joey multiplayer engine tests passed');
