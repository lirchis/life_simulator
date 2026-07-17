// Early mortality is separated by era so a modern child does not inherit the
// risk profile of a child born before antibiotics and broad public-health care.
// Rates are deliberately conservative literary calibration, not a life table.

const vulnerabilityModifiers = [
  { path: "resources.health", lte: 38, multiply: 1.45 },
  { path: "attrs.physique", lte: 2, multiply: 1.3 },
  { path: "environment.healthcareAccess", lte: 2, multiply: 1.25 },
];

function earlyEnding({ id, title, yearRange, ageRange, probability, text, reason, endingId, priority }) {
  return {
    id,
    title,
    category: "ending",
    yearRange,
    ageRange,
    priority,
    maxOccurrences: 1,
    baseWeight: 100,
    triggerProbability: probability,
    probabilityModifiers: vulnerabilityModifiers,
    text,
    effects: [
      { die: reason },
      { triggerEnding: endingId },
    ],
  };
}

export const earlyMortalityEvents = [
  earlyEnding({
    id: "life_newborn_death_pre1949",
    title: "没等到天亮",
    yearRange: [1840, 1949],
    ageRange: [0, 0],
    probability: 0.09,
    priority: 91,
    reason: "新生儿夭折",
    endingId: "newborn_death_pre1949",
    text: "你只在这个世界短暂停了一会儿。大人守到窗纸发白，哭声却先轻了下去；后来家里很少提起，旧包被仍被收了许多年。",
  }),
  earlyEnding({
    id: "life_newborn_death_early_prc",
    title: "襁褓空了下来",
    yearRange: [1950, 1977],
    ageRange: [0, 0],
    probability: 0.05,
    priority: 91,
    reason: "新生儿疾病",
    endingId: "newborn_death_early_prc",
    text: "你出生不久便病得很重。能找到的药和办法都试过，襁褓还是空了下来；大人把没用完的小布片塞进箱底，谁也不肯先丢。",
  }),
  earlyEnding({
    id: "life_newborn_death_reform_era",
    title: "短短的襁褓",
    yearRange: [1978, 1999],
    ageRange: [0, 0],
    probability: 0.018,
    priority: 91,
    reason: "新生儿疾病",
    endingId: "newborn_death_reform_era",
    text: "病来得太早，医院也没能把你留下。家人带回一只空包被，手续上的几行字很短，真正难熬的部分没有表格可填。",
  }),
  earlyEnding({
    id: "life_newborn_death_modern",
    title: "短暂停留",
    yearRange: [2000, 2035],
    ageRange: [0, 0],
    probability: 0.006,
    priority: 91,
    reason: "新生儿重症",
    endingId: "newborn_death_modern",
    text: "监护仪、药物和守在门外的人都尽了力，你仍只在世上短暂停留。后来家人记得最久的，是那几天里每一次门被推开的声音。",
  }),

  earlyEnding({
    id: "life_childhood_illness_death_pre1949",
    title: "小床安静下来",
    yearRange: [1840, 1949],
    ageRange: [1, 5],
    probability: 0.025,
    priority: 89,
    reason: "幼年急病",
    endingId: "childhood_illness_pre1949",
    text: [
      {
        conditions: { all: [{ path: "location.currentCityTier", in: ["village", "town"] }] },
        text: "高热和腹泻反复几日，能请到的人、能熬的汤药都没有把你留下。院里仍有鸡鸣和劈柴声，小床却从此安静。",
      },
      {
        text: "一场急病很快耗尽了小小的身体。药铺、郎中和家人的守夜都赶不上病势，屋里后来少摆了一只碗。",
      },
    ],
  }),
  earlyEnding({
    id: "life_childhood_illness_death_early_prc",
    title: "高烧没有退",
    yearRange: [1950, 1977],
    ageRange: [1, 5],
    probability: 0.012,
    priority: 89,
    reason: "幼年感染",
    endingId: "childhood_illness_early_prc",
    text: [
      {
        conditions: { all: [{ path: "location.currentCityTier", in: ["village", "town"] }] },
        text: "卫生员赶来时，高烧已经拖了几天。药箱不大，路又很长；大人轮流抱着你，最后只把一件小衣服留了下来。",
      },
      {
        text: "高烧一阵阵反复，家人抱着你在诊室和住处之间奔忙。那时能用的办法仍有限，小床最终空了下来。",
      },
    ],
  }),
  earlyEnding({
    id: "life_childhood_illness_death_reform_era",
    title: "病来得太急",
    yearRange: [1978, 1999],
    ageRange: [1, 5],
    probability: 0.004,
    priority: 89,
    reason: "幼年急病",
    endingId: "childhood_illness_reform_era",
    text: "病来得太急，车、医院和一夜未熄的灯都没能追上。家人后来很少把话说完，只说那一年冬天特别长。",
  }),
  earlyEnding({
    id: "life_childhood_illness_death_modern",
    title: "没有等到康复",
    yearRange: [2000, 2035],
    ageRange: [1, 5],
    probability: 0.0008,
    priority: 89,
    reason: "幼年重症",
    endingId: "childhood_illness_modern",
    text: "这是一场极少见却凶险的重症。医护、设备和家人的守候没有换来康复；病历写得很完整，一家人的失去仍无从归档。",
  }),
];
