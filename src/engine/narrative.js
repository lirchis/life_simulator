const VALID_TIERS = new Set(["turning_point", "consequence", "historical_pressure", "texture", "chronicle"]);

const TEXTURE_PREFIXES = [
  "daily_",
  "texture_",
  "daily_micro_",
  "exp_pre49_",
  "exp49_",
  "future36_",
  "era_1840_dense_",
];

const LASTING_PATHS = [
  "education.level",
  "career.status",
  "career.field",
  "relationships.partnerStatus",
  "relationships.children",
  "location.currentProvince",
  "location.currentProvinceHistoryCode",
  "location.currentCityTier",
];

const LASTING_TRAITS = /frail|trauma|wounded|disabled|chronic|widow|orphan|bereaved|scar|injury|illness|grief|displaced/i;

const DOMAIN_BY_CATEGORY = {
  school: "education",
  education: "education",
  career: "career",
  work: "career",
  wealth: "livelihood",
  migration: "migration",
  war: "history",
  family: "family",
  relationship: "relationship",
  health: "health",
  birth: "family",
  ending: "mortality",
};

export function createNarrativeState() {
  return {
    lastTier: "",
    lastDomain: "",
    lastStructuralYear: null,
    yearsSinceStructural: 0,
    textureStreak: 0,
    structuralCount: 0,
    tierCounts: {
      turning_point: 0,
      consequence: 0,
      historical_pressure: 0,
      texture: 0,
      chronicle: 0,
    },
    activeThreads: {},
  };
}

export function normalizeNarrativeState(state) {
  state.narrative ??= createNarrativeState();
  const defaults = createNarrativeState();
  for (const [key, value] of Object.entries(defaults)) {
    if (state.narrative[key] === undefined) state.narrative[key] = value;
  }
  state.narrative.tierCounts = { ...defaults.tierCounts, ...(state.narrative.tierCounts ?? {}) };
  state.narrative.activeThreads ??= {};
  return state.narrative;
}

export function beginNarrativeYear(state) {
  const narrative = normalizeNarrativeState(state);
  narrative.yearsSinceStructural = narrative.lastStructuralYear === null
    ? Math.max(0, state.meta.age)
    : Math.max(0, state.meta.currentYear - narrative.lastStructuralYear);
  for (const [domain, thread] of Object.entries(narrative.activeThreads)) {
    if (state.meta.currentYear - thread.lastYear > (thread.expiresAfterYears ?? 7)) delete narrative.activeThreads[domain];
  }
}

export function getNarrativeTier(event) {
  if (event.narrativeTier) {
    if (!VALID_TIERS.has(event.narrativeTier)) throw new Error(`Unknown narrative tier for ${event.id}: ${event.narrativeTier}`);
    return event.narrativeTier;
  }

  const effects = allPossibleEffects(event);
  if (["birth", "ending"].includes(event.category) || effects.some((effect) => effect.die || effect.triggerEnding)) {
    return "turning_point";
  }
  if (hasLastingStateChange(effects) || event.continuity || event.outcomes?.some((outcome) => outcome.continuity)) {
    return "turning_point";
  }
  if ((event.priority ?? 0) >= 65) return "turning_point";

  const magnitude = maximumEffectMagnitude(event);
  const narrowHistoricalWindow = event.id.startsWith("era_")
    && event.yearRange
    && event.yearRange[1] - event.yearRange[0] <= 4;
  if (event.category === "war" || (event.priority ?? 0) >= 40 || (narrowHistoricalWindow && magnitude >= 6)) {
    return "historical_pressure";
  }
  if (event.category === "migration" && magnitude >= 6) return "historical_pressure";
  const authoredHistoricalPressure = event.id.startsWith("era_")
    && !TEXTURE_PREFIXES.some((prefix) => event.id.startsWith(prefix))
    && ["family", "wealth", "health", "career", "school", "migration"].includes(event.category)
    && magnitude >= 8;
  if (authoredHistoricalPressure) return "historical_pressure";

  if (hasEventDependency(event) || magnitude >= 18) return "consequence";
  if (["career", "school", "education", "relationship"].includes(event.category) && magnitude >= 11) {
    return "consequence";
  }

  if (TEXTURE_PREFIXES.some((prefix) => event.id.startsWith(prefix))) return "texture";
  return "texture";
}

export function getNarrativeDomain(event) {
  return event.narrativeDomain ?? DOMAIN_BY_CATEGORY[event.category] ?? "self";
}

export function isStructuralTier(tier) {
  return tier === "turning_point" || tier === "consequence" || tier === "historical_pressure";
}

export function narrativePool(candidates, state) {
  if (candidates.length < 2) return candidates;
  const structural = candidates.filter((event) => isStructuralTier(getNarrativeTier(event)));
  if (!structural.length) return candidates;

  const narrative = normalizeNarrativeState(state);
  const ageAllowance = state.meta.age <= 5 ? 4 : state.meta.age <= 12 ? 3 : 2;
  const structureGap = state.meta.age <= 5 ? 5 : state.meta.age <= 12 ? 4 : 3;
  const overdue = narrative.textureStreak >= ageAllowance || narrative.yearsSinceStructural >= structureGap;
  if (!overdue) return candidates;

  const threadContinuations = structural.filter((event) => {
    const domain = getNarrativeDomain(event);
    return getNarrativeTier(event) === "consequence" && Boolean(narrative.activeThreads[domain]);
  });
  return threadContinuations.length ? threadContinuations : structural;
}

export function narrativeWeightMultiplier(event, state) {
  const tier = getNarrativeTier(event);
  const domain = getNarrativeDomain(event);
  const narrative = normalizeNarrativeState(state);
  const overdueYears = Math.max(0, narrative.yearsSinceStructural - 1);
  const activeThread = narrative.activeThreads[domain];

  if (tier === "chronicle") return 1;
  if (tier === "turning_point") return 1.75 + Math.min(1.5, overdueYears * 0.28);
  if (tier === "historical_pressure") return 1.55 + Math.min(1.25, overdueYears * 0.24);
  if (tier === "consequence") {
    const threadBoost = activeThread ? 1.8 : 1;
    return threadBoost * (1.45 + Math.min(1.1, overdueYears * 0.22));
  }

  if (narrative.textureStreak >= 2) return 0.18;
  if (narrative.textureStreak === 1) return 0.46;
  return 0.72;
}

export function recordNarrativeEvent(event, state) {
  const narrative = normalizeNarrativeState(state);
  const tier = getNarrativeTier(event);
  const domain = getNarrativeDomain(event);
  narrative.lastTier = tier;
  narrative.lastDomain = domain;
  narrative.tierCounts[tier] = (narrative.tierCounts[tier] ?? 0) + 1;

  if (tier === "chronicle") {
    narrative.textureStreak = 0;
    return;
  }
  if (!isStructuralTier(tier)) {
    narrative.textureStreak += 1;
    narrative.yearsSinceStructural = narrative.lastStructuralYear === null
      ? Math.max(0, state.meta.age)
      : Math.max(0, state.meta.currentYear - narrative.lastStructuralYear);
    return;
  }

  narrative.textureStreak = 0;
  narrative.structuralCount += 1;
  narrative.lastStructuralYear = state.meta.currentYear;
  narrative.yearsSinceStructural = 0;
  const previous = narrative.activeThreads[domain];
  narrative.activeThreads[domain] = {
    domain,
    openedYear: previous?.openedYear ?? state.meta.currentYear,
    lastYear: state.meta.currentYear,
    sourceEventId: event.id,
    turns: (previous?.turns ?? 0) + 1,
    expiresAfterYears: event.narrativeThread?.expiresAfterYears ?? previous?.expiresAfterYears ?? 7,
  };

  if (event.narrativeThread?.close) delete narrative.activeThreads[domain];
}

export function narrativeSnapshot(state) {
  const narrative = normalizeNarrativeState(state);
  return {
    lastTier: narrative.lastTier,
    lastDomain: narrative.lastDomain,
    lastStructuralYear: narrative.lastStructuralYear,
    yearsSinceStructural: narrative.yearsSinceStructural,
    textureStreak: narrative.textureStreak,
    structuralCount: narrative.structuralCount,
    activeThreadDomains: Object.keys(narrative.activeThreads).sort(),
  };
}

function allPossibleEffects(event) {
  return [
    ...(event.effects ?? []),
    ...(event.outcomes ?? []).flatMap((outcome) => outcome.effects ?? []),
  ];
}

function hasLastingStateChange(effects) {
  return effects.some((effect) => {
    if (effect.path && Object.hasOwn(effect, "set") && LASTING_PATHS.includes(effect.path)) return true;
    if (effect.addTrait && LASTING_TRAITS.test(effect.addTrait)) return true;
    return Boolean(effect.scheduleEvent);
  });
}

function maximumEffectMagnitude(event) {
  const base = effectMagnitude(event.effects ?? []);
  const outcome = Math.max(0, ...(event.outcomes ?? []).map((item) => effectMagnitude(item.effects ?? [])));
  return base + outcome;
}

function effectMagnitude(effects) {
  return effects.reduce((sum, effect) => {
    if (typeof effect.add === "number") return sum + Math.abs(effect.add);
    if (typeof effect.multiply === "number") return sum + Math.abs(effect.multiply - 1) * 10;
    return sum;
  }, 0);
}

function hasEventDependency(event) {
  if (event.requiresEvents?.length || event.requiresAnyEvent?.length) return true;
  return conditionTreeHasEventDependency(event.conditions);
}

function conditionTreeHasEventDependency(value) {
  if (!value || typeof value !== "object") return false;
  if (value.eventOccurred || value.eventOccurredWithin) return true;
  return Object.values(value).some((item) => Array.isArray(item)
    ? item.some(conditionTreeHasEventDependency)
    : conditionTreeHasEventDependency(item));
}

export const narrativeTiers = [...VALID_TIERS];
