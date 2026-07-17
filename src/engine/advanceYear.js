import { weightedPick } from "./random.js";
import { calculateEnvironment } from "./environment.js";
import { getEventCount, getLifeStage } from "./stage.js";
import { clone } from "./path.js";
import { applyEffects, makeEffectSummary, writeSnapshot } from "./effects.js";
import { matchConditions } from "./conditions.js";
import { applyNaturalChanges } from "./naturalChanges.js";

export function advanceYear(state, data, context) {
  if (!state.meta.isAlive) return { logs: [], ended: true };

  state.meta.age += 1;
  state.meta.currentYear = state.birth.year + state.meta.age;
  state.meta.stage = getLifeStage(state.meta.age);
  state.environment = calculateEnvironment(state, context.aggregateRegistry);
  tickCooldowns(state);
  removeExpiredTimedModifiers(state);
  const beforeNatural = clone(state);
  applyNaturalChanges(state);
  recordYearlyChange(beforeNatural, state);

  const candidates = uniqueEvents([...baseCandidates(state, data.events, context), ...scheduledCandidates(state, data.events, context)]);
  const selected = selectEvents(candidates, state, context);
  const logs = [];

  for (const event of selected) {
    if (!state.meta.isAlive) break;
    const displayText = selectText(event.text, state, context);
    const outcome = selectOutcome(event, state, context);
    logs.push(applyEvent(event, outcome, state, context, displayText));
  }

  writeSnapshot(state);
  return { logs, ended: !state.meta.isAlive };
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

export function applyEvent(event, outcome, state, context, displayText = selectText(event.text, state, context)) {
  const before = clone(state);
  applyEffects(event.effects ?? [], state, event);
  if (outcome) applyEffects(outcome.effects ?? [], state, event);
  recordOccurrence(event, state);
  if (event.cooldown) state.cooldowns[event.id] = event.cooldown;

  const log = {
    age: state.meta.age,
    year: state.meta.currentYear,
    eventId: event.id,
    title: event.title,
    text: displayText,
    category: event.category,
    priority: event.priority ?? 0,
    outcomeId: outcome?.id,
    resultText: outcome?.resultText ?? "",
    effectsSummary: makeEffectSummary(before, state),
    death: !state.meta.isAlive,
  };
  state.history.push(log);
  return log;
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

  while (selected.length < count) {
    const pool = candidates.filter((event) => !event.priority && !selected.some((item) => item.id === event.id));
    const picked = weightedPick(pool, (event) => calculateWeight(event, state, context), context.rng);
    if (!picked) break;
    selected.push(picked);
  }

  return selected;
}

function baseCandidates(state, events, context) {
  return events
    .filter((event) => matchTime(event, state))
    .filter((event) => matchGenderFilters(event, state))
    .filter((event) => matchFamilyFilters(event, state))
    .filter((event) => matchRegionFilters(event, state, context))
    .filter((event) => matchDependencies(event, state))
    .filter((event) => matchConditions(event.conditions, state, context))
    .filter((event) => matchOccurrenceRules(event, state));
}

function scheduledCandidates(state, events, context) {
  const due = state.scheduledEvents.filter((item) => item.earliestYear <= state.meta.currentYear && item.latestYear >= state.meta.currentYear);
  const ids = new Set(due.map((item) => item.eventId));
  return events
    .filter((event) => ids.has(event.id))
    .filter((event) => matchTime(event, state))
    .filter((event) => matchGenderFilters(event, state))
    .filter((event) => matchRegionFilters(event, state, context))
    .filter((event) => matchDependencies(event, state))
    .filter((event) => matchConditions(event.conditions, state, context))
    .filter((event) => matchOccurrenceRules(event, state));
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
  for (const scheduled of state.scheduledEvents) {
    if (scheduled.eventId !== event.id) continue;
    if (scheduled.earliestYear > state.meta.currentYear || scheduled.latestYear < state.meta.currentYear) continue;
    if (scheduled.probability && context.rng() > scheduled.probability) return 0;
    if (scheduled.weight) weight += scheduled.weight;
    if (scheduled.weightMultiplier) weight *= scheduled.weightMultiplier;
  }
  return weight;
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
  if (event.maxOccurrences && (state.occurredEvents[event.id]?.count ?? 0) >= event.maxOccurrences) return false;
  if (event.cooldown && state.cooldowns[event.id] > 0) return false;
  return true;
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

function selectText(text, state, context) {
  if (typeof text === "string") return text;
  const conditional = text.filter((item) => typeof item !== "string" && item.conditions && matchConditions(item.conditions, state, context));
  const fallback = text.filter((item) => typeof item === "string" || !item.conditions);
  const pool = conditional.length ? conditional : fallback.length ? fallback : text;
  const item = weightedPick(pool, (variant) => typeof variant === "string" ? 1 : variant.weight ?? 1, context.rng) ?? pool[0];
  return item.text ?? String(item);
}
