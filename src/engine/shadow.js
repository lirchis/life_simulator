import { clamp } from "./path.js";

export const SHADOW_FIELDS = [
  "hardness",
  "guilt",
  "complicity",
  "harmDone",
  "selfDeception",
  "resentment",
  "trustDebt",
];

export function createShadowState({ attrs = {}, familyScore = 5 } = {}) {
  const mental = numeric(attrs.mental, 5);
  // Material insecurity contributes at most one point to defensive states. It
  // never initializes guilt, complicity, harm or trust debt: class is not a
  // moral proxy.
  const insecurityNudge = familyScore <= 2 ? 1 : 0;
  return {
    hardness: 2 + Math.max(0, 4 - mental) + insecurityNudge,
    guilt: 0,
    complicity: 0,
    harmDone: 0,
    // Intelligence is not treated as honesty or moral insight.  Everyone
    // starts with the same small capacity for self-protective explanation.
    selfDeception: 2,
    resentment: 2 + Math.max(0, 4 - mental) + insecurityNudge,
    trustDebt: 0,
  };
}

export function normalizeShadowState(state) {
  state.shadow ??= createShadowState();
  for (const field of SHADOW_FIELDS) {
    state.shadow[field] = clamp(Math.round(numeric(state.shadow[field], 0)), 0, 100);
  }
  return state.shadow;
}

export function evolveShadowFromEffects(before, state) {
  const shadow = normalizeShadowState(state);
  const previous = before.shadow ?? createShadowState();
  const age = state.meta?.age ?? -1;
  if (age < 8) return shadow;

  const relationshipLoss = positiveLoss(before.relationships?.family, state.relationships?.family)
    + positiveLoss(before.relationships?.friendship, state.relationships?.friendship)
    + positiveLoss(before.relationships?.romance, state.relationships?.romance)
    + positiveLoss(before.relationships?.partnerQuality, state.relationships?.partnerQuality);
  const freedomLoss = positiveLoss(before.resources?.freedom, state.resources?.freedom);
  const happinessLoss = positiveLoss(before.resources?.happiness, state.resources?.happiness);
  const materialOrStatusGain = positiveGain(before.resources?.wealth, state.resources?.wealth)
    + positiveGain(before.resources?.achievement, state.resources?.achievement)
    + positiveGain(before.resources?.reputation, state.resources?.reputation);

  // These are conservative consequence inferences. They describe defensive
  // adaptation and entanglement, not culpability. harmDone, guilt and
  // trustDebt only move when an authored effect explicitly changes them.
  if (freedomLoss + happinessLoss >= 12) shadow.hardness += 1;
  if (relationshipLoss >= 8) shadow.resentment += 1;
  if (materialOrStatusGain >= 10 && relationshipLoss + freedomLoss >= 8) {
    shadow.complicity += 1;
    shadow.selfDeception += 1;
  }

  const harmIncrease = Math.max(0, shadow.harmDone - numeric(previous.harmDone, 0));
  const guiltIncrease = Math.max(0, shadow.guilt - numeric(previous.guilt, 0));
  const trustDebtIncrease = Math.max(0, shadow.trustDebt - numeric(previous.trustDebt, 0));
  if (harmIncrease > 0) {
    shadow.hardness += Math.ceil(harmIncrease / 12);
    if (guiltIncrease === 0) shadow.selfDeception += Math.ceil(harmIncrease / 10);
  }
  if (trustDebtIncrease > 0 && guiltIncrease === 0) shadow.selfDeception += Math.ceil(trustDebtIncrease / 12);
  if (guiltIncrease > 0) shadow.selfDeception -= Math.ceil(guiltIncrease / 10);
  return normalizeShadowState(state);
}

export function applyNaturalShadowEvolution(state) {
  const shadow = normalizeShadowState(state);
  if (!state.meta?.isAlive || state.meta.age < 8) return shadow;

  const adversity = [
    state.resources.health <= 30,
    state.resources.happiness <= 28,
    state.resources.freedom <= 24,
    state.relationships.family <= 24,
    state.relationships.friendship <= 8,
  ].filter(Boolean).length;
  const support = [
    state.resources.happiness >= 65,
    state.resources.freedom >= 60,
    state.relationships.family >= 65,
    state.relationships.friendship >= 55,
  ].filter(Boolean).length;

  if (adversity >= 3 && state.meta.currentYear % 3 === 0) {
    shadow.hardness += 1;
    shadow.resentment += 1;
  } else if (support >= 3 && state.meta.currentYear % 4 === 0) {
    shadow.resentment -= 1;
  }

  // Repeatedly carrying harm while recording almost no guilt can harden a
  // self-protective story. This does not erase or punish the underlying harm.
  if (shadow.harmDone >= 15 && shadow.guilt <= 5 && state.meta.currentYear % 5 === 0) {
    shadow.selfDeception += 1;
  }
  return normalizeShadowState(state);
}

export function shadowSnapshot(state) {
  const shadow = normalizeShadowState(state);
  return Object.fromEntries(SHADOW_FIELDS.map((field) => [field, shadow[field]]));
}

function positiveLoss(before, after) {
  return Math.max(0, numeric(before, 0) - numeric(after, 0));
}

function positiveGain(before, after) {
  return Math.max(0, numeric(after, 0) - numeric(before, 0));
}

function numeric(value, fallback) {
  return Number.isFinite(Number(value)) ? Number(value) : fallback;
}
