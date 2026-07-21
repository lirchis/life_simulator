// Three-stage structural arcs for ordinary midlife.
//
// Openings are available from age 27 to 56. Scheduled continuations add at
// most eight years, so every authored chain remains reachable by age 64 and
// by the repository's 2120 time boundary. Later stages deliberately depend
// only on the previous event and elapsed time: a job, marriage or household
// may change after the opening without silently breaking an unfinished story.

const PREFIX = "struct_midlife_";
const ACTIVE = ["employed", "self_employed", "gig_worker", "family_labor"];
const INACTIVE = ["none", "unemployed", "laid_off", "retired"];
const RURAL = ["village", "town"];
const URBAN = ["county", "city", "tier2", "tier1"];

const add = (path, value) => ({ path, add: value });
const C = (path, operator, value) => ({ path, [operator]: value });
const between = (eventId, minYears, maxYears) => ({
  eventOccurredBetween: { eventId, minYears, maxYears },
});
const V = (conditions, text, weight = 1) => ({ conditions: { all: conditions }, text, weight });
const F = (text) => ({ text });

const before1949 = C("meta.currentYear", "lte", 1949);
const plannedYears = [C("meta.currentYear", "gte", 1950), C("meta.currentYear", "lte", 1977)];
const reformYears = [C("meta.currentYear", "gte", 1978), C("meta.currentYear", "lte", 2011)];
const connectedYears = C("meta.currentYear", "gte", 2012);
const rural = C("location.currentCityTier", "in", RURAL);
const urban = C("location.currentCityTier", "in", URBAN);
const lowMoney = C("resources.wealth", "lte", 38);
const comfortable = C("resources.wealth", "gte", 68);
const working = C("career.status", "in", ACTIVE);
const inactive = C("career.status", "in", INACTIVE);
const formalWorker = C("career.field", "in", [
  "factory", "state_unit", "public_sector", "professional", "teacher",
  "education", "healthcare", "doctor", "nurse", "grassroots_post",
]);
const informalWorker = C("career.status", "in", ["self_employed", "gig_worker", "family_labor"]);
const hasChildren = C("relationships.children", "gte", 1);
const noChildren = C("relationships.children", "lte", 0);
const partnered = C("relationships.partnerStatus", "in", ["partnered", "married"]);
const female = C("birth.gender", "eq", "female");
const migrated = C("location.migratedTimes", "gte", 1);

function join(required, extra = {}) {
  return {
    all: [...required, ...(extra.all ?? [])],
    ...(extra.any ? { any: extra.any } : {}),
    ...(extra.none ? { none: extra.none } : {}),
  };
}

function schedule(eventId, minYears, maxYears) {
  return {
    scheduleEvent: {
      eventId,
      delayYears: [minYears, maxYears],
      weightMultiplier: 24,
    },
  };
}

function midlifeArc(key, config) {
  const ids = config.steps.map((step) => `${PREFIX}${key}_${step.id}`);
  let minElapsed = 0;
  let maxElapsed = 0;

  return config.steps.map((step, index) => {
    if (index > 0) {
      minElapsed += step.minYears;
      maxElapsed += step.maxYears;
    }
    const next = config.steps[index + 1];
    const remainingMax = config.steps.slice(index + 1)
      .reduce((total, later) => total + later.maxYears, 0);
    const dependencies = index === 0
      ? []
      : [between(ids[index - 1], step.minYears, step.maxYears)];

    return {
      id: ids[index],
      title: step.title,
      category: step.category ?? config.category,
      yearRange: [1840 + minElapsed, 2120 - remainingMax],
      ageRange: [27 + minElapsed, Math.min(64, 56 + maxElapsed)],
      maxOccurrences: 1,
      baseWeight: index === 0 ? 26 : index === 1 ? 84 : 104,
      ...(index === 0 ? { lifetimeProbability: config.lifetimeProbability } : {}),
      ...(index === 0 ? { narrativeSafetyNet: true } : {}),
      ...(index > 0 ? { requiresEvents: [ids[index - 1]] } : {}),
      conditions: index === 0
        ? join([], config.conditions)
        : join(dependencies, step.conditions),
      text: step.text,
      effects: [
        ...(step.effects ?? []),
        ...(next ? [schedule(ids[index + 1], next.minYears, next.maxYears)] : []),
        { addTag: `${PREFIX}${key}` },
        { addTag: `${ids[index]}_seen` },
      ],
      narrativeTier: index === 0 ? "turning_point" : "consequence",
      narrativeDomain: `${PREFIX}${key}`,
      narrativeThread: next
        ? { expiresAfterYears: next.maxYears + 1 }
        : { close: true },
    };
  });
}

const familyDutyRedistribution = midlifeArc("family_duty", {
  category: "family",
  lifetimeProbability: 0.18,
  conditions: { all: [C("relationships.family", "gte", 24)] },
  steps: [
    {
      id: "load_moves",
      title: "家里的担子换了肩膀",
      text: [
        V([before1949, rural], "家里忽然少了一双能按旧例做事的手。你接过跑集、照看牲口和几件往来，不是因为谁郑重托付，只因第二天照样要开门生火。"),
        V([before1949, urban], "家中一人病了、远行或暂时失去生计，铺面、家务和亲戚间的口信便挪到你手上。没有交接簿，少做一件，当晚就会有人想起。"),
        V([hasChildren], "接送、看病和家中几项固定开支重新排过，原先偶尔搭手的事渐渐成了你的一份。孩子只知道今天谁来，大人还要知道为什么总是这个谁。"),
        V([female, working], "家中缺人手后，亲戚先问你能不能调开时间，仿佛挣钱的钟和照料的钟只在女人这里可以叠放。你先接住了事，也记下这句默认。"),
        V([lowMoney], "家里无钱长期请人，能做的事只好在现有几双手之间重分。你多接一份，省下的是钱，花掉的是别人看不见的时辰。"),
        F("家里一桩持续的事换了人承担，你被推到前面。没有仪式，也没有谁说从此归你；事情只是连续几次都在同一时辰来敲门。"),
      ],
      effects: [add("relationships.family", 1), add("resources.freedom", -4), add("resources.happiness", -1), add("attrs.mental", 1)],
    },
    {
      id: "default_person",
      title: "临时帮忙长成了固定分工",
      minYears: 1,
      maxYears: 3,
      text: [
        V([before1949, rural], "又过几个忙季，谁去赶集、谁照看病人、谁替晚归的人留饭，家里已经不再开口商量。旧规矩没有明说，倒很会借沉默续订。"),
        V([before1949, urban], "家中再遇急事，大家自然把钥匙、账目或跑腿的活递给你。你接得熟，旁人便把熟练误认成有空。"),
        V([noChildren], "没有孩子替家事自动排出下一代人手，亲属与朋友的帮助更需要逐次商量。你最累的不是无人帮，而是每次都得先解释这不是一回性的难处。"),
        V([female], "亲友夸你细心可靠，夸奖说完，新的陪诊和张罗又落到你手上。好名声若只兑换成更多活，听久了也有一点像欠条。"),
        V([inactive], "原来的工作停下后，家里更容易把你的时间算作空白。你确实少了班表，却没有因此多出一副身体。"),
        F("临时分工做久了，家里开始默认那件事由你完成。你偶尔晚一次，所有人才发现所谓顺手，原来一直有具体的人在伸手。"),
      ],
      effects: [add("relationships.family", -2), add("resources.freedom", -3), add("resources.health", -1), add("attrs.mental", 1)],
    },
    {
      id: "work_named",
      title: "把谁做什么重新说清",
      minYears: 2,
      maxYears: 5,
      text: [
        V([before1949], "一次忙乱后，你把各人能做的事当面说开。没有人使用分工这个新鲜词，只把赶集、守夜、做饭和出钱逐件安到姓名上。"),
        V([rural], "家里把远路、重活和每天不能缺的零碎重新分过。牲口不参加商量，却用准时叫唤帮助会议尽快有了结论。"),
        V([urban], "你们在一张纸上记下谁跑手续、谁照看、谁出哪一笔钱。纸写得冷，倒比一句一家人别计较更肯承认各人的时辰。"),
        V([hasChildren], "你没有把家事顺手推给渐渐长大的孩子，而是先让成年人把自己的那份认领。懂事可以是品格，不该是最年轻的人默认接班。"),
        V([noChildren], "你同亲属和可信的朋友把能帮到哪一步说清。没有下一代并不等于没有照应，只是照应不能靠一个含糊称谓自动运行。"),
        F("后来你们把这件长期家事拆开重分。仍有人迟到，也仍会争，但再没有谁能把持续劳动说成某个人恰好比较会做。"),
      ],
      effects: [add("relationships.family", 5), add("resources.freedom", 5), add("resources.happiness", 2), add("resources.health", 1)],
    },
  ],
});

const neighborReciprocity = midlifeArc("neighbor_ledger", {
  category: "relationship",
  lifetimeProbability: 0.17,
  conditions: { all: [C("relationships.friendship", "gte", 16)] },
  steps: [
    {
      id: "borrowed_hands",
      title: "急处借来几双手",
      text: [
        V([before1949, rural], "家里赶上一场急事，邻里有人替你看火、收晒物，又有人赶来搭把肩。谁也没写借据，临走只说往后有事叫一声。"),
        V([before1949, urban], "住处或铺里临时出了难处，同巷的人借来梯子、灯和一阵人手。梯子还回去时多缠了一圈绳，算是这笔人情先付的一点利息。"),
        V([lowMoney], "你拿不出钱雇人，只能向熟人开口。几个人各抽一点时间，竟把一件原本办不起的事抬了过去；窘迫被分小以后，也能暂时搬动。"),
        V([migrated], "你在新住处遇到急事，先来帮忙的是几个还叫不全名字的邻居。异乡第一次不像地址，而像有人知道你那扇门为什么一直开着。"),
        V([connectedYears], "群里一句求助很快有人回应，真正到场的仍是住得近、手上恰好有工具的人。消息走得快，重物最后还是按旧办法由肩膀解决。"),
        F("一件急事靠邻里几双手才办过去。散场时大家说小事，只有你知道，若少其中任何一个人，那天都会长出另一副样子。"),
      ],
      effects: [add("relationships.friendship", 4), add("resources.freedom", 2), add("resources.wealth", 1), add("resources.reputation", 1)],
    },
    {
      id: "favor_returns",
      title: "人情到了还的时候",
      minYears: 1,
      maxYears: 3,
      text: [
        V([before1949, rural], "后来邻家遇上农忙、病事或一趟远路，来人没有提旧账，只在门口问你今日能不能腾手。那句能不能很客气，旧人情却已经坐进屋里。"),
        V([before1949, urban], "同巷的人来借工具又请你帮半日。你原有的活只得往后挪，借出去的锤子当天回来，你的时辰没有这么方便的归还日期。"),
        V([working], "邻里来求助时，你正赶自己的活。你仍挤出一段时间，也第一次明白互相搭手若总由最可靠的人请假，账会慢慢偏向一边。"),
        V([comfortable], "这回你本可以花钱解决，仍亲自去帮了一阵。人情不是穷日子的替代货币；有余力的人若只负责付款，来往也会渐渐只剩收据。"),
        V([lowMoney], "回人情要误工，你把一天拆成两半，先去帮忙，再赶自己的活。两头都没有完全做好，倒把成年人的分身术练得很诚实。"),
        F("过了一阵，曾帮过你的人开口了。你把原来的安排挪开去搭手；人情没有催款日，却常挑最忙的一天提醒自己仍在账上。"),
      ],
      effects: [add("relationships.friendship", 2), add("resources.freedom", -3), add("resources.health", -1), add("resources.wealth", -1)],
    },
    {
      id: "different_return",
      title: "这笔账没有还成同一样东西",
      minYears: 2,
      maxYears: 5,
      text: [
        V([before1949], "几年里你们互相借过人手、物件和口信，早已说不清哪一回抵哪一回。有人硬要算平，算到最后先欠算盘一声叹气。"),
        V([rural], "你后来没能原样还那次帮忙，只在别家需要时又搭了一把手。乡里的人情不总走直线，绕一圈仍可能回到原来的院门。"),
        V([urban], "几户人约定急事先在近处互相照看，不再每次追问旧账是谁欠谁。楼道仍会争杂物放哪，真正有事时，门却比从前开得快。"),
        V([migrated], "你搬过一次地方，仍同旧邻保持联系，也把受过的帮助转给新来的人。人情没有跟着户口迁移，倒学会了换一个收件人。"),
        V([lowMoney], "你们都不宽裕，回报常是一顿饭、一趟跑腿或替人守半日。东西不等价，肯把自己的时辰拿出来，已经足够准确。"),
        F("后来这笔人情没有按原样还清，而是在几次互相搭手中失去边界。欠与不欠终于不那么重要，谁总在出力却仍值得被看见。"),
      ],
      effects: [add("relationships.friendship", 5), add("resources.reputation", 3), add("resources.happiness", 2), add("resources.freedom", 1)],
    },
  ],
});

const skillAndToolChange = midlifeArc("tool_change", {
  category: "career",
  lifetimeProbability: 0.19,
  conditions: { all: [working] },
  steps: [
    {
      id: "new_tool",
      title: "旧手艺碰上了新工具",
      text: [
        V([before1949, rural], "附近添了一件改过的农具或加工器具，做法同你熟悉的不完全一样。它省下一段蛮力，也要求先承认手里的老办法并非处处最好。"),
        V([before1949, urban], "铺里或工场换来一件新器具，齿轮、标尺或踏板同旧活接在一起。老师傅先嫌它娇气，开工后又最先听出哪里响得不对。"),
        V([...plannedYears, formalWorker], "岗位添了新设备或新流程，说明贴在墙上，真正开动时仍围着几个人。机器按统一规格来，旧经验负责指出统一规格漏掉的那一声怪响。"),
        V([...reformYears, informalWorker], "进货、记账或接活换了新工具，你先借别人的试用。它确实省事，也顺便发明了几种从前没有的新差错。"),
        V([connectedYears], "常做的活换了软件、设备或一套新步骤。界面说上手容易，你在第三层菜单里第一次认真怀念一把有柄的工具。"),
        F("你熟悉的活换了一件关键工具。手上的经验没有失效，却忽然需要翻译成另一套动作；做得越久的人，第一天反而越像新手。"),
      ],
      effects: [add("career.level", -1), add("resources.achievement", -1), add("resources.health", -1), add("attrs.intelligence", 1)],
    },
    {
      id: "awkward_learning",
      title: "熟练忽然变得有些笨拙",
      minYears: 1,
      maxYears: 3,
      text: [
        V([before1949, rural], "新器具第二次卡住时，你不再只怪它不中用，蹲下把每处接合重新摸过。旁边年轻人力气足，你知道哪一声意味着再使劲就要赔钱。"),
        V([before1949, urban], "你照旧手势做错一回，只得拆开返工。学徒想笑又忍住，后来轮到他装反零件，你们便都有了保持体面的理由。"),
        V([lowMoney], "学新工具要耗材料和停工，你舍不得专门练，只能在每单活的边角试一点。贫穷使学习没有草稿纸，错误直接写在成本上。"),
        V([inactive], "原来的工作已经停下，工具的变化却没有等你。再碰这门活时，你先承认有几步不会；旧熟练放低身段以后，反而留下能接回去的地方。"),
        V([formalWorker], "培训讲得很快，考核表填得更快。真正回到岗位，你同几位同事把最容易出错的步骤另写一张纸，贴得比正式说明更低，也更常被看见。"),
        F("你有一阵做得比从前慢，还犯了一个年轻时不会犯的错。难堪没有提供技术帮助，只逼你把每一步重新问明白。"),
      ],
      effects: [add("career.level", 2), add("resources.achievement", 2), add("resources.happiness", -1), add("resources.health", -1)],
    },
    {
      id: "skill_translated",
      title: "手艺留下来，姿势换了",
      minYears: 2,
      maxYears: 5,
      text: [
        V([before1949], "后来你已能把新器具同旧手艺接起来。别人问诀窍，你没有说全凭手感，而是把哪处要听、哪处要慢，一项项指出。"),
        V([rural], "新工具替你省下一些力气，地里的判断仍要看天、看土、看一季留下的毛病。机器学会走直线，你负责知道什么时候不该直走。"),
        V([urban], "你把旧经验改成新流程能用的次序，也保留一两步人工复核。效率涨了，返工少了；唯一失业的是从前那句我一直这么做。"),
        V([inactive], "你未必回到原来的岗位，却把新旧两套做法讲给后来的人。职业可以中断，做过多年才有的分寸不必跟着工牌一起失效。"),
        V([connectedYears], "你终于不再同新工具争谁更聪明，只把它擅长的交给它，把需要判断的留给人。合作谈不上浪漫，至少错误开始各有负责人。"),
        F("几年后，新工具已经用熟，旧手艺也没有被整件丢掉。你留下的本事不再是某个固定动作，而是知道工具换了以后，哪一处仍不能马虎。"),
      ],
      effects: [add("career.level", 4), add("resources.achievement", 5), add("resources.reputation", 2), add("resources.freedom", 1)],
    },
  ],
});

const UnglamorousCompromise = midlifeArc("plain_compromise", {
  category: "wealth",
  lifetimeProbability: 0.15,
  conditions: {
    any: [
      C("resources.wealth", "lte", 58),
      working,
      C("relationships.family", "gte", 36),
    ],
  },
  steps: [
    {
      id: "terms_accepted",
      title: "先答应一个不好看的条件",
      text: [
        V([before1949, rural], "为解眼前急用，你答应把下一季的一部分收成先按较低价抵出去。纸据写得干净，田还没有发芽，未来已经少了一截。"),
        V([before1949, urban], "活计难找，你接下一份工钱偏低、时辰又长的差事。掌柜说先做着看，你知道被看的多半是你能忍多久。"),
        V([lowMoney], "一笔开销已经等在门口，你接受了并不划算的价钱、借款或安排。脸面先放到一边，脸面对此没有发表建设性意见。"),
        V([working], "为了保住收入或腾出家中需要的时间，你接下一个不喜欢的班次、价码或分工。你没有称它为选择，只先问这个月能不能过完。"),
        V([comfortable], "你托熟人通融一件本可按规矩慢慢办的事。事情快了，感谢也说得周全；回家以后，那份轻松里仍夹着一点不愿细看的便宜。"),
        F("现实把几项都不体面的办法摆在面前，你选了其中尚能承受的一项。事情先过了关，自尊没有碎，只在角上留下一个不便展示的折痕。"),
      ],
      effects: [add("resources.wealth", 4), add("resources.freedom", -4), add("resources.happiness", -2), add("attrs.mental", 1)],
    },
    {
      id: "cost_reappears",
      title: "省下的难处换个地方回来",
      minYears: 1,
      maxYears: 3,
      text: [
        V([before1949, rural], "收成或工钱到手时，先前答应的那一份被直接扣走。急事早已过去，代价却按节气准时回来，像一个记性过好的远亲。"),
        V([before1949, urban], "低价和长工时渐渐被当成原本如此。你想重谈，东家先夸你做得熟；赞许绕了一圈，恰好没有经过钱袋。"),
        V([hasChildren], "那次让步保住了家里一段安稳，也使你连续错过几次该在场的时刻。孩子没有替你总结牺牲，只记得哪天门开得很晚。"),
        V([working], "临时接受的班次或分工成了惯例，别人排日程时已经不再问你。一次妥协最擅长的本事，是把自己改名叫一直如此。"),
        V([inactive], "原来的工作或安排已经结束，那次妥协留下的欠款、人情或身体疲惫却没有同时离场。事情翻篇很快，账页通常慢一些。"),
        F("过了一阵，当初省下的难处从另一处回来：少一点钱、少一点时间，或多一份别人默认你会继续承受的安排。"),
      ],
      effects: [add("resources.wealth", -2), add("resources.freedom", -2), add("resources.happiness", -3), add("resources.health", -1), add("attrs.mental", 1)],
    },
    {
      id: "boundary_kept",
      title: "把那次让步留成一条界线",
      minYears: 2,
      maxYears: 5,
      text: [
        V([before1949], "下一回相似条件再来时，你先把价钱、期限和谁承担损失问清。未必因此占到便宜，至少不再让含糊替别人多拿一份。"),
        V([rural], "你后来留下一点粮钱、替手或退路，不让每场急事都只能预支下一季。储备很小，足够使一句再等等不再完全由别人解释。"),
        V([urban], "你把价码和时辰在开工前说清，也肯放掉一桩明显不合算的活。门关上时仍会心疼，走回去的脚步倒比从前完整。"),
        V([working], "你没有把那次妥协改写成励志故事，只在后来谈条件时多问一句：临时到哪天为止。边界不响亮，胜在能写进日历。"),
        V([noChildren], "没有子女替未来兜底，你更早把能退到哪里算清，也同可信的亲友讲明紧急时怎样互相搭手。谨慎不是悲观，是不让下一次急事代替你作全部决定。"),
        F("后来你没有否认那次不体面的让步，也没有继续用它要求自己凡事忍下去。它最终留下的不是教训二字，而是一条下回会提前说出的界线。"),
      ],
      effects: [add("resources.freedom", 5), add("resources.happiness", 3), add("resources.wealth", 1), add("attrs.mental", 1)],
    },
  ],
});

export const structuralMidlifeArcEvents = [
  ...familyDutyRedistribution,
  ...neighborReciprocity,
  ...skillAndToolChange,
  ...UnglamorousCompromise,
];
