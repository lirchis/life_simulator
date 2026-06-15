import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { createAggregateRegistry } from "../src/engine/aggregates.js";
import { advanceYear, resolveChoice } from "../src/engine/advanceYear.js";
import { matchConditions } from "../src/engine/conditions.js";
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
const outFile = resolve(args.out ?? `reports/batch-simulations-${timestamp()}.csv`);
const aggregateRegistry = createAggregateRegistry(data.aggregates);

const rows = [];
for (let index = 0; index < count; index += 1) {
  const seed = `${baseSeed}-${String(index + 1).padStart(4, "0")}`;
  const rng = createRng(seed);
  const setup = randomSetup(seed, rng);
  const state = createInitialState(setup, data, { rng, aggregateRegistry });
  const result = runLife(state, rng, maxAge);
  rows.push(toCsvRow(index + 1, setup, state, result));
}

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, toCsv(rows), "utf8");
console.log(`Wrote ${rows.length} simulations to ${outFile}`);

function runLife(state, rng, maxAge) {
  let choiceCount = 0;
  let safety = 0;
  while (state.meta.isAlive && state.meta.age < maxAge && safety < maxAge + 5) {
    const result = advanceYear(state, data, { rng, aggregateRegistry });
    if (result.choiceEvent) {
      const choice = chooseChoice(result.choiceEvent, state, rng);
      resolveChoice(result.choiceEvent, choice.id, state, { rng, aggregateRegistry });
      choiceCount += 1;
    }
    safety += 1;
  }
  return {
    choiceCount,
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

function chooseChoice(event, state, rng) {
  const choices = event.choices.filter((choice) => matchConditions(choice.conditions, state, { rng, aggregateRegistry }));
  return pick(choices.length ? choices : event.choices, rng);
}

function toCsvRow(index, setup, state, result) {
  const categoryCounts = countBy(state.history, (log) => log.category ?? "unknown");
  const eventIds = state.history.map((log) => log.eventId);
  const rareEvents = state.history.filter((log) => log.priority || log.death).map((log) => log.eventId);
  return {
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
    choice_count: result.choiceCount,
    yearly_change_count: state.yearlyChanges.length,
    first_event: eventIds[0] ?? "",
    last_event: eventIds[eventIds.length - 1] ?? "",
    rare_events: rareEvents.join("|"),
    category_counts: compactJson(categoryCounts),
    traits: state.traits.join("|"),
    tags: state.tags.join("|"),
  };
}

function countBy(items, getKey) {
  return items.reduce((result, item) => {
    const key = getKey(item);
    result[key] = (result[key] ?? 0) + 1;
    return result;
  }, {});
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

function timestamp() {
  return new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "").replace("T", "-");
}
