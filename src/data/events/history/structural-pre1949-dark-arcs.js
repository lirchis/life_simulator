// Dark structural arcs for ordinary lives before 1949.
//
// These are not villain biographies. Each opening requires a concrete, small
// advantage — literacy, a place at the distribution table, a family voice, a
// key, a shop counter or simply the stronger place on a refugee cart. The next
// two stages preserve material gain, damaged trust and the story people later
// tell themselves. There are no choices and no automatic repentance.

const ALL_PLACES = ["village", "town", "county", "city", "tier2", "tier1"];
const RURAL_AND_COUNTY = ["village", "town", "county"];
const TOWN_AND_CITY = ["town", "county", "city", "tier2", "tier1"];
const ACTIVE = ["employed", "self_employed", "family_labor"];
const PROPERTY_HOMES = ["smallholder", "rich_peasant", "landlord", "merchant", "comprador_merchant", "scholar_gentry"];
const PRECARIOUS_HOMES = ["landless_laborer", "tenant", "poor_peasant", "shop_clerk", "craftsman"];
const WAR_AFFECTED_PROVINCES = [
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

function scopeThreadConditions(value, domain) {
  if (Array.isArray(value)) return value.map((item) => scopeThreadConditions(item, domain));
  if (!value || typeof value !== "object") return value;
  const scoped = Object.fromEntries(Object.entries(value).map(([key, item]) => [key, scopeThreadConditions(item, domain)]));
  if (scoped.path === "shadow.guilt") scoped.path = `shadow.threads.${domain}.guilt`;
  if (scoped.path === "shadow.selfDeception") scoped.path = `shadow.threads.${domain}.justification`;
  return scoped;
}

function historicalThreadEffects(effects, domain, close) {
  // The final scene may reveal an earlier moral direction, but should not
  // impose guilt and hardening on every conditional version alike.
  const adjusted = close
    ? effects.filter((effect) => !(effect.add > 0
      && ["shadow.guilt", "shadow.hardness", "shadow.selfDeception"].includes(effect.path)))
    : effects;
  return adjusted.flatMap((effect) => {
    const mirrored = [];
    if (effect.path === "shadow.guilt" && effect.add > 0) mirrored.push(add(`shadow.threads.${domain}.guilt`, effect.add));
    if (effect.path === "shadow.selfDeception" && effect.add > 0) mirrored.push(add(`shadow.threads.${domain}.justification`, effect.add));
    if (effect.add > 0 && ["resources.wealth", "resources.reputation", "resources.achievement"].includes(effect.path)) {
      mirrored.push(add(`shadow.threads.${domain}.benefitRetained`, Math.min(4, effect.add)));
    }
    return [effect, ...mirrored];
  });
}

const lateQing = { all: [C("meta.currentYear", "lte", 1911)] };
const wartime = { all: [C("meta.currentYear", "gte", 1937), C("meta.currentYear", "lte", 1945)] };
const female = { all: [C("birth.gender", "eq", "female")] };
const ruralNow = { all: [C("location.currentCityTier", "in", ["village", "town"])] };
const urbanNow = { all: [C("location.currentCityTier", "in", ["county", "city", "tier2", "tier1"])] };
const migrated = { all: [C("location.migratedTimes", "gte", 1)] };
const lowReserve = { all: [C("resources.wealth", "lte", 38)] };
const secure = { all: [C("resources.wealth", "gte", 62)] };
const literate = { all: [C("education.score", "gte", 42)] };
const older = { all: [C("meta.age", "gte", 50)] };
const propertyHome = { all: [C("birth.familyClass", "in", PROPERTY_HOMES)] };
const precariousHome = { all: [C("birth.familyClass", "in", PRECARIOUS_HOMES)] };
const guilty = { all: [C("shadow.guilt", "gte", 4)] };
const hardened = { all: [C("shadow.hardness", "gte", 7), C("shadow.selfDeception", "gte", 6)] };

function joinConditions(required, extra = {}) {
  return {
    all: [...required, ...(extra.all ?? [])],
    ...(extra.any ? { any: extra.any } : {}),
    ...(extra.none ? { none: extra.none } : {}),
  };
}

function darkArc(key, config) {
  const stages = ["opening", "settling", "memory"];
  const ids = stages.map((stage) => `shadow_pre49_dark_${key}_${stage}`);
  const domain = `shadow_pre49_dark_${key}`;

  return config.steps.map((step, index) => {
    const elapsedMin = config.steps.slice(1, index + 1)
      .reduce((sum, item) => sum + item.minYears, 0);
    const elapsedMax = config.steps.slice(1, index + 1)
      .reduce((sum, item) => sum + item.maxYears, 0);
    const required = index === 0
      ? [{ missingTag: "shadow_pre49_dark_actor" }, { missingTag: "shadow_public_actor" }]
      : [between(ids[index - 1], step.minYears, step.maxYears)];
    const next = config.steps[index + 1];

    return {
      id: ids[index],
      title: step.title,
      category: step.category ?? config.category,
      yearRange: step.yearRange ?? (index === 0
        ? config.yearRange
        : [config.yearRange[0] + elapsedMin, Math.min(config.eraEnd, config.yearRange[1] + elapsedMax)]),
      ageRange: step.ageRange ?? (index === 0
        ? config.ageRange
        : [config.ageRange[0] + elapsedMin, Math.min(105, config.ageRange[1] + elapsedMax)]),
      ...(index === 0 && config.currentRegions ? { currentRegions: config.currentRegions } : {}),
      conditions: scopeThreadConditions(joinConditions(required, index === 0 ? config.conditions : step.conditions), domain),
      ...(index > 0 ? { requiresEvents: [ids[index - 1]] } : {}),
      maxOccurrences: 1,
      baseWeight: index === 0 ? 26 : index === 1 ? 94 : 118,
      ...(index === 0 ? { lifetimeProbability: config.lifetimeProbability ?? 0.1 } : {}),
      narrativeTier: index === 0 ? "turning_point" : "consequence",
      narrativeDomain: domain,
      narrativeThread: index === 2
        ? { close: true }
        : { expiresAfterYears: next.maxYears },
      text: scopeThreadConditions(step.text, domain),
      effects: [
        ...(index === 0 ? [{ initializeShadowThread: domain }] : []),
        ...historicalThreadEffects(step.effects ?? [], domain, index === 2),
        ...(next ? [{
          scheduleEvent: {
            eventId: ids[index + 1],
            delayYears: [next.minYears, next.maxYears],
            weightMultiplier: index === 0 ? 22 : 16,
          },
        }] : []),
        { addTag: "shadow_pre49_dark_actor" },
        { addTag: "shadow_public_actor" },
        { addTag: `shadow_pre49_${key}` },
      ],
    };
  });
}

const deedWithoutClause = darkArc("deed_without_clause", {
  eraEnd: 1949,
  yearRange: [1840, 1934],
  ageRange: [22, 68],
  category: "wealth",
  lifetimeProbability: 0.11,
  currentRegions: { cityTiers: ALL_PLACES },
  conditions: {
    all: [C("career.status", "in", ACTIVE), C("education.score", "gte", 28)],
    any: [
      C("career.field", "in", ["trade", "small_business", "professional", "apprentice", "pharmacy"]),
      C("birth.familyClass", "in", PROPERTY_HOMES),
    ],
  },
  steps: [
    {
      title: "契纸上少了一句话",
      text: [
        variant({ all: [C("meta.currentYear", "lte", 1911), C("location.currentCityTier", "in", ["village", "town"])] }, "一户人急着还债，请你在田契上作保。原先说好的赎回期限没有写进正契，你听见双方都提过，落笔时却只照出钱一方的意思写。中人钱不多，恰够你家添一担粮。"),
        variant({ all: [C("meta.currentYear", "gte", 1912), C("location.currentCityTier", "in", ["county", "city", "tier2", "tier1"])] }, "邻街一家要押出铺面周转，请你帮着核对契据。口头说的是暂押，纸上写成了转让；你提醒自己公章只认纸，不负责听人当时怎样哀求。"),
        variant(precariousHome, "你自己也常被债催，因而更清楚哪句话一省，穷人便少一道退路。那天你仍替有钱的一方写了契，收下谢钱时，先想到的是家里欠着的药账。"),
        variant(literate, "你识字，乡里遇到契约便常来请你念。你把银数、界址都念得清楚，唯独把一句赎回旧议略过去；一张纸从此比满屋人的记性更有凭据。"),
        fallback("两家因一处田屋立契，你受托作中。弱的一方以为尚能赎回，强的一方要你只写一次买断；你选择了更肯付中人钱的那个版本。"),
      ],
      effects: [add("resources.wealth", 3), add("resources.reputation", 2), add("shadow.complicity", 4), add("shadow.harmDone", 3), add("shadow.selfDeception", 3), add("shadow.guilt", 2), add("shadow.trustDebt", 3)],
    },
    {
      title: "界石往里挪了半步",
      minYears: 2,
      maxYears: 5,
      text: [
        variant(ruralNow, "新主人照契收地，把界石向里挪了半步。原主带着亲族来争，你把纸摊开，只说白纸黑字；田埂上那句旧口约，比一阵风还站不住。"),
        variant(urbanNow, "铺面换锁时，原主拿着旧收条来问。你替买主指出契上的转让二字，门板很快合上；街坊看完全程，第二天照旧在门前买东西。"),
        variant(lowReserve, "原主来求你证明当时另有约定，你怕退还谢钱，也怕得罪如今占有田屋的人，只说年月久了。家里那担粮早吃完，这句话却替它继续留下。"),
        variant(hardened, "你又替买主补立一张界址凭据。手续越补越齐，最初漏掉的一句话便越像从未存在；公道被纸压平后，收纳得很省地方。"),
        fallback("交割真正落地时，弱的一方才明白没有赎回余地。你仍被请去作证，便重复契上的字句；一个人的家产由此成了另一个人的手续完备。"),
      ],
      effects: [add("resources.wealth", 2), add("resources.reputation", 2), add("relationships.friendship", -3), add("shadow.complicity", 4), add("shadow.harmDone", 4), add("shadow.selfDeception", 3), add("shadow.trustDebt", 5)],
    },
    {
      title: "后人只见到一张干净的契",
      minYears: 4,
      maxYears: 10,
      text: [
        variant(older, "晚辈整理旧契，只看见一张字迹清楚的买断文书，便夸你当年办事周全。你纠正了一个写错的亩数，没有纠正他们对周全的理解。"),
        variant(guilty, "原主家后人又来问过一次，你承认当时确有口约，却已拿不出能翻案的东西。真话终于说出口，只剩下供人确认自己没有记错的用途。"),
        variant(hardened, "新主人家的日子越过越稳，那处田屋也几经转手。你始终没有受罚，后来还常被称作懂契据的人；名声有时正是靠不再追问第一张纸怎样写成。"),
        variant(precariousHome, "你把那笔中人钱讲成家里最难时的一次救急。晚辈只记得你肯为一家人想办法，没有人再问，被写掉退路的那一家如何过冬。"),
        fallback("契纸留了下来，口约没有。原主家的人逢年仍从另一条路走，新主人也不再提旧争执；事情没有和解，只是被日常使用成了既成事实。"),
      ],
      effects: [add("relationships.friendship", -2), add("shadow.hardness", 2), add("shadow.selfDeception", 3), add("shadow.trustDebt", 3)],
    },
  ],
});

const reliefRoster = darkArc("relief_roster", {
  eraEnd: 1889,
  yearRange: [1876, 1879],
  ageRange: [20, 70],
  category: "wealth",
  lifetimeProbability: 0.1,
  currentRegions: {
    provinces: ["shanxi", "henan", "hebei", "shaanxi", "shandong"],
    cityTiers: ALL_PLACES,
  },
  conditions: {
    all: [C("career.status", "in", ACTIVE)],
    any: [
      { hasTag: "famine_memory" },
      { eventOccurredWithin: { eventId: "era_late_qing_great_famine", years: 3 } },
    ],
  },
  steps: [
    {
      title: "名册先写熟人",
      text: [
        variant(lateQing, "灾后粥棚请你帮着认户登记。你把几户相熟人家先写进名册，又把同你家有旧隙的一户排到末尾；锅里的米原本不认识这些恩怨，落勺以后便认识了。"),
        variant(ruralNow, "赈粮运到乡里，等候的人挤满院子。你替熟识的一家多添一口人，也把曾同你家争过水的人写成尚可支撑；毛笔只动几下，两家的米袋便换了轻重。"),
        variant(propertyHome, "地方请几户体面人家协助分发，你把常来往的佃户和伙计排在前面。你说熟人底细清楚，至于陌生人为何总要等到锅底，只能怪他们来得不巧。"),
        variant(precariousHome, "你并不比队伍里的人富裕多少，只是恰好坐到登记桌后。亲戚隔着人群递来一个眼色，你替他添了人口数；小权力第一次到手，正好装得下一家人的饥饿。"),
        fallback("赈济按户分发，你受托认人记数。名额不够时，你先保住亲友和有来往的人，又删去一户平日不肯给你面子的人。表格很整齐，队尾却多站了一家。"),
      ],
      effects: [add("relationships.family", 3), add("resources.reputation", 2), add("shadow.complicity", 4), add("shadow.harmDone", 4), add("shadow.selfDeception", 3), add("shadow.guilt", 1), add("shadow.trustDebt", 4)],
    },
    {
      title: "缺口算作路耗",
      minYears: 1,
      maxYears: 3,
      text: [
        variant(ruralNow, "最后几户只分到薄粥，仓房把短缺记成路耗。被你排后的那户来问，你指着已经封存的名册说数字都在；纸会替人说话，尤其替握过笔的人。"),
        variant(urbanNow, "补发那天，队伍从街角排到门外。你让熟人从侧门领走预留的一包，又劝正门的人不要乱；秩序恢复得很快，粮食没有因此变多。"),
        variant(guilty, "你后来从自家份额匀出一小袋，托人送给被删的那户，却没有改名册。你保留了纠正数字的权力，只使用了让自己稍微好受一点的那部分。"),
        variant(hardened, "分发结束后，你因办事稳妥又被请去管下一批。懂得谁会闹、谁只会低头，成了你最受称赞的经验；被饿出来的沉默也算进了管理能力。"),
        fallback("物资不够的责任落在运输和损耗上，没有人追查那几处手改。你替大家收好名册，也替自己收好一种解释：总得有人做决定。"),
      ],
      effects: [add("resources.reputation", 3), add("relationships.friendship", -3), add("shadow.complicity", 4), add("shadow.harmDone", 5), add("shadow.selfDeception", 4), add("shadow.trustDebt", 5)],
    },
    {
      title: "匾额比名单留得久",
      minYears: 3,
      maxYears: 7,
      text: [
        variant(older, "地方后来给那次赈济立了匾，名册却在潮气里黏成一叠。晚辈指着匾说你做过善事，你点头，又提醒他们落款中的一个名字念错了。"),
        variant(guilty, "被删那户的一名晚辈长大后认出了你的笔迹。对方没有告你，只在求你再写一份证明时转身走了；惩罚没有来，信任先学会了绕路。"),
        variant(hardened, "你平安做完几次分发，后来被称作热心公事。灾年过去，受益的亲友常来往，被漏掉的人渐渐迁走；留下的人越多，越能证明你的名单似乎没有错。"),
        variant(precariousHome, "家里一直记得那批粮怎样救了急，讲到你时总说幸亏有人在桌后。故事没有撒谎，只把桌前那条队伍裁掉了一半。"),
        fallback("那份名册再没人重查。你得到的是几户长久的人情，也失去几户不再登门的邻里；两边都没有写进赈济总结。"),
      ],
      effects: [add("relationships.friendship", -2), add("shadow.hardness", 2), add("shadow.selfDeception", 3), add("shadow.trustDebt", 3)],
    },
  ],
});

const changedLock = darkArc("changed_lock", {
  eraEnd: 1950,
  yearRange: [1851, 1944],
  ageRange: [20, 72],
  category: "migration",
  lifetimeProbability: 0.1,
  currentRegions: { cityTiers: ALL_PLACES },
  conditions: {
    any: [
      { eventOccurredWithin: { eventId: "era_late_qing_taiping_displacement", years: 4 } },
      { eventOccurredWithin: { eventId: "era_late_qing_great_famine", years: 3 } },
      { hasTag: "wartime_refugee" },
      { all: [C("meta.currentYear", "gte", 1937), C("location.currentProvince", "in", WAR_AFFECTED_PROVINCES)] },
    ],
  },
  steps: [
    {
      title: "空屋换了一把锁",
      text: [
        variant({ all: [C("meta.currentYear", "lte", 1911), C("location.currentCityTier", "in", ["village", "town"])] }, "兵荒后，邻家院门开着，主人不知去了哪里。你先说替他们看屋，后来把自家粮缸和两件农具搬进去，再换了一把锁；保管和占用之间，只隔着钥匙转过一圈。"),
        variant(wartime, "街坊一家仓促撤走，托你照看门窗。几个月没有消息，你让亲属住进空屋，也把留下的木料拿去修了自家屋顶；每取一件，你都说总比让乱兵拿走好。"),
        variant(migrated, "你自己也是逃来的人，看见一间无人认领的屋便先安顿家人。灶是冷的，柜里还有衣物；你把原主人的东西收进一只箱子，住久以后，那只箱子越来越像不必打开的旧物。"),
        variant(lowReserve, "全家正挤在廊下过夜，你撬开一间空屋的侧门。第二天你补好门闩，仿佛修理过便多了一分所有权；穷困没有让事情无害，只让理由更贴身。"),
        fallback("乱中有一户久无消息，你先替人看守，随后把房屋或铺面给自家人使用。你没有宣布它归你，只是把钥匙放进了自己的口袋。"),
      ],
      effects: [add("resources.wealth", 5), add("relationships.family", 4), add("resources.freedom", 2), add("shadow.complicity", 3), add("shadow.harmDone", 4), add("shadow.selfDeception", 4), add("shadow.guilt", 1), add("shadow.trustDebt", 4)],
    },
    {
      title: "回来的人站在门外",
      minYears: 1,
      maxYears: 3,
      text: [
        variant(ruralNow, "原主的亲属回来认院，你拿出修屋和代缴杂费的账，要求先偿清才交钥匙。账里每根椽子都有价，借住几年却没有租金那一栏。"),
        variant(urbanNow, "原主回来敲门时，屋里已经摆满你家的东西。你先谈这些年看守的辛苦，又说街面上空屋早被别人占尽；别人的更坏做法，替这把锁添了一层合法似的亮光。"),
        variant(secure, "你已有别处可住，仍不肯立即交还，怕一松手便说不清投入。原主只取走几件旧物，房屋继续由你使用；胜利和归来都没能自动配出一串钥匙。"),
        variant(guilty, "你把正屋腾还，却留下后间和一部分木料，称作抵偿修缮。双方都没有力气打长官司，于是半座院子成了你良心能够接受的精确尺寸。"),
        fallback("有人回来认领，你把看守、修缮和这些年的风险一项项说出来。对方拿不出足够凭据，也拿不出让你搬走的力量，最后只带走几件还能认出的东西。"),
      ],
      effects: [add("resources.wealth", 4), add("relationships.friendship", -4), add("resources.reputation", -1), add("shadow.complicity", 4), add("shadow.harmDone", 5), add("shadow.selfDeception", 4), add("shadow.trustDebt", 6)],
    },
    {
      title: "家里只记得你守住了屋",
      minYears: 2,
      maxYears: 3,
      text: [
        variant(older, "晚辈问这处屋怎样来的，你说乱世里是自己一点点守住的。句句都有事实：你确实守过、修过、熬过；只把最先拿钥匙的人从故事里挪了出去。"),
        variant(guilty, "你后来托人打听原主一家，消息绕了几处便断了。那只装着旧衣的箱子一直没有扔，留下它既像等待归还，也像给自己保留一名沉默证人。"),
        variant(hardened, "房屋最终登记在你家名下，邻里也渐渐改口称是你家的。你给墙重刷过几次灰，晚辈只知道哪间屋冬天漏风；住得越久，来路越像一层被盖住的旧颜色。"),
        variant(migrated, "你后来又搬走，把那间屋转给亲属使用。自己曾是无处落脚的人，最后也在别人的归途中放下一道门槛；两段经历没有自动替彼此讲和。"),
        fallback("原主一家没有再来，房屋也成了日常家产。亲属感谢你当年果断，附近老人则偶尔还用旧姓称那座院子；两个名字相安无事地指着同一堵墙。"),
      ],
      effects: [add("resources.wealth", 2), add("relationships.family", 2), add("shadow.hardness", 3), add("shadow.selfDeception", 4), add("shadow.trustDebt", 3)],
    },
  ],
});

const privateGrudgeReport = darkArc("private_grudge_report", {
  eraEnd: 1949,
  yearRange: [1937, 1943],
  ageRange: [18, 74],
  category: "relationship",
  lifetimeProbability: 0.12,
  currentRegions: { provinces: WAR_AFFECTED_PROVINCES, cityTiers: ALL_PLACES },
  conditions: {
    any: [
      C("career.status", "in", ACTIVE),
      C("relationships.friendship", "lte", 48),
      C("location.migratedTimes", "gte", 1),
    ],
  },
  steps: [
    {
      title: "把旧怨写进可疑二字",
      text: [
        variant(ruralNow, "村里查问陌生来往时，你提起同自己争过田界的邻人，说他夜里常有人来。你没有编造每个细节，只把寻常走动摆进了最危险的解释里。"),
        variant(urbanNow, "街区登记住户，你主动说起那位欠你钱的邻居常换落脚处。负责询问的人在名字旁画了记号，你看见那一笔，忽然不再催那笔旧债。"),
        variant(female, "有人来问一户人家的来往，你补说那家曾在背后议论你。家务口角换了一种更响亮的说法，被问的人却没有机会把两件事拆开。"),
        variant(migrated, "你在异乡怕自己先受怀疑，便把查问引向一个同你不睦的旧识。口音、行李和晚归都成了疑点；这些事在你身上原也一样，只是那晚记在了别人名下。"),
        fallback("检查的人向街坊打听一名旧相识，你本可只说不知道，却把多年私怨添进证词。报复没有使用旧事的名字，因而显得像一次配合公事。"),
      ],
      effects: [add("resources.freedom", 2), add("resources.reputation", 2), add("shadow.complicity", 5), add("shadow.harmDone", 5), add("shadow.selfDeception", 3), add("shadow.guilt", 2), add("shadow.resentment", 2), add("shadow.trustDebt", 5)],
    },
    {
      title: "空出来的位置有人坐了",
      minYears: 1,
      maxYears: 2,
      text: [
        variant(ruralNow, "那户人离开后，原先争议的一小块地暂由你家耕种。你说地不能荒，至于是谁使它忽然空出来，庄稼没有问，收成也没有退回。"),
        variant(urbanNow, "那人被带走或避走以后，铺位和住处都空出一角。你替亲属争到使用权，街坊只说乱世里先来后到；你的先来，是从一句证词开始的。"),
        variant(lowReserve, "对方离开后，你接下了他原有的一点活计。工钱正好救急，你便更愿意相信自己当时只是说了实话；收益像一枚印章，盖在最需要相信的版本上。"),
        variant(guilty, "你听说那人受了不少查问，便托人说自己只答过一句。传话的人没有追问是哪一句，你也把这份克制记成一种体谅。"),
        fallback("被你提到的人很快从日常里消失，去向没人说清。你得到一处空位、一笔暂缓的债或一阵安全，受益没有写进证词，却替证词延长了寿命。"),
      ],
      effects: [add("resources.wealth", 4), add("career.level", 1), add("relationships.friendship", -5), add("shadow.complicity", 4), add("shadow.harmDone", 5), add("shadow.selfDeception", 4), add("shadow.trustDebt", 6)],
    },
    {
      title: "后来把顺序讲反了",
      minYears: 2,
      maxYears: 4,
      text: [
        variant(older, "后来有人问起那人的下落，你说自己也是听说他有问题以后才作证。多年私怨被挪到故事末尾，像是一件后来才想起、因此无关紧要的小事。"),
        variant(guilty, "对方家人回来问过，你没有否认说过那些话，只反复强调当时人人自危。恐惧是真的，私怨也是真的；你只肯把前者放在桌面上。"),
        variant(hardened, "你保住了位置，也没有因告发受罚。后来邻里仍同你打招呼，却不再在你面前谈别人；大家没有给你定罪，只把闲话改到另一张桌上。"),
        variant(secure, "局势几经变化，那处空位已经成了你的资历或家产。你说若不是你，也会有别人说；这句话没有退还任何东西，却让受益显得像天气一样无人负责。"),
        fallback("旧证词没有重查，那个人也没有回来同你对质。家里只知道你在乱世谨慎自保，街坊则记得另一个顺序；两种记忆在往后的日子里各自站稳。"),
      ],
      effects: [add("relationships.friendship", -3), add("resources.reputation", -1), add("shadow.hardness", 3), add("shadow.selfDeception", 4), add("shadow.trustDebt", 4)],
    },
  ],
});

const refugeeCartFare = darkArc("refugee_cart_fare", {
  eraEnd: 1951,
  yearRange: [1937, 1942],
  ageRange: [18, 72],
  category: "migration",
  lifetimeProbability: 0.11,
  currentRegions: { provinces: WAR_AFFECTED_PROVINCES, cityTiers: ALL_PLACES },
  conditions: {
    all: [C("resources.wealth", "gte", 28)],
    any: [
      { hasTag: "wartime_refugee" },
      { hasTag: "struct_pre49_wartime_evacuation_opening" },
      { hasTag: "struct_pre49_wartime_evacuation_turn" },
      C("career.field", "in", ["farm_work", "manual_worker", "wartime_driver", "trade"]),
    ],
  },
  steps: [
    {
      title: "一辆车先算谁付得起",
      text: [
        variant({ all: [C("career.field", "eq", "wartime_driver")] }, "你替人开车向后方运东西，车厢还剩一点地方。沿路几户人拿首饰求搭载，你收下最值钱的一份，叫其余人继续等；公家的油载了一车私下定价的慌张。"),
        variant(ruralNow, "你家还有一辆能走的牛车，邻里纷纷来问能否同行。你按粮食和现钱多少安排先后，最穷的一户只得到一句牲口也要吃料；牛没有开价，缰绳在你手里。"),
        variant(female, "家里其他人先去探路，车上的位置和价钱由你来定。你收下一名妇人的镯子，仍只准她带一个孩子；她在另外几个孩子之间迟迟没选，你先把镯子放进了衣襟。"),
        variant(secure, "你并不缺眼前几顿饭，仍把车价抬到原来的几倍。你说下一程更险，风险理应值钱；真正没有车的人，连风险也没有资格拿来议价。"),
        fallback("逃难路上车船紧缺，你恰好能支配一辆车或一段载运。你开始按谁付得起决定带谁，家人的路费很快有了着落，队伍后面也很快少了几张熟脸。"),
      ],
      effects: [add("resources.wealth", 5), add("relationships.family", 3), add("resources.reputation", -1), add("shadow.complicity", 3), add("shadow.harmDone", 4), add("shadow.selfDeception", 3), add("shadow.guilt", 1), add("shadow.trustDebt", 4)],
    },
    {
      title: "过桥前又添了一程钱",
      minYears: 1,
      maxYears: 3,
      text: [
        variant({ all: [C("career.field", "eq", "wartime_driver")] }, "前路改道，你说油料和关卡都要另付，又向车里的人加了一次钱。一个人拿不出，行李便被卸在桥头；车辆减轻后确实跑得更快，仪表不会显示是谁留在后面。"),
        variant(ruralNow, "牲口走到半途乏了，你让付钱最少的一户下车步行，把空处留给能再添一袋粮的人。大家都知道车不能压垮，只有卸谁下来仍由你决定。"),
        variant(lowReserve, "所得粮食很快被自家吃掉，你于是又在下一程加价。家人因此没有挨饿，还夸你会想办法；饥饿没有消失，只被赶到车轮后面跟着。"),
        variant(guilty, "一户人把最后一件首饰交给你，你到站后退回一点干粮，却没有退回首饰。你把这点干粮记得很清，像生意最后找过零便算两清。"),
        fallback("路况一坏，你便以绕路、过卡和牲口草料为由再加价。有人交钱，有人被卸下；乱世没有统一价目，正好使每次开口都能叫作临时办法。"),
      ],
      effects: [add("resources.wealth", 5), add("relationships.family", 2), add("relationships.friendship", -4), add("shadow.complicity", 4), add("shadow.harmDone", 5), add("shadow.selfDeception", 4), add("shadow.trustDebt", 5)],
    },
    {
      title: "车轴后来修得很好",
      minYears: 3,
      maxYears: 6,
      text: [
        variant(older, "后来家里总说那辆车养活过一家人，你也爱讲怎样护住牲口和车轴。有人问当年载过谁，你能记住付过大价钱的几户，付不起的那些人则被归进了路上人多。"),
        variant(guilty, "你留着一件当年收下的首饰，多次想托人归还，却始终说不清该找哪一家。它最后成了家中旧物；保存并没有让占有停止，只让来路不至于彻底失踪。"),
        variant(hardened, "靠那几程所得，你修好车又做了些生意。没有人来罚你，邻里还称你有本事；市场恢复后，乱世价格顺利洗成了创业本钱。"),
        variant(migrated, "安顿后，有个曾被你卸下的人在街上认出你，只问那辆车还在不在。你说早卖了，对方点头离开；旧车不在场，旧价钱也没有因此作废。"),
        fallback("车最终坏掉或卖掉，换来的粮钱却混进了后来的日子。家人把它记作一次救命营生，同路人把它记作趁火加价；两边都不必撒谎，只需各自省略一半。"),
      ],
      effects: [add("resources.wealth", 2), add("relationships.family", 2), add("relationships.friendship", -2), add("shadow.hardness", 3), add("shadow.selfDeception", 4), add("shadow.trustDebt", 3)],
    },
  ],
});

const familyRuleKeeper = darkArc("family_rule_keeper", {
  eraEnd: 1950,
  yearRange: [1840, 1935],
  ageRange: [24, 70],
  category: "family",
  lifetimeProbability: 0.11,
  currentRegions: { cityTiers: ALL_PLACES },
  conditions: {
    all: [C("relationships.family", "gte", 35)],
    any: [
      C("meta.age", "gte", 32),
      C("resources.reputation", "gte", 4),
      C("birth.familyClass", "in", PROPERTY_HOMES),
    ],
  },
  steps: [
    {
      title: "你替家里收起了钥匙",
      text: [
        variant({ all: [C("birth.gender", "eq", "female"), C("location.currentCityTier", "in", RURAL_AND_COUNTY)] }, "家里要一名年轻女眷服从定下的婚事，长辈让你收走她的钥匙，夜里也同她睡一屋。你知道她求的是什么，仍劝她别让全家难做；规矩借你的手，显得更像亲人劝亲人。"),
        variant({ all: [C("birth.gender", "eq", "male"), C("location.currentCityTier", "in", RURAL_AND_COUNTY)] }, "族里议一名寡妇和幼辈的田产，长辈叫你在决定上署名。你明知她想另作安排，仍同意把地留在本支代管；代管二字很轻，钥匙却没有交回。"),
        variant(propertyHome, "家中为保住门第和产业，决定替一名年轻亲属安排去处。你负责传话、看住书信，也把对方的反抗解释成不懂事；体面需要许多人合作，最先被省去的是当事人的意见。"),
        variant(precariousHome, "你怕违逆长辈后自家那一份也受牵连，便帮着看住一名想离开的亲属。你没有得到田产，只保住了自己在家族里的位置；共犯有时领到的不是钱，而是一张继续坐席的凳子。"),
        fallback("家里用旧规矩处置一名年轻或失去倚仗的亲属，你被叫去看门、传话或在文书上作证。你告诉对方忍一忍，也告诉自己只是替长辈办事。"),
      ],
      effects: [add("relationships.family", 3), add("resources.reputation", 2), add("resources.freedom", 1), add("shadow.complicity", 5), add("shadow.harmDone", 4), add("shadow.selfDeception", 3), add("shadow.guilt", 2), add("shadow.trustDebt", 4)],
    },
    {
      title: "你成了最懂规矩的人",
      minYears: 2,
      maxYears: 5,
      text: [
        variant(female, "那名亲属终于依了安排，家中夸你会劝人。此后再有女孩或新媳妇不肯低头，长辈总先叫你去；被规矩勒过的人未必反对规矩，有时只是更熟悉绳结。"),
        variant({ all: [C("birth.gender", "eq", "male")] }, "代管的田产并进家里账目，你也分到一些便利。每逢有人问原主意见，族中便说已有众人作证；你的名字混在一排名字里，责任因此看上去薄了一些。"),
        variant(lowReserve, "家族在你最困难时帮过一把，你便更认定当初服从没有错。受损的那名亲属不再同你单独说话，你把疏远理解成她脾气一直如此。"),
        variant(hardened, "你办妥几件家事后，坐席渐渐靠前。后来你已不必亲自锁门，只要说一句家里向来如此，自会有更年轻的人接过钥匙。"),
        fallback("事情按家族的意思落定，你也被认为稳重可靠。那名亲属往后少来往或少开口，家中说人总会想通；沉默恰好替这句话作了伪证。"),
      ],
      effects: [add("relationships.family", 2), add("resources.reputation", 3), add("shadow.complicity", 5), add("shadow.harmDone", 4), add("shadow.selfDeception", 4), add("shadow.trustDebt", 5)],
    },
    {
      title: "家谱写得比那个人安静",
      minYears: 4,
      maxYears: 10,
      text: [
        variant(older, "续家谱时，那件事只剩婚嫁、守产或迁居几个字。你看着整齐的一行，想起当年门内的争吵；纸面终于很安静，仿佛安静便是事情本来的声音。"),
        variant(guilty, "多年后你承认当时不该替家里看住对方，却仍说自己也没有办法。那名亲属没有同你争，只问一句钥匙在谁手里；一句问话把许多年的被动重新分出了人名。"),
        variant(hardened, "家中后来把你称作能维持门户的人，你也平安老去。被安排的人没有回来翻旧账，只让自己的晚辈少同这边亲近；家族没有裂在祠堂里，裂在每次少来的一桌饭上。"),
        variant(propertyHome, "产业保住了，旧决定因此常被证明是为全家好。收益年年可见，被牺牲的一生却分散在别处，算账的人自然更容易看见前者。"),
        fallback("晚辈只听说你当年替家里平过一件难事。你没有纠正平这个字，也没有再提那名亲属后来怎样；记忆最省力的写法，通常同家谱一样只留结果。"),
      ],
      effects: [add("relationships.family", -3), add("shadow.hardness", 2), add("shadow.selfDeception", 4), add("shadow.trustDebt", 4)],
    },
  ],
});

const medicineSubstitution = darkArc("medicine_substitution", {
  eraEnd: 1951,
  yearRange: [1840, 1941],
  ageRange: [17, 68],
  category: "career",
  lifetimeProbability: 0.1,
  currentRegions: { cityTiers: TOWN_AND_CITY },
  conditions: {
    all: [
      C("career.status", "in", ACTIVE),
      C("career.field", "in", ["pharmacy", "healthcare"]),
    ],
  },
  steps: [
    {
      title: "药包里换了一味",
      text: [
        variant({ all: [C("career.field", "eq", "pharmacy"), C("meta.currentYear", "lte", 1911)] }, "药铺师傅嫌一味药价高，叫你用相近的旧货顶上。你照做，还把包角叠得比平日整齐；学徒先学会听话，才有资格讨论方子。"),
        variant(wartime, "战时药材断货，柜上仍照旧价收钱。你把缺的一味换成便宜存货，没有告诉来取药的人；物资短缺是真的，少说一句也是。"),
        variant({ all: [C("career.field", "eq", "healthcare")] }, "你看出一张方子需要更稳妥的药材，掌事的人却让按便宜办法配。你在记录上只写已照方办理，专业二字因此保住了格式，没有保住内容。"),
        variant(lowReserve, "家里正缺钱，你把较好的药材留给能付高价的客人，普通药包里换进次货。差价不大，却够付几日米钱；救急的人与被省下药材的人没有见过面。"),
        fallback("你在药铺或诊所经手配药，为省成本把其中一味换成较次的存货。包装、称重和嘱咐一样不缺，唯独没有告诉病家换过什么。"),
      ],
      effects: [add("resources.wealth", 3), add("career.level", 1), add("shadow.complicity", 4), add("shadow.harmDone", 4), add("shadow.selfDeception", 3), add("shadow.guilt", 2), add("shadow.trustDebt", 4)],
    },
    {
      title: "同一张方子照旧抓",
      minYears: 1,
      maxYears: 3,
      text: [
        variant({ all: [C("career.field", "eq", "pharmacy")] }, "第一次没有人追问，柜上便继续这样抓药。后来新学徒问为何少一味，你也只说铺里向来如此；一句向来，把不安从个人手里转成了店规。"),
        variant({ all: [C("career.field", "eq", "healthcare")] }, "一名病人的家属回来问药后为何更重，你先说病势本就难料，又把记录拿给对方看。记录确实没有写错，它只是从未写下最需要解释的部分。"),
        variant(guilty, "听说一名病人没有好转，你悄悄恢复了后来几包药的用料，却没通知先前那户。改正从今天开始很方便，因为昨天的人已经离开柜台。"),
        variant(hardened, "省下的成本让铺面在短缺中撑了下来，你因此认定做生意不能太死。能继续开门成了最有力的理由，至于谁替这扇门付过身体的代价，没有单独立账。"),
        fallback("病家后来再来抓药，你仍按同样办法替换。手法熟练以后，药包看不出犹豫；职业伦理最先磨损的地方，往往正是动作越来越顺。"),
      ],
      effects: [add("resources.wealth", 4), add("career.level", 2), add("resources.reputation", -1), add("shadow.complicity", 4), add("shadow.harmDone", 5), add("shadow.selfDeception", 4), add("shadow.trustDebt", 5)],
    },
    {
      title: "旧药柜换了主人",
      minYears: 3,
      maxYears: 7,
      text: [
        variant(older, "药柜后来换了主人，旧存货和旧规矩一同清出去。你讲起从业年月，只说最难时什么都缺；这不是谎话，却刚好足以让每个具体药包失去姓名。"),
        variant(guilty, "你在一本旧簿边角补记过替换的药名，没有署名，也没有送给病家。那行字至多使未来翻簿的人知道错误存在，不能使当年喝药的人重新选择。"),
        variant(hardened, "铺子靠节省熬过难年，你也成了熟手。后来客人夸你抓药快准，你接受这份称赞；快是真的，准的标准则一直由柜台里面的人保管。"),
        variant(precariousHome, "你把当年的做法归在穷日子里，像贫穷是一位亲自动手的伙计。家里的米钱确实靠它接上，受损的那户也确实再没回来；两件事实没有替你互相抵消。"),
        fallback("没有官司追来，铺面也照常开过许多年。只是几户人家改去别处取药，从不当面说明原因；行业名声很少轰然倒下，更多时候是一扇门少响几次。"),
      ],
      effects: [add("resources.reputation", -2), add("relationships.friendship", -2), add("shadow.hardness", 2), add("shadow.selfDeception", 3), add("shadow.trustDebt", 4)],
    },
  ],
});

export const structuralPre1949DarkArcEvents = [
  ...deedWithoutClause,
  ...reliefRoster,
  ...changedLock,
  ...privateGrudgeReport,
  ...refugeeCartFare,
  ...familyRuleKeeper,
  ...medicineSubstitution,
];
