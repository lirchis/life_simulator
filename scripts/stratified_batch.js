import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";
import { createAggregateRegistry } from "../src/engine/aggregates.js";
import { advanceYear } from "../src/engine/advanceYear.js";
import { createRng, pick } from "../src/engine/random.js";
import { createInitialState } from "../src/engine/state.js";
import { SHADOW_FIELDS } from "../src/engine/shadow.js";
import { data } from "../src/data/index.js";

const DEFAULT_SEED = "STRATIFIED-QA";
const DEFAULT_MAX_AGE = 112;
const DEFAULT_MATRIX = "balanced";
const DEFAULT_REGION_SET = "representative";

const COHORTS = [
  { id: "born_1840", label: "晚清开端出生", birthYear: 1840 },
  { id: "born_1870", label: "晚清中后期出生", birthYear: 1870 },
  { id: "born_1900", label: "清末民初一代", birthYear: 1900 },
  { id: "born_1925", label: "战争年代一代", birthYear: 1925 },
  { id: "born_1950", label: "建国初期一代", birthYear: 1950 },
  { id: "born_1970", label: "改革前夕一代", birthYear: 1970 },
  { id: "born_1990", label: "市场化一代", birthYear: 1990 },
  { id: "born_2010", label: "移动互联网一代", birthYear: 2010 },
  { id: "born_2020", label: "未来成年一代", birthYear: 2020 },
];

const REPRESENTATIVE_REGIONS = [
  { id: "north_china", label: "华北", province: "hebei" },
  { id: "northeast", label: "东北", province: "liaoning" },
  { id: "lower_yangtze", label: "江南沿海", province: "jiangsu" },
  { id: "southeast_coast", label: "东南沿海", province: "fujian" },
  { id: "south_coast", label: "岭南沿海", province: "guangdong" },
  { id: "central_china", label: "中部", province: "hunan" },
  { id: "southwest", label: "西南", province: "sichuan" },
  { id: "northwest", label: "西北", province: "gansu" },
  { id: "far_west", label: "边疆西部", province: "xinjiang" },
  { id: "taiwan", label: "台湾", province: "taiwan" },
  { id: "hong_kong", label: "香港", province: "xianggang" },
];

const SETTLEMENTS = [
  { id: "rural", label: "乡村", cityTier: "village", hukou: "rural" },
  { id: "urban", label: "城市", cityTier: "city", hukou: "urban" },
];

const CLASS_TIERS = [
  { id: "low", label: "低资源家庭", quantile: 0 },
  { id: "middle", label: "中等资源家庭", quantile: 0.5 },
  { id: "high", label: "高资源家庭", quantile: 1 },
];

const ATTRIBUTE_TIERS = [
  {
    id: "vulnerable",
    label: "低体质/低心态",
    weights: { physique: 0.08, intelligence: 0.28, charm: 0.25, luck: 0.31, mental: 0.08 },
  },
  {
    id: "balanced",
    label: "属性均衡",
    weights: { physique: 0.2, intelligence: 0.2, charm: 0.2, luck: 0.2, mental: 0.2 },
  },
  {
    id: "resilient",
    label: "高体质/高心态",
    weights: { physique: 0.3, intelligence: 0.16, charm: 0.1, luck: 0.14, mental: 0.3 },
  },
];

const args = parseArgs(process.argv.slice(2));
const baseSeed = args.seed ?? DEFAULT_SEED;
const maxAge = positiveInteger(args["max-age"], DEFAULT_MAX_AGE, "--max-age");
const replicates = positiveInteger(args.replicates, 1, "--replicates");
const matrix = enumArg(args.matrix, ["smoke", "balanced", "full"], DEFAULT_MATRIX, "--matrix");
const regionSet = enumArg(args["region-set"], ["representative", "all"], DEFAULT_REGION_SET, "--region-set");
const talentMode = enumArg(args.talents, ["random", "none"], "random", "--talents");
const outputSummary = resolve(args.out ?? "reports/stratified-qa.csv");
const outputFiles = sidecarFiles(outputSummary);
const aggregateRegistry = createAggregateRegistry(data.aggregates);
const matrixCases = buildMatrix({ matrix, regionSet, replicates });

const summaryRows = [];
const yearRows = [];
const eventRows = [];
const manifestCases = [];

for (let index = 0; index < matrixCases.length; index += 1) {
  const matrixCase = matrixCases[index];
  const seed = `${baseSeed}-${matrixCase.caseId}`;
  const rng = createRng(seed);
  const setup = makeSetup(matrixCase, seed, rng, talentMode);
  const state = createInitialState(setup, data, { rng, aggregateRegistry });
  runLife(state, rng, maxAge);
  const runIndex = index + 1;
  const runId = `${baseSeed}-${String(runIndex).padStart(5, "0")}`;
  summaryRows.push(toSummaryRow(runId, runIndex, matrixCase, setup, state, maxAge));
  yearRows.push(...toYearRows(runId, runIndex, matrixCase, setup, state));
  eventRows.push(...toEventRows(runId, runIndex, matrixCase, setup, state));
  manifestCases.push({
    run_id: runId,
    case_id: matrixCase.caseId,
    replicate: matrixCase.replicate,
    seed,
    cohort: matrixCase.cohort.id,
    birth_year: setup.birthYear,
    gender: setup.gender,
    settlement: matrixCase.settlement.id,
    class_tier: matrixCase.classTier.id,
    family_class: setup.familyClass,
    region_group: matrixCase.region.id,
    requested_province: matrixCase.region.province,
    attribute_tier: matrixCase.attributeTier.id,
    attrs: setup.attrs,
    talents: setup.talents,
  });
}

mkdirSync(dirname(outputSummary), { recursive: true });
writeFileSync(outputFiles.summary, toCsv(summaryRows), "utf8");
writeFileSync(outputFiles.years, toCsv(yearRows), "utf8");
writeFileSync(outputFiles.events, toCsv(eventRows), "utf8");
writeFileSync(outputFiles.manifest, `${JSON.stringify(makeManifest(), null, 2)}\n`, "utf8");

console.log(`Matrix: ${matrix}; regions: ${regionSet}; replicates: ${replicates}`);
console.log(`Wrote ${summaryRows.length} stratified lives to ${outputFiles.summary}`);
console.log(`Wrote ${yearRows.length} person-years to ${outputFiles.years}`);
console.log(`Wrote ${eventRows.length} event rows to ${outputFiles.events}`);
console.log(`Wrote reproducibility manifest to ${outputFiles.manifest}`);

function buildMatrix(options) {
  const regions = options.regionSet === "all" ? allProvinceRegions() : REPRESENTATIVE_REGIONS;
  const cases = [];
  let ordinal = 0;
  for (const cohort of COHORTS) {
    for (const gender of data.genderTypes.map(([id]) => id)) {
      for (const settlement of SETTLEMENTS) {
        for (const classTier of CLASS_TIERS) {
          const activeRegions = options.matrix === "smoke"
            ? [regions[ordinal % regions.length]]
            : regions;
          for (const region of activeRegions) {
            const attributeTiers = options.matrix === "full"
              ? ATTRIBUTE_TIERS
              : [ATTRIBUTE_TIERS[ordinal % ATTRIBUTE_TIERS.length]];
            for (const attributeTier of attributeTiers) {
              for (let replicate = 1; replicate <= options.replicates; replicate += 1) {
                const caseId = [
                  cohort.id,
                  gender,
                  settlement.id,
                  classTier.id,
                  region.id,
                  attributeTier.id,
                  `r${replicate}`,
                ].join("__");
                cases.push({ caseId, cohort, gender, settlement, classTier, region, attributeTier, replicate });
              }
              ordinal += 1;
            }
          }
        }
      }
    }
  }
  return cases;
}

function allProvinceRegions() {
  return data.provinces
    .filter(([id]) => id !== "other")
    .map(([province, label]) => ({ id: `province_${province}`, label, province }));
}

function makeSetup(matrixCase, seed, rng, talents) {
  const birthYear = matrixCase.cohort.birthYear;
  const resolvedProvince = data.resolveHistoricalProvince(matrixCase.region.province, birthYear, rng);
  const cityTier = matrixCase.settlement.cityTier;
  const hukou = data.getEffectiveHukou(birthYear, cityTier, matrixCase.settlement.hukou);
  const familyClass = chooseFamilyClass(birthYear, cityTier, hukou, matrixCase.classTier.quantile);
  const familyRange = data.getFamilyAttrRange({
    birthYear,
    province: resolvedProvince.currentCode,
    cityTier,
    familyClass,
  });
  const familyValue = familyRange.defaultValue;
  const attrs = allocateAttributes(familyValue, matrixCase.attributeTier.weights);
  const setup = {
    seed,
    birthYear,
    gender: matrixCase.gender,
    province: resolvedProvince.currentCode,
    provinceHistoryCode: resolvedProvince.code,
    cityTier,
    hukou,
    familyClass,
    attrs,
    talents: [],
  };
  if (talents === "random") setup.talents = chooseRandomValidTalents(setup, rng);
  return setup;
}

function chooseFamilyClass(year, cityTier, hukou, quantile) {
  const options = data.getFamilyClassOptionsForContext(year, cityTier, hukou)
    .map(([id]) => id)
    .sort((left, right) => (data.familyClassMeta[left]?.score ?? 3) - (data.familyClassMeta[right]?.score ?? 3));
  const index = Math.round((options.length - 1) * quantile);
  return options[index];
}

function allocateAttributes(family, weights) {
  const attrs = { physique: 0, intelligence: 0, charm: 0, family, luck: 0, mental: 0 };
  const remaining = Math.max(0, 20 - family);
  const entries = Object.entries(weights).map(([key, weight]) => ({
    key,
    exact: remaining * weight,
    value: Math.floor(remaining * weight),
  }));
  let assigned = entries.reduce((sum, item) => sum + item.value, 0);
  entries.sort((left, right) => (right.exact - right.value) - (left.exact - left.value) || left.key.localeCompare(right.key));
  for (const entry of entries) {
    if (assigned >= remaining) break;
    entry.value += 1;
    assigned += 1;
  }
  for (const entry of entries) attrs[entry.key] = Math.min(10, entry.value);
  return attrs;
}

function chooseRandomValidTalents(setup, rng) {
  const pool = data.getTalentsForYear(data.talents, setup.birthYear)
    .filter((talent) => !unmetTalentRequirements(talent, setup).length);
  const valid = [];
  for (let a = 0; a < pool.length; a += 1) {
    for (let b = a + 1; b < pool.length; b += 1) {
      for (let c = b + 1; c < pool.length; c += 1) {
        const ids = [pool[a].id, pool[b].id, pool[c].id];
        if (selectedTalentCost(ids, setup.birthYear) <= data.getTalentBudgetForYear(setup.birthYear)) valid.push(ids);
      }
    }
  }
  return valid.length ? pick(valid, rng) : pool.slice(0, 3).map((talent) => talent.id);
}

function unmetTalentRequirements(talent, setup) {
  const requirements = talent.requirements ?? {};
  const problems = Object.entries(requirements.attrs ?? {})
    .filter(([attr, value]) => setup.attrs[attr] < value)
    .map(([attr]) => attr);
  if (requirements.cityTiers && !requirements.cityTiers.includes(setup.cityTier)) problems.push("cityTier");
  if (requirements.familyClasses && !requirements.familyClasses.includes(setup.familyClass)) problems.push("familyClass");
  if (requirements.genders && !requirements.genders.includes(setup.gender)) problems.push("gender");
  if (requirements.hukou && !requirements.hukou.includes(data.getEffectiveHukou(setup.birthYear, setup.cityTier, setup.hukou))) problems.push("hukou");
  if (requirements.provinces && !requirements.provinces.includes(setup.province)) problems.push("province");
  if (requirements.provinceAggregates && !requirements.provinceAggregates.some((id) => aggregateRegistry.includes(id, setup.province))) problems.push("provinceAggregate");
  return problems;
}

function selectedTalentCost(ids, birthYear) {
  return ids.reduce((sum, id) => {
    const talent = data.talents.find((item) => item.id === id);
    return sum + (talent ? data.getTalentCost(talent, birthYear) : 0);
  }, 0);
}

function runLife(state, rng, maxAge) {
  let safety = 0;
  while (state.meta.isAlive && state.meta.age < maxAge && safety <= maxAge + 2) {
    advanceYear(state, data, { rng, aggregateRegistry });
    safety += 1;
  }
}

function baseColumns(runId, runIndex, matrixCase, setup) {
  return {
    run_id: runId,
    run_index: runIndex,
    case_id: matrixCase.caseId,
    replicate: matrixCase.replicate,
    seed: setup.seed,
    cohort: matrixCase.cohort.id,
    cohort_label: matrixCase.cohort.label,
    region_group: matrixCase.region.id,
    region_label: matrixCase.region.label,
    requested_province: matrixCase.region.province,
    settlement: matrixCase.settlement.id,
    class_tier: matrixCase.classTier.id,
    attribute_tier: matrixCase.attributeTier.id,
  };
}

function toSummaryRow(runId, runIndex, matrixCase, setup, state, maxAge) {
  const eventCounts = countBy(state.history, (log) => log.eventId);
  const tierCounts = countBy(state.history, (log) => log.narrativeTier ?? "unknown");
  const textCounts = countBy(state.history, (log) => normalizeText(`${log.text}\n${log.resultText ?? ""}`));
  return {
    ...baseColumns(runId, runIndex, matrixCase, setup),
    birth_year: state.birth.year,
    gender: state.birth.gender,
    birth_province_history: state.birth.provinceHistoryCode,
    birth_province: state.birth.province,
    birth_city_tier: state.birth.cityTier,
    hukou: state.birth.hukou,
    family_class: state.birth.familyClass,
    attr_physique: setup.attrs.physique,
    attr_intelligence: setup.attrs.intelligence,
    attr_charm: setup.attrs.charm,
    attr_family: setup.attrs.family,
    attr_luck: setup.attrs.luck,
    attr_mental: setup.attrs.mental,
    opening_talents: setup.talents.join("|"),
    chronicle_id: state.chronicle?.id ?? "",
    final_age: state.meta.age,
    final_year: state.meta.currentYear,
    alive: state.meta.isAlive ? "yes" : "no",
    reached_age_cap: state.meta.isAlive && state.meta.age >= maxAge ? "yes" : "no",
    death_reason: state.meta.deathReason,
    ending_id: state.meta.endingId,
    event_count: state.history.length,
    unique_event_count: Object.keys(eventCounts).length,
    repeated_event_excess: excessCount(eventCounts),
    repeated_visible_copy_excess: excessCount(textCounts),
    quiet_year_count: eventCounts.life_quiet_year ?? 0,
    structural_event_count: (tierCounts.turning_point ?? 0) + (tierCounts.consequence ?? 0) + (tierCounts.historical_pressure ?? 0),
    texture_event_count: tierCounts.texture ?? 0,
    max_texture_streak: maximumTextureStreak(state.history),
    longest_structural_gap: longestStructuralGap(state.history),
    final_health: state.resources.health,
    final_wealth: state.resources.wealth,
    final_happiness: state.resources.happiness,
    ...shadowColumns(state.shadow, "final"),
    final_achievement: state.resources.achievement,
    final_education_level: state.education.level,
    final_education_status: state.education.status,
    final_completed_education_level: state.education.completedLevel,
    final_career_status: state.career.status,
    final_primary_activity: state.lifeCourse.primaryActivity,
    life_course_transition_count: state.lifeCourse.transitions.length,
  };
}

function toYearRows(runId, runIndex, matrixCase, setup, state) {
  const eventsByKey = groupByMap(state.history, (log) => `${log.age}|${log.year}`);
  const snapshotsByAge = new Map(state.snapshots.map((snapshot) => [snapshot.age, snapshot]));
  return state.snapshots.map((snapshot) => {
    const logs = eventsByKey.get(`${snapshot.age}|${snapshot.year}`) ?? [];
    const beforeShadow = snapshotsByAge.get(snapshot.age - 1)?.shadow ?? logs[0]?.shadowBefore ?? snapshot.shadow;
    return {
      ...baseColumns(runId, runIndex, matrixCase, setup),
      year_id: `${runId}-year-${String(snapshot.age).padStart(3, "0")}`,
      birth_year: state.birth.year,
      chronicle_id: state.chronicle?.id ?? "",
      gender: state.birth.gender,
      birth_province: state.birth.province,
      birth_city_tier: state.birth.cityTier,
      hukou: state.birth.hukou,
      family_class: state.birth.familyClass,
      age: snapshot.age,
      year: snapshot.year,
      stage: snapshot.stage,
      alive_after_year: logs.some((log) => log.death) ? "no" : "yes",
      current_province: snapshot.location.currentProvince,
      current_city_tier: snapshot.location.currentCityTier,
      migrated_times: snapshot.location.migratedTimes,
      health: snapshot.resources.health,
      wealth: snapshot.resources.wealth,
      happiness: snapshot.resources.happiness,
      achievement: snapshot.resources.achievement,
      reputation: snapshot.resources.reputation,
      freedom: snapshot.resources.freedom,
      ...shadowColumns(beforeShadow, "before"),
      ...shadowColumns(snapshot.shadow, "after"),
      physique: snapshot.attrs.physique,
      intelligence: snapshot.attrs.intelligence,
      charm: snapshot.attrs.charm,
      family: snapshot.attrs.family,
      luck: snapshot.attrs.luck,
      mental: snapshot.attrs.mental,
      family_relationship: snapshot.relationships.family,
      friendship: snapshot.relationships.friendship,
      romance: snapshot.relationships.romance,
      partner_status: snapshot.relationships.partnerStatus,
      children: snapshot.relationships.children,
      oldest_child_age: snapshot.relationships.oldestChildAge ?? "",
      youngest_child_age: snapshot.relationships.youngestChildAge ?? "",
      education_level: snapshot.education.level,
      education_score: snapshot.education.score,
      education_status: snapshot.education.status,
      education_current_level: snapshot.education.currentLevel,
      education_completed_level: snapshot.education.completedLevel,
      education_track: snapshot.education.track,
      education_mode: snapshot.education.mode,
      education_started_year: snapshot.education.startedYear,
      education_expected_end_year: snapshot.education.expectedEndYear,
      education_concurrent_career: snapshot.education.concurrentCareer ? "yes" : "no",
      career_status: snapshot.career.status,
      career_field: snapshot.career.field,
      career_level: snapshot.career.level,
      career_income: snapshot.career.income,
      career_started_year: snapshot.career.startedYear,
      career_status_since_year: snapshot.career.statusSinceYear,
      career_jobs_held: snapshot.career.jobsHeld,
      career_role: snapshot.career.role,
      career_authority_scope: snapshot.career.authorityScope,
      career_manages_people: snapshot.career.managesPeople ? "yes" : "no",
      career_controls_budget: snapshot.career.controlsBudget ? "yes" : "no",
      career_writes_policy: snapshot.career.writesPolicy ? "yes" : "no",
      career_controls_procurement: snapshot.career.controlsProcurement ? "yes" : "no",
      primary_activity: snapshot.lifeCourse.primaryActivity,
      life_course_transition_count: snapshot.lifeCourse.transitions.length,
      last_life_course_transition: formatLifeCourseTransition(snapshot.lifeCourse.transitions.at(-1)),
      narrative_last_tier: snapshot.narrative.lastTier,
      narrative_last_domain: snapshot.narrative.lastDomain,
      narrative_years_since_structural: snapshot.narrative.yearsSinceStructural,
      narrative_texture_streak: snapshot.narrative.textureStreak,
      narrative_structural_count: snapshot.narrative.structuralCount,
      narrative_active_threads: Object.keys(snapshot.narrative.activeThreads ?? {}).sort().join("|"),
      event_count: logs.length,
      event_ids: logs.map((log) => log.eventId).join("|"),
      event_titles: logs.map((log) => log.title).join("|"),
      event_texts: logs.map((log) => log.text).join("|"),
      traits: snapshot.traits.join("|"),
      tags: snapshot.tags.join("|"),
    };
  });
}

function toEventRows(runId, runIndex, matrixCase, setup, state) {
  const snapshots = new Map(state.snapshots.map((snapshot) => [snapshot.age, snapshot]));
  return state.history.map((log, index) => {
    const after = snapshots.get(log.age);
    const before = snapshots.get(log.age - 1);
    const continuityBefore = log.continuityBefore;
    const continuityAfter = log.continuityAfter;
    return {
      ...baseColumns(runId, runIndex, matrixCase, setup),
      event_row_id: `${runId}-event-${String(index + 1).padStart(4, "0")}`,
      year_id: `${runId}-year-${String(log.age).padStart(3, "0")}`,
      event_order: index + 1,
      birth_year: state.birth.year,
      chronicle_id: state.chronicle?.id ?? "",
      gender: state.birth.gender,
      birth_province: state.birth.province,
      birth_city_tier: state.birth.cityTier,
      hukou: state.birth.hukou,
      family_class: state.birth.familyClass,
      age: log.age,
      year: log.year,
      trigger_province: before?.location.currentProvince ?? state.birth.province,
      trigger_city_tier: before?.location.currentCityTier ?? state.birth.cityTier,
      current_province_after: after?.location.currentProvince ?? state.location.currentProvince,
      current_city_tier_after: after?.location.currentCityTier ?? state.location.currentCityTier,
      health_after: after?.resources.health ?? state.resources.health,
      wealth_after: after?.resources.wealth ?? state.resources.wealth,
      happiness_after: after?.resources.happiness ?? state.resources.happiness,
      partner_status_after: after?.relationships.partnerStatus ?? state.relationships.partnerStatus,
      children_after: after?.relationships.children ?? state.relationships.children,
      oldest_child_age_after: after?.relationships.oldestChildAge ?? state.relationships.oldestChildAge ?? "",
      youngest_child_age_after: after?.relationships.youngestChildAge ?? state.relationships.youngestChildAge ?? "",
      education_level_after: after?.education.level ?? state.education.level,
      education_score_after: after?.education.score ?? state.education.score,
      education_status_before: continuityBefore?.education.status ?? before?.education.status ?? "not_started",
      education_status_after: continuityAfter?.education.status ?? after?.education.status ?? state.education.status,
      education_current_level_after: continuityAfter?.education.currentLevel ?? after?.education.currentLevel ?? state.education.currentLevel,
      education_completed_level_after: continuityAfter?.education.completedLevel ?? after?.education.completedLevel ?? state.education.completedLevel,
      education_mode_after: continuityAfter?.education.mode ?? after?.education.mode ?? state.education.mode,
      education_concurrent_career_after: (continuityAfter?.education.concurrentCareer ?? after?.education.concurrentCareer ?? state.education.concurrentCareer) ? "yes" : "no",
      career_status_before: continuityBefore?.career.status ?? before?.career.status ?? "none",
      career_field_before: continuityBefore?.career.field ?? before?.career.field ?? "",
      career_status_after: continuityAfter?.career.status ?? after?.career.status ?? state.career.status,
      career_field_after: continuityAfter?.career.field ?? after?.career.field ?? state.career.field,
      career_jobs_held_after: continuityAfter?.career.jobsHeld ?? after?.career.jobsHeld ?? state.career.jobsHeld,
      career_role_before: continuityBefore?.career.role ?? before?.career.role ?? "none",
      career_role_after: continuityAfter?.career.role ?? after?.career.role ?? state.career.role,
      career_authority_scope_before: continuityBefore?.career.authorityScope ?? before?.career.authorityScope ?? "none",
      career_authority_scope_after: continuityAfter?.career.authorityScope ?? after?.career.authorityScope ?? state.career.authorityScope,
      career_manages_people_after: (continuityAfter?.career.managesPeople ?? after?.career.managesPeople ?? state.career.managesPeople) ? "yes" : "no",
      career_controls_budget_after: (continuityAfter?.career.controlsBudget ?? after?.career.controlsBudget ?? state.career.controlsBudget) ? "yes" : "no",
      career_writes_policy_after: (continuityAfter?.career.writesPolicy ?? after?.career.writesPolicy ?? state.career.writesPolicy) ? "yes" : "no",
      career_controls_procurement_after: (continuityAfter?.career.controlsProcurement ?? after?.career.controlsProcurement ?? state.career.controlsProcurement) ? "yes" : "no",
      primary_activity_after: continuityAfter?.primaryActivity ?? after?.lifeCourse.primaryActivity ?? state.lifeCourse.primaryActivity,
      ...shadowColumns(log.shadowBefore, "before"),
      ...shadowColumns(log.shadowAfter, "after"),
      event_id: log.eventId,
      title: log.title,
      category: log.category,
      priority: log.priority ?? 0,
      narrative_tier: log.narrativeTier ?? "unknown",
      narrative_domain: log.narrativeDomain ?? "",
      narrative_texture_streak_before: log.narrativeBefore?.textureStreak ?? 0,
      narrative_texture_streak_after: log.narrativeAfter?.textureStreak ?? 0,
      narrative_years_since_structural_before: log.narrativeBefore?.yearsSinceStructural ?? 0,
      narrative_years_since_structural_after: log.narrativeAfter?.yearsSinceStructural ?? 0,
      narrative_active_threads_after: (log.narrativeAfter?.activeThreadDomains ?? []).join("|"),
      outcome_id: log.outcomeId ?? "",
      final_text: log.text,
      final_result_text: log.resultText ?? "",
      effects_summary: (log.effectsSummary ?? []).join("|"),
      traits_after: (after?.traits ?? state.traits).join("|"),
      tags_after: (after?.tags ?? state.tags).join("|"),
      death: log.death ? "yes" : "no",
    };
  });
}

function formatLifeCourseTransition(transition) {
  if (!transition) return "";
  const from = transition.domain === "education"
    ? `${transition.from.status}:${transition.from.level}`
    : `${transition.from.status}:${transition.from.field}`;
  const to = transition.domain === "education"
    ? `${transition.to.status}:${transition.to.level}`
    : `${transition.to.status}:${transition.to.field}`;
  return `${transition.year}/${transition.age}/${transition.domain}/${from}->${to}/${transition.source}`;
}

function shadowColumns(shadow = {}, suffix) {
  return Object.fromEntries(SHADOW_FIELDS.map((field) => [
    `shadow_${field.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)}_${suffix}`,
    shadow[field] ?? 0,
  ]));
}

function maximumTextureStreak(history) {
  let current = 0;
  let maximum = 0;
  for (const log of history) {
    current = log.narrativeTier === "texture" ? current + 1 : 0;
    maximum = Math.max(maximum, current);
  }
  return maximum;
}

function longestStructuralGap(history) {
  const ordinary = history.filter((log) => log.narrativeTier !== "chronicle");
  if (!ordinary.length) return 0;
  let lastStructuralYear = ordinary[0].year;
  let maximum = 0;
  for (const log of ordinary) {
    if (["turning_point", "consequence", "historical_pressure"].includes(log.narrativeTier)) {
      maximum = Math.max(maximum, log.year - lastStructuralYear - 1);
      lastStructuralYear = log.year;
    }
  }
  return Math.max(maximum, ordinary.at(-1).year - lastStructuralYear);
}

function makeManifest() {
  return {
    schema_version: 2,
    generator: "scripts/stratified_batch.js",
    deterministic_note: "同一代码版本、参数和 seed 会生成相同的开局矩阵与可见人生；generated_at 不写入结果以便逐字比较。",
    parameters: {
      seed: baseSeed,
      max_age: maxAge,
      replicates,
      matrix,
      region_set: regionSet,
      talents: talentMode,
    },
    dimensions: {
      cohorts: COHORTS,
      genders: data.genderTypes.map(([id, label]) => ({ id, label })),
      settlements: SETTLEMENTS,
      class_tiers: CLASS_TIERS.map(({ id, label }) => ({ id, label })),
      attribute_tiers: ATTRIBUTE_TIERS.map(({ id, label }) => ({ id, label })),
      regions: regionSet === "all" ? allProvinceRegions() : REPRESENTATIVE_REGIONS,
    },
    counts: {
      lives: summaryRows.length,
      person_years: yearRows.length,
      events: eventRows.length,
    },
    outputs: outputFiles,
    cases: manifestCases,
  };
}

function sidecarFiles(summary) {
  const extension = extname(summary);
  const base = extension ? summary.slice(0, -extension.length) : summary;
  const suffix = extension || ".csv";
  return {
    summary,
    years: `${base}.years${suffix}`,
    events: `${base}.events${suffix}`,
    manifest: `${base}.manifest.json`,
  };
}

function toCsv(rows) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];
  for (const row of rows) lines.push(headers.map((header) => escapeCsv(row[header])).join(","));
  return `${lines.join("\n")}\n`;
}

function escapeCsv(value) {
  const text = String(value ?? "");
  if (!/[",\n\r]/.test(text)) return text;
  return `"${text.replaceAll('"', '""')}"`;
}

function parseArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const next = argv[index + 1];
    result[key] = next && !next.startsWith("--") ? next : "true";
    if (next && !next.startsWith("--")) index += 1;
  }
  return result;
}

function positiveInteger(value, fallback, label) {
  const parsed = Number(value ?? fallback);
  if (!Number.isInteger(parsed) || parsed <= 0) throw new Error(`${label} must be a positive integer`);
  return parsed;
}

function enumArg(value, allowed, fallback, label) {
  const selected = value ?? fallback;
  if (!allowed.includes(selected)) throw new Error(`${label} must be one of: ${allowed.join(", ")}`);
  return selected;
}

function groupByMap(items, getKey) {
  const result = new Map();
  for (const item of items) {
    const key = getKey(item);
    const group = result.get(key) ?? [];
    group.push(item);
    result.set(key, group);
  }
  return result;
}

function countBy(items, getKey) {
  const counts = {};
  for (const item of items) {
    const key = getKey(item);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}

function excessCount(counts) {
  return Object.values(counts).reduce((sum, count) => sum + Math.max(0, count - 1), 0);
}

function normalizeText(value) {
  return String(value ?? "").replace(/[\s，。！？、；：,.!?;:“”‘’'"《》〈〉（）()【】\[\]—…·0-9]/g, "").trim();
}
