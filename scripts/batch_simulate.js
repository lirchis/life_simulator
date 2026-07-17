import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";
import { createAggregateRegistry } from "../src/engine/aggregates.js";
import { advanceYear } from "../src/engine/advanceYear.js";
import { createRng, pick } from "../src/engine/random.js";
import { createInitialState } from "../src/engine/state.js";
import { data } from "../src/data/index.js";

const DEFAULT_COUNT = 100;
const DEFAULT_MAX_AGE = 100;
const DEFAULT_BASE_SEED = "BATCH";

const args = parseArgs(process.argv.slice(2));
const count = readNumberArg(args, "count", DEFAULT_COUNT);
const maxAge = readNumberArg(args, "max-age", DEFAULT_MAX_AGE);
const baseSeed = args.seed ?? DEFAULT_BASE_SEED;
const batchId = args["batch-id"] ?? `${baseSeed}-${timestamp()}`;
const outFile = resolve(args.out ?? `reports/batch-simulations-${timestamp()}.csv`);
const outputFiles = makeOutputFiles(outFile);
const aggregateRegistry = createAggregateRegistry(data.aggregates);

const summaryRows = [];
const yearRows = [];
const eventRows = [];
for (let index = 0; index < count; index += 1) {
  const seed = `${baseSeed}-${String(index + 1).padStart(4, "0")}`;
  const rng = createRng(seed);
  const setup = randomSetup(seed, rng);
  const state = createInitialState(setup, data, { rng, aggregateRegistry });
  const result = runLife(state, rng, maxAge);
  const runIndex = index + 1;
  const runId = `${batchId}-run-${String(runIndex).padStart(4, "0")}`;
  summaryRows.push(toSummaryCsvRow(runIndex, runId, setup, state, result));
  yearRows.push(...toYearCsvRows(runIndex, runId, setup, state));
  eventRows.push(...toEventCsvRows(runIndex, runId, setup, state));
}

mkdirSync(dirname(outputFiles.summary), { recursive: true });
writeFileSync(outputFiles.summary, toCsv(summaryRows), "utf8");
writeFileSync(outputFiles.years, toCsv(yearRows), "utf8");
writeFileSync(outputFiles.events, toCsv(eventRows), "utf8");
console.log(`Wrote ${summaryRows.length} simulation summaries to ${outputFiles.summary}`);
console.log(`Wrote ${yearRows.length} yearly detail rows to ${outputFiles.years}`);
console.log(`Wrote ${eventRows.length} event detail rows to ${outputFiles.events}`);

function runLife(state, rng, maxAge) {
  let safety = 0;
  while (state.meta.isAlive && state.meta.age < maxAge && safety < maxAge + 5) {
    advanceYear(state, data, { rng, aggregateRegistry });
    safety += 1;
  }
  return {
    outcomeCount: state.history.filter((log) => log.outcomeId).length,
    reachedMaxAge: state.meta.isAlive && state.meta.age >= maxAge,
  };
}

function randomSetup(seed, rng) {
  const birthYear = 1900 + Math.floor(rng() * 121);
  const province = data.resolveHistoricalProvince(
    pick(data.getProvinceOptionsForYear(birthYear).map(([code]) => code), rng),
    birthYear,
    rng,
  );
  const cityTier = pick(data.getCityTierOptionsForYear(birthYear).map(([code]) => code), rng);
  const hukouOptions = data.getHukouOptionsForYear(birthYear);
  const hukou = hukouOptions.length
    ? pick(hukouOptions.map(([code]) => code), rng)
    : data.getEffectiveHukou(birthYear, cityTier, "rural");
  const familyClass = pick(data.getFamilyClassOptionsForContext(birthYear, cityTier, hukou).map(([code]) => code), rng);
  const attrs = randomAttrs(rng, data.getFamilyAttrRange({
    birthYear,
    province: province.currentCode,
    cityTier,
    familyClass,
  }));
  const setup = {
    seed,
    birthYear,
    gender: pick(data.genderTypes.map(([code]) => code), rng),
    province: province.currentCode,
    provinceHistoryCode: province.code,
    cityTier,
    hukou,
    familyClass,
    attrs,
    talents: [],
  };
  setup.talents = chooseRandomValidTalents(setup, rng);
  return setup;
}

function randomAttrs(rng, familyRange) {
  const attrs = { physique: 0, intelligence: 0, charm: 0, family: 0, luck: 0, mental: 0 };
  attrs.family = familyRange.min + Math.floor(rng() * (familyRange.max - familyRange.min + 1));
  const keys = Object.keys(attrs).filter((key) => key !== "family");
  for (let i = attrs.family; i < 20; i += 1) {
    const available = keys.filter((key) => attrs[key] < 10);
    attrs[pick(available, rng)] += 1;
  }
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
  if (valid.length) return pick(valid, rng);
  return pool.slice(0, 3).map((talent) => talent.id);
}

function unmetTalentRequirements(talent, setup) {
  const requirements = talent.requirements ?? {};
  const requiredAttrs = requirements.attrs ?? {};
  const messages = Object.entries(requiredAttrs)
    .filter(([attr, value]) => setup.attrs[attr] < value)
    .map(([attr]) => attr);
  if (requirements.cityTiers && !requirements.cityTiers.includes(setup.cityTier)) messages.push("cityTier");
  if (requirements.familyClasses && !requirements.familyClasses.includes(setup.familyClass)) messages.push("familyClass");
  if (requirements.genders && !requirements.genders.includes(setup.gender)) messages.push("gender");
  if (requirements.hukou && !requirements.hukou.includes(data.getEffectiveHukou(setup.birthYear, setup.cityTier, setup.hukou))) messages.push("hukou");
  if (requirements.provinces && !requirements.provinces.includes(setup.province)) messages.push("province");
  if (requirements.provinceAggregates && !requirements.provinceAggregates.some((id) => aggregateRegistry.includes(id, setup.province))) messages.push("provinceAggregate");
  return messages;
}

function selectedTalentCost(ids, birthYear) {
  return ids.reduce((sum, id) => {
    const talent = data.talents.find((item) => item.id === id);
    return sum + (talent ? data.getTalentCost(talent, birthYear) : 0);
  }, 0);
}

function toSummaryCsvRow(index, runId, setup, state, result) {
  const categoryCounts = countBy(state.history, (log) => log.category ?? "unknown");
  const eventIds = state.history.map((log) => log.eventId);
  const rareEvents = state.history.filter((log) => log.priority || log.death).map((log) => log.eventId);
  return {
    batch_id: batchId,
    run_id: runId,
    run_index: index,
    seed: setup.seed,
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
    final_age: state.meta.age,
    final_year: state.meta.currentYear,
    alive: state.meta.isAlive ? "yes" : "no",
    reached_max_age: result.reachedMaxAge ? "yes" : "no",
    death_reason: state.meta.deathReason,
    ending_id: state.meta.endingId,
    health: state.resources.health,
    wealth: state.resources.wealth,
    happiness: state.resources.happiness,
    achievement: state.resources.achievement,
    reputation: state.resources.reputation,
    freedom: state.resources.freedom,
    education_level: state.education.level,
    education_score: state.education.score,
    career_status: state.career.status,
    career_income: state.career.income,
    event_count: state.history.length,
    outcome_count: result.outcomeCount,
    yearly_change_count: state.yearlyChanges.length,
    first_event: eventIds[0] ?? "",
    last_event: eventIds[eventIds.length - 1] ?? "",
    rare_events: rareEvents.join("|"),
    category_counts: compactJson(categoryCounts),
    traits: state.traits.join("|"),
    tags: state.tags.join("|"),
  };
}

function toYearCsvRows(index, runId, setup, state) {
  const eventsByYear = groupBy(state.history, (log) => yearKey(log));
  const changesByYear = groupBy(state.yearlyChanges, (change) => yearKey(change));
  return state.snapshots.map((snapshot) => {
    const key = yearKey(snapshot);
    const logs = eventsByYear[key] ?? [];
    const changes = changesByYear[key] ?? [];
    const yearId = `${runId}-year-${String(snapshot.age).padStart(3, "0")}`;
    return {
      batch_id: batchId,
      run_id: runId,
      year_id: yearId,
      run_index: index,
      seed: setup.seed,
      age: snapshot.age,
      year: snapshot.year,
      stage: snapshot.stage,
      alive_after_year: logs.some((log) => log.death) ? "no" : "yes",
      birth_year: state.birth.year,
      gender: state.birth.gender,
      current_province: snapshot.location.currentProvince,
      current_city_tier: snapshot.location.currentCityTier,
      health: snapshot.resources.health,
      wealth: snapshot.resources.wealth,
      happiness: snapshot.resources.happiness,
      achievement: snapshot.resources.achievement,
      reputation: snapshot.resources.reputation,
      freedom: snapshot.resources.freedom,
      physique: snapshot.attrs.physique,
      intelligence: snapshot.attrs.intelligence,
      charm: snapshot.attrs.charm,
      family: snapshot.attrs.family,
      luck: snapshot.attrs.luck,
      mental: snapshot.attrs.mental,
      education_level: snapshot.education.level,
      education_score: snapshot.education.score,
      career_status: snapshot.career.status,
      career_income: snapshot.career.income,
      event_count: logs.length,
      event_ids: logs.map((log) => log.eventId).join("|"),
      event_titles: logs.map((log) => log.title).join("|"),
      event_categories: logs.map((log) => log.category).join("|"),
      event_texts: logs.map((log) => log.text).join("|"),
      event_effects: logs.flatMap((log) => log.effectsSummary ?? []).join("|"),
      natural_effects: changes.flatMap((change) => change.effectsSummary ?? []).join("|"),
      outcome_ids: logs.filter((log) => log.outcomeId).map((log) => `${log.eventId}:${log.outcomeId}`).join("|"),
      traits: snapshot.traits.join("|"),
      tags: snapshot.tags.join("|"),
    };
  });
}

function toEventCsvRows(index, runId, setup, state) {
  return state.history.map((log, eventIndex) => ({
    batch_id: batchId,
    run_id: runId,
    year_id: `${runId}-year-${String(log.age).padStart(3, "0")}`,
    event_row_id: `${runId}-event-${String(eventIndex + 1).padStart(4, "0")}`,
    run_index: index,
    seed: setup.seed,
    event_order: eventIndex + 1,
    age: log.age,
    year: log.year,
    birth_year: state.birth.year,
    gender: state.birth.gender,
    birth_province: state.birth.province,
    birth_city_tier: state.birth.cityTier,
    hukou: state.birth.hukou,
    family_class: state.birth.familyClass,
    event_id: log.eventId,
    title: log.title,
    category: log.category,
    priority: log.priority ?? 0,
    outcome_id: log.outcomeId ?? "",
    final_text: log.text,
    final_result_text: log.resultText ?? "",
    effects_summary: (log.effectsSummary ?? []).join("|"),
    death: log.death ? "yes" : "no",
  }));
}

function countBy(items, getKey) {
  return items.reduce((result, item) => {
    const key = getKey(item);
    result[key] = (result[key] ?? 0) + 1;
    return result;
  }, {});
}

function groupBy(items, getKey) {
  return items.reduce((result, item) => {
    const key = getKey(item);
    result[key] ??= [];
    result[key].push(item);
    return result;
  }, {});
}

function yearKey(item) {
  return `${item.age}|${item.year}`;
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

function compactJson(value) {
  return JSON.stringify(value).replaceAll(",", ";");
}

function parseArgs(argv) {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const next = argv[index + 1];
    parsed[key] = next && !next.startsWith("--") ? next : "true";
    if (next && !next.startsWith("--")) index += 1;
  }
  return parsed;
}

function readNumberArg(source, key, fallback) {
  const value = Number(source[key] ?? fallback);
  if (!Number.isFinite(value) || value <= 0) throw new Error(`--${key} must be a positive number`);
  return Math.floor(value);
}

function makeOutputFiles(summaryFile) {
  const extension = extname(summaryFile);
  const base = extension ? summaryFile.slice(0, -extension.length) : summaryFile;
  const suffix = extension || ".csv";
  return {
    summary: summaryFile,
    years: `${base}.years${suffix}`,
    events: `${base}.events${suffix}`,
  };
}

function timestamp() {
  return new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "").replace("T", "-");
}
