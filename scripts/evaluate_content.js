import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";
import { data } from "../src/data/index.js";
import { createAggregateRegistry } from "../src/engine/aggregates.js";
import { getLifeStage } from "../src/engine/stage.js";

const args = parseArgs(process.argv.slice(2));
const sampleLimit = readPositiveNumber(args.samples, 8);
const aggregateRegistry = createAggregateRegistry(data.aggregates);
function main() {
  const inputFiles = resolveInputFiles(args);
  const batch = inputFiles ? loadBatch(inputFiles) : null;
  const findings = [];
  const staticMetrics = evaluateStaticData(findings);
  const batchMetrics = batch ? evaluateBatch(batch, findings) : null;
  const chronicleMetrics = batch ? evaluateChronicles(batch, findings) : evaluateChronicleDefinitions(findings);
  const score = calculateScore(staticMetrics, batchMetrics, chronicleMetrics, findings);
  const result = {
    generated_at: new Date().toISOString(),
    score,
    grade: gradeFor(score),
    inputs: inputFiles,
    metrics: {
      static: staticMetrics,
      batch: batchMetrics,
      chronicles: chronicleMetrics,
    },
    findings,
  };

  const report = formatReport(result);
  console.log(report);

  if (args.json) writeOutput(resolve(args.json), `${JSON.stringify(result, null, 2)}\n`);
  if (args.report) writeOutput(resolve(args.report), report);

  const minScore = Number(args["min-score"] ?? 80);
  if (args.strict === "true" && (score < minScore || findings.some((item) => item.severity === "error"))) {
    process.exitCode = 1;
  }
}

function evaluateStaticData(output) {
  const knownIds = new Set(data.events.map((event) => event.id));
  const invalidReferences = [];
  const unreachable = [];
  const invalidFilters = [];
  const shortTexts = [];
  const longTexts = [];
  const textRecords = [];

  for (const event of data.events) {
    if (!isTemporallyReachable(event)) unreachable.push(event.id);
    validateReferences(event, knownIds, invalidReferences);
    validateDirectFilters(event, invalidFilters);
    for (const [variantIndex, text] of visibleTexts(event.text).entries()) {
      const id = `${event.id}#${variantIndex + 1}`;
      const length = chineseLength(text);
      if (length < 18) shortTexts.push(`${id}(${length})`);
      if (length > 190) longTexts.push(`${id}(${length})`);
      textRecords.push({ id, origin: event.id, text, normalized: normalizeText(text) });
    }
    for (const outcome of event.outcomes ?? []) {
      const id = `${event.id}:${outcome.id}`;
      const length = chineseLength(outcome.resultText ?? "");
      if (length < 10) shortTexts.push(`${id}(${length})`);
      textRecords.push({ id, origin: event.id, text: outcome.resultText ?? "", normalized: normalizeText(outcome.resultText ?? "") });
    }
  }

  for (const life of data.historicalLives ?? []) {
    for (const item of life.timeline ?? []) {
      const id = `${life.id}:${item.year}`;
      const length = chineseLength(item.text ?? "");
      if (length < 35) shortTexts.push(`${id}(${length})`);
      if (length > 230) longTexts.push(`${id}(${length})`);
      textRecords.push({ id, origin: id, text: item.text ?? "", normalized: normalizeText(item.text ?? "") });
    }
  }

  const exactDuplicates = duplicateGroups(textRecords);
  const nearDuplicates = nearDuplicatePairs(textRecords);
  const eraInventory = Object.fromEntries(ERA_BUCKETS.map((era) => [
    era.id,
    data.events.filter((event) => eventCanOccurDuring(event, era.start, era.end)).length,
  ]));
  const modernTermRisks = scanStaticModernTerms(data.events);
  const priorityDeathHazards = findPriorityDeathHazards(data.events);

  addFinding(output, "error", "STATIC_UNREACHABLE", `静态条件互相冲突、在支持范围内不可触发的事件 ${unreachable.length} 个`, unreachable);
  addFinding(output, "error", "BROKEN_EVENT_REFERENCE", `依赖或调度引用不存在的事件 ${invalidReferences.length} 处`, invalidReferences);
  addFinding(output, "error", "INVALID_DIRECT_FILTER", `地区、阶级、性别过滤器含未知值 ${invalidFilters.length} 处`, invalidFilters);
  addFinding(output, "warning", "SHORT_COPY", `正文过短、难以形成文学质感的条目 ${shortTexts.length} 个`, shortTexts);
  addFinding(output, "warning", "LONG_COPY", `正文过长、可能破坏逐年阅读节奏的条目 ${longTexts.length} 个`, longTexts);
  addFinding(output, "warning", "EXACT_COPY_DUPLICATE", `不同条目之间存在完全相同文案 ${exactDuplicates.length} 组`, exactDuplicates.map(formatDuplicateGroup));
  addFinding(output, "warning", "NEAR_COPY_DUPLICATE", `不同条目之间存在高度相似文案 ${nearDuplicates.length} 对`, nearDuplicates);
  addFinding(output, "warning", "STATIC_ANACHRONISM_RISK", `事件可触发年份早于文案词汇普及年份 ${modernTermRisks.length} 处`, modernTermRisks);
  addFinding(output, "warning", "PRIORITY_DEATH_HAZARD", `低权重死亡事件在部分年龄/年份仍是唯一最高优先级候选 ${priorityDeathHazards.length} 处`, priorityDeathHazards);

  return {
    event_definitions: data.events.length,
    historical_lives: data.historicalLives?.length ?? 0,
    authored_chronicle_years: (data.historicalLives ?? []).reduce((sum, life) => sum + life.timeline.length, 0),
    unreachable_events: unreachable.length,
    broken_references: invalidReferences.length,
    invalid_filters: invalidFilters.length,
    short_copy_items: shortTexts.length,
    long_copy_items: longTexts.length,
    exact_duplicate_groups: exactDuplicates.length,
    near_duplicate_pairs: nearDuplicates.length,
    static_anachronism_risks: modernTermRisks.length,
    priority_death_hazards: priorityDeathHazards.length,
    era_event_inventory: eraInventory,
  };
}

function evaluateBatch(batch, output) {
  const { summary, years, events } = batch;
  const summariesByRun = indexUnique(summary, "run_id");
  const yearsByRun = groupByMap(years, (row) => row.run_id);
  const eventsByRun = groupByMap(events, (row) => row.run_id);
  const yearsById = indexUnique(years, "year_id");
  const definitions = new Map(data.events.map((event) => [event.id, event]));
  const locationReplay = reconstructTriggerLocations(events, definitions);
  const triggerLocations = locationReplay.triggerLocations;
  const integrityProblems = [];
  const observedConflicts = [];
  const silentRows = [];
  const longSilentStreaks = [];
  const repeatedEventExcess = [];
  const repeatedTextExcess = [];
  const anachronisms = [];

  for (const row of years) {
    if (!summariesByRun.has(row.run_id)) integrityProblems.push(`years:${row.year_id} 缺少 summary`);
    if (number(row.year) !== number(row.birth_year) + number(row.age)) {
      integrityProblems.push(`years:${row.year_id} 年份不等于出生年+年龄`);
    }
    if (number(row.event_count) === 0) silentRows.push(`${row.run_id}@${row.year}(age ${row.age})`);
  }
  for (const row of events) {
    if (!summariesByRun.has(row.run_id)) integrityProblems.push(`events:${row.event_row_id} 缺少 summary`);
    if (!yearsById.has(row.year_id)) integrityProblems.push(`events:${row.event_row_id} 缺少 year`);
    if (number(row.year) !== number(row.birth_year) + number(row.age)) {
      integrityProblems.push(`events:${row.event_row_id} 年份不等于出生年+年龄`);
    }
    const definition = definitions.get(row.event_id);
    if (definition) observedConflicts.push(...observedDefinitionConflicts(definition, row, triggerLocations.get(row.event_row_id)));
    for (const rule of MODERN_TERMS) {
      if (number(row.year) < rule.since && `${row.final_text}${row.final_result_text}`.includes(rule.term)) {
        anachronisms.push(`${row.event_row_id} ${row.year}年出现“${rule.term}”（建议不早于${rule.since}）`);
      }
    }
  }

  for (const summaryRow of summary) {
    const runYears = yearsByRun.get(summaryRow.run_id) ?? [];
    const runEvents = eventsByRun.get(summaryRow.run_id) ?? [];
    if (number(summaryRow.event_count) !== runEvents.length) {
      integrityProblems.push(`${summaryRow.run_id} summary事件数=${summaryRow.event_count}，明细=${runEvents.length}`);
    }
    if (runYears.length && number(summaryRow.final_age) !== Math.max(...runYears.map((row) => number(row.age)))) {
      integrityProblems.push(`${summaryRow.run_id} final_age 与 years 最大年龄不符`);
    }
    const streak = longestSilentStreak(runYears);
    if (streak.length >= 3) longSilentStreaks.push(`${summaryRow.run_id}: ${streak.length}年（${streak.start}-${streak.end}）`);

    const eventCounts = countBy(runEvents, (row) => row.event_id);
    for (const [id, count] of Object.entries(eventCounts)) {
      if (count <= 1) continue;
      repeatedEventExcess.push(...Array(count - 1).fill(id));
      const max = definitions.get(id)?.maxOccurrences;
      if (max && count > max) observedConflicts.push(`${summaryRow.run_id}:${id} 触发${count}次，超过 maxOccurrences=${max}`);
    }
    const textGroups = groupBy(runEvents, (row) => normalizeText(`${row.final_text}\n${row.final_result_text}`));
    for (const [text, rows] of Object.entries(textGroups)) {
      if (!text || rows.length <= 1) continue;
      const ids = [...new Set(rows.map((row) => row.event_id))].join("|");
      repeatedTextExcess.push(...Array(rows.length - 1).fill(`${ids}：“${text.slice(0, 34)}”`));
    }
  }

  const eventCounts = countBy(events, (row) => row.event_id);
  const observedIds = new Set(Object.keys(eventCounts).filter((id) => definitions.has(id)));
  const neverObserved = data.events.map((event) => event.id).filter((id) => !observedIds.has(id));
  const topEvents = Object.entries(eventCounts).sort((a, b) => b[1] - a[1]).slice(0, 15);
  const topTenCount = topEvents.slice(0, 10).reduce((sum, [, count]) => sum + count, 0);
  const endings = countBy(summary, (row) => row.ending_id || (row.alive === "yes" ? "alive_at_cap" : "unclassified_death"));
  const deathReasons = countBy(summary, (row) => row.death_reason || (row.alive === "yes" ? "alive_at_cap" : "unknown"));
  const ended = summary.filter((row) => row.alive === "no");
  const premature40 = summary.filter((row) => number(row.final_age) < 40).length;
  const childDeaths = summary.filter((row) => number(row.final_age) < 18).length;
  const infantDeaths = summary.filter((row) => number(row.final_age) < 1).length;
  const eraStats = Object.fromEntries(ERA_BUCKETS.map((era) => {
    const runs = summary.filter((row) => inRange(number(row.birth_year), era.start, era.end));
    const ids = new Set(runs.flatMap((row) => (eventsByRun.get(row.run_id) ?? []).map((event) => event.event_id)));
    return [era.id, {
      runs: runs.length,
      mean_final_age: average(runs.map((row) => number(row.final_age))),
      unique_events: ids.size,
      early_death_under_40_rate: ratio(runs.filter((row) => number(row.final_age) < 40).length, runs.length),
    }];
  }));
  const categoryCounts = countBy(events, (row) => row.category || "unknown");
  const lightTextureCount = events.filter((row) => LIGHT_TEXTURE_TERMS.some((term) => row.final_text.includes(term))).length;
  const earlyDeathClusters = ERA_BUCKETS
    .map((era) => ({ era, stats: eraStats[era.id] }))
    .filter(({ era, stats }) => stats.runs >= 200 && stats.early_death_under_40_rate > era.maxEarlyDeathUnder40)
    .map(({ era, stats }) => `${era.label}: ${stats.runs}局中${percent(stats.early_death_under_40_rate)}在40岁前结束，校准上限${percent(era.maxEarlyDeathUnder40)}`);

  addFinding(output, "error", "CSV_INTEGRITY", `三张 CSV 关联或计数错误 ${integrityProblems.length} 处`, integrityProblems);
  addFinding(output, "error", "OBSERVED_CONDITION_CONFLICT", `实际触发记录违反事件时间/地区/阶级/性别条件 ${observedConflicts.length} 处`, observedConflicts);
  addFinding(output, "warning", "SILENT_YEAR", `没有事件的年份 ${silentRows.length}/${years.length}（${percent(ratio(silentRows.length, years.length))}）`, [...silentRows, ...longSilentStreaks]);
  addFinding(output, "warning", "REPEATED_EVENT_IN_LIFE", `同一人生重复触发同一事件的额外次数 ${repeatedEventExcess.length}`, topCounts(repeatedEventExcess));
  addFinding(output, "warning", "REPEATED_VISIBLE_COPY", `同一人生重复出现完全相同最终文案的额外次数 ${repeatedTextExcess.length}`, topCounts(repeatedTextExcess));
  addFinding(output, "warning", "OBSERVED_ANACHRONISM", `样本中出现疑似时代词汇穿越 ${anachronisms.length} 处`, anachronisms);
  addFinding(output, "warning", "INTRA_YEAR_LOCATION_BREAK", `同年先迁居、后出现只适用于旧地点的事件 ${locationReplay.orderConflicts.length} 处`, locationReplay.orderConflicts);
  if (earlyDeathClusters.length) addFinding(output, "warning", "EARLY_DEATH_CLUSTER", `有 ${earlyDeathClusters.length} 个出生年代的40岁前结束率超过分年代校准上限`, earlyDeathClusters);
  addFinding(output, "info", "NEVER_OBSERVED", `本批次未覆盖正式事件 ${neverObserved.length}/${data.events.length}`, neverObserved);
  if (ratio(topTenCount, events.length) > 0.42) {
    addFinding(output, "warning", "EVENT_CONCENTRATION", `触发最多的10个事件占全部事件 ${percent(ratio(topTenCount, events.length))}`, topEvents.map(([id, count]) => `${id}:${count}`));
  }
  if (events.length && ratio(lightTextureCount, events.length) < 0.025) {
    addFinding(output, "warning", "LOW_LIGHT_TEXTURE", `带轻松、幽默或生活趣味信号的事件仅 ${lightTextureCount}/${events.length}`, []);
  }
  if (ended.length && ratio(ended.filter((row) => !row.ending_id).length, ended.length) > 0.01) {
    addFinding(output, "warning", "UNCLASSIFIED_ENDING", `已死亡人生中有 ${ended.filter((row) => !row.ending_id).length} 局缺少 ending_id`, []);
  }

  return {
    runs: summary.length,
    year_rows: years.length,
    event_rows: events.length,
    mean_events_per_year: ratio(events.length, years.length),
    silent_years: silentRows.length,
    silent_year_rate: ratio(silentRows.length, years.length),
    longest_silent_streaks_over_3: longSilentStreaks.length,
    observed_unique_events: observedIds.size,
    event_coverage_rate: ratio(observedIds.size, data.events.length),
    never_observed_events: neverObserved.length,
    repeated_event_excess: repeatedEventExcess.length,
    repeated_event_rate: ratio(repeatedEventExcess.length, events.length),
    repeated_visible_copy_excess: repeatedTextExcess.length,
    repeated_visible_copy_rate: ratio(repeatedTextExcess.length, events.length),
    observed_condition_conflicts: observedConflicts.length,
    observed_anachronisms: anachronisms.length,
    intra_year_location_breaks: locationReplay.orderConflicts.length,
    infant_death_rate: ratio(infantDeaths, summary.length),
    child_death_under_18_rate: ratio(childDeaths, summary.length),
    early_death_under_40_rate: ratio(premature40, summary.length),
    early_death_era_clusters: earlyDeathClusters.length,
    mean_final_age: average(summary.map((row) => number(row.final_age))),
    ending_distribution: endings,
    death_reason_distribution: deathReasons,
    category_distribution: categoryCounts,
    top_events: Object.fromEntries(topEvents),
    top_10_event_share: ratio(topTenCount, events.length),
    light_texture_signal_rate: ratio(lightTextureCount, events.length),
    era_breakdown: eraStats,
  };
}

function evaluateChronicleDefinitions(output) {
  const problems = validateChronicleDefinitions();
  addFinding(output, "error", "CHRONICLE_DEFINITION", `固定年谱结构问题 ${problems.length} 处`, problems);
  return {
    definitions: data.historicalLives?.length ?? 0,
    sampled_runs: 0,
    problems: problems.length,
    note: "未读取批量 CSV；定义已扫描，但尚未验证跨 seed 播放一致性",
  };
}

function evaluateChronicles(batch, output) {
  const definitionProblems = validateChronicleDefinitions();
  const summary = batch.summary.filter((row) => row.chronicle_id);
  const eventsByRun = groupByMap(batch.events, (row) => row.run_id);
  const yearsByRun = groupByMap(batch.years, (row) => row.run_id);
  const playbackProblems = [];
  const signaturesByLife = new Map();

  for (const row of summary) {
    const life = data.historicalLives.find((item) => item.id === row.chronicle_id);
    if (!life) {
      playbackProblems.push(`${row.run_id} 使用未知 chronicle_id=${row.chronicle_id}`);
      continue;
    }
    const events = [...(eventsByRun.get(row.run_id) ?? [])].sort((a, b) => number(a.event_order) - number(b.event_order));
    const years = [...(yearsByRun.get(row.run_id) ?? [])].sort((a, b) => number(a.age) - number(b.age));
    if (events.length !== life.timeline.length) playbackProblems.push(`${row.run_id} 事件${events.length}条，应为${life.timeline.length}条`);
    if (years.length !== life.timeline.length) playbackProblems.push(`${row.run_id} 年份${years.length}条，应为${life.timeline.length}条`);
    if (number(row.yearly_change_count) !== 0) playbackProblems.push(`${row.run_id} 混入${row.yearly_change_count}条自然流变`);
    for (let index = 0; index < life.timeline.length; index += 1) {
      const expected = life.timeline[index];
      const event = events[index];
      const year = years[index];
      if (!event || !year) continue;
      if (number(event.year) !== expected.year || number(year.year) !== expected.year) playbackProblems.push(`${row.run_id} 第${index + 1}条年份错位`);
      if (event.event_id !== `${life.id}:${expected.year}`) playbackProblems.push(`${row.run_id} ${expected.year}事件id不固定`);
      if (number(year.event_count) !== 1) playbackProblems.push(`${row.run_id} ${expected.year}不是一年一条事件`);
      for (const term of life.hiddenTerms ?? []) {
        if (`${event.title}${event.final_text}${event.final_result_text}`.includes(term)) playbackProblems.push(`${row.run_id} ${expected.year}泄露隐藏身份词`);
      }
    }
    const signature = events.map((event) => [event.year, event.title, event.category, event.final_text, event.final_result_text, event.death]);
    const signatures = signaturesByLife.get(life.id) ?? [];
    signatures.push({ runId: row.run_id, value: JSON.stringify(signature) });
    signaturesByLife.set(life.id, signatures);
  }

  for (const [id, signatures] of signaturesByLife) {
    if (signatures.length < 2) continue;
    const expected = signatures[0].value;
    for (const signature of signatures.slice(1)) {
      if (signature.value !== expected) playbackProblems.push(`${id} 的 ${signature.runId} 可见文本随 seed 改变`);
    }
  }

  addFinding(output, "error", "CHRONICLE_DEFINITION", `固定年谱结构问题 ${definitionProblems.length} 处`, definitionProblems);
  addFinding(output, "error", "CHRONICLE_PLAYBACK", `固定年谱批量播放问题 ${playbackProblems.length} 处`, playbackProblems);
  if (!summary.length) addFinding(output, "info", "CHRONICLE_NOT_SAMPLED", "本批次没有固定年谱样本；请另跑 --historical-life", []);

  return {
    definitions: data.historicalLives?.length ?? 0,
    sampled_runs: summary.length,
    sampled_ids: [...signaturesByLife.keys()],
    definition_problems: definitionProblems.length,
    playback_problems: playbackProblems.length,
    deterministic_comparisons: [...signaturesByLife.values()].reduce((sum, items) => sum + Math.max(0, items.length - 1), 0),
  };
}

function validateChronicleDefinitions() {
  const problems = [];
  for (const life of data.historicalLives ?? []) {
    const birthYear = life.trigger?.birthYearRange?.[0];
    if (!Number.isInteger(birthYear) || life.trigger.birthYearRange[1] !== birthYear) {
      problems.push(`${life.id} 没有精确出生年`);
      continue;
    }
    for (let index = 0; index < (life.timeline?.length ?? 0); index += 1) {
      const item = life.timeline[index];
      if (item.year !== birthYear + index) problems.push(`${life.id} 缺少 ${birthYear + index} 年固定条目`);
      if (Object.hasOwn(item, "choices") || Object.hasOwn(item, "outcomes")) problems.push(`${life.id}:${item.year} 含随机/选择分支`);
      for (const term of life.hiddenTerms ?? []) {
        if (`${item.title}${item.text}`.includes(term)) problems.push(`${life.id}:${item.year} 泄露隐藏身份词`);
      }
    }
    if (!life.timeline?.at(-1)?.effects?.some((effect) => effect.die)) problems.push(`${life.id} 最后一年未明确死亡`);
  }
  return problems;
}

function observedDefinitionConflicts(event, eventRow, triggerLocation) {
  const problems = [];
  const prefix = `${eventRow.event_row_id}:${event.id}`;
  const age = number(eventRow.age);
  const year = number(eventRow.year);
  const birthYear = number(eventRow.birth_year);
  if (event.ageRange && !inRange(age, ...event.ageRange)) problems.push(`${prefix} age=${age} 不在 ${event.ageRange.join("-")}`);
  if (event.yearRange && !inRange(year, ...event.yearRange)) problems.push(`${prefix} year=${year} 不在 ${event.yearRange.join("-")}`);
  if (event.birthYearRange && !inRange(birthYear, ...event.birthYearRange)) problems.push(`${prefix} birthYear=${birthYear} 不在 ${event.birthYearRange.join("-")}`);
  if (event.stage && !event.stage.includes(getLifeStage(age))) problems.push(`${prefix} stage=${getLifeStage(age)} 不匹配`);
  if (event.genders && !event.genders.includes(eventRow.gender)) problems.push(`${prefix} gender=${eventRow.gender} 不匹配`);
  if (event.birthFamilyClasses && !event.birthFamilyClasses.includes(eventRow.family_class)) problems.push(`${prefix} family=${eventRow.family_class} 不匹配`);
  problems.push(...regionConflicts(prefix, event.birthRegions, {
    province: eventRow.birth_province,
    cityTier: eventRow.birth_city_tier,
    hukou: eventRow.hukou,
    gender: eventRow.gender,
  }));
  if (triggerLocation) {
    problems.push(...regionConflicts(prefix, event.currentRegions, {
      province: triggerLocation.currentProvince,
      cityTier: triggerLocation.currentCityTier,
      hukou: eventRow.hukou,
      gender: eventRow.gender,
    }));
  }
  return problems;
}

function reconstructTriggerLocations(eventRows, definitions) {
  const triggerLocations = new Map();
  const orderConflicts = [];
  const byRun = groupByMap(eventRows, (row) => row.run_id);
  for (const rows of byRun.values()) {
    const ordered = [...rows].sort((a, b) => number(a.event_order) - number(b.event_order));
    const first = ordered[0];
    if (!first) continue;
    const location = {
      currentProvince: first.birth_province,
      currentCityTier: first.birth_city_tier,
    };
    const byAge = groupByMap(ordered, (row) => row.age);
    for (const yearRows of byAge.values()) {
      const yearStart = { ...location };
      for (const row of yearRows) triggerLocations.set(row.event_row_id, yearStart);
      for (const row of yearRows) {
        const event = definitions.get(row.event_id);
        if (!event) continue;
        const outcome = (event.outcomes ?? []).find((item) => item.id === row.outcome_id);
        const before = { ...location };
        applyLocationEffects(location, [...(event.effects ?? []), ...(outcome?.effects ?? [])]);
        if (before.currentProvince === location.currentProvince && before.currentCityTier === location.currentCityTier) continue;
        for (const later of yearRows.filter((item) => number(item.event_order) > number(row.event_order))) {
          const laterEvent = definitions.get(later.event_id);
          if (!laterEvent?.currentRegions) continue;
          const mismatches = regionConflicts(`${later.event_row_id}:${later.event_id}`, laterEvent.currentRegions, {
            province: location.currentProvince,
            cityTier: location.currentCityTier,
            hukou: later.hukou,
            gender: later.gender,
          });
          if (mismatches.length) orderConflicts.push(`${row.event_row_id}:${row.event_id} 迁至 ${location.currentProvince}/${location.currentCityTier} 后，${later.event_id} 仍按旧地点入选`);
        }
      }
    }
  }
  return { triggerLocations, orderConflicts };
}

function applyLocationEffects(location, effects) {
  for (const effect of effects) {
    if (effect.path === "location.currentProvince" && Object.hasOwn(effect, "set")) location.currentProvince = effect.set;
    if (effect.path === "location.currentCityTier" && Object.hasOwn(effect, "set")) location.currentCityTier = effect.set;
  }
}

function regionConflicts(prefix, filter, source) {
  if (!filter) return [];
  const problems = [];
  if (filter.provinces && !filter.provinces.includes(source.province)) problems.push(`${prefix} province=${source.province} 不匹配`);
  if (filter.provinceGroups && !filter.provinceGroups.some((id) => aggregateRegistry.includes(id, source.province))) problems.push(`${prefix} province group 不匹配`);
  if (filter.cityTiers && !filter.cityTiers.includes(source.cityTier)) problems.push(`${prefix} cityTier=${source.cityTier} 不匹配`);
  if (filter.cityTierGroups && !filter.cityTierGroups.some((id) => aggregateRegistry.includes(id, source.cityTier))) problems.push(`${prefix} city tier group 不匹配`);
  if (filter.hukou && !filter.hukou.includes(source.hukou)) problems.push(`${prefix} hukou=${source.hukou} 不匹配`);
  if (filter.genders && !filter.genders.includes(source.gender)) problems.push(`${prefix} region gender=${source.gender} 不匹配`);
  return problems;
}

function validateReferences(event, knownIds, problems) {
  for (const field of ["requiresEvents", "blocksEvents", "requiresAnyEvent", "blocksAnyEvent"]) {
    for (const id of event[field] ?? []) if (!knownIds.has(id)) problems.push(`${event.id}.${field}->${id}`);
  }
  for (const effect of [...(event.effects ?? []), ...(event.outcomes ?? []).flatMap((outcome) => outcome.effects ?? [])]) {
    if (effect.scheduleEvent?.eventId && !knownIds.has(effect.scheduleEvent.eventId)) problems.push(`${event.id}.scheduleEvent->${effect.scheduleEvent.eventId}`);
  }
}

function validateDirectFilters(event, problems) {
  const known = {
    genders: new Set(data.genderTypes.map(([id]) => id)),
    provinces: new Set(data.provinces.map(([id]) => id)),
    cityTiers: new Set(data.cityTiers.map(([id]) => id)),
    hukou: new Set(data.hukouTypes.map(([id]) => id)),
    familyClasses: new Set(data.familyClassEras.flatMap((era) => era.options.map(([id]) => id))),
  };
  for (const value of event.genders ?? []) if (!known.genders.has(value)) problems.push(`${event.id}.genders:${value}`);
  for (const value of event.birthFamilyClasses ?? []) if (!known.familyClasses.has(value)) problems.push(`${event.id}.birthFamilyClasses:${value}`);
  for (const [label, filter] of [["birthRegions", event.birthRegions], ["currentRegions", event.currentRegions]]) {
    if (!filter) continue;
    for (const key of ["genders", "provinces", "cityTiers", "hukou"]) {
      for (const value of filter[key] ?? []) if (!known[key].has(value)) problems.push(`${event.id}.${label}.${key}:${value}`);
    }
  }
}

function isTemporallyReachable(event) {
  const [minBirth, maxBirth] = intersectRange(data.birthYearRange, event.birthYearRange ?? data.birthYearRange);
  if (minBirth > maxBirth) return false;
  const [minAge, maxAge] = intersectRange([0, 112], event.ageRange ?? [0, 112]);
  if (minAge > maxAge) return false;
  for (let birthYear = minBirth; birthYear <= maxBirth; birthYear += 1) {
    for (let age = minAge; age <= maxAge; age += 1) {
      const year = birthYear + age;
      if (event.yearRange && !inRange(year, ...event.yearRange)) continue;
      if (event.stage && !event.stage.includes(getLifeStage(age))) continue;
      return true;
    }
  }
  return false;
}

function eventCanOccurDuring(event, start, end) {
  if (event.yearRange && (event.yearRange[1] < start || event.yearRange[0] > end)) return false;
  const copy = { ...event, yearRange: intersectRange(event.yearRange ?? [start, end], [start, end]) };
  return isTemporallyReachable(copy);
}

function scanStaticModernTerms(events) {
  const risks = [];
  for (const event of events) {
    for (const { text, earliest } of datedTextVariants(event)) {
      for (const rule of MODERN_TERMS) {
        if (earliest < rule.since && text.includes(rule.term)) risks.push(`${event.id} 最早${earliest}年可触发，却出现“${rule.term}”（${rule.since}+）`);
      }
    }
  }
  return [...new Set(risks)];
}

function datedTextVariants(event) {
  const baseEarliest = earliestPossibleYear(event);
  if (typeof event.text === "string") return [{ text: event.text, earliest: baseEarliest }];
  if (!Array.isArray(event.text)) return [];
  const conditional = event.text.filter((item) => typeof item !== "string" && item.conditions);
  const continuousUpperBounds = conditional
    .map((item) => yearBoundsFromConditions(item.conditions))
    .filter((bounds) => bounds.min <= baseEarliest && Number.isFinite(bounds.max))
    .map((bounds) => bounds.max);
  const fallbackEarliest = continuousUpperBounds.length
    ? Math.max(baseEarliest, Math.max(...continuousUpperBounds) + 1)
    : baseEarliest;
  return event.text.map((item) => {
    if (typeof item === "string") return { text: item, earliest: fallbackEarliest };
    const bounds = yearBoundsFromConditions(item.conditions);
    return { text: item.text, earliest: item.conditions ? Math.max(baseEarliest, bounds.min) : fallbackEarliest };
  }).filter((item) => item.text);
}

function yearBoundsFromConditions(group) {
  let bounds = { min: -Infinity, max: Infinity };
  for (const condition of group?.all ?? []) {
    if (condition.path !== "meta.currentYear") continue;
    if (condition.gte !== undefined) bounds.min = Math.max(bounds.min, condition.gte);
    if (condition.gt !== undefined) bounds.min = Math.max(bounds.min, condition.gt + 1);
    if (condition.lte !== undefined) bounds.max = Math.min(bounds.max, condition.lte);
    if (condition.lt !== undefined) bounds.max = Math.min(bounds.max, condition.lt - 1);
    if (condition.eq !== undefined) bounds = { min: condition.eq, max: condition.eq };
  }
  return bounds;
}

function findPriorityDeathHazards(events) {
  const hazards = [];
  for (const event of events) {
    if (!event.priority || (event.baseWeight ?? 1) > 10 || !event.effects?.some((effect) => effect.die)) continue;
    let witness = null;
    for (let birthYear = data.birthYearRange[0]; birthYear <= data.birthYearRange[1] && !witness; birthYear += 1) {
      for (let age = 0; age <= 112; age += 1) {
        if (!matchesEventTime(event, birthYear, age)) continue;
        const competitor = events.some((other) => (
          other.id !== event.id
          && (other.priority ?? 0) >= event.priority
          && matchesEventTime(other, birthYear, age)
        ));
        if (!competitor) {
          witness = `${birthYear + age}年/年龄${age}`;
          break;
        }
      }
    }
    if (witness) hazards.push(`${event.id}: priority=${event.priority}, baseWeight=${event.baseWeight ?? 1}，${witness}一旦满足其余条件便不会按低权重抽取`);
  }
  return hazards;
}

function matchesEventTime(event, birthYear, age) {
  if (!inRange(birthYear, ...data.birthYearRange)) return false;
  if (event.birthYearRange && !inRange(birthYear, ...event.birthYearRange)) return false;
  if (event.ageRange && !inRange(age, ...event.ageRange)) return false;
  if (event.yearRange && !inRange(birthYear + age, ...event.yearRange)) return false;
  if (event.stage && !event.stage.includes(getLifeStage(age))) return false;
  return true;
}

function earliestPossibleYear(event) {
  const birth = Math.max(data.birthYearRange[0], event.birthYearRange?.[0] ?? data.birthYearRange[0]);
  const age = Math.max(0, event.ageRange?.[0] ?? 0);
  return Math.max(birth + age, event.yearRange?.[0] ?? -Infinity);
}

function calculateScore(staticMetrics, batchMetrics, chronicleMetrics, allFindings) {
  let score = 100;
  const errorCount = allFindings.filter((item) => item.severity === "error").reduce((sum, item) => sum + item.count, 0);
  score -= Math.min(40, errorCount * 8);
  score -= Math.min(12, staticMetrics.static_anachronism_risks * 2);
  score -= Math.min(12, staticMetrics.priority_death_hazards * 6);
  score -= Math.min(8, staticMetrics.exact_duplicate_groups * 2);
  if (batchMetrics) {
    score -= Math.min(18, batchMetrics.silent_year_rate * 180);
    score -= Math.min(35, batchMetrics.repeated_visible_copy_rate * 70);
    score -= Math.min(10, batchMetrics.observed_anachronisms * 2);
    score -= Math.min(12, batchMetrics.early_death_era_clusters * 6);
    score -= Math.min(8, batchMetrics.intra_year_location_breaks * 2);
    if (batchMetrics.event_coverage_rate < 0.45 && batchMetrics.runs >= 200) score -= (0.45 - batchMetrics.event_coverage_rate) * 20;
    if (batchMetrics.top_10_event_share > 0.42) score -= Math.min(8, (batchMetrics.top_10_event_share - 0.42) * 40);
  }
  score -= Math.min(20, (chronicleMetrics.playback_problems ?? chronicleMetrics.problems ?? 0) * 10);
  return Math.max(0, Math.round(score * 10) / 10);
}

function formatReport(result) {
  const lines = [
    "# 人生模拟器内容质量评测",
    "",
    `总分：${result.score}/100（${result.grade}）`,
    `生成时间：${result.generated_at}`,
    "",
    "## 样本概况",
    "",
    `- 正式事件定义：${result.metrics.static.event_definitions}`,
    `- 固定年谱：${result.metrics.static.historical_lives} 部，${result.metrics.static.authored_chronicle_years} 个逐年条目`,
  ];
  if (result.metrics.batch) {
    const batch = result.metrics.batch;
    lines.push(
      `- 批量人生：${batch.runs} 局，${batch.year_rows} 个人年，${batch.event_rows} 条事件`,
      `- 事件覆盖：${batch.observed_unique_events}/${result.metrics.static.event_definitions}（${percent(batch.event_coverage_rate)}）`,
      `- 无事件年份：${batch.silent_years}/${batch.year_rows}（${percent(batch.silent_year_rate)}）`,
      `- 同局重复可见文案：${batch.repeated_visible_copy_excess} 次（${percent(batch.repeated_visible_copy_rate)}）`,
      `- 40岁前结束：${percent(batch.early_death_under_40_rate)}；平均终年：${formatNumber(batch.mean_final_age)}`,
      `- 固定年谱样本：${result.metrics.chronicles.sampled_runs} 局，跨 seed 比较 ${result.metrics.chronicles.deterministic_comparisons} 次`,
    );
  } else {
    lines.push("- 未提供 CSV：本次仅扫描数据定义");
  }

  for (const severity of ["error", "warning", "info"]) {
    const selected = result.findings.filter((item) => item.severity === severity);
    lines.push("", `## ${severityLabel(severity)}（${selected.length}类）`, "");
    if (!selected.length) {
      lines.push("- 无");
      continue;
    }
    for (const item of selected) {
      lines.push(`- [${item.code}] ${item.message}`);
      for (const sample of item.samples) lines.push(`  - ${sample}`);
    }
  }

  if (result.metrics.batch) {
    lines.push("", "## 分年代样本", "");
    for (const era of ERA_BUCKETS) {
      const item = result.metrics.batch.era_breakdown[era.id];
      lines.push(`- ${era.label}：${item.runs}局，平均终年${formatNumber(item.mean_final_age)}，覆盖${item.unique_events}种事件，40岁前结束${percent(item.early_death_under_40_rate)}`);
    }
    lines.push("", "## 高频事件", "");
    for (const [id, count] of Object.entries(result.metrics.batch.top_events)) lines.push(`- ${id}: ${count}`);
  }
  return `${lines.join("\n")}\n`;
}

function loadBatch(files) {
  return {
    summary: parseCsv(readFileSync(files.summary, "utf8"), new Set([
      "run_id", "chronicle_id", "event_count", "final_age", "birth_year", "alive",
      "ending_id", "death_reason", "yearly_change_count",
    ])),
    years: parseCsv(readFileSync(files.years, "utf8"), new Set([
      "run_id", "year_id", "year", "birth_year", "age", "event_count",
    ])),
    events: parseCsv(readFileSync(files.events, "utf8"), new Set([
      "run_id", "year_id", "event_row_id", "event_order", "event_id", "outcome_id",
      "year", "birth_year", "age", "gender", "family_class", "birth_province",
      "birth_city_tier", "hukou", "title", "category", "final_text",
      "final_result_text", "death",
    ])),
  };
}

function resolveInputFiles(source) {
  const summaryArg = source.summary ?? source.input;
  if (!summaryArg) return null;
  const summary = resolve(summaryArg);
  const extension = extname(summary);
  const base = extension ? summary.slice(0, -extension.length) : summary;
  const suffix = extension || ".csv";
  return {
    summary,
    years: resolve(source.years ?? `${base}.years${suffix}`),
    events: resolve(source.events ?? `${base}.events${suffix}`),
  };
}

function parseCsv(input, selectedHeaders = null) {
  const rows = [];
  let headers = null;
  let selectedColumns = null;
  let row = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    if (quoted) {
      if (char === '"' && input[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') quoted = false;
      else cell += char;
    } else if (char === '"') quoted = true;
    else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell.replace(/\r$/, ""));
      commitCsvRow(row);
      row = [];
      cell = "";
    } else cell += char;
  }
  if (cell || row.length) {
    row.push(cell.replace(/\r$/, ""));
    commitCsvRow(row);
  }
  return rows;

  function commitCsvRow(values) {
    if (!headers) {
      headers = values;
      selectedColumns = headers
        .map((header, index) => ({ header, index }))
        .filter(({ header }) => !selectedHeaders || selectedHeaders.has(header));
      return;
    }
    if (!values.some(Boolean)) return;
    const record = {};
    for (const { header, index } of selectedColumns) record[header] = values[index] ?? "";
    rows.push(record);
  }
}

function visibleTexts(text) {
  if (typeof text === "string") return [text];
  if (!Array.isArray(text)) return [];
  return text.map((item) => typeof item === "string" ? item : item.text).filter(Boolean);
}

function duplicateGroups(records) {
  const groups = groupBy(records.filter((item) => item.normalized.length >= 12), (item) => item.normalized);
  return Object.values(groups).filter((items) => new Set(items.map((item) => item.origin)).size > 1);
}

function nearDuplicatePairs(records) {
  const eligible = records.filter((item) => item.normalized.length >= 30);
  const grams = new Map(eligible.map((item) => [item.id, ngrams(item.normalized, 3)]));
  const pairs = [];
  for (let leftIndex = 0; leftIndex < eligible.length; leftIndex += 1) {
    const left = eligible[leftIndex];
    for (let rightIndex = leftIndex + 1; rightIndex < eligible.length; rightIndex += 1) {
      const right = eligible[rightIndex];
      if (left.origin === right.origin || left.normalized === right.normalized) continue;
      const lengthRatio = Math.min(left.normalized.length, right.normalized.length) / Math.max(left.normalized.length, right.normalized.length);
      if (lengthRatio < 0.72) continue;
      const similarity = jaccard(grams.get(left.id), grams.get(right.id));
      if (similarity >= 0.78) pairs.push(`${left.id} <> ${right.id}（${percent(similarity)}相似）`);
    }
  }
  return pairs.sort();
}

function ngrams(text, size) {
  const result = new Set();
  for (let index = 0; index <= text.length - size; index += 1) result.add(text.slice(index, index + size));
  return result;
}

function jaccard(left, right) {
  let intersection = 0;
  for (const item of left) if (right.has(item)) intersection += 1;
  return ratio(intersection, left.size + right.size - intersection);
}

function formatDuplicateGroup(items) {
  return `${items.map((item) => item.id).join(", ")}：“${items[0].text.slice(0, 45)}”`;
}

function longestSilentStreak(rows) {
  const ordered = [...rows].sort((a, b) => number(a.age) - number(b.age));
  let best = { length: 0, start: null, end: null };
  let current = { length: 0, start: null, end: null };
  for (const row of ordered) {
    if (number(row.event_count) === 0) {
      if (!current.length) current.start = row.year;
      current.length += 1;
      current.end = row.year;
      if (current.length > best.length) best = { ...current };
    } else current = { length: 0, start: null, end: null };
  }
  return best;
}

function addFinding(target, severity, code, message, samples) {
  const countMatch = message.match(/ (\d+)(?:处|个|组|次|\/)/);
  const count = countMatch ? number(countMatch[1]) : samples.length;
  if (severity !== "info" && count === 0) return;
  target.push({ severity, code, message, count, samples: samples.slice(0, sampleLimit) });
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

function writeOutput(path, text) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text, "utf8");
}

function groupBy(items, getKey) {
  return items.reduce((result, item) => {
    const key = getKey(item);
    result[key] ??= [];
    result[key].push(item);
    return result;
  }, {});
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

function indexUnique(items, key) {
  return new Map(items.map((item) => [item[key], item]));
}

function countBy(items, getKey) {
  return items.reduce((result, item) => {
    const key = getKey(item);
    result[key] = (result[key] ?? 0) + 1;
    return result;
  }, {});
}

function topCounts(items) {
  return Object.entries(countBy(items, (item) => item))
    .sort((a, b) => b[1] - a[1])
    .map(([item, count]) => `${item}（额外${count}次）`);
}

function intersectRange(a, b) {
  return [Math.max(a[0], b[0]), Math.min(a[1], b[1])];
}

function inRange(value, start, end) {
  return value >= start && value <= end;
}

function number(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function ratio(numerator, denominator) {
  return denominator ? numerator / denominator : 0;
}

function average(values) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function percent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function formatNumber(value) {
  return Number.isFinite(value) ? value.toFixed(1) : "0.0";
}

function normalizeText(value) {
  return String(value ?? "").replace(/[\s，。！？、；：,.!?;:“”‘’'"《》〈〉（）()【】\[\]—…·0-9]/g, "").trim();
}

function chineseLength(value) {
  return String(value ?? "").replace(/\s/g, "").length;
}

function readPositiveNumber(value, fallback) {
  const parsed = Number(value ?? fallback);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}

function gradeFor(score) {
  if (score >= 92) return "优秀";
  if (score >= 82) return "良好";
  if (score >= 70) return "可用但需优化";
  if (score >= 55) return "内容风险较高";
  return "不建议发布";
}

function severityLabel(severity) {
  return ({ error: "阻断问题", warning: "优化告警", info: "覆盖提示" })[severity];
}

const ERA_BUCKETS = [
  { id: "late_qing", label: "晚清出生（1840-1911）", start: 1840, end: 1911, maxEarlyDeathUnder40: 0.45 },
  { id: "republic", label: "民国出生（1912-1948）", start: 1912, end: 1948, maxEarlyDeathUnder40: 0.4 },
  { id: "early_prc", label: "建国初期出生（1949-1977）", start: 1949, end: 1977, maxEarlyDeathUnder40: 0.25 },
  { id: "reform", label: "改革年代出生（1978-1999）", start: 1978, end: 1999, maxEarlyDeathUnder40: 0.1 },
  { id: "contemporary", label: "当代出生（2000-2020）", start: 2000, end: 2020, maxEarlyDeathUnder40: 0.05 },
];

const MODERN_TERMS = [
  { term: "电视", since: 1958 },
  { term: "下岗", since: 1987 },
  { term: "电脑", since: 1980 },
  { term: "互联网", since: 1994 },
  { term: "网吧", since: 1996 },
  { term: "电商", since: 1999 },
  { term: "手机", since: 1990 },
  { term: "高铁", since: 2007 },
  { term: "二维码", since: 2005 },
  { term: "社交媒体", since: 2004 },
  { term: "网课", since: 2000 },
  { term: "外卖平台", since: 2010 },
  { term: "微信", since: 2011 },
  { term: "朋友圈", since: 2012 },
  { term: "短视频", since: 2012 },
  { term: "直播间", since: 2016 },
  { term: "打工人", since: 2020 },
  { term: "躺平", since: 2021 },
];

const LIGHT_TEXTURE_TERMS = ["笑", "玩笑", "打趣", "尴尬", "嘴硬", "偷懒", "热闹", "挨说", "小聪明", "省钱", "好玩", "乐了"];

main();
