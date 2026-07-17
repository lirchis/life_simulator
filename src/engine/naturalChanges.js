import { addTrait, normalizeState, removeTrait } from "./effects.js";
import { applyNaturalLifeCourse } from "./lifeCourse.js?v=continuity-1";

export function applyNaturalChanges(state) {
  if (state.meta.age <= 0 || !state.meta.isAlive) return;

  applyNaturalLifeCourse(state);
  applyHealthDrift(state);
  updateHealthTraits(state);
  normalizeState(state);
}

function applyHealthDrift(state) {
  const target = healthTarget(state);
  const health = state.resources.health;

  if (health < target) {
    const gap = target - health;
    const recovery = Math.ceil(Math.min(6, gap / 8 + state.attrs.physique / 4 + state.environment.healthcareAccess / 3));
    state.resources.health += health <= 20 ? Math.min(recovery, 3) : recovery;
    return;
  }

  if (state.meta.age >= 45 && health > target) {
    const gap = health - target;
    const decline = Math.ceil(Math.min(4, gap / 14 + (state.meta.age - 45) / 30));
    state.resources.health -= decline;
  }
}

function healthTarget(state) {
  const age = state.meta.age;
  const agePenalty = age < 35
    ? 0
    : age < 55
      ? (age - 35) * 0.35
      : 7 + (age - 55) * 0.8;
  const infantPenalty = age < 5 ? 4 : 0;
  const base = 50 + state.attrs.physique * 4 + state.environment.healthcareAccess * 2 + state.resources.wealth / 20;
  return Math.round(base - agePenalty - infantPenalty);
}

function updateHealthTraits(state) {
  if (state.resources.health <= 35) {
    state.counters.lowHealthYears = (state.counters.lowHealthYears ?? 0) + 1;
  } else {
    state.counters.lowHealthYears = Math.max(0, (state.counters.lowHealthYears ?? 0) - 1);
  }

  if (state.resources.health <= 25) addTrait(state, "frail_body");
  if (state.resources.health >= 60) removeTrait(state, "frail_body");
  if (state.counters.lowHealthYears >= 3) addTrait(state, "chronic_weakness");
}
