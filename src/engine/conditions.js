import { getPath } from "./path.js";

export function matchConditions(group, state, context) {
  if (!group) return true;
  if (group.all && !group.all.every((condition) => matchCondition(condition, state, context))) return false;
  if (group.any && !group.any.some((condition) => matchCondition(condition, state, context))) return false;
  if (group.none && group.none.some((condition) => matchCondition(condition, state, context))) return false;
  return true;
}

export function matchCondition(condition, state, context) {
  if (condition.hasTag) return state.tags.includes(condition.hasTag);
  if (condition.missingTag) return !state.tags.includes(condition.missingTag);
  if (condition.tagIn) return condition.tagIn.some((tag) => state.tags.includes(tag));
  if (condition.tagNotIn) return condition.tagNotIn.every((tag) => !state.tags.includes(tag));
  if (condition.eventOccurred) return Boolean(state.occurredEvents[condition.eventOccurred]);
  if (condition.eventNotOccurred) return !state.occurredEvents[condition.eventNotOccurred];
  if (condition.eventOccurredWithin) {
    const occurred = state.occurredEvents[condition.eventOccurredWithin.eventId];
    return Boolean(occurred && state.meta.currentYear - occurred.lastYear <= condition.eventOccurredWithin.years);
  }
  if (condition.counter) return compareValue(state.counters[condition.counter] ?? 0, condition);
  if (condition.past) return matchPast(condition.past, state, context);
  if (condition.path) {
    const value = getPath(state, condition.path);
    if (condition.in && !condition.in.includes(value)) return false;
    if (condition.notIn && condition.notIn.includes(value)) return false;
    if (condition.inGroup && !context.aggregateRegistry.includes(condition.inGroup, value)) return false;
    if (condition.notInGroup && context.aggregateRegistry.includes(condition.notInGroup, value)) return false;
    return compareValue(value, condition);
  }
  return true;
}

function matchPast(past, state, context) {
  const snapshots = state.snapshots.filter((snapshot) => {
    if (past.atAge !== undefined && snapshot.age !== past.atAge) return false;
    if (past.atYear !== undefined && snapshot.year !== past.atYear) return false;
    if (past.ageRange && (snapshot.age < past.ageRange[0] || snapshot.age > past.ageRange[1])) return false;
    if (past.yearRange && (snapshot.year < past.yearRange[0] || snapshot.year > past.yearRange[1])) return false;
    return true;
  });
  const results = snapshots.map((snapshot) => matchConditions(past.where, snapshot, context));
  const mode = past.mode ?? "any";
  if (mode === "all") return results.length > 0 && results.every(Boolean);
  if (mode === "none") return !results.some(Boolean);
  return results.some(Boolean);
}

function compareValue(value, condition) {
  if ("eq" in condition && value !== condition.eq) return false;
  if ("neq" in condition && value === condition.neq) return false;
  if ("gt" in condition && !(value > condition.gt)) return false;
  if ("gte" in condition && !(value >= condition.gte)) return false;
  if ("lt" in condition && !(value < condition.lt)) return false;
  if ("lte" in condition && !(value <= condition.lte)) return false;
  return true;
}
