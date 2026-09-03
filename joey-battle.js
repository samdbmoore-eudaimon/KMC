// joey-battle.js
// Pure state-machine for the Maths Card Battle game (JOEY_SPEC.md).
// All exported functions take a state and return a new state object.
// pendingAbility is non-null when the player must make a choice before anything else can happen.

// ===== CONSTANTS =====

export const TYPE = { ARITHMETIC: 0, GEOMETRY: 1, LOGIC: 2, SCIENCE: 3, SPEED: 4 };
export const TYPE_NAMES = ['Arithmetic', 'Geometry', 'Logic', 'Science', 'Speed'];

// ADJACENT[lane] = list of adjacent lane indices
export const ADJACENT = [[1], [0, 2], [1, 3], [2, 4], [3]];

// MIRROR[lane] = mirrored lane index (-1 means no mirror)
// Arithmetic(0)↔Speed(4), Geometry(1)↔Science(3), Logic(2) has no mirror
export const MIRROR = [4, 3, -1, 1, 0];

export const DECK_SIZE = 15;
export const PLAYER_BV_LIMIT = 300;
export const MAX_COPIES = 2;
export const OPENING_HAND = 8;
export const DRAW_AFTER_ROUND = 3;
export const ROUNDS_TO_WIN = 2;
export const ACTIVE_LANES_PER_ROUND = 3;
export const INGENUITY_TOKEN_VALUE = 1;
export const PLACEHOLDER_BV = 8;
export const PLACEHOLDER_STATS_TOTAL = 8;

export const AI_BV = {
  common: 250, uncommon: 275, rare: 300, epic: 325, legendary: 375,
};

// AI play evaluation weights (§5 ai_play_evaluation_heuristic.md)
const W = {
  LANE_CONTROL_UNIT: 24,
  ROUND_WIN_GAIN: 40,
  ROUND_WIN_SECURITY: 12,
  EXACT_ONE_AHEAD: 8,
  EXACT_TIE: 3,
  OVERKILL_PER_POINT: -1.5,
  BV_SPEND_PER_POINT: -0.22,
  STAT_WASTE_PER_POINT: -0.50,
  TYPE_AFFINITY_USE: 7,
  TYPE_MASTERY_USE: 11,
  SET_FIRST_CARD: 1,
  SET_SECOND_CARD: 7,
  SET_THIRD_CARD: 12,
  SET_FOURTH_PLUS: 2,
  WEAK_LANE_SUPPORT: 4,
  STRONG_LANE_OVERCOMMIT: -3,
  WIN_AFTER_OPP_PASS: 30,
  OVERSPEND_AFTER_PASS: -0.40,
  MATCH_POINT_WIN: 25,
  MATCH_POINT_LOSS_AVOID: 20,
};

// ===== INTERNAL HELPERS =====

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function cloneState(s) {
  return JSON.parse(JSON.stringify(s));
}

function countControlled(aLanes, bLanes, activeLanes = [0, 1, 2, 3, 4]) {
  let n = 0;
  for (const i of activeLanes) if (aLanes[i] > bLanes[i]) n++;
  return n;
}

function generateLaneSchedule() {
  const combinations = [];
  for (let a = 0; a < 3; a++) for (let b = a + 1; b < 4; b++) for (let c = b + 1; c < 5; c++) {
    combinations.push([a, b, c]);
  }
  const legal = [];
  for (const a of combinations) for (const b of combinations) for (const c of combinations) {
    const rounds = [a, b, c];
    const counts = [0, 0, 0, 0, 0];
    rounds.forEach(round => round.forEach(type => counts[type]++));
    if (counts.every(n => n >= 1 && n <= 2)) legal.push(rounds);
  }
  return pick(legal).map(round => shuffle(round));
}

function isActiveLane(state, lane) {
  return Number.isInteger(lane) && state.activeLanes.includes(lane);
}

function activeAdjacent(state, lane) {
  const slot = state.activeLanes.indexOf(lane);
  if (slot < 0) return [];
  return state.activeLanes.filter((_, i) => Math.abs(i - slot) === 1);
}

function otherActiveLanes(state, lane) {
  return state.activeLanes.filter(l => l !== lane);
}

function rightActiveLane(state, lane) {
  const slot = state.activeLanes.indexOf(lane);
  return slot < 0 ? null : state.activeLanes[(slot + 1) % state.activeLanes.length];
}

function projectedResult(aLanes, bLanes, activeLanes = [0, 1, 2, 3, 4]) {
  const ac = countControlled(aLanes, bLanes, activeLanes);
  const bc = countControlled(bLanes, aLanes, activeLanes);
  if (ac > bc) return 'win';
  if (ac < bc) return 'loss';
  return 'draw';
}

function other(who) {
  return who === 'player' ? 'ai' : 'player';
}

function makeSide(deckCards, typeBonuses) {
  return {
    deck: deckCards,
    reserveDeck: [],
    hand: [],
    typeBonuses,
    laneScores: [0, 0, 0, 0, 0],
    hasPassed: false,
    ingenuityTokens: 0,
    oncePerRound: {
      arithmeticAffinity: false,
      geometryAffinity: false,
      scienceAffinity: false,
      logicMastery: false,
    },
    oncePerBattle: {
      arithmeticMastery: false,
      geometryMastery: false,
      scienceMastery: false,
    },
    setCardsThisRound: { little_reckoning: 0, ninefold_orchard: 0, gifford: 0 },
  };
}

// ===== GENERIC CARDS =====
// 10 variants per module, randomly assigned at game launch to fill deck slots not taken by character cards.
// primaryType: -1 = No Type (do not count toward affinity/mastery).

export const GENERIC_CARDS = {
  primary: [
    { id: 'apple_picker_a', name: 'Apple Picker', r: 'generic', emoji: '🍎', bv: 8, s: [2,1,1,2,2], primaryType: -1, set: 'ninefold_orchard' },
    { id: 'apple_picker_b', name: 'Apple Picker', r: 'generic', emoji: '🍎', bv: 8, s: [1,3,2,1,1], primaryType: -1, set: 'ninefold_orchard' },
    { id: 'apple_picker_c', name: 'Apple Picker', r: 'generic', emoji: '🍎', bv: 8, s: [3,2,1,1,1], primaryType: -1, set: 'ninefold_orchard' },
    { id: 'apple_picker_d', name: 'Apple Picker', r: 'generic', emoji: '🍎', bv: 8, s: [2,2,1,1,2], primaryType: -1, set: 'ninefold_orchard' },
    { id: 'apple_picker_e', name: 'Apple Picker', r: 'generic', emoji: '🍎', bv: 8, s: [1,4,1,1,1], primaryType: -1, set: 'ninefold_orchard' },
    { id: 'apple_picker_f', name: 'Apple Picker', r: 'generic', emoji: '🍎', bv: 8, s: [2,3,1,1,1], primaryType: -1, set: 'ninefold_orchard' },
    { id: 'apple_picker_g', name: 'Apple Picker', r: 'generic', emoji: '🍎', bv: 8, s: [3,1,1,1,2], primaryType: -1, set: 'ninefold_orchard' },
    { id: 'apple_picker_h', name: 'Apple Picker', r: 'generic', emoji: '🍎', bv: 8, s: [2,1,2,1,2], primaryType: -1, set: 'ninefold_orchard' },
    { id: 'apple_picker_i', name: 'Apple Picker', r: 'generic', emoji: '🍎', bv: 8, s: [2,2,1,2,1], primaryType: -1, set: 'ninefold_orchard' },
    { id: 'apple_picker_j', name: 'Apple Picker', r: 'generic', emoji: '🍎', bv: 8, s: [2,1,2,2,1], primaryType: -1, set: 'ninefold_orchard' },
  ],
  junior: [
    { id: 'little_reckoner_a', name: 'Little Reckoner', r: 'generic', emoji: '📜', bv: 8, s: [2,1,3,1,1], primaryType: -1, set: 'little_reckoning' },
    { id: 'little_reckoner_b', name: 'Little Reckoner', r: 'generic', emoji: '📜', bv: 8, s: [1,1,2,2,2], primaryType: -1, set: 'little_reckoning' },
    { id: 'little_reckoner_c', name: 'Little Reckoner', r: 'generic', emoji: '📜', bv: 8, s: [1,1,1,3,2], primaryType: -1, set: 'little_reckoning' },
    { id: 'little_reckoner_d', name: 'Little Reckoner', r: 'generic', emoji: '📜', bv: 8, s: [2,1,2,2,1], primaryType: -1, set: 'little_reckoning' },
    { id: 'little_reckoner_e', name: 'Little Reckoner', r: 'generic', emoji: '📜', bv: 8, s: [1,1,4,1,1], primaryType: -1, set: 'little_reckoning' },
    { id: 'little_reckoner_f', name: 'Little Reckoner', r: 'generic', emoji: '📜', bv: 8, s: [2,1,1,2,2], primaryType: -1, set: 'little_reckoning' },
    { id: 'little_reckoner_g', name: 'Little Reckoner', r: 'generic', emoji: '📜', bv: 8, s: [2,3,1,1,1], primaryType: -1, set: 'little_reckoning' },
    { id: 'little_reckoner_h', name: 'Little Reckoner', r: 'generic', emoji: '📜', bv: 8, s: [1,1,1,2,3], primaryType: -1, set: 'little_reckoning' },
    { id: 'little_reckoner_i', name: 'Little Reckoner', r: 'generic', emoji: '📜', bv: 8, s: [1,2,1,2,2], primaryType: -1, set: 'little_reckoning' },
    { id: 'little_reckoner_j', name: 'Little Reckoner', r: 'generic', emoji: '📜', bv: 8, s: [1,1,1,1,4], primaryType: -1, set: 'little_reckoning' },
  ],
  intermediate: [
    { id: 'urchin_a', name: 'Urchin', r: 'generic', emoji: '🧒', bv: 8, s: [1,1,2,1,3], primaryType: -1, set: 'gifford' },
    { id: 'urchin_b', name: 'Urchin', r: 'generic', emoji: '🧒', bv: 8, s: [1,1,2,3,1], primaryType: -1, set: 'gifford' },
    { id: 'urchin_c', name: 'Urchin', r: 'generic', emoji: '🧒', bv: 8, s: [1,1,1,1,4], primaryType: -1, set: 'gifford' },
    { id: 'urchin_d', name: 'Urchin', r: 'generic', emoji: '🧒', bv: 8, s: [2,1,2,2,1], primaryType: -1, set: 'gifford' },
    { id: 'urchin_e', name: 'Urchin', r: 'generic', emoji: '🧒', bv: 8, s: [1,2,2,2,1], primaryType: -1, set: 'gifford' },
    { id: 'urchin_f', name: 'Urchin', r: 'generic', emoji: '🧒', bv: 8, s: [1,1,1,4,1], primaryType: -1, set: 'gifford' },
    { id: 'urchin_g', name: 'Urchin', r: 'generic', emoji: '🧒', bv: 8, s: [2,1,1,2,2], primaryType: -1, set: 'gifford' },
    { id: 'urchin_h', name: 'Urchin', r: 'generic', emoji: '🧒', bv: 8, s: [3,1,1,2,1], primaryType: -1, set: 'gifford' },
    { id: 'urchin_i', name: 'Urchin', r: 'generic', emoji: '🧒', bv: 8, s: [1,3,1,1,2], primaryType: -1, set: 'gifford' },
    { id: 'urchin_j', name: 'Urchin', r: 'generic', emoji: '🧒', bv: 8, s: [1,2,1,3,1], primaryType: -1, set: 'gifford' },
  ],
};

// ===== PLACEHOLDER GENERATION (kept for AI deck building) =====

export function makePlaceholder(moduleSet) {
  // Random non-negative stats summing to PLACEHOLDER_STATS_TOTAL (§7)
  const breaks = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]).slice(0, 4).sort((a, b) => a - b);
  const points = [breaks[0], breaks[1] - breaks[0], breaks[2] - breaks[1], breaks[3] - breaks[2], 8 - breaks[3]];
  const stats = shuffle(points);
  const max = Math.max(...stats);
  const tied = stats.map((v, i) => (v === max ? i : -1)).filter(i => i >= 0);
  const primaryType = pick(tied);
  return {
    id: `placeholder_${Math.random().toString(36).slice(2)}`,
    name: 'Placeholder',
    r: 'placeholder',
    s: stats,
    bv: PLACEHOLDER_BV,
    set: null,
    primaryType,
    isPlaceholder: true,
  };
}

// ===== TYPE BONUS COMPUTATION =====

export function computeTypeBonuses(deckCards) {
  const counts = [0, 0, 0, 0, 0];
  for (const c of deckCards) counts[c.primaryType]++;
  return {
    affinity: counts.map((n, i) => (n >= 3 ? i : -1)).filter(i => i >= 0),
    mastery: counts.map((n, i) => (n >= 5 ? i : -1)).filter(i => i >= 0),
  };
}

// Build deck cards from a deckSpec [{cardId, count}] + card lookup map/array.
// Remaining slots are filled with randomly picked generic cards for the active module.
export function buildPlayerDeck(deckSpec, allCards, moduleSet = 'junior') {
  const byId = Object.fromEntries(
    (Array.isArray(allCards) ? allCards : Object.values(allCards)).map(c => [c.id, c])
  );
  const cards = [];
  for (const { cardId, count } of deckSpec) {
    const card = byId[cardId];
    if (card) for (let i = 0; i < count; i++) cards.push(card);
  }
  const pool = GENERIC_CARDS[moduleSet] || GENERIC_CARDS.junior;
  let randomVariants = shuffle([...pool]);
  while (cards.length < DECK_SIZE) {
    if (!randomVariants.length) randomVariants = shuffle([...pool]);
    cards.push(randomVariants.pop());
  }
  return cards.slice(0, DECK_SIZE);
}

// ===== BATTLE INITIALISATION =====

export function initBattle(playerDeckCards, aiDeckCards) {
  const playerBonuses = computeTypeBonuses(playerDeckCards);
  const aiBonuses = computeTypeBonuses(aiDeckCards);

  const player = makeSide(playerDeckCards, playerBonuses);
  const ai = makeSide(aiDeckCards, aiBonuses);

  const pShuffled = shuffle(playerDeckCards);
  player.hand = pShuffled.slice(0, OPENING_HAND);
  player.reserveDeck = pShuffled.slice(OPENING_HAND);

  const aShuffled = shuffle(aiDeckCards);
  ai.hand = aShuffled.slice(0, OPENING_HAND);
  ai.reserveDeck = aShuffled.slice(OPENING_HAND);

  const firstToMove = Math.random() < 0.5 ? 'player' : 'ai';

  const laneSchedule = generateLaneSchedule();
  const state = {
    roundNumber: 1,
    playerRoundsWon: 0,
    aiRoundsWon: 0,
    firstToMove,
    currentTurn: firstToMove,
    battleFinished: false,
    winner: null,
    laneSchedule,
    activeLanes: [...laneSchedule[0]],
    player,
    ai,
    boardCards: [],
    pendingAbility: null,
    logicRevealedCardId: null,
    _aiTargetRarity: 'common',
    _battleType: 'friendly',
    _targetCardId: null,
  };

  return applyRoundStart(state);
}

// ===== MULLIGAN =====

export function mulligan(state, handIdx) {
  if (state.player.reserveDeck.length === 0) return state;
  const s = cloneState(state);
  const removed = s.player.hand.splice(handIdx, 1)[0];
  const drawn = s.player.reserveDeck.shift();
  s.player.hand.push(drawn);
  s.player.reserveDeck.push(removed);
  s.player.reserveDeck = shuffle(s.player.reserveDeck);
  return s;
}

// ===== ROUND START (internal) =====

function applyRoundStart(state) {
  const s = cloneState(state);
  s.activeLanes = [...s.laneSchedule[s.roundNumber - 1]];
  for (const who of ['player', 'ai']) {
    const side = s[who];
    side.laneScores = [0, 0, 0, 0, 0];
    side.hasPassed = false;
    side.setCardsThisRound = { little_reckoning: 0, ninefold_orchard: 0, gifford: 0 };
    side.oncePerRound = {
      arithmeticAffinity: false,
      geometryAffinity: false,
      scienceAffinity: false,
      logicMastery: false,
    };
  }
  s.boardCards = [];
  s.pendingAbility = null;
  s.logicRevealedCardId = null;

  // Logic Affinity: reveal one random opponent card for the player (§22)
  if (s.player.typeBonuses.affinity.includes(TYPE.LOGIC) && s.ai.hand.length > 0) {
    s.logicRevealedCardId = pick(s.ai.hand).id;
  }

  return s;
}

// ===== PLAY CARD =====
// options: { useScienceAffinity: bool, useScienceMastery: bool }
// For player plays: interactive abilities set pendingAbility.
// For AI plays: all choices are resolved automatically (no pendingAbility set).
export function playCard(state, who, handIdx, laneIdx, options = {}) {
  if (state.pendingAbility) return state;
  if (!isActiveLane(state, laneIdx) || state[who].hasPassed || state.currentTurn !== who) return state;
  const s = cloneState(state);
  const side = s[who];
  const opp = s[other(who)];

  const card = side.hand[handIdx];
  if (!card) return state;

  const scoresBefore = [...side.laneScores];
  let contribution = card.s[laneIdx];
  const triggered = [];

  // Science Mastery (once per battle): use highest stat in any lane
  if (options.useScienceMastery &&
      side.typeBonuses.mastery.includes(TYPE.SCIENCE) &&
      !side.oncePerBattle.scienceMastery) {
    const highest = Math.max(...card.s);
    if (highest !== contribution) {
      contribution = highest;
      triggered.push('scienceMastery');
    }
    side.oncePerBattle.scienceMastery = true;
  } else if (options.useScienceAffinity &&
      side.typeBonuses.affinity.includes(TYPE.SCIENCE) &&
      !side.oncePerRound.scienceAffinity) {
    const sorted = [...card.s].sort((a, b) => b - a);
    if (sorted[1] > contribution) {
      contribution = sorted[1];
      triggered.push('scienceAffinity');
    }
    side.oncePerRound.scienceAffinity = true;
  }

  side.laneScores[laneIdx] += contribution;
  side.hand.splice(handIdx, 1);

  const bc = {
    cardId: card.id,
    owner: who,
    card,
    currentLane: laneIdx,
    currentContribution: contribution,
    originalPrintedContribution: card.s[laneIdx],
    temporaryBonuses: 0,
    movedThisRound: false,
  };
  s.boardCards.push(bc);

  if (card.primaryType >= 0 && laneIdx !== card.primaryType) side.ingenuityTokens++;

  if (card.set) side.setCardsThisRound[card.set]++;

  // Resolve all triggers. For the player, the first interactive one becomes pendingAbility;
  // subsequent interactive triggers are auto-resolved using AI logic (v1 simplification).

  // ── Arithmetic Affinity: printed stat causes exact tie (§20)
  if (side.typeBonuses.affinity.includes(TYPE.ARITHMETIC) &&
      !side.oncePerRound.arithmeticAffinity) {
    const lanesWithPrinted = side.laneScores[laneIdx] - contribution + card.s[laneIdx];
    if (lanesWithPrinted === opp.laneScores[laneIdx]) {
      triggered.push('arithmeticAffinity');
      side.oncePerRound.arithmeticAffinity = true;
      if (who === 'player' && side.reserveDeck.length > 0) {
        s.pendingAbility = {
          type: 'arithmeticAffinity', who,
          reserveTop: side.reserveDeck[0],
        };
      }
      // AI: always leave top card (peeking is informational, free action)
    }
  }

  // ── Geometry Affinity: automatically support the physical lane to the right, wrapping at the edge
  // (a plain automatic effect, never interactive itself, so it must not be skipped just because
  // Arithmetic Affinity already claimed the single pendingAbility slot on this same play)
  if (card.primaryType === TYPE.GEOMETRY &&
      side.typeBonuses.affinity.includes(TYPE.GEOMETRY) &&
      !side.oncePerRound.geometryAffinity) {
    triggered.push('geometryAffinity');
    side.oncePerRound.geometryAffinity = true;
    const destination = rightActiveLane(s, laneIdx);
    if (destination !== null) side.laneScores[destination]++;
  }

  // ── Set bonuses (§25-28)
  // Only ONE interactive pendingAbility can be active per play, so if Arithmetic Affinity already
  // claimed it above, every "if (who === 'player')" branch below falls through to its own
  // auto-resolve ("else") branch instead — matching this file's documented v1 simplification
  // ("subsequent interactive triggers are auto-resolved") rather than silently skipping the
  // bonus outright, which is what the old `!s.pendingAbility` guard on this whole block did.
  if (card.set) {
    const count = side.setCardsThisRound[card.set];

    if (count === 2) {
      // Minor effect
      if (card.set === 'ninefold_orchard') {
        const occupied = [...new Set(s.boardCards.filter(b => b.owner === who).map(b => b.currentLane))];
        if (occupied.length > 0) {
          if (who === 'player' && !s.pendingAbility) {
            s.pendingAbility = { type: 'ninefoldOrchard2', who, availableLanes: occupied };
          } else {
            // AI: up to 2 lanes, prefer ones that flip/secure
            const pick2 = occupied
              .sort((a, b) => {
                const da = side.laneScores[a] - opp.laneScores[a];
                const db = side.laneScores[b] - opp.laneScores[b];
                return da - db; // lowest margin first (most benefit from +1)
              })
              .slice(0, 2);
            for (const l of pick2) side.laneScores[l]++;
          }
        }
      } else if (card.set === 'little_reckoning') {
        const eligible = s.boardCards.filter(b => b.owner === who && b.card && b.card.bv <= 16);
        if (eligible.length > 0) {
          if (who === 'player' && !s.pendingAbility) {
            s.pendingAbility = {
              type: 'littleReckoning2', who,
              eligibleCards: eligible.map(b => ({ cardId: b.cardId, lane: b.currentLane })),
            };
          } else {
            const best = eligible.reduce((b, cur) => {
              const da = side.laneScores[cur.currentLane] + 3 - opp.laneScores[cur.currentLane];
              if (!b) return cur;
              const db = side.laneScores[b.currentLane] + 3 - opp.laneScores[b.currentLane];
              return da > db ? cur : b;
            }, null);
            if (best) side.laneScores[best.currentLane] += 3;
          }
        }
      } else if (card.set === 'gifford') {
        const ownedOnBoard = s.boardCards.filter(b => b.owner === who && b.card && b.cardId !== card.id);
        if (ownedOnBoard.length > 0) {
          if (who === 'player' && !s.pendingAbility) {
            s.pendingAbility = {
              type: 'gifford2', who,
              playedCards: ownedOnBoard.map(b => ({ cardId: b.cardId, currentLane: b.currentLane })),
            };
          } else {
            // AI: pick best card+destination
            let bestScore = -Infinity, bestMove = null;
            for (const ob of ownedOnBoard) {
              for (const d of s.activeLanes) {
                if (d === ob.currentLane) continue;
                const nc = ob.card.s[d] + 1;
                const sl = [...side.laneScores];
                sl[ob.currentLane] -= ob.currentContribution;
                sl[d] += nc;
                const ctrl = countControlled(sl, opp.laneScores);
                if (ctrl > bestScore) { bestScore = ctrl; bestMove = { ob, d, nc }; }
              }
            }
            if (bestMove) {
              side.laneScores[bestMove.ob.currentLane] -= bestMove.ob.currentContribution;
              side.laneScores[bestMove.d] += bestMove.nc;
              bestMove.ob.currentLane = bestMove.d;
              bestMove.ob.currentContribution = bestMove.nc;
              bestMove.ob.movedThisRound = true;
            }
          }
        }
      }
    } else if (count === 3) {
      // Major effect
      if (card.set === 'ninefold_orchard') {
        const ownedOnBoard = s.boardCards.filter(b => b.owner === who && b.card);
        if (ownedOnBoard.length > 0) {
          if (who === 'player' && !s.pendingAbility) {
            s.pendingAbility = {
              type: 'ninefoldOrchard3', who,
              playedCards: ownedOnBoard.map(b => ({ cardId: b.cardId, currentLane: b.currentLane })),
            };
          } else {
            let bestScore = -Infinity, bestOp = null;
            for (const ob of ownedOnBoard) {
              for (const adjL of activeAdjacent(s, ob.currentLane)) {
                const sl = [...side.laneScores];
                sl[adjL] += 2;
                const ctrl = countControlled(sl, opp.laneScores);
                if (ctrl > bestScore) { bestScore = ctrl; bestOp = adjL; }
              }
            }
            if (bestOp !== null) side.laneScores[bestOp] += 2;
          }
        }
      } else if (card.set === 'little_reckoning') {
        const eligible = s.boardCards.filter(b => b.owner === who && b.card && b.card.bv <= 16);
        if (eligible.length > 0) {
          if (who === 'player' && !s.pendingAbility) {
            s.pendingAbility = {
              type: 'reckoning', who,
              eligibleCards: eligible.map(b => ({ cardId: b.cardId, lane: b.currentLane })),
            };
          } else {
            let bestScore = -Infinity, bestBc = null;
            for (const ob of eligible) {
              const sl = [...side.laneScores];
              sl[ob.currentLane] += ob.currentContribution;
              const ctrl = countControlled(sl, opp.laneScores);
              if (ctrl > bestScore) { bestScore = ctrl; bestBc = ob; }
            }
            if (bestBc) {
              side.laneScores[bestBc.currentLane] += bestBc.currentContribution;
              bestBc.currentContribution *= 2;
            }
          }
        }
      } else if (card.set === 'gifford') {
        const oppOnBoard = s.boardCards.filter(b => b.owner === other(who) && b.card);
        const ownedOnBoard = s.boardCards.filter(b => b.owner === who && b.card && b.cardId !== card.id);
        if (who === 'player' && !s.pendingAbility) {
          s.pendingAbility = {
            type: 'giffordOverride', who,
            oppCards: oppOnBoard.map(b => ({
              cardId: b.cardId, currentLane: b.currentLane, adjacentLanes: otherActiveLanes(s, b.currentLane),
            })),
            ownCards: ownedOnBoard.map(b => ({ cardId: b.cardId, currentLane: b.currentLane })),
          };
        } else {
          // Part 1: move best opponent card to adjacent lane (hurts opponent most)
          let bestOppScore = -Infinity, bestOppMove = null;
          for (const ob of oppOnBoard) {
            for (const adjL of otherActiveLanes(s, ob.currentLane)) {
              const nc = ob.card.s[adjL];
              const ol = [...opp.laneScores];
              ol[ob.currentLane] -= ob.currentContribution;
              ol[adjL] += nc;
              const ctrl = countControlled(side.laneScores, ol);
              if (ctrl > bestOppScore) { bestOppScore = ctrl; bestOppMove = { ob, adjL, nc }; }
            }
          }
          if (bestOppMove) {
            opp.laneScores[bestOppMove.ob.currentLane] -= bestOppMove.ob.currentContribution;
            opp.laneScores[bestOppMove.adjL] += bestOppMove.nc;
            bestOppMove.ob.currentLane = bestOppMove.adjL;
            bestOppMove.ob.currentContribution = bestOppMove.nc;
            bestOppMove.ob.movedThisRound = true;
          }
          // Part 2: move own card to best destination
          let bestOwnScore = -Infinity, bestOwnMove = null;
          for (const ob of ownedOnBoard) {
            for (const d of s.activeLanes) {
              if (d === ob.currentLane) continue;
              const nc = ob.card.s[d] + 1;
              const sl = [...side.laneScores];
              sl[ob.currentLane] -= ob.currentContribution;
              sl[d] += nc;
              const ctrl = countControlled(sl, opp.laneScores);
              if (ctrl > bestOwnScore) { bestOwnScore = ctrl; bestOwnMove = { ob, d, nc }; }
            }
          }
          if (bestOwnMove) {
            side.laneScores[bestOwnMove.ob.currentLane] -= bestOwnMove.ob.currentContribution;
            side.laneScores[bestOwnMove.d] += bestOwnMove.nc;
            bestOwnMove.ob.currentLane = bestOwnMove.d;
            bestOwnMove.ob.currentContribution = bestOwnMove.nc;
            bestOwnMove.ob.movedThisRound = true;
          }
        }
      }
    }
  }

  s.lastPlay = {
    who, cardId: card.id, cardName: card.name, laneIdx, contribution,
    triggered: [...triggered],
    scoreDeltas: side.laneScores.map((score, i) => score - scoresBefore[i]),
  };

  // Advance turn after play (if no pending ability)
  if (!s.pendingAbility) {
    const oppWho = other(who);
    if (!s[oppWho].hasPassed && (s[oppWho].hand.length > 0 || s[oppWho].ingenuityTokens > 0)) {
      s.currentTurn = oppWho;
    }
    return checkRoundEnd(s);
  }

  return s;
}

// Ingenuity is a +1 token-card and consumes the side's normal PLAY action.
export function playIngenuityToken(state, who, laneIdx) {
  if (state.pendingAbility || state.battleFinished || state.currentTurn !== who) return state;
  if (state[who].hasPassed || state[who].ingenuityTokens < 1 || !isActiveLane(state, laneIdx)) return state;
  const s = cloneState(state);
  const side = s[who];
  side.ingenuityTokens--;
  side.laneScores[laneIdx] += INGENUITY_TOKEN_VALUE;
  s.boardCards.push({
    cardId: `ingenuity_${who}_${s.roundNumber}_${s.boardCards.length}`,
    owner: who,
    isIngenuityToken: true,
    currentLane: laneIdx,
    currentContribution: INGENUITY_TOKEN_VALUE,
  });
  s.lastPlay = {
    who, cardId: null, cardName: 'Ingenuity Token', laneIdx,
    contribution: INGENUITY_TOKEN_VALUE, triggered: ['ingenuityToken'],
    scoreDeltas: [0, 0, 0, 0, 0].map((_, i) => i === laneIdx ? INGENUITY_TOKEN_VALUE : 0),
  };
  const oppWho = other(who);
  if (!s[oppWho].hasPassed && (s[oppWho].hand.length > 0 || s[oppWho].ingenuityTokens > 0)) s.currentTurn = oppWho;
  return checkRoundEnd(s);
}

export function activateArithmeticMastery(state, who = 'player') {
  if (state.pendingAbility || state.battleFinished) return state;
  const side = state[who];
  if (!side.typeBonuses.mastery.includes(TYPE.ARITHMETIC) || side.oncePerBattle.arithmeticMastery || side.reserveDeck.length === 0) return state;
  const s = cloneState(state);
  s.pendingAbility = { type: 'arithmeticMastery', who, topCard: s[who].reserveDeck[0], canCancel: true };
  return s;
}

export function cancelAbility(state) {
  if (!state.pendingAbility?.canCancel) return state;
  const s = cloneState(state);
  s.pendingAbility = null;
  return s;
}

// ===== GEOMETRY MASTERY (player-initiated, once per battle) =====
// Picks the best legal Geometry Mastery move for `who` (the played Geometry-type card whose
// move to its mirror lane improves lane control the most), or null if none is available.
// Shared by the AI's opportunistic use in doAITurn and the player-facing "Symmetry" button.
export function bestGeometryMasteryMove(state, who) {
  const side = state[who];
  if (side.oncePerBattle.geometryMastery || !side.typeBonuses.mastery.includes(TYPE.GEOMETRY)) return null;
  const opp = state[other(who)];
  const geomCards = state.boardCards.filter(b => b.owner === who && b.card &&
    b.card.primaryType === TYPE.GEOMETRY && MIRROR[b.currentLane] >= 0 &&
    isActiveLane(state, MIRROR[b.currentLane]));
  let bestCardId = null, bestCtrl = countControlled(side.laneScores, opp.laneScores);
  for (const ob of geomCards) {
    const dest = MIRROR[ob.currentLane];
    const sl = [...side.laneScores];
    sl[ob.currentLane] -= ob.currentContribution;
    sl[dest] += ob.card.s[dest];
    const ctrl = countControlled(sl, opp.laneScores);
    if (ctrl > bestCtrl) { bestCtrl = ctrl; bestCardId = ob.cardId; }
  }
  return bestCardId;
}

// Called explicitly by the UI when the player wants to activate Symmetry.
// Returns state unchanged if no legal move is possible or ability already used.
export function activateGeometryMastery(state, who, cardId) {
  const side = state[who];
  if (side.oncePerBattle.geometryMastery) return state;
  if (!side.typeBonuses.mastery.includes(TYPE.GEOMETRY)) return state;

  const bc = state.boardCards.find(b => b.owner === who && b.cardId === cardId &&
    !b.isIngenuityToken && b.card.primaryType === TYPE.GEOMETRY &&
    MIRROR[b.currentLane] >= 0 && isActiveLane(state, MIRROR[b.currentLane]));
  if (!bc) return state;

  const s = cloneState(state);
  const sideS = s[who];
  const bcRef = s.boardCards.find(b => b.owner === who && b.cardId === cardId);
  const dest = MIRROR[bcRef.currentLane];

  sideS.laneScores[bcRef.currentLane] -= bcRef.currentContribution;
  const newContrib = bcRef.card.s[dest];
  sideS.laneScores[dest] += newContrib;
  bcRef.currentLane = dest;
  bcRef.currentContribution = newContrib;
  bcRef.movedThisRound = true;
  sideS.oncePerBattle.geometryMastery = true;

  return checkRoundEnd(s);
}

// ===== RESOLVE PENDING ABILITY =====
// choice shape depends on pendingAbility.type:
//   arithmeticAffinity:  { action: 'leave'|'bottom' }
//   arithmeticMastery:   { action: 'keep'|'discard' }
//   geometryAffinity:    { lane: number }
//   ninefoldOrchard2:    { lanes: number[] }  up to 2
//   ninefoldOrchard3:    { cardId: string, adjLane: number }
//   littleReckoning2:    { cardId: string }
//   reckoning:           { cardId: string }
//   gifford2:            { cardId: string, destLane: number }
//   giffordOverride:     { oppCardId?: string, oppDestLane?: number, ownCardId?: string, ownDestLane?: number }
export function resolveAbility(state, choice) {
  if (!state.pendingAbility) return state;
  const s = cloneState(state);
  const { type, who } = s.pendingAbility;
  const side = s[who];
  const opp = s[other(who)];

  switch (type) {
    case 'arithmeticAffinity': {
      if (choice.action === 'bottom' && side.reserveDeck.length > 0) {
        side.reserveDeck.push(side.reserveDeck.shift());
      }
      break;
    }
    case 'arithmeticMastery': {
      if (choice.action === 'discard' && side.reserveDeck.length > 0) {
        const discarded = side.reserveDeck.shift();
        side.laneScores[TYPE.ARITHMETIC] += discarded.s[TYPE.ARITHMETIC];
      }
      side.oncePerBattle.arithmeticMastery = true;
      break;
    }
    case 'geometryAffinity': {
      if (s.pendingAbility.adjacentLanes.includes(choice.lane)) {
        side.laneScores[choice.lane]++;
      }
      break;
    }
    case 'ninefoldOrchard2': {
      const lanes = (choice.lanes || []).slice(0, 2);
      for (const l of lanes) {
        if (s.pendingAbility.availableLanes.includes(l)) side.laneScores[l]++;
      }
      break;
    }
    case 'ninefoldOrchard3': {
      const bcRef = s.boardCards.find(b => b.owner === who && b.cardId === choice.cardId);
      if (bcRef && activeAdjacent(s, bcRef.currentLane).includes(choice.adjLane)) {
        side.laneScores[choice.adjLane] += 2;
      }
      break;
    }
    case 'littleReckoning2': {
      const bcRef = s.boardCards.find(b => b.owner === who && b.cardId === choice.cardId && b.card?.bv <= 16);
      if (bcRef) side.laneScores[bcRef.currentLane] += 3;
      break;
    }
    case 'reckoning': {
      const bcRef = s.boardCards.find(b => b.owner === who && b.cardId === choice.cardId && b.card?.bv <= 16);
      if (bcRef) {
        side.laneScores[bcRef.currentLane] += bcRef.currentContribution;
        bcRef.currentContribution *= 2;
      }
      break;
    }
    case 'gifford2': {
      const bcRef = s.boardCards.find(b => b.owner === who && b.cardId === choice.cardId);
      if (bcRef && isActiveLane(s, choice.destLane) && choice.destLane !== bcRef.currentLane) {
        const nc = bcRef.card.s[choice.destLane] + 1;
        side.laneScores[bcRef.currentLane] -= bcRef.currentContribution;
        side.laneScores[choice.destLane] += nc;
        bcRef.currentLane = choice.destLane;
        bcRef.currentContribution = nc;
        bcRef.movedThisRound = true;
      }
      break;
    }
    case 'giffordOverride': {
      // Move opponent card to any other active lane
      if (choice.oppCardId && choice.oppDestLane !== undefined) {
        const bcRef = s.boardCards.find(b => b.owner === other(who) && b.cardId === choice.oppCardId);
        if (bcRef?.card && otherActiveLanes(s, bcRef.currentLane).includes(choice.oppDestLane)) {
          const nc = bcRef.card.s[choice.oppDestLane];
          opp.laneScores[bcRef.currentLane] -= bcRef.currentContribution;
          opp.laneScores[choice.oppDestLane] += nc;
          bcRef.currentLane = choice.oppDestLane;
          bcRef.currentContribution = nc;
          bcRef.movedThisRound = true;
        }
      }
      // Move own card (any destination)
      if (choice.ownCardId && choice.ownDestLane !== undefined) {
        const bcRef = s.boardCards.find(b => b.owner === who && b.cardId === choice.ownCardId);
        if (bcRef?.card && isActiveLane(s, choice.ownDestLane) && choice.ownDestLane !== bcRef.currentLane) {
          const nc = bcRef.card.s[choice.ownDestLane] + 1;
          side.laneScores[bcRef.currentLane] -= bcRef.currentContribution;
          side.laneScores[choice.ownDestLane] += nc;
          bcRef.currentLane = choice.ownDestLane;
          bcRef.currentContribution = nc;
          bcRef.movedThisRound = true;
        }
      }
      break;
    }
  }

  s.pendingAbility = null;

  // Advance turn and check if round is over
  const oppWho = other(who);
  if (!s[oppWho].hasPassed && (s[oppWho].hand.length > 0 || s[oppWho].ingenuityTokens > 0)) {
    s.currentTurn = oppWho;
  }
  return checkRoundEnd(s);
}

// ===== PASS =====

export function passTurn(state, who) {
  if (state.pendingAbility) return state;
  if (state[who].hasPassed) return state;
  const s = cloneState(state);
  s[who].hasPassed = true;
  return checkRoundEnd(s);
}

// ===== ROUND END CHECK =====

export function checkRoundEnd(state) {
  if (state.pendingAbility) return state;

  const playerDone = state.player.hasPassed || (state.player.hand.length === 0 && state.player.ingenuityTokens === 0);
  const aiDone = state.ai.hasPassed || (state.ai.hand.length === 0 && state.ai.ingenuityTokens === 0);

  if (playerDone && aiDone) return resolveRound(state);

  // Advance currentTurn past whoever is done
  const s = cloneState(state);
  if (s[s.currentTurn].hasPassed || (s[s.currentTurn].hand.length === 0 && s[s.currentTurn].ingenuityTokens === 0)) {
    s.currentTurn = other(s.currentTurn);
  }
  return s;
}

// ===== RESOLVE ROUND =====

export function resolveRound(state) {
  const s = cloneState(state);
  s._lastRound = {
    playerScores: [...s.player.laneScores],
    aiScores: [...s.ai.laneScores],
    boardCards: cloneState(s.boardCards),
    activeLanes: [...s.activeLanes],
  };
  const result = projectedResult(s.player.laneScores, s.ai.laneScores, s.activeLanes);

  if (result === 'win') s.playerRoundsWon++;
  else if (result === 'loss') s.aiRoundsWon++;

  if (s.playerRoundsWon >= ROUNDS_TO_WIN) {
    s.battleFinished = true; s.winner = 'player'; return s;
  }
  if (s.aiRoundsWon >= ROUNDS_TO_WIN) {
    s.battleFinished = true; s.winner = 'ai'; return s;
  }
  if (s.roundNumber >= 3) {
    s.battleFinished = true;
    s.winner = s.playerRoundsWon > s.aiRoundsWon ? 'player'
             : s.aiRoundsWon > s.playerRoundsWon ? 'ai' : 'draw';
    return s;
  }

  s.roundNumber++;

  // Who goes first next round: loser of this round; draw → alternate
  if (result === 'win') s.firstToMove = 'ai';
  else if (result === 'loss') s.firstToMove = 'player';
  else s.firstToMove = other(s.firstToMove);
  s.currentTurn = s.firstToMove;

  // Between-round draws (§17, §24 Speed Affinity)
  for (const who of ['player', 'ai']) {
    const side = s[who];
    const n = Math.min(DRAW_AFTER_ROUND, side.reserveDeck.length);
    if (side.typeBonuses.affinity.includes(TYPE.SPEED)) {
      // Speed Affinity: reveal 2, keep 1 (§24)
      // v1: auto-pick for AI; auto-pick best for player too (TODO: pendingAbility)
      for (let i = 0; i < n; i++) {
        if (side.reserveDeck.length === 0) break;
        if (side.reserveDeck.length === 1) { side.hand.push(side.reserveDeck.shift()); break; }
        const [a, b] = side.reserveDeck.splice(0, 2);
        const keep = Math.max(...a.s) >= Math.max(...b.s) ? a : b;
        const ret = keep === a ? b : a;
        side.hand.push(keep);
        side.reserveDeck.push(ret);
        side.reserveDeck = shuffle(side.reserveDeck);
      }
    } else {
      for (let i = 0; i < n; i++) {
        if (side.reserveDeck.length === 0) break;
        side.hand.push(side.reserveDeck.shift());
      }
    }
  }

  return applyRoundStart(s);
}

// ===== AI DECK CONSTRUCTION (§40, ai_deck_construction_algorithm.md) =====

function cardEfficiency(card) {
  const sum = card.s.reduce((a, b) => a + b, 0);
  const highest = Math.max(...card.s);
  return (sum / card.bv) + Math.max(0, highest - 6) * 0.20;
}

export function buildAIDeck(targetCard, bvCap, cardPool) {
  const deck = [{ ...targetCard }];
  const counts = { [targetCard.id]: 1 };
  let totalBV = targetCard.bv;

  function canAdd(card) {
    if (card.id === targetCard.id) return false;
    if ((counts[card.id] || 0) >= Math.min(MAX_COPIES, card.quantity ?? MAX_COPIES)) return false;
    if (deck.length >= DECK_SIZE) return false;
    if (totalBV + card.bv > bvCap) return false;
    return true;
  }

  function cheapestCompletion(slotsNeeded, excludeIds) {
    const ex = new Set(excludeIds);
    return cardPool
      .filter(c => !ex.has(c.id) && (counts[c.id] || 0) < Math.min(MAX_COPIES, c.quantity ?? MAX_COPIES))
      .sort((a, b) => a.bv - b.bv)
      .slice(0, slotsNeeded)
      .reduce((s, c) => s + c.bv, 0);
  }

  function safeToAdd(card) {
    if (!canAdd(card)) return false;
    const slotsAfter = DECK_SIZE - deck.length - 1;
    if (slotsAfter === 0) return true;
    const bvAfter = bvCap - totalBV - card.bv;
    return cheapestCompletion(slotsAfter, [card.id]) <= bvAfter;
  }

  function addCard(card) {
    deck.push({ ...card });
    counts[card.id] = (counts[card.id] || 0) + 1;
    totalBV += card.bv;
  }

  // Analyse target for strategy selection
  const tType = targetCard.primaryType;
  const tSet = targetCard.set;
  const avgBVBudget = bvCap / DECK_SIZE * 2;
  const affordable = c => c.bv <= avgBVBudget;
  const typePool = cardPool.filter(c => c.primaryType === tType && c.id !== targetCard.id);
  const setPool = cardPool.filter(c => c.set === tSet && c.id !== targetCard.id);
  const affordableType = typePool.filter(affordable).length;
  const affordableSet = setPool.filter(affordable).length;
  const highStat = Math.max(...targetCard.s);
  const specialisation = highStat - (targetCard.s.reduce((a, b) => a + b, 0) - highStat) / 4;

  const scores = {
    TYPE_MASTERY: affordableType >= 4
      ? 30 + specialisation * 3 + (typePool.slice(0, 4).reduce((s, c) => s + c.bv, 0) / Math.min(4, typePool.length) <= 18 ? 12 : 6)
      : 0,
    SET_CLUSTER: tSet && affordableSet >= 2
      ? 25 + (affordableSet >= 4 ? 8 : 0) + (setPool.slice(0, 3).reduce((s, c) => s + c.bv, 0) / Math.max(1, Math.min(3, setPool.length)) <= 18 ? 10 : 0)
      : 0,
    TYPE_AFFINITY_HYBRID: (affordableType >= 2 ? 18 : 0) + (tSet && affordableSet >= 1 ? 10 : 0) + (targetCard.bv >= 35 ? 8 : 0),
    BALANCED_POWER: 15 + (targetCard.bv >= 38 ? 12 : 0) + (!tSet ? 8 : 0) + (affordableType < 4 ? 6 : 0),
  };

  const rarity = (targetCard.r || 'common').toLowerCase();
  const sloppiness = { legendary: 0, epic: 2, rare: 5, uncommon: 8, common: 12 }[rarity] || 8;
  const best = Math.max(...Object.values(scores));
  const stratCandidates = Object.keys(scores).filter(k => scores[k] >= best - sloppiness);
  const strategy = pick(stratCandidates);

  const others = cardPool.filter(c => c.id !== targetCard.id);

  // Phase 1: strategy-specific seeding
  if (strategy === 'TYPE_MASTERY') {
    const typed = others.filter(c => c.primaryType === tType).sort((a, b) => cardEfficiency(b) - cardEfficiency(a));
    let need = 4;
    for (const c of typed) { if (!need) break; if (safeToAdd(c)) { addCard(c); need--; } }
  } else if (strategy === 'SET_CLUSTER' && tSet) {
    const setted = others.filter(c => c.set === tSet).sort((a, b) => cardEfficiency(b) - cardEfficiency(a));
    let need = targetCard.bv >= 35 ? 3 : 4;
    for (const c of setted) { if (!need) break; if (safeToAdd(c)) { addCard(c); need--; } }
  } else if (strategy === 'TYPE_AFFINITY_HYBRID') {
    const typed = others.filter(c => c.primaryType === tType).sort((a, b) => cardEfficiency(b) - cardEfficiency(a));
    let need = 2;
    for (const c of typed) { if (!need) break; if (safeToAdd(c)) { addCard(c); need--; } }
    if (tSet) {
      const setted = others.filter(c => c.set === tSet).sort((a, b) => cardEfficiency(b) - cardEfficiency(a));
      let sneed = 2;
      for (const c of setted) { if (!sneed) break; if (safeToAdd(c)) { addCard(c); sneed--; } }
    }
  }

  // Phase 2: fill remaining slots with generic scoring
  function genericScore(card) {
    let sc = cardEfficiency(card) * 3;
    const curType = deck.filter(c => c.primaryType === card.primaryType).length;
    if (curType === 2 || curType === 4) sc += 14;
    else if (curType === 3) sc += 3;
    if (card.set) {
      const curSet = deck.filter(c => c.set === card.set).length;
      sc += [2, 8, 12, 4, 4][Math.min(curSet, 4)];
    }
    // Prefer budget fit
    const slots = DECK_SIZE - deck.length - 1;
    if (slots > 0) {
      const ideal = (bvCap - totalBV - card.bv) / slots;
      if (ideal >= 8 && ideal <= 28) sc += 3;
    }
    return sc;
  }

  const topN = { legendary: 2, epic: 2, rare: 3, uncommon: 4, common: 5 }[rarity] || 3;
  while (deck.length < DECK_SIZE) {
    const pool = others.filter(c => safeToAdd(c)).sort((a, b) => genericScore(b) - genericScore(a));
    if (!pool.length) break;
    addCard(pick(pool.slice(0, topN)));
  }

  // Compress to deckSpec
  const compressed = {};
  for (const c of deck) compressed[c.id] = (compressed[c.id] || 0) + 1;
  return Object.entries(compressed).map(([cardId, count]) => ({ cardId, count }));
}

// ===== AI PLAY EVALUATION (ai_play_evaluation_heuristic.md) =====

function simulateAIPlay(card, laneIdx, state) {
  const s = cloneState(state);
  const side = s.ai;
  const opp = s.player;
  let contribution = card.s[laneIdx];
  const triggered = [];

  // Science Mastery: use if gain exceeds threshold (§7)
  if (side.typeBonuses.mastery.includes(TYPE.SCIENCE) && !side.oncePerBattle.scienceMastery) {
    const highest = Math.max(...card.s);
    if (highest - contribution >= 8) { contribution = highest; triggered.push('scienceMastery'); }
  }
  // Science Affinity: use second-highest if better
  if (!triggered.includes('scienceMastery') &&
      side.typeBonuses.affinity.includes(TYPE.SCIENCE) && !side.oncePerRound.scienceAffinity) {
    const sec = [...card.s].sort((a, b) => b - a)[1];
    if (sec > contribution) { contribution = sec; triggered.push('scienceAffinity'); }
  }

  side.laneScores[laneIdx] += contribution;

  // Geometry Affinity: physical lane to the right, wrapping at the edge
  if (card.primaryType === TYPE.GEOMETRY &&
      side.typeBonuses.affinity.includes(TYPE.GEOMETRY) && !side.oncePerRound.geometryAffinity) {
    triggered.push('geometryAffinity');
    const destination = rightActiveLane(s, laneIdx);
    if (destination !== null) side.laneScores[destination]++;
  }

  // Arithmetic Affinity check
  const printedContrib = card.s[laneIdx];
  const withPrinted = side.laneScores[laneIdx] - contribution + printedContrib;
  if (side.typeBonuses.affinity.includes(TYPE.ARITHMETIC) &&
      !side.oncePerRound.arithmeticAffinity && withPrinted === opp.laneScores[laneIdx]) {
    triggered.push('arithmeticAffinity');
  }
  // Arithmetic Mastery check
  if (side.typeBonuses.mastery.includes(TYPE.ARITHMETIC) &&
      !side.oncePerBattle.arithmeticMastery &&
      side.laneScores[laneIdx] - opp.laneScores[laneIdx] === 1) {
    triggered.push('arithmeticMastery');
  }

  // Set effects (simplified for simulation)
  if (card.set) {
    const newCount = (state.ai.setCardsThisRound[card.set] || 0) + 1;
    if (newCount === 2) {
      if (card.set === 'ninefold_orchard') {
        const occ = [...new Set(state.boardCards.filter(b => b.owner === 'ai').map(b => b.currentLane))];
        occ.sort((a, b) => (side.laneScores[a] - opp.laneScores[a]) - (side.laneScores[b] - opp.laneScores[b]));
        for (const l of occ.slice(0, 2)) side.laneScores[l]++;
      } else if (card.set === 'little_reckoning') {
        const el = state.boardCards.filter(b => b.owner === 'ai' && b.card && b.card.bv <= 16);
        if (el.length) {
          const best = el.reduce((a, b) =>
            (side.laneScores[b.currentLane] - opp.laneScores[b.currentLane]) <
            (side.laneScores[a.currentLane] - opp.laneScores[a.currentLane]) ? b : a);
          side.laneScores[best.currentLane] += 3;
        }
      } else if (card.set === 'gifford') {
        let bsc = -Infinity, bm = null;
        for (const ob of state.boardCards.filter(b => b.owner === 'ai' && b.card)) {
          for (const d of state.activeLanes) {
            if (d === ob.currentLane) continue;
            const sl = [...side.laneScores];
            sl[ob.currentLane] -= ob.currentContribution;
            sl[d] += ob.card.s[d] + 1;
            const ctrl = countControlled(sl, opp.laneScores);
            if (ctrl > bsc) { bsc = ctrl; bm = { ob, d }; }
          }
        }
        if (bm) {
          side.laneScores[bm.ob.currentLane] -= bm.ob.currentContribution;
          side.laneScores[bm.d] += bm.ob.card.s[bm.d] + 1;
        }
      }
    }
  }

  return { state: s, contribution, triggered };
}

function scoreAIPlay(card, laneIdx, state) {
  const sim = simulateAIPlay(card, laneIdx, state);
  const { ai: sideSim, player: oppSim } = sim.state;
  const { ai: sidePrev, player: oppPrev } = state;

  let score = 0;

  // Lane control delta (§9)
  for (const i of state.activeLanes) {
    const before = Math.sign(sidePrev.laneScores[i] - oppPrev.laneScores[i]);
    const after = Math.sign(sideSim.laneScores[i] - oppSim.laneScores[i]);
    score += (after - before) * W.LANE_CONTROL_UNIT;
  }

  // Round position (§11)
  const bc = countControlled(sidePrev.laneScores, oppPrev.laneScores);
  const ac = countControlled(sideSim.laneScores, oppSim.laneScores);
  if (bc < 2 && ac >= 2) score += W.ROUND_WIN_GAIN;
  else if (bc >= 2 && ac >= 2) score += W.ROUND_WIN_SECURITY;
  if (oppPrev.hasPassed && projectedResult(sideSim.laneScores, oppSim.laneScores, state.activeLanes) === 'win') {
    score += W.WIN_AFTER_OPP_PASS;
  }

  // Efficiency (§13)
  const margin = sideSim.laneScores[laneIdx] - oppSim.laneScores[laneIdx];
  if (margin === 1) score += W.EXACT_ONE_AHEAD;
  else if (margin === 0) score += W.EXACT_TIE;
  else if (margin > 1) score += (margin - 1) * W.OVERKILL_PER_POINT;
  score += card.bv * W.BV_SPEND_PER_POINT;
  const maxStat = Math.max(...card.s);
  score += Math.max(0, maxStat - sim.contribution) * W.STAT_WASTE_PER_POINT;
  if (card.primaryType >= 0 && laneIdx !== card.primaryType) score += 4;

  // Type ability use (§16)
  if (sim.triggered.some(t => t.endsWith('Affinity'))) score += W.TYPE_AFFINITY_USE;
  if (sim.triggered.some(t => t.endsWith('Mastery'))) score += W.TYPE_MASTERY_USE;

  // Set sequencing (§18)
  if (card.set) {
    const cnt = (state.ai.setCardsThisRound[card.set] || 0) + 1;
    score += [W.SET_FIRST_CARD, W.SET_SECOND_CARD, W.SET_THIRD_CARD, W.SET_FOURTH_PLUS][Math.min(cnt - 1, 3)];
  }

  // Position (§15)
  const prevMargin = sidePrev.laneScores[laneIdx] - oppPrev.laneScores[laneIdx];
  if (prevMargin < 0) score += W.WEAK_LANE_SUPPORT;
  if (prevMargin >= 8) score += W.STRONG_LANE_OVERCOMMIT;

  // Match state (§24)
  if (state.playerRoundsWon === 1 && ac >= 2) score += W.MATCH_POINT_WIN;
  if (state.aiRoundsWon === 1 && ac >= 2) score += W.MATCH_POINT_WIN;

  // Match mode modifier (§22-23)
  const { aiRoundsWon: aw, playerRoundsWon: pw } = state;
  let cMult = 1.0, rMult = 1.0;
  if (aw === 1 && pw === 0) { cMult = 0.95; rMult = 1.30; }
  else if (aw === 0 && pw === 1) { cMult = 1.15; rMult = 0.75; }
  else if (aw === 1 && pw === 1) { cMult = 1.20; rMult = 0.60; }

  // Round number and hand pressure (§26-27)
  const rndMult = state.roundNumber === 1 ? 1.10 : state.roundNumber === 3 ? 0.75 : 1.0;
  const cardDiff = (state.ai.hand.length + state.ai.reserveDeck.length) -
                   (state.player.hand.length + state.player.reserveDeck.length);
  const pressureMult = cardDiff <= -3 ? 1.25 : cardDiff >= 3 ? 0.85 : 1.0;
  rMult *= rndMult * pressureMult;

  const resValue = card.bv * W.BV_SPEND_PER_POINT + Math.max(0, maxStat - sim.contribution) * W.STAT_WASTE_PER_POINT;
  const boardValue = score - resValue;
  score = boardValue * cMult + resValue * rMult;

  return { score, contribution: sim.contribution, triggered: sim.triggered };
}

function chooseBestAIPlay(state) {
  const rarity = state._aiTargetRarity || 'common';
  const acc = { legendary: 1.0, epic: 0.95, rare: 0.85, uncommon: 0.70, common: 0.55 }[rarity] || 0.70;
  const maxErr = { legendary: 0, epic: 4, rare: 8, uncommon: 12, common: 18 }[rarity] || 10;

  let best = null;
  let bestScore = -Infinity;
  const all = [];

  for (let i = 0; i < state.ai.hand.length; i++) {
    const card = state.ai.hand[i];
    for (const lane of state.activeLanes) {
      const { score, contribution, triggered } = scoreAIPlay(card, lane, state);
      all.push({ handIdx: i, lane, score, contribution, triggered, card });
      if (score > bestScore || (score === bestScore && (!best || contribution > best.contribution))) {
        bestScore = score;
        best = { handIdx: i, lane, score, contribution, triggered };
      }
    }
  }

  if (!best) return null;

  // Introduce imperfection for lower rarities
  if (Math.random() > acc) {
    const topN = { legendary: 1, epic: 2, rare: 3, uncommon: 4, common: 5 }[rarity] || 3;
    const candidates = all
      .filter(p => p.score >= bestScore - maxErr)
      .sort((a, b) => b.score - a.score || b.contribution - a.contribution ||
        Math.abs(a.lane - a.card.primaryType) - Math.abs(b.lane - b.card.primaryType))
      .slice(0, topN);
    return pick(candidates) || best;
  }
  return best;
}

// ===== AI PASS DECISION (ai_pass_decision_function.md) =====

function isStrongCard(card) {
  return card.bv >= 24 || Math.max(...card.s) >= 8;
}

function estimateComebackRisk(state) {
  let risk = 0;
  for (const i of state.activeLanes) {
    const m = state.ai.laneScores[i] - state.player.laneScores[i];
    if (m <= 0) continue;
    risk += m === 1 ? 3 : m === 2 ? 2 : m <= 4 ? 1 : 0;
  }
  const oh = state.player.hand.length;
  return risk * (oh >= 6 ? 1.30 : oh >= 4 ? 1.15 : oh <= 2 ? 0.70 : 1.0);
}

function estimateMinCardsToWin(state) {
  const { ai, player } = state;
  const aiCtrl = countControlled(ai.laneScores, player.laneScores);
  const need = Math.max(0, 2 - aiCtrl);
  if (need === 0) return 0;

  const deficits = [];
  for (const i of state.activeLanes) {
    if (ai.laneScores[i] <= player.laneScores[i]) {
      deficits.push({ lane: i, req: player.laneScores[i] - ai.laneScores[i] + 1 });
    }
  }
  deficits.sort((a, b) => a.req - b.req);
  if (deficits.length < need) return Infinity;

  const handCopy = [...ai.hand];
  let used = 0, lanesLeft = need;
  for (const { lane, req } of deficits.slice(0, need)) {
    handCopy.sort((a, b) => b.s[lane] - a.s[lane]);
    let running = 0, spent = 0;
    while (running < req) {
      if (spent >= handCopy.length) return Infinity;
      running += handCopy[spent].s[lane];
      spent++;
    }
    handCopy.splice(0, spent);
    used += spent;
    lanesLeft--;
    if (lanesLeft === 0) return used;
  }
  return Infinity;
}

function isRoundUnwinnable(state) {
  const { ai, player } = state;
  const aiCtrl = countControlled(ai.laneScores, player.laneScores);
  const need = Math.max(0, 2 - aiCtrl);
  if (need === 0) return false;
  const deficits = [];
  for (const i of state.activeLanes) {
    if (ai.laneScores[i] <= player.laneScores[i]) {
      deficits.push({ lane: i, req: player.laneScores[i] - ai.laneScores[i] + 1 });
    }
  }
  if (deficits.length < need) return true;
  let wins = 0;
  for (const { lane, req } of deficits) {
    if (ai.hand.reduce((s, c) => s + c.s[lane], 0) >= req) wins++;
  }
  return wins < need;
}

export function decideAIPass(state) {
  const { ai, player, aiRoundsWon: aw, playerRoundsWon: pw } = state;
  if (ai.hand.length === 0 && ai.ingenuityTokens === 0) return true;

  const aiCardsOnBoard = state.boardCards.filter(bc => bc.owner === 'ai').length;
  if (aiCardsOnBoard < 2) return false;

  if (player.hasPassed) {
    if (projectedResult(ai.laneScores, player.laneScores, state.activeLanes) === 'win') return true;
    if (isRoundUnwinnable(state)) return true;
    return false;
  }

  if (isRoundUnwinnable(state)) return true;

  const aiCtrl = countControlled(ai.laneScores, player.laneScores);
  const risk = estimateComebackRisk(state);

  if (aw === 1 && pw === 1) {
    return aiCtrl >= 2 && risk <= 5;
  }
  if (aiCtrl === 3 && (ai.hand.length <= 5 || risk <= 8)) return true;
  if (aiCtrl === 2) {
    const allSafe = state.activeLanes.every(l =>
      ai.laneScores[l] <= player.laneScores[l] || ai.laneScores[l] - player.laneScores[l] >= 4);
    if (allSafe && ai.hand.length <= 6) return true;
    if (ai.hand.length <= 4 && (player.hand.length + player.reserveDeck.length) < 3) return true;
    if (ai.hand.length <= 4 &&
        !state.activeLanes.some(l => ai.laneScores[l] > player.laneScores[l] && ai.laneScores[l] - player.laneScores[l] <= 2)) return true;
    if (ai.hand.filter(isStrongCard).length >= 3 && risk < 9) return true;
  }

  const cardsNeeded = estimateMinCardsToWin(state);
  const strongCount = ai.hand.filter(isStrongCard).length;

  if (aw === 1 && pw === 0) {
    if (cardsNeeded >= 3) return true;
    if (cardsNeeded === 2 && strongCount >= 2) return true;
  }
  if (aw === 0 && pw === 1) {
    if (cardsNeeded === Infinity) return true;
    if (cardsNeeded <= 4) return false;
    if (cardsNeeded === 5 && ai.hand.length >= 6) return false;
    return true;
  }
  if (cardsNeeded === Infinity) return true;
  if (cardsNeeded >= 4) return true;
  if (cardsNeeded === 3 && strongCount >= 2) return true;

  // Fallback numeric comparison
  const passScore = aiCtrl * 14 - (3 - aiCtrl) * 10 +
    (aw === 1 && pw === 0 ? 18 : aw === 0 && pw === 1 ? -20 : 0) +
    (state.roundNumber === 1 ? 8 : state.roundNumber === 3 ? -20 : 2);
  const bestPlay = chooseBestAIPlay(state);
  if (bestPlay && passScore >= bestPlay.score + 5) return true;
  return false;
}

// ===== AI TURN =====

export function doAITurn(state) {
  if (state.pendingAbility) return state;
  if (state.currentTurn !== 'ai') return state;
  if (state.ai.hasPassed) return state;
  if (state.battleFinished) return state;

  if (decideAIPass(state)) return passTurn(state, 'ai');

  if (state.ai.ingenuityTokens > 0) {
    const tokenLane = state.activeLanes
      .map(lane => ({ lane, margin: state.ai.laneScores[lane] - state.player.laneScores[lane] }))
      .filter(x => x.margin === 0 || x.margin === -1)
      .sort((a, b) => b.margin - a.margin)[0];
    if (tokenLane) return playIngenuityToken(state, 'ai', tokenLane.lane);
  }

  const best = chooseBestAIPlay(state);
  if (!best) return passTurn(state, 'ai');

  // best.triggered records which boosts scoreAIPlay's simulation assumed when it picked this
  // play as best — playCard must be told to actually apply them, or the AI scores moves for a
  // bonus (Science Affinity/Mastery) it can then never receive.
  const aiOptions = {
    useScienceMastery: (best.triggered || []).includes('scienceMastery'),
    useScienceAffinity: (best.triggered || []).includes('scienceAffinity'),
  };
  let s = playCard(state, 'ai', best.handIdx, best.lane, aiOptions);

  // Opportunistically use Geometry Mastery after AI plays if it helps
  if (!s.pendingAbility && !s.battleFinished) {
    const cardId = bestGeometryMasteryMove(s, 'ai');
    if (cardId) s = activateGeometryMastery(s, 'ai', cardId);
  }

  return s;
}

// ===== BATTLE SETUP ENTRY POINTS =====

export function setupChallengeBattle(playerDeckCards, targetCard, cardPool) {
  const bvCap = AI_BV[(targetCard.r || 'common').toLowerCase()] || AI_BV.common;
  const deckSpec = buildAIDeck(targetCard, bvCap, cardPool);
  const byId = Object.fromEntries(cardPool.map(c => [c.id, c]));
  const aiCards = [];
  for (const { cardId, count } of deckSpec) {
    const card = byId[cardId];
    if (card) for (let i = 0; i < count; i++) aiCards.push(card);
  }
  const state = initBattle(playerDeckCards, aiCards);
  state._aiTargetRarity = (targetCard.r || 'common').toLowerCase();
  state._battleType = 'challenge';
  state._targetCardId = targetCard.id;
  return state;
}

export function setupFriendlyBattle(playerDeckCards, targetCard, cardPool) {
  const bvCap = AI_BV[(targetCard.r || 'common').toLowerCase()] || AI_BV.common;
  const deckSpec = buildAIDeck(targetCard, bvCap, cardPool);
  const byId = Object.fromEntries(cardPool.map(c => [c.id, c]));
  const aiCards = [];
  for (const { cardId, count } of deckSpec) {
    const card = byId[cardId];
    if (card) for (let i = 0; i < count; i++) aiCards.push(card);
  }
  const state = initBattle(playerDeckCards, aiCards);
  state._aiTargetRarity = (targetCard.r || 'common').toLowerCase();
  state._battleType = 'friendly';
  state._targetCardId = targetCard.id;
  return state;
}

// ===== COLLECTION HELPERS =====

// Derive artwork state from progress fields (§53)
export function artworkState(cardId, moduleProgress) {
  const qty = moduleProgress.cards?.[cardId] ?? 0;
  if (qty >= 1) return 'OWNED_COLOUR';
  if (moduleProgress.challengeUnlocked?.[cardId]) return 'REVEALED_BLACK_AND_WHITE';
  return 'HIDDEN';
}

// Spend a challenge token to unlock a regular card's challenge (§33)
export function spendChallengeToken(moduleProgress, cardId) {
  if (moduleProgress.challengeTokens <= 0) return moduleProgress;
  if (moduleProgress.challengeUnlocked?.[cardId]) return moduleProgress;
  return {
    ...moduleProgress,
    challengeTokens: moduleProgress.challengeTokens - 1,
    challengeUnlocked: { ...moduleProgress.challengeUnlocked, [cardId]: true },
  };
}

// Apply battle result to module progress (§55, §56)
// battleType: 'challenge' | 'friendly'
// result: 'win' | 'loss' | 'draw'
// targetCardId: the character being challenged
// stakedCardId: the card staked (challenge only)
export function applyBattleResult(moduleProgress, battleType, result, targetCardId, stakedCardId) {
  const p = { ...moduleProgress, cards: { ...moduleProgress.cards } };
  if (battleType === 'challenge') {
    if (result === 'win') {
      p.cards[targetCardId] = (p.cards[targetCardId] || 0) + 1;
    } else if (result === 'loss' && stakedCardId) {
      const qty = p.cards[stakedCardId] || 0;
      if (qty > 0) p.cards[stakedCardId] = qty - 1;
    }
  }
  // Friendly: no collection changes
  return p;
}
