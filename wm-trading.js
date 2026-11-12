export const TRADE_MODULES = ["primary", "junior", "intermediate"];

export const TRADE_LIMITS = Object.freeze({
  activeListings: 3,
  pendingOffersPerListing: 1,
  listingDays: 7,
});

export const TRADE_CARD_IDS = Object.freeze({
  junior: Object.freeze([
    "addy", "countra", "tritip", "cubble", "hunchik", "sparkfin", "zoomby", "pebble", "loopy", "burrowl",
    "squarby", "frostcal", "multimoo", "anglorap", "owlgorith", "flaskfox", "cheetawat", "fractail", "hexabug",
    "voltbird", "probear", "seqviper", "primearch", "geodrake", "paradox", "quantakit", "sphinxa", "novabear",
    "infinitus", "euclidon",
  ]),
  primary: Object.freeze([
    "pip", "nine", "bramble", "sorrel", "russet", "halfpenny", "wicker", "furrow", "dapple", "bushel", "tuppence",
    "windfall", "cornix", "thistlewick", "beeswax", "kernel", "millrace", "cobweb", "amberly", "barrow", "driftwood",
    "gable", "warden", "harvestmoon", "ninebark", "cascade", "longshadow", "gossamer", "ninefoldtree", "tenthscarecrow",
  ]),
  intermediate: Object.freeze([
    "gf_aldous", "gf_theengine", "gf_prewitt", "gf_vane", "gf_ashcombe", "gf_thorncastle", "gf_halloway", "gf_kell",
    "gf_tessa", "gf_kade", "gf_bramwell", "gf_adelina", "gf_whistle", "gf_fenn", "gf_delphine", "gf_growl",
    "gf_pemberton", "gf_maude", "gf_rooke", "gf_corvain", "gf_marrow", "gf_tambrindle", "gf_nettle", "gf_higgins",
    "gf_marta", "gf_jory", "gf_ratchet", "gf_colworth", "gf_pip", "gf_adavoss",
  ]),
});

const CARD_MODULE = new Map(TRADE_MODULES.flatMap((moduleKey) => TRADE_CARD_IDS[moduleKey].map((cardId) => [cardId, moduleKey])));

export function tradeCardModule(cardId) {
  return CARD_MODULE.get(String(cardId || "")) || null;
}

export function ownedCardCount(progress, cardId) {
  const count = Number(progress?.cards?.[cardId] || 0);
  return Number.isSafeInteger(count) && count > 0 ? count : 0;
}

export function isTradeableDuplicate(progress, moduleKey, cardId, reservedCount = 0) {
  if (tradeCardModule(cardId) !== moduleKey) return false;
  if ((progress?.cardItems?.[cardId] || []).length >= 3) return false;
  return ownedCardCount(progress, cardId) - Math.max(0, reservedCount) >= 2;
}

