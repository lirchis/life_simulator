import { clamp, clone, getPath, setPath } from "./path.js";
import { normalizeLifeCourse } from "./lifeCourse.js?v=future-history-3";
import { normalizeNarrativeState } from "./narrative.js?v=shadow-1";
import { evolveShadowFromEffects, normalizeShadowState } from "./shadow.js?v=future-history-3";

export function applyEffects(effects = [], state, sourceEvent) {
  const beforeShadowEvolution = {
    shadow: { ...(state.shadow ?? {}) },
    resources: { ...(state.resources ?? {}) },
    relationships: { ...(state.relationships ?? {}) },
  };
  for (const effect of effects) {
    if (effect.path) {
      if ("set" in effect) setPath(state, effect.path, cloneSetValue(effect.set));
      if ("add" in effect) setPath(state, effect.path, (getPath(state, effect.path) ?? 0) + effect.add);
      if ("multiply" in effect) setPath(state, effect.path, (getPath(state, effect.path) ?? 0) * effect.multiply);
    }
    if (effect.addTag) addTag(state, effect.addTag);
    if (effect.removeTag) state.tags = state.tags.filter((tag) => tag !== effect.removeTag);
    if (effect.addTrait) addTrait(state, effect.addTrait);
    if (effect.removeTrait) removeTrait(state, effect.removeTrait);
    if (effect.counter) state.counters[effect.counter] = (state.counters[effect.counter] ?? 0) + effect.add;
    if (effect.setFlag) state.flags[effect.setFlag] = effect.value;
    if (effect.cooldown) state.cooldowns[effect.cooldown] = effect.years;
    if (effect.scheduleEvent) scheduleEvent(effect.scheduleEvent, state, sourceEvent);
    if (effect.addTimedModifier) addTimedModifier(effect.addTimedModifier, state, sourceEvent);
    if (effect.initializeShadowThread) initializeShadowThread(state, effect.initializeShadowThread);
    if (effect.recordChildBirth) (state.relationships.childBirthYears ??= []).push(state.meta.currentYear);
    if (effect.die) {
      state.meta.isAlive = false;
      state.meta.deathReason = effect.die;
    }
    if (effect.triggerEnding) state.meta.endingId = effect.triggerEnding;
  }
  evolveShadowFromEffects(beforeShadowEvolution, state);
  normalizeState(state);
  normalizeLifeCourse(state);
}

function initializeShadowThread(state, id) {
  const threads = (state.shadow.threads ??= {});
  if (threads[id]) return;
  const reflectivePressure = state.attrs.mental * 2
    + state.resources.happiness / 20
    - state.shadow.hardness
    - state.shadow.selfDeception;
  threads[id] = {
    guilt: reflectivePressure >= 5 ? 3 : 0,
    justification: reflectivePressure >= 5 ? 1 : 3,
    benefitRetained: 0,
    responsibilityAccepted: 0,
    victimContact: 0,
  };
}

function cloneSetValue(value) {
  return value !== null && typeof value === "object" ? clone(value) : value;
}

export function makeEffectSummary(before, after) {
  const summary = [];
  collectDiffs(summary, before.resources, after.resources, {
    health: "健康",
    wealth: "财富",
    happiness: "幸福",
    achievement: "成就",
    reputation: "名声",
    freedom: "自由",
  });
  collectDiffs(summary, before.attrs, after.attrs, {
    physique: "体质",
    intelligence: "智力",
    charm: "魅力",
    family: "家境",
    luck: "运气",
    mental: "心态",
  });
  for (const tag of after.tags.filter((tag) => !before.tags.includes(tag) && !tag.startsWith("shadow_"))) summary.push(`获得 ${tag}`);
  for (const trait of after.traits.filter((trait) => !before.traits.includes(trait))) summary.push(`获得特质 ${trait}`);
  for (const trait of before.traits.filter((trait) => !after.traits.includes(trait))) summary.push(`失去特质 ${trait}`);
  if (!after.meta.isAlive && before.meta.isAlive) summary.push(`死亡：${after.meta.deathReason}`);
  return summary.slice(0, 6);
}

export function addTag(state, tag) {
  if (!state.tags.includes(tag)) state.tags.push(tag);
}

export function addTrait(state, trait) {
  if (!state.traits.includes(trait)) state.traits.push(trait);
}

export function removeTrait(state, trait) {
  state.traits = state.traits.filter((item) => item !== trait);
}

export function writeSnapshot(state) {
  state.snapshots.push({
    age: state.meta.age,
    year: state.meta.currentYear,
    stage: state.meta.stage,
    birth: clone(state.birth),
    location: clone(state.location),
    environment: clone(state.environment),
    attrs: clone(state.attrs),
    resources: clone(state.resources),
    relationships: clone(state.relationships),
    education: clone(state.education),
    career: clone(state.career),
    lifeCourse: clone(state.lifeCourse),
    narrative: clone(state.narrative),
    shadow: clone(state.shadow),
    traits: [...state.traits],
    tags: [...state.tags],
  });
}

export function normalizeState(state) {
  for (const key of Object.keys(state.attrs)) state.attrs[key] = clamp(Math.round(state.attrs[key]), 0, 10);
  for (const key of Object.keys(state.resources)) state.resources[key] = clamp(Math.round(state.resources[key]), 0, 100);
  for (const key of ["family", "friendship", "romance", "partnerQuality"]) {
    state.relationships[key] = clamp(Math.round(state.relationships[key]), 0, 100);
  }
  state.relationships.children = Math.max(0, Math.round(state.relationships.children));
  state.relationships.childBirthYears ??= [];
  state.relationships.childBirthYears = state.relationships.childBirthYears
    .map(Number)
    .filter((year) => Number.isFinite(year) && year <= state.meta.currentYear)
    .sort((left, right) => left - right);
  const childAges = state.relationships.childBirthYears.map((year) => Math.max(0, state.meta.currentYear - year));
  state.relationships.oldestChildAge = childAges.length ? Math.max(...childAges) : null;
  state.relationships.youngestChildAge = childAges.length ? Math.min(...childAges) : null;
  state.education.score = clamp(Math.round(state.education.score), 0, 100);
  state.career.level = clamp(Math.round(state.career.level), 0, 100);
  state.career.income = clamp(Math.round(state.career.income), 0, 100);
  normalizeNarrativeState(state);
  normalizeShadowState(state);
}

function collectDiffs(summary, before, after, labels) {
  for (const [key, label] of Object.entries(labels)) {
    const diff = after[key] - before[key];
    if (diff) summary.push(`${label} ${diff > 0 ? "+" : ""}${diff}`);
  }
}

function scheduleEvent(input, state, sourceEvent) {
  const [minDelay, maxDelay] = input.delayYears;
  state.scheduledEvents.push({
    eventId: input.eventId,
    earliestYear: state.meta.currentYear + minDelay,
    latestYear: state.meta.currentYear + maxDelay,
    weight: input.weight,
    weightMultiplier: input.weightMultiplier,
    probability: input.probability,
    sourceEventId: sourceEvent.id,
  });
}

function addTimedModifier(input, state, sourceEvent) {
  state.timedModifiers.push({
    id: input.id,
    sourceEventId: sourceEvent.id,
    startYear: state.meta.currentYear,
    endYear: state.meta.currentYear + input.durationYears,
    target: input.target,
    add: input.add,
    multiply: input.multiply,
  });
}
