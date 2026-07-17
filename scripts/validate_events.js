import { data } from "../src/data/index.js";
import { createAggregateRegistry } from "../src/engine/aggregates.js";
import { advanceYear, applyEvent } from "../src/engine/advanceYear.js";
import { createRng } from "../src/engine/random.js";
import { createInitialState } from "../src/engine/state.js";
import { educationRank, hasActiveCareer, matchLifeCourse } from "../src/engine/lifeCourse.js";
import { getNarrativeDomain, getNarrativeTier, isStructuralTier, narrativeTiers } from "../src/engine/narrative.js";

const errors = [];
const eventIds = new Set();
const [minBirthYear, maxBirthYear] = data.birthYearRange;
const INFANT_ADULT_PERSPECTIVE = /你(?:知道|第一次知道|意识到|明白|懂得|发现|觉得|认为|盘算|决定|期待|担心|记住|记得|回想|先记起|学会|只好|终于|从此)|后来回想|多年以后你仍记得|日子像被洗亮/;
const INFANT_MEMORY_DISCLAIMER = /记不起|无法证明你记住|没有人能证明你记住|由(?:家人|长辈|旁人).{0,12}(?:讲述|转述|保存)/;
const YOUNG_CHILD_ABSTRACTION = /(?:你|他|她)(?:逐渐)?(?:明白|懂得|意识到|理解|归纳|认为|看出).{0,45}(?:秩序|结构|权威|机会|伦理|阶级|制度|命运|时代)|阅读伦理|结构性机会|不肯把.{0,12}当作天理|权威可以/;

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

  const narrativeTier = getNarrativeTier(event);
  if (!narrativeTiers.includes(narrativeTier)) errors.push(`${event.id} 的叙事层级无效：${narrativeTier}`);
  if (!getNarrativeDomain(event)) errors.push(`${event.id} 缺少叙事领域`);
  if (event.narrativeThread?.close && !isStructuralTier(narrativeTier)) {
    errors.push(`${event.id} 试图用非结构性事件关闭叙事线索`);
  }

  if (Object.hasOwn(event, "choices")) {
    errors.push(`${event.id} 使用了 choices；人生推进中不允许玩家选择，请改用自动 outcomes`);
  }
  if (event.triggerProbability !== undefined && !(event.triggerProbability >= 0 && event.triggerProbability <= 1)) {
    errors.push(`${event.id} 的 triggerProbability 必须在 [0, 1] 内`);
  }
  if (event.lifetimeProbability !== undefined && !(event.lifetimeProbability >= 0 && event.lifetimeProbability <= 1)) {
    errors.push(`${event.id} 的 lifetimeProbability 必须在 [0, 1] 内`);
  }
  validateContinuityDefinition(event, event, "event");
  if (["第一份工作", "早早谋生"].includes(event.title) && !hasCondition(event.conditions, (condition) => condition.path === "career.jobsHeld" && condition.eq === 0)) {
    errors.push(`${event.id} 是首次谋生事件，但没有要求 career.jobsHeld === 0`);
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
    validateContinuityDefinition(event, outcome, outcome.id);
  }
}

validateHistoricalLives();
validateOrdinaryContinuity();
validateReportedContradiction();

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

function validateContinuityDefinition(event, owner, scope) {
  const transition = owner.continuity?.education ?? (scope === "event" ? null : event.continuity?.education);
  const levelEffect = (owner.effects ?? []).find((effect) => effect.path === "education.level" && Object.hasOwn(effect, "set"));
  if (levelEffect && !transition) errors.push(`${event.id}:${scope} 修改 education.level 但没有声明 continuity.education`);
  if (!transition) return;
  if (!["enroll", "complete", "interrupt"].includes(transition.action)) {
    errors.push(`${event.id}:${scope} 的教育转移 action 无效：${transition.action}`);
  }
  if (transition.action === "enroll") {
    if (!transition.level) errors.push(`${event.id}:${scope} 的入学转移缺少 level`);
    if (!['full_time', 'part_time'].includes(transition.mode)) errors.push(`${event.id}:${scope} 的入学转移 mode 无效：${transition.mode}`);
    if (levelEffect && levelEffect.set !== transition.level) {
      errors.push(`${event.id}:${scope} 的 education.level=${levelEffect.set} 与连续性 level=${transition.level} 不一致`);
    }
  }
}

function hasCondition(group, predicate) {
  if (!group) return false;
  return ["all", "any", "none"].some((key) => (group[key] ?? []).some((condition) => predicate(condition)));
}

function validateOrdinaryContinuity() {
  const cohorts = [1840, 1900, 1950, 1990, 2010];
  for (const birthYear of cohorts) {
    for (const gender of ["female", "male"]) {
      for (const cityTier of ["village", "city"]) {
        const seed = `continuity-${birthYear}-${gender}-${cityTier}`;
        const rng = createRng(seed);
        const aggregateRegistry = createAggregateRegistry(data.aggregates);
        const hukou = data.getEffectiveHukou(birthYear, cityTier, cityTier === "village" ? "rural" : "urban");
        const familyClass = data.getFamilyClassOptionsForContext(birthYear, cityTier, hukou)[0][0];
        const state = createInitialState({
          seed,
          birthYear,
          gender,
          province: "jiangsu",
          provinceHistoryCode: "jiangsu",
          cityTier,
          hukou,
          familyClass,
          attrs: { physique: 4, intelligence: 5, charm: 3, family: data.familyClassMeta[familyClass]?.score ?? 3, luck: 3, mental: 5 },
          talents: [],
        }, { ...data, historicalLives: [] }, { rng, aggregateRegistry });

        while (state.meta.isAlive && state.meta.age < 85) {
          advanceYear(state, { ...data, historicalLives: [] }, { rng, aggregateRegistry });
          validateLifeCourseSnapshot(state, seed);
        }
      }
    }
  }
}

function validateLifeCourseSnapshot(state, seed) {
  const prefix = `${seed}:${state.meta.currentYear}/${state.meta.age}岁`;
  if (state.education.status === "enrolled") {
    if (state.education.currentLevel === "none") errors.push(`${prefix} 在读但 currentLevel=none`);
    if (state.education.mode === "none") errors.push(`${prefix} 在读但 mode=none`);
    if (!state.tags.includes("student")) errors.push(`${prefix} 在读但缺少 student 标签`);
  } else if (state.tags.includes("student")) {
    errors.push(`${prefix} 非在读状态仍保留 student 标签`);
  }
  if (state.education.status === "enrolled" && state.education.mode === "full_time" && hasActiveCareer(state) && !state.education.concurrentCareer) {
    errors.push(`${prefix} 同时为全日制学生与在职状态，且没有声明兼任关系`);
  }
  if (hasActiveCareer(state) && state.career.jobsHeld < 1) errors.push(`${prefix} 已就业但 jobsHeld=${state.career.jobsHeld}`);
  if (state.lifeCourse.transitions.some((item, index, rows) => index > 0 && item.year < rows[index - 1].year)) {
    errors.push(`${prefix} 人生状态转移年份发生倒序`);
  }
  const educationTransitions = state.lifeCourse.transitions.filter((item) => item.domain === "education");
  for (let index = 1; index < educationTransitions.length; index += 1) {
    if (educationRank(educationTransitions[index].to.completedLevel) < educationRank(educationTransitions[index - 1].to.completedLevel)) {
      errors.push(`${prefix} 已完成教育层级发生倒退`);
      break;
    }
  }
  const ordinaryHistory = state.history.filter((log) => log.narrativeTier !== "chronicle");
  const structuralCount = ordinaryHistory.filter((log) => isStructuralTier(log.narrativeTier)).length;
  if (state.narrative.structuralCount !== structuralCount) {
    errors.push(`${prefix} 叙事结构计数 ${state.narrative.structuralCount} 与日志 ${structuralCount} 不一致`);
  }
  let expectedTextureStreak = 0;
  for (let index = ordinaryHistory.length - 1; index >= 0 && ordinaryHistory[index].narrativeTier === "texture"; index -= 1) expectedTextureStreak += 1;
  if (state.narrative.textureStreak !== expectedTextureStreak) {
    errors.push(`${prefix} 连续纹理年 ${state.narrative.textureStreak} 与日志 ${expectedTextureStreak} 不一致`);
  }
}

function validateReportedContradiction() {
  const seed = "DPITXF";
  const rng = createRng(seed);
  const aggregateRegistry = createAggregateRegistry(data.aggregates);
  const state = createInitialState({
    seed,
    birthYear: 1998,
    gender: "male",
    province: "jiangsu",
    provinceHistoryCode: "jiangsu",
    cityTier: "city",
    hukou: "urban",
    familyClass: "teacher_doctor",
    attrs: { physique: 3, intelligence: 5, charm: 3, family: 6, luck: 3, mental: 4 },
    talents: [],
  }, { ...data, historicalLives: [] }, { rng, aggregateRegistry });
  state.meta.age = 21;
  state.meta.currentYear = 2019;
  const job = data.events.find((event) => event.id === "life_first_job_choice");
  applyEvent(job, job.outcomes.find((outcome) => outcome.id === "stable_company"), state, { rng, aggregateRegistry });
  state.meta.age = 23;
  state.meta.currentYear = 2021;
  const vocational = data.events.find((event) => event.id === "era_vocational_college_expansion");
  if (matchLifeCourse(vocational, state)) errors.push("回归失败：公司职员仍可无解释进入全日制职业院校");
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
      if (index <= 3 && INFANT_ADULT_PERSPECTIVE.test(item.text) && !INFANT_MEMORY_DISCLAIMER.test(item.text)) {
        errors.push(`${life.id}:${item.year} 的0—3岁正文疑似使用成人认知或稳定自传记忆`);
      }
      if (index >= 4 && index <= 7 && YOUNG_CHILD_ABSTRACTION.test(item.text)) {
        errors.push(`${life.id}:${item.year} 的4—7岁正文疑似倒灌成人式结构分析`);
      }
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
    lifeCourse: state.lifeCourse,
    narrative: state.narrative,
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
