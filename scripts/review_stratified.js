import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";
import { createAggregateRegistry } from "../src/engine/aggregates.js";
import { data } from "../src/data/index.js";
import { educationRank } from "../src/engine/lifeCourse.js";
import { SHADOW_FIELDS } from "../src/engine/shadow.js";

const args = parseArgs(process.argv.slice(2));
const sampleLimit = positiveInteger(args.samples, 12, "--samples");
const aggregateRegistry = createAggregateRegistry(data.aggregates);

function main() {
  const files = resolveFiles(args);
  const batch = loadBatch(files);
  const findings = [];
  const metrics = review(batch, findings);
  const gates = evaluateGates(metrics, findings);
  const result = {
    schema_version: 1,
    generated_at: new Date().toISOString(),
    inputs: files,
    metrics,
    gates,
    findings,
  };
  const report = formatReport(result);

  console.log(report);
  if (args.json) writeOutput(resolve(args.json), `${JSON.stringify(result, null, 2)}\n`);
  if (args.report) writeOutput(resolve(args.report), report);
  if (args.strict === "true" && !gates.passed) process.exitCode = 1;
}

function review(batch, output) {
  const integrity = reviewIntegrity(batch);
  addFinding(output, "error", "BATCH_INTEGRITY", `CSV/manifest 关联、计数或矩阵完整性问题 ${integrity.problems.length} 处`, integrity.problems);

  const consistency = reviewConsistency(batch);
  addFinding(output, "error", "DIRECT_CONDITION_CONFLICT", `实际触发违反事件明示的时间、性别、阶级或地区条件 ${consistency.direct.length} 处`, consistency.direct);
  addFinding(output, "error", "GENDER_BIOLOGY_CONFLICT", `人物性别与身体叙述明显冲突 ${consistency.gender.length} 处`, consistency.gender);
  addFinding(output, "warning", "AGE_SEMANTIC_RISK", `文案语义与人物年龄疑似不合常理 ${consistency.age.length} 处`, consistency.age);
  addFinding(output, "warning", "INFANT_ADULT_PERSPECTIVE", `0—3岁文案把成年人的认知或自传式记忆写进幼儿当下 ${consistency.infantPerspective.length} 处`, consistency.infantPerspective);
  addFinding(output, "warning", "STATE_NARRATIVE_CONFLICT", `事件叙述与当年结束后的婚姻、子女、教育或职业状态矛盾 ${consistency.state.length} 处`, consistency.state);
  addFinding(output, "error", "LIFE_COURSE_CONFLICT", `逐年教育、就业与主要身份状态发生无解释冲突 ${consistency.lifeCourse.length} 处`, consistency.lifeCourse);
  addFinding(output, "warning", "PLACE_TEXTURE_RISK", `地点纹理与触发所在地疑似冲突 ${consistency.place.length} 处`, consistency.place);
  addFinding(output, "warning", "CLASS_TEXTURE_RISK", `家庭资源层级与文案生活纹理疑似冲突 ${consistency.classTexture.length} 处`, consistency.classTexture);

  const anachronism = reviewAnachronisms(batch.events);
  addFinding(output, "error", "OBSERVED_ANACHRONISM", `样本正文出现早于合理使用年份的高置信词汇 ${anachronism.length} 处`, anachronism);

  const frequency = reviewFrequency(batch);
  addFinding(output, "warning", "EVENT_OVERPENETRATION", `非生命周期事件在过多人生中出现（人生渗透率 > 55%）${frequency.overpenetrating.length} 个`, frequency.overpenetrating);
  addFinding(output, "warning", "COPY_MONOCULTURE", `高频事件只有单一或被单一文案支配的表达 ${frequency.copyMonoculture.length} 个`, frequency.copyMonoculture);
  addFinding(output, "warning", "REPEATED_IN_LIFE", `同一人生重复事件 ${frequency.repeated_event_excess} 次（排除平常年后 ${frequency.repeated_nonquiet_event_excess} 次）、重复可见文案 ${frequency.repeated_visible_copy_excess} 次`, frequency.repeatSamples);

  const narrative = reviewNarrativeStructure(batch);
  addFinding(output, "warning", "OVERLY_DAILY_LIFE", `结构性事件不足、连续纹理年过长或成年生活长期没有叙事推进 ${narrative.problemLives.length} 局`, narrative.problemLives);

  const shadow = reviewShadowNarrative(batch);
  addFinding(output, "warning", "SHADOW_HARM_WITHOUT_TRACE", `主动伤害叙述后十五年内没有责任、关系或内在痕迹 ${shadow.harmWithoutTrace.length} 处；这不要求人物受到惩罚`, shadow.harmWithoutTrace);
  addFinding(output, "warning", "SHADOW_REPENTANCE_ONLY_CLOSURE", `人生末尾疑似用一次悔悟替代此前持续后果 ${shadow.repentanceOnlyClosures.length} 局`, shadow.repentanceOnlyClosures);
  addFinding(output, "warning", "SHADOW_STATE_JUMP", `单个事件的阴影状态变化超过25点 ${shadow.stateJumps.length} 处`, shadow.stateJumps);
  addFinding(output, "warning", "SHADOW_LIFE_CONTRADICTION", `累计伤害倒退、无修复的大额信任债清零或同年状态断裂 ${shadow.contradictions.length} 处`, shadow.contradictions);
  addFinding(output, "warning", "SHADOW_OVERCONCENTRATION", `同一人生阴影事件过度集中 ${shadow.overconcentratedLives.length} 局`, shadow.overconcentratedLives);
  addFinding(output, "warning", "SHADOW_SUBGROUP_SKEW", `性别、阶层或城乡的阴影人生触发明显失衡 ${shadow.subgroupSkews.length} 组；差异可以来自处境，但不应把身份本身写成道德原因`, shadow.subgroupSkews);

  const futureHistory = reviewFutureHistory(batch);
  addFinding(output, "warning", "FUTURE_HISTORY_HOLE", `2036年后的某个未来阶段仍缺少时代事件 ${futureHistory.holes.length} 段`, futureHistory.holes);

  const subgroups = reviewSubgroups(batch);
  addFinding(output, "warning", "SUBGROUP_CONTENT_HOLE", `分群中平常年占比过高或内容多样性过低 ${subgroups.holes.length} 个`, subgroups.holes);

  const mortality = reviewMortality(batch.summary);
  addFinding(output, "warning", "DEATH_AGE_SPIKE", `死亡年龄出现不自然尖峰 ${mortality.spikes.length} 处`, mortality.spikes);
  addFinding(output, "warning", "HISTORICAL_MORTALITY_CALIBRATION", `近代出生群体的早年死亡可能显著低估 ${mortality.historicalCalibration.length} 处`, mortality.historicalCalibration);
  addFinding(output, "warning", "AGE_CAP_CENSORING", `活到测试年龄上限仍未结束 ${mortality.capped}/${batch.summary.length} 局`, mortality.capSamples);

  return {
    counts: {
      runs: batch.summary.length,
      person_years: batch.years.length,
      events: batch.events.length,
      event_definitions: data.events.length,
    },
    integrity,
    consistency: {
      direct_condition_conflicts: consistency.direct.length,
      gender_biology_conflicts: consistency.gender.length,
      age_semantic_risks: consistency.age.length,
      infant_adult_perspective_risks: consistency.infantPerspective.length,
      state_narrative_conflicts: consistency.state.length,
      life_course_conflicts: consistency.lifeCourse.length,
      place_texture_risks: consistency.place.length,
      class_texture_risks: consistency.classTexture.length,
      observed_anachronisms: anachronism.length,
    },
    frequency,
    narrative,
    shadow,
    future_history: futureHistory,
    subgroups,
    mortality,
  };
}

function reviewShadowNarrative(batch) {
  const definitions = new Map(data.events.map((event) => [event.id, event]));
  const byRun = groupByMap(batch.events, (row) => row.run_id);
  const harmWithoutTrace = [];
  const repentanceOnlyClosures = [];
  const stateJumps = [];
  const contradictions = [];
  const harmfulEvents = [];
  const changedEvents = [];
  const changedRuns = new Set();
  const observedAfter = Object.fromEntries(SHADOW_FIELDS.map((field) => [field, []]));
  const authoredRows = batch.events.filter((row) => row.event_id.startsWith("shadow_"));
  const authoredDefinitions = data.events.filter((event) => event.id.startsWith("shadow_"));
  const authoredLives = new Set(authoredRows.map((row) => row.run_id));
  const authoredByRun = groupByMap(authoredRows, (row) => row.run_id);
  const authoredCounts = [...authoredByRun.values()].map((rows) => rows.length);
  const overconcentratedLives = [];
  for (const [runId, rows] of authoredByRun) {
    const lifeEvents = byRun.get(runId) ?? [];
    const rate = ratio(rows.length, lifeEvents.length);
    if (rows.length >= 22 || (rows.length >= 16 && rate > 0.25)) {
      overconcentratedLives.push(`${runId}: 阴影事件${rows.length}/${lifeEvents.length}（${percent(rate)}）`);
    }
  }

  const subgroupDistribution = {};
  const subgroupSkews = [];
  for (const dimension of ["gender", "class_tier", "settlement"]) {
    const groups = [];
    for (const [value, lives] of groupByMap(batch.summary, (row) => row[dimension])) {
      if (!value) continue;
      const eventCount = lives.reduce((sum, life) => sum + (authoredByRun.get(life.run_id)?.length ?? 0), 0);
      const affected = lives.filter((life) => authoredByRun.has(life.run_id)).length;
      groups.push({
        value,
        runs: lives.length,
        affected_lives: affected,
        affected_rate: ratio(affected, lives.length),
        events: eventCount,
        events_per_life: ratio(eventCount, lives.length),
      });
    }
    subgroupDistribution[dimension] = Object.fromEntries(groups.map((item) => [item.value, item]));
    const comparable = groups.filter((item) => item.runs >= 12);
    if (comparable.length < 2) continue;
    const lowestRate = comparable.reduce((best, item) => item.affected_rate < best.affected_rate ? item : best);
    const highestRate = comparable.reduce((best, item) => item.affected_rate > best.affected_rate ? item : best);
    const lowestDensity = comparable.reduce((best, item) => item.events_per_life < best.events_per_life ? item : best);
    const highestDensity = comparable.reduce((best, item) => item.events_per_life > best.events_per_life ? item : best);
    if (highestRate.affected_rate - lowestRate.affected_rate > 0.35) {
      subgroupSkews.push(`${dimension}: 触发率 ${lowestRate.value} ${percent(lowestRate.affected_rate)} vs ${highestRate.value} ${percent(highestRate.affected_rate)}（样本${lowestRate.runs}/${highestRate.runs}）`);
    }
    if (highestDensity.events_per_life - lowestDensity.events_per_life > 2) {
      subgroupSkews.push(`${dimension}: 人均事件 ${lowestDensity.value} ${lowestDensity.events_per_life.toFixed(2)} vs ${highestDensity.value} ${highestDensity.events_per_life.toFixed(2)}（样本${lowestDensity.runs}/${highestDensity.runs}）`);
    }
  }

  for (const [runId, unsorted] of byRun) {
    const rows = [...unsorted].sort((left, right) => num(left.event_order) - num(right.event_order));
    let previous = null;
    let runChanged = false;
    let hasHarmNarrative = false;

    for (let index = 0; index < rows.length; index += 1) {
      const row = rows[index];
      const before = readShadow(row, "before");
      const after = readShadow(row, "after");
      const deltas = Object.fromEntries(SHADOW_FIELDS.map((field) => [field, after[field] - before[field]]));
      const copy = `${row.title}。${row.final_text}${row.final_result_text ?? ""}`;
      const prefix = `${row.event_row_id} ${row.year}年/${row.age}岁 ${row.event_id}`;
      const changed = SHADOW_FIELDS.some((field) => deltas[field] !== 0);
      if (changed) {
        changedEvents.push(row.event_row_id);
        runChanged = true;
      }
      for (const field of SHADOW_FIELDS) {
        observedAfter[field].push(after[field]);
        if (before[field] < 0 || before[field] > 100 || after[field] < 0 || after[field] > 100) {
          contradictions.push(`${prefix}: shadow.${field} 越界 ${before[field]} -> ${after[field]}`);
        }
        if (Math.abs(deltas[field]) > 25) {
          stateJumps.push(`${prefix}: shadow.${field} ${before[field]} -> ${after[field]}（${signed(deltas[field])}）“${excerpt(copy)}”`);
        }
      }

      if (deltas.harmDone < 0) contradictions.push(`${prefix}: 累计 harmDone 不应倒退 ${before.harmDone} -> ${after.harmDone}`);
      if (deltas.trustDebt < -15 && !SHADOW_REPAIR_TEXT.test(copy)) {
        contradictions.push(`${prefix}: trustDebt 大幅下降但正文没有修复、坦白或赔偿 ${before.trustDebt} -> ${after.trustDebt}`);
      }
      if (deltas.guilt < -20 && !SHADOW_REFLECTION_TEXT.test(copy)) {
        contradictions.push(`${prefix}: guilt 大幅下降但正文没有反思或承担 ${before.guilt} -> ${after.guilt}`);
      }
      if (previous && num(previous.year) === num(row.year)) {
        const previousAfter = readShadow(previous, "after");
        for (const field of SHADOW_FIELDS) {
          if (previousAfter[field] !== before[field]) {
            contradictions.push(`${prefix}: 同年相邻事件 shadow.${field} 断裂 ${previousAfter[field]} -> ${before[field]}`);
          }
        }
      }

      const harmful = (row.event_id.startsWith("shadow_") && row.narrative_tier === "turning_point" && deltas.harmDone > 0)
        || (!row.event_id.startsWith("shadow_") && SHADOW_HARM_ACTION.test(copy));
      if (harmful) {
        hasHarmNarrative = true;
        harmfulEvents.push(row.event_row_id);
        const followup = rows.slice(index + 1).filter((item) => num(item.year) <= num(row.year) + 15);
        const hasStateTrace = followup.some((item) => {
          const start = readShadow(item, "before");
          const end = readShadow(item, "after");
          return end.harmDone > start.harmDone
            || end.guilt > start.guilt
            || end.complicity > start.complicity
            || end.trustDebt > start.trustDebt
            || end.selfDeception > start.selfDeception;
        });
        const hasNarrativeTrace = followup.some((item) => SHADOW_CONSEQUENCE_TEXT.test(`${item.title}。${item.final_text}${item.final_result_text ?? ""}`));
        const lifeEndedBeforeTraceWindow = rows.at(-1)?.death === "yes" && num(rows.at(-1).year) <= num(row.year) + 15;
        if (!lifeEndedBeforeTraceWindow && !hasStateTrace && !hasNarrativeTrace) {
          harmWithoutTrace.push(`${prefix}: “${excerpt(copy)}”；未要求报应或处罚，仅缺少责任、关系、记忆或自我解释的延续`);
        }
      }
      previous = row;
    }

    if (runChanged) changedRuns.add(runId);
    if (hasHarmNarrative && rows.length) {
      const closingRows = rows.slice(-3);
      const closure = closingRows.find((row) => SHADOW_REPENTANCE_CLOSURE.test(`${row.title}。${row.final_text}${row.final_result_text ?? ""}`));
      const earlierRows = rows.slice(0, Math.max(0, rows.length - 3));
      const sustainedTrace = earlierRows.filter((row) => {
        const before = readShadow(row, "before");
        const after = readShadow(row, "after");
        return after.guilt > before.guilt || after.trustDebt > before.trustDebt || SHADOW_CONSEQUENCE_TEXT.test(`${row.title}。${row.final_text}${row.final_result_text ?? ""}`);
      }).length;
      if (closure && sustainedTrace === 0) {
        repentanceOnlyClosures.push(`${runId}: 末尾“${excerpt(`${closure.title}。${closure.final_text}`)}”，此前没有持续的愧疚、信任债或关系后果`);
      }
    }
  }

  const fieldDistribution = {};
  for (const field of SHADOW_FIELDS) {
    const summaryColumn = shadowColumn(field, "final");
    const finals = batch.summary.map((row) => num(row[summaryColumn]));
    fieldDistribution[field] = {
      mean_final: average(finals),
      p90_final: quantile(finals, 0.9),
      max_observed: Math.max(0, ...observedAfter[field]),
      changed_events: batch.events.filter((row) => num(row[shadowColumn(field, "after")]) !== num(row[shadowColumn(field, "before")])).length,
    };
  }

  return {
    authored_event_count: authoredRows.length,
    authored_event_rate: ratio(authoredRows.length, batch.events.length),
    authored_lives: authoredLives.size,
    authored_life_rate: ratio(authoredLives.size, batch.summary.length),
    authored_definitions: authoredDefinitions.length,
    observed_authored_definitions: new Set(authoredRows.map((row) => row.event_id)).size,
    authored_definition_coverage_rate: ratio(new Set(authoredRows.map((row) => row.event_id)).size, authoredDefinitions.length),
    completed_chain_events: authoredRows.filter((row) => definitions.get(row.event_id)?.narrativeThread?.close).length,
    authored_events_per_affected_life_mean: average(authoredCounts),
    authored_events_per_affected_life_p90: quantile(authoredCounts, 0.9),
    authored_events_per_affected_life_max: Math.max(0, ...authoredCounts),
    authored_by_family: countBy(authoredRows, (row) => row.event_id.startsWith("shadow_public_") ? "public" : row.event_id.startsWith("shadow_private_") ? "private" : "survival"),
    shadow_change_events: changedEvents.length,
    shadow_change_event_rate: ratio(changedEvents.length, batch.events.length),
    lives_with_shadow_change: changedRuns.size,
    lives_with_shadow_change_rate: ratio(changedRuns.size, batch.summary.length),
    harm_narrative_events: harmfulEvents.length,
    harm_without_trace_count: harmWithoutTrace.length,
    harm_without_trace_rate: ratio(harmWithoutTrace.length, harmfulEvents.length),
    repentance_only_closure_count: repentanceOnlyClosures.length,
    state_jump_count: stateJumps.length,
    contradiction_count: contradictions.length,
    field_distribution: fieldDistribution,
    harmWithoutTrace,
    repentanceOnlyClosures,
    stateJumps,
    contradictions,
    overconcentratedLives,
    subgroup_distribution: subgroupDistribution,
    subgroupSkews,
  };
}

function reviewFutureHistory(batch) {
  const definitions = data.events.filter((event) => event.id.startsWith("spec_"));
  const futureRows = batch.events.filter((row) => row.chronicle_id === "" && num(row.year) >= 2036 && num(row.year) <= 2120);
  const speculativeRows = futureRows.filter((row) => row.event_id.startsWith("spec_"));
  const observedIds = new Set(speculativeRows.map((row) => row.event_id));
  const windows = [
    [2036, 2049],
    [2050, 2064],
    [2065, 2079],
    [2080, 2094],
    [2095, 2109],
    [2110, 2120],
  ];
  const eras = {};
  const holes = [];
  for (const [start, end] of windows) {
    const rows = futureRows.filter((row) => inRange(num(row.year), [start, end]));
    const historical = rows.filter((row) => row.event_id.startsWith("spec_"));
    const uniqueEvents = new Set(historical.map((row) => row.event_id));
    const stats = {
      person_years: rows.length,
      historical_events: historical.length,
      historical_event_rate: ratio(historical.length, rows.length),
      unique_historical_events: uniqueEvents.size,
    };
    eras[`${start}-${end}`] = stats;
    if (rows.length >= 20 && (stats.historical_event_rate < 0.06 || stats.unique_historical_events < 2)) {
      holes.push(`${start}-${end}: ${rows.length}个人年，未来历史${percent(stats.historical_event_rate)}，仅${stats.unique_historical_events}种事件`);
    }
  }
  const summaryByRun = new Map(batch.summary.map((row) => [row.run_id, row]));
  const subgroupDistribution = {};
  for (const dimension of ["cohort", "settlement", "class_tier", "region_group"]) {
    subgroupDistribution[dimension] = {};
    const groups = groupByMap(futureRows, (row) => summaryByRun.get(row.run_id)?.[dimension] ?? "unknown");
    for (const [key, rows] of groups) {
      const historical = rows.filter((row) => row.event_id.startsWith("spec_"));
      const stats = {
        person_years: rows.length,
        historical_events: historical.length,
        historical_event_rate: ratio(historical.length, rows.length),
        unique_historical_events: new Set(historical.map((row) => row.event_id)).size,
      };
      subgroupDistribution[dimension][key] = stats;
      if (rows.length >= 100 && stats.historical_event_rate < 0.03) {
        holes.push(`${dimension}=${key}: ${rows.length}个未来个人年，未来历史仅${percent(stats.historical_event_rate)}`);
      }
    }
  }
  return {
    start_year: 2036,
    end_year: 2120,
    person_years: futureRows.length,
    historical_events: speculativeRows.length,
    historical_event_rate: ratio(speculativeRows.length, futureRows.length),
    definitions: definitions.length,
    observed_definitions: observedIds.size,
    definition_coverage_rate: ratio(observedIds.size, definitions.length),
    era_distribution: eras,
    subgroup_distribution: subgroupDistribution,
    holes,
  };
}

function reviewNarrativeStructure(batch) {
  const structuralTiers = new Set(["turning_point", "consequence", "historical_pressure"]);
  const ordinaryEvents = batch.events.filter((row) => row.chronicle_id === "");
  const tierCounts = countBy(ordinaryEvents, (row) => row.narrative_tier || "unknown");
  const structuralCount = ordinaryEvents.filter((row) => structuralTiers.has(row.narrative_tier)).length;
  const textureCount = ordinaryEvents.filter((row) => row.narrative_tier === "texture").length;
  const byRun = groupByMap(ordinaryEvents, (row) => row.run_id);
  const lives = [];
  const problemLives = [];

  for (const [runId, unsorted] of byRun) {
    const rows = [...unsorted].sort((left, right) => num(left.event_order) - num(right.event_order));
    const adultRows = rows.filter((row) => num(row.age) >= 13 && row.death !== "yes");
    const structural = rows.filter((row) => structuralTiers.has(row.narrative_tier));
    const texture = rows.filter((row) => row.narrative_tier === "texture");
    const maxTextureStreak = longestStreak(rows, (row) => row.narrative_tier === "texture");
    const adultTextureStreak = longestStreak(adultRows, (row) => row.narrative_tier === "texture");
    const adultStructuralRate = ratio(adultRows.filter((row) => structuralTiers.has(row.narrative_tier)).length, adultRows.length);
    const stat = {
      run_id: runId,
      cohort: rows[0]?.cohort ?? "",
      event_count: rows.length,
      structural_count: structural.length,
      structural_rate: ratio(structural.length, rows.length),
      texture_rate: ratio(texture.length, rows.length),
      adult_structural_rate: adultStructuralRate,
      max_texture_streak: maxTextureStreak,
      adult_max_texture_streak: adultTextureStreak,
    };
    lives.push(stat);
    const reasons = [];
    if (rows.length >= 25 && stat.structural_rate < 0.22) reasons.push(`结构事件仅${percent(stat.structural_rate)}`);
    if (adultRows.length >= 12 && adultStructuralRate < 0.2) reasons.push(`成年后结构事件仅${percent(adultStructuralRate)}`);
    if (maxTextureStreak > 5) reasons.push(`最长连续纹理${maxTextureStreak}年`);
    if (reasons.length) problemLives.push(`${runId} ${stat.cohort}: ${reasons.join("，")}`);
  }

  const cohortDistribution = {};
  for (const [cohort, rows] of groupByMap(lives, (row) => row.cohort)) {
    cohortDistribution[cohort] = {
      runs: rows.length,
      mean_structural_rate: average(rows.map((row) => row.structural_rate)),
      mean_adult_structural_rate: average(rows.map((row) => row.adult_structural_rate)),
      lives_with_texture_streak_over_5: rows.filter((row) => row.max_texture_streak > 5).length,
    };
  }

  return {
    tier_counts: tierCounts,
    structural_event_count: structuralCount,
    structural_event_rate: ratio(structuralCount, ordinaryEvents.length),
    texture_event_count: textureCount,
    texture_event_rate: ratio(textureCount, ordinaryEvents.length),
    turning_point_rate: ratio(tierCounts.turning_point ?? 0, ordinaryEvents.length),
    consequence_rate: ratio(tierCounts.consequence ?? 0, ordinaryEvents.length),
    historical_pressure_rate: ratio(tierCounts.historical_pressure ?? 0, ordinaryEvents.length),
    mean_max_texture_streak: average(lives.map((row) => row.max_texture_streak)),
    lives_with_texture_streak_over_5: lives.filter((row) => row.max_texture_streak > 5).length,
    lives_with_texture_streak_over_5_rate: ratio(lives.filter((row) => row.max_texture_streak > 5).length, lives.length),
    cohort_distribution: cohortDistribution,
    problemLives,
  };
}

function longestStreak(rows, predicate) {
  let current = 0;
  let maximum = 0;
  for (const row of rows) {
    current = predicate(row) ? current + 1 : 0;
    maximum = Math.max(maximum, current);
  }
  return maximum;
}

function reviewIntegrity(batch) {
  const problems = [];
  const summaries = uniqueIndex(batch.summary, "run_id", problems, "summary");
  const years = uniqueIndex(batch.years, "year_id", problems, "years");
  const eventsByRun = groupByMap(batch.events, (row) => row.run_id);
  const yearsByRun = groupByMap(batch.years, (row) => row.run_id);

  for (const row of batch.years) {
    if (!summaries.has(row.run_id)) problems.push(`${row.year_id} 缺少 summary`);
    if (num(row.year) !== num(row.birth_year) + num(row.age)) problems.push(`${row.year_id} year != birth_year + age`);
    if (num(row.event_count) !== splitList(row.event_ids).length) problems.push(`${row.year_id} event_count 与 event_ids 不符`);
  }
  for (const row of batch.events) {
    if (!summaries.has(row.run_id)) problems.push(`${row.event_row_id} 缺少 summary`);
    if (!years.has(row.year_id)) problems.push(`${row.event_row_id} 缺少 year`);
    if (num(row.year) !== num(row.birth_year) + num(row.age)) problems.push(`${row.event_row_id} year != birth_year + age`);
  }
  for (const row of batch.summary) {
    const runEvents = eventsByRun.get(row.run_id) ?? [];
    const runYears = yearsByRun.get(row.run_id) ?? [];
    if (num(row.event_count) !== runEvents.length) problems.push(`${row.run_id} summary event_count=${row.event_count}，明细=${runEvents.length}`);
    if (runYears.length && num(row.final_age) !== Math.max(...runYears.map((item) => num(item.age)))) problems.push(`${row.run_id} final_age 与逐年表不符`);
  }

  const manifestRunIds = new Set((batch.manifest.cases ?? []).map((item) => item.run_id));
  if (batch.manifest.counts?.lives !== batch.summary.length) problems.push(`manifest lives=${batch.manifest.counts?.lives}，summary=${batch.summary.length}`);
  if (batch.manifest.counts?.person_years !== batch.years.length) problems.push(`manifest person_years=${batch.manifest.counts?.person_years}，years=${batch.years.length}`);
  if (batch.manifest.counts?.events !== batch.events.length) problems.push(`manifest events=${batch.manifest.counts?.events}，events=${batch.events.length}`);
  for (const row of batch.summary) if (!manifestRunIds.has(row.run_id)) problems.push(`${row.run_id} 不在 manifest cases`);

  const dimensionCoverage = {};
  for (const dimension of STRATUM_DIMENSIONS) {
    const observed = new Set(batch.summary.map((row) => row[dimension]).filter(Boolean));
    dimensionCoverage[dimension] = [...observed].sort();
    if (observed.size < 2) problems.push(`${dimension} 仅覆盖 ${observed.size} 个取值`);
  }
  return { problems, dimension_coverage: dimensionCoverage };
}

function reviewConsistency(batch) {
  const definitions = new Map(data.events.map((event) => [event.id, event]));
  const direct = [];
  const gender = [];
  const age = [];
  const infantPerspective = [];
  const state = [];
  const place = [];
  const classTexture = [];
  const lifeCourse = [];

  for (const row of batch.events) {
    const event = definitions.get(row.event_id);
    if (event) direct.push(...directConflicts(event, row));
    const copy = `${row.title}。${row.final_text}${row.final_result_text}`;
    const prefix = `${row.event_row_id} ${row.year}年/${row.age}岁 ${row.event_id}`;

    if (row.gender === "male" && /你(?:怀孕|分娩|坐月子|来月经|经期)/.test(copy)) gender.push(`${prefix}: 男性叙述“${excerpt(copy)}”`);
    if (row.gender === "female" && /你的前列腺|你开始遗精/.test(copy)) gender.push(`${prefix}: 女性叙述“${excerpt(copy)}”`);

    for (const rule of AGE_RULES) {
      if (!rule.pattern.test(copy)) continue;
      const currentAge = num(row.age);
      if ((rule.min !== undefined && currentAge < rule.min) || (rule.max !== undefined && currentAge > rule.max)) {
        age.push(`${prefix}: “${rule.label}”建议年龄${formatRange(rule)}，正文“${excerpt(copy)}”`);
      }
    }
    if (/你(?:怀孕|分娩|坐月子)/.test(copy) && (num(row.age) < 15 || num(row.age) > 55)) {
      age.push(`${prefix}: 生育叙述出现在${row.age}岁`);
    }
    if (num(row.age) <= 3 && INFANT_ADULT_PERSPECTIVE.test(copy)) {
      infantPerspective.push(`${prefix}: 幼儿当下出现成人认知或稳定记忆“${excerpt(copy)}”`);
    }

    if (num(row.age) < 12 && ["partnered", "married"].includes(row.partner_status_after)) state.push(`${prefix}: 未满12岁但 partner_status=${row.partner_status_after}`);
    if (num(row.age) < 12 && num(row.children_after) > 0) state.push(`${prefix}: 未满12岁但 children=${row.children_after}`);
    if (num(row.age) < 8 && !["", "none", "primary"].includes(row.education_level_after)) state.push(`${prefix}: 低龄教育状态=${row.education_level_after}`);
    if (num(row.age) < 10 && !["", "none"].includes(row.career_status_after)) state.push(`${prefix}: 低龄职业状态=${row.career_status_after}`);
    if (row.category === "school" && ["", "none"].includes(row.education_level_after) && /考试|成绩|作业|课堂|老师/.test(copy)) {
      state.push(`${prefix}: 学校叙述发生后 education_level=${row.education_level_after || "空"}`);
    }
    if (/你(?:们)?(?:结婚|成婚|成亲|举行婚礼|领了结婚证)/.test(copy) && !["partnered", "married"].includes(row.partner_status_after)) {
      state.push(`${prefix}: 叙述结婚但 partner_status=${row.partner_status_after || "空"}`);
    }
    if (/孩子出生|生下(?:一个|了)|添了(?:一个|个)?孩子|有了第一个孩子/.test(copy) && num(row.children_after) < 1) {
      state.push(`${prefix}: 叙述生育但 children=${row.children_after}`);
    }
    if (/你(?:办了)?退休|你办了退养|你开始领退休金/.test(copy) && ["employed", "self_employed", "gig_worker"].includes(row.career_status_after)) {
      state.push(`${prefix}: 叙述退休但 career_status=${row.career_status_after}`);
    }
    if (["第一份工作", "早早谋生"].includes(row.title) && num(row.career_jobs_held_after) !== 1) {
      lifeCourse.push(`${prefix}: 首次谋生后 jobs_held=${row.career_jobs_held_after}`);
    }

    for (const rule of PLACE_RULES) {
      if (!rule.pattern.test(copy) || rule.provinces.includes(row.trigger_province)) continue;
      place.push(`${prefix}: ${row.trigger_province}/${row.trigger_city_tier} 出现“${rule.label}”`);
    }
    if (["city", "tier2", "tier1"].includes(row.trigger_city_tier) && /你(?:下地|下田|赶着牛)|你家的(?:田|庄稼)|村里分工分/.test(copy)) {
      place.push(`${prefix}: 城市所在地叙述为直接务农“${excerpt(copy)}”`);
    }
    if (["city", "tier2", "tier1"].includes(row.trigger_city_tier) && /村里|村口|田埂|自留地|生产队|公社|农忙|下田|锄头/.test(copy)) {
      place.push(`${prefix}: 城市所在地出现疑似当下村庄生活“${excerpt(copy)}”`);
    }
    if (["village", "town"].includes(row.trigger_city_tier) && /你每天挤地铁|写字楼里的你|你家小区的电梯/.test(copy)) {
      place.push(`${prefix}: 乡村所在地叙述为大城市日常“${excerpt(copy)}”`);
    }

    if (row.class_tier === "low" && /家里(?:雇着|养着)(?:长工|佣人|仆人)|你家的仆人|每年收租/.test(copy)) {
      classTexture.push(`${prefix}: 低资源开局出现富户生活“${excerpt(copy)}”`);
    }
    if (row.class_tier === "high" && /你家穷得揭不开锅|全家只能沿街乞讨/.test(copy)) {
      classTexture.push(`${prefix}: 高资源开局出现赤贫叙述“${excerpt(copy)}”`);
    }
  }
  reviewLifeCourseRows(batch, definitions, lifeCourse);
  return {
    direct,
    gender,
    age: unique(age),
    infantPerspective: unique(infantPerspective),
    state: unique(state),
    place: unique(place),
    classTexture: unique(classTexture),
    lifeCourse: unique(lifeCourse),
  };
}

function reviewLifeCourseRows(batch, definitions, output) {
  const activeCareer = new Set(["employed", "self_employed", "gig_worker", "family_labor", "entrepreneur"]);
  for (const row of batch.years) {
    if (row.chronicle_id) continue;
    const prefix = `${row.year_id} ${row.year}年/${row.age}岁`;
    const tags = new Set(splitList(row.tags));
    if (row.education_status === "enrolled") {
      if (["", "none"].includes(row.education_current_level)) output.push(`${prefix}: 在读但 current_level=${row.education_current_level || "空"}`);
      if (["", "none"].includes(row.education_mode)) output.push(`${prefix}: 在读但 mode=${row.education_mode || "空"}`);
      if (!tags.has("student")) output.push(`${prefix}: 在读但 student 标签缺失`);
    } else if (tags.has("student")) {
      output.push(`${prefix}: education_status=${row.education_status} 仍保留 student 标签`);
    }
    if (row.education_status === "enrolled" && row.education_mode === "full_time"
      && activeCareer.has(row.career_status) && row.education_concurrent_career !== "yes") {
      output.push(`${prefix}: 无兼任声明却同时为全日制学生和 ${row.career_status}`);
    }
    if (activeCareer.has(row.career_status) && num(row.career_jobs_held) < 1) {
      output.push(`${prefix}: career_status=${row.career_status} 但 jobs_held=${row.career_jobs_held}`);
    }
    const expectedActivity = row.alive_after_year === "no"
      ? "deceased"
      : row.education_status === "enrolled" && row.education_mode === "full_time"
      ? "student"
      : activeCareer.has(row.career_status)
        ? row.career_status
        : row.career_status === "retired"
          ? "retired"
          : ["unemployed", "laid_off"].includes(row.career_status)
            ? "unemployed"
            : num(row.age) < 6 ? "dependent" : "non_employed";
    if (row.primary_activity !== expectedActivity) output.push(`${prefix}: primary_activity=${row.primary_activity}，应为 ${expectedActivity}`);
  }

  for (const [runId, rows] of groupByMap(batch.years.filter((row) => !row.chronicle_id), (row) => row.run_id)) {
    const ordered = [...rows].sort((left, right) => num(left.age) - num(right.age));
    let completedRank = 0;
    let transitionCount = 0;
    for (const row of ordered) {
      const rank = educationRank(row.education_completed_level);
      if (rank < completedRank) output.push(`${runId}:${row.year} 已完成教育层级从 ${completedRank} 倒退到 ${row.education_completed_level}`);
      if (num(row.life_course_transition_count) < transitionCount) output.push(`${runId}:${row.year} 状态转移计数发生倒退`);
      completedRank = Math.max(completedRank, rank);
      transitionCount = Math.max(transitionCount, num(row.life_course_transition_count));
    }
  }

  for (const row of batch.events) {
    if (row.chronicle_id) continue;
    const event = definitions.get(row.event_id);
    const transition = event?.continuity?.education;
    if (transition?.action !== "enroll" || transition.mode !== "full_time" || transition.allowWhileEmployed) continue;
    if (activeCareer.has(row.career_status_before) && activeCareer.has(row.career_status_after)
      && row.education_concurrent_career_after !== "yes") {
      output.push(`${row.event_row_id}: ${row.event_id} 在 ${row.career_status_before} 状态下无桥接进入全日制教育`);
    }
  }
}

function directConflicts(event, row) {
  const prefix = `${row.event_row_id}:${event.id}`;
  const problems = [];
  const age = num(row.age);
  const year = num(row.year);
  const birthYear = num(row.birth_year);
  if (event.ageRange && !inRange(age, event.ageRange)) problems.push(`${prefix} age=${age} 不匹配 ${event.ageRange.join("-")}`);
  if (event.yearRange && !inRange(year, event.yearRange)) problems.push(`${prefix} year=${year} 不匹配 ${event.yearRange.join("-")}`);
  if (event.birthYearRange && !inRange(birthYear, event.birthYearRange)) problems.push(`${prefix} birthYear=${birthYear} 不匹配 ${event.birthYearRange.join("-")}`);
  if (event.genders && !event.genders.includes(row.gender)) problems.push(`${prefix} gender=${row.gender} 不匹配`);
  if (event.birthFamilyClasses && !event.birthFamilyClasses.includes(row.family_class)) problems.push(`${prefix} familyClass=${row.family_class} 不匹配`);
  problems.push(...regionConflicts(prefix, event.birthRegions, {
    gender: row.gender,
    province: row.birth_province,
    cityTier: row.birth_city_tier,
    hukou: row.hukou,
  }));
  problems.push(...regionConflicts(prefix, event.currentRegions, {
    gender: row.gender,
    province: row.trigger_province,
    cityTier: row.trigger_city_tier,
    hukou: row.hukou,
  }));
  return problems;
}

function regionConflicts(prefix, filter, source) {
  if (!filter) return [];
  const problems = [];
  if (filter.provinces && !filter.provinces.includes(source.province)) problems.push(`${prefix} current province=${source.province} 不匹配`);
  if (filter.provinceGroups && !filter.provinceGroups.some((id) => aggregateRegistry.includes(id, source.province))) problems.push(`${prefix} province group 不匹配`);
  if (filter.cityTiers && !filter.cityTiers.includes(source.cityTier)) problems.push(`${prefix} cityTier=${source.cityTier} 不匹配`);
  if (filter.cityTierGroups && !filter.cityTierGroups.some((id) => aggregateRegistry.includes(id, source.cityTier))) problems.push(`${prefix} city tier group 不匹配`);
  if (filter.hukou && !filter.hukou.includes(source.hukou)) problems.push(`${prefix} hukou=${source.hukou} 不匹配`);
  if (filter.genders && !filter.genders.includes(source.gender)) problems.push(`${prefix} gender=${source.gender} 不匹配`);
  return problems;
}

function reviewAnachronisms(events) {
  const results = [];
  for (const row of events) {
    const copy = `${row.title}${row.final_text}${row.final_result_text}`;
    for (const rule of ERA_TERMS) {
      if (num(row.year) >= rule.since || !copy.includes(rule.term)) continue;
      results.push(`${row.event_row_id} ${row.year}年/${row.age}岁 ${row.event_id}: “${rule.term}”建议不早于${rule.since}年；“${excerpt(copy)}”`);
    }
  }
  return unique(results);
}

function reviewFrequency(batch) {
  const definitions = new Map(data.events.map((event) => [event.id, event]));
  const eventRows = groupByMap(batch.events, (row) => row.event_id);
  const byRun = groupByMap(batch.events, (row) => row.run_id);
  const runCount = batch.summary.length;
  const eventStats = [];
  const copyMonoculture = [];
  const overpenetrating = [];
  let repeatedEventExcess = 0;
  let repeatedNonquietEventExcess = 0;
  let repeatedCopyExcess = 0;
  const repeatSamples = [];

  for (const [eventId, rows] of eventRows) {
    const runs = new Set(rows.map((row) => row.run_id));
    const texts = countBy(rows, (row) => normalizeText(`${row.final_text}\n${row.final_result_text}`));
    const dominantTextCount = Math.max(...Object.values(texts));
    const stat = {
      event_id: eventId,
      count: rows.length,
      lives: runs.size,
      life_penetration_rate: ratio(runs.size, runCount),
      event_share: ratio(rows.length, batch.events.length),
      unique_visible_copies: Object.keys(texts).length,
      dominant_copy_share: ratio(dominantTextCount, rows.length),
    };
    eventStats.push(stat);
    const definition = definitions.get(eventId);
    const isLifecycle = Boolean(definition?.priority) || ["birth", "ending"].includes(rows[0]?.category);
    if (!isLifecycle && eventId !== "life_quiet_year" && stat.life_penetration_rate > 0.55) {
      overpenetrating.push(`${eventId}: ${percent(stat.life_penetration_rate)}人生出现，${rows.length}次`);
    }
    if (rows.length >= 40 && stat.life_penetration_rate >= 0.08 && (stat.unique_visible_copies === 1 || stat.dominant_copy_share > 0.8)) {
      copyMonoculture.push(`${eventId}: ${rows.length}次/${runs.size}局，${stat.unique_visible_copies}种文案，主文案占${percent(stat.dominant_copy_share)}`);
    }
  }

  for (const [runId, rows] of byRun) {
    const eventCounts = countBy(rows, (row) => row.event_id);
    const nonquietEventCounts = countBy(rows.filter((row) => row.event_id !== "life_quiet_year"), (row) => row.event_id);
    const textCounts = countBy(rows, (row) => normalizeText(`${row.final_text}\n${row.final_result_text}`));
    const eventExcess = excess(eventCounts);
    const copyExcess = excess(textCounts);
    repeatedEventExcess += eventExcess;
    repeatedNonquietEventExcess += excess(nonquietEventCounts);
    repeatedCopyExcess += copyExcess;
    if (eventExcess || copyExcess) repeatSamples.push(`${runId}: 重复事件${eventExcess}，重复文案${copyExcess}`);
  }

  eventStats.sort((left, right) => right.life_penetration_rate - left.life_penetration_rate || right.count - left.count);
  const countSorted = [...eventStats].sort((left, right) => right.count - left.count);
  const top10Count = countSorted.slice(0, 10).reduce((sum, item) => sum + item.count, 0);
  const top20Count = countSorted.slice(0, 20).reduce((sum, item) => sum + item.count, 0);
  const observedDefinitions = eventStats.filter((item) => definitions.has(item.event_id)).length;
  return {
    observed_unique_events: observedDefinitions,
    event_definition_coverage_rate: ratio(observedDefinitions, data.events.length),
    top_10_event_share: ratio(top10Count, batch.events.length),
    top_20_event_share: ratio(top20Count, batch.events.length),
    event_hhi: eventStats.reduce((sum, item) => sum + item.event_share ** 2, 0),
    quiet_year_count: eventRows.get("life_quiet_year")?.length ?? 0,
    quiet_year_rate: ratio(eventRows.get("life_quiet_year")?.length ?? 0, batch.events.length),
    repeated_event_excess: repeatedEventExcess,
    repeated_event_rate: ratio(repeatedEventExcess, batch.events.length),
    repeated_nonquiet_event_excess: repeatedNonquietEventExcess,
    repeated_nonquiet_event_rate: ratio(repeatedNonquietEventExcess, batch.events.length),
    repeated_visible_copy_excess: repeatedCopyExcess,
    repeated_visible_copy_rate: ratio(repeatedCopyExcess, batch.events.length),
    overpenetrating,
    copyMonoculture: copyMonoculture.sort(),
    repeatSamples,
    top_by_life_penetration: eventStats.slice(0, 25),
    top_by_event_count: countSorted.slice(0, 25),
  };
}

function reviewSubgroups(batch) {
  const eventsByRun = groupByMap(batch.events, (row) => row.run_id);
  const dimensions = {};
  const holes = [];
  for (const dimension of STRATUM_DIMENSIONS) {
    dimensions[dimension] = subgroupTable(batch.summary, eventsByRun, (row) => row[dimension]);
    for (const [key, stats] of Object.entries(dimensions[dimension])) {
      if (stats.runs < 10 || stats.quiet_year_rate <= 0.35) continue;
      holes.push(`${dimension}=${key}: ${stats.runs}局，平常年${percent(stats.quiet_year_rate)}，每百人年具体事件${stats.specific_events_per_100_years.toFixed(1)}`);
    }
  }
  const intersections = subgroupTable(batch.summary, eventsByRun, (row) => `${row.cohort}|${row.settlement}|${row.class_tier}`);
  for (const [key, stats] of Object.entries(intersections)) {
    if (stats.runs < 5) continue;
    if (stats.quiet_year_rate > 0.35) holes.push(`${key}: ${stats.runs}局，平常年${percent(stats.quiet_year_rate)}，每百人年具体事件${stats.specific_events_per_100_years.toFixed(1)}`);
    else if (stats.specific_events_per_100_years < 45) holes.push(`${key}: 每百人年具体事件仅${stats.specific_events_per_100_years.toFixed(1)}`);
  }
  return { dimensions, cohort_settlement_class: intersections, holes };
}

function subgroupTable(summaryRows, eventsByRun, getKey) {
  const groups = groupByMap(summaryRows, getKey);
  const table = {};
  for (const [key, rows] of groups) {
    const events = rows.flatMap((row) => eventsByRun.get(row.run_id) ?? []);
    const quietCount = events.filter((row) => row.event_id === "life_quiet_year").length;
    const uniqueEvents = new Set(events.map((row) => row.event_id));
    const eventCounts = countBy(events, (row) => row.event_id);
    const top = Object.entries(eventCounts).sort((a, b) => b[1] - a[1])[0] ?? ["", 0];
    table[key] = {
      runs: rows.length,
      person_years: events.length,
      unique_events: uniqueEvents.size,
      quiet_year_rate: ratio(quietCount, events.length),
      specific_events_per_100_years: ratio(events.length - quietCount, events.length) * 100,
      repeated_visible_copy_rate: ratio(rows.reduce((sum, row) => sum + num(row.repeated_visible_copy_excess), 0), events.length),
      mean_final_age: average(rows.map((row) => num(row.final_age))),
      death_under_18_rate: ratio(rows.filter((row) => num(row.final_age) < 18).length, rows.length),
      death_under_40_rate: ratio(rows.filter((row) => num(row.final_age) < 40).length, rows.length),
      age_cap_rate: ratio(rows.filter((row) => row.reached_age_cap === "yes").length, rows.length),
      top_event: top[0],
      top_event_share: ratio(top[1], events.length),
    };
  }
  return table;
}

function reviewMortality(summary) {
  const ages = summary.map((row) => num(row.final_age));
  const ended = summary.filter((row) => row.alive === "no");
  const endedAges = ended.map((row) => num(row.final_age));
  const ageCounts = countBy(ended, (row) => row.final_age);
  const spikes = Object.entries(ageCounts)
    .filter(([, count]) => ended.length >= 50 && ratio(count, ended.length) > 0.12)
    .sort((left, right) => right[1] - left[1])
    .map(([age, count]) => `${age}岁：${count}/${ended.length}（${percent(ratio(count, ended.length))}）`);
  const cappedRows = summary.filter((row) => row.reached_age_cap === "yes");
  const cohorts = {};
  const historicalCalibration = [];
  const historicalRows = summary.filter((row) => ["born_1840", "born_1870", "born_1900", "born_1925"].includes(row.cohort));
  for (const [cohort, rows] of groupByMap(summary, (row) => row.cohort)) {
    const stats = {
      runs: rows.length,
      mean_final_age: average(rows.map((row) => num(row.final_age))),
      median_final_age: quantile(rows.map((row) => num(row.final_age)), 0.5),
      infant_death_rate: ratio(rows.filter((row) => num(row.final_age) < 1).length, rows.length),
      death_under_18_rate: ratio(rows.filter((row) => num(row.final_age) < 18).length, rows.length),
      death_under_40_rate: ratio(rows.filter((row) => num(row.final_age) < 40).length, rows.length),
      age_cap_rate: ratio(rows.filter((row) => row.reached_age_cap === "yes").length, rows.length),
    };
    cohorts[cohort] = stats;
    if (["born_1840", "born_1870", "born_1900", "born_1925"].includes(cohort) && rows.length >= 30 && stats.death_under_18_rate < 0.02) {
      historicalCalibration.push(`${cohort}: ${rows.length}局，18岁前结束仅${percent(stats.death_under_18_rate)}，平均终年${stats.mean_final_age.toFixed(1)}；需核对是否把近代高早亡风险写得过轻`);
    }
  }
  const historicalUnder18Rate = ratio(historicalRows.filter((row) => num(row.final_age) < 18).length, historicalRows.length);
  if (historicalRows.length >= 30 && historicalUnder18Rate < 0.02) {
    historicalCalibration.unshift(`近代四个世代合计：${historicalRows.length}局，18岁前结束仅${percent(historicalUnder18Rate)}，平均终年${average(historicalRows.map((row) => num(row.final_age))).toFixed(1)}；死亡机制与近代生活风险可能没有充分随年代变化`);
  }
  return {
    ended: ended.length,
    capped: cappedRows.length,
    mean_final_age: average(ages),
    p10_final_age: quantile(ages, 0.1),
    median_final_age: quantile(ages, 0.5),
    p90_final_age: quantile(ages, 0.9),
    infant_death_rate: ratio(ages.filter((age) => age < 1).length, ages.length),
    death_under_18_rate: ratio(ages.filter((age) => age < 18).length, ages.length),
    death_under_40_rate: ratio(ages.filter((age) => age < 40).length, ages.length),
    ended_mean_age: average(endedAges),
    death_age_distribution: Object.fromEntries(Object.entries(ageCounts).sort((left, right) => num(left[0]) - num(right[0]))),
    cohort_distribution: cohorts,
    spikes,
    historicalCalibration,
    capSamples: cappedRows.map((row) => `${row.run_id} ${row.cohort}/${row.gender}/${row.settlement}/${row.class_tier}`),
  };
}

function evaluateGates(metrics, allFindings) {
  const thresholds = {
    max_repeated_visible_copy_rate: numericArg(args["max-repeat-copy-rate"], 0.03),
    max_top_10_event_share: numericArg(args["max-top10-share"], 0.45),
    max_quiet_year_rate: numericArg(args["max-quiet-rate"], 0.35),
    max_texture_event_rate: numericArg(args["max-texture-rate"], 0.72),
    min_structural_event_rate: numericArg(args["min-structural-rate"], 0.25),
    max_age_cap_rate: numericArg(args["max-age-cap-rate"], 0.02),
    min_event_definition_coverage_rate: numericArg(args["min-event-coverage"], 0.45),
    min_future_history_rate: numericArg(args["min-future-history-rate"], 0.08),
    min_future_history_coverage_rate: numericArg(args["min-future-history-coverage"], 0.45),
    max_shadow_untraced_rate: numericArg(args["max-shadow-untraced-rate"], 0.12),
    max_shadow_overconcentrated_life_rate: numericArg(args["max-shadow-overconcentrated-rate"], 0.05),
  };
  const hasFutureSample = metrics.future_history.person_years >= 200;
  const hasShadowSample = metrics.shadow.harm_narrative_events >= 20;
  const checks = [
    gate("no_error_findings", !allFindings.some((item) => item.severity === "error"), allFindings.filter((item) => item.severity === "error").map((item) => item.code).join(", ") || "ok"),
    gate("repeated_visible_copy_rate", metrics.frequency.repeated_visible_copy_rate <= thresholds.max_repeated_visible_copy_rate, `${percent(metrics.frequency.repeated_visible_copy_rate)} <= ${percent(thresholds.max_repeated_visible_copy_rate)}`),
    gate("top_10_event_share", metrics.frequency.top_10_event_share <= thresholds.max_top_10_event_share, `${percent(metrics.frequency.top_10_event_share)} <= ${percent(thresholds.max_top_10_event_share)}`),
    gate("quiet_year_rate", metrics.frequency.quiet_year_rate <= thresholds.max_quiet_year_rate, `${percent(metrics.frequency.quiet_year_rate)} <= ${percent(thresholds.max_quiet_year_rate)}`),
    gate("texture_event_rate", metrics.narrative.texture_event_rate <= thresholds.max_texture_event_rate, `${percent(metrics.narrative.texture_event_rate)} <= ${percent(thresholds.max_texture_event_rate)}`),
    gate("structural_event_rate", metrics.narrative.structural_event_rate >= thresholds.min_structural_event_rate, `${percent(metrics.narrative.structural_event_rate)} >= ${percent(thresholds.min_structural_event_rate)}`),
    gate("age_cap_rate", ratio(metrics.mortality.capped, metrics.counts.runs) <= thresholds.max_age_cap_rate, `${percent(ratio(metrics.mortality.capped, metrics.counts.runs))} <= ${percent(thresholds.max_age_cap_rate)}`),
    gate("event_definition_coverage_rate", metrics.frequency.event_definition_coverage_rate >= thresholds.min_event_definition_coverage_rate, `${percent(metrics.frequency.event_definition_coverage_rate)} >= ${percent(thresholds.min_event_definition_coverage_rate)}`),
    gate("future_history_rate", !hasFutureSample || metrics.future_history.historical_event_rate >= thresholds.min_future_history_rate, hasFutureSample ? `${percent(metrics.future_history.historical_event_rate)} >= ${percent(thresholds.min_future_history_rate)}` : `跳过：仅${metrics.future_history.person_years}个未来个人年`),
    gate("future_history_definition_coverage", !hasFutureSample || metrics.future_history.definition_coverage_rate >= thresholds.min_future_history_coverage_rate, hasFutureSample ? `${percent(metrics.future_history.definition_coverage_rate)} >= ${percent(thresholds.min_future_history_coverage_rate)}` : `跳过：仅${metrics.future_history.person_years}个未来个人年`),
    gate("shadow_harm_trace", !hasShadowSample || metrics.shadow.harm_without_trace_rate <= thresholds.max_shadow_untraced_rate, hasShadowSample ? `${percent(metrics.shadow.harm_without_trace_rate)} <= ${percent(thresholds.max_shadow_untraced_rate)}` : `跳过：仅${metrics.shadow.harm_narrative_events}个主动伤害开端`),
    gate("shadow_state_integrity", metrics.shadow.state_jump_count === 0 && metrics.shadow.contradiction_count === 0, `跳变${metrics.shadow.state_jump_count} / 矛盾${metrics.shadow.contradiction_count}`),
    gate("shadow_overconcentration", ratio(metrics.shadow.overconcentratedLives.length, metrics.counts.runs) <= thresholds.max_shadow_overconcentrated_life_rate, `${percent(ratio(metrics.shadow.overconcentratedLives.length, metrics.counts.runs))} <= ${percent(thresholds.max_shadow_overconcentrated_life_rate)}`),
    gate("shadow_identity_skew", metrics.counts.runs < 100 || metrics.shadow.subgroupSkews.length === 0, metrics.counts.runs < 100 ? `跳过：仅${metrics.counts.runs}局` : `${metrics.shadow.subgroupSkews.length}组显著偏差`),
  ];
  return { passed: checks.every((item) => item.passed), thresholds, checks };
}

function gate(id, passed, detail) {
  return { id, passed, detail };
}

function formatReport(result) {
  const { metrics } = result;
  const lines = [
    "# 分层人生批测审查",
    "",
    `门禁：${result.gates.passed ? "通过" : "未通过"}`,
    `样本：${metrics.counts.runs} 局 / ${metrics.counts.person_years} 个人年 / ${metrics.counts.events} 条事件`,
    `事件定义覆盖：${metrics.frequency.observed_unique_events}/${metrics.counts.event_definitions}（${percent(metrics.frequency.event_definition_coverage_rate)}）`,
    "",
    "## 核心指标",
    "",
    `- 平常年占比：${percent(metrics.frequency.quiet_year_rate)}`,
    `- 结构性事件：${percent(metrics.narrative.structural_event_rate)}（转折 ${percent(metrics.narrative.turning_point_rate)} / 后果 ${percent(metrics.narrative.consequence_rate)} / 历史压力 ${percent(metrics.narrative.historical_pressure_rate)}）`,
    `- 日常纹理：${percent(metrics.narrative.texture_event_rate)}；最长纹理超过5年的生命 ${metrics.narrative.lives_with_texture_streak_over_5} 局`,
    `- 阴影人生：${metrics.shadow.authored_lives}/${metrics.counts.runs}局触发 ${metrics.shadow.authored_event_count} 条（公共 ${metrics.shadow.authored_by_family.public ?? 0} / 私人 ${metrics.shadow.authored_by_family.private ?? 0} / 生存 ${metrics.shadow.authored_by_family.survival ?? 0}）；定义覆盖 ${metrics.shadow.observed_authored_definitions}/${metrics.shadow.authored_definitions}（${percent(metrics.shadow.authored_definition_coverage_rate)}）`,
    `- 阴影连续性：主动伤害开端 ${metrics.shadow.harm_narrative_events} 条，其中十五年内缺少后续痕迹 ${metrics.shadow.harm_without_trace_count} 条；状态跳变 ${metrics.shadow.state_jump_count} 条，矛盾 ${metrics.shadow.contradiction_count} 条`,
    `- 阴影身份偏差：性别、阶层、城乡显著失衡 ${metrics.shadow.subgroupSkews.length} 组（允许处境不同，不允许身份直接等于恶）`,
    `- 未来历史（2036—2120）：${metrics.future_history.historical_events}/${metrics.future_history.person_years}个人年（${percent(metrics.future_history.historical_event_rate)}）；事件定义覆盖 ${metrics.future_history.observed_definitions}/${metrics.future_history.definitions}（${percent(metrics.future_history.definition_coverage_rate)}）`,
    `- 同局重复事件：${metrics.frequency.repeated_event_excess}（${percent(metrics.frequency.repeated_event_rate)}）；排除平常年后 ${metrics.frequency.repeated_nonquiet_event_excess}`,
    `- 同局重复可见文案：${metrics.frequency.repeated_visible_copy_excess}（${percent(metrics.frequency.repeated_visible_copy_rate)}）`,
    `- 头部10事件占比：${percent(metrics.frequency.top_10_event_share)}；HHI ${metrics.frequency.event_hhi.toFixed(4)}`,
    `- 平均终年：${metrics.mortality.mean_final_age.toFixed(1)}；P10/P50/P90：${metrics.mortality.p10_final_age}/${metrics.mortality.median_final_age}/${metrics.mortality.p90_final_age}`,
    `- 18岁前结束：${percent(metrics.mortality.death_under_18_rate)}；40岁前结束：${percent(metrics.mortality.death_under_40_rate)}`,
    "",
    "## 门禁明细",
    "",
  ];
  for (const check of result.gates.checks) lines.push(`- ${check.passed ? "PASS" : "FAIL"} ${check.id}: ${check.detail}`);

  for (const severity of ["error", "warning", "info"]) {
    const selected = result.findings.filter((item) => item.severity === severity);
    lines.push("", `## ${severityLabel(severity)}（${selected.length}类）`, "");
    if (!selected.length) lines.push("- 无");
    for (const finding of selected) {
      lines.push(`- [${finding.code}] ${finding.message}`);
      for (const sample of finding.samples) lines.push(`  - ${sample}`);
    }
  }

  lines.push("", "## 人生渗透率最高事件", "");
  for (const item of metrics.frequency.top_by_life_penetration.slice(0, 15)) {
    lines.push(`- ${item.event_id}: ${percent(item.life_penetration_rate)}人生 / ${item.count}次 / ${item.unique_visible_copies}种文案`);
  }
  lines.push("", "## 出生世代死亡分布", "");
  for (const [cohort, item] of Object.entries(metrics.mortality.cohort_distribution)) {
    lines.push(`- ${cohort}: ${item.runs}局，平均${item.mean_final_age.toFixed(1)}岁，18岁前${percent(item.death_under_18_rate)}，40岁前${percent(item.death_under_40_rate)}`);
  }
  return `${lines.join("\n")}\n`;
}

function loadBatch(inputFiles) {
  return {
    summary: parseCsv(readFileSync(inputFiles.summary, "utf8"), new Set([
      "run_id", "case_id", "cohort", "region_group", "settlement", "class_tier", "attribute_tier",
      "birth_year", "gender", "birth_province", "birth_city_tier", "hukou", "family_class",
      "final_age", "alive", "reached_age_cap", "event_count", "repeated_visible_copy_excess",
      "structural_event_count", "texture_event_count", "max_texture_streak", "longest_structural_gap",
      ...SHADOW_FIELDS.map((field) => shadowColumn(field, "final")),
    ])),
    years: parseCsv(readFileSync(inputFiles.years, "utf8"), new Set([
      "run_id", "year_id", "birth_year", "chronicle_id", "age", "year", "event_count", "event_ids",
      "education_status", "education_current_level", "education_completed_level", "education_mode",
      "education_concurrent_career", "career_status", "career_jobs_held", "primary_activity",
      "life_course_transition_count", "alive_after_year", "tags",
      "narrative_last_tier", "narrative_last_domain", "narrative_years_since_structural",
      "narrative_texture_streak", "narrative_structural_count", "narrative_active_threads",
      ...SHADOW_FIELDS.flatMap((field) => [shadowColumn(field, "before"), shadowColumn(field, "after")]),
    ])),
    events: parseCsv(readFileSync(inputFiles.events, "utf8"), new Set([
      "run_id", "event_row_id", "year_id", "event_order", "cohort", "region_group", "settlement",
      "class_tier", "attribute_tier", "birth_year", "gender", "birth_province", "birth_city_tier",
      "hukou", "family_class", "age", "year", "trigger_province", "trigger_city_tier",
      "chronicle_id", "partner_status_after", "children_after", "education_level_after",
      "education_status_before", "education_status_after", "education_current_level_after",
      "education_completed_level_after", "education_mode_after", "education_concurrent_career_after",
      "career_status_before", "career_field_before", "career_status_after", "career_field_after",
      "career_jobs_held_after", "primary_activity_after",
      "event_id", "title", "category", "final_text", "final_result_text", "death",
      "narrative_tier", "narrative_domain", "narrative_texture_streak_before",
      "narrative_texture_streak_after", "narrative_years_since_structural_before",
      "narrative_years_since_structural_after", "narrative_active_threads_after",
      ...SHADOW_FIELDS.flatMap((field) => [shadowColumn(field, "before"), shadowColumn(field, "after")]),
    ])),
    manifest: JSON.parse(readFileSync(inputFiles.manifest, "utf8")),
  };
}

function resolveFiles(source) {
  const summaryArg = source.summary ?? source.input;
  if (!summaryArg) throw new Error("Provide --summary path/to/stratified.csv");
  const summary = resolve(summaryArg);
  const extension = extname(summary);
  const base = extension ? summary.slice(0, -extension.length) : summary;
  const suffix = extension || ".csv";
  return {
    summary,
    years: resolve(source.years ?? `${base}.years${suffix}`),
    events: resolve(source.events ?? `${base}.events${suffix}`),
    manifest: resolve(source.manifest ?? `${base}.manifest.json`),
  };
}

function parseCsv(input, selectedHeaders) {
  const rows = [];
  let headers = null;
  let columns = null;
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
      commit(row);
      row = [];
      cell = "";
    } else cell += char;
  }
  if (cell || row.length) {
    row.push(cell.replace(/\r$/, ""));
    commit(row);
  }
  return rows;

  function commit(values) {
    if (!headers) {
      headers = values;
      columns = headers.map((header, index) => ({ header, index })).filter(({ header }) => selectedHeaders.has(header));
      return;
    }
    if (!values.some(Boolean)) return;
    rows.push(Object.fromEntries(columns.map(({ header, index }) => [header, values[index] ?? ""])));
  }
}

function uniqueIndex(rows, key, problems, label) {
  const result = new Map();
  for (const row of rows) {
    if (result.has(row[key])) problems.push(`${label} 重复键 ${row[key]}`);
    result.set(row[key], row);
  }
  return result;
}

function addFinding(target, severity, code, message, samples) {
  const count = samples.length;
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

function groupByMap(items, getKey) {
  const result = new Map();
  for (const item of items) {
    const key = getKey(item);
    const rows = result.get(key) ?? [];
    rows.push(item);
    result.set(key, rows);
  }
  return result;
}

function countBy(items, getKey) {
  const result = {};
  for (const item of items) {
    const key = getKey(item);
    result[key] = (result[key] ?? 0) + 1;
  }
  return result;
}

function excess(counts) {
  return Object.values(counts).reduce((sum, count) => sum + Math.max(0, count - 1), 0);
}

function unique(items) {
  return [...new Set(items)];
}

function splitList(value) {
  return value ? value.split("|").filter(Boolean) : [];
}

function normalizeText(value) {
  return String(value ?? "").replace(/[\s，。！？、；：,.!?;:“”‘’'"《》〈〉（）()【】\[\]—…·0-9]/g, "").trim();
}

function readShadow(row, suffix) {
  return Object.fromEntries(SHADOW_FIELDS.map((field) => [field, num(row[shadowColumn(field, suffix)])]));
}

function shadowColumn(field, suffix) {
  const name = field.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  return `shadow_${name}_${suffix}`;
}

function signed(value) {
  return `${value > 0 ? "+" : ""}${value}`;
}

function excerpt(value) {
  const text = String(value).replace(/\s+/g, " ");
  return text.length > 58 ? `${text.slice(0, 58)}…` : text;
}

function inRange(value, range) {
  return value >= range[0] && value <= range[1];
}

function formatRange(rule) {
  if (rule.min !== undefined && rule.max !== undefined) return `${rule.min}-${rule.max}`;
  if (rule.min !== undefined) return `${rule.min}+`;
  return `不高于${rule.max}`;
}

function num(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function ratio(numerator, denominator) {
  return denominator ? numerator / denominator : 0;
}

function average(values) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function quantile(values, probability) {
  if (!values.length) return 0;
  const sorted = [...values].sort((left, right) => left - right);
  return sorted[Math.round((sorted.length - 1) * probability)];
}

function percent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function positiveInteger(value, fallback, label) {
  const parsed = Number(value ?? fallback);
  if (!Number.isInteger(parsed) || parsed <= 0) throw new Error(`${label} must be a positive integer`);
  return parsed;
}

function numericArg(value, fallback) {
  const parsed = Number(value ?? fallback);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 1) throw new Error("Gate thresholds must be numbers from 0 to 1");
  return parsed;
}

function severityLabel(severity) {
  return ({ error: "阻断问题", warning: "人工审查队列", info: "信息" })[severity];
}

const STRATUM_DIMENSIONS = ["cohort", "gender", "settlement", "class_tier", "region_group", "attribute_tier"];

const INFANT_ADULT_PERSPECTIVE = /你(?:知道|第一次知道|意识到|明白|懂得|发现|觉得|认为|盘算|决定|期待|担心|记住|记得|回想|先记起|学会|只好|终于|从此)|后来回想|多年以后你仍记得|你把每一笔开销|你没有忽然成为|你一面被年月改变|日子像被洗亮/;

const SHADOW_HARM_ACTION = /(?:你|他|她)(?:亲手|曾经|又|也|决定|选择|开始|被迫)?(?:告密|出卖|背叛|侵吞|贪污|收受贿赂|受贿|欺骗|诈骗|逼迫|强迫|殴打|打伤|报复|勒索|偷走|抢走|羞辱|虐待|伤害|杀害|处决|镇压|迫害)|(?:你|他|她)(?:参与|默许|纵容|下令|领导).{0,16}(?:镇压|迫害|掠夺|欺骗|暴力|伤害|杀害|屠杀)/;
const SHADOW_CONSEQUENCE_TEXT = /内疚|愧疚|噩梦|失去信任|不再信任|疏远|决裂|关系破裂|伤口|阴影|代价|责任|追责|赔偿|道歉|坦白|恐惧|无法原谅|记恨|报复|自我辩解/;
const SHADOW_REPAIR_TEXT = /道歉|坦白|赔偿|补偿|归还|修复|重建信任|承担责任|弥补/;
const SHADOW_REFLECTION_TEXT = /反思|承认|面对|承担|坦白|道歉|赎罪|悔|愧疚|内疚|理解了自己的/;
const SHADOW_REPENTANCE_CLOSURE = /(?:晚年|临终|最后|终于).{0,20}(?:悔|认错|道歉|赎罪|获得原谅|得到原谅|放下)|(?:一切|过往).{0,12}(?:释然|洗清|得到原谅|获得原谅)/;

const AGE_RULES = [
  { label: "襁褓/吃奶/学步", pattern: /你(?:还|仍)?(?:在)?襁褓|你(?:开始)?吃奶|你(?:开始)?学步|你咿呀学语/, max: 4 },
  { label: "幼儿园", pattern: /你.{0,8}(?:幼儿园|托儿所)|把你送进(?:幼儿园|托儿所)/, min: 0, max: 9 },
  { label: "小学", pattern: /小学生|读小学|小学课堂|小学毕业/, min: 5, max: 17 },
  { label: "中学", pattern: /中学生|读初中|读高中|初中毕业|高中毕业/, min: 10, max: 24 },
  { label: "高考", pattern: /参加高考|高考到了|走进高考考场/, min: 14, max: 35 },
  { label: "大学生涯", pattern: /大学新生|大学宿舍|大学毕业|考上大学|进入大学/, min: 15, max: 45 },
  { label: "婚姻", pattern: /你结婚|你成婚|你成亲|你的婚礼|领了结婚证/, min: 15 },
  { label: "入伍", pattern: /你参军|你入伍|你被征兵|你被拉了壮丁/, min: 14, max: 60 },
  { label: "退休", pattern: /你退休|办了退休|退休金|退休生活/, min: 38 },
  { label: "孙辈", pattern: /你的孙子|你的孙女|外孙|孙辈/, min: 32 },
];

const ERA_TERMS = [
  { term: "电报", since: 1871 },
  { term: "电话", since: 1882 },
  { term: "电影", since: 1896 },
  { term: "收音机", since: 1923 },
  { term: "电视", since: 1958 },
  { term: "赤脚医生", since: 1968 },
  { term: "万元户", since: 1979 },
  { term: "个体户", since: 1980 },
  { term: "寻呼机", since: 1983 },
  { term: "BP机", since: 1983 },
  { term: "乡镇企业", since: 1984 },
  { term: "大哥大", since: 1987 },
  { term: "下岗", since: 1987 },
  { term: "手机", since: 1990 },
  { term: "VCD", since: 1993 },
  { term: "互联网", since: 1994 },
  { term: "网吧", since: 1996 },
  { term: "QQ", since: 1999 },
  { term: "电商", since: 1999 },
  { term: "网课", since: 2000 },
  { term: "淘宝", since: 2003 },
  { term: "支付宝", since: 2004 },
  { term: "社交媒体", since: 2004 },
  { term: "二维码", since: 2005 },
  { term: "高铁", since: 2007 },
  { term: "动车", since: 2007 },
  { term: "智能手机", since: 2007 },
  { term: "微博", since: 2009 },
  { term: "网盘", since: 2009 },
  { term: "外卖平台", since: 2010 },
  { term: "家长群", since: 2010 },
  { term: "微信", since: 2011 },
  { term: "朋友圈", since: 2012 },
  { term: "短视频", since: 2012 },
  { term: "网约车", since: 2012 },
  { term: "移动支付", since: 2013 },
  { term: "共享单车", since: 2016 },
  { term: "直播间", since: 2016 },
  { term: "健康码", since: 2020 },
  { term: "核酸检测", since: 2020 },
  { term: "打工人", since: 2020 },
  { term: "躺平", since: 2021 },
  { term: "生成式AI", since: 2022 },
  { term: "大模型", since: 2022 },
];

const PLACE_RULES = [
  { label: "弄堂/石库门", pattern: /弄堂|石库门/, provinces: ["shanghai"] },
  { label: "窑洞", pattern: /窑洞/, provinces: ["shaanxi", "shanxi", "gansu", "ningxia", "henan"] },
  { label: "青稞", pattern: /青稞/, provinces: ["xizang", "qinghai", "sichuan", "yunnan", "gansu"] },
  { label: "橡胶林", pattern: /橡胶林/, provinces: ["hainan", "yunnan", "guangdong"] },
  { label: "椰林", pattern: /椰林|椰子树/, provinces: ["hainan", "guangdong", "guangxi", "fujian", "taiwan"] },
  { label: "胡杨", pattern: /胡杨/, provinces: ["xinjiang", "gansu", "neimenggu", "qinghai"] },
];

main();
