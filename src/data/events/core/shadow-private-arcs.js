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
  "kin_loan",
  "work_blame",
  "care_capture",
];

const PRIVATE_CHAIN_STAGES = [
  ["jealous_friend_seed", "jealous_friend_credit", "jealous_friend_end"],
  ["control_partner_seed", "control_partner_tightens", "control_partner_end"],
  ["betrayal_seed", "betrayal_lie", "betrayal_end"],
  ["favoritism_seed", "favoritism_account", "favoritism_end"],
  ["care_dodge_seed", "care_dodge_burden", "care_dodge_end"],
  ["gambling_seed", "gambling_debt", "gambling_end", "gambling_later"],
  ["drinking_seed", "drinking_repeats", "drinking_end", "drinking_later"],
  ["petty_theft_seed", "petty_theft_lie", "petty_theft_end"],
  ["long_lie_seed", "long_lie_recruits", "long_lie_end"],
  ["cold_silence_seed", "cold_silence_house", "cold_silence_end"],
  ["child_harm_seed", "child_harm_pattern", "child_harm_end"],
  ["schadenfreude_seed", "schadenfreude_spreads", "schadenfreude_end"],
  ["kin_loan_seed", "kin_loan_rewrite", "kin_loan_pressure", "kin_loan_end"],
  ["work_blame_seed", "work_blame_record", "work_blame_distance", "work_blame_end"],
  ["care_capture_seed", "care_capture_default", "care_capture_boundary", "care_capture_end"],
];
const NEXT_PRIVATE_STAGE = new Map(PRIVATE_CHAIN_STAGES.flatMap((stages) => stages
  .slice(0, -1)
  .map((stage, index) => [stage, stages[index + 1]])));
const FINAL_PRIVATE_STAGES = new Set(PRIVATE_CHAIN_STAGES.map((stages) => stages.at(-1)));

function privateDomain(id) {
  return `shadow_private_${PRIVATE_CHAIN_PREFIXES.find((prefix) => id.startsWith(prefix)) ?? "other"}`;
}

function scopeThreadConditions(value, domain) {
  if (Array.isArray(value)) return value.map((item) => scopeThreadConditions(item, domain));
  if (!value || typeof value !== "object") return value;
  const scoped = Object.fromEntries(Object.entries(value).map(([key, item]) => [key, scopeThreadConditions(item, domain)]));
  if (scoped.path === "shadow.guilt") scoped.path = `shadow.threads.${domain}.guilt`;
  return scoped;
}

function threadEffects(effects, domain, close) {
  const adjusted = close ? effects.filter((effect) => effect.path !== "shadow.guilt") : effects;
  return adjusted.flatMap((effect) => {
    const mirrored = [];
    if (effect.path === "shadow.guilt" && effect.add > 0) {
      mirrored.push(add(`shadow.threads.${domain}.guilt`, effect.add));
    }
    if (effect.path === "shadow.selfDeception" && effect.add > 0) {
      mirrored.push(add(`shadow.threads.${domain}.justification`, effect.add));
    }
    if (["resources.wealth", "resources.achievement", "resources.reputation"].includes(effect.path) && effect.add > 0) {
      mirrored.push(add(`shadow.threads.${domain}.benefitRetained`, Math.min(4, effect.add)));
    }
    return [effect, ...mirrored];
  });
}

function scheduleNextStage(id, close) {
  const nextId = NEXT_PRIVATE_STAGE.get(id);
  if (!nextId || close) return [];
  const nextIsFinal = FINAL_PRIVATE_STAGES.has(nextId);
  const delayYears = [2, nextIsFinal ? 10 : 7];
  return [{
    scheduleEvent: {
      eventId: `shadow_private_${nextId}`,
      delayYears,
      // This changes only an already-open arc: it does not make openings more
      // common, but keeps a crowded event pool from silently dropping a trace.
      weightMultiplier: nextIsFinal ? 16 : 24,
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
  const domain = privateDomain(id);

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
    narrativeDomain: domain,
    narrativeThread: close ? { close: true } : { expiresAfterYears: dependencyWindow.maxYears },
    conditions: scopeThreadConditions(timedConditions, domain),
    requiresEvents,
    text: scopeThreadConditions(text, domain),
    effects: [
      ...(opening ? [{ initializeShadowThread: domain }] : []),
      ...threadEffects(effects ?? [], domain, close),
      ...scheduleNextStage(id, close),
    ],
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
    conditions: { all: [C("shadow.selfDeception", "gte", 2)] },
    text: [
      { conditions: { all: [C("relationships.partnerStatus", "eq", "widowed")] }, text: "伴侣去世后整理旧物，你才发现对方早把一部分钱、证件和来往单独收好。那不是临终秘密，而是在你的盘问里给自己留的一小块门内空间。" },
      { conditions: { all: [C("relationships.partnerStatus", "in", ["separated", "single"])] }, text: "关系结束后，对方仍把账号和日程同你分得很开。你抱怨这份戒备太久，却很少承认它正是在过去逐笔盘问里练出来的。" },
      { conditions: { all: [C("resources.wealth", "lte", 38)] }, text: "日子紧，你要求伴侣把每笔小钱说明，自己的花销却归入必要。贫穷没有制造这种双重标准，只让它每天都有账本可用。" },
      { conditions: { all: [C("meta.currentYear", "gte", 2000)] }, text: "你查看伴侣的付款记录和行程，说一家人不该有秘密。屏幕给了控制更多栏目，信任则被你要求不断上传证明。" },
      { text: "你开始过问伴侣同谁来往、何时回家、钱怎么花。每一项单看都能解释，合在一起便是一间没有栏杆的牢房。" },
    ],
    effects: [add("shadow.hardness", 2), add("shadow.harmDone", 4), add("shadow.trustDebt", 5), add("shadow.resentment", 2), add("relationships.partnerQuality", -12), add("relationships.romance", -8), { addTag: "shadow_partner_monitored" }],
  }),
  shadowEvent({
    id: "control_partner_end",
    title: "门从里面有了另一把锁",
    category: "family",
    ageRange: [27, 78],
    requiresEvents: ["shadow_private_control_partner_tightens"],
    close: true,
    conditions: { all: [C("shadow.trustDebt", "gte", 6)] },
    text: [
      { conditions: { all: [C("relationships.partnerStatus", "eq", "widowed")] }, text: "伴侣已经不在，你仍从分开的账目和旧钥匙里看见那条边界。死亡没有替过去和解，只使你再也不能要求对方证明当时为何需要防着你。" },
      { conditions: { all: [C("relationships.partnerStatus", "in", ["separated", "single"])] }, text: "关系结束后，对方保留了自己的证件、钱款和日程，也不再向你说明。你终于失去盘问的入口；边界来得很硬，因为早些时候较轻的话都没有被听见。" },
      { conditions: { all: [C("shadow.guilt", "gte", 4)] }, text: "你第一次把钱、来往和出门的决定交还给伴侣自己处理，也没有把这叫作恩让。对方仍保留自己的钥匙和退路；边界立起来了，信任要不要回来并不由你决定。" },
      { conditions: { all: [C("relationships.partnerQuality", "lte", 28)] }, text: "伴侣把证件、钱款和日程分开保管，共同生活只剩需要协商的部分。你们没有立刻分开，屋里却从此有一扇门不再由你单方面开关。" },
      { text: "伴侣明确拒绝再汇报每笔钱和每次来往，你先说这不像一家人，后来发现争执也无法让旧秩序回来。关系仍在，控制第一次遇到不肯配合的边界。" },
    ],
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
    conditions: { all: [C("shadow.complicity", "gte", 2)] },
    text: [
      { conditions: { all: [C("relationships.partnerStatus", "eq", "widowed")] }, text: "伴侣去世后，再没有人能同你核对当年的两个版本。你向亲友把那段关系讲得比实际平整，死者的沉默被你借来替自己作证。" },
      { conditions: { all: [C("relationships.partnerStatus", "in", ["separated", "single"])] }, text: "关系已经结束，你向不同亲友讲了两个分开的版本：一个省去隐瞒，一个把怀疑全归给对方。共同生活没有了，争夺过去解释权的习惯还在。" },
      { conditions: { all: [C("meta.currentYear", "gte", 2000)] }, text: "一条没有删净的消息让伴侣起疑，你先否认，再把问题说成对方不信任你。屏幕留下时间，只有责任被你反复撤回。" },
      { conditions: { all: [C("relationships.children", "gte", 1)] }, text: "孩子问你为什么最近总晚回家，你拿工作搪塞，也让伴侣在饭桌上陪你维持说法。秘密不再只是两个人的事，无辜的人被迫替它保持安静。" },
      { text: "你为同一个晚上准备两个版本，细节说得越完整，家里的沉默越重。谎言暂时保住表面，也让真正的解释一天比一天昂贵。" },
    ],
    effects: [add("shadow.complicity", 3), add("shadow.harmDone", 4), add("shadow.selfDeception", 2), add("shadow.trustDebt", 5), add("relationships.partnerQuality", -10), add("resources.happiness", -4), { addTag: "shadow_betrayal_lie" }],
  }),
  shadowEvent({
    id: "betrayal_end",
    title: "承认没有带回原来的信任",
    category: "relationship",
    ageRange: [27, 76],
    requiresEvents: ["shadow_private_betrayal_lie"],
    close: true,
    conditions: { all: [C("shadow.trustDebt", "gte", 6)] },
    text: [
      { conditions: { all: [C("relationships.partnerStatus", "eq", "widowed")] }, text: "你终于不再把那段隐瞒讲成无事发生。已经没有人能接受坦白或拒绝原谅，承认只停止了你继续借死者的沉默替自己修饰。" },
      { conditions: { all: [C("relationships.partnerStatus", "in", ["separated", "single"])] }, text: "关系已经结束后，旧谎言仍在几次交接和偶遇里冒出来。你不再拥有被追问的日常，却仍得承认分开没有替过去改写日期。" },
      { conditions: { all: [C("shadow.guilt", "gte", 4)] }, text: "你把隐瞒的事说清，没有要求伴侣当场原谅。此后很长时间，迟到和沉默都需要重新解释；坦白停止新增债务，旧债仍按自己的速度结算。" },
      { text: "你承认了一部分，又把最伤人的部分说成对方想多。关系没有立刻结束，只从亲密变成互相核对；同一屋檐还在，被相信的便利已经没有了。" },
    ],
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
    ageRange: [32, 92],
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
    ageRange: [34, 92],
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
    conditions: { all: [C("relationships.family", "gte", 20)] },
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
  shadowEvent({
    id: "gambling_later",
    title: "日子不再等你翻本",
    category: "wealth",
    ageRange: [28, 92],
    requiresEvents: ["shadow_private_gambling_end"],
    close: true,
    conditions: { all: [C("shadow.trustDebt", "gte", 8)] },
    text: [
      { conditions: { all: [C("shadow.selfDeception", "gte", 16), C("shadow.resentment", "gte", 6)] }, text: "你隔过一阵又试图把损失翻回来，借口从手气变成最后一次。家人没有再陪你计算可能赢多少，只按最坏的数目安排吃住；反复仍在，替你兜底的日子先停了。" },
      { conditions: { all: [C("shadow.guilt", "gte", 7)] }, text: "你有过反复，也有过把钱重新交给冲动的夜晚。后来共同钱款仍由别人保管，你只按约定拿自己的一份；克制不是恢复了信任，只是每天少添一张新欠条。" },
      { conditions: { all: [C("meta.age", "gte", 65)] }, text: "年纪大后，你把那几年说成走过弯路，很少提家人因此取消过什么。债大多有了着落，旧习惯却留下一条规矩：涉及钱的决定，别人仍会多问一句。" },
      { conditions: { all: [C("meta.currentYear", "lte", 1949)] }, text: "后来家里的粮钱和急用不再交你一人保管。你偶尔抱怨亲人防得太严，他们只把下一季该留多少重新数一遍；日子照常过，侥幸不再有权先碰家用。" },
      { conditions: { all: [C("meta.currentYear", "gte", 1950), C("meta.currentYear", "lte", 1999)] }, text: "往后的工资、存折和必要开支由家人分开安排，你若临时要钱便要说清用途。你觉得自己在家里像个外人，别人则终于不用等一个保证决定下个月怎么过。" },
      { conditions: { all: [C("meta.currentYear", "gte", 2000)] }, text: "家人把共同账户、自动扣款和你的可用钱分开，不再靠口头保证守住生活费。技术只是换了把锁，真正让锁留下的是过去那些被你称作最后一次的夜晚。" },
      { text: "输赢慢慢退出了日常，家里的计划却没有立刻把你加回去。饭照常盛你的那一碗，要紧开支仍由别人先确认；日历一页页撕掉，旧欠条安静地留在抽屉里。" },
    ],
    effects: [add("shadow.guilt", 1), add("shadow.selfDeception", 2), add("shadow.trustDebt", 3), add("relationships.family", -3), add("resources.happiness", -2), { addTag: "shadow_gambling_life_replanned" }],
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
    ageRange: [22, 82],
    requiresEvents: ["shadow_private_drinking_repeats"],
    conditions: { all: [C("shadow.trustDebt", "gte", 6)] },
    text: [
      { conditions: { all: [C("relationships.partnerStatus", "eq", "widowed")] }, text: "伴侣已经不在，亲友也不再替你把过去的失约讲成应酬。需要陪同的事由别人先安排好，你若清醒到场便一起去；死者的缺席没有替你的保证恢复效力。" },
      { conditions: { all: [C("relationships.partnerStatus", "in", ["separated", "single"])] }, text: "关系结束后，对方只在必要事项上确认你是否能到场，并预备另一套安排。你说这种防备太冷，对方却不再把生活押在判断你这次会不会失约上。" },
      { conditions: { all: [C("career.status", "in", ["none", "unemployed", "laid_off", "retired"])] }, text: "离开工作后，应酬不再是现成理由，失约却没有立刻停止。亲友把要紧安排交给别人，你才发现问题从来不只属于酒桌或单位。" },
      { conditions: { all: [C("relationships.children", "gte", 1)] }, text: "孩子长到会自己安排事情后，不再提前把你的承诺写进计划。你确实到场时他仍会高兴，只是不再让期待先承担落空的风险。" },
      { conditions: { all: [C("shadow.guilt", "gte", 5)] }, text: "你开始接受长期帮助，也允许家人设下清楚边界。关系没有因几个月平稳就复原，日历上的每一天只证明今天没有新增伤害。" },
      { conditions: { all: [C("resources.health", "lte", 35)] }, text: "身体需要照顾时，家人把能做和不能做的事都说清楚，也不再替你向别人解释失约。必要的帮助仍在，过去那种无限兜底已经停了。" },
      { text: "亲友安排重要事情时不再把你的承诺算在内，等你确实到场才临时添一把椅子。你仍把几次缺席说成偶然，日程却已经学会不用你的保证。" },
    ],
    effects: [add("shadow.guilt", 1), add("shadow.trustDebt", 3), add("resources.health", -5), add("relationships.family", -5), add("resources.happiness", -3), { addTag: "shadow_commitments_not_relied_on" }],
  }),
  shadowEvent({
    id: "drinking_later",
    title: "到场以后，椅子才添上",
    category: "health",
    ageRange: [30, 94],
    requiresEvents: ["shadow_private_drinking_end"],
    close: true,
    conditions: { all: [C("shadow.trustDebt", "gte", 8)] },
    text: [
      { conditions: { all: [C("shadow.selfDeception", "gte", 16), C("shadow.resentment", "gte", 6)] }, text: "平稳一阵后你又失约，仍说这次情况特殊。亲友没有同你争特殊不特殊，只把接送、照护和要紧安排交给更可靠的人；争论停了，后果照常执行。" },
      { conditions: { all: [C("shadow.guilt", "gte", 7)] }, text: "你开始较长期地接受帮助，也经历过反复。家人不再把一次清醒当作大团圆，只在你确实到场时把事情交给你；信任恢复得很慢，因为它终于不再靠感动计时。" },
      { conditions: { all: [C("resources.health", "lte", 35)] }, text: "身体后来需要别人照料，家人仍送药、陪诊，也明确不替你遮掩失约。照护没有被拿来证明过去已经原谅，必要的善意与清楚的边界同时留在屋里。" },
      { conditions: { all: [C("meta.age", "gte", 65)] }, text: "年纪渐长后，你较少出现在酒桌上，亲友仍保留旧习惯：重要的事先另找一个人托底。你觉得许多年前的账算得太久，他们只是终于不再拿要紧日子试验你的变化。" },
      { conditions: { all: [C("meta.currentYear", "lte", 1949)] }, text: "往后家里遇到要紧事，先去请另一个可靠的人，你到了再分一件能当场做完的活。没人宣布不再信你，安排本身已经把这句话说得很清楚。" },
      { conditions: { all: [C("meta.currentYear", "gte", 1950), C("meta.currentYear", "lte", 1999)] }, text: "家里和单位各自学会留一个替补，不再让你的保证占住唯一的位置。你仍参加许多普通聚会，只在真正要紧的时候发现，名单早已按能兑现的人重排。" },
      { conditions: { all: [C("meta.currentYear", "gte", 2000)] }, text: "群里的时间地点仍会发给你，接送和照护却另有确认过的人负责。你没有被公开赶走，只从关键事项的默认联系人变成了到场以后再算的人。" },
      { text: "往后的聚会不再由你负责关键一环。你来了，大家便添一把椅子；没来，饭菜和行程照旧。你仍过着普通日子，只是别人的生活终于不必押在你的保证上。" },
    ],
    effects: [add("shadow.guilt", 1), add("shadow.selfDeception", 1), add("shadow.trustDebt", 3), add("relationships.family", -3), add("resources.happiness", -2), { addTag: "shadow_drinking_boundaries_hold" }],
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
      "那几次便宜一直没人查到，你也没有因此变成传奇。只是后来每逢东西少了，熟人会先把抽屉合上再同你说话；怀疑不必宣判，也能慢慢改掉一间屋里的动作。",
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
    title: "旧说法有了自己的寿命",
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
      "后来很少再有人核对那段旧事，你的版本便顺利留了下来。曾替你圆谎的人不再主动谈起，你则渐渐把没人追问记成了从未说错。",
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
    conditions: { all: [C("shadow.hardness", "gte", 2)] },
    text: [
      { conditions: { all: [C("relationships.partnerStatus", "eq", "widowed")] }, text: "伴侣去世后，屋里真的只剩你的声音。你想起过去那些故意不回应的日子，才明白安静曾被你拿来惩罚别人，如今也不会替你把话补回去。" },
      { conditions: { all: [C("relationships.partnerStatus", "in", ["separated", "single"])] }, text: "关系结束后，你们只在必要事项上说话。过去你用沉默逼对方先开口，如今对方不再等，必要句子说完便把门关上。" },
      { conditions: { all: [C("relationships.children", "gte", 1)] }, text: "你们之间只谈接送、吃饭和账单，孩子学会先判断今天谁能被问问题。家庭仍运转，像一台没有润滑却坚持不肯停的机器。" },
      { conditions: { all: [C("meta.age", "gte", 55)] }, text: "多年的冷处理使伴侣不再追着解释，只把生活分成各自一半。你以为终于清静，却发现没人争论也可能是没人还期待被理解。" },
      { text: "沉默从几天变成惯例，家里只剩必要句子。你仍等对方先低头，对方则慢慢学会把重要感受交给别处。" },
    ],
    effects: [add("shadow.hardness", 3), add("shadow.harmDone", 4), add("shadow.trustDebt", 5), add("shadow.resentment", 3), add("relationships.partnerQuality", -13), add("relationships.romance", -10), { addTag: "shadow_silent_house" }],
  }),
  shadowEvent({
    id: "cold_silence_end",
    title: "对方不再等你开口",
    category: "family",
    ageRange: [30, 82],
    requiresEvents: ["shadow_private_cold_silence_house"],
    close: true,
    conditions: { all: [C("shadow.trustDebt", "gte", 6)] },
    text: [
      { conditions: { all: [C("relationships.partnerStatus", "eq", "widowed")] }, text: "再没有人等你开口以后，那套沉默也失去了惩罚对象。你偶尔对着空屋把一句旧解释说完，答案不会回来；迟到的话仍然只算迟到。" },
      { conditions: { all: [C("relationships.partnerStatus", "in", ["separated", "single"])] }, text: "关系结束后，你们为少数必要事情重新说话。对方只确认时间和事项，不再追问你当年为何沉默；没有观众以后，那套惩罚也失去了原来的用处。" },
      { conditions: { all: [C("shadow.guilt", "gte", 4)] }, text: "你第一次不等对方猜，直接说出愤怒和害怕，也听完对方这些年的感受。关系只修回一小段，至少这一次，沉默没有被继续拿来逼人先低头。" },
      { text: "伴侣不再等待你开口，开始单独安排生活。你说对方变冷，对方只把下一周的事项讲完，屋里仍有谈话，却很少再有需要托付的心事。" },
    ],
    effects: [add("shadow.guilt", 1), add("shadow.trustDebt", 3), add("relationships.partnerQuality", -7), add("relationships.romance", -5), add("resources.happiness", -3), { addTag: "shadow_silence_became_distance" }],
  }),

  // 11. Repeating injury onto children.
  shadowEvent({
    id: "child_harm_seed",
    title: "把受过的话又说了一遍",
    category: "family",
    ageRange: [24, 58],
    opening: true,
    conditions: { all: [C("relationships.children", "gte", 1), C("relationships.oldestChildAge", "gte", 5)] },
    text: V(
      [C("resources.wealth", "lte", 38)],
      "生活压力很重，你却把挫败变成对孩子的刻薄，讥讽他不懂事、不争气。贫困解释疲惫，不能把孩子变成情绪的偿债人。",
      [C("education.score", "gte", 65), C("relationships.oldestChildAge", "gte", 7)],
      "你以自己读书或工作的标准要求孩子，一次失误便被说成不用心。你称之为为他好，孩子听见的却是爱要靠成绩续费。",
      "孩子做错一件小事，你脱口说出童年里最伤你的那句话。声音从你嘴里出来时熟悉得可怕，你仍先用管教替它解释。",
    ),
    effects: [add("shadow.harmDone", 3), add("shadow.selfDeception", 3), add("shadow.hardness", 2), add("shadow.trustDebt", 3), add("relationships.family", -6), { addTag: "shadow_harm_repeated_to_child" }],
  }),
  shadowEvent({
    id: "child_harm_pattern",
    title: "孩子学会先藏起坏消息",
    category: "family",
    ageRange: [28, 66],
    requiresEvents: ["shadow_private_child_harm_seed"],
    conditions: { all: [C("relationships.children", "gte", 1), C("relationships.oldestChildAge", "gte", 7), C("shadow.harmDone", "gte", 3)] },
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
    conditions: { all: [C("relationships.children", "gte", 1), C("relationships.oldestChildAge", "gte", 12), C("shadow.trustDebt", "gte", 6)] },
    text: V(
      [C("shadow.guilt", "gte", 3)],
      "一次争执后，孩子把你常说的那句刻薄话原样复述给你。你这次没有争词义，只承认它确实从自己这里来；后来每次停住半句话，都比一次漂亮道歉更费力。",
      [C("meta.age", "gte", 65), C("relationships.oldestChildAge", "gte", 18)],
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
    text: [
      { conditions: { all: [C("shadow.guilt", "gte", 4)] }, text: "那段话传回当事人耳中，你没有再说只是玩笑，而是承认自己拿他的痛苦换过气氛。对方没有接受道歉，至少羞耻这次没有被继续转交。" },
      { conditions: { all: [C("meta.age", "gte", 65)] }, text: "多年后旧事被晚辈提起，你仍笑说大家当年都这样。桌上没有人接这个笑话，话题很快换了；旧故事还在，只是不再替你活跃气氛。" },
      { conditions: { all: [C("meta.currentYear", "lte", 1881)] }, text: "当事人从别人那里听见了版本，此后熟人有难处时不再先告诉你。饭桌仍给你留位置，真正要紧的口信却先托给别人；你后来总比旁人晚一点知道消息。" },
      { conditions: { all: [C("meta.currentYear", "lte", 1949)] }, text: "当事人从别人那里听见了版本，此后熟人有难处时不再先告诉你。饭桌仍给你留位置，真正要紧的消息却绕过你托人转告；你后来总比旁人晚一点知道消息。" },
      { text: "当事人从别人那里听见了版本，此后熟人有难处时不再先告诉你。饭桌仍给你留位置，话题到真正要紧处便先绕去打给别人的电话；你后来总比别人晚一点知道消息。" },
    ],
    effects: [add("shadow.guilt", 1), add("shadow.selfDeception", 1), add("shadow.trustDebt", 3), add("resources.reputation", -3), add("relationships.friendship", -3), add("resources.happiness", -2), { addTag: "shadow_joke_reached_target" }],
  }),

  // 13. A loan between intimates is slowly rewritten as a favor with no due date.
  shadowEvent({
    id: "kin_loan_seed",
    title: "先借来渡过这一阵",
    category: "wealth",
    ageRange: [20, 72],
    opening: true,
    conditions: {
      any: [C("relationships.family", "gte", 28), C("relationships.friendship", "gte", 24)],
    },
    text: [
      { conditions: { all: [C("meta.currentYear", "lte", 1949)] }, text: "你向亲友借了一笔应急的钱或粮，约好下个收成、下次发薪便还。借据写得很短，彼此的信任替许多细节作了担保；你离开时已经在想，若对方不催，也许可以再缓一缓。" },
      { conditions: { all: [C("meta.currentYear", "gte", 2000)] }, text: "亲友把钱转给你救急，备注栏只写了周转。你答应很快归还，随后删掉聊天框里那句具体日期；数字仍在记录里，期限先从你口中消失。" },
      { conditions: { all: [C("location.migratedTimes", "gte", 1)] }, text: "异地最难的时候，一位亲友把积蓄匀给你。你说站稳脚便还，后来站稳的标准一再往后挪；距离让催问显得不近人情，也正合你的方便。" },
      { text: "你从亲友那里借来一笔急用，承诺等手头松一点便归还。钱确实解了燃眉之急，关系也因此多出一个只有你能不断改期的约定。" },
    ],
    effects: [add("resources.wealth", 6), add("shadow.harmDone", 2), add("shadow.selfDeception", 3), add("shadow.complicity", 2), add("shadow.trustDebt", 3), add("relationships.friendship", -2), add("relationships.family", -1), { addTag: "shadow_kin_loan_taken" }],
  }),
  shadowEvent({
    id: "kin_loan_rewrite",
    title: "还款日变成了人情",
    category: "wealth",
    ageRange: [22, 79],
    requiresEvents: ["shadow_private_kin_loan_seed"],
    conditions: { all: [C("shadow.selfDeception", "gte", 3)] },
    text: [
      { conditions: { all: [C("resources.wealth", "gte", 62)] }, text: "手头已经能挪出一部分，你却先添置别的东西，只给债主带了礼物。礼物被你算作情分，借款则继续算作困难；同一笔钱在你这里学会了两套账法。" },
      { conditions: { all: [C("meta.currentYear", "gte", 2000)] }, text: "对方在消息里问起还款，你隔了很久只回最近也难。几天后你照常晒出一次消费，又安慰自己那不是同一笔钱；屏幕把两件事排得很近，你仍努力把它们分开。" },
      { conditions: { all: [C("relationships.partnerStatus", "in", ["partnered", "married"])] }, text: "伴侣问这笔借款何时还，你把当年的帮助说成两家互相照应。说法听起来宽厚，却只由欠钱的一方宣布；债主没有参加这次改名。" },
      { text: "亲友第一次认真催问时，你先觉得受了轻视，列举自己过去帮过他的事。借款没有减少，反倒被你改写成一场谁更讲情分的争论。" },
    ],
    effects: [add("shadow.harmDone", 3), add("shadow.selfDeception", 4), add("shadow.resentment", 3), add("shadow.trustDebt", 5), add("relationships.friendship", -5), add("relationships.family", -3), { addTag: "shadow_kin_loan_rewritten" }],
  }),
  shadowEvent({
    id: "kin_loan_pressure",
    title: "催债的人反而先闭嘴",
    category: "relationship",
    ageRange: [24, 86],
    requiresEvents: ["shadow_private_kin_loan_rewrite"],
    conditions: { all: [C("shadow.trustDebt", "gte", 6)] },
    text: [
      { conditions: { all: [C("shadow.guilt", "gte", 5)] }, text: "对方再问时，你还了一小部分，也第一次没有附带自己的难处。余款仍在，关系也没有因一次转账恢复；迟来的认真只是让债务重新有了准确名字。" },
      { conditions: { all: [C("shadow.resentment", "gte", 6)] }, text: "你向共同亲友抱怨对方认钱不认人，把催问讲成逼迫。债主后来不再公开追着你，只把借钱那天的信任从此收回；安静不是同意，是他不愿再为事实参加辩论。" },
      { conditions: { all: [C("meta.age", "gte", 60)] }, text: "年月久了，你开始用记不清数目回答。对方保存着旧纸或转账记录，却很少再拿出来；证据还在，愿意同你说话的部分先磨薄了。" },
      { text: "债主终于减少来往，也不再问得那么勤。你把沉默理解成算了，他把沉默用来止损；同一个词替两个人保留了完全不同的旧账。" },
    ],
    effects: [add("shadow.harmDone", 2), add("shadow.selfDeception", 3), add("shadow.trustDebt", 5), add("relationships.friendship", -7), add("relationships.family", -4), add("resources.reputation", -2), { addTag: "shadow_kin_loan_contact_thins" }],
  }),
  shadowEvent({
    id: "kin_loan_end",
    title: "往来里不再谈钱",
    category: "relationship",
    ageRange: [28, 96],
    requiresEvents: ["shadow_private_kin_loan_pressure"],
    close: true,
    conditions: { all: [C("shadow.trustDebt", "gte", 9)] },
    text: [
      { conditions: { all: [C("shadow.guilt", "gte", 8)] }, text: "你后来陆续补还一部分，清楚写下仍欠多少，也没有要求关系随收据一起恢复。对方收下钱，往来仍旧稀薄；偿还可以结束债务的一段，不能替被耗尽的信任签收。" },
      { conditions: { all: [C("shadow.selfDeception", "gte", 16), C("shadow.resentment", "gte", 8)] }, text: "你一直坚持亲友之间不该算得太清，自己借给别人时却开始写明日期。经验教会了你防范，没有教会你把旧事换回债主的视角。" },
      { conditions: { all: [C("meta.age", "gte", 70)] }, text: "晚年偶尔见面，你们谈身体、天气和共同认识的人，从不再谈那笔钱。你把这当作彼此放下，对方只是把无法收回的部分连同争辩一起从生活里删掉。" },
      { conditions: { all: [C("meta.currentYear", "lte", 1949)] }, text: "后来碰上年节或红白事，你们仍按礼数见面，借据却像箱底一张不宜示人的旧纸。你说年月已经替双方磨平了，对方只是再没把粮钱托到你手里。" },
      { conditions: { all: [C("meta.currentYear", "gte", 2000)] }, text: "转账记录一直躺在旧账号里，往来却只剩节日问候和偶尔点赞。你说真要计较早就计较了，对方只是把追款与亲近一起停止，省下继续解释的力气。" },
      { text: "亲友没有告你，也没有公开撕破脸，只把金钱和要紧事从此绕开你。你继续过普通日子，旧借款有时甚至不再被提起；不被提起的责任并不会因此自动归零。" },
    ],
    effects: [add("shadow.guilt", 1), add("shadow.selfDeception", 2), add("shadow.trustDebt", 3), add("relationships.friendship", -5), add("relationships.family", -3), { addTag: "shadow_kin_loan_became_distance" }],
  }),

  // 14. A small workplace failure is made to travel downward to the least protected person.
  shadowEvent({
    id: "work_blame_seed",
    title: "差错先落到新人头上",
    category: "career",
    ageRange: [22, 66],
    opening: true,
    conditions: {
      any: [
        {
          all: [
            C("meta.currentYear", "lte", 1977),
            C("career.status", "in", ["employed", "family_labor"]),
            C("career.level", "gte", 6),
          ],
        },
        {
          all: [
            C("meta.currentYear", "gte", 1978),
            C("career.status", "eq", "employed"),
            C("career.managesPeople", "eq", true),
          ],
        },
      ],
    },
    text: [
      { conditions: { all: [C("meta.currentYear", "lte", 1949)] }, text: "一件活出了差错，你在东家或管事面前把关键一步推给新来的学徒。对方确实动过手，决定赶工和省料的人却是你；半真最适合拿来压住没有资历的辩解。" },
      { conditions: { all: [C("career.status", "eq", "family_labor")] }, text: "家里的活误了时辰，你当着长辈说是年轻帮手没听明白。真正改过安排的人是你，辈分却替一句话决定了谁更像在撒谎。" },
      { conditions: { all: [C("meta.currentYear", "gte", 2000)] }, text: "项目出了小错，你在复盘里强调新人没有及时确认，删去了自己临时改口的那段消息。记录很多，最会写记录的人仍更容易决定哪一条算原因。" },
      { text: "工作出了问题，你先把责任推给资历最浅的人。对方也有疏忽，却承担了本该由几个人分开的那一份；你的名字因此从说明里轻了一些。" },
    ],
    effects: [add("shadow.harmDone", 3), add("shadow.selfDeception", 3), add("shadow.complicity", 3), add("shadow.trustDebt", 4), add("resources.reputation", 2), add("career.level", 1), { addTag: "shadow_work_blame_shifted" }],
  }),
  shadowEvent({
    id: "work_blame_record",
    title: "一句坏话只跟着一个人走",
    category: "career",
    ageRange: [24, 73],
    requiresEvents: ["shadow_private_work_blame_seed"],
    conditions: { all: [C("shadow.complicity", "gte", 3)] },
    text: [
      { conditions: { all: [C("meta.currentYear", "lte", 1949), C("career.status", "in", ["none", "unemployed", "laid_off", "retired"])] }, text: "你已经离开那间铺子或那伙活，原来的新人却仍背着当年一句坏评语找差事。你说如今插不上话，仿佛换了东家，当年那句失实的话便也不再出自你口。" },
      { conditions: { all: [C("meta.currentYear", "gte", 1950), C("career.status", "in", ["none", "unemployed", "laid_off", "retired"])] }, text: "你已经离开那份工作，原来的新人却仍带着那次处分或坏评语找下一条路。你说自己如今插不上话，仿佛换了岗位便能把当年的责任留在原处。" },
      { conditions: { all: [C("meta.currentYear", "lte", 1949), C("resources.reputation", "gte", 55)] }, text: "东家或同行先信了你的说法，年轻帮手少领一次好差事。后来人们仍称你稳妥；稳妥的一部分，正是有人替你背过不稳妥的名声。" },
      { conditions: { all: [C("resources.reputation", "gte", 55)] }, text: "你的说法先被采信，年轻同事失去一次机会。后来人们仍称你稳妥，稳妥的一部分正来自有人替你承担过不稳妥的证据。" },
      { conditions: { all: [C("meta.currentYear", "gte", 2000)] }, text: "那次差错进入绩效记录，新人此后每次失误都被说成又一次。你偶尔在会议上替他讲一句成长很快，听起来宽厚，也让最初那份责任分配更难重开。" },
      { conditions: { all: [C("meta.currentYear", "lte", 1949)] }, text: "被你点名的人少了一次派活、工钱或入行的门路，你照常做自己的活。伤害最普通的样子，往往只是一个人守住原位，另一个人多走一段弯路。" },
      { text: "被你点名的人少了一次排班、工钱或晋升机会，你的日子没有明显变化。伤害最普通的样子，往往只是一个人继续上班，另一个人多走一段弯路。" },
    ],
    effects: [add("shadow.harmDone", 4), add("shadow.hardness", 2), add("shadow.selfDeception", 3), add("shadow.trustDebt", 5), add("relationships.friendship", -5), add("resources.reputation", 1), { addTag: "shadow_work_blame_recorded" }],
  }),
  shadowEvent({
    id: "work_blame_distance",
    title: "后来没人替你补最后一句",
    category: "relationship",
    ageRange: [26, 82],
    requiresEvents: ["shadow_private_work_blame_record"],
    conditions: { all: [C("shadow.trustDebt", "gte", 7)] },
    text: [
      { conditions: { all: [C("meta.currentYear", "lte", 1949), C("career.status", "in", ["none", "unemployed", "laid_off", "retired"])] }, text: "离开那间铺子或那伙活后，你偶尔托旧同行办事。对方礼数周全，却不再替你多说一句、赶一步路；旧关系没有报复，只收回了从前额外给你的方便。" },
      { conditions: { all: [C("meta.currentYear", "gte", 1950), C("career.status", "in", ["none", "unemployed", "laid_off", "retired"])] }, text: "离开那份工作后，你偶尔托旧同事办事，回复总是礼貌而简短。没人提那次差错，也没人再替你补充有利的背景；旧关系没有报复，只撤回了额外的那一步。" },
      { conditions: { all: [C("meta.currentYear", "lte", 1949), C("shadow.guilt", "gte", 5)] }, text: "再议起旧事时，你终于承认当年临时改动是自己的主意。账面或众人口中多了一句实话，新人失去的门路却没有倒着回来；补全事实，不等于把后果送还原处。" },
      { conditions: { all: [C("meta.currentYear", "gte", 1950), C("shadow.guilt", "gte", 5)] }, text: "又一次复盘时，你补充说明当年临时改动是自己的决定。记录终于多了一行，新人失去的机会却没有倒着回来；更正事实不是把后果交还原处。" },
      {
        conditions: {
          all: [C("shadow.hardness", "gte", 7), C("meta.currentYear", "lte", 1979)],
          any: [
            C("location.currentCityTier", "in", ["village", "town"]),
            C("location.currentProvince", "in", ["gansu", "qinghai", "xinjiang", "xizang"]),
          ],
        },
        text: "你后来更会把差错拆成一道道手续，自己的主意只认最末一道。同行当面点头，要紧顾虑却托熟人捎话，或写进一封绕过你的信；路越远，等你听见时越像事情早已有了定论。",
      },
      { conditions: { all: [C("shadow.hardness", "gte", 7), C("meta.currentYear", "lte", 1949)] }, text: "你后来更会把差错分给每一道经手，自己的主意反倒说得最轻。同行议事时当面点头，散去后却在另一张桌旁把忧虑讲完；你最后听见的，只剩一句大家早就知道。" },
      { conditions: { all: [C("shadow.hardness", "gte", 7), C("meta.currentYear", "lte", 1979)] }, text: "你后来更熟练地把问题拆成执行细节，很少再让责任碰到决策本身。同事当面点头，会后却另找人把重要风险讲完，再用口信或一张便条绕过你；消息仍会抵达，只是不再先抵达你。" },
      { conditions: { all: [C("shadow.hardness", "gte", 7), C("meta.currentYear", "gte", 1980), C("meta.currentYear", "lte", 2004)] }, text: "你后来更熟练地把问题拆成执行细节，很少再让责任碰到决策本身。同事开会时当面点头，重要风险却在打给别人的电话里讲完；你后来接到的，只是已经商量好的结论。" },
      { conditions: { all: [C("shadow.hardness", "gte", 7), C("meta.currentYear", "gte", 2005)] }, text: "你后来更熟练地把问题拆成执行细节，很少再让责任碰到决策本身。同事开会时当面点头，重要风险却先在没有你的群聊里讲完。" },
      { conditions: { all: [C("meta.currentYear", "lte", 1949)] }, text: "同行只照明面规矩同你来往，不再替你赶一程、垫一句话或作保。你觉得人情变薄了，没想到他们只是学会不再替别人的失实担一份风险。" },
      { text: "同事逐渐只按书面流程同你合作，不再替你赶最后一班或口头担保。你觉得大家越来越会算计，没想到他们只是学会不再替别人的失误交押金。" },
    ],
    effects: [add("shadow.hardness", 2), add("shadow.selfDeception", 2), add("shadow.trustDebt", 4), add("relationships.friendship", -6), add("resources.reputation", -2), { addTag: "shadow_work_no_one_covers" }],
  }),
  shadowEvent({
    id: "work_blame_end",
    title: "旧账没有替谁道歉",
    category: "career",
    ageRange: [30, 96],
    requiresEvents: ["shadow_private_work_blame_distance"],
    close: true,
    conditions: { all: [C("shadow.trustDebt", "gte", 9)] },
    text: [
      { conditions: { all: [C("meta.currentYear", "lte", 1949)] }, text: "多年后同行仍记得那次差错，却只说新人后来去了别处。你继续做活，也把这当成事情已经过去；一个人的去处成了句号，谁把他推到那里则没有写进账。" },
      { conditions: { all: [C("shadow.guilt", "gte", 8)] }, text: "你后来为那位旧同事写了一份更准确的证明，也承认自己曾把责任压给他。证明帮到了一点，对方没有因此恢复来往；他需要的是迟到的事实，不是替你的醒悟鼓掌。" },
      { conditions: { all: [C("career.status", "eq", "retired")] }, text: "退休后谈起旧单位，你常说年轻人谁没替人背过锅。那句话把伤害讲成了入行规矩，也让你不必分清，当年自己究竟站在锅的哪一边。" },
      { conditions: { all: [C("shadow.selfDeception", "gte", 16), C("shadow.hardness", "gte", 10)] }, text: "你仍相信当时只能那样处理，并以自己后来也吃过亏作证。受过伤与伤过别人被你放在同一只篮里晃了晃，仿佛重量相近便能互相抵消。" },
      { conditions: { all: [C("meta.currentYear", "gte", 2000)] }, text: "旧同事换了单位，系统里的那次评语仍由他自己解释。你没有再参与他的生活，自己的履历也照常更新；数据擅长保存结果，不会主动追问是谁先选择了版本。" },
      { text: "你继续工作、转行或退休，那次责任分配没有成为大案。被压过的人也过起别的生活，只在有人向他打听你时停一下再回答；普通日子照常向前，判断人的旧经验也一起留下。" },
    ],
    effects: [add("shadow.guilt", 1), add("shadow.selfDeception", 2), add("shadow.trustDebt", 3), add("relationships.friendship", -4), add("resources.reputation", -2), { addTag: "shadow_work_blame_remembered" }],
  }),

  // 15. One relative's availability is treated as a permanent source of unpaid care.
  shadowEvent({
    id: "care_capture_seed",
    title: "顺手再帮一天",
    category: "family",
    ageRange: [24, 72],
    opening: true,
    conditions: { all: [C("relationships.family", "gte", 30)] },
    text: [
      { conditions: { all: [C("relationships.children", "gte", 1)] }, text: "你请一位亲属再替你接送、看护或照料孩子一天，说他反正更有空。帮忙原本有边界，你却把对方没有拒绝，当成下一次也默认答应。" },
      { conditions: { all: [C("resources.health", "lte", 45)] }, text: "身体不方便时，一位亲属主动接过几件事。困难是真的，你仍把感谢慢慢省成了吩咐；需要帮助不等于帮助者的时间从此没有主人。" },
      { conditions: { all: [C("meta.currentYear", "lte", 1978)] }, text: "家里总把跑腿、守夜和收拾留给最少开口的那个人，你也顺势多托了一件。大家夸他能干，夸奖既不算工钱，也没有替他少做一趟。" },
      { text: "一位亲属偶尔帮你处理家事，你很快开始按他一定有空来安排。每次单看都只是搭把手，连起来便成了另一份没有下班时间的生活。" },
    ],
    effects: [add("shadow.harmDone", 2), add("shadow.selfDeception", 3), add("shadow.complicity", 3), add("shadow.trustDebt", 3), add("relationships.family", -3), add("resources.freedom", 3), { addTag: "shadow_care_help_captured" }],
  }),
  shadowEvent({
    id: "care_capture_default",
    title: "全家的时间，只有一个人不用预约",
    category: "family",
    ageRange: [26, 79],
    requiresEvents: ["shadow_private_care_capture_seed"],
    conditions: { all: [C("shadow.complicity", "gte", 3)] },
    text: [
      { conditions: { all: [C("location.migratedTimes", "gte", 1), C("meta.currentYear", "gte", 1990)] }, text: "你在外地用电话把家中几件照护继续交给同一个亲属，偶尔寄钱回去，便觉得自己也承担了一半。路远解释不能到场，却没有解释为何安排和催问仍由最累的人承受。" },
      { conditions: { all: [C("location.migratedTimes", "gte", 1), C("meta.currentYear", "lte", 1989)] }, text: "你在外地靠书信、捎话或逢年回家，把几件照护继续留给同一个亲属。信里常问家中可好，却很少问那个人还有没有自己的事；路远让安排变慢，没有让分工变得公平。" },
      { conditions: { all: [C("resources.wealth", "gte", 62)] }, text: "你逢节送礼，也会塞一笔钱给长期帮忙的亲属，却从不先问他下周能否空出来。礼物表达感谢，安排仍默认占用；慷慨没有自动变成尊重。" },
      { conditions: { all: [C("meta.currentYear", "gte", 2000)] }, text: "家庭日程里，接送、陪诊和临时救急总先填上同一个名字。你转发地址和时间很熟练，唯独很少发一句如果不方便可以拒绝。" },
      { text: "那位亲属成了全家默认的人手：谁临时有事，谁便先找他。你也说过辛苦了，第二天仍把新的事情直接报给他；感谢若没有拒绝的余地，也会变成另一种催单。" },
    ],
    effects: [add("shadow.harmDone", 4), add("shadow.selfDeception", 3), add("shadow.hardness", 2), add("shadow.trustDebt", 5), add("relationships.family", -7), add("resources.freedom", 2), { addTag: "shadow_care_became_default" }],
  }),
  shadowEvent({
    id: "care_capture_boundary",
    title: "最能帮的人开始不再应声",
    category: "relationship",
    ageRange: [28, 86],
    requiresEvents: ["shadow_private_care_capture_default"],
    conditions: { all: [C("shadow.trustDebt", "gte", 6)] },
    text: [
      { conditions: { all: [C("career.status", "in", ["none", "unemployed", "laid_off", "retired"])] }, text: "你如今有了更多可支配时间，仍习惯先找那位亲属。对方第一次说你可以自己办，你立刻列出过去的难处；旧分工失去借口以后，习惯仍替自己找到了理由。" },
      { conditions: { all: [C("resources.wealth", "gte", 60)] }, text: "对方明确说不能再随叫随到，你终于花钱请人接下一部分。问题得到实际缓解，亲属却没有因此撤回边界；能买到服务，不等于能买回被长期占用的情分。" },
      { conditions: { all: [C("shadow.resentment", "gte", 5)] }, text: "那位亲属几次没有应下差事后，你向家人抱怨他变了。没人提醒你，变化也许只是一个人终于把自己的时间从公共物品改回私人所有。" },
      { text: "最常帮忙的人回应得越来越迟，也不再为每次拒绝写长篇理由。你觉得亲情突然变薄，对方只是把许多年没有说出口的边界，改成了可以执行的做法。" },
    ],
    effects: [add("shadow.resentment", 3), add("shadow.selfDeception", 2), add("shadow.trustDebt", 5), add("relationships.family", -8), add("resources.freedom", -2), { addTag: "shadow_caregiver_set_boundary" }],
  }),
  shadowEvent({
    id: "care_capture_end",
    title: "亲情后来换了安排",
    category: "family",
    ageRange: [32, 96],
    requiresEvents: ["shadow_private_care_capture_boundary"],
    close: true,
    conditions: { all: [C("shadow.trustDebt", "gte", 9)] },
    text: [
      { conditions: { all: [C("shadow.selfDeception", "gte", 9), C("shadow.hardness", "gte", 8), C("meta.currentYear", "lte", 1949)] }, text: "对方设过几次边界，你仍总能在真正着急时绕过去：先把事情送到门口，再解释只有他最可靠。后来他搬远，也不再回信或接你的口信，家里的活才第一次空在那里，谁也不能继续称作顺手。" },
      { conditions: { all: [C("shadow.selfDeception", "gte", 9), C("shadow.hardness", "gte", 8), C("meta.currentYear", "gte", 1950)] }, text: "对方设过几次边界，你仍总能在真正着急时绕过去：先把事情送到门口，再解释只有他最可靠。后来他搬远或干脆不接电话，家里的活才第一次空在那里，谁也不能继续称作顺手。" },
      { conditions: { all: [C("shadow.guilt", "gte", 6)] }, text: "你后来再请帮忙时先问时间，也接受对方说不。几次准时接替比道歉更有用，却仍不足以要求亲密恢复；边界被尊重，是停止继续侵占，不是过去从未发生。" },
      { conditions: { all: [C("relationships.family", "lte", 25)] }, text: "那位亲属只在必要时出现，提前说明能做哪几件事。你说一家人何必这么客气，对方没有争辩；客气是关系剩下的护栏，不是关系恢复了原样。" },
      { conditions: { all: [C("meta.age", "gte", 70)] }, text: "晚年需要帮助时，家人按说好的范围轮流来，没有谁再被默认全天候待命。你偶尔怀念从前方便的日子，方便的另一面，则是某个人许多年没有自己的日程。" },
      { text: "家事后来换了安排：有的花钱解决，有的由你自己承担，有的干脆不再做。那位亲属仍会来往，却不再一进门便自动接手；关系继续存在，免费劳力的位置空了下来。" },
    ],
    effects: [add("shadow.guilt", 1), add("shadow.selfDeception", 1), add("shadow.trustDebt", 3), add("relationships.family", -4), add("resources.freedom", -1), { addTag: "shadow_care_help_has_terms" }],
  }),
];
