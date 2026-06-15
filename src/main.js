import { createAggregateRegistry } from "./engine/aggregates.js";
import { advanceYear, resolveChoice } from "./engine/advanceYear.js";
import { createRng, pick, randomSeed } from "./engine/random.js";
import { createInitialState } from "./engine/state.js";
import { data } from "./data/index.js";

const app = document.querySelector("#app");
const aggregateRegistry = createAggregateRegistry(data.aggregates);
const labels = makeLabels(data);

let setup = createDefaultSetup();
let rng = createRng(setup.seed);
let state = null;
let pendingChoice = null;
let screen = "home";

const context = () => ({ aggregateRegistry, rng });

function createDefaultSetup() {
  return {
    seed: randomSeed(),
    birthYear: 1995,
    province: "sichuan",
    provinceHistoryCode: "sichuan_old",
    cityTier: "county",
    hukou: "rural",
    familyClass: "worker_family",
    attrs: {
      physique: 3,
      intelligence: 4,
      charm: 3,
      family: 3,
      luck: 3,
      mental: 4,
    },
    talents: [],
    talentPool: [],
  };
}

function makeLabels(source) {
  return {
    province: Object.fromEntries(source.provinces),
    cityTier: Object.fromEntries(source.cityTiers),
    familyClass: Object.fromEntries(source.familyClasses),
    hukou: Object.fromEntries(source.hukouTypes),
    tag: source.tagLabels,
  };
}

function render() {
  if (screen === "home") renderHome();
  if (screen === "setup") renderSetup();
  if (screen === "life") renderLife();
  if (screen === "report") renderReport();
  bindEvents();
  if (pendingChoice) renderChoice();
}

function shell(content) {
  app.innerHTML = `
    <header class="topbar">
      <button class="brand" data-action="home"><span>命</span>人生模拟器</button>
      <div class="top-actions">
        <button class="ghost" data-action="random-start">一键随机</button>
        <button class="ghost" data-action="new">新人生</button>
      </div>
    </header>
    ${content}
  `;
}

function renderHome() {
  shell(`
    <main class="home">
      <section class="home-copy">
        <p class="eyebrow">一九零零以来的普通人命运</p>
        <h1>从一个出生年份开始，穿过时代的浪潮。</h1>
        <p>选择出身、地域、家庭、属性和天赋；此后每一年都会留下新的痕迹。相同 seed 可以重走同一条人生。</p>
        <div class="actions">
          <button class="primary" data-action="setup">开始新人生</button>
          <button data-action="random-start">一键随机开局</button>
        </div>
      </section>
      <section class="panel seed-panel">
        <h2>复现一条人生</h2>
        <label>Seed</label>
        <div class="row">
          <input id="seedInput" value="${setup.seed}" />
          <button data-action="use-seed">使用</button>
        </div>
        <dl class="compact-list">
          <div><dt>起点</dt><dd>1900-2020</dd></div>
          <div><dt>地域</dt><dd>省级口径</dd></div>
          <div><dt>记录</dt><dd>${data.events.length} 种片段</dd></div>
        </dl>
      </section>
    </main>
  `);
}

function renderSetup() {
  if (!setup.talentPool.length) refreshTalents();
  const talentCost = selectedTalentCost();
  const talentBudget = getTalentBudget();
  const startDisabled = !canStart();
  const provinceOptions = data.getProvinceOptionsForYear(setup.birthYear);
  const cityTierOptions = data.getCityTierOptionsForYear(setup.birthYear);
  const hukouOptions = data.getHukouOptionsForYear(setup.birthYear);
  const effectiveHukou = data.getEffectiveHukou(setup.birthYear, setup.cityTier, setup.hukou);
  const familyClassOptions = data.getFamilyClassOptionsForContext(setup.birthYear, setup.cityTier, effectiveHukou);
  const provinceHint = selectedProvinceHint(provinceOptions);
  shell(`
    <main class="setup">
      <section class="panel setup-panel">
        <div class="section-head">
          <div>
            <p class="eyebrow">开局设置</p>
            <h1>设定出身</h1>
          </div>
          <button data-action="randomize-all">全随机</button>
        </div>
        <div class="setup-grid">
          ${selectField("birthYear", "出生年份", yearOptions())}
          ${provinceField(provinceOptions)}
          ${selectField("cityTier", "城市层级", cityTierOptions)}
          ${hukouOptions.length ? selectField("hukou", "户口", hukouOptions) : eraDerivedField("城乡口径", effectiveHukou === "rural" ? "乡土 / 农村" : "城镇 / 市民")}
          ${selectField("familyClass", "家庭阶层", familyClassOptions)}
          <label class="field"><span>Seed</span><input id="setupSeed" value="${setup.seed}" /></label>
        </div>
        ${provinceHint ? `<p class="setup-note">${provinceHint}</p>` : ""}
        <h2>属性 <small>总点数 20</small></h2>
        <div class="attrs">${attrRows()}</div>
        <h2>天赋 <small>${data.getTalentEraName(setup.birthYear)}，选 3 个，点数 ${talentCost}/${talentBudget}</small></h2>
        <div class="talents">${setup.talentPool.map(talentCard).join("")}</div>
        ${startDisabled ? `<p class="hint">需要选满 3 个天赋，并且天赋点数不能超过 ${talentBudget}。天赋预算和成本会随出生年代变化。</p>` : ""}
        <div class="bottom-actions">
          <button data-action="refresh-talents">刷新天赋</button>
          <button class="primary" data-action="start" ${startDisabled ? "disabled" : ""}>开始这一生</button>
        </div>
      </section>
    </main>
  `);
}

function selectField(key, label, options) {
  return `
    <label class="field">
      <span>${label}</span>
      <select data-setup="${key}">
        ${options.map(([value, text]) => `<option value="${value}" ${String(setup[key]) === String(value) ? "selected" : ""}>${text}</option>`).join("")}
      </select>
    </label>
  `;
}

function provinceField(options) {
  return `
    <label class="field">
      <span>出生省份</span>
      <select data-province-history>
        ${options.map(([value, text]) => `<option value="${value}" ${setup.provinceHistoryCode === value ? "selected" : ""}>${text}</option>`).join("")}
      </select>
    </label>
  `;
}

function eraDerivedField(label, value) {
  return `
    <label class="field derived-field">
      <span>${label}</span>
      <div>${value}</div>
    </label>
  `;
}

function selectedProvinceHint(options) {
  const selected = options.find(([value]) => value === setup.provinceHistoryCode);
  const alias = data.historicalProvinceAliases.find((item) => item.code === setup.provinceHistoryCode);
  if (!selected || !alias?.note) return "";
  if (alias.weightedCurrentCodes?.length) {
    const weights = alias.weightedCurrentCodes
      .map((item) => `${labels.province[item.code] ?? item.code} ${item.weight}%`)
      .join(" / ");
    return `${selected[1]}是 ${setup.birthYear} 年的历史口径，开局时会按本局 Seed 落到 ${weights}；后续事件按落点后的当代地区计算。`;
  }
  if (alias.currentCode !== alias.code) {
    return `${selected[1]}是 ${setup.birthYear} 年的历史口径，后续事件按${labels.province[alias.currentCode] ?? alias.currentCode}计算。`;
  }
  return alias.note;
}

function yearOptions() {
  const years = [];
  for (let year = 1900; year <= 2020; year += 1) years.push([String(year), String(year)]);
  return years;
}

function attrRows() {
  const names = {
    physique: "体质",
    intelligence: "智力",
    charm: "魅力",
    family: "家境",
    luck: "运气",
    mental: "心态",
  };
  const left = 20 - Object.values(setup.attrs).reduce((sum, value) => sum + value, 0);
  return `
    <div class="point-left">剩余 ${left}</div>
    ${Object.entries(names).map(([key, label]) => `
      <label class="attr-row">
        <span>${label}</span>
        <input type="range" min="0" max="10" value="${setup.attrs[key]}" data-attr="${key}" />
        <b>${setup.attrs[key]}</b>
      </label>
    `).join("")}
  `;
}

function talentCard(talent) {
  const selected = setup.talents.includes(talent.id);
  const cost = data.getTalentCost(talent, setup.birthYear);
  const unmet = unmetTalentRequirements(talent);
  const costText = cost > 0 ? `消耗 ${cost}` : cost < 0 ? `返还 ${Math.abs(cost)}` : "免费";
  return `
    <button class="talent ${selected ? "selected" : ""} ${unmet.length ? "locked" : ""} ${talent.rarity}" data-talent="${talent.id}" ${unmet.length ? "disabled" : ""}>
      <b>${talent.name}</b>
      <span>${rarityLabel(talent.rarity)}</span>
      <small>${costText}</small>
      <p>${talent.description}</p>
      ${unmet.length ? `<em>${unmet.join("，")}</em>` : ""}
    </button>
  `;
}

function renderLife() {
  shell(`
    <main class="life">
      <section class="life-main">
        <div class="life-status">
          <strong>${state.meta.age} 岁</strong>
          <span>${state.meta.currentYear} 年 · ${stageLabel(state.meta.stage)} · ${provinceDisplayName(state)}</span>
          <button data-action="copy-seed">Seed ${state.meta.seed}</button>
        </div>
        ${mobileHud()}
        <div class="timeline">
          ${renderTimeline()}
        </div>
        <div class="advance-bar">
          ${state.meta.isAlive
            ? `<button class="primary" data-action="advance">下一年</button>`
            : `<button class="danger" data-action="report">查看报告</button>`}
        </div>
      </section>
      <aside class="panel stats">
        ${statsContent()}
      </aside>
    </main>
  `);
}

function statsContent() {
  return `
    <h2>状态</h2>
    ${statRows(state.resources)}
    <h2>标签</h2>
    <div class="tags">${state.tags.slice(0, 16).map((tag) => `<span>${tagLabel(tag)}</span>`).join("") || "<em>暂无</em>"}</div>
  `;
}

function mobileHud() {
  const priorityStats = ["health", "wealth", "happiness", "achievement"];
  return `
    <section class="mobile-hud" aria-label="状态摘要">
      <div class="hud-stats">${statRows(state.resources, priorityStats)}</div>
      <div class="hud-tags">${state.tags.slice(-4).map((tag) => `<span>${tagLabel(tag)}</span>`).join("") || "<em>暂无标签</em>"}</div>
    </section>
  `;
}

function renderTimeline() {
  if (!state.history.length) {
    return `<article class="year-block"><h2>档案已建立</h2><p>点击“下一年”，开始记录这一生。</p></article>`;
  }
  const groups = groupBy(state.history, (log) => `${log.age}|${log.year}`);
  return Object.entries(groups).map(([key, logs]) => {
    const [age, year] = key.split("|");
    return `
      <section class="year-block">
        <h2>${age} 岁 <span>${year} 年</span></h2>
        ${logs.map(eventCard).join("")}
      </section>
    `;
  }).join("");
}

function eventCard(log) {
  const mood = log.death ? "death" : log.effectsSummary.some((item) => item.includes("-")) ? "down" : "up";
  return `
    <article class="event ${mood}">
      <header><b>${log.title}</b><span>${categoryLabel(log.category)}</span></header>
      <p>${log.text}</p>
      ${log.resultText ? `<p class="result">${log.resultText}</p>` : ""}
      <div class="effects">${log.effectsSummary.map((item) => `<span>${formatEffectSummary(item)}</span>`).join("")}</div>
    </article>
  `;
}

function statRows(resources, keys) {
  const labels = {
    health: "健康",
    wealth: "财富",
    happiness: "幸福",
    achievement: "成就",
    reputation: "名声",
    freedom: "自由",
  };
  const entries = (keys ?? Object.keys(labels)).map((key) => [key, labels[key]]);
  return entries.map(([key, label]) => `
    <div class="stat"><span>${label}</span><i><b style="width:${resources[key]}%"></b></i><strong>${resources[key]}</strong></div>
  `).join("");
}

function renderChoice() {
  app.insertAdjacentHTML("beforeend", `
    <div class="modal-backdrop">
      <section class="modal">
        <p class="eyebrow">关键选择</p>
        <h2>${pendingChoice.title}</h2>
        <p>${pendingChoice.text}</p>
        <div class="choice-list">
          ${pendingChoice.choices.map((choice) => `<button data-choice="${choice.id}">${choice.text}</button>`).join("")}
        </div>
      </section>
    </div>
  `);
  document.querySelectorAll("[data-choice]").forEach((button) => button.addEventListener("click", () => {
    resolveChoice(pendingChoice, button.dataset.choice, state, context());
    pendingChoice = null;
    render();
    scrollToBottom();
  }));
}

function renderReport() {
  const summary = buildReport();
  shell(`
    <main class="report">
      <section class="panel report-hero">
        <p class="eyebrow">人生报告</p>
        <h1>${summary.title}</h1>
        <p>${summary.text}</p>
        <div class="actions">
          <button class="primary" data-action="new">再来一局</button>
          <button data-action="copy-report">复制摘要</button>
        </div>
      </section>
      <section class="panel report-grid">
        ${statRows(state.resources)}
      </section>
      <section class="panel report-timeline">
        <h2>关键时间线</h2>
        ${state.history.filter((log) => log.priority || log.choiceId || log.death || log.age % 10 === 0).slice(-16).map(eventCard).join("")}
      </section>
    </main>
  `);
}

function bindEvents() {
  document.querySelectorAll("[data-action]").forEach((button) => button.addEventListener("click", () => handleAction(button.dataset.action)));
  document.querySelectorAll("[data-setup]").forEach((input) => input.addEventListener("input", () => {
    const key = input.dataset.setup;
    setup[key] = key === "birthYear" ? Number(input.value) : input.value;
    if (["birthYear", "cityTier", "hukou"].includes(key)) syncEraSensitiveSetup();
    if (key === "birthYear") refreshTalents(true);
    render();
  }));
  document.querySelectorAll("[data-province-history]").forEach((input) => input.addEventListener("input", () => {
    const province = data.resolveHistoricalProvince(input.value, setup.birthYear);
    setup.provinceHistoryCode = province.code;
    setup.province = province.currentCode;
    render();
  }));
  document.querySelectorAll("[data-attr]").forEach((input) => input.addEventListener("input", () => {
    const key = input.dataset.attr;
    const old = setup.attrs[key];
    const next = Number(input.value);
    const usedWithout = Object.entries(setup.attrs).reduce((sum, [attr, value]) => sum + (attr === key ? 0 : value), 0);
    setup.attrs[key] = usedWithout + next > 20 && next > old ? old : next;
    pruneInvalidTalents();
    render();
  }));
  document.querySelectorAll("[data-talent]").forEach((button) => button.addEventListener("click", () => {
    const id = button.dataset.talent;
    const talent = data.talents.find((item) => item.id === id);
    if (talent && unmetTalentRequirements(talent).length) return;
    setup.talents = setup.talents.includes(id) ? setup.talents.filter((item) => item !== id) : setup.talents.length < 3 ? [...setup.talents, id] : setup.talents;
    render();
  }));
}

function handleAction(action) {
  if (action === "home") screen = "home";
  if (action === "setup") screen = "setup";
  if (action === "new") {
    setup = createDefaultSetup();
    rng = createRng(setup.seed);
    refreshTalents();
    screen = "setup";
  }
  if (action === "use-seed") {
    setup.seed = document.querySelector("#seedInput")?.value.trim() || setup.seed;
    rng = createRng(setup.seed);
  }
  if (action === "randomize-all") randomizeSetup();
  if (action === "random-start") {
    randomizeSetup();
    startLife({ readSeedInput: false });
  }
  if (action === "refresh-talents") refreshTalents(true);
  if (action === "start") startLife();
  if (action === "advance") {
    const result = advanceYear(state, data, context());
    pendingChoice = result.choiceEvent;
    render();
    if (!pendingChoice) scrollToBottom();
  }
  if (action === "report") screen = "report";
  if (action === "copy-seed") navigator.clipboard?.writeText(state.meta.seed);
  if (action === "copy-report") navigator.clipboard?.writeText(buildReport().text);
  render();
}

function startLife(options = {}) {
  const { readSeedInput = true } = options;
  if (!canStart()) return;
  if (readSeedInput) setup.seed = document.querySelector("#setupSeed")?.value.trim() || setup.seed;
  rng = createRng(setup.seed);
  state = createInitialState(setup, data, context());
  pendingChoice = null;
  screen = "life";
  const result = advanceYear(state, data, context());
  pendingChoice = result.choiceEvent;
}

function randomizeSetup() {
  setup.seed = randomSeed();
  rng = createRng(setup.seed);
  setup.birthYear = 1900 + Math.floor(rng() * 121);
  const province = data.resolveHistoricalProvince(pick(data.getProvinceOptionsForYear(setup.birthYear).map(([code]) => code), rng), setup.birthYear);
  setup.provinceHistoryCode = province.code;
  setup.province = province.currentCode;
  setup.cityTier = pick(data.getCityTierOptionsForYear(setup.birthYear).map(([code]) => code), rng);
  const hukouOptions = data.getHukouOptionsForYear(setup.birthYear);
  setup.hukou = hukouOptions.length ? pick(hukouOptions.map(([code]) => code), rng) : data.getEffectiveHukou(setup.birthYear, setup.cityTier, setup.hukou);
  setup.familyClass = pick(data.getFamilyClassOptionsForContext(setup.birthYear, setup.cityTier, setup.hukou).map(([code]) => code), rng);
  setup.attrs = randomAttrs();
  refreshTalents(true);
  setup.talents = chooseRandomValidTalents(setup.talentPool);
}

function syncEraSensitiveSetup() {
  const province = data.resolveHistoricalProvince(setup.provinceHistoryCode, setup.birthYear);
  setup.provinceHistoryCode = province.code;
  setup.province = province.currentCode;
  if (!data.getCityTierOptionsForYear(setup.birthYear).some(([code]) => code === setup.cityTier)) {
    setup.cityTier = data.getCityTierOptionsForYear(setup.birthYear)[0][0];
  }
  const hukouOptions = data.getHukouOptionsForYear(setup.birthYear);
  if (hukouOptions.length) {
    if (!hukouOptions.some(([code]) => code === setup.hukou)) setup.hukou = hukouOptions[0][0];
  } else {
    setup.hukou = data.getEffectiveHukou(setup.birthYear, setup.cityTier, setup.hukou);
  }
  const familyOptions = data.getFamilyClassOptionsForContext(setup.birthYear, setup.cityTier, setup.hukou);
  if (!familyOptions.some(([code]) => code === setup.familyClass)) {
    setup.familyClass = familyOptions[0][0];
  }
}

function selectedTalentCost(ids = setup.talents) {
  return ids.reduce((sum, id) => {
    const talent = data.talents.find((item) => item.id === id);
    return sum + (talent ? data.getTalentCost(talent, setup.birthYear) : 0);
  }, 0);
}

function canStart() {
  return setup.talents.length === 3 && selectedTalentCost() <= getTalentBudget();
}

function getTalentBudget() {
  return data.getTalentBudgetForYear(setup.birthYear);
}

function chooseRandomValidTalents(pool) {
  const valid = [];
  const eligiblePool = pool.filter((talent) => !unmetTalentRequirements(talent).length);
  for (let a = 0; a < eligiblePool.length; a += 1) {
    for (let b = a + 1; b < eligiblePool.length; b += 1) {
      for (let c = b + 1; c < eligiblePool.length; c += 1) {
        const ids = [eligiblePool[a].id, eligiblePool[b].id, eligiblePool[c].id];
        if (selectedTalentCost(ids) <= getTalentBudget()) valid.push(ids);
      }
    }
  }
  return valid.length ? pick(valid, rng) : eligiblePool.slice(0, 3).map((talent) => talent.id);
}

function unmetTalentRequirements(talent) {
  const requiredAttrs = talent.requirements?.attrs ?? {};
  return Object.entries(requiredAttrs)
    .filter(([attr, value]) => setup.attrs[attr] < value)
    .map(([attr, value]) => `需要${attrLabel(attr)} ${value}`);
}

function pruneInvalidTalents() {
  setup.talents = setup.talents.filter((id) => {
    const talent = data.talents.find((item) => item.id === id);
    return talent && !unmetTalentRequirements(talent).length;
  });
}

function attrLabel(attr) {
  return {
    physique: "体质",
    intelligence: "智力",
    charm: "魅力",
    family: "家境",
    luck: "运气",
    mental: "心态",
  }[attr] ?? attr;
}

function randomAttrs() {
  const attrs = { physique: 0, intelligence: 0, charm: 0, family: 0, luck: 0, mental: 0 };
  const keys = Object.keys(attrs);
  for (let i = 0; i < 20; i += 1) {
    const available = keys.filter((key) => attrs[key] < 10);
    attrs[pick(available, rng)] += 1;
  }
  return attrs;
}

function refreshTalents(clear = false) {
  const pool = [...data.getTalentsForYear(data.talents, setup.birthYear)];
  setup.talentPool = [];
  while (setup.talentPool.length < 10 && pool.length) {
    const index = Math.floor(rng() * pool.length);
    setup.talentPool.push(pool.splice(index, 1)[0]);
  }
  if (clear) setup.talents = [];
}

function buildReport() {
  const title = state.meta.age <= 0 ? "刚开始就结束的一生" : state.resources.happiness >= 70 ? "还算幸福的一生" : state.resources.achievement >= 70 ? "有点传奇的一生" : `享年 ${state.meta.age} 岁`;
  const reason = state.meta.deathReason || "人生暂告一段落";
  return {
    title,
    text: `你出生于 ${state.birth.year} 年的${state.birth.provinceNameAtBirth || labels.province[state.birth.province]}，最终因“${reason}”结束。财富 ${state.resources.wealth}，幸福 ${state.resources.happiness}，成就 ${state.resources.achievement}。Seed: ${state.meta.seed}`,
  };
}

function scrollToBottom() {
  requestAnimationFrame(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }));
}

function groupBy(items, getKey) {
  return items.reduce((result, item) => {
    const key = getKey(item);
    result[key] ??= [];
    result[key].push(item);
    return result;
  }, {});
}

function rarityLabel(rarity) {
  return rarity === "epic" ? "史诗" : rarity === "rare" ? "稀有" : "普通";
}

function tagLabel(tag) {
  return labels.tag[tag] ?? tag;
}

function formatEffectSummary(item) {
  if (item.startsWith("获得 ")) return `获得 ${tagLabel(item.slice(3))}`;
  if (item.startsWith("失去 ")) return `失去 ${tagLabel(item.slice(3))}`;
  return item;
}

function stageLabel(stage) {
  return {
    baby: "婴幼儿",
    child: "幼年",
    student: "学生",
    young_adult: "青年",
    middle_age: "中年",
    old_age: "老年",
  }[stage] ?? "未知";
}

function categoryLabel(category) {
  return {
    birth: "出生",
    family: "家庭",
    school: "学校",
    career: "职业",
    health: "健康",
    relationship: "关系",
    wealth: "财富",
    migration: "迁移",
    random: "日常",
    ending: "结局",
  }[category] ?? category;
}

function provinceDisplayName(lifeState) {
  return data.getProvinceDisplayName(
    lifeState.location.currentProvince,
    lifeState.location.currentProvinceHistoryCode,
    lifeState.meta.currentYear,
  );
}

refreshTalents();
render();
