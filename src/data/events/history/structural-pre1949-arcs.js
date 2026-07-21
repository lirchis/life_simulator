// Long structural arcs for ordinary lives before 1949.
//
// These chains are deliberately anchored in states the engine already
// produces: farm work, apprenticeships, manual and factory work, migration,
// basic literacy and remembered taxation or displacement.  They never promote
// the protagonist into an official, teacher, foreman or organizer merely to
// make a plot happen.  Openings are uncommon; once a chain begins its authored
// continuation is scheduled and receives a high narrative weight.

const ALL_PLACES = ["village", "town", "county", "city", "tier2", "tier1"];
const RURAL = ["village", "town"];
const URBAN = ["town", "county", "city", "tier2", "tier1"];
const LARGE_URBAN = ["county", "city", "tier2", "tier1"];
const ACTIVE = ["employed", "self_employed", "family_labor"];
const WARTIME_RELOCATION_PROVINCES = [
  "beijing", "tianjin", "hebei", "shanxi", "liaoning", "jilin", "heilongjiang",
  "shanghai", "jiangsu", "zhejiang", "anhui", "fujian", "jiangxi", "shandong",
  "henan", "hubei", "hunan", "guangdong", "guangxi", "hainan", "sichuan",
  "chongqing", "guizhou", "yunnan", "shaanxi", "gansu",
];

const add = (path, value) => ({ path, add: value });
const C = (path, operator, value) => ({ path, [operator]: value });
const between = (eventId, minYears, maxYears) => ({
  eventOccurredBetween: { eventId, minYears, maxYears },
});
const variant = (conditions, copy) => ({ conditions, text: copy });
const fallback = (copy) => ({ text: copy });

const female = { all: [C("birth.gender", "eq", "female")] };
const ruralNow = { all: [C("location.currentCityTier", "in", RURAL)] };
const urbanNow = { all: [C("location.currentCityTier", "in", LARGE_URBAN)] };
const migrated = { all: [C("location.migratedTimes", "gte", 1)] };
const lowReserve = { all: [C("resources.wealth", "lte", 38)] };
const stableHouse = { all: [C("resources.wealth", "gte", 62)] };
const literate = { all: [C("education.score", "gte", 42)] };
const older = { all: [C("meta.age", "gte", 48)] };
const elder = { all: [C("meta.age", "gte", 60)] };
const youngerFemale = { all: [C("birth.gender", "eq", "female"), C("meta.age", "lt", 60)] };
const youngerMale = { all: [C("birth.gender", "eq", "male"), C("meta.age", "lt", 60)] };
const worker = {
  all: [
    C("career.status", "in", ACTIVE),
    C("career.field", "in", [
      "apprentice", "manual_worker", "factory", "silk_mill_worker",
      "arsenal_worker", "mine_worker", "rickshaw_puller", "wartime_factory",
    ]),
  ],
};
const inactive = { all: [C("career.status", "in", ["none", "unemployed", "laid_off", "retired"])] };
const workingFemale = { all: [C("birth.gender", "eq", "female"), C("career.status", "in", ACTIVE)] };

function joinConditions(required, extra = {}) {
  return {
    all: [...required, ...(extra.all ?? [])],
    ...(extra.any ? { any: extra.any } : {}),
    ...(extra.none ? { none: extra.none } : {}),
  };
}

function structuralArc(key, config) {
  const stages = ["opening", "turn", "after"];
  const ids = stages.map((stage) => `struct_pre49_${key}_${stage}`);
  const stageTags = stages.map((stage) => `struct_pre49_${key}_${stage}`);

  return config.steps.map((step, index) => {
    const required = index === 0
      ? (config.allowExistingEraArc ? [] : [{ missingTag: `struct_pre49_${config.era}_arc` }])
      : [
          between(ids[index - 1], step.minYears, step.maxYears),
          { hasTag: stageTags[index - 1] },
        ];
    const elapsedMin = config.steps.slice(1, index + 1)
      .reduce((sum, item) => sum + item.minYears, 0);
    const elapsedMax = config.steps.slice(1, index + 1)
      .reduce((sum, item) => sum + item.maxYears, 0);
    const yearRange = step.yearRange ?? (index === 0
      ? config.yearRange
      : [
          config.yearRange[0] + elapsedMin,
          Math.min(config.eraEnd, config.yearRange[1] + elapsedMax),
        ]);
    const ageRange = step.ageRange ?? (index === 0
      ? config.ageRange
      : [
          config.ageRange[0] + elapsedMin,
          Math.min(110, config.ageRange[1] + elapsedMax),
        ]);
    const next = config.steps[index + 1];
    const scheduled = next
      ? [{
          scheduleEvent: {
            eventId: ids[index + 1],
            delayYears: [next.minYears, next.maxYears],
            weightMultiplier: 12,
          },
        }]
      : [];

    return {
      id: ids[index],
      title: step.title,
      category: step.category ?? config.category,
      yearRange,
      ageRange,
      ...(index === 0 && config.currentRegions ? { currentRegions: config.currentRegions } : {}),
      ...(step.currentRegions ? { currentRegions: step.currentRegions } : {}),
      conditions: joinConditions(required, index === 0 ? config.conditions : step.conditions),
      ...(index > 0 ? { requiresEvents: [ids[index - 1]] } : {}),
      maxOccurrences: 1,
      baseWeight: index === 0 ? 28 : index === 1 ? 88 : 112,
      ...(index === 0 ? { lifetimeProbability: config.lifetimeProbability ?? 0.11 } : {}),
      narrativeTier: index === 0 ? "turning_point" : "consequence",
      narrativeDomain: `structural_pre49_${key}`,
      narrativeThread: index === 2
        ? { close: true }
        : { expiresAfterYears: next.maxYears },
      text: step.text,
      effects: [
        ...(step.effects ?? []),
        ...scheduled,
        { addTag: `struct_pre49_${config.era}_arc` },
        { addTag: `struct_pre49_${key}` },
        { addTag: stageTags[index] },
      ],
    };
  });
}

const riverRoad = structuralArc("river_road", {
  era: "qing",
  eraEnd: 1911,
  yearRange: [1851, 1893],
  ageRange: [15, 56],
  category: "career",
  lifetimeProbability: 0.12,
  currentRegions: {
    provinces: [
      "hebei", "tianjin", "shandong", "henan", "anhui", "jiangsu",
      "hubei", "hunan", "jiangxi", "zhejiang", "sichuan", "guangdong", "guangxi",
    ],
    cityTiers: ALL_PLACES,
  },
  conditions: {
    any: [
      C("career.field", "in", ["farm_work", "manual_worker", "apprentice", "mine_worker"]),
      C("career.status", "eq", "family_labor"),
      { hasTag: "late_qing_levy_memory" },
    ],
  },
  steps: [
    {
      title: "堤脚下的一季土",
      text: [
        variant(female, "河水涨前，家里要出人护堤。你跟着送饭、拣草袋，也同众人一篮篮添土；名册上多半写的是家中男人，泥却认得每双鞋。"),
        variant(worker, "你随一队短工到河边抬石夯土。工钱按日算，雨天不算，河水倒从不因下雨歇工。"),
        variant(lowReserve, "家中正缺现钱，你去堤上做一季河工。午饭是一碗稀粥，碗很轻，扁担没有跟着客气。"),
        variant(urbanNow, "城里临时招人去江堤抬石、装土，你跟着一队短工出了城。街面离田亩很远，水涨起来时，两边仍要靠同一道堤。"),
        fallback("村里按户出人修堤，你在河边做了一阵搬土、打桩的活。众人谈的是保住下游田亩，手上先保住的是别磨破的那层皮。"),
      ],
      effects: [add("resources.wealth", 2), add("resources.health", -3), add("relationships.friendship", 2)],
    },
    {
      title: "回程过了厘卡",
      minYears: 2,
      maxYears: 7,
      text: [
        variant(migrated, "你挑着行李沿水路回去，过卡时又被翻看一遍。凭票和口音都要解释，走过的路越多，身上的来历反而越要从头说。"),
        variant(worker, "你替人押一担货回乡，厘卡上的人掀开草席逐件估量。货主把额外花费记进账，挑担人的肩膀仍只按原价结算。"),
        variant(lowReserve, "过卡要再缴一点钱，你同脚夫们凑了半天。每个人少吃一顿，账目便显得整齐；卡房不问这顿饭原来在哪里。"),
        fallback("河工散后，你随船走了一段，途中在厘卡前等了半日。关卡只占路边一间屋，却能让一船人的时辰都停下来。"),
      ],
      effects: [add("resources.wealth", -2), add("resources.freedom", -1), add("relationships.friendship", 1)],
    },
    {
      title: "旧路换了走法",
      minYears: 4,
      maxYears: 11,
      text: [
        variant(older, "多年后你再经过那段河路，旧堤添了新土，卡房也换过人。大家仍说今年规矩不同；这句话年年不同，倒成了最稳定的规矩。"),
        variant(ruralNow, "新开的水路抢去一部分脚力生意，村里有人改去码头，有人仍守着旧渡口。你发现道路不是一条线，而是一群人饭碗挪动的方向。"),
        variant(migrated, "你后来绕开旧卡走过别的路，路费少了，投宿却多一夜。省下的钱和多吃的饭互相抵消，只有脚底确信自己算过这笔账。"),
        fallback("河道、渡口和卡房陆续变过，你也换过几种走法。那一季河工没有成为传奇，只使你往后看见地图上的一条线时，先想到沿线要吃饭的人。"),
      ],
      effects: [add("resources.reputation", 1), add("attrs.intelligence", 1), add("resources.happiness", -1)],
    },
  ],
});

const militiaRegister = structuralArc("militia_register", {
  era: "qing",
  eraEnd: 1911,
  yearRange: [1840, 1902],
  ageRange: [16, 70],
  category: "family",
  lifetimeProbability: 0.1,
  currentRegions: { cityTiers: ["village", "town", "county"] },
  conditions: {
    any: [
      C("career.field", "in", ["farm_work", "manual_worker", "apprentice"]),
      C("career.status", "eq", "family_labor"),
      { hasTag: "clan_mediation_memory" },
      { hasTag: "late_qing_displacement" },
    ],
  },
  steps: [
    {
      title: "一户报一个名字",
      text: [
        variant(youngerFemale, "地方不安，里中重新编户点人。家里报上一个男人的名字，你同女眷备干粮、补衣，也记住哪一声梆子表示要关门。"),
        variant(youngerMale, "团练来村中点人，你的名字同邻里几人写在一张纸上。练枪未必轮得到，先学会的是夜里听见狗叫便披衣出门。"),
        variant({ all: [C("resources.wealth", "lte", 38), C("meta.age", "lt", 60)] }, "家中拿不出替役的钱，只得按名轮守。你白天照做原来的活，夜里再守一更；贫富没有写进梆子声，困意却听得出来。"),
        variant(elder, "里中点户时，家里报了晚辈的名字，也请你辨认旧户册和几处亲族住址。老人没有被推去逞强，只是村里遇事仍少不了问一句从前怎样。"),
        fallback("保甲重新造册，十来户彼此作保。纸上只是几行名字，落到日常里，便是谁家来了生人、谁夜里不在，都有人留意。"),
      ],
      effects: [add("resources.freedom", -2), add("resources.health", -1), add("relationships.friendship", 2)],
    },
    {
      title: "夜巡走过各家门",
      minYears: 2,
      maxYears: 3,
      text: [
        variant(youngerFemale, "夜巡的人从门外走过，你在屋里辨认脚步，把灯芯压低。男人守村，女人守门内的老人孩子；两边都不算睡觉。"),
        variant(youngerMale, "轮到你夜巡，几个人提灯沿村走一圈。大家谈得很勇，遇见草丛响动时却先推举最年轻的去看。"),
        variant(elder, "夜巡改由年轻人轮值，你把热水留在灶边，也替他们记下谁哪一更回来。年长免去脚程，没有免去整夜听门响。"),
        variant(stableHouse, "你家能腾出一间屋给巡守的人歇脚，久而久之，消息也先在这间屋里停一停。便利没有官印，却慢慢长出分量。"),
        fallback("村口添了更棚，夜里轮流有人值守。它确实挡住过小偷，也让不合群的人经过时多受几道目光。"),
      ],
      effects: [add("resources.health", -2), add("relationships.friendship", 2), add("resources.freedom", -1)],
    },
    {
      title: "名册旧了，眼睛还在",
      minYears: 3,
      maxYears: 6,
      text: [
        variant(migrated, "你离乡后再回来，旧保册已卷了边，村人仍能细数你在外几年、同谁回乡。名册会旧，邻里的记性不领工钱。"),
        variant(female, "后来点名渐少，家中女眷仍保留听梆子收衣关门的习惯。战乱退远以后，身体比告示更晚知道可以松一口气。"),
        variant(older, "多年后更棚拆去做了柴，曾一同夜巡的人见面还会谈起旧事。有人记得抓过贼，有人只记得哪家煮的夜粥稠些。"),
        fallback("团练与保甲换过名目，那几年留下的并不全是安全。村人更熟悉彼此，也更习惯彼此盘问；两件事常共用一双眼睛。"),
      ],
      effects: [add("resources.freedom", 1), add("relationships.friendship", 1), add("resources.happiness", -1)],
    },
  ],
});

const famineMigration = structuralArc("famine_migration", {
  era: "qing",
  eraEnd: 1911,
  yearRange: [1855, 1902],
  ageRange: [10, 75],
  category: "migration",
  lifetimeProbability: 0.12,
  currentRegions: { cityTiers: ALL_PLACES },
  conditions: {
    any: [
      { eventOccurredWithin: { eventId: "era_late_qing_great_famine", years: 3 } },
      { eventOccurredWithin: { eventId: "era_late_qing_taiping_displacement", years: 4 } },
    ],
  },
  steps: [
    {
      title: "锅底见了很久",
      text: [
        variant(ruralNow, "兵火、河患或歉收使田里的收成接不上，家里把种子、口粮和路费分成三堆，分来分去都不够。最后先带能走的人出门，田和门都托亲族照看。"),
        variant(female, "缺粮后，家里决定分头投亲。你把针线和一口小锅包进布里，男人谈路程，你同女眷先数同行孩子的鞋还能走几日。"),
        variant(lowReserve, "家中能卖的东西越来越轻，最后连空屋也守不住。你们沿着有粥棚和亲族消息的方向走，所谓方向，常只是前一拨人回来时指的一下。"),
        fallback("一场灾荒把日子从原来的住处推上路。你们没有宏大的去处，只知道下一处集镇也许有粮，也许至少有人知道哪里有粮。"),
      ],
      effects: [add("location.migratedTimes", 1), add("resources.wealth", -5), add("resources.health", -3), add("relationships.family", 2)],
    },
    {
      title: "借住的屋檐不算家",
      minYears: 2,
      maxYears: 3,
      text: [
        variant(migrated, "你们在亲族或同乡处借住，铺盖白日卷起，夜里再铺开。主人没有赶人，碗筷的声响却每天提醒屋里多了几张嘴。"),
        variant(female, "你靠洗衣、缝补和照看孩子换些吃食。别人称这是帮忙，只有手指裂口知道帮忙也有工时。"),
        variant(worker, "你在集镇接零活，早晨同一群人等着被挑。挑中的那天有饭，没挑中的那天，大家仍会互相评论谁站得最像有力气。"),
        fallback("一家人在异地把日子接起来：有人找活，有人排粥，有人看住行李。最小的孩子很快学会哪家门前的狗只叫、不咬。"),
      ],
      effects: [add("resources.wealth", 2), add("resources.health", -2), add("relationships.friendship", 2), add("resources.freedom", -1)],
    },
    {
      title: "回去的人和留下的人",
      minYears: 3,
      maxYears: 6,
      text: [
        variant(ruralNow, "年景转好后，你们回到原处，旧田还在，界石却要重新辨认。邻人帮着指认，也顺便说清这些年谁替谁做过什么。"),
        variant(urbanNow, "家里有人回乡，你留在落脚的城镇继续做活。寄回去的钱不多，信里却总把饭写得很足，免得老人跟着饿第二遍。"),
        variant(older, "多年后家中仍把亲族分成灾前住处和灾后住处两支。晚辈问故乡是哪一处，大人答得很快，收拾行李时却总从两边拿东西。"),
        fallback("有人回乡，有人留下，也有人在两处之间走了许多年。灾年并未给一家人安排统一结局，只把‘回去’这个词变得比路程更长。"),
      ],
      effects: [add("resources.wealth", 1), add("relationships.family", 1), add("resources.reputation", 1)],
    },
  ],
});

const mineMachine = structuralArc("mine_machine", {
  era: "qing",
  eraEnd: 1911,
  yearRange: [1865, 1895],
  ageRange: [15, 55],
  category: "career",
  lifetimeProbability: 0.12,
  currentRegions: { cityTiers: ALL_PLACES },
  conditions: {
    all: [C("career.status", "in", ACTIVE)],
    any: [
      C("career.field", "in", ["apprentice", "manual_worker", "mine_worker", "arsenal_worker", "factory"]),
    ],
  },
  steps: [
    {
      title: "机器先响起来",
      text: [
        variant({ all: [C("career.field", "eq", "mine_worker")] }, "矿上换了新的提运器具，开动时整片木架都在响。你仍要下井、推车、听岩层动静；机器省下的力气，未必正好省在你身上。"),
        variant({ all: [C("career.field", "eq", "arsenal_worker")] }, "厂里添了机器，老师傅先让你站远看，再教你摸哪处轴承会发热。铁件做得更快，人的手也得更快学会别放错地方。"),
        variant({ all: [C("career.field", "eq", "apprentice")] }, "你跟师傅去看一架新机器，许多旧手艺忽然被分成喂料、看轮、收件几道活。师傅说机器笨，只是它一天笨得比人久。"),
        fallback("作坊或矿路添了机器，你从搬料、擦油和听响声做起。没人先讲大道理，最早的课程是衣角不要靠近转轮。"),
      ],
      effects: [add("career.level", 2), add("resources.health", -2), add("education.score", 1), add("resources.achievement", 1)],
    },
    {
      title: "钟点和旧手艺",
      minYears: 2,
      maxYears: 5,
      text: [
        variant(inactive, "你离开原来的活以后，机器声仍常在安静时回到耳边。旧同伴说起换班和故障，你先问人有没有受伤，再问机器停了多久。"),
        variant(worker, "做活的时辰被铃声和交班分得更细。你学会在响铃前收好工具，也学会一听机器声变哑便先看同伴的手还在不在。"),
        variant(workingFemale, "机器旁也有女工和帮杂，工钱常另算一档。你同她们把头发包紧、袖口束住，规矩说是为安全，计件时却又催人快些。"),
        fallback("老师傅的经验和新机器的规矩常不肯完全相让。你在那份活里两边都学：一边说听手感，一边说看刻度，耳朵和眼睛因此都更忙。"),
      ],
      effects: [add("education.score", 1), add("resources.wealth", 2), add("resources.health", -2), add("relationships.friendship", 2)],
    },
    {
      title: "矿路伸远以后",
      minYears: 4,
      maxYears: 11,
      text: [
        variant(migrated, "矿路和新路把人带得更远，你也换过落脚处。家信里很难解释机器怎样响，只好写活还做得、饭还能吃，让家里先放心。"),
        variant(older, "后来更年轻的人来学机器，先问你哪处最容易伤手。你没有变成工头，只把旧伤疤给他看了一眼，这堂课便够具体。"),
        variant({ all: [C("career.field", "eq", "mine_worker")] }, "矿上产量涨过，也停过。你认识的几个人离开井口去修路、拉车，地下的本事不能全带走，彼此照应的习惯倒带了出来。"),
        fallback("机器没有把旧手艺一扫而空，只重新分了价钱和位置。你会做的事多了，能决定的事并没有同样增多；这两笔账一直不完全相等。"),
      ],
      effects: [add("education.score", 1), add("resources.reputation", 2), add("resources.health", -1)],
    },
  ],
});

const newSchool = structuralArc("new_school", {
  era: "qing",
  eraEnd: 1911,
  yearRange: [1900, 1903],
  ageRange: [7, 28],
  category: "education",
  lifetimeProbability: 0.13,
  currentRegions: { cityTiers: URBAN },
  conditions: {
    any: [
      C("birth.gender", "eq", "female"),
      C("education.score", "gte", 25),
      { hasTag: "basic_literacy" },
      { hasTag: "new_school_glimpse" },
    ],
  },
  steps: [
    {
      title: "门口贴了招生纸",
      text: [
        variant(female, "新学堂招收女孩的消息贴出来，家里先议论路远、束脩和旁人的嘴。你把那张纸上的字认了几遍，像先在门外上了几日课。"),
        variant(ruralNow, "邻近集镇办起新学堂，课程里有算学、格致，也仍要把字写端正。你去看了一回，最先记住的却是按钟点进门。"),
        variant(literate, "你已有些旧学根底，第一次翻新课本时，发现天地被分成许多图表。先生并未请你去教，你只是同别的学生一样从第一页重新认。"),
        fallback("一所新学堂在附近开门，桌椅、钟声和课目都同旧塾不尽一样。你进没进去，家里都为这件事算过一遍钱和路。"),
      ],
      effects: [add("education.score", 3), add("resources.freedom", 1), add("relationships.family", -1)],
    },
    {
      title: "课本旁边压着家事",
      minYears: 2,
      maxYears: 3,
      text: [
        variant(female, "读书的时辰同针线和家里的零碎事挤在一处。你把课本压在篮子底下带回家，纸页沾了油点，字仍能认。"),
        variant(lowReserve, "家里一度凑不出费用，你停了些日子，借同窗的课本抄写。抄到后半夜，灯油也参加了这场考试。"),
        variant(ruralNow, "往返学堂要走一段土路，雨天鞋底越走越重。你学会把课本包两层，自己淋湿些不要紧，纸比人更怕水。"),
        fallback("新课目越学越多，家中旧安排并未自动让路。你在课堂和家事之间来回，所学第一项新本事，是把一天塞得比从前更满。"),
      ],
      effects: [add("education.score", 3), add("resources.wealth", -2), add("resources.health", -1), add("attrs.intelligence", 1)],
    },
    {
      title: "旧考场关门以后",
      minYears: 3,
      maxYears: 5,
      yearRange: [1905, 1911],
      text: [
        variant(female, "废科举的消息传来，家中男人谈仕途改道，你更关心女学能否继续开。大门换了规矩，女孩仍得逐扇门问能不能进。"),
        variant(literate, "旧考试停后，新学堂忽然被许多人认真看待。你读过的算学和地理不再只算新鲜玩意，却也没有立刻替你换来一份稳当生活。"),
        variant(migrated, "你带着几本课本去过别处，书页上的地名终于同路程接上。真正上路后才知道，地图很平，脚下并不。"),
        fallback("学制和考试变动以后，同窗各走各路：有人升学，有人回家，有人去谋事。那几年共同坐过的桌子没有替任何人保证结局，只让选择多出几个名字。"),
      ],
      effects: [add("education.score", 2), add("resources.freedom", 1), add("resources.reputation", 1)],
    },
  ],
});

const portLabor = structuralArc("port_labor", {
  era: "qing",
  eraEnd: 1911,
  yearRange: [1842, 1894],
  ageRange: [15, 58],
  category: "career",
  lifetimeProbability: 0.15,
  currentRegions: {
    provinces: [
      "jiangsu", "shanghai", "zhejiang", "fujian", "guangdong", "xianggang", "taiwan",
    ],
    cityTiers: URBAN,
  },
  conditions: {
    all: [C("career.status", "in", ACTIVE)],
    any: [
      C("career.field", "in", ["manual_worker", "apprentice", "domestic_helper", "care_work", "factory"]),
      { hasTag: "dock_worker_memory" },
    ],
  },
  steps: [
    {
      title: "码头按船叫人",
      text: [
        variant(worker, "船靠岸时，揽工的人按货色叫脚力。你同众人搬箱、抬包，箱上的字认不得，重量倒很容易读懂。"),
        variant(female, "口岸附近的活不只在码头。你替住户洗衣、煮饭或缝补，听见窗外船笛，知道又一批人和货到了。"),
        variant(migrated, "你初到口岸，先在同乡处借住，再跟人去等零工。方言混在一起，工钱却用手指比划也能谈，只是谈妥后仍可能少一枚钱。"),
        fallback("口岸船多、人杂，你靠一阵短工把日子接上。每天先等船，再等人挑，最后等结钱；海潮一天两次，掌柜未必如此守时。"),
      ],
      effects: [add("resources.wealth", 3), add("resources.health", -3), add("relationships.friendship", 2)],
    },
    {
      title: "栈房里学会认货",
      minYears: 2,
      maxYears: 6,
      text: [
        variant(inactive, "你已离开码头一带的活，旧同伴仍偶尔捎来船期和招工消息。身体不用再扛箱，听见结钱二字时却还会先问这回拖了几天。"),
        variant(literate, "你渐渐认得货单上的数字和几个常见名目。会认字没有让箱子变轻，却使少算工钱时多了一句可以据理的话。"),
        variant(workingFemale, "你从各家厨房和洗衣间听来船期、米价与招工消息，再转告同乡。消息在女人做活的屋里绕一圈，出门时常被说成男人自己打听到的。"),
        fallback("你在口岸做久以后，能从包装、气味和搬运法猜出货色。那里的教法很直接：猜错一回，腰背便替先生批改。"),
      ],
      effects: [add("education.score", 1), add("resources.reputation", 1), add("resources.wealth", 2), add("relationships.friendship", 2)],
    },
    {
      title: "船期变了，住处未稳",
      minYears: 4,
      maxYears: 11,
      text: [
        variant(migrated, "你在口岸换过几处住处，箱笼始终没有完全拆空。船来时觉得此地通向天下，房钱到期时，天下只剩一间屋那么大。"),
        variant(older, "年纪渐长后，你不再抢最重的货，改做分拣、看行李或别的零活。职位没有正式名称，身体却清楚哪一种活已经不能再接。"),
        variant(stableHouse, "家里靠这些年口岸收入添过几件家当，也接济过新来的亲友。门口于是常多一双鞋，安稳和负担一同进屋。"),
        fallback("口岸的货色和规矩不断换，你也在几种活之间挪动。繁华从船上卸下来时很热闹，真正留给普通人的，常是一点工钱和一身不易洗掉的气味。"),
      ],
      effects: [add("resources.wealth", 2), add("resources.reputation", 1), add("resources.health", -1)],
    },
  ],
});

const remittanceLetter = structuralArc("remittance_letter", {
  era: "qing",
  eraEnd: 1911,
  yearRange: [1870, 1903],
  ageRange: [15, 80],
  category: "family",
  lifetimeProbability: 0.11,
  currentRegions: {
    provinces: ["fujian", "guangdong", "guangxi", "hainan"],
    cityTiers: ALL_PLACES,
  },
  conditions: {
    all: [C("relationships.family", "gte", 25)],
    any: [
      { hasTag: "nanyang_migrant" },
      { hasTag: "nanyang_letter_memory" },
    ],
  },
  steps: [
    {
      title: "银信进了家门",
      text: [
        variant({ all: [{ hasTag: "nanyang_migrant" }] }, "你在海外把银钱和家书托给批脚，收条看了两遍才收进贴身处。钱要走很远的路，纸上仍先写家中老人和孩子。"),
        variant({ all: [C("birth.gender", "eq", "female"), { missingTag: "nanyang_migrant" }] }, "外出谋生的亲人寄回一封银信，信里问老人、问孩子，最后才写自己。你把汇来的钱分作米钱、药钱和还债，纸上几行字很快变成一屋人的日用。"),
        variant({ all: [C("education.score", "gte", 42), { missingTag: "nanyang_migrant" }] }, "批脚送来银信，你逐字读给家人听。信里许多客套套语，真正要紧的是末尾那句工尚可做；家里听完，仍把这四个字问了两遍。"),
        fallback("你家同海外亲人之间开始有银信往来。钱数当场算清，信却留下再读；银钱管这个月，几句话要管更久。"),
      ],
      effects: [add("resources.wealth", 5), add("relationships.family", 3), add("resources.happiness", 2)],
    },
    {
      title: "迟到的批脚",
      minYears: 2,
      maxYears: 3,
      text: [
        variant({ all: [{ hasTag: "nanyang_migrant" }] }, "这一回托出的银信迟迟没有回音，你向同乡问了几遍船期。人在海外等家书，也等家里确认收到自己寄出的平安。"),
        variant({ all: [C("resources.wealth", "lte", 38), { missingTag: "nanyang_migrant" }] }, "家里已把上一笔钱用尽，新信却迟迟不到。你们先赊米、缓药，再彼此保证海路慢是常事；安慰不收利息，米铺的账要收。"),
        variant({ all: [C("education.score", "gte", 42), { missingTag: "nanyang_migrant" }] }, "批脚终于到时，信封上多了几处转交的字样。你照着念完，家人先问平安，再问为何少了钱；牵挂和账目在同一张纸上各占一半。"),
        fallback("一封银信因路阻迟到。海这边的人怕钱信遗失，海那边的人怕家中只收到沉默；批脚赶到时，两边才各松一口气。"),
      ],
      effects: [add("resources.wealth", -3), add("resources.happiness", -2), add("relationships.family", 2)],
    },
    {
      title: "信纸比银钱留得久",
      minYears: 3,
      maxYears: 5,
      text: [
        variant(older, "后来汇款有时多、有时少，你把几封旧信包在布里。晚辈只看见家中添过的屋瓦，你记得每一处修补对应哪一年海上的平安。"),
        variant(female, "家里用侨汇办过婚事、还过债，也为钱怎么分起过争执。你把信收好，不是为了证明谁有理，只怕来信人的声音最后只剩一串数。"),
        variant(migrated, "家中又有人循着旧路出洋，临行抄走一处地址。上一代的信于是成了下一代的路引，纸很薄，折进去的路很远。"),
        fallback("银钱陆续花尽，旧信仍留在箱底。家人后来讲起那段日子，有人记得屋瓦，有人记得债，有人只记得批脚进门时全家忽然安静。"),
      ],
      effects: [add("relationships.family", 2), add("resources.reputation", 1), add("resources.happiness", 1)],
    },
  ],
});

const grainLevy = structuralArc("grain_levy", {
  era: "republic",
  eraEnd: 1949,
  yearRange: [1912, 1933],
  ageRange: [16, 82],
  category: "wealth",
  lifetimeProbability: 0.12,
  currentRegions: { cityTiers: ["village", "town", "county"] },
  conditions: {
    any: [
      C("career.field", "eq", "farm_work"),
      C("career.status", "eq", "family_labor"),
      C("relationships.family", "gte", 35),
      { hasTag: "republic_tax_memory" },
      { hasTag: "late_qing_levy_memory" },
    ],
  },
  steps: [
    {
      title: "催粮的人到了村口",
      text: [
        variant(older, "催粮的人来时，家中推你去讲旧账和亩数。你年长，并不等于你说了算；只是年轻人怕急，老人至少知道哪句话该慢慢说。"),
        variant(female, "男人外出或躲差时，催粮的人仍会进院。你同家中女眷搬出粮袋、收据和一肚子解释，最后被承认的只有上秤的数。"),
        variant(lowReserve, "仓里本就不满，征粮的数目却照旧写在纸上。全家把口粮、种子和应交之粮反复挪堆，挪到最后，每一堆都显得被另一堆亏欠。"),
        fallback("地方又催粮派差，村里按户摊派。你家没有掌握规则，只能把旧收条找齐，跟着邻里去问这回究竟按田、按人，还是两样都按。"),
      ],
      effects: [add("resources.wealth", -4), add("resources.freedom", -2), add("relationships.family", 1)],
    },
    {
      title: "一间屋住进了兵",
      minYears: 2,
      maxYears: 5,
      text: [
        variant(older, "驻兵借住民房，你把较暖的一角让出来，又把家中年幼的人叫到身边。来人也有疲惫的脸，枪却使谁该让屋不必再商量。"),
        variant(female, "家里腾出一间屋给过路兵住，你添水做饭，也把针线、粮袋和年幼家人挪进里间。客人何时走没人说，扫地时却每天能看见新的泥。"),
        variant(stableHouse, "你家屋子稍宽，被安排多住几个人。邻里说宽屋有宽屋的难处，这句话算是同情，也顺便确认今晚不用住到他们家。"),
        fallback("过路队伍在村中借粮借宿。有人按数付过凭据，有人只留一句以后再说；那张凭据后来被家里压得很平，纸面一直没有变成粮。"),
      ],
      effects: [add("resources.wealth", -3), add("resources.health", -1), add("resources.freedom", -2), add("relationships.family", 2)],
    },
    {
      title: "旧收条压在箱底",
      minYears: 3,
      maxYears: 10,
      text: [
        variant(older, "多年后你仍留着几张征粮和借宿的收条。字迹证明事情发生过，却未必证明谁还承认；老人保存纸张，有时只是替一家人保存说法。"),
        variant(ruralNow, "摊派办法换过几次，村里也学会提前打听、彼此凑数。有人因此少受一点急难，也有人总在最后补那个缺口。"),
        variant(migrated, "家中有人因差粮太重离村谋生，后来寄钱回来补田里的亏空。土地留住了名分，出门的人维持它，两边都说自己是在顾家。"),
        fallback("征粮、借宿与还不上的凭据叠成几年日子。没有一场清楚的结算，只有家里后来见到来人点户时，会先把粮缸盖紧。"),
      ],
      effects: [add("resources.wealth", 1), add("resources.freedom", 1), add("relationships.family", 1)],
    },
  ],
});

const associationHall = structuralArc("association_hall", {
  era: "republic",
  eraEnd: 1949,
  yearRange: [1912, 1932],
  ageRange: [16, 66],
  category: "career",
  lifetimeProbability: 0.12,
  currentRegions: { cityTiers: URBAN },
  conditions: {
    all: [C("career.status", "in", ACTIVE)],
    any: [
      C("career.field", "in", [
        "apprentice", "manual_worker", "factory", "silk_mill_worker",
        "mine_worker", "arsenal_worker", "rickshaw_puller",
      ]),
    ],
  },
  steps: [
    {
      title: "会所门口收一份钱",
      text: [
        variant({ all: [C("career.status", "eq", "self_employed")] }, "同行会所来收会费，说遇到货价、税捐和纠纷时大家好一同说话。你交了钱，先问若生意不好，会费能不能也跟着不好。"),
        variant({ all: [C("career.field", "eq", "rickshaw_puller")] }, "车夫们凑钱维持一处歇脚地，也互通哪条街查得紧、哪里有长活。你不是领头人，只是把一枚钱放进众人的盒里。"),
        variant(female, "女工下值后在屋里听人讲工钱和工时。你坐在靠门处，方便家里来催时先走；公共事情总要同家事争一张凳子。"),
        fallback("同行会或会所邀你去听议事，大家凑钱、报数、说近来的难处。你没有上台，只在人群中把同一件委屈第一次听见许多种口音。"),
      ],
      effects: [add("resources.wealth", -1), add("relationships.friendship", 3), add("resources.freedom", 1)],
    },
    {
      title: "停一天工的价钱",
      minYears: 2,
      maxYears: 5,
      text: [
        variant(inactive, "你已不在原来的行当，旧工友仍来问是否愿意在联名上作证。离开岗位使你少了一日工钱的顾虑，也多了一层别连累家人的盘算。"),
        variant(workingFemale, "工友商量停工一天争取补发工钱，你最先算的是这一天少挣多少、家里的事务由谁接手。道理并不因这些盘算变小，只是要先穿过一张饭桌。"),
        variant(lowReserve, "大家决定一同停手时，你家正等米下锅。你还是去了，却在队伍边上反复摸口袋；勇气有时并不昂扬，只是明知一天工钱在哪里仍站着。"),
        fallback("会所里后来商定一次联名或停工，你同旧工友把名字按上去。事情未必立刻有结果，但掌柜第一次不能把每个人分开回答。"),
      ],
      effects: [add("resources.wealth", -3), add("relationships.friendship", 3), add("resources.reputation", 1), add("resources.freedom", 1)],
    },
    {
      title: "名单没有替谁过日子",
      minYears: 4,
      maxYears: 11,
      text: [
        variant(older, "多年后你还认得会所名册上的几个名字。有人换行，有人回乡，有人再没出现；组织留下记录，日子仍把人逐个带往不同方向。"),
        variant(migrated, "你离开旧城后，在新地方仍先找同乡和同行。过去那次联名没有成为护身符，却教会你陌生处先问哪里能坐下来一起说话。"),
        variant(worker, "工钱后来涨过，也跌过，会所还经历过查封和重开。你没把每次变化都算作胜败，只记得出事时谁来通知家属、谁肯凑医药钱。"),
        fallback("那场交涉只解决了一部分事情，甚至有人因此失去原来的活。商会、工人会或会所的牌子后来换过，互助的名单却在几个人手里抄存下来。"),
      ],
      effects: [add("relationships.friendship", 2), add("resources.reputation", 1), add("resources.happiness", -1)],
    },
  ],
});

const printLiteracy = structuralArc("print_literacy", {
  era: "republic",
  eraEnd: 1949,
  yearRange: [1912, 1935],
  ageRange: [12, 82],
  category: "education",
  lifetimeProbability: 0.11,
  currentRegions: { cityTiers: ALL_PLACES },
  conditions: {
    any: [
      C("education.score", "gte", 25),
      { hasTag: "basic_literacy" },
      { hasTag: "old_learning" },
      { hasTag: "new_school_glimpse" },
      C("meta.age", "gte", 45),
    ],
  },
  steps: [
    {
      title: "一张报纸轮着念",
      text: [
        variant(older, "街坊拿来一张旧报，请你辨认几处标题。你未必全懂新名词，仍把能认的字慢慢念完；老人识字不多，也足以让一屋人少猜几回。"),
        variant(female, "一张小报在家人和邻里手中传看，你先看物价、招工和失踪启事。旁人谈天下事，你把纸角留给同日子直接相碰的几栏。"),
        variant(ruralNow, "集镇带回的报纸隔了几日才到村里，识字的人在店门口念给大家听。新闻已不新，听众的议论却十分当日。"),
        fallback("你同几个人轮看一张报纸，认得的念，不认得的互相猜。纸张很薄，摊在桌上却能让整屋人暂时把自己的话停一停。"),
      ],
      effects: [add("education.score", 2), add("relationships.friendship", 2), add("attrs.intelligence", 1)],
    },
    {
      title: "字从纸上走进账本",
      minYears: 2,
      maxYears: 4,
      text: [
        variant(older, "你开始在药包、收条和来信上认出更多字。年轻人笑你总问同一个字，你说字若肯每回长一样，老人也愿意少问几回。"),
        variant(worker, "工友办夜间识字班，你下工后去坐一阵。手上机油把纸边弄黑，先生不是你，黑板上的字也没有因此嫌弃学生。"),
        variant(female, "你用报纸背面练写名字和数目，又替家里核对收条。会写并未免去家务，只使家务里多了一项不容易被糊弄的本事。"),
        fallback("报上的常用字渐渐进了你的家书和小账。写得不漂亮也能用，大家终于承认有些字的首要职责不是参加考试。"),
      ],
      effects: [add("education.score", 3), add("resources.reputation", 1), add("resources.freedom", 1)],
    },
    {
      title: "纸页各自去了别处",
      minYears: 3,
      maxYears: 9,
      text: [
        variant(older, "后来报纸上的人名和口号换得很快，你不再每篇都信，也不肯一概不看。年纪给你的不是答案，只是多见过几回大字标题与小字日子不相配。"),
        variant(ruralNow, "旧报纸被拿去糊墙、包盐或垫箱底，字仍从破口露出来。家里年幼的人指着问，你能答几个，不能答的便一起等下次赶集。"),
        variant(migrated, "你把识得的地址写在布包内侧，出门后凭它找到同乡。多年读报未使路变短，却让一张纸能在陌生城里替你开口。"),
        fallback("那几年读过的报多半散失了，留下的是认字、核数和听人念时先问日期的习惯。小报没有替你解释时代，至少让时代不总只由别人转述。"),
      ],
      effects: [add("education.score", 1), add("resources.freedom", 1), add("relationships.friendship", 1)],
    },
  ],
});

const wartimeEvacuation = structuralArc("wartime_evacuation", {
  era: "republic",
  eraEnd: 1949,
  yearRange: [1937, 1941],
  ageRange: [8, 82],
  category: "migration",
  lifetimeProbability: 0.14,
  currentRegions: { provinces: WARTIME_RELOCATION_PROVINCES, cityTiers: ALL_PLACES },
  steps: [
    {
      title: "先把家缩进几只包袱",
      text: [
        variant(older, "撤离前，家里让你坐着指认要带的契纸、药方和亲人地址。老人走得慢，记得却多；一只旧匣子是否要带，全家争到最后仍由你抱着。"),
        variant(female, "你把衣物、针线、干粮和随身药物分进几只包袱。旁人说轻装，你只好问轻到哪一顿饭、哪一副药也不算。"),
        variant({ all: [C("career.field", "in", ["factory", "silk_mill_worker", "arsenal_worker", "wartime_factory"])] }, "工场让工人随厂内迁，机器零件同家眷行李挤在一处。你只负责搬运和跟队，不负责决定去向，却要把全家的去向装进行李。"),
        fallback("战事逼近，家中把能带的东西缩成几件行李。锁门时没人说何时回来，仍有人认真拉了两遍门闩，像门能替大家守住原来的日子。"),
      ],
      effects: [add("location.migratedTimes", 1), add("resources.wealth", -5), add("resources.health", -2), add("relationships.family", 3)],
    },
    {
      title: "借来的床铺",
      minYears: 1,
      maxYears: 2,
      text: [
        variant(older, "落脚处把一张窄床让给你，你却常坐着睡；人挤人时，躺下以后连翻身也要同旁边商量。旁人夸老人肯让，你只是腰躺下后更难起来。"),
        variant(female, "几家人合住一处，做饭要轮灶、晾衣要认绳。你很快记住谁家孩子怕辣，也记住哪口锅的主人最怕别人刮锅底。"),
        variant(lowReserve, "带来的钱很快变薄，你们靠配给、零工和亲友接济过日子。每样东西都说暂借，日历却没有答应暂到何时。"),
        fallback("你们在学校、祠堂、亲友家或临时住处安顿下来。床铺是借的，碗筷凑的，只有每天醒来先数家里人是否都在，成了自己的规矩。"),
      ],
      effects: [add("resources.wealth", -3), add("resources.health", -2), add("relationships.friendship", 3), add("resources.freedom", -2)],
    },
    {
      title: "临时住处过了几个年",
      minYears: 2,
      maxYears: 5,
      text: [
        variant(older, "临时住处竟过了几个年，你在门边种下一小盆葱。有人说仗打完就走，不必费事；葱没有参加争论，照样往上长。"),
        variant(migrated, "家里又有人继续向内地走，也有人留下找活。每次分开都说到了写信，真正能寄出的地址却总慢一步。"),
        variant(female, "你同邻里妇女互换针线、药方和孩子旧衣。大事把人赶到一处，小事才使这些人没有只做彼此身边的陌生人。"),
        fallback("临时住处渐渐有了熟路、赊账和邻里，原来的家却只剩传闻。你们既没有真正安定，也不能每天只等回去，于是照常过年。"),
      ],
      effects: [add("relationships.friendship", 3), add("resources.wealth", 1), add("resources.happiness", -1)],
    },
  ],
});

const postwarReturn = structuralArc("postwar_return", {
  era: "republic",
  eraEnd: 1949,
  yearRange: [1945, 1947],
  ageRange: [15, 85],
  category: "migration",
  lifetimeProbability: 0.15,
  allowExistingEraArc: true,
  currentRegions: { cityTiers: ALL_PLACES },
  conditions: {
    all: [C("location.migratedTimes", "gte", 1)],
    any: [
      { hasTag: "wartime_refugee" },
      { hasTag: "wartime_student" },
      { hasTag: "struct_pre49_wartime_evacuation_after" },
    ],
  },
  steps: [
    {
      title: "回程票比胜利晚",
      text: [
        variant(older, "胜利消息传来后，家里先商量你能不能经得起回程。你说慢些走也要回去看看；老人执意上路，有时不是相信家还在，只是要亲眼确认。"),
        variant(female, "你把这些年添置的东西再筛一遍，能带的包起，带不走的送人。离开临时住处时也有人来相送，回乡于是同时像告别。"),
        variant(lowReserve, "车船拥挤，票价又高，你们分批动身。先走的人带地址，后走的人看行李，每个人都被叮嘱别在胜利以后走失。"),
        fallback("战后回程的人挤满车船和道路，你也随家人往旧处走。大家谈论重建，手上先要做的是守住包袱和别坐过站。"),
      ],
      effects: [add("location.migratedTimes", 1), add("resources.wealth", -3), add("resources.health", -1), add("relationships.family", 2)],
    },
    {
      title: "门牌还在，屋里换了人",
      minYears: 1,
      maxYears: 1,
      text: [
        variant(older, "你凭旧门牌和邻人记忆找到原处，房屋已残破，熟面孔也少了。别人劝先歇一歇，你却在院角站很久，像替缺席的人点名。"),
        variant(urbanNow, "旧住处已有别家借居，双方都拿得出各自的难处。你们先挤在亲友处等交涉，胜利结束了战争，没有自动空出一张床。"),
        variant(ruralNow, "回村后，田界、农具和欠账都要重新理清。邻里帮着指认，也各自记得不同版本；一块界石忽然比许多大话更难移动。"),
        fallback("你回到旧处，门窗、器物和邻里都不全是原样。先扫出一块能睡的地方，再谈归还、修补和寻找失散的人。"),
      ],
      effects: [add("resources.wealth", -4), add("relationships.friendship", 2), add("resources.happiness", -2)],
    },
    {
      title: "回乡以后又有人出门",
      minYears: 1,
      maxYears: 1,
      text: [
        variant(older, "你终于在旧地住下，却常把临时住处的人名念起。家里人说你回来了，你仍把两处天气都记在心里；晚年的家可以只有一间，牵挂不必。"),
        variant(migrated, "家里刚把屋顶补好，又有人因生计和局势离开。行李沿用战时那几只包袱，绳结打得很熟，没人把这种熟练当作本事夸。"),
        variant(lowReserve, "返乡后的物价和工钱都不稳，你们卖掉一件带回的东西维持日用。纪念物没有被庄严保存，它先完成了让全家吃饭的职责。"),
        fallback("旧家修起一部分，失去的东西没有一一回来。有人留下，有人再次出门；所谓返乡不是故事收尾，只是下一段生活终于有了可站的地面。"),
      ],
      effects: [add("resources.wealth", 1), add("relationships.family", 2), add("resources.reputation", 1)],
    },
  ],
});

export const structuralPre1949ArcEvents = [
  ...riverRoad,
  ...militiaRegister,
  ...famineMigration,
  ...mineMachine,
  ...newSchool,
  ...portLabor,
  ...remittanceLetter,
  ...grainLevy,
  ...associationHall,
  ...printLiteracy,
  ...wartimeEvacuation,
  ...postwarReturn,
];
