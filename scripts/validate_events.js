import { data } from "../src/data/index.js";
import { createAggregateRegistry } from "../src/engine/aggregates.js";
import { advanceYear } from "../src/engine/advanceYear.js";
import { createRng } from "../src/engine/random.js";
import { createInitialState } from "../src/engine/state.js";

const errors = [];
const eventIds = new Set();
const [minBirthYear, maxBirthYear] = data.birthYearRange;

if (minBirthYear !== 1840 || maxBirthYear !== 2020) {
  errors.push(`出生年份范围应为 1840-2020，实际为 ${minBirthYear}-${maxBirthYear}`);
}

validateEraCoverage("城市层级", data.cityTierEras, (era) => [era.startYear, era.endYear]);
validateEraCoverage("家庭阶层", data.familyClassEras, (era) => [era.startYear, era.endYear]);
validateEraCoverage("天赋预算", data.talentBudgetEras, (era) => era.yearRange);

for (let year = minBirthYear; year <= maxBirthYear; year += 1) {
  const provinces = data.getProvinceOptionsForYear(year);
  const cityTiers = data.getCityTierOptionsForYear(year);
  const talents = data.getTalentsForYear(data.talents, year);
  if (!provinces.length) errors.push(`${year} 年没有出生地域选项`);
  if (!cityTiers.length) errors.push(`${year} 年没有城市层级选项`);
  if (talents.length < 3) errors.push(`${year} 年可用天赋少于 3 个`);

  for (const [cityTier] of cityTiers) {
    const hukou = data.getEffectiveHukou(year, cityTier, "rural");
    if (!data.getFamilyClassOptionsForContext(year, cityTier, hukou).length) {
      errors.push(`${year} 年 ${cityTier} 没有可用家庭阶层`);
    }
  }
}

for (const event of data.events) {
  if (!event.id) errors.push("发现缺少 id 的事件");
  if (eventIds.has(event.id)) errors.push(`重复事件 id：${event.id}`);
  eventIds.add(event.id);

  if (Object.hasOwn(event, "choices")) {
    errors.push(`${event.id} 使用了 choices；人生推进中不允许玩家选择，请改用自动 outcomes`);
  }
  if (event.triggerProbability !== undefined && !(event.triggerProbability >= 0 && event.triggerProbability <= 1)) {
    errors.push(`${event.id} 的 triggerProbability 必须在 [0, 1] 内`);
  }

  if (!event.outcomes) continue;
  if (!Array.isArray(event.outcomes) || event.outcomes.length < 2) {
    errors.push(`${event.id} 的 outcomes 至少需要两个自动结果`);
    continue;
  }

  const outcomeIds = new Set();
  for (const outcome of event.outcomes) {
    if (!outcome.id) errors.push(`${event.id} 存在缺少 id 的自动结果`);
    if (outcomeIds.has(outcome.id)) errors.push(`${event.id} 存在重复结果 id：${outcome.id}`);
    outcomeIds.add(outcome.id);
    if (!outcome.resultText) errors.push(`${event.id}:${outcome.id} 缺少 resultText`);
  }
}

validateHistoricalLives();

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  const automaticOutcomeEvents = data.events.filter((event) => event.outcomes?.length).length;
  const chronicleYears = data.historicalLives.reduce((sum, life) => sum + life.timeline.length, 0);
  console.log(`Validated ${data.events.length} events; interactive choices: 0; automatic outcome events: ${automaticOutcomeEvents}; fixed chronicles: ${data.historicalLives.length} (${chronicleYears} authored years)`);
}

function validateEraCoverage(label, eras, getRange) {
  let expectedYear = minBirthYear;
  for (const era of [...eras].sort((a, b) => getRange(a)[0] - getRange(b)[0])) {
    const [startYear, endYear] = getRange(era);
    if (startYear > expectedYear) errors.push(`${label}缺少 ${expectedYear}-${startYear - 1} 年配置`);
    expectedYear = Math.max(expectedYear, endYear + 1);
  }
  if (expectedYear <= maxBirthYear) errors.push(`${label}缺少 ${expectedYear}-${maxBirthYear} 年配置`);
}

function validateHistoricalLives() {
  const ids = new Set();
  for (const life of data.historicalLives) {
    if (!life.id) errors.push("历史人物库存在缺少 id 的作品");
    if (ids.has(life.id)) errors.push(`历史人物库重复 id：${life.id}`);
    ids.add(life.id);
    if (!(life.matchChance > 0 && life.matchChance <= 1)) errors.push(`${life.id} 的 matchChance 必须在 (0, 1] 内`);
    if (!life.trigger?.birthYearRange || life.trigger.birthYearRange[0] !== life.trigger.birthYearRange[1]) {
      errors.push(`${life.id} 必须使用精确出生年份，以校验逐年年谱`);
      continue;
    }
    if (!Array.isArray(life.timeline) || !life.timeline.length) {
      errors.push(`${life.id} 没有逐年时间线`);
      continue;
    }

    const birthYear = life.trigger.birthYearRange[0];
    const seenYears = new Set();
    for (let index = 0; index < life.timeline.length; index += 1) {
      const item = life.timeline[index];
      const expectedYear = birthYear + index;
      if (item.year !== expectedYear) errors.push(`${life.id} 在 ${expectedYear} 年缺少唯一条目（实际读到 ${item.year}）`);
      if (seenYears.has(item.year)) errors.push(`${life.id} 重复年份：${item.year}`);
      seenYears.add(item.year);
      if (!item.title || typeof item.title !== "string") errors.push(`${life.id}:${item.year} 缺少固定标题`);
      if (!item.text || typeof item.text !== "string") errors.push(`${life.id}:${item.year} 缺少固定正文`);
      if (Object.hasOwn(item, "choices") || Object.hasOwn(item, "outcomes")) {
        errors.push(`${life.id}:${item.year} 不能包含选择或随机结果`);
      }
    }

    const finalEntry = life.timeline.at(-1);
    if (!finalEntry.effects?.some((effect) => effect.die)) errors.push(`${life.id} 的最后一年必须明确结束生命`);
    const publicCopy = life.timeline.map((item) => `${item.title}\n${item.text}`).join("\n");
    for (const term of life.hiddenTerms ?? []) {
      if (publicCopy.includes(term)) errors.push(`${life.id} 的玩家文案泄露隐藏身份词：${term}`);
    }
    validateFixedPlayback(life);
  }
}

function validateFixedPlayback(life) {
  const first = simulateHistoricalLife(life, "chronicle-check-a");
  const second = simulateHistoricalLife(life, "chronicle-check-b");
  if (!first.chronicle || first.chronicle.id !== life.id) errors.push(`${life.id} 无法进入固定年谱模式`);
  if (first.history.length !== life.timeline.length) errors.push(`${life.id} 播放条数不是 ${life.timeline.length}`);
  if (first.yearlyChanges.length !== 0) errors.push(`${life.id} 混入了自然流变`);
  if (first.meta.isAlive) errors.push(`${life.id} 播放完最后一年后仍然存活`);
  if (first.history.some((log, index) => log.year !== life.timeline[index]?.year)) errors.push(`${life.id} 播放年份与作品不一致`);

  const visible = (state) => state.history.map(({ year, age, title, text, category, resultText, death }) => ({ year, age, title, text, category, resultText, death }));
  if (JSON.stringify(visible(first)) !== JSON.stringify(visible(second))) {
    errors.push(`${life.id} 会随随机种子改变，违反完全固定原则`);
  }
  const finalState = (state) => ({
    location: state.location,
    attrs: state.attrs,
    resources: state.resources,
    relationships: state.relationships,
    education: state.education,
    career: state.career,
    traits: state.traits,
    tags: state.tags,
    deathReason: state.meta.deathReason,
    endingId: state.meta.endingId,
  });
  if (JSON.stringify(finalState(first)) !== JSON.stringify(finalState(second))) {
    errors.push(`${life.id} 的最终状态会跨 seed 或跨回放改变，可能存在 effect 引用污染`);
  }
}

function simulateHistoricalLife(life, seed) {
  const rng = createRng(seed);
  const aggregateRegistry = createAggregateRegistry(data.aggregates);
  const trigger = life.trigger;
  const familyClass = trigger.familyClasses?.[0] ?? "smallholder";
  const province = trigger.provinces?.[0] ?? "hunan";
  const cityTier = trigger.cityTiers?.[0] ?? "village";
  const setup = {
    seed,
    birthYear: trigger.birthYearRange[0],
    gender: trigger.genders?.[0] ?? "male",
    province,
    provinceHistoryCode: trigger.provinceHistoryCodes?.[0] ?? province,
    cityTier,
    hukou: trigger.hukou?.[0] ?? data.getEffectiveHukou(trigger.birthYearRange[0], cityTier, "rural"),
    familyClass,
    attrs: {
      physique: 3,
      intelligence: trigger.attrs?.intelligence?.gte ?? 4,
      charm: 2,
      family: data.familyClassMeta[familyClass]?.score ?? 4,
      luck: 2,
      mental: trigger.attrs?.mental?.gte ?? 4,
    },
    talents: [],
  };
  const state = createInitialState(setup, data, { rng, aggregateRegistry, forceHistoricalLifeId: life.id });
  while (state.meta.isAlive && state.meta.age <= life.timeline.length) {
    advanceYear(state, data, { rng, aggregateRegistry });
  }
  return state;
}
