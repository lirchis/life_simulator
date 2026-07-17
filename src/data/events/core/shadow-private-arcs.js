// Private shadow arcs: wrongdoing is carried across years instead of being
// reduced to a single morality vignette.  Poverty, illness, gender and age are
// never treated as causes of cruelty; contextual variants only change where
// the same choice lands and who has to carry its cost.

const C = (path, op, value) => ({ path, [op]: value });
const add = (path, value) => ({ path, add: value });
const V = (conditionsA, textA, conditionsB, textB, fallback) => [
  { conditions: { all: conditionsA }, text: textA },
  { conditions: { all: conditionsB }, text: textB },
  { text: fallback },
];

const PRIVATE_CHAIN_PREFIXES = [
  "jealous_friend",
  "control_partner",
  "betrayal",
  "favoritism",
  "care_dodge",
  "gambling",
  "drinking",
  "petty_theft",
  "long_lie",
  "cold_silence",
  "child_harm",
  "schadenfreude",
];

const PRIVATE_CHAIN_STAGES = [
  ["jealous_friend_seed", "jealous_friend_credit", "jealous_friend_end"],
  ["control_partner_seed", "control_partner_tightens", "control_partner_end"],
  ["betrayal_seed", "betrayal_lie", "betrayal_end"],
  ["favoritism_seed", "favoritism_account", "favoritism_end"],
  ["care_dodge_seed", "care_dodge_burden", "care_dodge_end"],
  ["gambling_seed", "gambling_debt", "gambling_end"],
  ["drinking_seed", "drinking_repeats", "drinking_end"],
  ["petty_theft_seed", "petty_theft_lie", "petty_theft_end"],
  ["long_lie_seed", "long_lie_recruits", "long_lie_end"],
  ["cold_silence_seed", "cold_silence_house", "cold_silence_end"],
  ["child_harm_seed", "child_harm_pattern", "child_harm_end"],
  ["schadenfreude_seed", "schadenfreude_spreads", "schadenfreude_end"],
];
const NEXT_PRIVATE_STAGE = new Map(PRIVATE_CHAIN_STAGES.flatMap(([opening, middle, ending]) => [
  [opening, middle],
  [middle, ending],
]));

function privateDomain(id) {
  return `shadow_private_${PRIVATE_CHAIN_PREFIXES.find((prefix) => id.startsWith(prefix)) ?? "other"}`;
}

function scheduleNextStage(id, close) {
  const nextId = NEXT_PRIVATE_STAGE.get(id);
  if (!nextId || close) return [];
  const followsOpening = id.endsWith("_seed");
  const delayYears = followsOpening ? [2, 7] : [2, 10];
  return [{
    scheduleEvent: {
      eventId: `shadow_private_${nextId}`,
      delayYears,
      // This changes only an already-open arc: it does not make openings more
      // common, but keeps a crowded event pool from silently dropping a trace.
      weightMultiplier: followsOpening ? 24 : 16,
    },
  }];
}

function shadowEvent({
  id,
  title,
  category,
  ageRange,
  text,
  effects,
  conditions,
  requiresEvents,
  opening = false,
  close = false,
  yearRange = [1840, 2120],
}) {
  const dependencyWindow = close
    ? { minYears: 2, maxYears: 10 }
    : { minYears: 2, maxYears: 7 };
  const timedDependencies = (requiresEvents ?? []).map((eventId) => ({
    eventOccurredBetween: { eventId, ...dependencyWindow },
  }));
  const timedConditions = timedDependencies.length > 0
    ? { ...conditions, all: [...(conditions?.all ?? []), ...timedDependencies] }
    : conditions;

  return {
    id: `shadow_private_${id}`,
    title,
    category,
    yearRange,
    ageRange,
    maxOccurrences: 1,
    baseWeight: opening ? 5 : 34,
    lifetimeProbability: opening ? 0.1 : undefined,
    narrativeTier: opening ? "turning_point" : "consequence",
    // Every private arc owns its thread. Broad domains such as "family" made
    // unrelated control, care and favoritism stories compete for one thread.
    narrativeDomain: privateDomain(id),
    narrativeThread: close ? { close: true } : { expiresAfterYears: dependencyWindow.maxYears },
    conditions: timedConditions,
    requiresEvents,
    text,
    effects: [...(effects ?? []), ...scheduleNextStage(id, close)],
  };
}

export const shadowPrivateArcEvents = [
  // 1. Jealousy: a friend's good turn becomes something to spoil.
  shadowEvent({
    id: "jealous_friend_seed",
    title: "把一句好话压了下去",
    category: "relationship",
    ageRange: [16, 62],
    opening: true,
    conditions: { all: [C("relationships.friendship", "gte", 24)] },
    text: V(
      [C("meta.currentYear", "lte", 1949)],
      "朋友托你替他说一句公道话，你到了人前却含糊过去。机会原本就窄，你没有亲手关门，只把门闩往下按了一寸。",
      [C("career.status", "eq", "employed")],
      "同事称赞朋友做得好，你知道关键一处是他完成的，却把话题带到自己的辛苦。会议继续开，功劳悄悄换了座位。",
      "朋友遇到一件好事，你嘴上道喜，转身却少传了一条重要消息。你告诉自己只是忘了，记忆偏偏只在对方顺利时失灵。",
    ),
    effects: [add("shadow.resentment", 3), add("shadow.harmDone", 2), add("shadow.selfDeception", 2), add("shadow.trustDebt", 2), add("relationships.friendship", -4), { addTag: "shadow_jealous_friend" }],
  }),
  shadowEvent({
    id: "jealous_friend_credit",
    title: "借来的功劳",
    category: "relationship",
    ageRange: [18, 68],
    requiresEvents: ["shadow_private_jealous_friend_seed"],
    conditions: { all: [C("shadow.resentment", "gte", 2), C("shadow.harmDone", "gte", 2)] },
    text: V(
      [C("career.status", "in", ["employed", "self_employed"])],
      "一件合作的成果落到你名下，你没有纠正。朋友在旁边等了一会儿，最后只说算了；那两个字替你省下解释，也替关系记上一笔。",
      [C("resources.reputation", "gte", 55)],
      "旁人更愿意相信名声较大的你，你顺势把朋友的贡献说成帮助。说法很体面，真正完成事情的人却从此不再把草稿给你看。",
      "你把共同完成的事讲成自己一人的判断。朋友没有当面拆穿，只把以后能共享的消息收紧了一层。",
    ),
    effects: [add("shadow.complicity", 2), add("shadow.harmDone", 3), add("shadow.trustDebt", 4), add("shadow.hardness", 1), add("relationships.friendship", -8), add("resources.reputation", 2), { addTag: "shadow_stolen_friend_credit" }],
  }),
  shadowEvent({
    id: "jealous_friend_end",
    title: "消息不再先告诉你",
    category: "relationship",
    ageRange: [25, 85],
    requiresEvents: ["shadow_private_jealous_friend_credit"],
    close: true,
    conditions: { all: [C("shadow.trustDebt", "gte", 5)] },
    text: V(
      [C("meta.age", "gte", 60)],
      "后来你听说老朋友的近况，才发现共同熟人都比你先知道。你说人久了自然疏远，却没提那几次功劳怎样被你搬走。",
      [C("shadow.guilt", "gte", 4)],
      "你终于承认自己曾因嫉妒压过朋友，托人带去一句道歉。对方收下了话，没有恢复往来；道歉能归还事实，不能要求利息也一并免除。",
      "朋友后来有事不再找你，你把这解释成他心胸狭窄。关系坏死得很安静，只有你讲往事时仍习惯把自己放在正中。",
    ),
    effects: [add("shadow.selfDeception", 3), add("shadow.guilt", 1), add("shadow.trustDebt", 3), add("relationships.friendship", -10), add("resources.happiness", -3), { addTag: "shadow_friendship_hollowed" }],
  }),

  // 2. Control inside partnership.
  shadowEvent({
    id: "control_partner_seed",
    title: "替两个人作了决定",
    category: "family",
    ageRange: [22, 62],
    opening: true,
    conditions: { all: [C("relationships.partnerStatus", "in", ["partnered", "married"])] },
    text: V(
      [C("resources.wealth", "gte", 65)],
      "家里大部分钱由你掌握，你替伴侣拒绝了一次工作或出行，还说是不必辛苦。条件优裕使控制听起来像照顾，门仍旧是从你这边锁上的。",
      [C("meta.currentYear", "lte", 1978)],
      "伴侣想回原来的家探亲或继续做事，你先替两家人说了不方便。旧礼法给你的决定配好理由，受限制的人却要在同一屋檐下消化。",
      "一项本该两个人商量的安排，你先答应或拒绝，再通知伴侣。你把效率叫作担当，对方第一次发现自己的意见只在决定之后被征求。",
    ),
    effects: [add("shadow.hardness", 2), add("shadow.harmDone", 2), add("shadow.selfDeception", 3), add("shadow.trustDebt", 3), add("relationships.partnerQuality", -7), add("resources.freedom", 1), { addTag: "shadow_partner_control" }],
  }),
  shadowEvent({
    id: "control_partner_tightens",
    title: "每一笔都要说明",
    category: "family",
    ageRange: [24, 68],
    requiresEvents: ["shadow_private_control_partner_seed"],
    conditions: { all: [C("relationships.partnerStatus", "in", ["partnered", "married"]), C("shadow.selfDeception", "gte", 2)] },
    text: V(
      [C("resources.wealth", "lte", 38)],
      "日子紧，你要求伴侣把每笔小钱说明，自己的花销却归入必要。贫穷没有制造这种双重标准，只让它每天都有账本可用。",
      [C("meta.currentYear", "gte", 2000)],
      "你查看伴侣的付款记录和行程，说一家人不该有秘密。屏幕给了控制更多栏目，信任则被你要求不断上传证明。",
      "你开始过问伴侣同谁来往、何时回家、钱怎么花。每一项单看都能解释，合在一起便是一间没有栏杆的牢房。",
    ),
    effects: [add("shadow.hardness", 2), add("shadow.harmDone", 4), add("shadow.trustDebt", 5), add("shadow.resentment", 2), add("relationships.partnerQuality", -12), add("relationships.romance", -8), { addTag: "shadow_partner_monitored" }],
  }),
  shadowEvent({
    id: "control_partner_end",
    title: "门从里面有了另一把锁",
    category: "family",
    ageRange: [27, 78],
    requiresEvents: ["shadow_private_control_partner_tightens"],
    close: true,
    conditions: { all: [C("relationships.partnerStatus", "in", ["partnered", "married"]), C("shadow.trustDebt", "gte", 6)] },
    text: V(
      [C("shadow.guilt", "gte", 4)],
      "你第一次把钱、来往和出门的决定交还给伴侣自己处理，也没有把这叫作恩让。对方仍保留自己的钥匙和退路；边界立起来了，信任要不要回来并不由你决定。",
      [C("relationships.partnerQuality", "lte", 28)],
      "伴侣把证件、钱款和日程分开保管，共同生活只剩需要协商的部分。你们没有立刻分开，屋里却从此有一扇门不再由你单方面开关。",
      "伴侣明确拒绝再汇报每笔钱和每次来往，你先说这不像一家人，后来发现争执也无法让旧秩序回来。关系仍在，控制第一次遇到不肯配合的边界。",
    ),
    effects: [add("relationships.partnerQuality", -8), add("relationships.romance", -6), add("shadow.guilt", 1), add("shadow.trustDebt", 3), add("resources.freedom", -1), { addTag: "shadow_partner_set_boundary" }],
  }),

  // 3. Emotional betrayal without romanticizing secrecy.
  shadowEvent({
    id: "betrayal_seed",
    title: "把亲密分给了第三个人",
    category: "relationship",
    ageRange: [22, 58],
    opening: true,
    conditions: { all: [C("relationships.partnerStatus", "in", ["partnered", "married"])] },
    text: V(
      [C("career.status", "eq", "employed")],
      "你把许多本该同伴侣说的话，先告诉了工作中亲近的人，又刻意删去往来痕迹。你说没有越界，判断边界的尺却一直由你保管。",
      [C("location.migratedTimes", "gte", 1)],
      "长期在外时，你同另一个人建立了隐秘亲密，回家只说工作太忙。距离没有替你作决定，它只是让两套说法不容易在同一张桌上见面。",
      "你把注意、秘密和期待分给婚姻外的人，同时要求伴侣相信一切如常。背叛尚未被说破，家里的谈话已经少了一半内容。",
    ),
    effects: [add("shadow.complicity", 2), add("shadow.harmDone", 3), add("shadow.selfDeception", 3), add("shadow.trustDebt", 3), add("relationships.partnerQuality", -6), add("relationships.romance", -4), { addTag: "shadow_emotional_betrayal" }],
  }),
  shadowEvent({
    id: "betrayal_lie",
    title: "同一个晚上说了两个版本",
    category: "relationship",
    ageRange: [24, 65],
    requiresEvents: ["shadow_private_betrayal_seed"],
    conditions: { all: [C("relationships.partnerStatus", "in", ["partnered", "married"]), C("shadow.complicity", "gte", 2)] },
    text: V(
      [C("meta.currentYear", "gte", 2000)],
      "一条没有删净的消息让伴侣起疑，你先否认，再把问题说成对方不信任你。屏幕留下时间，只有责任被你反复撤回。",
      [C("relationships.children", "gte", 1)],
      "孩子问你为什么最近总晚回家，你拿工作搪塞，也让伴侣在饭桌上陪你维持说法。秘密不再只是两个人的事，无辜的人被迫替它保持安静。",
      "你为同一个晚上准备两个版本，细节说得越完整，家里的沉默越重。谎言暂时保住表面，也让真正的解释一天比一天昂贵。",
    ),
    effects: [add("shadow.complicity", 3), add("shadow.harmDone", 4), add("shadow.selfDeception", 2), add("shadow.trustDebt", 5), add("relationships.partnerQuality", -10), add("resources.happiness", -4), { addTag: "shadow_betrayal_lie" }],
  }),
  shadowEvent({
    id: "betrayal_end",
    title: "承认没有带回原来的信任",
    category: "relationship",
    ageRange: [27, 76],
    requiresEvents: ["shadow_private_betrayal_lie"],
    close: true,
    conditions: { all: [C("shadow.trustDebt", "gte", 6), C("relationships.partnerStatus", "in", ["partnered", "married", "separated"])] },
    text: V(
      [C("shadow.guilt", "gte", 4)],
      "你把隐瞒的事说清，没有要求伴侣当场原谅。此后很长时间，迟到和沉默都需要重新解释；坦白停止新增债务，旧债仍按自己的速度结算。",
      [C("relationships.partnerStatus", "eq", "separated")],
      "关系已经结束后，旧谎言仍在几次交接和偶遇里冒出来。你不再拥有被追问的日常，却仍得承认分开没有替过去改写日期。",
      "你承认了一部分，又把最伤人的部分说成对方想多。关系没有立刻结束，只从亲密变成互相核对；同一屋檐还在，被相信的便利已经没有了。",
    ),
    effects: [add("shadow.guilt", 2), add("shadow.trustDebt", 3), add("relationships.partnerQuality", -8), add("relationships.romance", -5), add("resources.happiness", -4), { addTag: "shadow_betrayal_reckoned" }],
  }),

  // 4. Favoritism among relatives.
  shadowEvent({
    id: "favoritism_seed",
    title: "好东西总先留给一个人",
    category: "family",
    ageRange: [25, 72],
    opening: true,
    conditions: { all: [C("relationships.family", "gte", 28)] },
    text: V(
      [C("resources.wealth", "lte", 38)],
      "家里东西有限，你总先照顾最喜欢的亲属，再说其他人懂事。缺乏要求分配更难，却没有要求每次都由同一个人让步。",
      [C("meta.currentYear", "lte", 1978)],
      "分布匹、口粮或上学机会时，你暗暗偏向一个人，再拿长幼与家规解释。规矩说得很古老，决定其实出自你今天的私心。",
      "家里有一份稀罕东西或一次机会，你总自然地先想到同一个人。被略过的亲属没有当场争，只渐渐学会不再期待公平。",
    ),
    effects: [add("shadow.harmDone", 2), add("shadow.selfDeception", 2), add("shadow.trustDebt", 3), add("shadow.resentment", 1), add("relationships.family", -5), { addTag: "shadow_family_favoritism" }],
  }),
  shadowEvent({
    id: "favoritism_account",
    title: "亲情也有一本暗账",
    category: "family",
    ageRange: [30, 80],
    requiresEvents: ["shadow_private_favoritism_seed"],
    conditions: { all: [C("shadow.trustDebt", "gte", 2)] },
    text: V(
      [C("relationships.children", "gte", 2)],
      "孩子们为你长期偏心争起来，你列出各自得到过什么，唯独没算谁总被要求谦让。家庭暗账最难之处，是记账的人恰好也是裁判。",
      [C("resources.wealth", "gte", 65)],
      "分房、分钱或安排资源时，你又把更稳妥的一份给了偏爱的亲属。东西多没有带来公平，只让差别可以包装得更体面。",
      "一次家庭商量中，旧偏心被当面说破。你逐件反驳，证明每次都有理由，却解释不了为什么理由总让同一个人受益。",
    ),
    effects: [add("shadow.hardness", 2), add("shadow.selfDeception", 3), add("shadow.harmDone", 3), add("shadow.trustDebt", 4), add("relationships.family", -9), { addTag: "shadow_family_ledger" }],
  }),
  shadowEvent({
    id: "favoritism_end",
    title: "节日少了一把椅子",
    category: "family",
    ageRange: [42, 92],
    requiresEvents: ["shadow_private_favoritism_account"],
    close: true,
    conditions: { all: [C("shadow.trustDebt", "gte", 5)] },
    text: V(
      [C("meta.age", "gte", 65)],
      "晚年团聚时，被你长期忽略的亲属没有回来。你怪年轻人记仇，桌上那把空椅子却比所有解释更熟悉旧账。",
      [C("shadow.guilt", "gte", 3)],
      "你试着承认过去总让一个人退让，并在分配剩余财物时改正一部分。对方接受安排，没有补演亲密；公平来得晚，仍比继续欠着好。",
      "家人逐渐只在必要时联系你，那个被偏爱的亲属也未必愿意承担全部照料。过去每次看似很小的偏向，后来成了大家安排距离时共同参考的旧经验。",
    ),
    effects: [add("shadow.guilt", 2), add("shadow.trustDebt", 3), add("shadow.selfDeception", 2), add("relationships.family", -12), add("resources.happiness", -6), { addTag: "shadow_family_table_empty" }],
  }),

  // 5. Passing care work to another relative.
  shadowEvent({
    id: "care_dodge_seed",
    title: "把照护的日子往别人那边推",
    category: "family",
    ageRange: [30, 68],
    opening: true,
    conditions: {
      all: [C("relationships.family", "gte", 30)],
      any: [
        { eventOccurredWithin: { eventId: "daily_parent_illness", years: 5 } },
        { eventOccurredWithin: { eventId: "arc_care_burden_arrives", years: 5 } },
      ],
    },
    text: V(
      [C("birth.gender", "eq", "male")],
      "家中长辈需要照料，你说姐妹或伴侣更熟悉这些，自己的名字便总排在较少的日子。家人没有继续争辩，只在下一次商量时先把你的缺席算进去。",
      [C("birth.gender", "eq", "female")],
      "家中长辈需要轮流照料，你以工作和自己小家为由，把多数日子留给另一位亲属。大家体谅你的难处，承担最多的那个人却没有因此多出一天。",
      "家人商量轮流照护，你总挑最少的日子，再用工作、路远和不懂护理解释。理由各自成立，合起来却让另一个人没有休息日。",
    ),
    effects: [add("shadow.complicity", 2), add("shadow.harmDone", 2), add("shadow.selfDeception", 3), add("shadow.trustDebt", 3), add("relationships.family", -4), add("resources.freedom", 2), { addTag: "shadow_care_dodged" }],
  }),
  shadowEvent({
    id: "care_dodge_burden",
    title: "最能干的人先累倒",
    category: "family",
    ageRange: [32, 74],
    requiresEvents: ["shadow_private_care_dodge_seed"],
    conditions: { all: [C("shadow.complicity", "gte", 2)] },
    text: V(
      [C("resources.wealth", "gte", 60)],
      "你提议出钱代替时间，金额足够支付一部分照护，却把联系医生、监督服务和半夜应急仍留给别人。付款解决了账单，没有自动完成责任。",
      [C("resources.wealth", "lte", 38)],
      "家里没有钱请人，你更常说自己也难。承担最多的亲属终于病倒，照护断了一天，所有人才看见那个人原来做了多少没有名称的工作。",
      "一直承担照护的亲属累出病，你第一反应是问以后谁来接班。话说出口，屋里安静下来；最伤人的部分不是自私，而是你已经把它当成正常安排。",
    ),
    effects: [add("shadow.hardness", 2), add("shadow.harmDone", 4), add("shadow.trustDebt", 5), add("shadow.guilt", 1), add("relationships.family", -9), add("resources.happiness", -3), { addTag: "shadow_caregiver_exhausted" }],
  }),
  shadowEvent({
    id: "care_dodge_end",
    title: "照护结束后还有一本旧账",
    category: "family",
    ageRange: [48, 92],
    requiresEvents: ["shadow_private_care_dodge_burden"],
    close: true,
    conditions: { all: [C("shadow.trustDebt", "gte", 6)] },
    text: V(
      [C("shadow.guilt", "gte", 4)],
      "你终于接过一部分长期照护，也主动给曾被压垮的人留出休息。修补没有感人场面，多数时候只是准时到场，并且不再问什么时候结束。",
      [C("resources.wealth", "gte", 60)],
      "你补出一笔钱，请人接下部分日常工作。承担最多的亲属收下了实际帮助，却没有顺便撤回过去的不满；钱让人能喘息，不负责替谁改写旧账。",
      "照护告一段落后，承担最多的亲属同你渐渐疏远。你仍强调自己出过钱、跑过几次医院，对方也不再争，只把以后能托付给你的事缩小了一圈。",
    ),
    effects: [add("shadow.guilt", 1), add("shadow.trustDebt", 2), add("relationships.family", -6), add("resources.happiness", -3), { addTag: "shadow_care_ledger_remains" }],
  }),

  // 6. Gambling-like self-destruction; no method or winning fantasy.
  shadowEvent({
    id: "gambling_seed",
    title: "把家用押在一次侥幸上",
    category: "wealth",
    ageRange: [18, 62],
    opening: true,
    text: V(
      [C("relationships.partnerStatus", "in", ["partnered", "married"])],
      "你瞒着伴侣挪用一笔家用去赌侥幸，输掉后先补了一个谎。钱的缺口不大，秘密已经替下一次越界挖好位置。",
      [C("resources.wealth", "gte", 65)],
      "你并不缺眼前用度，仍把越来越多的钱投进输赢，享受的是不必等待的刺激。宽裕没有保护你，只让损失更久才被家人看见。",
      "你把本该留作生活的一笔钱交给侥幸，结果没有回来。你告诉自己只是运气差，而不是决定本身已经越过了边界。",
    ),
    effects: [add("shadow.selfDeception", 3), add("shadow.harmDone", 2), add("shadow.trustDebt", 2), add("shadow.complicity", 1), add("resources.wealth", -9), add("resources.happiness", -3), { addTag: "shadow_gambling_started" }],
  }),
  shadowEvent({
    id: "gambling_debt",
    title: "欠条藏进旧书",
    category: "wealth",
    ageRange: [20, 68],
    requiresEvents: ["shadow_private_gambling_seed"],
    conditions: { all: [C("shadow.selfDeception", "gte", 2)] },
    text: V(
      [C("relationships.children", "gte", 1)],
      "孩子的一项开支被你拖延，欠账却藏在旧书里。你说家里最近紧，没人知道紧张的一端正握在你自己手中。",
      [C("resources.wealth", "lte", 35)],
      "损失已经压到饭钱和房租，你仍想靠下一次翻回去。账越薄，侥幸越被你说成唯一出路；真正承担风险的人却是全家。",
      "你借新钱填旧缺口，把欠条藏好，又记不清对谁说过哪个版本。秘密开始需要自己的账本，比原来的债还难管理。",
    ),
    effects: [add("shadow.selfDeception", 4), add("shadow.harmDone", 5), add("shadow.trustDebt", 5), add("shadow.hardness", 1), add("resources.wealth", -14), add("relationships.family", -7), { addTag: "shadow_gambling_debt" }],
  }),
  shadowEvent({
    id: "gambling_end",
    title: "欠账被摊到桌上",
    category: "wealth",
    ageRange: [24, 78],
    requiresEvents: ["shadow_private_gambling_debt"],
    close: true,
    conditions: { all: [C("shadow.harmDone", "gte", 6)] },
    text: V(
      [C("shadow.guilt", "gte", 4)],
      "你承认债务，停止再碰输赢，把全部欠款摊给家人看。没有人鼓掌，大家先删掉几项生活计划；停止伤害是起点，不是结清。",
      [C("relationships.partnerStatus", "in", ["partnered", "married"])],
      "伴侣发现欠债后不再让你经手共同钱款，关系从亲密变成逐项核对。你抱怨不被信任，过去留下的欠条却比抱怨更早摆在桌上。",
      "能借到的钱越来越少，你仍在盘算下一次翻回去，家人却先把欠款和必要开支分开保管。赌局没有替你完成醒悟，只是现实暂时收窄了入口。",
    ),
    effects: [add("shadow.guilt", 1), add("shadow.selfDeception", 2), add("shadow.trustDebt", 4), add("resources.wealth", -7), add("resources.happiness", -4), add("relationships.family", -5), { addTag: "shadow_gambling_debt_disclosed" }],
  }),

  // 7. Alcohol-centred self-destruction; only consequences, no use details.
  shadowEvent({
    id: "drinking_seed",
    title: "答应的事又被酒误了",
    category: "health",
    ageRange: [18, 62],
    opening: true,
    text: V(
      [C("career.status", "eq", "employed")],
      "你因喝酒误了第二天的工作，让同事替你补位。你把这说成应酬，替你干完那班活的人却没有参加应酬。",
      [C("relationships.children", "gte", 1)],
      "你答应陪孩子做一件事，回家时却已经无法履行。孩子没有哭闹，只把准备好的东西收起来；安静比责备更让承诺显得廉价。",
      "一次饮酒后的失约让别人替你收拾局面。你醒来先问自己说过什么，却没有先问谁承担了后果。",
    ),
    effects: [add("shadow.selfDeception", 3), add("shadow.harmDone", 2), add("shadow.trustDebt", 3), add("resources.health", -5), add("relationships.family", -3), { addTag: "shadow_drinking_harm" }],
  }),
  shadowEvent({
    id: "drinking_repeats",
    title: "门锁换了一种声音",
    category: "health",
    ageRange: [20, 70],
    requiresEvents: ["shadow_private_drinking_seed"],
    conditions: { all: [C("shadow.selfDeception", "gte", 2)] },
    text: V(
      [C("relationships.partnerStatus", "in", ["partnered", "married"])],
      "伴侣不再等你回家，只把门反锁后留一盏小灯。你说对方冷淡，没提过去多少夜里，门外脚步一响，全家先判断你是否清醒。",
      [C("resources.health", "lte", 45)],
      "身体已经给出警告，你短暂停过，又把复发解释成心情不好。疾病需要治疗，伤害却仍需负责；两件事不能用同一张病历相互抵消。",
      "失约和难堪重复出现，亲友开始把重要安排绕开你。你说他们不给机会，却忘了机会曾一次次由别人重新收拾。",
    ),
    effects: [add("shadow.harmDone", 4), add("shadow.trustDebt", 5), add("shadow.selfDeception", 3), add("shadow.hardness", 1), add("resources.health", -8), add("relationships.family", -7), { addTag: "shadow_drinking_repeated" }],
  }),
  shadowEvent({
    id: "drinking_end",
    title: "重要安排开始绕开你",
    category: "health",
    ageRange: [28, 82],
    requiresEvents: ["shadow_private_drinking_repeats"],
    close: true,
    conditions: { all: [C("shadow.trustDebt", "gte", 6)] },
    text: V(
      [C("shadow.guilt", "gte", 4)],
      "你开始接受长期帮助，也允许家人设下清楚边界。关系没有因几个月平稳就复原，日历上的每一天只证明今天没有新增伤害。",
      [C("resources.health", "lte", 35)],
      "身体需要照顾时，家人把能做和不能做的事都说清楚，也不再替你向别人解释失约。必要的帮助仍在，过去那种无限兜底已经停了。",
      "亲友安排重要事情时不再把你的承诺算在内，等你确实到场才临时添一把椅子。你仍把几次缺席说成偶然，日程却已经学会不用你的保证。",
    ),
    effects: [add("shadow.guilt", 1), add("shadow.trustDebt", 3), add("resources.health", -5), add("relationships.family", -5), add("resources.happiness", -3), { addTag: "shadow_commitments_not_relied_on" }],
  }),

  // 8. Petty theft and small fraud.
  shadowEvent({
    id: "petty_theft_seed",
    title: "顺手拿走一件不属于你的东西",
    category: "wealth",
    ageRange: [12, 62],
    opening: true,
    text: V(
      [C("meta.age", "lte", 18)],
      "你把同学或同伴的一件小东西装进口袋，回家后又怕被发现。东西本身很普通，藏它的位置却让整个房间都显得可疑。",
      [C("resources.wealth", "gte", 55)],
      "你并不缺那件东西，仍利用无人注意把它带走。需要不能替行为辩护，这一次甚至连需要都没有，只有试探边界带来的短促兴奋。",
      "你顺手拿走一件不属于自己的小物，随后告诉自己对方也许不会在意。财物很轻，替自己改写事实却从这一刻开始。",
    ),
    effects: [add("shadow.harmDone", 2), add("shadow.selfDeception", 2), add("shadow.complicity", 1), add("shadow.guilt", 1), add("resources.wealth", 2), add("resources.reputation", -1), { addTag: "shadow_petty_theft" }],
  }),
  shadowEvent({
    id: "petty_theft_lie",
    title: "便宜是从别人身上省下的",
    category: "wealth",
    ageRange: [16, 68],
    requiresEvents: ["shadow_private_petty_theft_seed"],
    conditions: { all: [C("shadow.harmDone", "gte", 2)] },
    text: V(
      [C("career.status", "eq", "employed")],
      "你在工作往来中少报一项、夹带一点，数目小到很难追查。你把它叫作大家都这样，仿佛人一多，责任便会自动摊薄。",
      [C("meta.currentYear", "gte", 2000)],
      "一次小交易里，你利用信息差多拿了不该拿的钱。页面显示交易成功，受损的人却不会因此变成系统提示。",
      "你尝到一次小便宜后，又在另一件事上隐去关键事实。每次都不够成为大案，合起来却足以让你不再能坦然翻开自己的账。",
    ),
    effects: [add("shadow.harmDone", 3), add("shadow.complicity", 3), add("shadow.selfDeception", 3), add("shadow.trustDebt", 2), add("resources.wealth", 4), add("resources.reputation", -3), { addTag: "shadow_small_fraud" }],
  }),
  shadowEvent({
    id: "petty_theft_end",
    title: "旧小账被重新提起",
    category: "wealth",
    ageRange: [20, 78],
    requiresEvents: ["shadow_private_petty_theft_lie"],
    close: true,
    conditions: { all: [C("shadow.complicity", "gte", 3)] },
    text: V(
      [C("shadow.guilt", "gte", 4)],
      "你把能确认的东西和钱退回去，没有编造高尚动机。受损的人收下后仍保持距离；归还是义务，不是购买原谅。",
      [C("resources.reputation", "lte", 35)],
      "事情被人对上细节，你失去一份信任或工作。数目确实不大，别人避开你的原因也不是数目，而是你曾认真证明自己会为小利撒谎。",
      "有人当面问起，你承认最容易查清的一件，把其余说成记错。小偷小骗没有送你进传奇，只让熟人以后递钱时多点一遍。",
    ),
    effects: [add("shadow.guilt", 1), add("shadow.trustDebt", 3), add("shadow.selfDeception", 1), add("resources.wealth", -2), add("resources.reputation", -3), add("relationships.friendship", -2), { addTag: "shadow_petty_theft_reckoned" }],
  }),

  // 9. A long lie that recruits other people.
  shadowEvent({
    id: "long_lie_seed",
    title: "先说了一个方便的版本",
    category: "relationship",
    ageRange: [16, 62],
    opening: true,
    text: V(
      [C("career.status", "in", ["employed", "self_employed"]), C("meta.currentYear", "gte", 1950)],
      "为了保住面子或机会，你把经历说得比实际完整。事情暂时过去，下一次谈到同一段履历时，你已需要记住自己上次怎样编排。",
      [C("relationships.partnerStatus", "in", ["partnered", "married"])],
      "你向伴侣隐去一段重要事实，说等合适时再讲。所谓合适日子一直没来，谎言倒先在家里有了固定座位。",
      "你说了一个对自己更方便的版本，旁人没有追问。那一刻问题似乎解决了，真正开始的是以后每次都要同前一个版本对齐。",
    ),
    effects: [add("shadow.selfDeception", 3), add("shadow.complicity", 2), add("shadow.trustDebt", 2), add("shadow.guilt", 1), { addTag: "shadow_long_lie" }],
  }),
  shadowEvent({
    id: "long_lie_recruits",
    title: "请别人替你记住谎话",
    category: "relationship",
    ageRange: [18, 70],
    requiresEvents: ["shadow_private_long_lie_seed"],
    conditions: { all: [C("shadow.complicity", "gte", 2)] },
    text: V(
      [C("relationships.children", "gte", 1)],
      "为了不让说法穿帮，你提醒孩子在亲友面前不要提一件事。孩子点头，却从此知道大人的诚实也会按场合开关。",
      [C("career.status", "eq", "employed"), C("meta.currentYear", "gte", 1950)],
      "同事发现了你履历或报告里的漏洞，你请他帮忙圆过去，答应以后补正。谎言第一次需要人手，也第一次开始支付人情成本。",
      "你让亲近的人替你确认那个版本，对方不情愿地答应。秘密从个人羞耻变成共同负担，最无辜的人反而最怕说错。",
    ),
    effects: [add("shadow.complicity", 4), add("shadow.harmDone", 3), add("shadow.trustDebt", 4), add("shadow.selfDeception", 2), add("relationships.family", -4), { addTag: "shadow_lie_recruited_others" }],
  }),
  shadowEvent({
    id: "long_lie_end",
    title: "真相从细节里漏出来",
    category: "relationship",
    ageRange: [22, 82],
    requiresEvents: ["shadow_private_long_lie_recruits"],
    close: true,
    conditions: { all: [C("shadow.complicity", "gte", 5)] },
    text: V(
      [C("shadow.guilt", "gte", 4)],
      "一个细节让多年说法崩开，你没有继续补洞，把事实一次讲完。亲近的人听完没有立刻表态，只先核对自己这些年替你说过多少次同一个版本。",
      [C("meta.age", "gte", 60)],
      "晚年整理旧事时，不同版本终于在亲属面前撞到一起。你说年代久了记不清，只有那些曾替你圆谎的人记得异常准确。",
      "有人再次问到关键细节，你沿用旧版本，却发现替你作证的人已经不肯接话。谎言没有戏剧性地倒塌，只是每次再说都要多留一个无人应声的停顿。",
    ),
    effects: [add("shadow.guilt", 1), add("shadow.selfDeception", 2), add("shadow.trustDebt", 4), add("resources.reputation", -3), add("relationships.family", -4), add("relationships.friendship", -2), { addTag: "shadow_long_lie_strained" }],
  }),

  // 10. Silent punishment within partnership.
  shadowEvent({
    id: "cold_silence_seed",
    title: "把沉默当作惩罚",
    category: "family",
    ageRange: [22, 66],
    opening: true,
    conditions: { all: [C("relationships.partnerStatus", "in", ["partnered", "married"])] },
    text: V(
      [C("relationships.children", "gte", 1)],
      "争执后你几天不回应伴侣，孩子在饭桌上替两边传话。你没有提高嗓门，却把屋里的每个人都变成了临时信使。",
      [C("meta.currentYear", "gte", 2000)],
      "你读完伴侣的消息却故意不回，在同一屋里也只用最短的字句。沉默没有留下伤痕照片，却准确控制了房间温度。",
      "你不同伴侣说清不满，只撤走回应与亲近，等对方先认错。表面没有争吵，惩罚因此更容易被你说成自己需要安静。",
    ),
    effects: [add("shadow.hardness", 2), add("shadow.harmDone", 2), add("shadow.selfDeception", 3), add("shadow.trustDebt", 3), add("relationships.partnerQuality", -7), add("relationships.romance", -5), { addTag: "shadow_cold_silence" }],
  }),
  shadowEvent({
    id: "cold_silence_house",
    title: "屋里只剩必要句子",
    category: "family",
    ageRange: [25, 72],
    requiresEvents: ["shadow_private_cold_silence_seed"],
    conditions: { all: [C("relationships.partnerStatus", "in", ["partnered", "married"]), C("shadow.hardness", "gte", 2)] },
    text: V(
      [C("relationships.children", "gte", 1)],
      "你们之间只谈接送、吃饭和账单，孩子学会先判断今天谁能被问问题。家庭仍运转，像一台没有润滑却坚持不肯停的机器。",
      [C("meta.age", "gte", 55)],
      "多年的冷处理使伴侣不再追着解释，只把生活分成各自一半。你以为终于清静，却发现没人争论也可能是没人还期待被理解。",
      "沉默从几天变成惯例，家里只剩必要句子。你仍等对方先低头，对方则慢慢学会把重要感受交给别处。",
    ),
    effects: [add("shadow.hardness", 3), add("shadow.harmDone", 4), add("shadow.trustDebt", 5), add("shadow.resentment", 3), add("relationships.partnerQuality", -13), add("relationships.romance", -10), { addTag: "shadow_silent_house" }],
  }),
  shadowEvent({
    id: "cold_silence_end",
    title: "对方不再等你开口",
    category: "family",
    ageRange: [30, 82],
    requiresEvents: ["shadow_private_cold_silence_house"],
    close: true,
    conditions: { all: [C("relationships.partnerStatus", "in", ["partnered", "married", "separated"]), C("shadow.trustDebt", "gte", 6)] },
    text: V(
      [C("relationships.partnerStatus", "eq", "separated")],
      "关系结束后，你们为少数必要事情重新说话。对方只确认时间和事项，不再追问你当年为何沉默；没有观众以后，那套惩罚也失去了原来的用处。",
      [C("shadow.guilt", "gte", 4)],
      "你第一次不等对方猜，直接说出愤怒和害怕，也听完对方这些年的感受。关系只修回一小段，至少这一次，沉默没有被继续拿来逼人先低头。",
      "伴侣不再等待你开口，开始单独安排生活。你说对方变冷，对方只把下一周的事项讲完，屋里仍有谈话，却很少再有需要托付的心事。",
    ),
    effects: [add("shadow.guilt", 1), add("shadow.trustDebt", 3), add("relationships.partnerQuality", -7), add("relationships.romance", -5), add("resources.happiness", -3), { addTag: "shadow_silence_became_distance" }],
  }),

  // 11. Repeating injury onto children.
  shadowEvent({
    id: "child_harm_seed",
    title: "把受过的话又说了一遍",
    category: "family",
    ageRange: [24, 58],
    opening: true,
    conditions: { all: [C("relationships.children", "gte", 1)] },
    text: V(
      [C("resources.wealth", "lte", 38)],
      "生活压力很重，你却把挫败变成对孩子的刻薄，讥讽他不懂事、不争气。贫困解释疲惫，不能把孩子变成情绪的偿债人。",
      [C("education.score", "gte", 65)],
      "你以自己读书或工作的标准要求孩子，一次失误便被说成不用心。你称之为为他好，孩子听见的却是爱要靠成绩续费。",
      "孩子做错一件小事，你脱口说出童年里最伤你的那句话。声音从你嘴里出来时熟悉得可怕，你仍先用管教替它解释。",
    ),
    effects: [add("shadow.harmDone", 3), add("shadow.selfDeception", 3), add("shadow.hardness", 2), add("shadow.trustDebt", 3), add("relationships.family", -6), { addTag: "shadow_harm_repeated_to_child" }],
  }),
  shadowEvent({
    id: "child_harm_pattern",
    title: "孩子学会先藏起成绩单",
    category: "family",
    ageRange: [28, 66],
    requiresEvents: ["shadow_private_child_harm_seed"],
    conditions: { all: [C("relationships.children", "gte", 1), C("shadow.harmDone", "gte", 3)] },
    text: V(
      [C("meta.currentYear", "gte", 1990)],
      "孩子开始删掉消息、藏起成绩或晚些回家，先把可能招来责备的部分处理干净。你批评他不诚实，却没有问诚实在这个家里要付多少代价。",
      [C("resources.reputation", "gte", 55)],
      "外人称赞你负责、要求高，孩子在旁边保持安静。公共形象越整齐，孩子越难解释关门以后那些话为什么仍让他发抖。",
      "孩子逐渐只汇报好消息，遇到困难先找别人。你抱怨他同自己不亲，却继续把每次倾诉都变成一次审讯。",
    ),
    effects: [add("shadow.harmDone", 4), add("shadow.trustDebt", 5), add("shadow.selfDeception", 3), add("shadow.resentment", 2), add("relationships.family", -10), { addTag: "shadow_child_hides_truth" }],
  }),
  shadowEvent({
    id: "child_harm_end",
    title: "孩子把那句话复述给你",
    category: "family",
    ageRange: [35, 82],
    requiresEvents: ["shadow_private_child_harm_pattern"],
    close: true,
    conditions: { all: [C("relationships.children", "gte", 1), C("shadow.trustDebt", "gte", 6)] },
    text: V(
      [C("shadow.guilt", "gte", 3)],
      "一次争执后，孩子把你常说的那句刻薄话原样复述给你。你这次没有争词义，只承认它确实从自己这里来；后来每次停住半句话，都比一次漂亮道歉更费力。",
      [C("meta.age", "gte", 65)],
      "成年孩子来得越来越少，见面时也绕开容易受评判的话题。你说彼此年纪大了没什么可聊，对方只是把最容易受伤的部分留在门外。",
      "孩子当面说起那些伤害，你逐件解释当年多么不容易。你的辛苦是真的，孩子记住的害怕也没有因此消失；谈话没有和解，只把两种事实摆在了同一张桌上。",
    ),
    effects: [add("shadow.guilt", 2), add("shadow.trustDebt", 3), add("relationships.family", -5), add("resources.happiness", -3), { addTag: "shadow_child_harm_named" }],
  }),

  // 12. Schadenfreude becomes a secret and then a public shame.
  shadowEvent({
    id: "schadenfreude_seed",
    title: "听见坏消息时松了一口气",
    category: "relationship",
    ageRange: [16, 72],
    opening: true,
    text: V(
      [C("relationships.friendship", "gte", 35)],
      "熟人遭遇挫折时，你先感到一阵轻松，随后才装出关心。那一瞬不能由你选择，接下来把消息说给谁听却完全由你负责。",
      [C("career.status", "eq", "employed")],
      "同事失去机会，你嘴上惋惜，心里却庆幸少了一个竞争者。你没有造成那件坏事，却很快开始享用它腾出的空间。",
      "听到别人倒霉，你短暂地高兴了一下，又为自己的高兴感到羞耻。你本可以让情绪到此为止，却把消息留在舌尖反复尝。",
    ),
    effects: [add("shadow.resentment", 2), add("shadow.guilt", 1), add("shadow.selfDeception", 2), add("shadow.complicity", 1), { addTag: "shadow_schadenfreude" }],
  }),
  shadowEvent({
    id: "schadenfreude_spreads",
    title: "把别人的难堪讲得很好笑",
    category: "relationship",
    ageRange: [18, 78],
    requiresEvents: ["shadow_private_schadenfreude_seed"],
    conditions: { all: [C("shadow.resentment", "gte", 1)] },
    text: V(
      [C("meta.currentYear", "gte", 2000)],
      "你把别人的窘境转述到一群人面前，删掉隐私，只留下最好笑的部分。消息很快获得回应，受苦的人因此又多受了一轮围观。",
      [C("meta.currentYear", "lte", 1949)],
      "你在茶桌或街坊间讲起一户人的败落，学得活灵活现。听众笑过便散了，消息里的那家人仍要继续过真正变难的日子。",
      "你把别人的难堪讲成一个笑话，席间气氛果然好了。笑声结束得很快，被讲述的人却从此在不知情处多了一种形象。",
    ),
    effects: [add("shadow.harmDone", 3), add("shadow.complicity", 3), add("shadow.hardness", 2), add("shadow.trustDebt", 2), add("resources.reputation", 1), { addTag: "shadow_humiliation_shared" }],
  }),
  shadowEvent({
    id: "schadenfreude_end",
    title: "旧笑话传到另一张桌上",
    category: "relationship",
    ageRange: [22, 88],
    requiresEvents: ["shadow_private_schadenfreude_spreads"],
    close: true,
    conditions: { all: [C("shadow.complicity", "gte", 3)] },
    text: V(
      [C("shadow.guilt", "gte", 4)],
      "那段话传回当事人耳中，你没有再说只是玩笑，而是承认自己拿他的痛苦换过气氛。对方没有接受道歉，至少羞耻这次没有被继续转交。",
      [C("meta.age", "gte", 65)],
      "多年后旧事被晚辈提起，你仍笑说大家当年都这样。桌上没有人接这个笑话，话题很快换了；旧故事还在，只是不再替你活跃气氛。",
      "当事人从别人那里听见了版本，此后熟人有难处时不再先告诉你。没有公开争吵，也没有戏剧性的报应，只是你后来总比别人晚一点知道消息。",
    ),
    effects: [add("shadow.guilt", 1), add("shadow.selfDeception", 1), add("shadow.trustDebt", 3), add("resources.reputation", -3), add("relationships.friendship", -3), add("resources.happiness", -2), { addTag: "shadow_joke_reached_target" }],
  }),
];
