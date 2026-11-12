import {
  DECK_SIZE,
  MAX_COPIES,
  PLAYER_BV_LIMIT,
  TYPE,
  initBattle,
  mulligan,
  playCard,
  playIngenuityToken,
  passTurn,
  activateArithmeticMastery,
  activateGeometryMastery,
  resolveAbility,
  cancelAbility,
} from './joey-battle.js';

export const JOEY_TURN_MS = 30_000;
export const JOEY_MULLIGAN_MS = 30_000;
export const JOEY_PROCESSED_ACTION_LIMIT = 128;

const INTERNAL_SIDE = { side_a: 'player', side_b: 'ai' };
const EXTERNAL_SIDE = { player: 'side_a', ai: 'side_b' };

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function otherInternal(who) {
  return who === 'player' ? 'ai' : 'player';
}

function swapWho(who) {
  return who === 'player' ? 'ai' : who === 'ai' ? 'player' : who;
}

function finiteTimestamp(value, fallback) {
  return Number.isFinite(value) ? value : fallback;
}

function publicIdentity(side) {
  return {
    profileId: side.profileId,
    name: side.name,
    avatar: side.avatar || null,
  };
}

function validateIdentity(side, label) {
  if (!side || typeof side !== 'object') throw new Error(`${label}_identity_missing`);
  if (!String(side.accountId || '').trim()) throw new Error(`${label}_account_missing`);
  if (!String(side.profileId || '').trim()) throw new Error(`${label}_profile_missing`);
  if (!String(side.name || '').trim()) throw new Error(`${label}_name_missing`);
}

export function validateMultiplayerDeck(deck) {
  if (!Array.isArray(deck) || deck.length !== DECK_SIZE) return { ok: false, error: 'invalid_deck_size' };
  const counts = new Map();
  let totalBV = 0;
  for (const card of deck) {
    if (!card || typeof card.id !== 'string' || !card.id) return { ok: false, error: 'invalid_card' };
    if (!Array.isArray(card.s) || card.s.length !== 5 || card.s.some(n => !Number.isFinite(n) || n < 0)) {
      return { ok: false, error: 'invalid_card_stats' };
    }
    if (!Number.isFinite(card.bv) || card.bv < 0) return { ok: false, error: 'invalid_card_bv' };
    if (!Number.isInteger(card.primaryType) || card.primaryType < -1 || card.primaryType > TYPE.SPEED) {
      return { ok: false, error: 'invalid_primary_type' };
    }
    counts.set(card.id, (counts.get(card.id) || 0) + 1);
    if (counts.get(card.id) > MAX_COPIES) return { ok: false, error: 'too_many_copies' };
    totalBV += card.bv;
  }
  if (totalBV > PLAYER_BV_LIMIT) return { ok: false, error: 'deck_bv_exceeded' };
  return { ok: true, totalBV };
}

export function createMultiplayerMatch({
  matchId,
  moduleKey,
  groupKey,
  sideA,
  sideB,
  sideADeck,
  sideBDeck,
  now = Date.now(),
  random = Math.random,
} = {}) {
  validateIdentity(sideA, 'side_a');
  validateIdentity(sideB, 'side_b');
  if (sideA.profileId === sideB.profileId) throw new Error('same_profile');
  const deckAResult = validateMultiplayerDeck(sideADeck);
  if (!deckAResult.ok) throw new Error(`side_a_${deckAResult.error}`);
  const deckBResult = validateMultiplayerDeck(sideBDeck);
  if (!deckBResult.ok) throw new Error(`side_b_${deckBResult.error}`);
  const startedAt = finiteTimestamp(now, Date.now());
  const battleState = initBattle(clone(sideADeck), clone(sideBDeck), { random });
  battleState._battleType = 'multiplayer';
  battleState._targetCardId = null;
  return {
    matchId: String(matchId || ''),
    moduleKey: String(moduleKey || ''),
    groupKey: String(groupKey || ''),
    status: 'active',
    phase: 'mulligan',
    revision: 0,
    sideA: clone(sideA),
    sideB: clone(sideB),
    battleState,
    mulligan: {
      side_a: { confirmed: false, deadlineAt: startedAt + JOEY_MULLIGAN_MS },
      side_b: { confirmed: false, deadlineAt: startedAt + JOEY_MULLIGAN_MS },
    },
    processedActions: {},
    turnStartedAt: null,
    turnDeadlineAt: null,
    createdAt: startedAt,
    updatedAt: startedAt,
    completedAt: null,
    winnerSide: null,
    completionReason: null,
  };
}

function sideForProfile(match, profileId) {
  if (match.sideA.profileId === profileId) return 'side_a';
  if (match.sideB.profileId === profileId) return 'side_b';
  return null;
}

function beginGameplay(match, now) {
  match.phase = 'gameplay';
  match.turnStartedAt = now;
  match.turnDeadlineAt = now + JOEY_TURN_MS;
}

function completeFromBattle(match, now, reason = 'normal') {
  if (!match.battleState.battleFinished) return;
  match.status = 'completed';
  match.phase = 'completed';
  match.completedAt = now;
  match.turnStartedAt = null;
  match.turnDeadlineAt = null;
  match.completionReason = reason;
  match.winnerSide = match.battleState.winner === 'draw'
    ? 'draw'
    : EXTERNAL_SIDE[match.battleState.winner] || null;
}

function recordRevision(match, now) {
  match.revision += 1;
  match.updatedAt = now;
}

function recordAction(match, key, now) {
  match.processedActions[key] = { revision: match.revision, processedAt: now };
  const entries = Object.entries(match.processedActions);
  if (entries.length > JOEY_PROCESSED_ACTION_LIMIT) {
    match.processedActions = Object.fromEntries(entries.slice(entries.length - JOEY_PROCESSED_ACTION_LIMIT));
  }
}

function response(ok, match, extra = {}) {
  return { ok, match, ...extra };
}

function validateMulliganIndices(indices, handLength) {
  if (!Array.isArray(indices) || indices.length > 2) return false;
  if (indices.some(i => !Number.isInteger(i) || i < 0 || i >= handLength)) return false;
  return new Set(indices).size === indices.length;
}

function resolveMulliganAction(match, sideId, action, now) {
  if (action.type !== 'submit_mulligan') return response(false, match, { error: 'mulligan_required' });
  if (match.mulligan[sideId].confirmed) return response(false, match, { error: 'mulligan_already_confirmed' });
  const who = INTERNAL_SIDE[sideId];
  const indices = action.hand_indices || [];
  if (!validateMulliganIndices(indices, match.battleState[who].hand.length)) {
    return response(false, match, { error: 'invalid_mulligan' });
  }
  let battleState = match.battleState;
  for (const handIdx of [...indices].sort((a, b) => b - a)) battleState = mulligan(battleState, handIdx, who);
  match.battleState = battleState;
  match.mulligan[sideId].confirmed = true;
  if (match.mulligan.side_a.confirmed && match.mulligan.side_b.confirmed) beginGameplay(match, now);
  return response(true, match);
}

function validateAbilityChoice(state, choice) {
  const pending = state.pendingAbility;
  if (!pending || !choice || typeof choice !== 'object') return false;
  if (pending.type === 'arithmeticAffinity') return ['leave', 'bottom'].includes(choice.action);
  if (pending.type === 'arithmeticMastery') return ['keep', 'discard'].includes(choice.action);
  if (pending.type === 'geometryAffinity') return pending.adjacentLanes.includes(choice.lane);
  if (pending.type === 'ninefoldOrchard2') {
    return Array.isArray(choice.lanes) && choice.lanes.length <= 2 &&
      new Set(choice.lanes).size === choice.lanes.length && choice.lanes.every(lane => pending.availableLanes.includes(lane));
  }
  if (pending.type === 'ninefoldOrchard3') {
    const selected = pending.playedCards.find(card => card.cardId === choice.cardId);
    if (!selected || !Number.isInteger(choice.adjLane)) return false;
    const slot = state.activeLanes.indexOf(selected.currentLane);
    return state.activeLanes.some((lane, index) => lane === choice.adjLane && Math.abs(index - slot) === 1);
  }
  if (pending.type === 'littleReckoning2' || pending.type === 'reckoning') {
    return pending.eligibleCards.some(card => card.cardId === choice.cardId);
  }
  if (pending.type === 'gifford2') {
    const selected = pending.playedCards.find(card => card.cardId === choice.cardId);
    return !!selected && state.activeLanes.includes(choice.destLane) && choice.destLane !== selected.currentLane;
  }
  if (pending.type === 'giffordOverride') {
    const hasOpponentMove = choice.oppCardId !== undefined || choice.oppDestLane !== undefined;
    const hasOwnMove = choice.ownCardId !== undefined || choice.ownDestLane !== undefined;
    if (!hasOpponentMove && !hasOwnMove) return false;
    if (hasOpponentMove) {
      const selected = pending.oppCards.find(card => card.cardId === choice.oppCardId);
      if (!selected || !selected.adjacentLanes.includes(choice.oppDestLane)) return false;
    }
    if (hasOwnMove) {
      const selected = pending.ownCards.find(card => card.cardId === choice.ownCardId);
      if (!selected || !state.activeLanes.includes(choice.ownDestLane) || choice.ownDestLane === selected.currentLane) return false;
    }
    return true;
  }
  return false;
}

function applyGameplayAction(match, sideId, action, now) {
  const who = INTERNAL_SIDE[sideId];
  const state = match.battleState;
  if (state.currentTurn !== who) return response(false, match, { error: 'not_your_turn' });
  const ownsPendingAbility = state.pendingAbility?.who === who;
  if (state.pendingAbility && !ownsPendingAbility) return response(false, match, { error: 'opponent_resolving_ability' });

  let next = state;
  let completesTurn = false;
  if (action.type === 'play_card') {
    if (state.pendingAbility) return response(false, match, { error: 'ability_choice_required' });
    next = playCard(state, who, action.hand_index, action.lane, {
      interactive: true,
      useScienceAffinity: action.use_science_affinity === true,
      useScienceMastery: action.use_science_mastery === true,
    });
    completesTurn = !next.pendingAbility;
  } else if (action.type === 'play_ingenuity') {
    if (state.pendingAbility) return response(false, match, { error: 'ability_choice_required' });
    next = playIngenuityToken(state, who, action.lane);
    completesTurn = true;
  } else if (action.type === 'pass') {
    if (state.pendingAbility) return response(false, match, { error: 'ability_choice_required' });
    next = passTurn(state, who);
    completesTurn = true;
  } else if (action.type === 'activate_power') {
    if (state.pendingAbility) return response(false, match, { error: 'ability_choice_required' });
    if (action.power === 'arithmetic_mastery') next = activateArithmeticMastery(state, who);
    else if (action.power === 'geometry_mastery') next = activateGeometryMastery(state, who, action.card_id);
    else return response(false, match, { error: 'invalid_power' });
  } else if (action.type === 'resolve_ability') {
    if (!ownsPendingAbility) return response(false, match, { error: 'no_owned_pending_ability' });
    if (!validateAbilityChoice(state, action.choice)) return response(false, match, { error: 'invalid_ability_choice' });
    next = resolveAbility(state, action.choice);
    completesTurn = true;
  } else if (action.type === 'cancel_ability') {
    if (!ownsPendingAbility || !state.pendingAbility.canCancel) return response(false, match, { error: 'ability_cannot_cancel' });
    next = cancelAbility(state);
  } else {
    return response(false, match, { error: 'invalid_action' });
  }

  if (next === state) return response(false, match, { error: 'illegal_action' });
  match.battleState = next;
  completeFromBattle(match, now);
  if (match.status === 'active' && completesTurn) {
    match.turnStartedAt = now;
    match.turnDeadlineAt = now + JOEY_TURN_MS;
  }
  return response(true, match);
}

export function advanceMultiplayerTimeouts(matchInput, now = Date.now()) {
  const match = clone(matchInput);
  const at = finiteTimestamp(now, Date.now());
  let changed = false;
  if (match.status !== 'active') return response(true, match, { changed });

  if (match.phase === 'mulligan') {
    for (const sideId of ['side_a', 'side_b']) {
      const side = match.mulligan[sideId];
      if (!side.confirmed && at >= side.deadlineAt) {
        side.confirmed = true;
        changed = true;
      }
    }
    if (match.mulligan.side_a.confirmed && match.mulligan.side_b.confirmed) beginGameplay(match, at);
  } else if (match.phase === 'gameplay' && Number.isFinite(match.turnDeadlineAt) && at >= match.turnDeadlineAt) {
    const who = match.battleState.currentTurn;
    if (match.battleState.pendingAbility?.who === who) {
      const pending = match.battleState.pendingAbility;
      const safeChoice = pending.type === 'arithmeticAffinity'
        ? { action: 'leave' }
        : pending.type === 'arithmeticMastery' ? { action: 'keep' } : {};
      match.battleState = resolveAbility(match.battleState, safeChoice);
    } else {
      match.battleState = passTurn(match.battleState, who);
    }
    changed = true;
    completeFromBattle(match, at, 'normal');
    if (match.status === 'active') {
      match.turnStartedAt = at;
      match.turnDeadlineAt = at + JOEY_TURN_MS;
    }
  }

  if (changed) recordRevision(match, at);
  return response(true, match, { changed });
}

export function applyMultiplayerAction(matchInput, {
  profileId,
  expectedRevision,
  actionId,
  action,
  now = Date.now(),
} = {}) {
  const at = finiteTimestamp(now, Date.now());
  const timed = advanceMultiplayerTimeouts(matchInput, at);
  let match = timed.match;
  const sideId = sideForProfile(match, profileId);
  if (!sideId) return response(false, match, { error: 'forbidden' });
  if (!String(actionId || '').trim()) return response(false, match, { error: 'action_id_required' });
  const actionKey = `${profileId}:${actionId}`;
  if (match.processedActions[actionKey]) {
    return response(true, match, { duplicate: true, processedRevision: match.processedActions[actionKey].revision });
  }
  if (timed.changed) return response(false, match, { error: 'deadline_expired' });
  if (expectedRevision !== match.revision) return response(false, match, { error: 'revision_conflict' });
  if (match.status !== 'active') return response(false, match, { error: 'match_finished' });
  if (!action || typeof action !== 'object') return response(false, match, { error: 'invalid_action' });

  const working = clone(match);
  const result = working.phase === 'mulligan'
    ? resolveMulliganAction(working, sideId, action, at)
    : working.phase === 'gameplay'
      ? applyGameplayAction(working, sideId, action, at)
      : response(false, working, { error: 'invalid_match_phase' });
  if (!result.ok) return result;
  match = result.match;
  recordRevision(match, at);
  recordAction(match, actionKey, at);
  return response(true, match);
}

export function concedeMultiplayerMatch(matchInput, profileId, now = Date.now()) {
  const match = clone(matchInput);
  const sideId = sideForProfile(match, profileId);
  if (!sideId) return response(false, match, { error: 'forbidden' });
  if (match.status !== 'active') return response(false, match, { error: 'match_finished' });
  const at = finiteTimestamp(now, Date.now());
  match.status = 'completed';
  match.phase = 'completed';
  match.completedAt = at;
  match.updatedAt = at;
  match.turnStartedAt = null;
  match.turnDeadlineAt = null;
  match.completionReason = 'concession';
  match.winnerSide = sideId === 'side_a' ? 'side_b' : 'side_a';
  match.battleState.battleFinished = true;
  match.battleState.winner = INTERNAL_SIDE[match.winnerSide];
  recordRevision(match, at);
  return response(true, match);
}

function orientBattleState(state, viewerWho, revealedCardId) {
  const view = clone(state);
  if (viewerWho === 'ai') {
    [view.player, view.ai] = [view.ai, view.player];
    [view.playerRoundsWon, view.aiRoundsWon] = [view.aiRoundsWon, view.playerRoundsWon];
    view.firstToMove = swapWho(view.firstToMove);
    view.currentTurn = swapWho(view.currentTurn);
    view.winner = swapWho(view.winner);
    view.boardCards = view.boardCards.map(card => ({ ...card, owner: swapWho(card.owner) }));
    if (view.lastPlay) view.lastPlay.who = swapWho(view.lastPlay.who);
    if (view.pendingAbility) view.pendingAbility.who = swapWho(view.pendingAbility.who);
    if (view._lastRound) {
      [view._lastRound.playerScores, view._lastRound.aiScores] = [view._lastRound.aiScores, view._lastRound.playerScores];
      view._lastRound.boardCards = view._lastRound.boardCards.map(card => ({ ...card, owner: swapWho(card.owner) }));
    }
  }

  delete view.player.deck;
  delete view.ai.deck;
  view.player.reserveDeck = view.player.reserveDeck.map(() => ({ hidden: true }));
  view.ai.reserveDeck = view.ai.reserveDeck.map(() => ({ hidden: true }));
  let revealed = false;
  view.ai.hand = view.ai.hand.map(card => {
    if (!revealed && revealedCardId && card.id === revealedCardId) {
      revealed = true;
      return card;
    }
    return { hidden: true };
  });
  view.logicRevealedCardId = revealed ? revealedCardId : null;
  delete view.logicRevealedCardIds;
  view.laneSchedule = view.laneSchedule.map((lanes, index) => index < view.roundNumber ? lanes : null);
  if (view.pendingAbility?.who === 'ai') view.pendingAbility = { type: 'opponentChoice', who: 'ai' };
  delete view._aiTargetRarity;
  delete view._battleType;
  delete view._targetCardId;
  return view;
}

export function getMultiplayerPlayerView(match, profileId, now = Date.now()) {
  const sideId = sideForProfile(match, profileId);
  if (!sideId) return null;
  const viewerWho = INTERNAL_SIDE[sideId];
  const revealedCardId = match.battleState.logicRevealedCardIds?.[viewerWho]
    || (viewerWho === 'player' ? match.battleState.logicRevealedCardId : null);
  const self = sideId === 'side_a' ? match.sideA : match.sideB;
  const opponent = sideId === 'side_a' ? match.sideB : match.sideA;
  const winner = match.winnerSide === 'draw'
    ? 'draw'
    : match.winnerSide === sideId ? 'player' : match.winnerSide ? 'ai' : null;
  return {
    matchId: match.matchId,
    moduleKey: match.moduleKey,
    status: match.status,
    phase: match.phase,
    revision: match.revision,
    self: { ...publicIdentity(self), sideId },
    opponent: { ...publicIdentity(opponent), sideId: sideId === 'side_a' ? 'side_b' : 'side_a' },
    mulligan: match.mulligan ? {
      confirmed: match.mulligan[sideId].confirmed,
      opponentConfirmed: match.mulligan[sideId === 'side_a' ? 'side_b' : 'side_a'].confirmed,
      deadlineAt: match.mulligan[sideId].deadlineAt,
    } : null,
    battleState: orientBattleState(match.battleState, viewerWho, revealedCardId),
    turnStartedAt: match.turnStartedAt,
    turnDeadlineAt: match.turnDeadlineAt,
    serverTime: finiteTimestamp(now, Date.now()),
    winner,
    completionReason: match.completionReason,
  };
}
