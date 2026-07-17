import { applyEffects } from "./effects.js?v=shadow-1";
import { weightedPick } from "./random.js";

export function attachHistoricalLife(state, historicalLives = [], context = {}) {
  const forcedId = context.forceHistoricalLifeId;
  const forced = forcedId ? historicalLives.find((life) => life.id === forcedId) : null;
  const eligible = forced ? [forced] : historicalLives.filter((life) => matchesTrigger(life.trigger, state));
  if (!eligible.length) return null;

  const selected = forced ?? weightedPick(eligible, (life) => life.selectionWeight ?? 1, context.rng);
  if (!selected) return null;
  if (!forced && context.rng() >= selected.matchChance) return null;

  state.chronicle = { id: selected.id };
  applyEffects(selected.initialEffects ?? [], state, { id: `chronicle:${selected.id}:initial` });
  return selected;
}

export function getHistoricalLife(historicalLives = [], id) {
  return historicalLives.find((life) => life.id === id) ?? null;
}

function matchesTrigger(trigger, state) {
  if (!trigger) return false;
  if (!inRange(state.birth.year, trigger.birthYearRange)) return false;
  if (trigger.genders && !trigger.genders.includes(state.birth.gender)) return false;
  if (trigger.provinces && !trigger.provinces.includes(state.birth.province)) return false;
  if (trigger.provinceHistoryCodes && !trigger.provinceHistoryCodes.includes(state.birth.provinceHistoryCode)) return false;
  if (trigger.cityTiers && !trigger.cityTiers.includes(state.birth.cityTier)) return false;
  if (trigger.hukou && !trigger.hukou.includes(state.birth.hukou)) return false;
  if (trigger.familyClasses && !trigger.familyClasses.includes(state.birth.familyClass)) return false;

  for (const [key, limits] of Object.entries(trigger.attrs ?? {})) {
    const value = state.attrs[key];
    if (limits.gte !== undefined && value < limits.gte) return false;
    if (limits.lte !== undefined && value > limits.lte) return false;
  }
  return true;
}

function inRange(value, range) {
  return !range || (value >= range[0] && value <= range[1]);
}
