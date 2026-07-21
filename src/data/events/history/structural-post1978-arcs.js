// Structural arcs after 1978.
//
// The 2036—2120 portion is fictional future history: a set of literary
// hypotheses, not factual forecasts.  These chains extend existing speculative
// pressures into ordinary lives without duplicating the public history events
// that introduced them.  No stage asks the player to choose.

// Period allocation:
//   1978—1999: mobility, housing debt, the retreat of the work unit.
//   2000—2035: portable benefits, platform labour, paid care.
//   2036—2120: AI credentials, climate relocation, water/energy rights,
//              digital inheritance, longevity strata, regional mutual aid.


const PREFIX = "struct_post78_";
const add = (path, value) => ({ path, add: value });
const C = (path, operator, value) => ({ path, [operator]: value });
const tagged = (tag) => ({ hasTag: tag });
const tagIn = (...items) => ({ tagIn: items });
const between = (eventId, minYears, maxYears) => ({
  eventOccurredBetween: { eventId: `${PREFIX}${eventId}`, minYears, maxYears },
});
const W = (...conditions) => ({ all: conditions });
const V = (conditionsA, textA, conditionsB, textB, fallback) => [
  { conditions: W(...conditionsA), text: textA },
  { conditions: W(...conditionsB), text: textB },
  { text: fallback },
];
const V3 = (conditionsA, textA, conditionsB, textB, conditionsC, textC, fallback) => [
  { conditions: W(...conditionsA), text: textA },
  { conditions: W(...conditionsB), text: textB },
  { conditions: W(...conditionsC), text: textC },
  { text: fallback },
];
const schedule = (eventId, minYears, maxYears) => ({
  scheduleEvent: {
    eventId: `${PREFIX}${eventId}`,
    delayYears: [minYears, maxYears],
    weightMultiplier: 6,
  },
});

function joinConditions(required, extra = {}) {
  return {
    all: [...required, ...(extra.all ?? [])],
    ...(extra.any ? { any: extra.any } : {}),
    ...(extra.none ? { none: extra.none } : {}),
  };
}

function makeChain(key, { lifetimeProbability = 0.1, speculative = false, conditions, currentRegions, steps }) {
  const ids = steps.map((step) => `${key}_${step.id}`);
  return steps.map((step, index) => {
    const next = steps[index + 1];
    const effects = [
      ...(step.effects ?? []),
      ...(next ? [schedule(`${key}_${next.id}`, next.minYears, next.maxYears)] : []),
    ];
    const requiredConditions = index === 0
      ? []
      : [between(ids[index - 1], step.minYears, step.maxYears)];
    return {
      id: `${PREFIX}${ids[index]}`,
      title: step.title,
      category: step.category,
      yearRange: step.yearRange,
      ageRange: step.ageRange,
      maxOccurrences: 1,
      // Lifetime probability keeps openings uncommon; once a seed qualifies,
      // the opening still needs enough weight to survive short historical
      // windows and the repository's much larger texture pool.
      baseWeight: index === 0 ? 30 : index === 1 ? 72 : 88,
      ...(index === 0 ? { lifetimeProbability } : {}),
      conditions: joinConditions(requiredConditions, step.conditions ?? (index === 0 ? conditions : {})),
      ...((step.currentRegions ?? currentRegions)
        ? { currentRegions: step.currentRegions ?? currentRegions }
        : {}),
      ...(index > 0 ? { requiresEvents: [`${PREFIX}${ids[index - 1]}`] } : {}),
      text: step.text,
      effects,
      narrativeTier: index === 0 ? "turning_point" : "consequence",
      narrativeDomain: `${PREFIX}${key}`,
      narrativeThread: index === steps.length - 1 ? { close: true } : { expiresAfterYears: next.maxYears },
      ...(speculative ? { tags: ["fictional_future"] } : {}),
    };
  });
}

const mobilityAndReturn = makeChain("mobility_return", {
  lifetimeProbability: 0.1,
  conditions: {
    any: [
      C("location.migratedTimes", "gte", 1),
      tagIn("migrant_worker", "temporary_residence_memory"),
      C("career.status", "in", ["family_labor", "self_employed"]),
    ],
  },
  steps: [
    {
      id: "away_work",
      title: "工作先离开了户口所在的地方",
      category: "migration",
      yearRange: [1984, 1997],
      ageRange: [18, 46],
      text: V(
        [C("birth.hukou", "eq", "rural")],
        "乡里的活不够，你跟着熟人去外地做工。介绍信折在贴身口袋里，住处和工钱都先按月算。",
        [C("birth.gender", "eq", "female")],
        "你去镇上或城市做工，招工的人先问婚育和能否住集体宿舍。车票只管把人送到，落脚仍要自己证明。",
        "工作机会出现在户籍之外，你带着简单行李过去。临时住址写了几次，每次都比劳动合同更短。",
      ),
      effects: [add("resources.wealth", 4), add("resources.freedom", 3), add("relationships.family", -2), add("location.migratedTimes", 1)],
    },
    {
      id: "two_places",
      title: "家用和日子牵在两处",
      category: "family",
      yearRange: [1986, 2004],
      ageRange: [20, 54],
      minYears: 2,
      maxYears: 7,
      text: V3(
        [C("career.status", "in", ["none", "unemployed", "laid_off", "retired"])],
        "外地那份工作停下后，两处生活留下的账和牵挂没有立刻停。你收好旧汇款单，重新盘算下一段日子靠什么接上。",
        [C("relationships.children", "gte", 1)],
        "工资从外地寄回，孩子的病、开学和长高都从信里得知。你回家时带礼物，也要重新学一遍家里的作息。",
        [C("resources.wealth", "lte", 42)],
        "两地开销把多挣的钱切得很薄。你把汇款单收好，月底仍要在住处同别人分一只炉子。",
        "工作和户籍隔着一段路，你按车次安排团聚。家里记得你哪天回来，你则先记住末班车几点开。",
      ),
      effects: [add("resources.wealth", 3), add("relationships.family", -3), add("resources.health", -2)],
    },
    {
      id: "return_pattern",
      title: "往返本身成了一种生活",
      category: "migration",
      yearRange: [1991, 2016],
      ageRange: [25, 68],
      minYears: 5,
      maxYears: 12,
      text: V3(
        [C("career.status", "in", ["none", "unemployed", "laid_off", "retired"])],
        "多年往返已经停下，生活仍保留着两地留下的习惯。旧钥匙舍不得扔，出门过夜时你还是会下意识检查车票。",
        [C("location.currentCityTier", "in", ["village", "town"])],
        "你把外地收入带回家乡，也把工作关系留在路那头。院子修好一间，行李始终没有完全拆开。",
        [C("relationships.family", "lte", 38)],
        "多年往返后，家里遇事不再等你拍板。你仍按时寄钱，电话里能说的话却越来越像事项清单。",
        "你没有彻底留下，也没有真正回去。节日前后的车票、两处常用钥匙和一只耐用旅行袋，把生活分成了稳定的两半。",
      ),
      effects: [add("resources.wealth", 3), add("resources.freedom", 2), add("relationships.family", 2)],
    },
  ],
});

const housingDebt = makeChain("housing_debt", {
  lifetimeProbability: 0.09,
  conditions: {
    all: [C("career.status", "in", ["employed", "self_employed", "family_labor"])],
    any: [C("relationships.partnerStatus", "eq", "partnered"), C("relationships.children", "gte", 1), C("resources.wealth", "gte", 36)],
  },
  steps: [
    {
      id: "purchase",
      title: "住房第一次变成一笔长期价格",
      category: "wealth",
      yearRange: [1992, 1999],
      ageRange: [24, 56],
      currentRegions: { cityTiers: ["town", "county", "city", "tier2", "tier1"] },
      text: V(
        [C("career.field", "in", ["state_unit", "public_sector", "factory"])],
        "单位住房办法改变，你把补贴、积蓄和借款并到一起。钥匙拿到手时，欠款年限比许多同事的工龄还长。",
        [C("relationships.children", "gte", 1)],
        "为了让一家人有稳定住处，你签下一笔多年才能还完的房款。孩子先挑窗边位置，大人把还款日写进日历。",
        "你遇上一套能够买下的住房，在租住、借款和继续等待之间算了很久，最后签了字。合同很厚，房间当时还是空的。",
      ),
      effects: [add("resources.wealth", -10), add("resources.freedom", -6), add("resources.happiness", 3)],
    },
    {
      id: "payment_years",
      title: "每月先替房子工作几天",
      category: "family",
      yearRange: [1994, 2008],
      ageRange: [26, 64],
      minYears: 2,
      maxYears: 7,
      text: V(
        [C("career.status", "in", ["none", "unemployed", "laid_off", "retired"])],
        "工作或固定收入停下来后，月供仍按原日子扣。家里把能推迟的开支列在纸上，只有扣款日不接受商量。",
        [C("relationships.partnerStatus", "eq", "partnered")],
        "你和伴侣轮流计算提前还款、换工作和孩子开支。计算器按一次清零，争执没有这个键。",
        "每月到日先划走固定一笔，剩下的钱才属于当月。屋里逐渐添满家具，账面仍保留大片空白。",
      ),
      effects: [add("resources.wealth", -3), add("resources.freedom", -4), add("resources.happiness", -3), add("relationships.family", -1)],
    },
    {
      id: "asset_and_home",
      title: "房子同时是家和账目",
      category: "wealth",
      yearRange: [1999, 2020],
      ageRange: [31, 76],
      minYears: 5,
      maxYears: 12,
      text: V(
        [C("resources.wealth", "gte", 64)],
        "房价上涨后，亲友常把你称作赶上时候。你仍保留最早的还款表，上面几个月份有反复擦写的痕迹。",
        [C("relationships.children", "gte", 1)],
        "孩子慢慢长大，把这套房当作家里的起点。你说先把生活过好，产权证仍锁在只有大人知道的抽屉里。",
        "多年以后，住房既是住处，也是家庭资产表上最大的一项。墙面重新刷过，债务留下的说话习惯却改得较慢。",
      ),
      effects: [add("resources.wealth", 5), add("resources.freedom", 3), add("relationships.family", 2)],
    },
  ],
});

const workUnitRetreat = makeChain("work_unit_retreat", {
  lifetimeProbability: 0.1,
  conditions: {
    all: [C("career.status", "eq", "employed")],
    any: [C("career.field", "in", ["state_unit", "factory", "public_sector", "township_enterprise"]), tagged("model_worker_aspiration")],
  },
  steps: [
    {
      id: "boundary_moves",
      title: "单位不再包办同样多的事情",
      category: "career",
      yearRange: [1978, 1998],
      ageRange: [20, 58],
      text: V(
        [C("career.field", "eq", "factory")],
        "厂里把奖金、住房和医疗重新核算，过去一句归单位管的事开始需要不同窗口。公告贴在食堂口，围观的人比吃饭的人多。",
        [C("meta.age", "gte", 45)],
        "你已习惯按工龄理解生活，新的考核却把最近几年单独计算。旧奖状仍挂在墙上，新表格只认本栏数字。",
        "单位缩回一部分福利，也放开一部分选择。你第一次发现自由和风险可以写在同一份通知里。",
      ),
      effects: [add("resources.wealth", -4), add("resources.freedom", 4), add("resources.happiness", -3)],
    },
    {
      id: "second_skill",
      title: "工牌以外还要学另一套本事",
      category: "career",
      yearRange: [1980, 2006],
      ageRange: [22, 66],
      minYears: 2,
      maxYears: 8,
      text: V3(
        [C("career.status", "in", ["none", "unemployed", "laid_off", "retired"])],
        "原来的岗位已经停下或离你远了，你还是去学一项能单独拿出来用的本事。报名表问现单位，你把那一栏空得很整齐。",
        [C("education.score", "gte", 58)],
        "你去夜校或培训班补一项新技能。白天的工牌放在书桌边，老师讲到市场时，教室里有人低声算起自己的年纪。",
        [C("resources.wealth", "lte", 38)],
        "家里等不起长期培训，你先做零活，再从零活里学会报价、找客和承担返工。第一张名片印得很省，电话倒没有错。",
        "你开始准备单位以外也能使用的技能。下班后的几个小时不计工龄，却慢慢决定以后靠什么吃饭。",
      ),
      effects: [add("education.score", 4), add("resources.health", -2), add("resources.wealth", 2), add("resources.achievement", 2)],
    },
    {
      id: "new_work_order",
      title: "职业不再只由一张工牌说明",
      category: "career",
      yearRange: [1985, 2018],
      ageRange: [27, 78],
      minYears: 5,
      maxYears: 12,
      text: V3(
        [C("career.status", "eq", "retired")],
        "退休以后，旧工牌成了柜里的物件，后来学会的本事却还在手上。邻里偶尔来请你帮忙，你先说不收钱，最后通常收下一袋水果。",
        [C("career.status", "eq", "self_employed")],
        "你后来靠自己接活，旧工牌仍留在柜子里。遇到难收的账时，你偶尔想念从前固定发薪的那一天。",
        [C("career.status", "in", ["none", "unemployed", "laid_off"])],
        "新技能没有立刻换来稳定工作，你在几种短工之间轮换。履历越写越长，连续的月份反而越来越少。",
        "多年后，你的工作由岗位、零活和熟人介绍共同组成。别人问你算哪一行，你通常先看这阵子在做什么。",
      ),
      effects: [add("resources.freedom", 3), add("resources.achievement", 3), add("resources.happiness", -1)],
    },
  ],
});

const portableBenefits = makeChain("portable_benefits", {
  lifetimeProbability: 0.1,
  conditions: {
    all: [C("career.status", "in", ["employed", "self_employed", "gig_worker"])],
    any: [C("location.migratedTimes", "gte", 1), tagIn("migrant_worker", "temporary_residence_memory", "construction_migrant")],
  },
  steps: [
    {
      id: "scattered_records",
      title: "几座城市各留着一段记录",
      category: "migration",
      yearRange: [2003, 2033],
      ageRange: [20, 63],
      text: V(
        [C("career.status", "eq", "gig_worker")],
        "平台订单遍布几座城，缴费记录却跟着不同合同分散。你能在手机上看到每一单，找齐保障记录反而要开几个页面。",
        [C("relationships.children", "gte", 1)],
        "工作和孩子的生活把一家人牵在两地，你几次调整登记。每次迁移都不算远，累计起来却把家庭资料分进了几套系统。",
        "工作换过城市，养老、医疗和居住记录分别留在原地。你用一个文件袋保存证明，袋子比最初厚了很多。",
      ),
      effects: [add("resources.freedom", -3), add("resources.wealth", -2), add("attrs.mental", 1)],
    },
    {
      id: "gap_appears",
      title: "几次迁移之间空出了一段保障",
      category: "health",
      yearRange: [2005, 2040],
      ageRange: [22, 70],
      minYears: 2,
      maxYears: 7,
      text: V3(
        [C("resources.health", "lte", 48)],
        "转接尚未完成时你正好需要看病。窗口让你先垫付，回家后那叠票据被夹进迁移证明中间。",
        [C("career.status", "eq", "self_employed")],
        "改做自雇后，一段缴费需要自己续上。收入好的月份容易记得，忙乱的月份会在多年后留下一个小缺口。",
        [C("career.status", "in", ["none", "unemployed", "laid_off", "retired"])],
        "离开原来的岗位后，你核对各地记录，才发现中间少了一段。人已经走完那几年，清单上的空白还停在原处。",
        "一次换城或换工使保障记录断开。系统提示稍后同步，稍后具体是哪一天，没有写。",
      ),
      effects: [add("resources.wealth", -5), add("resources.health", -2), add("resources.freedom", -3)],
    },
    {
      id: "records_join",
      title: "散开的年份终于接到一起",
      category: "migration",
      yearRange: [2010, 2052],
      ageRange: [27, 82],
      minYears: 5,
      maxYears: 12,
      text: V(
        [tagged("cross_region_medical_settlement_memory")],
        "跨地结算逐步打通，你第一次少带了几张证明去办事。工作人员仍提醒保留原件，语气像在向旧制度致敬。",
        [C("meta.age", "gte", 60)],
        "到了核对退休待遇的年纪，你把几地记录逐年核对。少掉的月份没有全部找回，至少终于知道空白具体在哪里。",
        "多地记录被接到同一份清单里，仍有几项需要人工确认。你把旧文件袋留着，没有急着扔。",
      ),
      effects: [add("resources.freedom", 6), add("resources.wealth", 3), add("resources.happiness", 2)],
    },
  ],
});

const platformLabour = makeChain("platform_labour", {
  lifetimeProbability: 0.1,
  conditions: {
    all: [C("career.status", "in", ["employed", "self_employed", "gig_worker"])],
    any: [C("career.status", "eq", "gig_worker"), C("career.field", "in", ["delivery", "ride_hailing", "ecommerce", "rural_ecommerce"])],
  },
  steps: [
    {
      id: "score_enters_shift",
      title: "分数开始安排一天的工作",
      category: "career",
      yearRange: [2012, 2034],
      ageRange: [18, 63],
      text: V(
        [C("career.field", "eq", "delivery")],
        "接单分数决定路线和时段，你先看倒计时再看地址。电梯慢了一层，系统只记录慢了多久。",
        [C("career.field", "in", ["ecommerce", "rural_ecommerce"])],
        "店铺流量按评分上下浮动，你每天先回复差评再处理货物。顾客睡了以后，排序仍在更新。",
        "工作被拆成订单、响应和评分，收入比从前灵活，休息也必须在系统不忙的时候发生。",
      ),
      effects: [add("career.income", 4), add("resources.wealth", 3), add("resources.freedom", -5), add("resources.health", -2)],
    },
    {
      id: "invisible_penalty",
      title: "没有处分通知，订单只是少了",
      category: "career",
      yearRange: [2013, 2040],
      ageRange: [19, 70],
      minYears: 1,
      maxYears: 5,
      text: V3(
        [C("career.status", "in", ["none", "unemployed", "laid_off", "retired"])],
        "你离开平台前那阵子，订单已经悄悄变少。账号后来不再接单，旧结算页仍没说明究竟是哪条规则先关了门。",
        [C("resources.reputation", "lte", 38)],
        "一次投诉后，你没有收到明确处分，订单却连续减少。客服说系统综合判断，这句话综合得找不到具体入口。",
        [C("resources.health", "lte", 45)],
        "你因身体不适少接几天单，恢复后排名已经下滑。系统欢迎你回来，欢迎语下面没有原来的任务。",
        "收入忽然变少，你翻遍规则和记录，只找到几处可能原因。每一处都不足以申诉，合起来足以改变这个月。",
      ),
      effects: [add("resources.wealth", -4), add("resources.happiness", -4), add("resources.freedom", -2)],
    },
    {
      id: "worker_counterlog",
      title: "劳动者也开始保存自己的记录",
      category: "career",
      yearRange: [2018, 2052],
      ageRange: [24, 82],
      minYears: 5,
      maxYears: 12,
      text: V3(
        [C("career.status", "in", ["none", "unemployed", "laid_off", "retired"])],
        "你离开平台以后，旧账号仍保留着。有人来问申诉办法，你把保存的记录一张张转过去。",
        [C("career.field", "notIn", ["delivery", "ride_hailing", "ecommerce", "rural_ecommerce"])],
        "你后来转去别的工作，旧结算页没有删。前同行来问某次扣款，你还能从一堆截图里翻出那年的规则。",
        [C("relationships.friendship", "gte", 50)],
        "你和同行共享路线、申诉截图和结算记录。群文件命名很乱，真出问题时却比客服更快找到旧规则。",
        "你开始为自己保存接单、工时和扣款记录。月底对账时，平台有一套数字，你也有一套。",
      ),
      effects: [add("resources.freedom", 5), add("resources.reputation", 2), add("relationships.friendship", 3)],
    },
  ],
});

const paidCare = makeChain("paid_care", {
  lifetimeProbability: 0.09,
  conditions: {
    all: [C("relationships.family", "gte", 28)],
    any: [C("meta.age", "gte", 48), tagIn("arc_family_care_burden", "eldercare_schedule_memory", "unpaid_care_work")],
  },
  steps: [
    {
      id: "service_enters_home",
      title: "照护第一次按小时进入家里",
      category: "family",
      yearRange: [2005, 2034],
      ageRange: [30, 76],
      text: V(
        [C("resources.wealth", "gte", 60)],
        "家中有人需要长期照护，你们开始购买陪诊、助浴或日间看护。服务单写得清楚，临时变化仍由家里人接住。",
        [C("location.currentCityTier", "in", ["village", "town"])],
        "村镇能找到的照护人员不多，你们按赶集和班车时间拼出服务。迟到半小时，常常意味着另一户也在等。",
        "家中的照护需求超过亲属能轮班的时间，你第一次按小时请人帮忙。陌生人进门前，双方都把钥匙和边界说了两遍。",
      ),
      effects: [add("resources.wealth", -5), add("resources.freedom", 4), add("relationships.family", 2)],
    },
    {
      id: "care_worker_turnover",
      title: "熟悉的人总在合同到期时离开",
      category: "health",
      yearRange: [2007, 2041],
      ageRange: [32, 83],
      minYears: 2,
      maxYears: 7,
      text: V(
        [C("resources.wealth", "lte", 40)],
        "费用上涨后，你们缩短服务时数。最需要耐心的时段被留给家人，账单倒比以前短了一截。",
        [C("relationships.family", "lte", 38)],
        "照护人员换了几次，每次都要重新介绍病史、脾气和夜里哪盏灯不能关。家人争执的内容也越来越像交接单。",
        "刚熟悉家庭习惯的照护者因工资或排班离开，新来的人重新记药盒和门锁。床边的人最先看出差别。",
      ),
      effects: [add("resources.wealth", -4), add("resources.happiness", -3), add("relationships.family", -2), add("resources.health", 1)],
    },
    {
      id: "hybrid_care_order",
      title: "照护变成家庭与服务之间的接力",
      category: "family",
      yearRange: [2012, 2053],
      ageRange: [37, 95],
      minYears: 5,
      maxYears: 12,
      text: V(
        [C("relationships.children", "gte", 1), C("meta.age", "gte", 58)],
        "家人把探望、付费服务和紧急联系人重新排好。孩子负责的事项不再叫有空顺便，而有了日期。",
        [C("resources.wealth", "gte", 65)],
        "稳定服务减轻了日常奔波，你们仍保留一名家属参与交接。付费可以买到时间，熟悉一个人仍要慢慢积累。",
        "几次更换后，家庭形成一套混合照护：专业人员做专业的事，亲属承担无法外包的陪伴。排班表仍会改，至少不再只写某一个人的名字。",
      ),
      effects: [add("resources.freedom", 5), add("relationships.family", 4), add("resources.happiness", 2)],
    },
  ],
});

const aiCredentials = makeChain("ai_credentials", {
  lifetimeProbability: 0.08,
  speculative: true,
  conditions: {
    all: [tagged("spec_ai_labor_audit")],
    any: [C("career.status", "in", ["employed", "self_employed", "gig_worker"]), C("meta.age", "lte", 30)],
  },
  steps: [
    {
      id: "task_audit",
      title: "岗位被拆成可证明的任务",
      category: "career",
      yearRange: [2037, 2078],
      ageRange: [18, 69],
      text: V3(
        [C("career.status", "eq", "gig_worker")],
        "平台要求劳动者证明哪些环节仍需本人承担。你录下一段完整工作，审核只截取其中三分钟。",
        [C("meta.age", "lte", 30)],
        "招聘入口把工作拆成一项项可认证的任务。你还没拿到新工牌，先要上传一段录像，证明自己会处理机器没学会的例外。",
        [C("education.score", "gte", 62)],
        "岗位审计把经验拆成若干可认证任务，你较快通过书面部分，现场判断仍要由同事签字。",
        "新的岗位说明列出机器能做的、必须由人复核的和出了错由谁解释的事项。你的名字先出现在最后一栏。",
      ),
      effects: [add("resources.freedom", -3), add("education.score", 2), add("resources.achievement", 2)],
    },
    {
      id: "credential_gap",
      title: "会做的事还要重新取得资格",
      category: "education",
      yearRange: [2039, 2085],
      ageRange: [20, 76],
      minYears: 2,
      maxYears: 7,
      text: [
        { conditions: W(C("career.status", "eq", "retired")), text: "退休后，旧行业仍发来资格更新。你本可不再理会，却还是把课程看完，像给做过多年的手艺补上一张迟到的说明。" },
        { conditions: W(C("career.status", "in", ["none", "unemployed", "laid_off"])), text: "为了进入或回到这一行，你先补齐新的资格。招聘页写着经验优先，上传材料时却没有一栏叫以前确实做过。" },
        { conditions: W(C("meta.age", "gte", 55)), text: "你做了多年的工作需要新证书才能继续。培训界面把基础操作讲得很慢，最后一题却问了从未在岗位出现的术语。" },
        { conditions: W(C("resources.wealth", "lte", 40)), text: "认证费用和停工时间一起出现，你先选较便宜的模块。证书允许分期取得，生活也只好分期暂停。" },
        { text: "旧经验没有失效，却必须经过新系统确认。你完成训练、录像和复核，等待状态持续了比课程更久。" },
      ],
      effects: [add("resources.wealth", -4), add("education.score", 4), add("resources.freedom", -3), add("resources.happiness", -2)],
    },
    {
      id: "human_liability_role",
      title: "一张新证书留下的后果",
      category: "career",
      yearRange: [2044, 2097],
      ageRange: [25, 88],
      minYears: 5,
      maxYears: 12,
      text: V3(
        [C("career.status", "eq", "retired")],
        "你后来离开岗位，资格记录仍按期提醒更新。真正留下来的不是证书本身，而是遇到同类事故时，你知道最后那一笔签名有多重。",
        [C("career.status", "in", ["none", "unemployed", "laid_off"])],
        "资格复核没有及时换来稳定岗位，你转向另一类工作。旧行业仍定期发来更新提醒，像一扇只剩通知的门。",
        [tagged("spec_human_liability")],
        "你取得资格后继续工作，每次自动流程结束仍要有人签字。系统处理了大部分步骤，责任栏只容得下一个姓名。",
        "新证书让你保住一部分岗位，也把复核和解释变成日常。过去靠经验默默完成的判断，现在必须留下可追责记录。",
      ),
      effects: [add("resources.achievement", 4), add("resources.reputation", 3), add("resources.freedom", -2)],
    },
  ],
});

const climateRelocation = makeChain("climate_relocation", {
  lifetimeProbability: 0.08,
  speculative: true,
  conditions: { any: [tagged("spec_heat_calendar"), tagged("spec_coastal_retreat"), tagged("extreme_heat_memory")] },
  steps: [
    {
      id: "move_notice",
      title: "住处开始按气候风险重新估价",
      category: "migration",
      yearRange: [2042, 2088],
      ageRange: [20, 83],
      text: [
        { conditions: W(tagged("spec_coastal_retreat")), text: "沿海旧居进入分期迁居范围。评估员量完墙高，又问家里谁需要就近照护。" },
        { conditions: W(C("career.status", "eq", "retired")), text: "连续高温或积水使住处进入风险名单。你先核对医院、助餐点和仍来往的亲友，再看哪一处安置房能让晚年的日常不被整套拆散。" },
        { conditions: W(C("meta.age", "gte", 65), C("career.status", "neq", "retired")), text: "气候风险使租约或旧房资格变得不再稳定。你先问医疗、买菜和往返旧社区的路，再问新地址；到了这个年纪，搬家最重的往往不是箱子。" },
        { conditions: W(C("meta.age", "lte", 64), C("career.status", "neq", "retired"), C("relationships.children", "gte", 1), C("relationships.youngestChildAge", "lte", 18)), text: "连续高温或积水使住处难以久留。你们先找能住的地方，再把工作路程、孩子上学和照护安排一项项接过去。" },
        { conditions: { all: [C("meta.age", "lte", 64), C("career.status", "in", ["employed", "self_employed", "gig_worker", "family_labor"])], any: [C("relationships.children", "lte", 0), C("relationships.youngestChildAge", "gte", 19)] }, text: "气候风险第一次写进住房合同。你把新住处放到工作路线和租金旁边反复比较，最后发现安全、通勤与付得起很少同时站在同一格。" },
        { conditions: W(C("resources.wealth", "lte", 42)), text: "连续高温或积水使住处难以久留。你先算押金、搬运和看病的路程；风险按地图分区，能搬到哪里仍由口袋划线。" },
        { text: "气候风险第一次写进住房合同。你在是否迁居一栏停了很久，开始核对钱、身体和离不开的人；楼下已经有人打包。" },
      ],
      effects: [add("resources.wealth", -8), add("resources.happiness", -5)],
    },
    {
      id: "new_ground_old_routes",
      title: "住处抬高了，旧生活还在低处",
      category: "family",
      yearRange: [2044, 2095],
      ageRange: [22, 90],
      minYears: 2,
      maxYears: 7,
      text: [
        { conditions: W(C("career.status", "eq", "retired")), text: "新社区避开主要风险，常去的医院、买菜处和老友却留在原处。你把班车时刻写在门后；退休后的生活没有通勤表，却同样经不起一条路突然变远。" },
        { conditions: W(C("meta.age", "gte", 65), C("career.status", "neq", "retired")), text: "搬到地势较高的住处后，医院、熟人和常走的路都远了。你学会在一次出门里办完几件事，搬迁带来的安全也开始按体力收费。" },
        { conditions: W(C("relationships.children", "gte", 1), C("relationships.youngestChildAge", "lte", 18)), text: "新住处避开主要风险，孩子的学校、你的活计和原来的照护关系却分在几条路上。搬家完成了，时间表每天仍在搬。" },
        { conditions: W(C("career.status", "in", ["employed", "self_employed", "gig_worker", "family_labor"])), text: "新住处避开主要风险，旧工作路线却没有一起抬高。你每天多走一段，把气候安全付成交通时间。" },
        { conditions: W(C("resources.wealth", "lte", 42)), text: "搬到风险较低且租金尚能承担的住处后，常去的市场和办事窗口都远了。每月住得稳一点，每天在路上多出一段。" },
        { text: "新住处避开主要风险，旧市场、亲友和常走的路仍在原来的方向。搬家完成了，生活关系没有一起装箱。" },
      ],
      effects: [
        add("resources.health", 3),
        add("resources.freedom", -4),
        add("relationships.friendship", -3),
        add("location.migratedTimes", 1),
        { addTag: "climate_resettled" },
      ],
    },
    {
      id: "second_hometown",
      title: "新地方慢慢长出第二套熟悉",
      category: "migration",
      yearRange: [2049, 2107],
      ageRange: [27, 102],
      minYears: 5,
      maxYears: 12,
      text: V(
        [tagged("spec_high_ground_home")],
        "高地社区逐渐有了市场、照护点和旧地名命名的街角。你仍说回原来那里，实际出发地点已经变了。",
        [C("relationships.friendship", "gte", 55)],
        "邻里把几次极端天气的应对流程做成熟人之间的默契。谁家有空房、谁能接老人，不必每次重新介绍。",
        "多年以后，新住处也积累了修过的门、认识的人和常走的路。旧家没有被替代，只是不再是唯一能说回去的地方。",
      ),
      effects: [add("relationships.friendship", 5), add("resources.freedom", 4), add("resources.happiness", 2)],
    },
  ],
});

const waterEnergyRights = makeChain("water_energy_rights", {
  lifetimeProbability: 0.08,
  speculative: true,
  conditions: { any: [tagged("spec_water_quota"), tagged("spec_microgrid"), tagged("spec_water_compact")] },
  steps: [
    {
      id: "household_share",
      title: "水和电都有了家庭份额",
      category: "wealth",
      yearRange: [2059, 2090],
      ageRange: [20, 86],
      text: V(
        [tagged("spec_water_quota")],
        "家庭账单开始同时显示用量与公共份额。洗衣机照常转，屏幕上的流域余量也跟着减少。",
        [C("location.currentCityTier", "in", ["village", "town"])],
        "村镇微网把灌溉、家用和公共设施列在同一张表上。夜里水泵启动前，群里先问有没有人正给老人用设备。",
        "水与能源不再只按价格结算，还要核对家庭份额。月底账单多了一页，冰箱没有因此少开一次门。",
      ),
      effects: [add("resources.wealth", -4), add("resources.freedom", -3), add("attrs.mental", 1)],
    },
    {
      id: "share_conflict",
      title: "同一份额里住着不同需要",
      category: "family",
      yearRange: [2061, 2097],
      ageRange: [22, 93],
      minYears: 2,
      maxYears: 7,
      text: V(
        [C("resources.health", "lte", 45)],
        "家里医疗与降温设备需要稳定供能，你提交额外份额证明。审核通过前，邻居先借来一块备用电源。",
        [C("relationships.children", "gte", 1)],
        "逢家人团聚，几代人的作息挤进同一份额。孩子晚间用设备、老人需要降温、厨房正开着火，第一次在表格上彼此争时间。",
        "份额够不够不再只是节省问题，还取决于谁在家、身体怎样、工作何时开始。你们把每日用量贴在门边。",
      ),
      effects: [add("relationships.family", -2), add("resources.happiness", -3), add("resources.health", -1)],
    },
    {
      id: "shared_reserve",
      title: "公共余量被做成一套邻里接力",
      category: "family",
      yearRange: [2066, 2109],
      ageRange: [27, 105],
      minYears: 5,
      maxYears: 12,
      text: V(
        [tagged("spec_microgrid")],
        "微网留出一小部分公共余量，谁家临时需要便由邻里确认。表决偶尔很慢，停电通常不等表决。",
        [tagged("spec_water_compact")],
        "社区屏幕开始同时显示上游放水时间和楼下储水箱余量。你第一次看懂这张图，是因为当天轮到自己值班。",
        "邻里把备用水、电和设备接口登记起来，形成一套不太漂亮却能运行的接力。纸质名单仍贴在值班柜里。",
      ),
      effects: [add("relationships.friendship", 5), add("resources.freedom", 4), add("resources.health", 2)],
    },
  ],
});

const digitalInheritance = makeChain("digital_inheritance", {
  lifetimeProbability: 0.08,
  speculative: true,
  conditions: {
    all: [C("relationships.family", "gte", 25)],
    any: [tagged("spec_digital_dead"), tagged("spec_memory_consent")],
  },
  steps: [
    {
      id: "access_list",
      title: "遗产清单里多出账户和记忆模型",
      category: "family",
      yearRange: [2077, 2092],
      ageRange: [35, 94],
      text: V(
        [tagged("spec_memory_consent")],
        "家人按逝者许可清点账户、订阅与记忆模型。允许访问和允许继续运行被分成两栏。",
        [C("education.score", "lte", 45)],
        "遗产服务给出很长的权限说明，你和家人轮流听语音版。听到永久保存时，所有人都暂停了一次。",
        "遗产清单除了房屋与存款，还列着数字身份和一套会回答问题的记忆模型。",
      ),
      effects: [add("resources.happiness", -4), add("resources.freedom", -2), add("relationships.family", 2)],
    },
    {
      id: "subscription_dispute",
      title: "悲伤也收到了一张服务账单",
      category: "wealth",
      yearRange: [2079, 2099],
      ageRange: [37, 101],
      minYears: 2,
      maxYears: 7,
      text: V3(
        [tagged("spec_simulation_ended")],
        "记忆模型关闭以后，档案保管和迁移仍寄来账单。家人这才发现，停止回答新问题，并不等于旧数据从此不占地方。",
        [C("resources.wealth", "lte", 42)],
        "记忆模型续费到期，家人讨论保留哪些月份的记录。费用表很清楚，谁来按下关闭却没有对应栏目。",
        [C("relationships.family", "lte", 38)],
        "亲属对是否继续运行模型意见不同。争执发生在线上会议里，逝者的模拟头像安静地等所有人说完。",
        "服务商发来续费与迁移选项，家人第一次需要决定哪些数字遗物继续说话，哪些只留下静态副本。",
      ),
      effects: [add("resources.wealth", -4), add("relationships.family", -3), add("resources.happiness", -3)],
    },
    {
      id: "finite_archive",
      title: "家庭留下了一份有限的数字遗产",
      category: "family",
      yearRange: [2084, 2111],
      ageRange: [42, 113],
      minYears: 5,
      maxYears: 12,
      text: V(
        [tagged("spec_simulation_ended")],
        "持续运行早已结束，家人按当时的决定只保留经同意的片段和原始文件。偶尔有人想重新开启，最终仍把手停在确认键前。",
        [C("relationships.family", "gte", 62)],
        "你们共同整理出一份有限档案，每个人都能补充说明，没人可以单独让模型继续说下去。",
        "多年争论后，家庭保留少量记录，其余转为不可自动生成的档案。模型不再回答新问题，旧声音仍能按日期找到。",
      ),
      effects: [add("resources.freedom", 4), add("relationships.family", 3), add("resources.happiness", 1)],
    },
  ],
});

const longevityStrata = makeChain("longevity_strata", {
  lifetimeProbability: 0.08,
  speculative: true,
  conditions: {
    all: [C("meta.age", "gte", 45)],
    any: [tagged("spec_longevity_treatment"), tagged("spec_public_longevity"), tagged("spec_age_dispute")],
  },
  steps: [
    {
      id: "eligibility",
      title: "更长寿命先成为一项资格",
      category: "health",
      yearRange: [2065, 2088],
      ageRange: [45, 90],
      text: V(
        [C("resources.wealth", "gte", 68)],
        "你较早进入延寿治疗评估。医生讲风险，财务顾问讲分期，两人的屏幕一样亮。",
        [C("resources.wealth", "lte", 40)],
        "公共治疗名额按健康与照护条件排序，你收到候补编号。编号每月更新，年龄也按同样速度增加。",
        "延长健康寿命先要通过资格评估。病历、家庭照护和支付能力出现在同一张摘要上。",
      ),
      effects: [add("resources.wealth", -5), add("resources.health", 4), add("resources.happiness", -2)],
    },
    {
      id: "long_middle_age",
      title: "中年被拉长，责任也跟着延长",
      category: "family",
      yearRange: [2068, 2096],
      ageRange: [48, 98],
      minYears: 3,
      maxYears: 8,
      text: V(
        [C("relationships.children", "gte", 1), C("meta.age", "gte", 65)],
        "你的健康年限变长，家庭开始重排继承、照护和谁先退休。孩子一边过自己的日子，一边等你把上一代的事情交代清楚。",
        [C("career.status", "in", ["employed", "self_employed"])],
        "身体还能工作，养老金和岗位年龄却多次调整。你保存了三个版本的退休计划，没有一个舍得删除。",
        "健康改善没有自动缩短责任期。照护上一代、帮助下一代和安排自己晚年，被放进更长的一段中年里。",
      ),
      effects: [add("resources.health", 3), add("resources.freedom", -4), add("relationships.family", -1)],
    },
    {
      id: "unequal_old_age",
      title: "同龄人的晚年开始相差一代",
      category: "health",
      yearRange: [2073, 2108],
      ageRange: [53, 110],
      minYears: 5,
      maxYears: 12,
      text: V(
        [tagged("spec_public_longevity")],
        "更多人能在社区医院续上基础治疗后，老友之间的健康差距缩小了一点。聚会仍有人早退，只是不再总是同一批人。",
        [C("resources.wealth", "gte", 70)],
        "你能继续购买维护治疗，旧同事中有人已经进入长期照护。通讯录年龄相近，见面所需的安排完全不同。",
        "多年后，同龄人的身体、工作和照护需求像隔开了一代。生日仍按同一年计算，生活阶段已经不再同步。",
      ),
      effects: [add("resources.health", 3), add("relationships.friendship", -2), add("attrs.mental", 1)],
    },
  ],
});

const regionalMutualAid = makeChain("regional_mutual_aid", {
  lifetimeProbability: 0.08,
  speculative: true,
  conditions: {
    any: [tagged("spec_high_ground_home"), tagged("spec_network_silence")],
  },
  steps: [
    {
      id: "old_boundary_fails",
      title: "住处和常去的地方分在几张名单上",
      category: "family",
      yearRange: [2057, 2090],
      ageRange: [24, 89],
      text: V(
        [tagged("spec_network_silence")],
        "网络停摆后，跨区生活的人发现救助名单只认居住地。你常去的街区和睡觉的街区各以为另一边会联系。",
        [tagged("spec_high_ground_home")],
        "迁居社区跨过旧边界，学校、医院和市场分属不同片区。地图只要缩小一点，生活就被切成几块。",
        "你住在一区，常去的医院、市场或照护点却在另一区。办一件日常小事时，几个窗口轮流问你究竟算哪边的人。",
      ),
      effects: [add("resources.freedom", -4), add("resources.happiness", -3), add("relationships.friendship", 2)],
    },
    {
      id: "mutual_route",
      title: "居民先画出一张能用的路线图",
      category: "migration",
      yearRange: [2059, 2097],
      ageRange: [26, 96],
      minYears: 2,
      maxYears: 7,
      text: V(
        [C("meta.age", "gte", 65)],
        "你和邻里把可换乘车辆、休息点和上门服务画在大字地图上。路线不最短，至少每一段都有人确认。",
        [C("location.currentCityTier", "in", ["village", "town"])],
        "几个村镇共享班车、照护点和备用电源，值班表贴在不同入口。名称不统一，电话号码相同。",
        "居民把跨区办事、送药和紧急住宿整理成一张实用路线图。正式地图边界清楚，这张图更关心门从哪边开。",
      ),
      effects: [add("resources.freedom", 4), add("relationships.friendship", 4), add("resources.reputation", 1)],
    },
    {
      id: "durable_network",
      title: "临时互助没有完全撤场",
      category: "family",
      yearRange: [2064, 2109],
      ageRange: [31, 108],
      minYears: 5,
      maxYears: 12,
      text: V(
        [C("relationships.friendship", "gte", 62)],
        "几年后，互助名单仍在更新。有人搬走、有人衰老，新名字写在旧名字旁边，没有另起一张漂亮的表。",
        [C("resources.wealth", "lte", 42)],
        "公共服务恢复后，居民仍保留共享车辆和备用房间。它们不够解决长期短缺，临时断口出现时却能先接一下。",
        "最初为一次危机建立的网络没有完全散去。正式服务覆盖到哪里，互助便退一步；覆盖不到的地方，值班电话仍有人接。",
      ),
      effects: [add("relationships.friendship", 5), add("resources.freedom", 3), add("resources.happiness", 2)],
    },
  ],
});

export const structuralPost1978ArcEvents = [
  ...mobilityAndReturn,
  ...housingDebt,
  ...workUnitRetreat,
  ...portableBenefits,
  ...platformLabour,
  ...paidCare,
  ...aiCredentials,
  ...climateRelocation,
  ...waterEnergyRights,
  ...digitalInheritance,
  ...longevityStrata,
  ...regionalMutualAid,
];
