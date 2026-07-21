// Two small structural arcs for the long texture-only stretches of childhood.
// Children meet rules and boundaries through repeated action rather than adult
// reflection.  Every continuation is automatic and remains inside ages 6—13.

const PREFIX = "child_arc_";
const add = (path, value) => ({ path, add: value });
const C = (path, operator, value) => ({ path, [operator]: value });
const between = (eventId, minYears, maxYears) => ({
  eventOccurredBetween: { eventId, minYears, maxYears },
});
const variant = (conditions, text) => ({ conditions: { all: conditions }, text });
const fallback = (text) => ({ text });

const rural = C("location.currentCityTier", "in", ["village", "town"]);
const urban = C("location.currentCityTier", "in", ["county", "city", "tier2", "tier1"]);
const oldEra = C("meta.currentYear", "lte", 1949);
const plannedStart = C("meta.currentYear", "gte", 1950);
const plannedEnd = C("meta.currentYear", "lte", 1977);
const reformStart = C("meta.currentYear", "gte", 1978);
const reformEnd = C("meta.currentYear", "lte", 2011);
const connected = C("meta.currentYear", "gte", 2012);
const student = C("education.status", "eq", "enrolled");
const lowMoney = C("resources.wealth", "lte", 38);
const comfortable = C("resources.wealth", "gte", 65);

function join(required, extra = {}) {
  return {
    all: [...required, ...(extra.all ?? [])],
    ...(extra.any ? { any: extra.any } : {}),
    ...(extra.none ? { none: extra.none } : {}),
  };
}

function childhoodChain(key, config) {
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
      .reduce((sum, laterStep) => sum + laterStep.maxYears, 0);
    return {
      id: ids[index],
      title: step.title,
      category: step.category ?? config.category,
      yearRange: [1840 + minElapsed, 2120 - remainingMax],
      ageRange: [config.ageRange[0] + minElapsed, config.ageRange[1] + maxElapsed],
      maxOccurrences: 1,
      baseWeight: index === 0 ? 26 : index === 1 ? 76 : 92,
      ...(index === 0 ? { lifetimeProbability: config.lifetimeProbability ?? 0.24 } : {}),
      ...(index === 0 ? { narrativeSafetyNet: true } : {}),
      ...(index > 0 ? { requiresEvents: [ids[index - 1]] } : {}),
      conditions: index === 0
        ? join([], config.conditions)
        : join([between(ids[index - 1], step.minYears, step.maxYears)], step.conditions),
      text: step.text,
      effects: [
        ...(step.effects ?? []),
        ...(next ? [{
          scheduleEvent: {
            eventId: ids[index + 1],
            delayYears: [next.minYears, next.maxYears],
            weightMultiplier: 8,
          },
        }] : []),
      ],
      narrativeTier: index === 0 ? "turning_point" : "consequence",
      narrativeDomain: `${PREFIX}${key}`,
      narrativeThread: next ? { expiresAfterYears: next.maxYears } : { close: true },
    };
  });
}

const peerRules = childhoodChain("peer_rules", {
  category: "relationship",
  ageRange: [6, 8],
  lifetimeProbability: 0.26,
  steps: [
    {
      id: "rule_appears",
      title: "一群孩子先定了玩法",
      text: [
        variant([oldEra, rural], "几个孩子在场边玩石子、草茎和一只旧布团。谁先来、谁守线、碰到哪块石头算输，全由嗓门最大的那个讲一遍。"),
        variant([oldEra, urban], "巷里孩子拿粉块画出几道线，墙根算家，石阶算河。卖货的车一来，整张地图便要抬脚让路。"),
        variant([plannedStart, plannedEnd, student], "课间有人拿粉笔分队，先到的孩子定下三条规矩。铃声响前只记住两条，第三条专在争起来时才有人想起。"),
        variant([plannedStart, plannedEnd, rural], "孩子们在晒场或路边凑出一场游戏，用砖头摆门，用树枝划线。大人经过时叫别挡路，大家便连门带线一起搬开。"),
        variant([plannedStart, plannedEnd], "院里几个孩子轮流跳格、拍球或追人。轮到谁由一串口令决定，念得太快的人总能给自己留个好位置。"),
        variant([reformStart, reformEnd, rural], "村路边的空地上，一只球和几块砖便够开场。球是谁带来的很清楚，规矩是谁改的却每个人都说不是自己。"),
        variant([reformStart, reformEnd, student], "操场边临时凑起两队，先挑人的孩子把名字一个个点过去。有人负责记分，记到自己队时字总写得格外大。"),
        variant([reformStart, reformEnd], "楼下或院里有人带来一件新玩具，围上来的孩子很快定好次序。大人只听见热闹，规则已经改了两回。"),
        variant([connected, lowMoney], "大家轮着用一只球、一个旧拍子或一台借来的小设备。东西不够一人一份，谁能玩多久便成了当天最要紧的规矩。"),
        variant([connected, student], "课间的玩法从一句谁来开始，很快多出分队、计时和不许耍赖。有人用手表计时，输的一方先说手表也会偏心。"),
        variant([connected, comfortable, urban], "小区活动地上器材齐全，孩子们仍拿水壶排出自己的边线。物业画的线很直，大家临时加的那条弯得更有用。"),
        fallback("几个孩子凑到一起，很快便有了先后、边线和谁来数数的规矩。没有人写下来，弄错的人立刻会被一齐纠正。"),
      ],
      effects: [add("relationships.friendship", 2), add("resources.freedom", -1), add("resources.happiness", 1)],
    },
    {
      id: "left_out",
      title: "有一回，线里没有你的位置",
      minYears: 1,
      maxYears: 2,
      text: [
        variant([lowMoney], "这回要各自带一样东西，你手里没有。别人已经开场，你在边上踢一颗小石子；石子倒很快加入了你的队。"),
        variant([oldEra, C("birth.gender", "eq", "female")], "你被叫回去送东西或看火，回来时原来的位置已经给了别人。你站在线外看了一阵，把散开的草绳重新卷好。"),
        variant([oldEra, rural], "几个人忽然说今天只算最早到的那几个。你来迟一步，只能替他们捡滚远的布团，捡回来时也没人暂停。"),
        variant([oldEra, urban], "巷里的队已经分完，有人说再加一个数就不好算。你坐在石阶上看他们来回跑，顺手把画歪的边线补直。"),
        variant([plannedStart, plannedEnd, student], "分队时名字点到你前面便停了。老师还没回来，谁也不肯重分；你替两边捡了几次球，仍旧不算哪一队。"),
        variant([plannedStart, plannedEnd], "院里的孩子说今天人已经够了。你在旁边替他们数数，数到输赢要紧处，两边又都说你刚才漏了一下。"),
        variant([reformStart, reformEnd, rural], "球是别人带来的，对方说这局先让熟的人玩。你蹲在砖门后面等，等到球滚进沟里，所有人才一起朝你这边喊。"),
        variant([reformStart, reformEnd, student], "两边挑人挑到最后，剩下你和另一个孩子。对方先被叫走，你负责拿外套；外套们没有一件表示反对。"),
        variant([connected, comfortable, urban], "约游戏的人漏掉了你的名字，语音里已经开局。你在楼下碰见其中一个，他盯着鞋尖说房间刚才正好满了。"),
        variant([connected, student], "课间的小队说名单昨晚已经定好，你没有看见那条消息。大家跑开以后，原地只剩一个忘记带走的水杯。"),
        variant([connected], "几个孩子说这一轮人数刚好，不再加人。你在边上等了一会儿，把滚来的球踢回去，力气用得比平常大一点。"),
        fallback("那天轮到你站在线外。里面的人忙着继续玩，没有谁专门解释；你在旁边磨了一会儿鞋底，直到大人喊人回家。"),
      ],
      effects: [add("relationships.friendship", -2), add("resources.happiness", -3), add("resources.freedom", -1)],
    },
    {
      id: "place_reopens",
      title: "空出来的位置又有人挪了一下",
      minYears: 2,
      maxYears: 3,
      text: [
        variant([lowMoney], "那件共用的东西坏了，你拿线、旧布或一截铁丝帮着修好。下一回开场时，有人把第一轮让给你，嘴上只说试试看牢不牢。"),
        variant([oldEra, rural], "一只布团掉到篱沟外，你从熟悉的小口绕过去捡回。再开场时，守线的人往旁边让了一步，刚好够多站一个。"),
        variant([oldEra, urban], "一场雨把巷里的粉线冲掉，大家只好重画。你拿着粉块补上最后一边，这回没有人再问你算不算里面。"),
        variant([plannedStart, plannedEnd, student], "有一队临时少了人，先前没有选中你的那个孩子朝你招手。你上场后只顾追球，旧账等到铃响也没来得及讲。"),
        variant([plannedStart, plannedEnd], "下一回数人头时，有人先把你算进去。口令仍念得飞快，你的位置却已经用一只脚踩住。"),
        variant([reformStart, reformEnd, rural], "球又滚到沟边，这回有人同你一起去捡。回来后两块砖往外挪了半步，门宽得足够大家都说自己进了球。"),
        variant([reformStart, reformEnd, student], "后来一次分队，那个总先挑人的孩子把你排在中间。你接住一球，旁边有人喊好，声音像什么也没发生过。"),
        variant([connected, student], "下一次课间，有人把名单往旁边添了一格。没有长篇道歉，只在开场前问你这回想守哪边。"),
        variant([connected], "后来有人重新发来一回邀请，后面补了一句还差一个。你进去时先检查人数，确实给你留着位置。"),
        fallback("过些日子，大家又缺一个人。有人朝你摆手叫快来，你跑过去接上那一轮；规矩没专门宣布改变，线却往外挪了一点。"),
      ],
      effects: [add("relationships.friendship", 5), add("resources.happiness", 3), add("resources.freedom", 2)],
    },
  ],
});

const nearbyBoundaries = childhoodChain("nearby_boundaries", {
  category: "daily",
  ageRange: [6, 8],
  lifetimeProbability: 0.25,
  steps: [
    {
      id: "route_map",
      title: "住处外面有了一张脚下的地图",
      text: [
        variant([oldEra, rural], "从家门到井边、场地和水沟，各有一条孩子常走的路。大人说深水边不能去，年长孩子又悄悄指出哪块石头踩着最稳。"),
        variant([oldEra, urban], "巷口、铺檐、井台和车马经过的街面被分成几段。你跟着熟人走过两回，记住哪处能停，哪处听见铃响要贴墙站。"),
        variant([plannedStart, plannedEnd, rural], "晒场、水渠、仓房和有机器声的院子围在住处附近。大人把不能进的地方指一遍，孩子们转身又给每处起了更好记的小名。"),
        variant([plannedStart, plannedEnd, urban], "家属院或街坊里，锅炉房、车棚和大门口各有规矩。你跟着大孩子走，学会见到运货车先站上哪一级台阶。"),
        variant([reformStart, reformEnd, rural], "村路、池塘、变压器和新盖的屋地连在一起。大人说离远点，孩子们则用一棵歪树和两块红砖记住界线。"),
        variant([reformStart, reformEnd, urban], "楼下空地、存车处和施工围挡拼成每天经过的路线。哪扇门会锁、哪处雨后积水，你跟着别的孩子走几回便记住。"),
        variant([connected, lowMoney], "家里地方不宽，楼道、门前和附近空地便多装了一些日常。你认得哪里能坐一会儿，也认得哪块地方一来车就必须让开。"),
        variant([connected, rural], "村路、鱼塘和快递车停靠的空地各占一边。你记住狗常趴在哪家门口，也记住电动车拐弯时听不见脚步。"),
        variant([connected, comfortable, urban], "小区里有活动地、车库坡道和刷卡门。标牌写得很全，孩子们最先记住的仍是哪扇门关得快，哪处保安会帮忙捡球。"),
        variant([connected, urban], "楼门、便利店、车库口和一块能玩的空地连成短短一圈。你跟着走了几遍，开始不用每个转角都等大人指方向。"),
        fallback("住处附近有几处能去、几处要绕、几处只能跟着大人经过。你走过几回，用门、树和墙角把它们一一记住。"),
      ],
      effects: [add("resources.freedom", 2), add("relationships.friendship", 1), add("attrs.mental", 1)],
    },
    {
      id: "danger_close",
      title: "有一处危险忽然靠得很近",
      minYears: 1,
      maxYears: 2,
      text: [
        variant([oldEra, rural], "你在沟边踩松一块湿土，脚一下滑到水沿。手先抓住草根，同行的孩子再抓住你衣角；回家时半边裤腿先替你招了供。"),
        variant([oldEra, urban], "一辆车从巷口转进来，你听见铃才退到墙边。车轮擦着画线过去，地上的石子被压得比刚才老实许多。"),
        variant([plannedStart, plannedEnd, rural], "你追着东西跑到水渠或机具旁，忽然被一声喝住。停下后才看见脚前那处缺口，回去一路谁都没有再跑。"),
        variant([plannedStart, plannedEnd, urban], "运货车倒进院时，你正从车棚后面钻出来。司机按响喇叭，大人把你拉到一边；当天所有孩子都被重新指了一次该站的线。"),
        variant([reformStart, reformEnd, rural], "路边一辆车来得比平常快，你退进土坡，鞋陷掉一只。车过去后大家先找鞋，找到才想起一起骂那辆车。"),
        variant([reformStart, reformEnd, urban], "围挡后的一处坑被雨水盖住，你一脚踩进浅边，膝盖磕了一下。同行的孩子扶你出来，还把那根松动的挡板重新靠好。"),
        variant([connected, lowMoney], "楼道或路边有一盏灯坏了，你没看清台阶，脚下一空坐了下去。伤不重，手里的东西滚得很远，邻居替你追回两样。"),
        variant([connected, rural], "一辆安静的电动车从转角出来，你听见喊声才停脚。车也刹住了，骑车的人和你同时说了句你慢一点。"),
        variant([connected, urban], "你从车库坡道旁经过，一辆车的灯先照到墙上。带你的人把你拽回门后，从此经过那里先看墙上的亮光。"),
        fallback("你在熟路上多跑了两步，危险便突然挨到眼前。有人把你拉住，事情没有变大；那处墙角或路口却从此不再只是个名字。"),
      ],
      effects: [add("resources.health", -2), add("resources.happiness", -2), add("resources.freedom", -1)],
    },
    {
      id: "safe_route",
      title: "后来你知道该从哪一边绕",
      minYears: 2,
      maxYears: 3,
      text: [
        variant([oldEra, rural], "沟边后来垫了石头或插上一根显眼木棍。你仍从那里经过，每次先踩最干的那块，后面的孩子便照着你的脚印走。"),
        variant([oldEra, urban], "街坊在拐角放了能看见来车的物件，又嘱咐车马经过时先喊一声。你贴墙等铃，等车过去再把刚才的游戏接上。"),
        variant([plannedStart, plannedEnd, rural], "那处缺口被填了一些，机具旁也多出一道不许越过的线。孩子们照旧在附近玩，只把砖门搬到了线的这一边。"),
        variant([plannedStart, plannedEnd, urban], "院里重新划了行车和走人的边线。大人画得方方正正，孩子们走了几天，已经踩出一条稍微弯些的安全近路。"),
        variant([reformStart, reformEnd, rural], "路边添了一块醒目的标记，大家也约好见车先退到土坡里。你的那只鞋刷干净后，仍留下一个颜色较深的圈。"),
        variant([reformStart, reformEnd, urban], "松掉的围挡被重新固定，积水旁垫了几块砖。你再经过时没有绕很远，只一步步踩着干处走。"),
        variant([connected, lowMoney], "坏灯有人报修，亮起来前，邻居先在台阶边贴了一条浅色胶带。你每次跨过那条线，仍会低头确认一下。"),
        variant([connected, rural], "转角处多了一块慢行牌，孩子们也不再贴着路中间追逐。牌子偶尔被风吹歪，总有人路过时把它扶正。"),
        variant([connected, comfortable, urban], "车库口加了反光镜和一道停步线。你学会先从镜里找车，也学会镜里那个探头探脑的小孩正是自己。"),
        variant([connected, urban], "坡道口多了提示灯，同行的人也固定从门内一侧绕。路线只多几步，跑到空地以后没有谁还记得抱怨。"),
        fallback("那处危险后来有了标记、垫脚或一条绕开的路。你仍在住处附近来回，只是每到那里便慢一下，再从熟悉的那一边过去。"),
      ],
      effects: [add("resources.health", 2), add("resources.freedom", 3), add("relationships.friendship", 2)],
    },
  ],
});

export const structuralChildhoodArcEvents = [
  ...peerRules,
  ...nearbyBoundaries,
];
