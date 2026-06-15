import { calculateEnvironment } from "./environment.js";
import { addTag, addTrait, applyEffects, normalizeState } from "./effects.js";

export function createInitialState(setup, data, context) {
  const birthProvince = data.resolveHistoricalProvince(setup.provinceHistoryCode ?? setup.province, setup.birthYear, context.rng);
  const effectiveHukou = data.getEffectiveHukou(setup.birthYear, setup.cityTier, setup.hukou);
  const familyMeta = data.familyClassMeta[setup.familyClass] ?? { score: 3, tags: [] };
  const familyScore = familyMeta.score;
  const state = {
    meta: {
      lifeId: crypto.randomUUID?.() ?? String(Date.now()),
      seed: setup.seed,
      version: "0.1.0",
      age: -1,
      currentYear: setup.birthYear - 1,
      stage: "birth",
      isAlive: true,
      deathReason: "",
      endingId: "",
    },
    birth: {
      year: setup.birthYear,
      province: birthProvince.currentCode,
      provinceHistoryCode: birthProvince.code,
      provinceNameAtBirth: birthProvince.name,
      cityTier: setup.cityTier,
      hukou: effectiveHukou,
      hukouSystem: data.hasHukouChoiceForYear(setup.birthYear),
      familyClass: setup.familyClass,
    },
    location: {
      currentProvince: birthProvince.currentCode,
      currentProvinceHistoryCode: birthProvince.code,
      currentCityTier: setup.cityTier,
      migratedTimes: 0,
    },
    environment: {},
    attrs: {
      physique: setup.attrs.physique,
      intelligence: setup.attrs.intelligence,
      charm: setup.attrs.charm,
      family: Math.max(setup.attrs.family, familyScore),
      luck: setup.attrs.luck,
      mental: setup.attrs.mental,
    },
    resources: {
      health: 58 + setup.attrs.physique * 4,
      wealth: 14 + familyScore * 7,
      happiness: 45 + setup.attrs.mental * 3,
      achievement: 0,
      reputation: 0,
      freedom: 42,
    },
    relationships: {
      family: 44,
      friendship: 10,
      romance: 0,
      partnerStatus: "none",
      partnerQuality: 0,
      children: 0,
    },
    education: {
      level: "none",
      score: 10 + setup.attrs.intelligence * 4,
      major: "",
    },
    career: {
      status: "none",
      field: "",
      level: 0,
      income: 0,
    },
    talents: [...setup.talents],
    traits: [],
    tags: [],
    counters: {},
    flags: {},
    cooldowns: {},
    occurredEvents: {},
    scheduledEvents: [],
    timedModifiers: [],
    snapshots: [],
    history: [],
  };

  for (const tag of familyMeta.tags ?? []) addTag(state, tag);

  for (const talentId of setup.talents) {
    const talent = data.talents.find((item) => item.id === talentId);
    if (!talent) continue;
    addTrait(state, talent.id);
    applyEffects(talent.effects, state, { id: `talent:${talent.id}` });
    for (const trait of talent.traits ?? []) addTrait(state, trait);
    for (const tag of talent.tags ?? []) addTag(state, tag);
  }

  normalizeState(state);
  state.environment = calculateEnvironment(state, context.aggregateRegistry);
  return state;
}
