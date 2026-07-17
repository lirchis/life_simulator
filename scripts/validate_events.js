import { data } from "../src/data/index.js";

const errors = [];
const eventIds = new Set();

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
