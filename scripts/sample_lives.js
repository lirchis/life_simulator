import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";

const args = parseArgs(process.argv.slice(2));
const summaryPath = resolve(args.summary ?? args.input ?? "reports/stratified-qa.csv");
const base = stripExtension(summaryPath);
const eventsPath = resolve(args.events ?? `${base}.events.csv`);
const reviewPath = resolve(args.review ?? `${base}.review.json`);
const outputPath = resolve(args.out ?? `${base}.samples.md`);

const summaries = parseSelectedCsv(readFileSync(summaryPath, "utf8"), new Set([
  "run_id", "cohort", "gender", "settlement", "class_tier", "region_group", "attribute_tier",
  "birth_year", "family_class", "final_age", "alive", "event_count",
  "shadow_harm_done_final", "shadow_guilt_final", "shadow_hardness_final",
  "shadow_self_deception_final", "shadow_trust_debt_final",
]));
const events = parseSelectedCsv(readFileSync(eventsPath, "utf8"), new Set([
  "run_id", "event_order", "age", "year", "event_id", "title", "category",
  "final_text", "final_result_text", "narrative_tier", "trigger_province", "trigger_city_tier",
]));
const review = existsSync(reviewPath) ? JSON.parse(readFileSync(reviewPath, "utf8")) : null;
const eventsByRun = groupByMap(events, (row) => row.run_id);
const reasons = new Map();

selectCoverageSlices();
selectExtremes();
selectReviewRisks();

const selected = summaries.filter((row) => reasons.has(row.run_id));
const report = renderReport(selected);
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, report, "utf8");
console.log(`Wrote ${selected.length} complete-life reading samples to ${outputPath}`);

function selectCoverageSlices() {
  const slices = [
    ["cohort", "出生世代"],
    ["gender", "性别"],
    ["settlement", "城乡"],
    ["class_tier", "家庭资源"],
    ["region_group", "地区"],
    ["attribute_tier", "属性"],
  ];
  for (const [field, label] of slices) selectMedianPerSlice(field, label);
}

function selectMedianPerSlice(field, label) {
  for (const [value, rows] of groupByMap(summaries, (row) => row[field])) {
    if (!value) continue;
    const ages = rows.map((row) => number(row.final_age)).sort((left, right) => left - right);
    const median = ages[Math.floor(ages.length / 2)] ?? 0;
    const chosen = [...rows].sort((left, right) => {
      const distance = Math.abs(number(left.final_age) - median) - Math.abs(number(right.final_age) - median);
      return distance || left.run_id.localeCompare(right.run_id);
    })[0];
    addReason(chosen?.run_id, `${label}${value}中位寿命样本`);
  }
}

function selectExtremes() {
  const byAge = [...summaries].sort((left, right) => number(left.final_age) - number(right.final_age));
  addReason(byAge[0]?.run_id, "最早结束人生");
  addReason(byAge.at(-1)?.run_id, "最长寿人生");

  const stats = summaries.map((summary) => {
    const rows = eventsByRun.get(summary.run_id) ?? [];
    return {
      run_id: summary.run_id,
      shadow: rows.filter((row) => row.event_id.startsWith("shadow_")).length,
      quiet: rows.filter((row) => row.event_id === "life_quiet_year").length,
      texture: rows.filter((row) => row.narrative_tier === "texture").length,
    };
  });
  addReason([...stats].sort((left, right) => right.shadow - left.shadow)[0]?.run_id, "阴影事件最多");
  addReason([...stats].sort((left, right) => right.quiet - left.quiet)[0]?.run_id, "平常年最多");
  addReason([...stats].sort((left, right) => right.texture - left.texture)[0]?.run_id, "日常纹理最多");

  const selectedShadowExtremes = new Set();
  for (const [field, label] of [
    ["shadow_harm_done_final", "造成伤害累计最高"],
    ["shadow_guilt_final", "愧疚累计最高"],
    ["shadow_hardness_final", "硬化程度最高"],
    ["shadow_self_deception_final", "自我欺骗最高"],
    ["shadow_trust_debt_final", "信任债最高"],
  ]) {
    const chosen = [...summaries]
      .sort((left, right) => number(right[field]) - number(left[field]) || left.run_id.localeCompare(right.run_id))
      .find((row) => !selectedShadowExtremes.has(row.run_id));
    if (!chosen || number(chosen[field]) <= 0) continue;
    selectedShadowExtremes.add(chosen.run_id);
    addReason(chosen.run_id, label);
  }
}

function selectReviewRisks() {
  const problemLives = review?.metrics?.narrative?.problemLives ?? [];
  const seenCohorts = new Set();
  for (const item of problemLives) {
    const [runId, cohort] = item.split(" ");
    if (!runId || seenCohorts.has(cohort)) continue;
    addReason(runId, `结构长空档：${item.split(": ").slice(1).join(": ")}`);
    seenCohorts.add(cohort);
    if (seenCohorts.size >= 6) break;
  }
}

function addReason(runId, reason) {
  if (!runId) return;
  const current = reasons.get(runId) ?? [];
  if (!current.includes(reason)) current.push(reason);
  reasons.set(runId, current);
}

function renderReport(rows) {
  const lines = [
    "# 完整人生人工通读样本",
    "",
    `来源：${summaryPath}`,
    `生成：${new Date().toISOString()}`,
    `样本：${rows.length} 局；选择覆盖出生世代、性别、城乡、家庭资源、地区、属性的中位寿命，以及极端寿命、长纹理空档、阴影状态与平常年极端。`,
    "",
    "通读时逐年检查：时代与地点是否可信；年龄、职业、婚姻与子女是否承接；同类命运是否因人物状态换了观察角度；幽默是否来自生活而不是段子。",
  ];
  for (const summary of rows) {
    const runEvents = [...(eventsByRun.get(summary.run_id) ?? [])].sort((left, right) => number(left.event_order) - number(right.event_order));
    lines.push(
      "",
      `## ${summary.run_id}`,
      "",
      `- 抽样理由：${(reasons.get(summary.run_id) ?? []).join("；")}`,
      `- 开局：${summary.birth_year}年 / ${summary.cohort} / ${summary.gender} / ${summary.settlement} / ${summary.class_tier} / ${summary.region_group} / ${summary.family_class} / ${summary.attribute_tier}`,
      `- 终年：${summary.final_age}岁；事件 ${runEvents.length} 条`,
      `- 阴影终值：伤害 ${summary.shadow_harm_done_final || 0} / 愧疚 ${summary.shadow_guilt_final || 0} / 硬化 ${summary.shadow_hardness_final || 0} / 自我欺骗 ${summary.shadow_self_deception_final || 0} / 信任债 ${summary.shadow_trust_debt_final || 0}`,
      "",
    );
    for (const event of runEvents) {
      const result = event.final_result_text ? ` ${clean(event.final_result_text)}` : "";
      lines.push(`- **${event.year}年 · ${event.age}岁 · ${clean(event.title)}**：${clean(event.final_text)}${result}  _${event.event_id} / ${event.narrative_tier}_`);
    }
  }
  return `${lines.join("\n")}\n`;
}

function parseSelectedCsv(input, selectedHeaders) {
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

function parseArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    if (!argv[index].startsWith("--")) continue;
    const key = argv[index].slice(2);
    const next = argv[index + 1];
    result[key] = next && !next.startsWith("--") ? next : "true";
    if (next && !next.startsWith("--")) index += 1;
  }
  return result;
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

function stripExtension(path) {
  const extension = extname(path);
  return extension ? path.slice(0, -extension.length) : path;
}

function number(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function clean(value) {
  return String(value ?? "").replace(/\s+/g, " ").replace(/\|/g, "｜").trim();
}
