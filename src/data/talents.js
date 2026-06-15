export const talents = [
  {
    id: "early_wisdom",
    name: "早慧",
    rarity: "rare",
    cost: 1,
    description: "从小理解得更快，但容易想太多。",
    effects: [{ path: "attrs.intelligence", add: 2 }, { path: "attrs.mental", add: -1 }],
    tags: ["smart_child"],
  },
  {
    id: "strong_luck",
    name: "强运",
    rarity: "epic",
    cost: 3,
    eraCosts: [{ yearRange: [1900, 1948], cost: 4 }],
    description: "离谱的好事更容易发生。",
    effects: [{ path: "attrs.luck", add: 3 }],
  },
  {
    id: "weak_body",
    name: "体弱",
    rarity: "common",
    cost: -1,
    description: "小时候总是小病不断。",
    effects: [{ path: "attrs.physique", add: -2 }, { path: "resources.health", add: -12 }],
  },
  {
    id: "social_star",
    name: "社交达人",
    rarity: "rare",
    cost: 2,
    eraCosts: [{ yearRange: [1900, 1948], cost: 1 }],
    description: "人群里你总能找到位置。",
    effects: [{ path: "attrs.charm", add: 2 }, { path: "relationships.friendship", add: 12 }],
  },
  {
    id: "roll_king",
    name: "卷王",
    rarity: "rare",
    cost: 1,
    availableYearRange: [1978, 2020],
    requirements: { attrs: { mental: 5 } },
    description: "你很能拼，也很难停下。",
    effects: [{ path: "resources.achievement", add: 8 }, { path: "resources.happiness", add: -8 }],
    tags: ["ambitious"],
  },
  {
    id: "rich_second",
    name: "家里有矿",
    rarity: "epic",
    cost: 3,
    eraCosts: [
      { yearRange: [1900, 1948], cost: 4 },
      { yearRange: [1949, 1977], cost: 5 },
    ],
    description: "不是比喻，至少在亲戚嘴里不是。",
    effects: [{ path: "attrs.family", add: 3 }, { path: "resources.wealth", add: 18 }],
  },
  {
    id: "exam_machine",
    name: "考试机器",
    rarity: "rare",
    cost: 1,
    availableYearRange: [1977, 2020],
    requirements: { attrs: { intelligence: 6 } },
    description: "只要是考试，你就比平时更像个人。",
    effects: [{ path: "attrs.intelligence", add: 1 }],
    tags: ["exam_machine", "exam_aptitude"],
  },
  {
    id: "keju_seed",
    name: "科举苗子",
    rarity: "rare",
    cost: 1,
    availableYearRange: [1900, 1905],
    requirements: { attrs: { intelligence: 6, family: 3 } },
    description: "旧式功课、背诵和试帖诗，你都比同龄人更早摸到门道。",
    effects: [{ path: "attrs.intelligence", add: 1 }, { path: "resources.achievement", add: 5 }],
    tags: ["keju_seed", "exam_aptitude"],
  },
  {
    id: "old_learning",
    name: "旧学根底",
    rarity: "rare",
    cost: 1,
    availableYearRange: [1900, 1948],
    requirements: { attrs: { intelligence: 5, family: 3 } },
    description: "家里有人识字，你很早接触旧书和账本。",
    effects: [{ path: "attrs.intelligence", add: 1 }, { path: "resources.achievement", add: 4 }],
    tags: ["old_learning", "exam_aptitude"],
  },
  {
    id: "glass_heart",
    name: "玻璃心",
    rarity: "common",
    cost: -1,
    description: "世界轻轻敲你一下，你会响很久。",
    effects: [{ path: "attrs.mental", add: -2 }],
  },
  {
    id: "business_smell",
    name: "生意嗅觉",
    rarity: "rare",
    cost: 1,
    eraCosts: [{ yearRange: [1900, 1948], cost: 0 }],
    requirements: { attrs: { luck: 3 } },
    description: "别人看到热闹，你看到现金流。",
    effects: [{ path: "resources.wealth", add: 6 }],
    tags: ["business_mind"],
  },
  {
    id: "game_master",
    name: "游戏高手",
    rarity: "rare",
    cost: 1,
    availableYearRange: [1990, 2020],
    requirements: { attrs: { intelligence: 4, mental: 4 } },
    description: "你很擅长在规则、反馈和操作之间找节奏。",
    effects: [{ path: "attrs.intelligence", add: 1 }, { path: "relationships.friendship", add: 6 }],
    tags: ["game_master"],
  },
  {
    id: "sensitive_artist",
    name: "敏感艺术家",
    rarity: "rare",
    cost: 1,
    requirements: { attrs: { charm: 4 } },
    description: "痛苦和灵感经常一起到来。",
    effects: [{ path: "attrs.charm", add: 1 }, { path: "resources.achievement", add: 5 }, { path: "attrs.mental", add: -1 }],
    tags: ["artistic"],
  },
  {
    id: "queue_magic",
    name: "排队玄学",
    rarity: "common",
    cost: 0,
    description: "你总能排到最短的队，但人生不是队伍。",
    effects: [{ path: "attrs.luck", add: 1 }],
  },
  {
    id: "stubborn",
    name: "认死理",
    rarity: "common",
    cost: 0,
    description: "你很难被说服，也很难被打倒。",
    effects: [{ path: "attrs.mental", add: 1 }, { path: "attrs.charm", add: -1 }],
  },
];

export const talentBudgetEras = [
  { yearRange: [1900, 1948], budget: 2, name: "乱世开局" },
  { yearRange: [1949, 1977], budget: 2, name: "集体年代" },
  { yearRange: [1978, 1999], budget: 3, name: "转轨年代" },
  { yearRange: [2000, 2020], budget: 4, name: "流动年代" },
];

export function getTalentBudgetForYear(year) {
  return talentBudgetEras.find((era) => inYearRange(year, era.yearRange))?.budget ?? 3;
}

export function getTalentEraName(year) {
  return talentBudgetEras.find((era) => inYearRange(year, era.yearRange))?.name ?? "普通年代";
}

export function getTalentCost(talent, year) {
  const eraCost = talent.eraCosts?.find((item) => inYearRange(year, item.yearRange));
  return eraCost?.cost ?? talent.cost ?? 0;
}

export function getTalentsForYear(source, year) {
  return source.filter((talent) => isTalentAvailable(talent, year));
}

function isTalentAvailable(talent, year) {
  if (talent.availableYearRange && !inYearRange(year, talent.availableYearRange)) return false;
  if (talent.unavailableYearRanges?.some((range) => inYearRange(year, range))) return false;
  return true;
}

function inYearRange(year, range) {
  return year >= range[0] && year <= range[1];
}
