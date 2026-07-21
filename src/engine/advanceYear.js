import { weightedPick } from "./random.js";
import { calculateEnvironment } from "./environment.js";
import { getEventCount, getLifeStage } from "./stage.js";
import { clone } from "./path.js";
import { applyEffects, makeEffectSummary, writeSnapshot } from "./effects.js?v=future-history-3";
import { matchConditions } from "./conditions.js?v=future-history-3";
import { applyNaturalChanges } from "./naturalChanges.js?v=future-history-3";
import { getHistoricalLife } from "./historicalLives.js?v=shadow-1";
import { composeQuietYearText } from "./quietYearText.js?v=future-history-3";
import { applyEventLifeCourse, matchLifeCourse } from "./lifeCourse.js?v=future-history-3";
import {
  beginNarrativeYear,
  getNarrativeDomain,
  getNarrativeTier,
  narrativePool,
  narrativeSnapshot,
  narrativeWeightMultiplier,
  recordNarrativeEvent,
} from "./narrative.js?v=shadow-1";

export function advanceYear(state, data, context) {
  if (!state.meta.isAlive) return { logs: [], ended: true };
  if (state.chronicle?.id) return advanceChronicleYear(state, data, context);

  state.meta.age += 1;
  state.meta.currentYear = state.birth.year + state.meta.age;
  state.meta.stage = getLifeStage(state.meta.age);
  state.environment = calculateEnvironment(state, context.aggregateRegistry);
  tickCooldowns(state);
  removeExpiredTimedModifiers(state);
  const beforeNatural = clone(state);
  applyNaturalChanges(state);
  recordYearlyChange(beforeNatural, state);
  beginNarrativeYear(state);

  const candidates = uniqueEvents([...baseCandidates(state, data.events, context), ...scheduledCandidates(state, data.events, context)]);
  const selected = selectEvents(candidates, state, context);
  const logs = [];

  for (const event of selected) {
    if (!state.meta.isAlive) break;
    if (!matchConditions(event.conditions, state, context) || !matchLifeCourse(event, state)) continue;
    const displayText = selectText(event.text, state, context, event.id);
    const outcome = selectOutcome(event, state, context);
    logs.push(applyEvent(event, outcome, state, context, displayText));
  }

  writeSnapshot(state);
  return { logs, ended: !state.meta.isAlive };
}

function advanceChronicleYear(state, data, context) {
  const life = getHistoricalLife(data.historicalLives, state.chronicle.id);
  if (!life) throw new Error(`Missing historical life: ${state.chronicle.id}`);

  state.meta.age += 1;
  state.meta.currentYear = state.birth.year + state.meta.age;
  state.meta.stage = getLifeStage(state.meta.age);
  state.environment = calculateEnvironment(state, context.aggregateRegistry);

  const entry = life.timeline.find((item) => item.year === state.meta.currentYear);
  if (!entry) throw new Error(`Historical life ${life.id} has no entry for ${state.meta.currentYear}`);

  const event = {
    id: `${life.id}:${entry.year}`,
    title: entry.title,
    category: entry.category,
    text: entry.text,
    effects: entry.effects ?? [],
    narrativeTier: "chronicle",
    priority: 100,
    maxOccurrences: 1,
  };
  const log = applyEvent(event, null, state, context, entry.text);
  writeSnapshot(state);
  return { logs: [log], ended: !state.meta.isAlive };
}

function recordYearlyChange(before, state) {
  const effectsSummary = makeEffectSummary(before, state);
  if (!effectsSummary.length) return;
  state.yearlyChanges ??= [];
  state.yearlyChanges.push({
    age: state.meta.age,
    year: state.meta.currentYear,
    effectsSummary,
  });
}

export function applyEvent(event, outcome, state, context, displayText = selectText(event.text, state, context, event.id)) {
  const before = clone(state);
  applyEffects(event.effects ?? [], state, event);
  if (outcome) applyEffects(outcome.effects ?? [], state, event);
  applyEventLifeCourse(event, outcome, before, state);
  recordOccurrence(event, state);
  recordNarrativeEvent(event, state);
  if (event.cooldown) state.cooldowns[event.id] = event.cooldown;

  const log = {
    age: state.meta.age,
    year: state.meta.currentYear,
    eventId: event.id,
    title: event.title,
    text: displayText,
    category: event.category,
    priority: event.priority ?? 0,
    narrativeTier: getNarrativeTier(event),
    narrativeDomain: getNarrativeDomain(event),
    outcomeId: outcome?.id,
    resultText: outcome?.resultText ?? "",
    effectsSummary: makeEffectSummary(before, state),
    continuityBefore: lifeCourseSnapshot(before),
    continuityAfter: lifeCourseSnapshot(state),
    narrativeBefore: narrativeSnapshot(before),
    narrativeAfter: narrativeSnapshot(state),
    shadowBefore: clone(before.shadow),
    shadowAfter: clone(state.shadow),
    death: !state.meta.isAlive,
  };
  state.history.push(log);
  return log;
}

function lifeCourseSnapshot(state) {
  return {
    education: {
      status: state.education.status,
      currentLevel: state.education.currentLevel,
      completedLevel: state.education.completedLevel,
      mode: state.education.mode,
      concurrentCareer: state.education.concurrentCareer,
    },
    career: {
      status: state.career.status,
      field: state.career.field,
      jobsHeld: state.career.jobsHeld,
      role: state.career.role,
      authorityScope: state.career.authorityScope,
      managesPeople: state.career.managesPeople,
      controlsBudget: state.career.controlsBudget,
      writesPolicy: state.career.writesPolicy,
      controlsProcurement: state.career.controlsProcurement,
    },
    primaryActivity: state.lifeCourse.primaryActivity,
  };
}

function selectOutcome(event, state, context) {
  if (!event.outcomes?.length) return null;
  const eligible = event.outcomes.filter((outcome) => matchConditions(outcome.conditions, state, context));
  return weightedPick(eligible, (outcome) => calculateOutcomeWeight(outcome, state, context), context.rng);
}

function calculateOutcomeWeight(outcome, state, context) {
  let weight = outcome.baseWeight ?? 1;
  for (const modifier of outcome.weightModifiers ?? []) {
    if (!matchConditions({ all: [modifier] }, state, context)) continue;
    if (modifier.add) weight += modifier.add;
    if (modifier.multiply) weight *= modifier.multiply;
  }
  return weight;
}

function selectEvents(candidates, state, context) {
  const count = getEventCount(state.meta.age, context.rng);
  const selected = [];
  const priorityEvents = candidates.filter((event) => event.priority);

  if (priorityEvents.length) {
    const maxPriority = Math.max(...priorityEvents.map((event) => event.priority));
    const top = priorityEvents.filter((event) => event.priority === maxPriority);
    const picked = weightedPick(top, (event) => calculateWeight(event, state, context), context.rng);
    if (picked) selected.push(picked);
  }

  // A scheduled continuation may compete with hundreds of otherwise valid
  // events for several years. On the last authored year, keep it from
  // disappearing by chance. Major priority events stay first, so death can
  // still end a life naturally; if the person survives, the open thread gets
  // its promised continuation in the same year.
  for (const event of candidates.filter((item) => scheduledAtDeadline(item, state))) {
    if (!selected.some((item) => item.id === event.id)) selected.push(event);
  }

  while (selected.length < count) {
    if (selected.some(changesLocation)) break;
    const eligible = candidates.filter((event) => !event.priority && !selected.some((item) => item.id === event.id));
    const pool = narrativePool(eligible, state);
    const picked = weightedPick(pool, (event) => calculateWeight(event, state, context), context.rng);
    if (!picked) break;
    selected.push(picked);
  }

  return selected;
}

function scheduledAtDeadline(event, state) {
  return state.scheduledEvents.some((scheduled) => scheduled.eventId === event.id
    && scheduled.earliestYear <= state.meta.currentYear
    && scheduled.latestYear === state.meta.currentYear);
}

function baseCandidates(state, events, context) {
  return events
    .filter((event) => matchTime(event, state))
    .filter((event) => matchGenderFilters(event, state))
    .filter((event) => matchFamilyFilters(event, state))
    .filter((event) => matchRegionFilters(event, state, context))
    .filter((event) => matchDependencies(event, state))
    .filter((event) => matchConditions(event.conditions, state, context))
    .filter((event) => matchLifeCourse(event, state))
    .filter((event) => matchLifetimeProbability(event, state))
    .filter((event) => matchTriggerProbability(event, state, context))
    .filter((event) => matchOccurrenceRules(event, state));
}

function scheduledCandidates(state, events, context) {
  const due = state.scheduledEvents.filter((item) => item.earliestYear <= state.meta.currentYear && item.latestYear >= state.meta.currentYear);
  const ids = new Set(due.map((item) => item.eventId));
  return events
    .filter((event) => ids.has(event.id))
    .filter((event) => matchTime(event, state))
    .filter((event) => matchGenderFilters(event, state))
    .filter((event) => matchFamilyFilters(event, state))
    .filter((event) => matchRegionFilters(event, state, context))
    .filter((event) => matchDependencies(event, state))
    .filter((event) => matchConditions(event.conditions, state, context))
    .filter((event) => matchLifeCourse(event, state))
    .filter((event) => matchLifetimeProbability(event, state))
    .filter((event) => matchTriggerProbability(event, state, context))
    .filter((event) => matchOccurrenceRules(event, state));
}

function matchLifetimeProbability(event, state) {
  const configured = event.lifetimeProbability ?? (event.id.startsWith("daily_") ? 0.38 : undefined);
  if (configured === undefined) return true;
  const probability = Math.min(1, Math.max(0, configured));
  if (stableUnitInterval(`${state.meta.seed}|${event.id}`) < probability) return true;

  // Lifetime probability keeps openings diverse, but it must not be allowed
  // to erase every structural candidate for a long stretch. Only explicitly
  // authored safety-net arcs may re-enter after prolonged texture; rare harm,
  // mortality and ordinary one-off events keep their original probability.
  return event.narrativeSafetyNet === true && narrativeSafetyNetDue(state);
}

function narrativeSafetyNetDue(state) {
  const narrative = state.narrative ?? {};
  const child = state.meta.age <= 12;
  const textureLimit = child ? 5 : 4;
  const gapLimit = child ? 6 : 5;
  return (narrative.textureStreak ?? 0) >= textureLimit
    || (narrative.yearsSinceStructural ?? 0) >= gapLimit;
}

function stableUnitInterval(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4294967296;
}

function matchTriggerProbability(event, state, context) {
  if (event.triggerProbability === undefined) return true;
  let probability = event.triggerProbability;
  for (const modifier of event.probabilityModifiers ?? []) {
    if (!matchConditions({ all: [modifier] }, state, context)) continue;
    if (modifier.add) probability += modifier.add;
    if (modifier.multiply) probability *= modifier.multiply;
  }
  return context.rng() < Math.min(1, Math.max(0, probability));
}

function calculateWeight(event, state, context) {
  let weight = event.baseWeight ?? 1;
  for (const modifier of event.weightModifiers ?? []) {
    if (!matchConditions({ all: [modifier] }, state, context)) continue;
    if (modifier.add) weight += modifier.add;
    if (modifier.multiply) weight *= modifier.multiply;
  }
  for (const modifier of state.timedModifiers) {
    if (!matchesTimedModifier(event, modifier, state)) continue;
    if (modifier.add) weight += modifier.add;
    if (modifier.multiply) weight *= modifier.multiply;
  }
  weight = applyRepeatPenalty(event, weight, state);
  weight *= narrativeWeightMultiplier(event, state);
  for (const scheduled of state.scheduledEvents) {
    if (scheduled.eventId !== event.id) continue;
    if (scheduled.earliestYear > state.meta.currentYear || scheduled.latestYear < state.meta.currentYear) continue;
    if (scheduled.probability && context.rng() > scheduled.probability) return 0;
    if (scheduled.weight) weight += scheduled.weight;
    if (scheduled.weightMultiplier) weight *= scheduled.weightMultiplier;
  }
  return weight;
}

function applyRepeatPenalty(event, weight, state) {
  const occurred = state.occurredEvents[event.id];
  if (!occurred?.count) return weight;

  const defaultMultiplier = event.id === "life_quiet_year"
    ? 0.28
    : event.id.startsWith("daily_")
      ? 0.42
      : 0.55;
  const multiplier = event.repeatWeightMultiplier ?? defaultMultiplier;
  let adjusted = weight * Math.pow(multiplier, Math.min(occurred.count, 6));
  const yearsSinceLast = state.meta.currentYear - occurred.lastYear;
  if (yearsSinceLast <= 1) adjusted *= 0.08;
  else if (yearsSinceLast <= 3) adjusted *= 0.35;
  return adjusted;
}

function matchesTimedModifier(event, modifier, state) {
  if (modifier.endYear < state.meta.currentYear) return false;
  if (modifier.target.eventId) return event.id === modifier.target.eventId;
  if (modifier.target.eventTag) return event.tags?.includes(modifier.target.eventTag);
  if (modifier.target.category) return event.category === modifier.target.category;
  return false;
}

function matchTime(event, state) {
  const { age, currentYear, stage } = state.meta;
  if (event.ageRange && (age < event.ageRange[0] || age > event.ageRange[1])) return false;
  if (event.yearRange && (currentYear < event.yearRange[0] || currentYear > event.yearRange[1])) return false;
  if (event.birthYearRange && (state.birth.year < event.birthYearRange[0] || state.birth.year > event.birthYearRange[1])) return false;
  if (event.stage && !event.stage.includes(stage)) return false;
  return true;
}

function matchFamilyFilters(event, state) {
  if (event.birthFamilyClasses && !event.birthFamilyClasses.includes(state.birth.familyClass)) return false;
  if (event.familyTags && !event.familyTags.some((tag) => state.tags.includes(tag))) return false;
  if (event.blockFamilyTags?.some((tag) => state.tags.includes(tag))) return false;
  return true;
}

function matchGenderFilters(event, state) {
  if (event.genders && !event.genders.includes(state.birth.gender)) return false;
  return true;
}

function matchRegionFilters(event, state, context) {
  return matchRegionFilter(event.birthRegions, {
    gender: state.birth.gender,
    province: state.birth.province,
    cityTier: state.birth.cityTier,
    hukou: state.birth.hukou,
  }, context) && matchRegionFilter(event.currentRegions, {
    gender: state.birth.gender,
    province: state.location.currentProvince,
    cityTier: state.location.currentCityTier,
    hukou: state.birth.hukou,
  }, context);
}

function matchRegionFilter(filter, source, context) {
  if (!filter) return true;
  if (filter.provinces && !filter.provinces.includes(source.province)) return false;
  if (filter.provinceGroups && !filter.provinceGroups.some((id) => context.aggregateRegistry.includes(id, source.province))) return false;
  if (filter.regions && !filter.regions.includes(source.region)) return false;
  if (filter.cityTiers && !filter.cityTiers.includes(source.cityTier)) return false;
  if (filter.cityTierGroups && !filter.cityTierGroups.some((id) => context.aggregateRegistry.includes(id, source.cityTier))) return false;
  if (filter.hukou && !filter.hukou.includes(source.hukou)) return false;
  if (filter.genders && !filter.genders.includes(source.gender)) return false;
  return true;
}

function matchDependencies(event, state) {
  if (event.requiresEvents?.some((id) => !state.occurredEvents[id])) return false;
  if (event.blocksEvents?.some((id) => state.occurredEvents[id])) return false;
  if (event.requiresAnyEvent?.length && !event.requiresAnyEvent.some((id) => state.occurredEvents[id])) return false;
  if (event.blocksAnyEvent?.some((id) => state.occurredEvents[id])) return false;
  return true;
}

function matchOccurrenceRules(event, state) {
  const maxOccurrences = event.maxOccurrences ?? (event.id.startsWith("daily_") ? 1 : null);
  if (maxOccurrences && (state.occurredEvents[event.id]?.count ?? 0) >= maxOccurrences) return false;
  if (event.cooldown && state.cooldowns[event.id] > 0) return false;
  return true;
}

function changesLocation(event) {
  const effects = [...(event.effects ?? []), ...(event.outcomes ?? []).flatMap((outcome) => outcome.effects ?? [])];
  return effects.some((effect) => effect.path?.startsWith("location.") && Object.hasOwn(effect, "set"));
}

function recordOccurrence(event, state) {
  const old = state.occurredEvents[event.id] ?? {
    count: 0,
    firstAge: state.meta.age,
    firstYear: state.meta.currentYear,
  };
  state.occurredEvents[event.id] = {
    ...old,
    count: old.count + 1,
    lastAge: state.meta.age,
    lastYear: state.meta.currentYear,
  };
}

function tickCooldowns(state) {
  for (const key of Object.keys(state.cooldowns)) state.cooldowns[key] = Math.max(0, state.cooldowns[key] - 1);
}

function removeExpiredTimedModifiers(state) {
  state.timedModifiers = state.timedModifiers.filter((modifier) => modifier.endYear >= state.meta.currentYear);
}

function uniqueEvents(events) {
  return [...new Map(events.map((event) => [event.id, event])).values()];
}

function selectText(text, state, context, eventId = "") {
  if (eventId === "life_quiet_year") return composeQuietYearText(state, context.rng);
  if (typeof text === "string") return text;
  const conditional = text.filter((item) => typeof item !== "string" && item.conditions && matchConditions(item.conditions, state, context));
  const fallback = text.filter((item) => typeof item === "string" || !item.conditions);
  let pool = conditional.length ? conditional : fallback.length ? fallback : text;
  if (eventId) {
    const used = new Set(state.history.filter((log) => log.eventId === eventId).map((log) => log.text));
    const unused = pool.filter((variant) => !used.has(variantText(variant)));
    if (unused.length) pool = unused;
  }
  const item = weightedPick(pool, (variant) => typeof variant === "string" ? 1 : variant.weight ?? 1, context.rng) ?? pool[0];
  return variantText(item);
}

function variantText(variant) {
  return typeof variant === "string" ? variant : variant.text ?? String(variant);
}
