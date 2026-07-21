// Institutional shadow arcs, 1978—2120.
//
// These chains sit beside (rather than duplicate) the existing public-shadow
// stories.  The older file mostly follows an individual abuse of petty power;
// this one follows rules, metrics and contracts that divide harm among enough
// desks that nobody has to feel solely responsible.  Entry requires actual
// control over people, money, data or scarce resources.  Occupation and class
// are context, never a moral diagnosis.  There are no player choices, no
// compulsory confession, and no promise that wrongdoing will be punished.

// Keep the shared `shadow_` prefix: the batch-review pipeline uses it to
// include these events in harm continuity, ending-balance and bias audits.
const PREFIX = "shadow_systemic_";
const ALL_PLACES = { cityTiers: ["village", "town", "county", "city", "tier2", "tier1"] };
const TOWN_AND_CITY = { cityTiers: ["town", "county", "city", "tier2", "tier1"] };
const URBAN = { cityTiers: ["county", "city", "tier2", "tier1"] };

const add = (path, value) => ({ path, add: value });
const C = (path, operator, value) => ({ path, [operator]: value });
const tagged = (tag) => ({ hasTag: tag });
const between = (eventId, minYears, maxYears) => ({
  eventOccurredBetween: { eventId: `${PREFIX}${eventId}`, minYears, maxYears },
});
const V = (conditions, text) => ({ conditions, text });
const F = (text) => ({ text });

function scopeThreadConditions(value, domain) {
  if (Array.isArray(value)) return value.map((item) => scopeThreadConditions(item, domain));
  if (!value || typeof value !== "object") return value;
  const scoped = Object.fromEntries(Object.entries(value).map(([key, item]) => [key, scopeThreadConditions(item, domain)]));
  if (scoped.path === "shadow.guilt") scoped.path = `shadow.threads.${domain}.guilt`;
  if (scoped.path === "shadow.selfDeception") scoped.path = `shadow.threads.${domain}.justification`;
  return scoped;
}

function systemicStepEffects(effects, domain, isOpening, isFinal) {
  const adjusted = effects.filter((effect) => {
    if (isOpening || !(effect.add > 0)) return true;
    // A scheduled consequence may arrive after layoff, a career change or
    // retirement. It must not silently promote the former office-holder or
    // award salary/status gains that only make sense while still in office.
    if (["career.level", "career.income"].includes(effect.path)) return false;
    if (effect.path?.startsWith("resources.")) return false;
    // Keep the final scene from assigning the same moral direction to
    // confession, hardening and unresolved aftermath. Closing outcomes below
    // own those state changes instead.
    if (isFinal && ["shadow.hardness", "shadow.guilt", "shadow.selfDeception"].includes(effect.path)) return false;
    // Stage two already has a lived consequence. Whether it becomes an
    // excuse or an admission is retained from the thread opened in stage one,
    // rather than being overwritten by one uniform justification increase.
    if (!isFinal && ["shadow.hardness", "shadow.selfDeception"].includes(effect.path)) return false;
    return true;
  });
  const authored = isOpening
    ? [...adjusted, add("shadow.guilt", 1)]
    : isFinal
      ? adjusted
      : [...adjusted, add("shadow.guilt", 2)];
  return authored.flatMap((effect) => {
    const mirrored = [];
    if (effect.path === "shadow.guilt" && effect.add > 0) mirrored.push(add(`shadow.threads.${domain}.guilt`, effect.add));
    if (effect.path === "shadow.selfDeception" && effect.add > 0) mirrored.push(add(`shadow.threads.${domain}.justification`, effect.add));
    if (effect.add > 0 && ["resources.wealth", "resources.reputation", "resources.achievement"].includes(effect.path)) {
      mirrored.push(add(`shadow.threads.${domain}.benefitRetained`, Math.min(4, effect.add)));
    }
    return [effect, ...mirrored];
  });
}

function closingOutcomes(domain) {
  const guiltPath = `shadow.threads.${domain}.guilt`;
  const justificationPath = `shadow.threads.${domain}.justification`;
  return [
    {
      id: "hardened",
      conditions: { all: [C(justificationPath, "gte", 6)] },
      resultText: "你把那套说法保留了下来。日子越往后，它越像事实，而不像当初为了过关写下的一句话。",
      effects: [
        add("shadow.hardness", 2),
        add("shadow.selfDeception", 2),
        add(justificationPath, 2),
      ],
    },
    {
      id: "accountable",
      conditions: { all: [C(justificationPath, "lt", 6), C(guiltPath, "gte", 3)] },
      resultText: "你没有因此变成另一个人，只是不再把所有责任推给流程。承认来得晚，也没有替受损的人重过一遍旧日子。",
      effects: [
        add("shadow.selfDeception", -2),
        add(justificationPath, -2),
        add(`shadow.threads.${domain}.responsibilityAccepted`, 2),
      ],
    },
  ];
}

const poor = { all: [C("resources.wealth", "lte", 45)] };
const secure = { all: [C("resources.wealth", "gte", 68)] };
const older = { all: [C("meta.age", "gte", 55)] };
const rural = { all: [C("location.currentCityTier", "in", ["village", "town"])] };
const county = { all: [C("location.currentCityTier", "in", ["town", "county"])] };
const future = { all: [C("meta.currentYear", "gte", 2036)] };
const deepFuture = { all: [C("meta.currentYear", "gte", 2070)] };
const earlyReform = { all: [C("meta.currentYear", "lte", 1995)] };
const guilty = { all: [C("shadow.guilt", "gte", 3), C("shadow.selfDeception", "lt", 6)] };
const hardened = { all: [C("shadow.selfDeception", "gte", 6)] };
const leftWork = { all: [C("career.status", "in", ["none", "unemployed", "laid_off", "retired"])] };

function joinConditions(required, extra = {}) {
  return {
    all: [...required, ...(extra.all ?? [])],
    ...(extra.any ? { any: extra.any } : {}),
    ...(extra.none ? { none: extra.none } : {}),
  };
}

function makeChain(key, {
  yearRange,
  ageRange,
  currentRegions,
  conditions,
  category = "career",
  lifetimeProbability = 0.13,
  steps,
}) {
  const ids = steps.map((step) => `${key}_${step.id}`);
  const domain = `${PREFIX}${key}`;

  return steps.map((step, index) => {
    const previous = steps[index - 1];
    const next = steps[index + 1];
    const minimumDelay = steps.slice(1, index + 1).reduce((sum, item) => sum + item.minYears, 0);
    const maximumDelay = steps.slice(1, index + 1).reduce((sum, item) => sum + item.maxYears, 0);
    const eventYearRange = step.yearRange ?? (index === 0
      ? yearRange
      : [yearRange[0] + minimumDelay, Math.min(2120, yearRange[1] + maximumDelay)]);
    const eventAgeRange = step.ageRange ?? (index === 0
      ? ageRange
      : [ageRange[0] + minimumDelay, Math.min(105, ageRange[1] + maximumDelay)]);
    const required = index === 0
      ? [{ missingTag: "systemic_shadow_actor" }]
      : [between(ids[index - 1], step.minYears, step.maxYears), tagged(`${PREFIX}${ids[index - 1]}`)];

    return {
      id: `${PREFIX}${ids[index]}`,
      title: step.title,
      category: step.category ?? category,
      yearRange: eventYearRange,
      ageRange: eventAgeRange,
      ...((step.currentRegions ?? (index === 0 ? currentRegions : undefined))
        ? { currentRegions: step.currentRegions ?? currentRegions }
        : {}),
      conditions: scopeThreadConditions(joinConditions(required, step.conditions ?? (index === 0 ? conditions : {})), domain),
      ...(index > 0 ? { requiresEvents: [`${PREFIX}${ids[index - 1]}`] } : {}),
      maxOccurrences: 1,
      baseWeight: index === 0 ? 40 : index === 1 ? 100 : 124,
      ...(index === 0 ? { lifetimeProbability } : {}),
      narrativeTier: index === 0 ? "turning_point" : "consequence",
      narrativeDomain: domain,
      narrativeThread: next ? { expiresAfterYears: next.maxYears } : { close: true },
      text: scopeThreadConditions(step.text, domain),
      ...(!next ? { outcomes: closingOutcomes(domain) } : {}),
      effects: [
        ...(index === 0 ? [{ initializeShadowThread: domain }] : []),
        ...systemicStepEffects(step.effects ?? [], domain, index === 0, !next),
        ...(next ? [{
          scheduleEvent: {
            eventId: `${PREFIX}${ids[index + 1]}`,
            delayYears: [next.minYears, next.maxYears],
            weightMultiplier: index === 0 ? 24 : 18,
          },
        }] : []),
        { addTag: "systemic_shadow_actor" },
        { addTag: `${PREFIX}${key}` },
        { addTag: `${PREFIX}${ids[index]}` },
      ],
    };
  });
}

const platformDispatch = makeChain("platform_dispatch", {
  yearRange: [2012, 2075],
  ageRange: [24, 65],
  currentRegions: TOWN_AND_CITY,
  lifetimeProbability: 0.15,
  conditions: {
    all: [
      C("career.status", "eq", "employed"),
      C("career.role", "eq", "digital_operations_manager"),
      C("career.field", "in", ["corporate", "ecommerce", "internet", "technology", "logistics"]),
    ],
  },
  steps: [
    {
      id: "bad_order_pool",
      title: "难送的单子沉到一群人脚下",
      minYears: 0,
      maxYears: 0,
      text: [
        V(county, "平台在县城铺开，你负责把远村、坏路和小额订单重新定价。若如实加价，报表不好看；你便让系统优先派给接单率最低的人，他们更怕再拒一次。"),
        V(future, "调度模型把电梯检修、暴雨积水和顾客催促压成一个预计分钟数。你知道分钟数偏紧，仍把难单自动沉给评分较低的人：他们的选择最少，模型因此最容易成功。"),
        F("你负责改善平台履约率，把偏远、超重和容易超时的订单集中推给排名靠后的人。会上称为运力下沉，骑手的页面只显示再拒一单会影响明天。"),
      ],
      effects: [
        add("career.level", 2), add("resources.achievement", 3), add("resources.wealth", 2),
        add("shadow.complicity", 4), add("shadow.harmDone", 4), add("shadow.selfDeception", 3), add("shadow.trustDebt", 4),
      ],
    },
    {
      id: "appeal_budget",
      title: "申诉也有通过率",
      minYears: 2,
      maxYears: 6,
      text: [
        V(leftWork, "你已经离开调度岗位，那套拒绝申诉的模板仍在使用。前同事说系统稳定了许多，你问的是日订单量，没有问多少人退出后才显得稳定。"),
        V(guilty, "你给申诉组留出少量人工复核，却规定每周不得改回太多处罚。你能证明自己没有全拒，也能让成本始终可控；被纠正的人成了善意，被漏下的人成了比例。"),
        V(hardened, "你把申诉改成几项勾选理由，平均处理时间降到一分钟。顾客退款、骑手扣款和商家损耗分属三张表，没有一张表会把同一笔损失加起来。"),
        F("部门开始考核申诉改判率，你把它压在一个看起来既不僵硬也不宽松的数字上。事实各不相同，结论却要先服从一条平稳的曲线。"),
      ],
      effects: [
        add("career.level", 3), add("resources.reputation", 3), add("resources.wealth", 3),
        add("shadow.hardness", 3), add("shadow.complicity", 5), add("shadow.harmDone", 5), add("shadow.selfDeception", 4), add("shadow.trustDebt", 5),
      ],
    },
    {
      id: "good_quarter",
      title: "这个季度没有异常",
      minYears: 4,
      maxYears: 12,
      text: [
        V(leftWork, "旧同事把你的调度办法复制到新区域，季度汇报仍沿用你定的口径。你早已转行或退休，方法却比任职时间长寿；它不需要你在场，也不需要记得最初那批人。"),
        V(deepFuture, "多年后，低评分劳动者已由不同形式的临时队伍承担最难的路段。系统介绍写着持续学习，你的旧参数没有姓名，只作为一组有效经验保留下来。"),
        V(guilty, "一次内部回顾里，你补写了雨天与远程订单的真实成本。公司调整了几项费率，却没有追补旧处罚；新数字变得诚实一点，旧日子并没有因此重算。"),
        F("履约率连续几个季度达标，你得到晋升或分红。离开的人被归为自然流动，新来的人接过账号；算法无需报复谁，也足以让损耗固定落在同一类人身上。"),
      ],
      effects: [
        add("resources.wealth", 5), add("resources.reputation", 3),
        add("shadow.hardness", 2), add("shadow.complicity", 4), add("shadow.selfDeception", 5), add("shadow.trustDebt", 3),
      ],
    },
  ],
});

const riskLabel = makeChain("risk_label", {
  yearRange: [2005, 2098],
  ageRange: [25, 68],
  currentRegions: URBAN,
  lifetimeProbability: 0.14,
  conditions: {
    all: [
      C("career.status", "eq", "employed"),
      C("career.role", "in", ["digital_operations_manager", "finance_risk_manager", "public_program_manager"]),
      C("education.score", "gte", 52),
      C("career.field", "in", ["finance", "corporate", "internet", "technology", "public_sector"]),
    ],
  },
  steps: [
    {
      id: "proxy_added",
      title: "贫穷换了一个技术名字",
      minYears: 0,
      maxYears: 0,
      text: [
        V(future, "你参与更新一套风险模型，居住稳定、照护负担和设备在线时长被合成一项可靠度。会上没人写穷这个字，低收入者仍整齐地落到了另一边。"),
        V(county, "县域数据不全，你同意用住址变动、缴费间断和联系人数量填补空白。那些常换工地、共用手机的人因此更像风险；缺失的信息没有缺席，只是以惩罚的形式出现。"),
        F("你为贷款、招聘或公共服务加了一项风险标签。敏感身份没有直接进入公式，住址、消费和工作间断替它们完成了相近的分类。"),
      ],
      effects: [
        add("career.level", 2), add("resources.achievement", 3), add("resources.reputation", 2),
        add("shadow.complicity", 5), add("shadow.harmDone", 4), add("shadow.selfDeception", 4), add("shadow.trustDebt", 4),
      ],
    },
    {
      id: "appeal_without_reason",
      title: "可以申诉，不能知道申诉什么",
      minYears: 2,
      maxYears: 7,
      text: [
        V(leftWork, "你离开项目后，标签继续在不同机构间调用。后来用户可以申诉，却仍看不到最初的变量；你说那已经是运营问题，运营说模型由旧项目交付。"),
        V(poor, "你自己的经济状况也曾紧过一阵，仍主张不公开判断细节，以免有人钻空子。你熟悉被怀疑的滋味，也熟悉站在屏幕这一边后它能节省多少工作。"),
        V(guilty, "你提出给边缘案例增加人工说明，最终只获准显示几个宽泛原因。被拒的人知道自己不够可靠，却仍不知道哪一段生活成了证据。"),
        F("申诉入口上线后，部门规定不得泄露模型参数。人们上传工资、租约和病历证明自己，系统只回复复核完成；透明被解释成一扇能敲、但看不见门后的门。"),
      ],
      effects: [
        add("career.level", 3), add("resources.reputation", 3),
        add("shadow.hardness", 3), add("shadow.complicity", 5), add("shadow.harmDone", 5), add("shadow.selfDeception", 4), add("shadow.trustDebt", 6),
      ],
    },
    {
      id: "audit_passed",
      title: "审计证明它没有看见任何人",
      minYears: 4,
      maxYears: 13,
      text: [
        V(secure, "模型通过审计后，你所在的家庭恰好能以较低成本获得服务。你没有替自己改过参数，只是生活中的稳定条件，全都被系统认作了品德。"),
        V(hardened, "外部审计确认模型没有直接使用敏感身份，你把结论放进演讲第一页。至于哪些替代变量把同一群人重新聚到一起，不在合规问题清单里。"),
        V(guilty, "你后来把一部分代理变量从模型里删掉，准确率下降了两个点。有人称这是向舆论妥协；旧标签没有批量撤销，你也没有坚持到那一步。"),
        F("这套评分被更多机构采购，你的履历多了一项成功案例。被拒的人各自以为只是运气不好，系统因此很少面对一群能够互相作证的人。"),
      ],
      effects: [
        add("resources.wealth", 4), add("resources.reputation", 4), add("resources.achievement", 3),
        add("shadow.hardness", 2), add("shadow.complicity", 5), add("shadow.selfDeception", 5), add("shadow.trustDebt", 4),
      ],
    },
  ],
});

const housingRiskTransfer = makeChain("housing_risk_transfer", {
  yearRange: [1992, 2085],
  ageRange: [26, 66],
  currentRegions: TOWN_AND_CITY,
  lifetimeProbability: 0.14,
  conditions: {
    all: [
      C("career.status", "eq", "employed"),
      C("resources.wealth", "gte", 42),
      C("career.field", "in", ["finance", "construction", "public_sector"]),
      C("career.role", "in", ["finance_risk_manager", "industrial_project_manager", "public_program_manager"]),
    ],
  },
  steps: [
    {
      id: "future_income_sold",
      title: "把未来收入先写进今天的成交额",
      minYears: 0,
      maxYears: 0,
      text: [
        V(county, "县城项目不好卖，你把首付拆成借款，又用未来经营收入解释还款能力。买房的人问空铺能否租出，你指向规划图上尚未通车的道路。"),
        V(future, "气候改造与养老配套抬高了住房价格，你把长期服务费和贷款合成一个每月数字。客户看见的是能否付第一个月，后半生的涨价条款折在附件里。"),
        V(secure, "你明知一些家庭收入承受不起波动，仍建议把父母积蓄与下一代收入一起列作偿付来源。佣金按成交计算，风险按许多年以后计算。"),
        F("你参与销售一批需要长期举债的住房，把最乐观的工资增长写进测算。合同没有一句是假话，只是每句风险都被安排在不同页。"),
      ],
      effects: [
        add("resources.wealth", 5), add("career.level", 2), add("resources.reputation", 2),
        add("shadow.complicity", 5), add("shadow.harmDone", 4), add("shadow.selfDeception", 4), add("shadow.trustDebt", 4),
      ],
    },
    {
      id: "risk_moved_on",
      title: "坏账有了下一位持有人",
      minYears: 3,
      maxYears: 8,
      text: [
        V(leftWork, "你已离开售房或融资岗位，那批合同被转给新的管理方。住户仍按原地址交钱，每封催款信的落款却不同；只有债务从未换过住处。"),
        V(poor, "市场转冷时，你自己的现金也吃紧，便更快把高风险合同打包转出。你把这叫保住团队，接手方也会用同一句话向下一层解释。"),
        V(hardened, "你把逾期率较高的合同连同一批优质合同卖给资金方，文件写着风险充分披露。真正充分的是律师的工时，不是住户对自己会失去什么的理解。"),
        F("还款开始吃力，你们没有降低本金，而是延长期限并把合同转给另一家机构。月供暂时变小，债务活得比许多家庭计划更久。"),
      ],
      effects: [
        add("resources.wealth", 5), add("career.level", 3), add("resources.freedom", 2),
        add("shadow.hardness", 3), add("shadow.complicity", 6), add("shadow.harmDone", 5), add("shadow.selfDeception", 4), add("shadow.trustDebt", 5),
      ],
    },
    {
      id: "empty_windows",
      title: "黑着的窗户不进入奖金表",
      minYears: 5,
      maxYears: 14,
      text: [
        V(leftWork, "几年后，那片楼里出现断供、空置或长期维修争议。你已经转业，仍能从旧项目履历里获益；失败发生在交付之后，成功则永远停在成交那年。"),
        V({ all: [C("career.status", "eq", "retired")] }, "你退休后路过旧项目，夜里只有零散窗户亮着。门口仍立着当年的宣传语，字已经褪色，关于兑现期限的那一行反而最清楚。"),
        V(guilty, "你帮少数住户补办了重组手续，没有公开承认最初测算过于乐观。几家人因此喘过一口气，整套售卖逻辑仍被行业当作当时的通行办法。"),
        F("项目出现空置与违约时，责任已经分散在开发、销售、融资和接管机构之间。你没有被追责，还因及时转出风险被评价为判断准确。"),
      ],
      effects: [
        add("resources.wealth", 4), add("resources.reputation", 2),
        add("shadow.hardness", 2), add("shadow.complicity", 4), add("shadow.selfDeception", 5), add("shadow.trustDebt", 4),
      ],
    },
  ],
});

const careByMinute = makeChain("care_by_minute", {
  yearRange: [2005, 2095],
  ageRange: [27, 70],
  currentRegions: ALL_PLACES,
  lifetimeProbability: 0.14,
  conditions: {
    all: [
      C("career.status", "eq", "employed"),
      C("career.role", "eq", "care_service_supervisor"),
      C("career.field", "in", ["care_work", "healthcare", "doctor", "nurse"]),
    ],
  },
  steps: [
    {
      id: "minutes_cut",
      title: "照护被切成可出售的分钟",
      minYears: 0,
      maxYears: 0,
      text: [
        V(rural, "乡镇照护点覆盖的村子越来越远，你仍按城里的标准压缩每户时长。护理员把路上耽误补在自己下班后，表格便证明每一户都准时完成。"),
        V(future, "机构把翻身、喂药、清洁与陪伴分别标出标准分钟。你删掉无法计价的停留时间，老人一句话说到一半，也只能算进下一单的迟到。"),
        V(older, "你已接近需要照护的年纪，仍同意把每次服务缩短几分钟。你说专业工作应当讲效率，仿佛衰老也会为了流程抓紧一点。"),
        F("为了让机构接下更多家庭，你把上门照护压缩成更短的标准时长。护理员问临时弄脏床单怎么算，你说现场灵活处理，系统里没有灵活这一项。"),
      ],
      effects: [
        add("career.level", 2), add("resources.achievement", 3), add("resources.reputation", 2),
        add("shadow.complicity", 4), add("shadow.harmDone", 5), add("shadow.selfDeception", 3), add("shadow.trustDebt", 4),
      ],
    },
    {
      id: "clean_dashboard",
      title: "床边很乱，屏幕很干净",
      minYears: 2,
      maxYears: 6,
      text: [
        V(leftWork, "你调离一线管理后，原机构仍要求照护者在离门前点下完成。新主管只看见准时率，老人则认得每一张匆忙换鞋的脸。"),
        V(guilty, "你允许护理员为复杂个案申请加时，却把审批额度设得很低。大家学会只替最严重的几户申报，其他超时继续由下班承担。"),
        V(hardened, "你要求离开前必须点选服务完成，漏做的部分由下一班补。屏幕上的完成率接近满分，床边的人知道完成只是一个按钮的位置。"),
        F("护理员流动加快，你把原因写成行业用工紧张。工资、排班和被压掉的分钟分列在不同部门，任何一个部门都不足以单独解释离职。"),
      ],
      effects: [
        add("career.level", 3), add("resources.wealth", 3), add("resources.reputation", 3),
        add("shadow.hardness", 3), add("shadow.complicity", 5), add("shadow.harmDone", 5), add("shadow.selfDeception", 4), add("shadow.trustDebt", 6),
      ],
    },
    {
      id: "model_exported",
      title: "这套办法被称为可复制",
      minYears: 4,
      maxYears: 12,
      text: [
        V(secure, "你的家庭后来购买了更昂贵的照护，合同里明确写着不按标准分钟截断。你没有找关系，只是付得起让别人不必高效地老去。"),
        V(leftWork, "你已退休或离职，旧排班法却被更多机构采用。培训材料把它称为可复制模式，没有附上护理员下班后补的那些小时。"),
        V(guilty, "你在行业会上承认标准时长低估复杂照护，提议重新定价。会上记下建议，成本方案仍沿用旧模型；诚实进入了纪要，没有进入下一月排班。"),
        F("机构凭高覆盖率获得扩张资格，你也得到晋升、奖金或行业名声。新门店挂上更亮的招牌，旧护理员陆续换班离开，老人仍在下一张服务单上等门铃。"),
      ],
      effects: [
        add("resources.wealth", 4), add("resources.reputation", 4),
        add("shadow.hardness", 2), add("shadow.complicity", 5), add("shadow.selfDeception", 4), add("shadow.trustDebt", 4),
      ],
    },
  ],
});

const climateBoundary = makeChain("climate_boundary", {
  yearRange: [2036, 2102],
  ageRange: [30, 72],
  currentRegions: ALL_PLACES,
  lifetimeProbability: 0.14,
  conditions: {
    all: [
      C("career.status", "eq", "employed"),
      C("career.role", "in", ["public_program_manager", "industrial_project_manager"]),
      C("career.field", "in", ["public_sector", "grassroots_post", "construction"]),
    ],
  },
  steps: [
    {
      id: "line_drawn",
      title: "风险地图上需要一条线",
      minYears: 0,
      maxYears: 0,
      text: [
        V(rural, "有限的防洪与降温预算只能覆盖一部分聚落，你把产业园和有完整产权的村组圈进优先区。河对岸住得更散，地图缩小时连门牌都看不清。"),
        V(deepFuture, "连续极端天气后，你参与划定长期保障区。医院、数据设施和高价值住宅被圈进稳定供能范围，外围租住人口则被归入弹性迁居。线条很细，生活要跨过去却很难。"),
        V(secure, "你熟悉核心地段的税收、产权与基础设施，便把它们写成优先保护的客观依据。你的住处恰好落在线内，会议没有因此要求你回避。"),
        F("气候适应资金不足，你参与画出优先保护边界。产权清楚、税收稳定的地方更容易证明价值；临时住户只证明了那里住着人。"),
      ],
      effects: [
        add("career.level", 2), add("resources.reputation", 3), add("resources.freedom", 2),
        add("shadow.complicity", 5), add("shadow.harmDone", 5), add("shadow.selfDeception", 4), add("shadow.trustDebt", 4),
      ],
    },
    {
      id: "outside_counted_as_mobile",
      title: "线外的人被统计成可以移动",
      minYears: 2,
      maxYears: 7,
      text: [
        V(leftWork, "你离开规划岗位后，边界成为后来项目的前提。每次会议都从已经画好的线开始，于是最早那次取舍再也不像一个需要重审的决定。"),
        V(rural, "线外村民要求同等加固，你用常住人口与维护成本解释差别。年轻人外出使人口变少，保护减少又促使更多人外出，数字逐年证明了最初的判断。"),
        V(guilty, "你争取到一笔线外临时补助，但申请要求长期租约或产权证明。最不稳定的人仍无法证明自己稳定地处在危险中。"),
        F("补偿方案优先处理产权人和登记企业，租客、临时工与借住亲属被计作流动人口。报告说他们迁移成本较低，意思只是没有资产能被估价。"),
      ],
      effects: [
        add("career.level", 3), add("resources.achievement", 3), add("resources.reputation", 3),
        add("shadow.hardness", 3), add("shadow.complicity", 6), add("shadow.harmDone", 6), add("shadow.selfDeception", 4), add("shadow.trustDebt", 6),
      ],
    },
    {
      id: "loss_outside_scope",
      title: "损失发生在项目范围之外",
      minYears: 4,
      maxYears: 12,
      text: [
        V(leftWork, "极端天气再次来临时，你已调岗或退休。线内设施保持运行，线外损失被列作项目范围外；旧同事发来捷报，你回了一个祝贺。"),
        V(hardened, "评估确认核心区域损失下降，你在会上说资源集中是正确的。线外居民的搬离也被计入风险人口减少，失败换一列填写，便能继续支持成功。"),
        V(guilty, "你在复盘中附上线外伤亡与迁居人数，要求把它们计入成效。报告保留了附录，却仍以核心区损失下降为标题；你接受了这个版本。"),
        F("几年后，边界外发生更重损失，项目本身仍通过验收。你没有篡改数据，只是数据从一开始就只需要证明线内安全。"),
      ],
      effects: [
        add("resources.reputation", 4), add("resources.achievement", 3),
        add("shadow.hardness", 2), add("shadow.complicity", 5), add("shadow.selfDeception", 5), add("shadow.trustDebt", 5),
      ],
    },
  ],
});

const automationResidual = makeChain("automation_residual", {
  yearRange: [2000, 2098],
  ageRange: [27, 68],
  currentRegions: TOWN_AND_CITY,
  lifetimeProbability: 0.15,
  conditions: {
    all: [
      C("career.status", "eq", "employed"),
      C("career.role", "in", ["digital_operations_manager", "industrial_project_manager"]),
      C("career.field", "in", ["factory", "corporate", "logistics", "technology", "internet"]),
    ],
  },
  steps: [
    {
      id: "exceptions_left_to_people",
      title: "机器接走日常，人留下来处理例外",
      minYears: 0,
      maxYears: 0,
      text: [
        V(future, "新系统接管大部分常规判断，你裁去一批岗位，只留下临时人员处理模型不认识的例外。例外最复杂、时限最短，工资却按剩余工作量而不是难度计算。"),
        V(rural, "县域业务上线自动流程后，方言材料、老旧证件与弱网地区不断转人工。你仍按全国平均配置人手，偏远不是系统的故障，只是当地工作人员每天的加班。"),
        F("你推动自动化并削减常规岗位，把剩余人员改称异常处理员。汇报里机器承担了大部分工作，人则承担了几乎全部难以解释的部分。"),
      ],
      effects: [
        add("career.level", 3), add("resources.achievement", 4), add("resources.wealth", 3),
        add("shadow.complicity", 4), add("shadow.harmDone", 4), add("shadow.selfDeception", 3), add("shadow.trustDebt", 4),
      ],
    },
    {
      id: "errors_called_interventions",
      title: "错误经过人手，便算人工干预",
      minYears: 2,
      maxYears: 7,
      text: [
        V(leftWork, "你已经离开改造项目，旧员工仍要为每次人工改动签名。系统版本更新过多次，责任页保留的却始终是最后触碰结果的那个人。"),
        V(poor, "成本继续收紧时，你也担心自己的位置，便同意把异常处理外包按件计费。你把决定解释成大家都在保饭碗，只是有些人的饭碗被拿来垫住另一些。"),
        V(hardened, "一次批量错误造成损失，日志显示最后有员工点过确认。你把报告标题写成人工干预偏差，没有写那个人一次要核对多少条。"),
        F("为防止系统出错，你要求人工复核；为维持效率，又给每次复核不到一分钟。错误发生后，组织能够同时证明机器不是全自动、人也曾经看过。"),
      ],
      effects: [
        add("career.level", 3), add("resources.reputation", 3), add("resources.wealth", 3),
        add("shadow.hardness", 3), add("shadow.complicity", 6), add("shadow.harmDone", 5), add("shadow.selfDeception", 5), add("shadow.trustDebt", 6),
      ],
    },
    {
      id: "savings_booked",
      title: "节省已经入账，代价仍在排队",
      minYears: 4,
      maxYears: 13,
      text: [
        V(leftWork, "你转岗或退休后，自动化节省仍算在你的项目成绩里。后续纠错费用进了运营预算，两个数字从不在同一场会上相见。"),
        V(guilty, "你后来承认异常工作被低估，推动恢复少量岗位。以前被裁的人没有回来，外包人员也没有补偿；组织只需从今天起显得更合理。"),
        V(deepFuture, "系统已迭代到很少有人记得最初流程，人工仍守在例外队列末端。每一代管理者都宣布自动化接近完成，队列则用不断更名的方式继续存在。"),
        F("项目获得成本奖，你保住奖金或升迁。被裁者在新的招聘页上传简历，外包复核员继续按件点确认，被误判的人各自重交材料；颁奖照里不需要为他们留一排空椅子。"),
      ],
      effects: [
        add("resources.wealth", 5), add("resources.reputation", 4), add("resources.achievement", 3),
        add("shadow.hardness", 2), add("shadow.complicity", 5), add("shadow.selfDeception", 5), add("shadow.trustDebt", 4),
      ],
    },
  ],
});

const longevityAllocation = makeChain("longevity_allocation", {
  yearRange: [2036, 2108],
  ageRange: [32, 78],
  currentRegions: TOWN_AND_CITY,
  lifetimeProbability: 0.13,
  conditions: {
    all: [
      C("career.status", "eq", "employed"),
      C("career.role", "in", ["care_service_supervisor", "finance_risk_manager", "public_program_manager"]),
      C("education.score", "gte", 54),
      C("career.field", "in", ["care_work", "healthcare", "doctor", "nurse", "public_sector", "finance"]),
    ],
  },
  steps: [
    {
      id: "support_score",
      title: "谁更值得治疗，有了一套分数",
      minYears: 0,
      maxYears: 0,
      text: [
        V(deepFuture, "延缓衰弱的长期疗程仍然稀缺，你同意把居住稳定、照护网络与持续付费能力纳入获益评分。分数预测谁更能坚持治疗，也顺便优先选择了最不缺支持的人。"),
        V(rural, "基层申请者需要证明能定期复诊、冷藏药物并有人照护。你说这是保证疗效；路远、电不稳和子女外出由此被写成患者自己的依从风险。"),
        V(secure, "你主张有限名额应给最可能完成全程的人。稳定住房、家庭照护与财务余量都被当成医学优势，你拥有其中大部分，却没有在会上提及。"),
        F("你参与制定稀缺疗程的分配规则，把预期获益、家庭支持与后续支付放进同一张评分表。医学语言很精确，生活条件也因此显得像身体的一部分。"),
      ],
      effects: [
        add("career.level", 2), add("resources.reputation", 3), add("resources.achievement", 3),
        add("shadow.complicity", 5), add("shadow.harmDone", 5), add("shadow.selfDeception", 4), add("shadow.trustDebt", 4),
      ],
    },
    {
      id: "uncertain_benefit",
      title: "等不起的人被写成获益不确定",
      minYears: 2,
      maxYears: 7,
      text: [
        V(leftWork, "你离开评估岗位后，旧评分仍决定新的候补名单。后来新增的解释页引用了委员会共识，个人姓名被删去，规则因此比任何一届委员会都更像自然事实。"),
        V(older, "申请者里有与你同龄的人因基础病、住址不稳或无人照护被降级。你看见年龄相同的出生年，却仍在不确定获益一栏签了字。"),
        V(guilty, "你为一名边缘申请者争取复议，却要求对方先证明家属能承担照护。复议成功的条件，再次把没有家属的人挡在门外。"),
        F("候补者在等待中继续衰弱，更新后的身体状况又降低了评分。规则没有直接拒绝谁，只让等待制造出下一次拒绝所需的证据。"),
      ],
      effects: [
        add("career.level", 3), add("resources.reputation", 3),
        add("shadow.hardness", 3), add("shadow.complicity", 6), add("shadow.harmDone", 6), add("shadow.selfDeception", 4), add("shadow.trustDebt", 6),
      ],
    },
    {
      id: "protocol_praised",
      title: "同龄人后来像隔着一代",
      minYears: 5,
      maxYears: 14,
      text: [
        V(secure, "你的家庭通过商业渠道获得持续治疗，手续完全合规。你没有从公共名单夺走一个编号，只进入了另一条无需排同一支队的走廊。"),
        V(leftWork, "你退休后，行业仍引用那套方案控制疗程浪费。得到治疗的人出现在长期效果报告里，未入选者没有后续数据，规则于是越来越能证明自己挑对了人。"),
        V(guilty, "你公开指出评估会把社会优势误认成医学获益，推动增加少量保障名额。比例改变了，主通道没有；你接受荣誉时也接受了这份有限修正。"),
        F("方案因疗效稳定受到表扬，你获得声望，甚至参与下一轮标准制定。同龄人的健康年限逐渐分开，没有哪一场审判要求你交还多活的日子。"),
      ],
      effects: [
        add("resources.reputation", 5), add("resources.achievement", 4), add("resources.health", 2),
        add("shadow.hardness", 2), add("shadow.complicity", 5), add("shadow.selfDeception", 5), add("shadow.trustDebt", 4),
      ],
    },
  ],
});

const contractBlame = makeChain("contract_blame", {
  yearRange: [1978, 2105],
  ageRange: [28, 70],
  currentRegions: TOWN_AND_CITY,
  lifetimeProbability: 0.15,
  conditions: {
    all: [
      C("career.status", "eq", "employed"),
      C("career.field", "in", ["construction", "factory", "mine", "public_sector"]),
      C("career.role", "in", ["industrial_project_manager", "public_program_manager"]),
    ],
  },
  steps: [
    {
      id: "risk_sent_downstream",
      title: "危险先沿合同往下走",
      minYears: 0,
      maxYears: 0,
      text: [
        V(earlyReform, "单位把一段生产或施工任务承包给外面的队伍，你负责写下按期交付和安全自负。临时队的设备、人手都比账面薄，风险却因为盖了章，先被当作已经交出去。"),
        V(future, "项目把设备、维护和现场判断分给不同供应方，你负责在合同里写清接口责任。每一段都有人负责，几段之间的空隙却没有法人。"),
        V(rural, "外地队伍以更低报价接下高风险环节，你明知他们住得远、设备旧，仍只核对资质复印件。合同写着属地自管，危险便像也有了户口。"),
        V(secure, "你有预算直接雇人并改善条件，最终仍选择层层分包，把工期风险转给报价最低的一层。节省算作你的管理能力，夜班怎样凑齐由承包人自己想办法。"),
        F("你参与设计一条分包链，把人员、安全与交付责任逐级写进合同。总价因此下降，每一层都只对下一层说风险已经充分转移。"),
      ],
      effects: [
        add("career.level", 2), add("resources.wealth", 4), add("resources.achievement", 3),
        add("shadow.complicity", 5), add("shadow.harmDone", 4), add("shadow.selfDeception", 4), add("shadow.trustDebt", 4),
      ],
    },
    {
      id: "incident_between_companies",
      title: "事故发生在几家公司之间",
      minYears: 2,
      maxYears: 7,
      text: [
        V(earlyReform, "临时工受伤后，单位说活已包给施工队，施工队说人是包工头临时叫来的。你把几张责任书依次摊开，纸上的关系比病床边的人齐整。"),
        V(leftWork, "事故发生时你已经离开项目。调查仍引用你审核过的合同，你说明当年只负责商务条款；商务条款没有受伤，便很容易显得与事故无关。"),
        V(guilty, "你承认总包长期默认现场超时，却只愿在内部会议留下记录。公开回复仍说等待专业调查，记录和回复各自保存了你的一半。"),
        V(hardened, "临时工受伤后，总包指向分包，分包指向劳务公司，劳务公司拿出个人安全承诺书。你要求法务按合同顺序回函，责任走得比赔偿快。"),
        F("一次事故暴露了接口无人管理，各家公司却都能拿出本方完成的检查表。你没有伪造任何签字，只坚持先按合同确定谁应开口。"),
      ],
      effects: [
        add("career.level", 3), add("resources.reputation", 2), add("resources.freedom", 3),
        add("shadow.hardness", 3), add("shadow.complicity", 6), add("shadow.harmDone", 6), add("shadow.selfDeception", 5), add("shadow.trustDebt", 6),
      ],
    },
    {
      id: "more_clauses_recommended",
      title: "整改意见是把合同写得更厚",
      minYears: 4,
      maxYears: 12,
      text: [
        V(earlyReform, "整改以后，每支临时队都要再签一张安全责任书。设备和工期没有明显变化，文件却多了一层；下一次出事时，单位至少能更快找到一枚更靠下的印章。"),
        V(leftWork, "你退休或转行后，旧项目用更厚的合同完成整改。接手者说制度已经完善，意思是下次再出事时，会更快知道先把信发给谁。"),
        V(guilty, "你推动把几项高风险工作收回直接管理，却保留大部分分包结构。改善真实发生，也只发生到不推翻原有成本优势为止。"),
        V(hardened, "最终报告建议细化供应商责任，没有追究谁设计了整条链。你随后参与编写新模板，过去证明你有处置复杂事故的经验。"),
        F("最下层公司后来注销或换名，赔偿断断续续。你的职位、奖金或行业声誉没有明显受损；组织吸取了教训，受伤的人承担了教训最具体的部分。"),
      ],
      effects: [
        add("resources.wealth", 4), add("resources.reputation", 4), add("career.level", 2),
        add("shadow.hardness", 2), add("shadow.complicity", 5), add("shadow.selfDeception", 5), add("shadow.trustDebt", 5),
      ],
    },
  ],
});

export const systemicShadowPost1978ArcEvents = [
  ...platformDispatch,
  ...riskLabel,
  ...housingRiskTransfer,
  ...careByMinute,
  ...climateBoundary,
  ...automationResidual,
  ...longevityAllocation,
  ...contractBlame,
];
