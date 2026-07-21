// Dramatic life arcs for ordinary people.
//
// The turn in these stories comes from an action that cannot simply be taken
// back: a room is sold, a name is entered, a witness signs, a person is left
// behind.  Later stages preserve that act and let the cost change shape.  The
// player never chooses a branch; conditional prose reads the life already in
// state.  Opening probabilities stay low so that drama interrupts a life
// rather than turning every year into a serial cliff-hanger.

const PREFIX = "dramatic_";

const C = (path, operator, value) => ({ path, [operator]: value });
const add = (path, value) => ({ path, add: value });
const set = (path, value) => ({ path, set: value });
const tagged = (tag) => ({ hasTag: tag });
const missing = (tag) => ({ missingTag: tag });
const V = (conditions, text) => ({ conditions, text });
const F = (text) => ({ text });
const O = (id, conditions, resultText, effects, baseWeight = 1) => ({
  id,
  ...(conditions ? { conditions } : {}),
  baseWeight,
  resultText,
  effects,
});
const between = (eventId, minYears, maxYears) => ({
  eventOccurredBetween: { eventId: `${PREFIX}${eventId}`, minYears, maxYears },
});

const rural = { all: [C("location.currentCityTier", "in", ["village", "town"])] };
const urban = { all: [C("location.currentCityTier", "in", ["county", "city", "tier2", "tier1"])] };
const poor = { all: [C("resources.wealth", "lte", 38)] };
const secure = { all: [C("resources.wealth", "gte", 68)] };
const older = { all: [C("meta.age", "gte", 58)] };
// Thread initialization yields guilt 0/3 and justification 1/3.  These
// thresholds therefore split plausible local states after an opening instead
// of waiting for values that the chain itself can never produce.
const guilty = { all: [C("shadow.guilt", "gte", 3)] };
const hardened = { all: [C("shadow.hardness", "gte", 8), C("shadow.selfDeception", "gte", 3)] };
const migrated = { all: [C("location.migratedTimes", "gte", 1)] };
const woman = { all: [C("birth.gender", "eq", "female")] };
const activeCareer = C("career.status", "in", ["employed", "self_employed", "gig_worker", "family_labor"]);

const ALL_PLACES = { cityTiers: ["village", "town", "county", "city", "tier2", "tier1"] };
const RURAL_PLACES = { cityTiers: ["village", "town"] };

function joinConditions(required, extra = {}) {
  return {
    all: [...required, ...(extra.all ?? [])],
    ...(extra.any ? { any: extra.any } : {}),
    ...(extra.none ? { none: extra.none } : {}),
  };
}

function scopeThreadConditions(value, domain) {
  if (Array.isArray(value)) return value.map((item) => scopeThreadConditions(item, domain));
  if (!value || typeof value !== "object") return value;
  const scoped = Object.fromEntries(Object.entries(value)
    .map(([key, item]) => [key, scopeThreadConditions(item, domain)]));
  if (scoped.path === "shadow.guilt") scoped.path = `shadow.threads.${domain}.guilt`;
  if (scoped.path === "shadow.selfDeception") scoped.path = `shadow.threads.${domain}.justification`;
  return scoped;
}

function threadEffects(effects, domain, close) {
  // A closing scene can reveal existing guilt, but it must not manufacture
  // remorse merely because the authored chain has reached its last stage.
  const adjusted = close
    ? effects.filter((effect) => !(effect.path === "shadow.guilt" && effect.add > 0))
    : effects;
  return adjusted.flatMap((effect) => {
    const mirrored = [];
    if (effect.path === "shadow.guilt" && effect.add) {
      mirrored.push(add(`shadow.threads.${domain}.guilt`, effect.add));
    }
    if (effect.path === "shadow.selfDeception" && effect.add) {
      mirrored.push(add(`shadow.threads.${domain}.justification`, effect.add));
    }
    if (effect.add > 0 && ["resources.wealth", "resources.achievement", "resources.reputation"].includes(effect.path)) {
      mirrored.push(add(`shadow.threads.${domain}.benefitRetained`, Math.min(4, effect.add)));
    }
    return [effect, ...mirrored];
  });
}

function scopedOutcomes(outcomes, domain, close) {
  return outcomes?.map((outcome) => ({
    ...outcome,
    conditions: scopeThreadConditions(outcome.conditions, domain),
    effects: threadEffects(outcome.effects ?? [], domain, close),
  }));
}

function makeArc(key, {
  yearRange,
  ageRange,
  category,
  conditions,
  currentRegions = ALL_PLACES,
  lifetimeProbability = 0.08,
  steps,
}) {
  let minimumYears = 0;
  let maximumYears = 0;
  const domain = `${PREFIX}${key}`;

  return steps.map((step, index) => {
    if (index > 0) {
      minimumYears += step.minYears;
      maximumYears += step.maxYears;
    }
    const previous = steps[index - 1];
    const next = steps[index + 1];
    const stepId = `${key}_${step.id}`;
    const previousId = previous ? `${key}_${previous.id}` : null;
    const required = index === 0
      ? [missing(`${PREFIX}${key}`)]
      : [between(previousId, step.minYears, step.maxYears), tagged(`${PREFIX}${previousId}`)];

    return {
      id: `${PREFIX}${stepId}`,
      title: step.title,
      category: step.category ?? category,
      yearRange: step.yearRange ?? [
        Math.min(2120, yearRange[0] + minimumYears),
        Math.min(2120, yearRange[1] + maximumYears),
      ],
      ageRange: step.ageRange ?? [
        Math.min(105, ageRange[0] + minimumYears),
        Math.min(105, ageRange[1] + maximumYears),
      ],
      ...(index === 0 ? { currentRegions } : {}),
      conditions: scopeThreadConditions(joinConditions(required, step.conditions ?? (index === 0 ? conditions : {})), domain),
      ...(index > 0 ? { requiresEvents: [`${PREFIX}${previousId}`] } : {}),
      maxOccurrences: 1,
      baseWeight: index === 0 ? 34 : index === 1 ? 112 : 138,
      ...(index === 0 ? { lifetimeProbability } : {}),
      narrativeTier: index === 0 ? "turning_point" : "consequence",
      narrativeDomain: domain,
      narrativeThread: next ? { expiresAfterYears: next.maxYears } : { close: true },
      text: scopeThreadConditions(step.text, domain),
      ...(step.outcomes ? { outcomes: scopedOutcomes(step.outcomes, domain, !next) } : {}),
      effects: [
        ...(index === 0 ? [{ initializeShadowThread: domain }] : []),
        ...threadEffects(step.effects ?? [], domain, !next),
        ...(next ? [{
          scheduleEvent: {
            eventId: `${PREFIX}${key}_${next.id}`,
            delayYears: [next.minYears, next.maxYears],
            weightMultiplier: index === 0 ? 28 : 22,
          },
        }] : []),
        { addTag: `${PREFIX}${key}` },
        { addTag: `${PREFIX}${stepId}` },
      ],
    };
  });
}

const returnedKin = makeArc("returned_kin", {
  yearRange: [1840, 1956],
  ageRange: [18, 67],
  category: "family",
  lifetimeProbability: 0.085,
  conditions: { all: [C("relationships.family", "gte", 34)] },
  steps: [
    {
      id: "room_divided",
      title: "失踪者的屋子先分了",
      minYears: 0,
      maxYears: 0,
      text: [
        V({ all: [C("meta.currentYear", "lte", 1911), C("location.currentCityTier", "in", ["village", "town"])] }, "离家多年的人没有音信，族里来问那间屋和两亩薄田该归谁。你按下再等一季的话，在契尾画押；那方砚台端端正正，仿佛只在处理一件没有主人的东西。"),
        V({ all: [C("meta.currentYear", "lte", 1949), C("location.currentCityTier", "in", ["county", "city", "tier2", "tier1"])] }, "战乱把一个亲人的消息截断，家里仍要交租还账。你把他留下的铺位转给别人，旧门牌摘下来时落了一层灰，没有谁知道这算收拾残局还是抢先结束等待。"),
        V(poor, "药钱和欠账逼到桌边，你主张卖掉失踪亲属留下的一间房或几件值钱物。家里用这笔钱渡过去；收据折好以后，那个人第一次被当成不会回来的人使用。"),
        V(migrated, "你已在异地安家，隔着书信同意把失踪亲人的份额并入家用。路远让签字晚到了几个月，却没有让你少分一分；搬家箱里后来多了一只原本属于他的铜锁。"),
        F("亲人多年无信，家里终于分掉他留下的屋、铺或份额。你负责把名字从账上划去，笔尖在纸上顿了一下，随后照常把晚饭端上桌。"),
      ],
      effects: [
        add("resources.wealth", 6), add("relationships.family", -7), add("resources.happiness", -3),
        add("shadow.complicity", 3), add("shadow.harmDone", 3), add("shadow.selfDeception", 3), add("shadow.trustDebt", 3),
      ],
    },
    {
      id: "door_knocked",
      title: "门外的人知道旧门闩的位置",
      minYears: 3,
      maxYears: 11,
      text: [
        V({ all: [C("meta.currentYear", "lte", 1911), C("location.currentCityTier", "in", ["village", "town"])] }, "那人瘦得变了形，却能说出井绳在哪一段打结。他站在已经换主的院门外，先问祖母还在不在；围来看的人很多，真正该回答的人都低头看鞋。"),
        V({ all: [C("meta.currentYear", "lte", 1949), C("location.currentCityTier", "in", ["county", "city", "tier2", "tier1"])] }, "失踪的亲人带着外地口音回来，手里只有一张边角磨烂的旧凭据。新铺主正忙着算账，请他不要挡门；你认出了他，却先问证件全不全。"),
        V(secure, "家境已经宽松，你本可以腾还一部分，却先请人核对来者是否真是本人。多年苦难没有使他更擅长证明自己，你的谨慎倒有全套印章。"),
        V(older, "门外那声旧称呼已经几十年没人叫过，你一下便听懂了。你们都老了，争的却仍是年轻时留下的房间；时间把人磨薄，没有替财产长出新的面积。"),
        F("失踪的亲人忽然回来，准确说出只有家里人才知道的小事。你让他先进屋喝水，盛饭时仍少拿了一副碗筷——手比嘴更早暴露了这个家已经怎样计算人数。"),
      ],
      effects: [
        add("relationships.family", -14), add("resources.reputation", -3), add("resources.happiness", -8),
        add("shadow.guilt", 3), add("shadow.trustDebt", 5), add("shadow.selfDeception", 2),
      ],
    },
    {
      id: "place_after_return",
      title: "回来的人没有回到原处",
      minYears: 3,
      maxYears: 12,
      text: "归来以后，屋、钱和家中座次都要重新安放。拖了多年的争执终于留下一个并不整齐的结果。",
      outcomes: [
        O("partial_return", guilty, "你凑钱归还了一小部分，也把当年的契纸交给他。房和田早已转手，你凑得出的只剩数目；他收下纸，没有说原谅，只问能不能把那只旧铜锁带走。", [
          add("resources.wealth", -6), add("relationships.family", -2), add("resources.happiness", -2), add("shadow.trustDebt", -2),
          add("shadow.threads.dramatic_returned_kin.responsibilityAccepted", 4), add("shadow.threads.dramatic_returned_kin.victimContact", 3), add("shadow.threads.dramatic_returned_kin.benefitRetained", -3),
        ], 1.15),
        O("kept_everything", hardened, "你坚持当年按规矩处置，来者最后去了别处。逢人问起，你总先讲家里那几年如何艰难；故事说得很熟，熟到那个真正流落多年的人只剩开头一句。", [
          add("resources.wealth", 2), add("relationships.family", -9), add("shadow.selfDeception", 3), add("shadow.trustDebt", 4),
        ]),
        O("other_roof", secure, "你给归来者另置了一处住处，却不肯重分已经到手的产业。旁人称这安排厚道，他也住了进去；一个人重新有了屋檐，仍没有回到自己被划掉以前的位置。", [
          add("resources.wealth", -5), add("resources.reputation", 2), add("relationships.family", -3), add("shadow.selfDeception", 1), add("shadow.trustDebt", 1),
          add("shadow.threads.dramatic_returned_kin.victimContact", 2),
        ]),
        O("outlived_return", older, "归来的人后来先你而去，遗物少得一只包袱便能装完。家里又讨论这些东西归谁，这次大家说得很轻，仿佛已经从上一次学会了礼貌，没有学会归还。", [
          add("relationships.family", -6), add("resources.happiness", -7), add("shadow.trustDebt", 2),
        ]),
        O("unmoved_gap", null, "亲属关系缩成节日里一次点头。家族照仍把你们排在同一行，站位之间留着一小段没人肯挪的空隙。", [
          add("relationships.family", -5), add("resources.happiness", -3), add("shadow.selfDeception", 1), add("shadow.trustDebt", 3),
        ], 0.35),
      ],
    },
  ],
});

const syntheticLineage = makeArc("synthetic_lineage", {
  yearRange: [2050, 2105],
  ageRange: [30, 76],
  category: "family",
  lifetimeProbability: 0.075,
  conditions: {
    all: [C("relationships.family", "gte", 32)],
    any: [C("relationships.children", "gte", 1), C("resources.wealth", "gte", 48), C("meta.age", "gte", 55)],
  },
  steps: [
    {
      id: "record_reconstructed",
      title: "家谱被补得过于完整",
      minYears: 0,
      maxYears: 0,
      text: [
        V({ all: [C("meta.currentYear", "gte", 2080), C("relationships.children", "gte", 1)] }, "跨代照护额度开始同亲缘记录绑定，你用家中旧影像生成一段已经去世长辈的确认陈述，把一个说不清的出生关系补成确定。孩子问声音像不像，你说像就够了。"),
        V(secure, "家族资产托管要求补齐几十年前的亲缘链，你付费重建了旧信、口述和影像。系统提示置信度只有七成，你删掉提示再提交；一笔遗产从此有了看似毫不犹豫的祖先。"),
        V(poor, "长期治疗名额要核验家庭照护关系，真实材料偏偏缺了一段。你让服务商合成一份旧访谈，替病人争到位置；候补名单上另一个家庭只看见自己的序号退后一格。"),
        V(migrated, "迁居几代以后，原乡档案与新城记录互不衔接。你用旧照片和口音样本生成证明，把一位无血缘却共同生活的人写成近亲；照护关系是真的，证据不是。"),
        F("一项继承、治疗或居住资格卡在旧亲缘记录上。你用合成工具补出一段足以通过核验的家族证言，上传前把‘推测生成’四个字从页脚裁掉了。"),
      ],
      effects: [
        add("resources.wealth", 5), add("relationships.family", 3), add("resources.freedom", 3),
        add("shadow.complicity", 5), add("shadow.harmDone", 3), add("shadow.selfDeception", 4), add("shadow.trustDebt", 4),
      ],
    },
    {
      id: "other_claimant",
      title: "另一个人的记录被判成冲突项",
      minYears: 2,
      maxYears: 6,
      text: [
        V({ all: [C("meta.currentYear", "gte", 2085), C("relationships.children", "gte", 1)] }, "孩子办理自己的家庭事务时，系统把另一名申请者标成与你家谱冲突。你教孩子只回答屏幕问到的部分；沉默被拆成几个必填框以后，竟显得很守规矩。"),
        V(guilty, "真正保存旧事的人拿出一只纸信封，里面的日期同你生成的证言对不上。你提出共享一部分资源，却不肯撤回记录；补偿可以商量，承认造假会使整个家重新排队。"),
        V(hardened, "审核人员说新证据的连续性更好，你便把这句话重复给家里听。被排除的人仍在申诉，‘连续性’则成了一道很体面的门闩。"),
        V(poor, "另一户因记录冲突失去治疗或安置顺位，你听说后整夜没睡，第二天仍按时带家人去登记。轮到确认时，你把手指停在撤回键上，直到窗口自行关闭。"),
        F("旧档案清理时，你提交的证言成了基准，另一份真实但残缺的记录反被标记为可疑。对方要求见你，你让平台代为回复：材料已由系统核验。"),
      ],
      effects: [
        add("resources.reputation", 3), add("resources.happiness", -7), add("relationships.family", -4),
        add("shadow.harmDone", 5), add("shadow.complicity", 5), add("shadow.guilt", 2), add("shadow.trustDebt", 6),
      ],
    },
    {
      id: "watermark_hearing",
      title: "水印在许多年后发亮",
      minYears: 5,
      maxYears: 9,
      text: "鉴定技术升级以后，那段过于完整的旧证言重新进入听证。家里必须决定怎样面对这条水印。",
      outcomes: [
        O("record_corrected", guilty, "你承认当年补过证据，也同意重开分配。已经用掉的治疗年限和居住机会无法退回，听证桌上最后只纠正了名字。", [
          add("resources.wealth", -3), add("resources.reputation", -6), add("relationships.family", -4), add("shadow.selfDeception", -3), add("shadow.trustDebt", -1),
          add("shadow.threads.dramatic_synthetic_lineage.responsibilityAccepted", 5), add("shadow.threads.dramatic_synthetic_lineage.victimContact", 3), add("shadow.threads.dramatic_synthetic_lineage.benefitRetained", -4),
        ], 1.15),
        O("doubt_defended", hardened, "鉴定报告只说高度疑似，你抓住这四个字拒绝撤回。家里继续保有资格，另一方在缴不起下一笔鉴定费后停止申诉，卷宗便停在这一页。", [
          add("resources.wealth", 2), add("relationships.family", -3), add("shadow.selfDeception", 4), add("shadow.trustDebt", 5),
        ]),
        O("heirs_take_archive", older, "听证时你年纪已大，晚辈替你回答大部分问题。他们第一次知道家谱中那段最清晰的声音是后来做的，回家仍照常给你分药，从此把旧档案锁进自己的柜子。", [
          add("resources.freedom", -3), add("relationships.family", -8), add("resources.reputation", -2), add("resources.happiness", -5), add("shadow.trustDebt", 3),
        ]),
        O("sealed_settlement", secure, "你用一部分家产同另一方和解，协议要求双方不再公开细节。钱修补了眼前的损失，也给秘密换了更结实的封面；家族档案里仍保留那个错误关系。", [
          add("resources.wealth", -8), add("resources.reputation", 1), add("shadow.selfDeception", 2), add("shadow.trustDebt", 1),
          add("shadow.threads.dramatic_synthetic_lineage.victimContact", 2), add("shadow.threads.dramatic_synthetic_lineage.benefitRetained", -2),
        ]),
        O("disputed_marker", null, "记录最后加上一行争议标记，没有删除，也没有再被当作纯粹事实。家里每次调用它，都要重新看见那行小字。", [
          add("resources.reputation", -3), add("relationships.family", -4), add("resources.happiness", -3), add("shadow.selfDeception", 1), add("shadow.trustDebt", 2),
        ], 0.35),
      ],
    },
  ],
});

const silentAccident = makeArc("silent_accident", {
  yearRange: [1895, 2035],
  ageRange: [18, 62],
  category: "career",
  lifetimeProbability: 0.08,
  conditions: {
    all: [activeCareer, C("career.field", "in", [
      "farm_work", "manual_worker", "apprentice", "mine_worker", "mine", "factory", "arsenal_worker",
      "wartime_factory", "construction", "transport", "logistics", "repair", "small_business", "trade",
      "township_enterprise", "delivery", "ride_hailing",
    ])],
  },
  steps: [
    {
      id: "night_crossing",
      title: "那一趟货没有停下来",
      minYears: 0,
      maxYears: 0,
      text: [
        V({ all: [C("meta.currentYear", "lte", 1949), C("career.field", "in", ["transport", "trade", "manual_worker"])] }, "夜里赶货时，车或船撞倒一个人，同伴催你别停，说后面还有关卡。你们把沾泥的灯罩擦过，继续赶路；到站清点货物时，一包也没少。"),
        V({ all: [C("meta.currentYear", "lte", 1978), C("career.field", "in", ["factory", "mine", "mine_worker", "construction"])] }, "赶工中一处护栏松脱，有人摔下去。班组怕整组停工，商量把时间写成下班以后；你负责把那只扳手放回原架，第二天工具栏看起来一件不少。"),
        V({ all: [C("meta.currentYear", "gte", 2012), C("career.field", "in", ["delivery", "ride_hailing", "logistics", "transport"])] }, "你们抢时间时擦撞了一辆小车，同伴说平台记录会把几个人都拖进去。你关掉共享行程，绕路送完剩下的货；订单全完成，只有后视镜一直偏着。"),
        V({ all: [C("meta.currentYear", "gte", 1990), C("meta.currentYear", "lte", 2011), C("career.field", "in", ["logistics", "transport"])] }, "赶车送货时出了擦撞，同伴把出车单上的时辰往后改了一格。你照常在回场表上签字，复写纸透过两层，偏偏没有留下撞击发生的那一分钟。"),
        V(poor, "一次事故留下伤者和一笔全家付不起的钱。同伴提议谁也别承认当时在场，你点头；回家后照常数当天工钱，少数了一遍又从头再数。"),
        F("共同做事时出了严重事故，你和在场的人约定把关键一段从记录里拿掉。你们没有举杯结盟，只把各自沾灰的衣服分开洗了。"),
      ],
      effects: [
        add("resources.wealth", 3), add("resources.happiness", -9), add("relationships.friendship", -3),
        add("shadow.complicity", 6), add("shadow.harmDone", 6), add("shadow.guilt", 3), add("shadow.trustDebt", 5),
      ],
    },
    {
      id: "one_story_two_memories",
      title: "同一个说法开始有两个版本",
      minYears: 2,
      maxYears: 7,
      text: [
        V({ all: [C("meta.currentYear", "lte", 1949)] }, "伤者家属沿路来问，你照约定说那晚风大、灯暗，什么也没看清。旧同伴却在酒后多说了一处地名；从此你们见面先核对记忆，再谈近况。"),
        V({ all: [C("meta.currentYear", "gte", 1980), C("career.status", "in", ["none", "unemployed", "laid_off", "retired"])] }, "你已经离开原来的活计，同行却拿着旧行程来找你，要你继续认同当年的说法。工牌早没了，那一晚仍像一份从未办过离职的工作。"),
        V(guilty, "你匿名寄去一笔钱，没有写事故缘由。家属收下后登了一则寻找知情人的消息；补偿刚到门口，真相便在纸上又敲了一次门。"),
        V(hardened, "旧同伴生活拮据，暗示自己若得不到帮忙便会改口。你给了钱，也把这称作照顾旧友；共同秘密终于开始发工资，账目仍不写用途。"),
        F("多年后，有人在旧记录里发现时间对不上。在场的人各自把同一个版本修得更像真的，细节越齐，彼此越不敢单独坐在一张桌边。"),
      ],
      effects: [
        add("resources.wealth", -4), add("resources.happiness", -7), add("relationships.friendship", -8),
        add("shadow.complicity", 4), add("shadow.guilt", 3), add("shadow.selfDeception", 2), add("shadow.trustDebt", 4),
      ],
    },
    {
      id: "road_kept_name",
      title: "路记住了，档案没有",
      minYears: 4,
      maxYears: 12,
      text: "旧记录又被人问起时，那段路早已改过模样。你和共同守密的人最终留下了不同的尾声。",
      outcomes: [
        O("late_testimony", guilty, "你终于补交一份证词，承认自己当年在场。旧案期限、证据和人都已变了，家属只拿到一纸修正；它来得很晚，仍使错误记录停止继续说谎。", [
          add("resources.reputation", -5), add("resources.wealth", -2), add("resources.happiness", -4), add("shadow.selfDeception", -2), add("shadow.trustDebt", -2),
          add("shadow.threads.dramatic_silent_accident.responsibilityAccepted", 5), add("shadow.threads.dramatic_silent_accident.victimContact", 3),
        ], 1.15),
        O("kept_the_version", hardened, "最后一名愿意翻旧账的人也放弃了。你保住收入、家庭和体面，偶尔经过那段路仍会减速；后车喇叭一响，你才松开刹车。", [
          add("resources.wealth", 2), add("shadow.selfDeception", 3), add("shadow.trustDebt", 4),
        ]),
        O("last_keeper", older, "旧同伴去世后，约定只剩你一人保管。葬礼上有人夸你们交情久，你替他扶正遗像，照片里那张嘴终于不会再说出第二个版本。", [
          add("resources.happiness", -8), add("relationships.friendship", -5), add("shadow.selfDeception", 1), add("shadow.trustDebt", 2),
        ]),
        O("anonymous_money", secure, "你拿出钱给伤者家庭做了不署名的补偿，却要求中间人不提来路。对方的生活得到一点帮助，事故仍归在无人负责的一栏。", [
          add("resources.wealth", -7), add("resources.happiness", -2), add("shadow.selfDeception", 2), add("shadow.trustDebt", 1),
          add("shadow.threads.dramatic_silent_accident.victimContact", 1), add("shadow.threads.dramatic_silent_accident.benefitRetained", -2),
        ]),
        O("road_covered", null, "旧路后来修宽，现场被新路面盖住。那一段没有进入公开记录，认识旧路的人则逐年减少。", [
          add("resources.happiness", -4), add("shadow.selfDeception", 2), add("shadow.trustDebt", 3),
        ], 0.35),
      ],
    },
  ],
});

const climateRoster = makeArc("climate_roster", {
  yearRange: [2038, 2099],
  ageRange: [22, 72],
  category: "migration",
  currentRegions: RURAL_PLACES,
  lifetimeProbability: 0.09,
  conditions: { all: [C("relationships.family", "gte", 30), C("resources.wealth", "lte", 78)] },
  steps: [
    {
      id: "one_name_removed",
      title: "迁居名册少了一个名字",
      minYears: 0,
      maxYears: 0,
      text: [
        V({ all: [C("meta.currentYear", "lte", 2055), C("relationships.children", "gte", 1)] }, "连续灾害后，家庭按人数分配迁居房。表格只容纳直系成员，你把常年同住的表亲删去，先把孩子的名字填满；提交键很轻，旧屋里却从此少了一张床的去处。"),
        V({ all: [C("meta.currentYear", "gte", 2075), C("meta.age", "gte", 55)] }, "高风险村落最后一轮迁居按照护关系计分。你把行动不便的远亲写成另有照料，换取一套离医院近的住房；系统道谢后，他的名字落回原地名册。"),
        V(poor, "安置名额少于家里实际生活的人数，你选了最能挣钱的几个人，也把自己算进去。被留下的人说理解，收拾碗筷时仍多摆了一副，过了一会儿才拿走。"),
        V(woman, "亲戚默认由你整理全家的迁居材料，也默认由你决定谁不算这个家的人。你删去一个长期被照料的老人，男人们签字很快，后来却都说名册是你填的。"),
        F("水、热或反复灾害让原居地进入缩减名单。新住处按核定人口分配，你把一个边缘亲属从共同生活记录里移除，名册因此刚好装下。"),
      ],
      effects: [
        set("location.currentCityTier", "county"), add("location.migratedTimes", 1), add("resources.wealth", -5), add("resources.freedom", 3),
        add("relationships.family", -10), add("shadow.harmDone", 5), add("shadow.complicity", 4), add("shadow.selfDeception", 4), add("shadow.trustDebt", 6),
      ],
    },
    {
      id: "old_address_closed",
      title: "旧地址停止接收求助",
      minYears: 2,
      maxYears: 7,
      text: [
        V({ all: [C("meta.currentYear", "gte", 2070), C("relationships.children", "gte", 1)] }, "旧聚落转为季节性封闭，孩子问被删掉的亲属为什么不搬来。你说对方更习惯原处，没有说那套新房从一开始就没有替他留门禁权限。"),
        V(guilty, "你几次申请把留下的人补进名册，系统每次都要求证明当年为何不在同户。最准确的答案会使原安置资格被重算，你于是上传水电账单，没有上传那张删过的草稿。"),
        V(hardened, "旧地救助点撤走后，亲属去了更远的临时聚落。你说每个人都得为自己打算；新城窗外的遮阳板随日照落下，替这句话挡住了下午最热的一阵光。"),
        V(secure, "你有能力接人过来，却只定期转钱，不肯改家庭登记。汇款解决了几个月的吃住，也保持了新住房的产权清楚；亲情按月到账，门牌始终没有增加名字。"),
        F("一次更严重的灾害后，旧地址停止提供长期服务。被你划掉的人只能再次迁走，你收到一条语音，背景里全是搬运箱子的碰撞声；他最后一句是不用担心。"),
      ],
      effects: [
        add("resources.wealth", -3), add("relationships.family", -12), add("resources.happiness", -8),
        add("shadow.guilt", 3), add("shadow.harmDone", 3), add("shadow.trustDebt", 5),
      ],
    },
    {
      id: "citizen_of_high_ground",
      title: "高地居民证续了很多年",
      minYears: 5,
      maxYears: 14,
      text: "高地居民证续过几轮，旧聚落逐渐只剩档案。被删去的名字最后以不同方式回到你的生活里。",
      outcomes: [
        O("contact_restored", guilty, "你终于把亲属补进家庭联系档案，却只能登记为异地照护对象，不能追回住房份额。新证件上关系写对了，地址仍各自分开。", [
          add("resources.reputation", -1), add("relationships.family", 2), add("resources.wealth", -2), add("shadow.selfDeception", -2), add("shadow.trustDebt", -2),
          add("shadow.threads.dramatic_climate_roster.responsibilityAccepted", 4), add("shadow.threads.dramatic_climate_roster.victimContact", 4),
        ], 1.15),
        O("complete_household", hardened, "你在新城扎下根，旧地的人后来断了联系。每次续居民证，系统都会显示家庭迁居完整，你也不再点开成员明细；历史最省事的写法，通常只统计到达的人。", [
          add("resources.wealth", 3), add("resources.reputation", 3), add("relationships.family", -5), add("shadow.selfDeception", 4), add("shadow.trustDebt", 4),
        ]),
        O("meal_box_returned", older, "被留下的人死在另一处安置点，遗物通过公共物流寄来，只有一只用了多年的饭盒。盒盖写着旧地址，扫描器读不出来，你却一眼认得。", [
          add("resources.happiness", -9), add("relationships.family", -7), add("shadow.trustDebt", 3),
        ]),
        O("anonymous_fund", secure, "多年后你为旧聚落建了一笔小额互助金，名单里没有自己的名字。它确实帮到一些人，也没有说明第一笔钱为什么总在某个纪念日到账。", [
          add("resources.wealth", -6), add("resources.reputation", 2), add("shadow.selfDeception", 2), add("shadow.trustDebt", 1),
          add("shadow.threads.dramatic_climate_roster.victimContact", 1),
        ]),
        O("separate_records", null, "你的迁居记录写着全户转移成功，被删掉的人另有一套不完整的记录；两份档案都通过了审核，从未彼此相认。", [
          add("resources.reputation", 1), add("relationships.family", -4), add("resources.happiness", -3), add("shadow.selfDeception", 2), add("shadow.trustDebt", 3),
        ], 0.35),
      ],
    },
  ],
});

const inheritedDebt = makeArc("inherited_debt", {
  yearRange: [1978, 2035],
  ageRange: [30, 76],
  category: "wealth",
  lifetimeProbability: 0.085,
  conditions: {
    all: [C("relationships.family", "gte", 30)],
    any: [C("relationships.children", "gte", 1), C("relationships.partnerStatus", "in", ["partnered", "married", "widowed"])],
  },
  steps: [
    {
      id: "sealed_envelope",
      title: "遗物里有一只没拆的信封",
      minYears: 0,
      maxYears: 0,
      text: [
        V({ all: [C("meta.currentYear", "lte", 1995), C("location.currentCityTier", "in", ["village", "town"])] }, "长辈去世后，箱底翻出一张替人担保的借据。你先收起来，分家时只谈田、屋和存款；纸薄得能夹进账本，也薄得足以让所有人暂时看不见一笔债。"),
        V({ all: [C("meta.currentYear", "gte", 2000), C("resources.wealth", "gte", 55)] }, "整理遗物时，你发现房屋仍押着一笔未结贷款。你怕家人先要求放弃继承，便只发了资产截图；负号留在另一页，像一个尚未被邀请进群的人。"),
        V(poor, "家里刚有一点可分的东西，你却发现背后还连着欠款。你把催收信压进旧衣下面，先拿走能卖的部分；贫穷没有教人诚实，只教人哪张纸应该最后出现。"),
        V(woman, "亲属让你整理证件，却在分东西时说女人别管太多。你没有交出那张债务凭据，也没有提醒他们别急着签字；被排除的人第一次掌握全家的开关，手放在上面没有松。"),
        F("清点遗物时，你发现一项资产与一笔没人提过的债拴在一起。你把资产告诉全家，把债先留在信封里，等大家签完该签的名字。"),
      ],
      effects: [
        add("resources.wealth", 7), add("relationships.family", -4), add("shadow.complicity", 4),
        add("shadow.harmDone", 3), add("shadow.selfDeception", 4), add("shadow.trustDebt", 5),
      ],
    },
    {
      id: "collector_at_table",
      title: "催债的人坐到了家里桌边",
      minYears: 1,
      maxYears: 5,
      text: [
        V({ all: [C("meta.currentYear", "lte", 1999), C("location.currentCityTier", "in", ["village", "town"])] }, "债主带着见证人上门，借据上的担保名字挨着全家刚按下的手印。亲属这才知道分到的田屋也带着旧账；有人把茶推给客人，没人再给你添水。"),
        V({ all: [C("meta.currentYear", "gte", 2000), C("relationships.children", "gte", 1)] }, "账户冻结通知到来时，孩子正在问那套房以后归谁。家人翻出你曾发过的资产截图，日期清楚，缺掉的那一页也因此显得格外清楚。"),
        V(guilty, "你承认自己早看过借据，提出多承担一部分。亲属先问的不是出多少钱，而是为何让他们在不知道的情况下签字；钱终于能算，信任却没有统一币种。"),
        V(hardened, "你坚持大家既然分了财产就该一起还债，还拿出每个人当时签过的字。手续保护了你的说法，饭桌上的座位却从此按另外一种规则空着。"),
        F("债务正式追来，继承手续把所有人的名字串在一起。你拿出那只早已拆过的信封，说自己也刚弄明白；封口上的旧折痕替你讲了另一个时间顺序。"),
      ],
      effects: [
        add("resources.wealth", -12), add("relationships.family", -15), add("resources.reputation", -5), add("resources.happiness", -8),
        add("shadow.guilt", 3), add("shadow.trustDebt", 7), add("shadow.selfDeception", 2),
      ],
    },
    {
      id: "family_without_common_property",
      title: "后来再没有共同的东西",
      minYears: 4,
      maxYears: 11,
      text: "债务拖过几年以后，家里终于停止用同一本账生活。各人承担了并不相同的数目，也留下不同的关系。",
      outcomes: [
        O("own_share_sold", guilty, "你卖掉自己那份补上一部分债，也把剩余数目逐项写清。亲属收下转账，却坚持以后各自保管证件；债开始减少，家庭没有因此重新合账。", [
          add("resources.wealth", -8), add("relationships.family", -3), add("resources.freedom", 1), add("shadow.selfDeception", -2), add("shadow.trustDebt", -2),
          add("shadow.threads.dramatic_inherited_debt.responsibilityAccepted", 5), add("shadow.threads.dramatic_inherited_debt.victimContact", 3), add("shadow.threads.dramatic_inherited_debt.benefitRetained", -4),
        ], 1.15),
        O("equalized_on_paper", hardened, "债被分摊，往来也一起分掉。你逢人仍说自己承担最多，亲属不再反驳；下一次婚丧和搬家，他们没有再请你经手任何纸张。", [
          add("resources.wealth", -2), add("relationships.family", -11), add("resources.freedom", 3), add("shadow.selfDeception", 4), add("shadow.trustDebt", 5),
        ]),
        O("debt_bought_quiet", secure, "你最后用较多的钱结清债务，席间有人说事情总算过去。真正继承到财产较少的人没有接这句话，只把自己的收据一张张装进透明袋。", [
          add("resources.wealth", -10), add("relationships.family", -4), add("resources.reputation", 2), add("shadow.selfDeception", 1), add("shadow.trustDebt", 1),
          add("shadow.threads.dramatic_inherited_debt.responsibilityAccepted", 2),
        ]),
        O("last_receipt", older, "旧债结清时，最初一起签字的人已经少了几个。你把注销证明放进当年的信封，厚度刚好；一只信封装得下全部手续，装不下这些年谁不再登谁的门。", [
          add("resources.wealth", -4), add("relationships.family", -7), add("resources.happiness", -5), add("shadow.trustDebt", 3),
        ]),
        O("separate_checks", null, "家里从此很少共有财物，连聚餐也各自付款；服务员问要不要一起结账，大家同时说分开。", [
          add("resources.wealth", -3), add("relationships.family", -8), add("resources.freedom", 2), add("shadow.selfDeception", 2), add("shadow.trustDebt", 4),
        ], 0.35),
      ],
    },
  ],
});

const falseWitness = makeArc("false_witness", {
  yearRange: [1979, 2035],
  ageRange: [21, 68],
  category: "relationship",
  lifetimeProbability: 0.075,
  conditions: {
    all: [C("relationships.family", "gte", 25)],
    any: [C("relationships.friendship", "gte", 18), C("career.status", "in", ["employed", "self_employed", "gig_worker"])],
  },
  steps: [
    {
      id: "statement_for_kin",
      title: "你替熟人补了一句证词",
      minYears: 0,
      maxYears: 0,
      text: [
        V({ all: [C("meta.currentYear", "lte", 1995), C("location.currentCityTier", "in", ["village", "town"])] }, "亲属同邻家争一段地界，找你证明旧界石一直在那里。你明知石头前几天才挪过，仍说小时候就见过；童年的记忆很长，刚好够盖住一锹新土。"),
        V({ all: [C("meta.currentYear", "gte", 1996), C("career.status", "eq", "employed")] }, "同事同外包工发生冲突，单位请你写经过。你把同事先动手的一句删去，补上对方情绪激动；打印机卡了一次纸，第二遍出来的版本顺利得多。"),
        V({ all: [C("relationships.partnerStatus", "in", ["partnered", "married"]), C("relationships.children", "gte", 1)] }, "伴侣卷入一场纠纷，你证明那晚他一直在家。孩子就在隔壁做作业，抬头问爸爸不是很晚才回来吗；你让他先写完题，大人的时间另有算法。"),
        V(poor, "熟人答应事情过去后替你保住工作或租处，你便在询问时少说了一段。对方因证据不足离开，熟人当天请你吃饭，结账时还认真核对了小票。"),
        F("一场纠纷需要旁证，你替亲友把含糊之处说得确定，也把不利的一幕省掉。签完字以后，对方问你是否再核对一遍，你说不用。"),
      ],
      effects: [
        add("resources.reputation", 3), add("relationships.family", 3), add("relationships.friendship", -2),
        add("shadow.complicity", 5), add("shadow.harmDone", 5), add("shadow.selfDeception", 3), add("shadow.trustDebt", 5),
      ],
    },
    {
      id: "life_after_statement",
      title: "判定以后，受损的人搬走了",
      minYears: 2,
      maxYears: 6,
      text: [
        V({ all: [C("location.currentCityTier", "in", ["village", "town"]), C("meta.currentYear", "lte", 2005)] }, "失去地界或生计的一家搬去别处，空屋很快堆上杂物。亲属把争来的地方用上，还抱怨那家人走前没清干净；你绕过一只破脸盆，没有接话。"),
        V({ all: [C("career.status", "in", ["employed", "self_employed"]), C("meta.currentYear", "gte", 1996)] }, "被你写成过错方的人离开岗位，工位几周后便换了新人。你得到一次信任或升迁，账号沿交接表归到你名下，对方杯子留下的茶渍却擦了几遍才淡。"),
        V(guilty, "你私下找到受损的人，想解释自己当时也害怕。他没有问你怕什么，只问是否愿意改证词；你答应再想想，谈话于是准确停在你的害怕上。"),
        V(hardened, "亲友兑现了承诺，你的生活因此稳下来。有人提起离开的人，你说纠纷双方都有责任；平均分配责任以后，你那句证词轻得几乎可以忽略。"),
        F("判定生效后，另一方失去住处、工作或一段重要关系，离开了原来的生活。亲友此后凡事先来找你，连借梯子也说你最可靠。"),
      ],
      effects: [
        add("resources.wealth", 4), add("resources.reputation", 3), add("resources.happiness", -5), add("relationships.friendship", -5),
        add("shadow.harmDone", 5), add("shadow.guilt", 3), add("shadow.trustDebt", 4),
      ],
    },
    {
      id: "record_reopened",
      title: "旧证词重新摊在灯下",
      minYears: 4,
      maxYears: 12,
      text: "旧证词因新的材料重新摊开。纸上的句子没有变，签字的人却必须再次决定说到哪里。",
      outcomes: [
        O("testimony_changed", guilty, "你改了口供，清楚写下当年省掉什么。受损的人获得部分纠正，却拒绝同你见面；办事员替你转交了材料，原封退回。", [
          add("resources.reputation", -7), add("resources.wealth", -2), add("relationships.family", -3), add("shadow.selfDeception", -3), add("shadow.trustDebt", -2),
          add("shadow.threads.dramatic_false_witness.responsibilityAccepted", 5), add("shadow.threads.dramatic_false_witness.victimContact", 3),
        ], 1.15),
        O("memory_refused", hardened, "你坚持记忆已经模糊，拒绝重述细节。案件最后没有改判，亲友仍同你来往；每次合照你们都站得近，看起来像在互相证明。", [
          add("resources.reputation", 2), add("relationships.family", 2), add("shadow.selfDeception", 4), add("shadow.trustDebt", 5),
        ]),
        O("rehearsed_sentence", older, "重查来得很晚，你在询问室里几次听不清问题，却准确记得自己当年的句子。办事的人问为何记得这么牢，你说那毕竟是大事，没有说它在多少个夜里被你复述过。", [
          add("resources.happiness", -6), add("relationships.family", -4), add("shadow.selfDeception", 2), add("shadow.trustDebt", 3),
        ]),
        O("confidential_settlement", secure, "你请人同受损方达成和解，支付一笔钱，证词本身不再追究。协议写得周全，对方带走补偿，也带走公开讲述的权利。", [
          add("resources.wealth", -8), add("resources.reputation", 1), add("shadow.selfDeception", 2), add("shadow.trustDebt", 1),
          add("shadow.threads.dramatic_false_witness.victimContact", 2), add("shadow.threads.dramatic_false_witness.benefitRetained", -2),
        ]),
        O("family_learns_version", null, "纸上的你语气确定，现实中的你只说记不清。记录没有完整更正，家里却第一次知道你们这些年守着同一个版本。", [
          add("resources.reputation", -3), add("relationships.family", -6), add("resources.happiness", -4), add("shadow.selfDeception", 1), add("shadow.trustDebt", 4),
        ], 0.35),
      ],
    },
  ],
});

const careLapse = makeArc("care_lapse", {
  yearRange: [1950, 2035],
  ageRange: [30, 78],
  category: "family",
  lifetimeProbability: 0.075,
  conditions: {
    all: [C("relationships.family", "gte", 34)],
    any: [C("relationships.children", "gte", 1), C("relationships.partnerStatus", "in", ["partnered", "married"]), C("meta.age", "gte", 48)],
  },
  steps: [
    {
      id: "one_more_hour",
      title: "你把查看推迟了一小时",
      minYears: 0,
      maxYears: 0,
      text: [
        V({ all: [C("meta.currentYear", "lte", 1978), C("location.currentCityTier", "in", ["village", "town"])] }, "家中病人夜里呼吸不稳，你听见动静，仍想等天亮再去请人。鸡叫前屋里忽然安静下来；天亮照常到了，能做的事却已经换了一种。"),
        V({ all: [C("meta.currentYear", "gte", 1990), C("relationships.children", "gte", 1)] }, "你忙乱中把药量记错，又没有核对孩子或老人的反应。发现时空药板还整齐放着，日期印得十分清楚，只有服下去的那一格再也不能填回。"),
        V({ all: [C("meta.currentYear", "gte", 2000), C("career.status", "eq", "employed"), C("resources.freedom", "lte", 45)] }, "连续加班后，你把照护设备的提醒按成已处理，打算睡醒再看。凌晨的异常没人响应；第二天单位照常提醒你打卡，仿佛世界只漏掉了一条通知。"),
        V(poor, "你知道情况可能要送医，却先算了车费和欠下的工钱，决定再观察一会儿。那段等待后来很难计算：省下的钱数得清，失去的功能或时间数不清。"),
        F("长期照护把你磨得迟钝，一次明确的警讯被你当成又一个可以稍后处理的夜晚。等你起身，事情已留下不能完全恢复的伤害。"),
      ],
      effects: [
        add("resources.health", -5), add("resources.happiness", -13), add("relationships.family", -10), add("resources.freedom", -4),
        add("shadow.harmDone", 6), add("shadow.guilt", 6), add("shadow.trustDebt", 6),
      ],
    },
    {
      id: "family_repeats_night",
      title: "一家人反复重讲那一夜",
      minYears: 1,
      maxYears: 5,
      text: [
        V(woman, "亲属一面责怪你，一面说原本就是你最会照料。你第一次把这些年的夜班、请假和药单摆出来；过劳解释了疏忽怎样发生，没有把受伤的人恢复原样。"),
        V({ all: [C("career.status", "in", ["none", "unemployed", "laid_off"])] }, "你失去或放下工作，开始全天守着受伤的人。家里夸你现在尽心，这句话听起来既像安慰也像判词；后来做对的每一件事，都不能替那一小时倒流。"),
        V(guilty, "你把自己的疏忽完整告诉家人和医护，没有删去那次犹豫。责任说清后，家人仍轮流接班，不再让任何人单独撑完整夜；制度补上了，伤害没有。"),
        V(hardened, "你把结果归给病情、设备和运气，反复强调换谁也未必不同。家里停止争辩，不是相信了，而是发现每次争辩都要由受伤的人再听一遍自己的那晚。"),
        F("家人围绕那次疏忽争过许多遍：谁本该接班，谁说过不舒服，谁看见提醒。事实逐渐清楚，关系反而更难放置，因为每个人都能指出自己做对的一小段。"),
      ],
      effects: [
        add("resources.wealth", -7), add("resources.happiness", -7), add("relationships.family", -8), add("resources.freedom", -5),
        add("shadow.guilt", 4), add("shadow.selfDeception", 2), add("shadow.trustDebt", 4),
      ],
    },
    {
      id: "empty_shift",
      title: "照护表上仍留着那个时段",
      minYears: 4,
      maxYears: 12,
      text: "照护表后来换过许多张，当年空下来的时段仍有痕迹。你和家人以不同方式处理它留下的日子。",
      outcomes: [
        O("handoff_rebuilt", guilty, "你后来推动家里建立真正能交接的照护安排，也替别的照护者争取休息。新表格减少了漏接的夜班，当年那只空药板仍收在旧抽屉里。", [
          add("resources.wealth", -3), add("relationships.family", 2), add("resources.freedom", -1), add("shadow.selfDeception", -2), add("shadow.trustDebt", -2),
          add("shadow.threads.dramatic_care_lapse.responsibilityAccepted", 5), add("shadow.threads.dramatic_care_lapse.victimContact", 3),
        ], 1.15),
        O("outcome_declared_fixed", hardened, "多年后你仍说结局早已注定，家人便不再同你谈那个人。照护结束了，争论也结束了，只有你讲起自己辛苦时总会跳过一小时。", [
          add("relationships.family", -8), add("resources.happiness", -2), add("shadow.selfDeception", 4), add("shadow.trustDebt", 5),
        ]),
        O("old_schedule_found", older, "你收拾旧药盒时发现当年的时间表，那个夜班仍写着你的名字。纸已经发黄，墨水没有变化；人的记忆会替自己调暗，圆珠笔不会。", [
          add("resources.happiness", -7), add("relationships.family", -3), add("shadow.trustDebt", 2),
        ]),
        O("care_paid", secure, "你承担了后续治疗和照护的大部分费用，家里因此没有陷得更深。受伤的人仍避开由你递药，信任保留自己的用药禁忌。", [
          add("resources.wealth", -9), add("relationships.family", -2), add("shadow.selfDeception", 1), add("shadow.trustDebt", 1),
          add("shadow.threads.dramatic_care_lapse.responsibilityAccepted", 2), add("shadow.threads.dramatic_care_lapse.victimContact", 1),
        ]),
        O("distance_remains", null, "受伤的人或离开，或带着后果继续生活。家里学会了交接，那一个空下来的时段仍没有人愿意替你改写。", [
          add("resources.happiness", -4), add("relationships.family", -5), add("shadow.selfDeception", 1), add("shadow.trustDebt", 3),
        ], 0.35),
      ],
    },
  ],
});

const leveragedSuccess = makeArc("leveraged_success", {
  yearRange: [1984, 2035],
  ageRange: [25, 62],
  category: "career",
  lifetimeProbability: 0.085,
  conditions: {
    all: [
      activeCareer,
      C("career.level", "gte", 3),
      C("career.field", "in", [
        "small_business", "trade", "township_business", "township_enterprise", "construction", "factory",
        "corporate", "professional", "finance", "logistics", "ecommerce", "internet", "technology", "startup",
      ]),
    ],
  },
  steps: [
    {
      id: "warning_withheld",
      title: "你没有转告那封警告",
      minYears: 0,
      maxYears: 0,
      text: [
        V({ all: [C("meta.currentYear", "lte", 1995), C("career.field", "in", ["township_business", "township_enterprise", "factory"])] }, "你提前知道原料或政策要变，却没有告诉一起起步的小厂。对方把钱压进旧设备，你趁价格未涨先买下货源；镇上后来夸你眼光准，没人问是谁替这份眼光付了学费。"),
        V({ all: [C("meta.currentYear", "gte", 2000), C("career.field", "in", ["corporate", "professional", "finance"])] }, "你收到客户将撤单的消息，没有提醒共同负责的同事，反而先把自己的方案移到安全项目。风险落地时，他的名字仍在原表格最上面，你的名字已经换了页。"),
        V({ all: [C("meta.currentYear", "gte", 2000), C("career.field", "in", ["ecommerce", "internet", "technology", "startup"])] }, "平台规则即将改变，你只替自己的店或团队提前迁移，把合作方继续留在旧入口。更新当天他们的流量骤停，你的新页面恰好接住那些顾客，后台称之为自然转化。"),
        V(poor, "机会只够一个人活下来，你把坏消息压到最后才说。对方还在按原计划进货时，你已经同债主谈妥；你见过穷途，这一次先把别人留在那里。"),
        F("你比合作伙伴早知道一项足以改变生意或职位的消息，没有转告，并提前替自己挪好位置。事情发生后，你表现得比别人镇定，这份镇定后来被称作能力。"),
      ],
      effects: [
        add("career.level", 3), add("resources.wealth", 6), add("resources.achievement", 4), add("resources.reputation", 3),
        add("relationships.friendship", -5), add("shadow.harmDone", 5), add("shadow.complicity", 4), add("shadow.selfDeception", 4), add("shadow.trustDebt", 5),
      ],
    },
    {
      id: "assets_at_discount",
      title: "你买下了对方留下的东西",
      minYears: 2,
      maxYears: 6,
      text: [
        V({ all: [C("meta.currentYear", "lte", 1999), C("location.currentCityTier", "in", ["village", "town", "county"])] }, "对方周转失败后出售机器、铺面或库存，你按市价更低一点接手。装车那天他还提醒哪台机器脾气大；生意失败的人最后一次替你的成功做了交接。"),
        V({ all: [C("meta.currentYear", "gte", 2000), C("career.status", "eq", "employed")] }, "同事离开后，他的客户和团队并到你名下。你在交接会上说会延续已有成果，投影第一页却只写了你的名字；格式统一得很快，来处消失得也很快。"),
        V(guilty, "你提出按稍高价格接手对方的资产，却没有说明自己曾提前知道消息。多付的一点钱让交易好看，也让你能把沉默解释成商业判断而非刻意。"),
        V(hardened, "你把对方的失败归为反应迟钝，并用这次收购训练新人。故事里市场负责淘汰，他负责犯错，你只负责看见机会；三方分工清楚得像一张组织图。"),
        F("受损的一方退出，你买下他留下的客户、工具或位置。合同没有写你曾压住那封警告，因此每一页都合法，每一页也都不完整。"),
      ],
      effects: [
        add("career.level", 4), add("career.income", 4), add("resources.wealth", 8), add("resources.achievement", 5), add("resources.reputation", 4),
        add("relationships.friendship", -7), add("shadow.harmDone", 5), add("shadow.hardness", 3), add("shadow.trustDebt", 4),
      ],
    },
    {
      id: "success_has_address",
      title: "成功有一处旧地址",
      minYears: 5,
      maxYears: 13,
      text: "那次提前行动后来成为事业履历里的关键一页。多年后，你怎样讲述和处置这份收益，终于走向不同结果。",
      outcomes: [
        O("profit_returned", guilty, "你把一部分收益还给对方或他的家人，也承认当年隐瞒过消息。对方收下应得的钱，拒绝共同拍照；补偿进入账户，成功故事仍失去了一位愿意替你作证的人。", [
          add("resources.wealth", -10), add("resources.reputation", -2), add("resources.achievement", -2), add("shadow.selfDeception", -3), add("shadow.trustDebt", -3),
          add("shadow.threads.dramatic_leveraged_success.responsibilityAccepted", 6), add("shadow.threads.dramatic_leveraged_success.victimContact", 4), add("shadow.threads.dramatic_leveraged_success.benefitRetained", -6),
        ], 1.15),
        O("origin_erased", hardened, "事业继续扩大，那次收购被写成关键转折。你在分享经验时删去最早的警告邮件，只谈敢于行动；听众认真记笔记，最值得警惕的一课因此没有被记下。", [
          add("resources.wealth", 7), add("resources.reputation", 5), add("resources.achievement", 5), add("shadow.selfDeception", 5), add("shadow.trustDebt", 4),
        ], 1.1),
        O("quiet_legacy", older, "退休或交班时，你在仓库、客户表或旧办公室里仍看见对方留下的习惯。年轻人以为那都是你建立的，你纠正了几个无关紧要的细节，没有纠正故事的主人。", [
          add("resources.wealth", 3), add("resources.reputation", 2), add("resources.achievement", 2), add("resources.happiness", -4), add("shadow.selfDeception", 2), add("shadow.trustDebt", 3),
        ]),
        O("named_for_cooperation", secure, "你设立一项以合作精神命名的计划。它帮助了后来者，也把最初受损者的名字留在牌匾之外。", [
          add("resources.wealth", -4), add("resources.reputation", 7), add("resources.achievement", 3), add("shadow.selfDeception", 4), add("shadow.trustDebt", 2),
        ]),
        O("timing_story", null, "被你留在风险里的人早已换行或远走。偶尔有人问成功从哪里开始，你仍说从看准时机开始。", [
          add("resources.wealth", 5), add("resources.reputation", 3), add("resources.achievement", 4), add("resources.happiness", -3), add("shadow.selfDeception", 3), add("shadow.trustDebt", 3),
        ], 0.35),
      ],
    },
  ],
});

export const dramaticLifeArcEvents = [
  ...returnedKin,
  ...syntheticLineage,
  ...silentAccident,
  ...climateRoster,
  ...inheritedDebt,
  ...falseWitness,
  ...careLapse,
  ...leveragedSuccess,
];
