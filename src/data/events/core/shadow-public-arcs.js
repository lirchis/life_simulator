// Shadow arcs in public life, work and petty power.
//
// These chains do not treat poverty, an occupation or an era as moral essence.
// Entry always requires a concrete position from which a person can affect
// someone else. Later stages may bring profit, promotion, silence, retaliation,
// belated shame or no visible punishment at all. There are no player choices.

const RURAL = { cityTiers: ["village", "town"] };
const URBAN = { cityTiers: ["county", "city", "tier2", "tier1"] };
const TOWN_AND_CITY = { cityTiers: ["town", "county", "city", "tier2", "tier1"] };
const ALL_PLACES = { cityTiers: ["village", "town", "county", "city", "tier2", "tier1"] };

const add = (path, value) => ({ path, add: value });
const has = (path, operator, value) => ({ path, [operator]: value });
const between = (eventId, minYears, maxYears) => ({ eventOccurredBetween: { eventId, minYears, maxYears } });
const tagged = (tag) => ({ hasTag: tag });
const text = (conditions, copy) => ({ conditions, text: copy });
const fallback = (copy) => ({ text: copy });

const lowWealth = { all: [has("resources.wealth", "lte", 48)] };
const secure = { all: [has("resources.wealth", "gte", 64)] };
const educated = { all: [has("education.score", "gte", 58)] };
const migrated = { all: [has("location.migratedTimes", "gte", 1)] };
const female = { all: [has("birth.gender", "eq", "female")] };
const older = { all: [has("meta.age", "gte", 50)] };
const guilty = { all: [has("shadow.guilt", "gte", 7)] };
const hardened = { all: [has("shadow.hardness", "gte", 7), has("shadow.selfDeception", "gte", 6)] };
const resentful = { all: [has("shadow.resentment", "gte", 6)] };
const distrusted = { all: [has("shadow.trustDebt", "gte", 9)] };

function joinConditions(required, extra = {}) {
  return {
    all: [...required, ...(extra.all ?? [])],
    ...(extra.any ? { any: extra.any } : {}),
    ...(extra.none ? { none: extra.none } : {}),
  };
}

function careerRule(config, path) {
  return config.conditions?.all?.find((condition) => condition.path === path);
}

function continuationText(step, config, index) {
  if (index === 0 || !step.leftRoleText) return step.text;
  const statusRule = careerRule(config, "career.status");
  const fieldRule = careerRule(config, "career.field");
  const statuses = statusRule?.in ?? (statusRule?.eq ? [statusRule.eq] : []);
  const fields = fieldRule?.in ?? (fieldRule?.eq ? [fieldRule.eq] : []);
  if (!statuses.length || !fields.length) return step.text;

  const roleHeld = [has("career.status", "in", statuses), has("career.field", "in", fields)];
  const openingCityTiers = config.currentRegions?.cityTiers ?? [];
  const roleHeldHere = step.awayText && openingCityTiers.length
    ? [...roleHeld, has("location.currentCityTier", "in", openingCityTiers)]
    : roleHeld;
  const roleLeft = {
    any: [has("career.status", "notIn", statuses), has("career.field", "notIn", fields)],
  };
  return [
    text(roleLeft, step.leftRoleText),
    ...(step.awayText && openingCityTiers.length ? [
      text({ all: [...roleHeld, has("location.currentCityTier", "notIn", openingCityTiers)] }, step.awayText),
    ] : []),
    ...step.text.map((variant) => variant.conditions
      ? { ...variant, conditions: joinConditions(roleHeldHere, variant.conditions) }
      : variant),
  ];
}

function makeChain(key, config) {
  const stages = ["begin", "deepen", "consequence"];
  const ids = stages.map((stage) => `shadow_public_${key}_${stage}`);
  const stageTags = stages.map((stage) => `shadow_public_${key}_${stage}`);

  return config.steps.map((step, index) => {
    const required = index === 0
      ? [{ missingTag: "shadow_public_actor" }]
      : [between(ids[index - 1], step.minYears ?? (index === 1 ? 2 : 3), step.withinYears ?? 9), tagged(stageTags[index - 1])];
    const dependencyThreshold = index === 1
      ? [has("shadow.complicity", "gte", 2)]
      : index === 2
        ? [has("shadow.harmDone", "gte", 3)]
        : [];
    const minimumDelay = config.steps.slice(1, index + 1)
      .reduce((sum, item, offset) => sum + (item.minYears ?? (offset === 0 ? 2 : 3)), 0);
    const maximumDelay = config.steps.slice(1, index + 1)
      .reduce((sum, item) => sum + (item.withinYears ?? 9), 0);
    const yearRange = step.yearRange ?? (index === 0
      ? config.yearRange
      : [config.yearRange[0] + minimumDelay, Math.min(2120, config.yearRange[1] + maximumDelay)]);
    const ageRange = step.ageRange ?? (index === 0
      ? config.ageRange
      : [config.ageRange[0] + minimumDelay, Math.min(99, config.ageRange[1] + maximumDelay)]);
    const next = config.steps[index + 1];
    const nextDelay = next
      ? [next.minYears ?? (index === 0 ? 2 : 3), next.withinYears ?? 9]
      : null;
    const currentRegions = step.currentRegions ?? (index === 0 ? config.currentRegions : undefined);
    return {
      id: ids[index],
      title: step.title,
      category: step.category ?? config.category,
      yearRange,
      ageRange,
      ...(currentRegions ? { currentRegions } : {}),
      conditions: joinConditions(
        [...required, ...dependencyThreshold],
        step.conditions ?? (index === 0 ? config.conditions : {}),
      ),
      ...(index > 0 ? { requiresEvents: [ids[index - 1]] } : {}),
      maxOccurrences: 1,
      // A public shadow turn should remain uncommon across a whole life, but
      // once it begins the two authored follow-ups must not be drowned by the
      // much larger general event pool.
      baseWeight: index === 0 ? 42 : index === 1 ? 96 : 120,
      ...(index === 0 ? { lifetimeProbability: config.lifetimeProbability ?? 0.2 } : {}),
      narrativeTier: index === 0 ? "turning_point" : "consequence",
      narrativeDomain: `shadow_${key}`,
      narrativeThread: index === 2
        ? { close: true }
        : { expiresAfterYears: config.steps[index + 1]?.withinYears ?? 9 },
      text: continuationText(step, config, index),
      effects: [
        ...(step.effects ?? []),
        ...(nextDelay ? [{
          scheduleEvent: {
            eventId: ids[index + 1],
            delayYears: nextDelay,
            // Openings remain rare. Once one occurs, its responsibility and
            // memory trace must survive a crowded yearly event pool.
            weightMultiplier: index === 0 ? 24 : 16,
          },
        }] : []),
        { addTag: "shadow_public_actor" },
        { addTag: `shadow_public_${key}` },
        { addTag: stageTags[index] },
      ],
    };
  });
}

const rentMeasure = makeChain("rent_measure", {
  yearRange: [1840, 1911],
  ageRange: [20, 62],
  currentRegions: RURAL,
  category: "wealth",
  lifetimeProbability: 0.4,
  conditions: {
    all: [has("career.status", "in", ["employed", "self_employed", "family_labor"]), has("career.field", "in", ["farm_work", "grassroots_post", "small_business", "trade"])],
    any: [has("career.level", "gte", 5), has("resources.reputation", "gte", 4)],
    none: [{ hasTag: "shadow_public_rent_measure" }],
  },
  steps: [
    {
      title: "斗沿多压了一掌",
      text: [
        text(lowWealth, "东家叫你代收租谷，你把斗摇得比往年更实。家里也正缺钱，你告诉自己不过是照旧例做得认真些；佃户看着粮面下沉，没有同你争。"),
        text(educated, "你识得契纸和数目，便被请来量租。斗沿本可平平刮过，你却顺手多压一掌；账页仍旧端正，端正得看不出那一掌。"),
        fallback("收租时，你默许量斗偏向东家一点。多出的谷分到仓里看不出，落到每户灶上，却是几顿饭。"),
      ],
      effects: [add("shadow.hardness", 2), add("shadow.guilt", 1), add("shadow.complicity", 3), add("shadow.harmDone", 3), add("shadow.selfDeception", 3), add("shadow.trustDebt", 4), add("resources.wealth", 1)],
    },
    {
      title: "仓里多出几袋",
      leftRoleText: "你后来不再经手收租，旧量法却没有跟着你离开。后来接手的人仍照你留下的手势压斗，也有人记得第一年是谁先把多出来的一掌说成惯例；你失去了那只斗，没失去这笔来路。",
      awayText: "你已经搬离收租的地方，旧量法却仍由后来的人照用。偶尔有旧识捎来一句那边还是那样，你先问收成，始终没有问那只斗又从谁家多量了多少。",
      text: [
        text(guilty, "第二年再量租，你认得那几张盯着斗沿的脸，手还是照旧压下去。回家后你少吃了一碗，像是能从自己碗里补回别人失去的谷。"),
        text(hardened, "仓里年年多出几袋，东家夸你办事稳妥。你渐渐把佃户的沉默当成同意，把自己的熟练当成公道。"),
        fallback("这套量法成了惯例，新来的佃户也只被告知向来如此。连你自己后来也很少再提，第一年那只手原本可以不压下去。"),
      ],
      effects: [add("shadow.hardness", 3), add("shadow.complicity", 3), add("shadow.harmDone", 4), add("shadow.selfDeception", 2), add("shadow.trustDebt", 4), add("resources.reputation", 2)],
      withinYears: 7,
    },
    {
      title: "斗还在仓角",
      leftRoleText: "你早已不在仓边，旧相识说起那只偏斗时仍有人记得你。没有人专程追来讨账，你也不再有机会用一袋粮把旧事讲成已经两清。",
      awayText: "你在别处安顿下来后，听说那只斗还留在旧仓。没有人追到新住处同你算账，偏斗也不需要认路；它只要被下一双手拿起，旧办法便能继续下去。",
      text: [
        text(guilty, "多年后你托人给一户困难人家送去一袋粮，没有留下名字。量斗仍在仓角，你也没有把旧账算清，只是不再敢说自己从未亏欠谁。"),
        text(hardened, "后来换了东家，旧斗仍照样使用。你安稳退下，村里有人见你仍客气；客气不是原谅，只是他们还要从这条路经过。"),
        fallback("一户佃农最终迁走，临行把那只斗骂了一句，没有提你的名字。你没有受罚，只从此不太愿意经过他家空下的门。"),
      ],
      effects: [add("shadow.hardness", 1), add("shadow.trustDebt", 2), add("shadow.resentment", 1)],
      withinYears: 12,
    },
  ],
});

const guildCredit = makeChain("guild_credit", {
  yearRange: [1840, 1911],
  ageRange: [22, 58],
  currentRegions: URBAN,
  category: "career",
  lifetimeProbability: 0.4,
  conditions: {
    all: [has("career.status", "in", ["employed", "self_employed", "family_labor"]), has("career.field", "in", ["apprentice", "manual_worker", "family_workshop", "small_business", "trade"])],
    any: [has("career.status", "eq", "self_employed"), has("career.level", "gte", 8), has("resources.reputation", "gte", 5)],
  },
  steps: [
    {
      title: "落款只写了你",
      text: [
        text(secure, "铺里一件难活主要由年轻学徒做成，你交货时只报了自己的名号。客人付得痛快，你说学徒本来就是跟着师傅学。"),
        text(lowWealth, "你急着保住这位大客，把学徒想出的办法说成自己的经验。赏钱救了这个月的账，也把另一个人的名字留在柜台下面。"),
        fallback("学徒做成一件漂亮活，你在会馆和客人面前把功劳收进自己名下。回铺后只说了一句年轻人还要多磨。"),
      ],
      effects: [add("shadow.hardness", 2), add("shadow.guilt", 1), add("shadow.complicity", 2), add("shadow.harmDone", 3), add("shadow.selfDeception", 3), add("shadow.resentment", 1), add("shadow.trustDebt", 4), add("career.level", 2)],
    },
    {
      title: "名声长在别人手上",
      leftRoleText: "你已经离开原来的铺子，招牌上的名声却仍跟着你。旧学徒没有追来争辩，只在别处把那套做法重新做了一遍；别人问起师承时，他把你的名字略了过去。",
      text: [
        text(guilty, "同行又夸你手艺精进时，你下意识看了一眼学徒。他低头磨刀，没有拆穿；那份沉默比一句指责更难接。"),
        text(hardened, "你凭那件活接到更多生意，也让学徒继续做最难的部分。你说这是给他历练，工钱却仍按最初那份算。"),
        fallback("客人渐渐只认你的招牌，真正动手的人在后间换了几个。名声越稳定，来源反而越不必说明。"),
      ],
      effects: [add("shadow.hardness", 3), add("shadow.complicity", 3), add("shadow.harmDone", 4), add("shadow.selfDeception", 3), add("shadow.trustDebt", 4), add("resources.reputation", 4)],
      withinYears: 8,
    },
    {
      title: "对街的新招牌",
      leftRoleText: "你不再守着原来的柜台，旧学徒也早已另谋生计。那件难活仍被人算在你的履历里，他的名字则只留在少数同行的记性中；离开没有替任何一方改写落款。",
      text: [
        text(guilty, "你晚些时候在旧账边补写了学徒的名字，也把一件工具送给他。字补得太晚，至多证明你终于承认，不足以把那些年还回去。"),
        text(hardened, "学徒离开后在对街开铺，你告诉同行他忘恩。他没有争辩，只把自己的名字写得很大；你仍有老客，生意并未立刻惩罚谁。"),
        fallback("学徒另投一家，临走只带走自己的手。多年后客人夸起对街新铺，你听见熟悉的做法，没有说那原本是谁教谁。"),
      ],
      effects: [add("shadow.resentment", 2), add("shadow.trustDebt", 2), add("resources.reputation", -1)],
      withinYears: 12,
    },
  ],
});

const famineStock = makeChain("famine_stock", {
  yearRange: [1845, 1949],
  ageRange: [25, 65],
  currentRegions: TOWN_AND_CITY,
  category: "wealth",
  lifetimeProbability: 0.36,
  conditions: {
    all: [has("resources.wealth", "gte", 38), has("career.status", "in", ["self_employed", "family_labor", "employed"]), has("career.field", "in", ["small_business", "trade", "cross_border_trade", "township_business", "farm_work"])],
  },
  steps: [
    {
      title: "先收进后仓",
      text: [
        text(migrated, "你比本地人更早听见运路受阻的消息，便托几处关系把粮先收进后仓。你称这是给家人留退路，收购价却没有告诉来卖粮的人。"),
        text(secure, "市面刚显紧张，你便把能买的粮都收下。家里不愁吃，你仍说仓里有货才不慌；慌的人很快变成了仓外那些人。"),
        fallback("灾年消息未定，你先压低价收进一批粮。卖粮的人急着换药钱，你没有催，只让算盘等在桌上。"),
      ],
      effects: [add("shadow.hardness", 2), add("shadow.guilt", 1), add("shadow.complicity", 3), add("shadow.harmDone", 4), add("shadow.selfDeception", 3), add("shadow.resentment", 1), add("shadow.trustDebt", 4), add("resources.wealth", 4)],
    },
    {
      title: "仓门关得更紧",
      leftRoleText: "你后来不再经手粮食，先前囤下的那批货却已换成钱或家用。街上的饥饿没有跟着你换行当，别人问起时，你只说自己早就不做那门生意了。",
      text: [
        text(guilty, "粮价再涨时，你夜里听见有人敲后门求赊，最后只卖了一小袋。你把这点让步记得很重，仿佛足以替整仓货作证。"),
        text(hardened, "你分批放货，每次都说库存将尽。利润被称作承担风险的回报，至于风险主要落在谁的饭锅里，账本没有那一栏。"),
        fallback("街上开始有人排队，你仍等更高的价。仓门关紧以后，外面的饥饿听起来像市场传闻。"),
      ],
      effects: [add("shadow.hardness", 3), add("shadow.complicity", 3), add("shadow.harmDone", 5), add("shadow.selfDeception", 3), add("shadow.trustDebt", 5), add("resources.wealth", 6)],
      withinYears: 5,
    },
    {
      title: "价落之后",
      leftRoleText: "你早已离开粮行，靠那批货留下的钱却混进了后来的日子。旧顾客不再来往，也没人专门追究；来路被时间磨淡，不等于从账上消失。",
      text: [
        text(guilty, "年景恢复后，你不再谈那批粮，只给地方善举捐过几次钱。匾额记住了捐款，没有记录钱最初怎样来到你手里。"),
        text(hardened, "你靠那次买卖添了铺面，后来被人称作会看行情。没有官司，也没有清算；苦日子过去后，财富替来路换了一个体面的说法。"),
        fallback("一个曾在仓外求粮的人后来成了你的供货者，见面只谈价格。他没有报复，也没有忘，信任被从买卖里永远扣掉一点。"),
      ],
      effects: [add("shadow.hardness", 1), add("shadow.trustDebt", 3)],
      withinYears: 10,
    },
  ],
});

const doubleLedger = makeChain("double_ledger", {
  yearRange: [1912, 1949],
  ageRange: [22, 60],
  currentRegions: URBAN,
  category: "career",
  lifetimeProbability: 0.38,
  conditions: {
    all: [has("career.status", "in", ["employed", "self_employed"]), has("education.score", "gte", 38), has("career.field", "in", ["small_business", "trade", "professional", "grassroots_post", "state_unit", "public_sector", "corporate", "township_accounting"])],
  },
  steps: [
    {
      title: "账页之间留一笔",
      text: [
        text(lowWealth, "家里正等钱用，你在货款和脚费之间留下一笔不大的差额。数目小得不会立刻惊动掌柜，大得足够让你回家时多带一包米。"),
        text(educated, "你熟悉账法，便知道哪项损耗最难核实。那笔钱被写进一处合理的空白，连你自己重看时都觉得格式很妥帖。"),
        fallback("掌柜叫你兼看账目，你把一笔支出多写了一点，差额留在自己手里。墨迹干后，错误看上去比诚实更整齐。"),
      ],
      effects: [add("shadow.hardness", 2), add("shadow.guilt", 2), add("shadow.complicity", 3), add("shadow.harmDone", 2), add("shadow.selfDeception", 3), add("shadow.trustDebt", 4), add("resources.wealth", 3)],
    },
    {
      title: "两本账都能对上",
      leftRoleText: "你已经离开那张账桌，旧账却仍由留下的人照着解释。有人偶尔来问一处对不上的数，你说年月久了记不清；那处空白反而比许多正数更耐久。",
      text: [
        text(guilty, "你开始另记一张小纸，怕自己忘了哪些数动过。纸越写越密，你反而不敢停手，停下像是在承认前面的每一笔。"),
        text(hardened, "几次盘账都平安过去，你又替上司遮过一笔更大的差额。自此你不只拿钱，也成了别人放心继续拿钱的理由。"),
        fallback("账目逐渐形成两套解释：一套给查账的人，一套只存在于你和少数人的记性里。大家互相握住把柄，关系因此显得格外牢靠。"),
      ],
      effects: [add("shadow.hardness", 3), add("shadow.complicity", 5), add("shadow.harmDone", 3), add("shadow.selfDeception", 3), add("shadow.trustDebt", 5), add("resources.wealth", 4)],
      withinYears: 6,
    },
    {
      title: "查账的人翻过那一页",
      leftRoleText: "清查来时你已不在原处，旧同事把差额归进前任留下的问题。你没有回去说明，也没有因此受罚；离职替你制造了距离，没有制造无辜。",
      text: [
        text(guilty, "一次查账前，你悄悄补回部分差额，仍有旧账无法填平。查账的人翻过去后，你没有轻松，只第一次知道侥幸也会增加重量。"),
        text(hardened, "清查时，上司把一处差错推给已经离职的伙计，你没有开口。账过了，你还升了一格；任命公文只写你熟悉业务，没有写那天你沉默了什么。"),
        fallback("一笔旧账终于露出破绽，你退赔了钱，却让最年轻的账房先担了骂名。事情结了，同行仍愿用你，只是不再把钥匙单独交给你。"),
      ],
      effects: [add("shadow.complicity", 2), add("shadow.trustDebt", 3)],
      withinYears: 10,
    },
  ],
});

const meetingDenunciation = makeChain("meeting_denunciation", {
  yearRange: [1955, 1976],
  // Leave enough working years for the second-stage workplace consequence.
  ageRange: [18, 52],
  currentRegions: ALL_PLACES,
  category: "relationship",
  lifetimeProbability: 0.38,
  conditions: {
    all: [has("career.status", "in", ["employed", "family_labor"]), has("career.level", "gte", 2), has("career.field", "in", ["factory", "state_unit", "production_team", "grassroots_post", "public_sector", "manual_worker", "farm_work"])],
  },
  steps: [
    {
      title: "会上又补了一句",
      text: [
        text(female, "会上气氛逼人，你怕自己成为下一个被追问的人，便补说了同事一件私下小事。满屋人立刻有了新材料，也暂时不再看你。"),
        text(lowWealth, "你担心失去眼前这份生计，顺着众人的话又加了一句。那句话未必最重，却让你安全地站回了多数人里。"),
        fallback("轮到你表态时，你把一件本可不说的事写进了会议记录，被围住的人又少了一条退路。"),
      ],
      effects: [add("shadow.hardness", 2), add("shadow.guilt", 2), add("shadow.complicity", 4), add("shadow.harmDone", 4), add("shadow.selfDeception", 2), add("shadow.resentment", 1), add("shadow.trustDebt", 5), add("resources.reputation", 1)],
    },
    {
      title: "座位往前挪了",
      leftRoleText: "你后来离开了原来的单位或队伍，那句话带来的安全却已经用过。旧同事偶尔提到被调走的人，你说自己也只是熬过那几年；这话不全是假，也没有说全。",
      text: [
        text(guilty, "那人被调走后，你坐到了他原来的位置。抽屉里还留着一支削到很短的铅笔，你用了几天，最后还是扔了。"),
        text(hardened, "你被认为立场清楚，会议上发言的次序也往前了。后来再有人被点名，你已经懂得在什么时候先开口。"),
        fallback("组织把你调到更稳妥的位置，没人明说这同那句话有关。受益若不写在通知里，便很容易被解释成纯粹能力。"),
      ],
      effects: [add("shadow.hardness", 3), add("shadow.complicity", 4), add("shadow.harmDone", 4), add("shadow.selfDeception", 3), add("shadow.trustDebt", 5), add("career.level", 3), add("resources.reputation", 2)],
      withinYears: 5,
    },
    {
      title: "名字从名单上淡下去",
      leftRoleText: "你早已不在当年的单位，名单上的名字也换了几轮。那句补充没有随档案一起作废；你偶尔把它讲成不得已，讲得越熟，越像在替一个已经离职的人辩护。",
      text: [
        text(guilty, "多年后你在旧纸上又看见那人的名字，想起自己补过的那句话。你没有找到对方，只把这件事第一次完整说给家人听。"),
        text(hardened, "风向变过几次，你始终说当时人人都那样。后来没人专门追究你，解释重复久了，连语气都磨得像事实。"),
        fallback("旧同事后来回来办事，见到你只点了一下头。没有争吵，也没有和解；你们之间那段沉默比会议持续得更久。"),
      ],
      effects: [add("shadow.selfDeception", 1), add("shadow.trustDebt", 3), add("relationships.friendship", -2)],
      withinYears: 18,
    },
  ],
});

const ruleWindow = makeChain("rule_window", {
  yearRange: [1950, 1988],
  ageRange: [20, 65],
  currentRegions: URBAN,
  category: "career",
  lifetimeProbability: 0.4,
  conditions: { all: [has("career.status", "eq", "employed"), has("career.level", "gte", 6), has("career.field", "in", ["state_unit", "grassroots_post", "public_sector", "professional"])] },
  steps: [
    {
      title: "窗口准时合上",
      text: [
        text(lowWealth, "你也知道多跑一趟有多难，却仍在下班点准时合上窗口。门外的人说家里有急事，你指了指墙上的时间，像时间替你作了决定。"),
        text(older, "你在窗口做久了，最怕别人拿特殊情况磨掉规矩。那天一位老人迟到几分钟，你没有收材料，还觉得自己守住了公平。"),
        fallback("办事时间刚过，你拒绝了一个已经排到眼前的人。章在抽屉里，规则在墙上，真正把窗口合上的仍是你的手。"),
      ],
      effects: [add("shadow.hardness", 3), add("shadow.guilt", 1), add("shadow.complicity", 2), add("shadow.harmDone", 2), add("shadow.selfDeception", 4), add("shadow.trustDebt", 3), add("resources.reputation", 1)],
    },
    {
      title: "大家来学你的办法",
      leftRoleText: "你已经离开窗口，后来人仍沿用你整理的拒件话术。你不再亲手合上那扇窗，旧办法却替你继续准时下班；责任从岗位上卸下了，痕迹没有。",
      text: [
        text(guilty, "你后来遇到相似情况，偶尔悄悄把材料压在下班前收进来。你没有改变规则，只学会把一点人情藏在不被同事看见的地方。"),
        text(hardened, "上级夸你窗口差错少，让新人照你的做法。你把不解释、不通融称为专业，群众意见也更容易被记成手续问题。"),
        fallback("你整理出一套拒件话术，句句礼貌，效率很高。来办事的人生气时，也很难指出究竟哪一句不对。"),
      ],
      effects: [add("shadow.hardness", 3), add("shadow.complicity", 3), add("shadow.harmDone", 3), add("shadow.selfDeception", 3), add("shadow.trustDebt", 4), add("career.level", 2)],
      withinYears: 7,
    },
    {
      title: "一张退回的表",
      leftRoleText: "离开原岗位后，你在别处听见有人抱怨那套窗口规矩。你先说制度不是一个人定的，停了一会儿，又想起最初把每句话整理得那么顺的人正是自己。",
      text: [
        text(guilty, "你离开窗口岗位前替一个材料不全的人把缺项逐条写清，又多等了十分钟。那不是偿还，只让你承认规则可以由人执行得不那么伤人。"),
        text(hardened, "你凭少出差错顺利升迁，墙上还挂过先进照片。那些被退回的人没有出现在统计里，统计因此一直很好看。"),
        fallback("多年后有人认出你，说家里曾因一张退表耽误很久。你记不起具体那次，对方却连窗口上的划痕都记得。"),
      ],
      effects: [add("shadow.hardness", 1), add("shadow.trustDebt", 3)],
      withinYears: 14,
    },
  ],
});

const withheldWages = makeChain("withheld_wages", {
  yearRange: [1978, 2018],
  ageRange: [25, 62],
  currentRegions: TOWN_AND_CITY,
  category: "wealth",
  lifetimeProbability: 0.4,
  conditions: {
    all: [has("career.status", "in", ["self_employed", "employed"]), has("resources.wealth", "gte", 35), has("career.field", "in", ["construction", "small_business", "trade", "logistics", "township_business", "township_enterprise", "startup"])],
    any: [has("career.status", "eq", "self_employed"), has("career.level", "gte", 10)],
  },
  steps: [
    {
      title: "工资再等一周",
      text: [
        text(migrated, "你自己也曾在外地等过工钱，如今轮到你管一支队伍，却把工资压到下笔款后再发。你说大家都懂周转，没人问他们房租是否也懂。"),
        text(secure, "手里并非完全没钱，你仍先拿去接下一单，把工人的工资往后排。扩张写进计划，欠薪只对工人解释一句再等等。"),
        fallback("项目款尚未结清，你决定先拖一周工资。风险没有消失，只从你的账上挪到了每个工人的饭桌。"),
      ],
      effects: [add("shadow.hardness", 3), add("shadow.guilt", 1), add("shadow.complicity", 3), add("shadow.harmDone", 4), add("shadow.selfDeception", 3), add("shadow.resentment", 1), add("shadow.trustDebt", 5), add("resources.wealth", 4)],
    },
    {
      title: "用旧工资接新工程",
      leftRoleText: "你已不再管原来那摊生意，旧欠条却还在人手里传。有人找到你如今的住处或单位，你说账要向原项目算；项目没有嘴，便只剩他们继续等。",
      text: [
        text(guilty, "有人来问孩子学费，你先发了他一部分，又让他别告诉别人。你把偏私当成善意，欠下的总数仍没有减少。"),
        text(hardened, "你用压下的工资垫资接到新工程，规模很快做大。饭局上别人夸你敢周转，没有人请工人来解释这个‘敢’由谁出钱。"),
        fallback("欠薪逐渐滚过两个月，你开始避免到工地太早或太晚。真正需要你的人，恰好总在这两个时段等。"),
      ],
      effects: [add("shadow.hardness", 3), add("shadow.complicity", 4), add("shadow.harmDone", 5), add("shadow.selfDeception", 3), add("shadow.trustDebt", 5), add("resources.wealth", 5), add("career.level", 2)],
      withinYears: 4,
    },
    {
      title: "人走了，活还在",
      leftRoleText: "原来的队伍散了，你也转行、停业或退了下来。偶尔还有人问那笔工资，你把旧账说成当年周转失败；失败听起来没有主语，欠款的人却仍记得是谁让他们再等一周。",
      text: [
        text(guilty, "你后来卖掉一件设备补发大半工资，仍有人没拿全。你在补款收条上写清数目，没有写道歉；有些词比钱更难落笔。"),
        text(hardened, "熟练工陆续离开，你又招来新人，把离开说成他们吃不了苦。工程仍做下去，代价被更新成一批不认识旧账的人。"),
        text(resentful, "工人联名追款后，你只记住他们堵门时说过的难听话，很少再想工资为何拖到那天。你把自己讲成被逼到墙角的人，欠钱的人反而先有了委屈。"),
        fallback("工人联名追款后，你付了一部分并换了联系人。没有人被彻底讨回公道，你也没能再组起原来那支队伍。"),
      ],
      effects: [add("shadow.resentment", 3), add("shadow.trustDebt", 4), add("resources.reputation", -3)],
      withinYears: 9,
    },
  ],
});

const stolenCredit = makeChain("stolen_credit", {
  yearRange: [1985, 2050],
  ageRange: [25, 65],
  currentRegions: URBAN,
  category: "career",
  lifetimeProbability: 0.4,
  conditions: { all: [has("career.status", "eq", "employed"), has("education.score", "gte", 50), has("career.level", "gte", 10), has("career.field", "in", ["corporate", "professional", "public_sector", "state_unit", "startup"])] },
  steps: [
    {
      title: "名单里少了一个名字",
      text: [
        text(female, "你知道团队里年轻女性的贡献常被略过，汇报时仍把她的分析并进自己的结论。你说先把项目保住，以后再给机会。"),
        text(secure, "你已站在更稳的位置，仍把下属完成的关键部分放进自己的发言。掌声来时你没有更正，会议也没有预留更正环节。"),
        fallback("最终材料里，你把年轻同事的名字移到不显眼处，自己的名字留在第一页。底稿和改过的名单留着痕迹，参会的人未必会看。"),
      ],
      effects: [add("shadow.hardness", 2), add("shadow.guilt", 2), add("shadow.complicity", 3), add("shadow.harmDone", 3), add("shadow.selfDeception", 3), add("shadow.resentment", 1), add("shadow.trustDebt", 5), add("resources.reputation", 3)],
    },
    {
      title: "掌声记住了你",
      leftRoleText: "你已经离开原来的团队，那项成果仍留在履历上。旧同事没有追着你改名单，只是不再替你证明当年的合作；纸上的功劳比关系保存得更完整。",
      text: [
        text(guilty, "你得奖后在私下说团队都很辛苦，却仍没在公开记录里补回名字。良心获得了一句谦虚，履历继续获得全部成果。"),
        text(hardened, "那次成果让你升职，你开始相信带团队本身就等于拥有团队产出。下属做得越好，越能证明你领导有方。"),
        fallback("更多人把工作先发给你审核，署名顺序也渐成惯例。侵占一旦写进流程，便不再需要每次亲自动手。"),
      ],
      effects: [add("shadow.hardness", 3), add("shadow.complicity", 4), add("shadow.harmDone", 4), add("shadow.selfDeception", 4), add("shadow.trustDebt", 5), add("career.level", 4), add("resources.reputation", 3)],
      withinYears: 7,
    },
    {
      title: "轮到别人审你的名字",
      leftRoleText: "你转行或离职以后，旧名单仍被后来的人引用。真正做成关键部分的人在新的地方只从头积累，你则继续带着那项成果；没有公开争执，档案也不会自己感到难堪。",
      text: [
        text(guilty, "你后来在一次公开回顾里补提了当年的贡献者。对方只回了一句收到；迟到的承认能修正档案，不能要求别人配合感动。"),
        text(hardened, "旧下属后来成了评审，照章驳回你的项目，没有提旧事。你认定这是报复，也第一次发现规则落在自己身上时格外锋利。"),
        fallback("你一直保有那项荣誉，旧同事也没有公开追究。只是年轻人不再把最好的想法先告诉你，团队看起来服从，创造力却搬了出去。"),
      ],
      effects: [add("shadow.resentment", 2), add("shadow.trustDebt", 3), add("relationships.friendship", -3)],
      withinYears: 14,
    },
  ],
});

const safetyBlame = makeChain("safety_blame", {
  yearRange: [1990, 2060],
  ageRange: [25, 65],
  currentRegions: TOWN_AND_CITY,
  category: "career",
  lifetimeProbability: 0.38,
  conditions: { all: [has("career.status", "eq", "employed"), has("career.level", "gte", 8), has("career.field", "in", ["construction", "factory", "mine_worker", "logistics", "arsenal_worker", "wartime_factory", "township_enterprise"])] },
  steps: [
    {
      title: "报告写成个人失误",
      text: [
        text(educated, "你知道排班和设备都出了问题，报告里仍只写操作人员未按流程。结构原因太难整改，一个人的名字很容易填进责任栏。"),
        text(lowWealth, "你怕事故扩大后整个部门受罚，也怕自己丢掉位置，便同意把原因写成一线人员疏忽。保住大家的说法，先牺牲了最没资格说话的那个人。"),
        fallback("事故复盘时，你删掉了关于赶工和长期故障的两段，只留下个人操作失误。报告因此很快通过。"),
      ],
      effects: [add("shadow.hardness", 2), add("shadow.guilt", 2), add("shadow.complicity", 5), add("shadow.harmDone", 4), add("shadow.selfDeception", 3), add("shadow.resentment", 1), add("shadow.trustDebt", 5), add("resources.reputation", 2)],
    },
    {
      title: "整改只多了一张表",
      leftRoleText: "你调离、转业或退休后，那份事故报告仍在档案里。后来部门添了检查表，却没有重写责任；你不再签字，最初被写进去的那个人却还背着那个名字。",
      text: [
        text(guilty, "你推动增加了一项检查，却没敢重开事故责任。新表每天有人签字，旧设备仍偶尔异响；补救被限制在不推翻自己那份报告的范围里。"),
        text(hardened, "上级夸你处置及时，你也升去管更大的团队。后来每逢事故，你先问谁签过字，仿佛签名能替设备承受磨损。"),
        fallback("部门开展培训、贴出提醒，赶工节奏没有改变。组织做了许多看得见的动作，恰好避开最费钱的那一个。"),
      ],
      effects: [add("shadow.hardness", 3), add("shadow.complicity", 5), add("shadow.harmDone", 4), add("shadow.selfDeception", 4), add("shadow.trustDebt", 5), add("career.level", 3)],
      withinYears: 6,
    },
    {
      title: "第二份相似报告",
      leftRoleText: "旧单位后来又出过相似问题，有人翻到你写的那份报告，把措辞照用了一遍。你已没有权限更改，也没有主动补充；离开现场以后，沉默仍能成为一种参与。",
      text: [
        text(guilty, "相似问题再次出现时，你终于把排班和设备写进报告，也附上旧记录。坦白让你受了处分，受伤的人却不必再独自背着全部原因。"),
        text(hardened, "第二次事故仍被拆成几个个人失误，你已很熟悉措辞。部门继续运转，你也继续升迁；伤者离开后，岗位很快补上了新人。"),
        text(distrusted, "一线人员不再把小故障先告诉你，宁可彼此私下处理。你仍掌握正式报告，却失去了最早的那几分钟；信任欠得太多，安全也会绕开管理者。"),
        fallback("旧伤者把两份报告交给外部调查，你没有被单独定为主责，却失去了同事的信任。法律只切下一部分责任，剩下的仍在走廊里跟着你。"),
      ],
      effects: [add("shadow.complicity", 2), add("shadow.trustDebt", 4)],
      withinYears: 12,
    },
  ],
});

const rulesAsWeapon = makeChain("rules_as_weapon", {
  yearRange: [2000, 2080],
  ageRange: [22, 68],
  currentRegions: TOWN_AND_CITY,
  category: "career",
  lifetimeProbability: 0.4,
  conditions: { all: [has("career.status", "eq", "employed"), has("career.level", "gte", 6), has("career.field", "in", ["state_unit", "grassroots_post", "public_sector", "professional"])] },
  steps: [
    {
      title: "系统显示不符合",
      text: [
        text(migrated, "来办事的人因迁居材料衔接不上，你看得懂问题，却只把屏幕上的不符合念了一遍。你也曾被陌生城市的手续难住，如今坐在了屏幕另一边。"),
        text(lowWealth, "你知道对方承担不起反复补件的路费，仍按指标把申请退回。多解释会拖慢办理量，贫困在表格里没有额外分钟。"),
        fallback("系统给出不符合，你没有继续查人工复核入口。拒绝只需一次点击，申诉要由对方准备一整套证明。"),
      ],
      effects: [add("shadow.hardness", 3), add("shadow.guilt", 1), add("shadow.complicity", 4), add("shadow.harmDone", 3), add("shadow.selfDeception", 4), add("shadow.trustDebt", 4), add("resources.achievement", 1)],
    },
    {
      title: "办理量很好看",
      leftRoleText: "你不再坐在那个窗口，拒件模板却留在系统里。新人沿用时甚至不知道是谁写的；你偶尔听说有人又被来回补件，只说流程后来已经改过很多次。",
      text: [
        text(guilty, "你私下记住几个明显有误的拒件，偶尔下班后帮人找复核入口。善意只能偷偷进行，说明公开流程仍在奖励相反的事。"),
        text(hardened, "你的办理速度位居前列，被请去分享经验。你强调不要替申请人猜理由，听起来中立，也正好把所有解释成本推回给最不懂规则的人。"),
        fallback("团队把拒件模板做得更快、更礼貌，月报数字持续改善。被拒的人去了哪里，不属于本部门数据。"),
      ],
      effects: [add("shadow.hardness", 3), add("shadow.complicity", 4), add("shadow.harmDone", 4), add("shadow.selfDeception", 4), add("shadow.trustDebt", 5), add("career.level", 3), add("resources.reputation", 2)],
      withinYears: 7,
    },
    {
      title: "申诉改回来了",
      leftRoleText: "你离开岗位后，一个旧拒件终于申诉成功。结果改回来了，耽误的时间没有；通知不再抄送给你，责任也因此更容易被说成无人负责的系统旧账。",
      text: [
        text(guilty, "一个旧拒件申诉成功后，你主动把同类案例重新筛了一遍。你帮助了后来的人，最早被耽误的那位仍没有得到丢失的时间。"),
        text(hardened, "申诉部门推翻了你的决定，你只把它归为口径更新。绩效没有追回，升迁也没受影响；制度修正了结果，没有追问谁曾享受错误。"),
        fallback("对方最终靠外部帮助办成事情，后来专门教别人如何绕过你所在的窗口。你的权力没有减少，只在民间多出一套防你的说明书。"),
      ],
      effects: [add("shadow.hardness", 1), add("shadow.trustDebt", 3)],
      withinYears: 12,
    },
  ],
});

const careQueue = makeChain("care_queue", {
  yearRange: [2036, 2100],
  ageRange: [28, 72],
  currentRegions: TOWN_AND_CITY,
  category: "health",
  lifetimeProbability: 0.38,
  conditions: { all: [has("career.status", "eq", "employed"), has("career.level", "gte", 10), has("education.score", "gte", 42), has("career.field", "in", ["care_work", "public_sector", "state_unit", "grassroots_post", "professional"])] },
  steps: [
    {
      title: "名单上调了两格",
      text: [
        text(secure, "熟人托你把一位家属的照护排位提前，你没有收钱，只说床位刚好有调整空间。人情不进账，却占用了名单上真实的两格。"),
        text(migrated, "同乡辗转找到你，请你照应一个远道而来的老人。你改了排位，觉得只是替没有本地关系的人补一点不公；另一个同样没有关系的人因此又等了一周。"),
        fallback("你利用手里的排班权限，让熟悉的人提前获得照护。屏幕只显示顺序变化，不显示被挤到后面的是谁。"),
      ],
      effects: [add("shadow.hardness", 2), add("shadow.guilt", 2), add("shadow.complicity", 4), add("shadow.harmDone", 3), add("shadow.selfDeception", 4), add("shadow.resentment", 1), add("shadow.trustDebt", 5), add("resources.reputation", 2)],
    },
    {
      title: "大家都来找你",
      leftRoleText: "你已不再掌握名单，先前调过的顺序却留在记录里。接手的人只能逐项解释，有些家庭已经等过了那几周；权力交出去以后，旧人情并不会自动退出队伍。",
      text: [
        text(guilty, "第二次有人托付时，你先查了后排家庭的风险，仍找到一个自认不伤人的位置。名单越来越像一道你独自判分的题。"),
        text(hardened, "会办事的名声传开，你收下礼物，也把插队称作协调资源。正式规则仍在运行，只是总有人从侧门更快到达。"),
        fallback("你开始替不同关系调整次序，欠下的人情彼此抵消。真正的等待者没有进入这套账，他们只收到更新时间延后。"),
      ],
      effects: [add("shadow.hardness", 3), add("shadow.complicity", 5), add("shadow.harmDone", 5), add("shadow.selfDeception", 4), add("shadow.trustDebt", 6), add("resources.wealth", 2), add("career.level", 2)],
      withinYears: 6,
    },
    {
      title: "审计只找到一处手改",
      leftRoleText: "审计追到旧名单时，你已经调岗或退休。你把经过说明成当时的协调惯例，既没有全盘撒谎，也避开了谁被挤到后面；离岗让处分变轻，没有让记录失真。",
      text: [
        text(guilty, "审计前你恢复了大部分顺序，也给一户久等家庭主动联系补位。你做的是纠正，不是恩惠；直到这时你才肯用这个词。"),
        text(hardened, "审计只找到一处手工调整，你把责任归给已经调岗的下属。系统权限随后收紧，你保住职位，还参与了新规则设计。"),
        fallback("一位家属查到排位变化，在公开会上念出等待记录。你没有被解职，却从此不再掌握最终名单；失去权力比道歉更早发生。"),
      ],
      effects: [add("shadow.complicity", 2), add("shadow.trustDebt", 4)],
      withinYears: 10,
    },
  ],
});

const heatShelter = makeChain("heat_shelter", {
  yearRange: [2081, 2107],
  ageRange: [30, 80],
  currentRegions: ALL_PLACES,
  category: "health",
  lifetimeProbability: 0.36,
  conditions: { all: [has("career.status", "in", ["employed", "retired"]), has("career.level", "gte", 8), has("resources.reputation", "gte", 10), has("career.field", "in", ["public_sector", "grassroots_post", "state_unit", "care_work", "professional"])] },
  steps: [
    {
      title: "凉屋先留给熟人",
      text: [
        text(older, "极热天前，社区请你帮忙登记公共凉屋。你先替几位相熟长者留了位置；他们确实需要，名单外也有同样年老的人。"),
        text(migrated, "社区请你帮忙登记公共凉屋，你担心新迁来的人没人照应，便先给熟识的同乡留位。善意越过公开次序时，也会在另一边制造陌生人。"),
        fallback("社区把公共凉屋的登记交给你帮忙。名额紧张，你先给有来往的人留了几个位置；表上写的是重点照顾，没有写你们彼此认识。"),
      ],
      effects: [add("shadow.hardness", 2), add("shadow.guilt", 2), add("shadow.complicity", 4), add("shadow.harmDone", 4), add("shadow.selfDeception", 4), add("shadow.resentment", 1), add("shadow.trustDebt", 5), add("resources.reputation", 2)],
    },
    {
      title: "空调开着，门外也有人",
      leftRoleText: "你后来不再帮忙登记，预留过的名额却已经兑现。门外那几户只知道名单曾被改过，不知道你何时退出；你说以后不会再管这事，像不再握笔便能撤回旧字。",
      text: [
        text(guilty, "高温最重那天，门外又来一户，你挪出储物角让人坐下，却没有重排名单。临时善意让眼前好过一点，也替原先的不公遮住一角。"),
        text(hardened, "你坚持只认已登记名单，门外争执时还让人不要影响室内秩序。凉屋运行得平稳，平稳的定义不包括门外的人。"),
        fallback("名额很快满了，你把拒绝解释成安全容量。设备确有上限，谁先占到上限却不是自然规律。"),
      ],
      effects: [add("shadow.hardness", 4), add("shadow.complicity", 4), add("shadow.harmDone", 5), add("shadow.selfDeception", 3), add("shadow.trustDebt", 6), add("resources.achievement", 2)],
      withinYears: 4,
    },
    {
      title: "报告说运行平稳",
      leftRoleText: "季末报告写成运行平稳时，你已不在登记组。你的名字没有出现在总结里，预留名单也没有；被拒家庭保存着当日记录，责任则散在每个已经换岗的人口中。",
      text: [
        text(guilty, "季末总结时，你把门外等待和临时拒收写进报告，也承认预留名单有问题。记录来得迟，至少没有让下一次从一份漂亮谎话开始。"),
        text(hardened, "总结只写凉屋满负荷平稳运行，你因此获得表扬。后来那份报告成了范例，门外那几个人则只存在于家属的记忆里。"),
        fallback("被拒家庭把当日影像交给社区会议，你没被撤换，却要当众解释每个预留名额。报复没有发生，信任也没有回来。"),
      ],
      effects: [add("shadow.hardness", 1), add("shadow.trustDebt", 4)],
      withinYears: 9,
    },
  ],
});

export const shadowPublicArcEvents = [
  ...rentMeasure,
  ...guildCredit,
  ...famineStock,
  ...doubleLedger,
  ...meetingDenunciation,
  ...ruleWindow,
  ...withheldWages,
  ...stolenCredit,
  ...safetyBlame,
  ...rulesAsWeapon,
  ...careQueue,
  ...heatShelter,
];
