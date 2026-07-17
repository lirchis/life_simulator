import { data } from "../src/data/index.js";

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

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  const automaticOutcomeEvents = data.events.filter((event) => event.outcomes?.length).length;
  console.log(`Validated ${data.events.length} events; interactive choices: 0; automatic outcome events: ${automaticOutcomeEvents}`);
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
