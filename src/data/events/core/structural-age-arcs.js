// Structural arcs for ages that often fell into long runs of texture-only
// events. These are ordinary changes in duty, privacy, body, friendship and
// household knowledge. They work across eras by selecting text from the
// character's current year, place and state; none asks the player to choose.

const PREFIX = "age_arc_";
const add = (path, value) => ({ path, add: value });
const set = (path, value) => ({ path, set: value });
const C = (path, operator, value) => ({ path, [operator]: value });
const between = (eventId, minYears, maxYears) => ({ eventOccurredBetween: { eventId, minYears, maxYears } });
const variant = (conditions, text) => ({ conditions: { all: conditions }, text });
const fallback = (text) => ({ text });

const rural = C("location.currentCityTier", "in", ["village", "town"]);
const urban = C("location.currentCityTier", "in", ["county", "city", "tier2", "tier1"]);
const early = C("meta.currentYear", "lte", 1949);
const connected = C("meta.currentYear", "gte", 2012);
const lowMoney = C("resources.wealth", "lte", 38);
const weakHealth = C("resources.health", "lte", 45);
const student = C("education.status", "eq", "enrolled");
const working = C("career.status", "in", ["employed", "self_employed", "gig_worker", "family_labor"]);

function join(required, extra = {}) {
  return {
    all: [...required, ...(extra.all ?? [])],
    ...(extra.any ? { any: extra.any } : {}),
    ...(extra.none ? { none: extra.none } : {}),
  };
}

function ageArc(key, config) {
  const ids = config.steps.map((step) => `${PREFIX}${key}_${step.id}`);
  const sharedYearRange = config.yearRange ?? [1840, 2120];
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
      yearRange: step.yearRange ?? [sharedYearRange[0] + minElapsed, sharedYearRange[1] - remainingMax],
      ageRange: step.ageRange ?? [config.ageRange[0] + minElapsed, Math.min(112, config.ageRange[1] + maxElapsed)],
      maxOccurrences: 1,
      baseWeight: index === 0 ? 24 : index === 1 ? 68 : 82,
      ...(index === 0 ? { lifetimeProbability: config.lifetimeProbability ?? 0.2 } : {}),
      ...(index === 0 ? { narrativeSafetyNet: true } : {}),
      ...(index > 0 ? { requiresEvents: [ids[index - 1]] } : {}),
      conditions: index === 0
        ? join([], config.conditions)
        : join([between(ids[index - 1], step.minYears, step.maxYears)], step.conditions),
      text: step.text,
      effects: [
        ...(step.effects ?? []),
        ...(next ? [{ scheduleEvent: { eventId: ids[index + 1], delayYears: [next.minYears, next.maxYears], weightMultiplier: 8 } }] : []),
      ],
      narrativeTier: index === 0 ? "turning_point" : "consequence",
      narrativeDomain: `${PREFIX}${key}`,
      narrativeThread: next ? { expiresAfterYears: next.maxYears } : { close: true },
    };
  });
}

const childhoodDuty = ageArc("childhood_duty", {
  category: "family",
  ageRange: [6, 13],
  lifetimeProbability: 0.26,
  conditions: { all: [C("relationships.family", "gte", 18)] },
  steps: [
    {
      id: "regular_task",
      title: "一件小事固定归你",
      text: [
        variant([early, rural], "家里把喂牲口、看火或送一趟东西固定交给你。最初总有人在旁边提醒，后来只在你忘记时才有人出声。"),
        variant([early, urban], "铺里或家中有一件跑腿小事固定归你。你认熟了路，也认熟了哪位大人说‘马上’时其实还要等很久。"),
        variant([lowMoney], "大人的手都被生计占着，一件小家事于是固定落到你手上。夸奖来得快，替你把活拿回去却没人那么着急。"),
        variant([connected, urban], "门卡、快递或一件固定家务开始由你帮忙照看。提醒写在屏幕上，你仍能在玩得最投入时把它忘得很完整。"),
        fallback("家里有一件小事固定归你：跑腿、看火、收拾或替人记住什么。它不大，却第一次有人会等你把它做完。"),
      ],
      effects: [add("relationships.family", 2), add("resources.freedom", -2), add("resources.achievement", 1)],
    },
    {
      id: "relied_on",
      title: "有人真的按你的那一份安排日子",
      minYears: 1,
      maxYears: 3,
      text: [
        variant([student], "功课正做到一半，家里催你去完成那件固定的事。你回来时题目还在原处，天色已经替你翻了一页。"),
        variant([C("birth.gender", "eq", "female")], "家人越来越顺手地把细碎照料交给你，还夸你比同龄人懂事。你懂得很快：被信任和被多派活，有时穿同一件衣服。"),
        variant([rural], "农忙或赶集那天，你照例守好分给自己的那一小段。没人为此专门表扬，少了它，一家人的脚步却会立刻打结。"),
        variant([lowMoney], "家里临时少一个人手，你做的那件小事便不能再拖。穷日子教人负责的办法很直接：你不做，事情就留在那里。"),
        fallback("有一天你耽搁了，才发现别人已经按你的那一份安排后面的事。责任没有举行仪式，只让一家人的晚饭比平常迟了一会儿。"),
      ],
      effects: [add("relationships.family", 2), add("resources.freedom", -2), add("attrs.mental", 1)],
    },
    {
      id: "skill_remains",
      title: "手里留下了一点会做的事",
      minYears: 2,
      maxYears: 5,
      text: [
        variant([student], "你渐渐会把家事和功课错开，不再每回都靠大人催。时间没有因此变多，只是少丢了几小块。"),
        variant([weakHealth], "身体不总听话，家里把最重的部分拿回去，仍留一件你能完成的事。会做并不等于什么都该做，这条界线大家学得稍晚。"),
        variant([early], "年岁长一点后，你已能独自办完那件小差事。大人说终于省心，你知道自己只是把挨过的几次训记得很牢。"),
        variant([connected], "那件小家事后来换了工具和步骤，你仍很快接上。提醒可以换成屏幕，做完以前那句知道了仍不算数。"),
        fallback("几年后，那件小事或许不再归你。后来见别人忙到顾不上时，你仍会顺手把缺的那一步补上，手比道理记得早。"),
      ],
      effects: [add("resources.achievement", 3), add("relationships.family", 2), add("resources.freedom", 1)],
    },
  ],
});

const adolescentCorner = ageArc("adolescent_corner", {
  category: "family",
  ageRange: [12, 19],
  lifetimeProbability: 0.24,
  conditions: { all: [C("relationships.family", "gte", 12)] },
  steps: [
    {
      id: "kept_thing",
      title: "有样东西只想自己收着",
      text: [
        variant([early], "你把一张纸、几枚小物或一封没写完的信收进自己的包袱。屋里没有真正的秘密地方，你只好把折痕做得不起眼。"),
        variant([lowMoney], "家中地方窄，物件也少，你仍留出一个小盒存自己的东西。盒子不值钱，别人要翻时，你第一次觉得这同价钱无关。"),
        variant([student], "你把一本写了私话的本子夹进课本中间。书桌仍是全家共用，哪一页不愿被看，只能靠你自己记住。"),
        variant([rural], "你在睡处或箱角留了一小块地方，放不愿被家中小孩或亲友随手拿走的东西。院门总开着，自己的边界只好从一个盒盖开始。"),
        fallback("你开始有一样不愿被人随手翻看的东西。它未必是秘密，只是第一次有件事不想立即向家里解释。"),
      ],
      effects: [add("resources.freedom", 2), add("relationships.family", -1), add("attrs.mental", 1)],
    },
    {
      id: "boundary_spoken",
      title: "一句别动没有立刻被当回事",
      minYears: 1,
      maxYears: 3,
      text: [
        variant([lowMoney], "家里说东西本来就该共用，你说共用也该先问一句。话听着讲究，在拥挤日子里却是你能争到的最小一块地方。"),
        variant([C("birth.gender", "eq", "female"), C("meta.currentYear", "lte", 2015)], "长辈觉得女孩不该藏心事，你第一次把不愿意说得清楚。屋里安静了一阵，旧规矩没有退场，至少听见了反对。"),
        variant([student], "家里翻到你的一页笔记，争执从成绩绕到交友，又绕回谁有权看。最后本子还给了你，折角证明它确实被看过。"),
        variant([working], "你已经替家里做活挣钱，自己的东西仍常被随手安排。你把哪一部分可以商量说清，声音不大，句子没有收回。"),
        fallback("有人动了你收好的东西，说一家人何必计较。你说不是计较物件，是希望先被问一句；这层区别，大人过了一阵才听懂。"),
      ],
      effects: [add("resources.freedom", 3), add("relationships.family", -2), add("attrs.mental", 1)],
    },
    {
      id: "small_decision",
      title: "终于有一件小事先问你",
      minYears: 2,
      maxYears: 5,
      text: [
        variant([student], "家里再安排你的时间时，先问了哪天有课。决定仍不全归你，至少你的日程不再被当成一张空纸。"),
        variant([working], "你把一点自己挣来的钱留下，家里没有再逐笔追问。钱不多，能由你决定花在哪里，分量便同数目不一样。"),
        variant([C("location.migratedTimes", "gte", 1)], "搬过地方以后，你更清楚哪些东西必须自己保管。家人开始把一把钥匙或一份地址交给你，边界也有了实际用途。"),
        variant([early], "长辈终于把一件小安排先来问你。旧式家中仍讲长幼，你的意见却不再只等于点头。"),
        fallback("后来有一件不大的事，家里先问了你的意思。答案未必被完全照办，但那句‘你怎么想’确实来过。"),
      ],
      effects: [add("resources.freedom", 4), add("relationships.family", 2), add("resources.happiness", 2)],
    },
  ],
});

const elderBody = ageArc("elder_body", {
  category: "health",
  ageRange: [55, 104],
  lifetimeProbability: 0.34,
  conditions: { all: [C("resources.health", "lte", 68)] },
  steps: [
    {
      id: "route_changes",
      title: "身体先改了一条常走的路",
      text: [
        variant([early, rural], "膝脚不如从前以后，你去田头、井边或集上换了一条缓些的路。路远了一点，少跨一道沟，回来还能自己把鞋上的泥刮掉。"),
        variant([early, urban], "腿脚慢下来，你避开最挤的街口，宁可多绕半条巷。年轻人只看见路程，你知道台阶和歇脚处也参与丈量。"),
        variant([working], "身体开始在一项熟活上提出条件。你把最费力的步骤挪到前面做，免得下午只剩逞强。"),
        variant([lowMoney], "看病和歇工都要花钱，你先改走路、吃饭和做活的次序。省下的未必是病，至少不是每回都把身体逼到最后一格。"),
        fallback("身体没有一下垮掉，只先让一条常走的路变得不合适。你换了走法，也第一次认真记住哪里可以坐一会儿。"),
      ],
      effects: [add("resources.freedom", -3), add("resources.health", 1), add("attrs.mental", 1)],
    },
    {
      id: "day_rearranged",
      title: "一天被重新排过",
      minYears: 1,
      maxYears: 4,
      text: [
        variant([working], "你不再把最重的活留到收尾，也学会在别人催时说今天只能做到这里。工钱未必喜欢这句话，身体倒听见了。"),
        variant([rural], "你少跑一趟远路，把重物拆开挪，仍管近处几件事。少做并不等于闲着，乡下的活很会把自己切小再找上门。"),
        variant([connected], "挂号、缴费和提醒多了新工具，你把字调大，也把需要跑一趟的事攒在同一天。省下的不是时间，是几次无谓折返。"),
        variant([weakHealth], "一场小病后，你把吃药、歇息和办事的次序固定下来。日程显得琐碎，漏掉其中一项，身体便会亲自来催。"),
        fallback("你把一天重新排过：远事少放一件，重活不连着做，答应别人以前先看自己还有多少力气。"),
      ],
      effects: [add("resources.health", 2), add("resources.freedom", 1), add("resources.happiness", -1)],
    },
    {
      id: "new_measure",
      title: "不再拿从前的速度量今天",
      minYears: 3,
      maxYears: 7,
      text: [
        variant([working], "你仍能把活做完，只是不再同年轻人的速度硬比。熟练替你省下一些力气，剩下的力气终于不全归活计。"),
        variant([weakHealth], "身体的范围又小了一点，你没有把每次退让都说成失败。能自己完成的仍自己做，需要搭手的便把话说在前面。"),
        variant([early], "后来你按今日的力气安排事情，不再动辄说从前怎样。旁人少听几句旧勇，倒更愿意在真需要时扶一把。"),
        variant([connected], "屏幕常催人记步数和指标，你更在意今天能否买菜、见人、睡稳。数字很勤快，日子仍由这些具体结果验收。"),
        fallback("你终于不再拿从前的速度责备今天。路走慢了，事情仍一件件到达；有几件甚至因为慢，第一次看清了。"),
      ],
      effects: [add("resources.health", 3), add("resources.freedom", 2), add("resources.happiness", 3)],
    },
  ],
});

const elderFriendship = ageArc("elder_friendship", {
  category: "relationship",
  ageRange: [55, 104],
  lifetimeProbability: 0.32,
  conditions: { all: [C("relationships.friendship", "gte", 28)] },
  steps: [
    {
      id: "fixed_meeting",
      title: "见面开始需要提前约好",
      text: [
        variant([early], "老相识不再能随时碰见，你们约好逢集、逢节或隔些日子坐一回。没有钟点提醒，便托熟人把话带到。"),
        variant([C("location.migratedTimes", "gte", 1)], "你搬过地方，有些旧友留在旧处，见面要配合车次和住处。每回都说下次别隔太久，回去以后仍各有各的日子。"),
        variant([connected], "群里说话很容易，真正见面仍要把各自的看病、家事和路程一项项错开。约成一次以后，大家先拍下下次日期，免得只剩表情。"),
        variant([weakHealth], "身体使临时出门变难，你和老友把见面定在离双方都近、有座位的地方。友情到了这时，也会认真研究门槛。"),
        fallback("老相识各有身体和家事，见面不再说来就来。你们定下一个大致日子，像替这段关系留一把不会被别事占走的椅子。"),
      ],
      effects: [add("relationships.friendship", 3), add("resources.freedom", -1), add("resources.happiness", 2)],
    },
    {
      id: "missed_meeting",
      title: "有一回约好的人没来",
      minYears: 1,
      maxYears: 4,
      text: [
        variant([early], "约好的那天少来一个人，托人问过，才知是病了或家中有事。桌上的茶凉了一盏，大家把闲话说得比平常轻。"),
        variant([connected], "群里有个人迟迟没有回话，后来才知道正在住院或照料家人。消息很快，能替人去一趟的脚步仍有限。"),
        variant([C("resources.wealth", "lte", 35)], "路费和身体都不宽裕，这一回你临时没能赴约。朋友没有责怪，只把下一回地点改得更近。"),
        variant([weakHealth], "这次轮到你不能出门。朋友把吃的和几句笑话带到门口，坐不久便走；短短一会儿，也没有被称作顺便。"),
        fallback("有一回约好的人没来。问清并非大事后，大家才恢复玩笑；年纪渐长，缺一把椅子总会先让人多想一步。"),
      ],
      effects: [add("relationships.friendship", 2), add("resources.happiness", -2), add("attrs.mental", 1)],
    },
    {
      id: "route_kept",
      title: "这条来往没有只留在回忆里",
      minYears: 3,
      maxYears: 8,
      text: [
        variant([connected], "后来你们把见面、电话和偶尔上门混着维持。技术省了几段路，没有替任何人坐完那一下午。"),
        variant([rural], "不能赴集的人多了，你们便在村镇近处轮流坐坐。谁带茶、谁带旧事没有分工，通常两样都有人带多。"),
        variant([C("location.migratedTimes", "gte", 1)], "远处的旧友未必每年能见，地址和联系方式却一直更新。关系没有回到从前，只没有在迁移里丢掉。"),
        variant([weakHealth], "身体好些便见面，差些便托人问候。次数少了，每回也不急着讲道理，先把最近哪处疼互相核对一遍。"),
        fallback("几年过去，这条来往没有只剩从前。你们见得少些，说话慢些，仍有人记得下一回该轮到谁先开口。"),
      ],
      effects: [add("relationships.friendship", 5), add("resources.happiness", 3), add("resources.freedom", 1)],
    },
  ],
});

const householdKnowledge = ageArc("household_knowledge", {
  category: "family",
  ageRange: [55, 104],
  lifetimeProbability: 0.32,
  conditions: { all: [C("relationships.family", "gte", 24)] },
  steps: [
    {
      id: "where_things_are",
      title: "有些事只有你知道放在哪里",
      text: [
        variant([early, rural], "药材、钥匙、借出的工具，或一张旧纸据，各有一处只有你记得。家里问起时，你一面嫌他们不用心，一面把藏得最深的那处说了。"),
        variant([early, urban], "旧账、钥匙和几位熟人的住处一直由你记着。有人来问，你才发现这些琐事没有写在任何一本正经账簿上。"),
        variant([working], "做了多年的活里，有些例外只存在你脑中。有人来接手或搭手时，你先说照规矩，停了一下，又把规矩常常失效的地方补上。"),
        variant([connected], "家里的账号、证件和药单越攒越多，你把入口整理到一处。密码没有写全，防人和方便家人仍在同一张纸上争位置。"),
        fallback("家里有几件事只有你知道：东西放处、谁欠谁一次人情，或哪项手续曾经怎么办。它们不起眼，缺了便能让全屋翻找。"),
      ],
      effects: [add("resources.reputation", 2), add("relationships.family", 1), add("resources.freedom", -1)],
    },
    {
      id: "said_aloud",
      title: "把没写下的次序说了一遍",
      minYears: 1,
      maxYears: 4,
      text: [
        variant([early], "你让可信的家人坐下，把纸据、人情和物件次序逐项说过。对方嫌你讲得绕，你便让他复述一遍，果然漏了最要紧的一处。"),
        variant([rural], "你带人走了一圈，指出药、工具、阀门或一处旧界址。口头说来都简单，真到地方，每件东西都有一段来历挡在前面。"),
        variant([connected], "你同可信的人核对了一遍账号、自动扣款和紧急联系人。系统总劝一键同步，你坚持有几项最好仍由人当面说清。"),
        variant([C("relationships.children", "lte", 0)], "你没有把这些事默认交给并不存在的下一代，而是挑一位可信的亲友逐项说明。照应不是血缘自动生成的功能，先说好反而踏实。"),
        fallback("你挑一个不忙的下午，把那些没写下的次序说了一遍。听的人记了纸，仍有两处要回头再问；经验离开一个人的脑子，本来就要多走几趟。"),
      ],
      effects: [add("relationships.family", 3), add("resources.freedom", 1), add("resources.happiness", -1)],
    },
    {
      id: "kept_one_private",
      title: "也有一件事没有交出去",
      minYears: 3,
      maxYears: 8,
      text: [
        variant([C("relationships.children", "lte", 0)], "亲友已经知道紧急时怎么办，你仍把一件私人物品或一段往事留给自己。托付不是把人生整箱搬空。"),
        variant([early], "该交代的已经交代，你仍留一把小钥匙自己收着。它未必还开要紧的门，只说明你没有从家中事务里被整个人撤下。"),
        variant([connected], "共享清单完成以后，你保留一项只由自己开启的内容。便利没有获得查看全部的权利，家人也学会把这当成正常。"),
        variant([weakHealth], "身体需要更多帮忙，你仍决定哪一件事不必代办。别人起初怕麻烦，后来明白，留一点麻烦正是留一点自己。"),
        fallback("多数次序已经有人接得上，你仍留一件事自己保管。它不妨碍照应，也提醒大家：交代后事和提前退出生活不是一回事。"),
      ],
      effects: [add("resources.freedom", 4), add("relationships.family", 2), add("resources.happiness", 2)],
    },
  ],
});

const widowCalendar = ageArc("widow_calendar", {
  category: "relationship",
  ageRange: [35, 104],
  lifetimeProbability: 0.32,
  conditions: { all: [C("relationships.partnerStatus", "in", ["partnered", "married"])] },
  steps: [
    {
      id: "missing_task",
      title: "少掉的不只是一个人",
      text: [
        variant([early], "伴侣去世后，你才发现有几件小事一直由对方记着：一笔账、一个亲戚的称呼、某件东西该何时收。悲伤之外，日子也缺了一只熟手。"),
        variant([rural], "伴侣不在以后，院里总有一两件活到了时辰却没人先动。你慢慢接过去，也有几件宁可请人帮忙，不再硬撑。"),
        variant([connected], "伴侣的账号和提醒仍按旧时间弹出。你逐项关闭，有一项停了很久没有按下，像让共同生活再多响几天。"),
        variant([lowMoney], "少一份收入或劳力以后，每项开销都比从前显眼。你一边办丧后的手续，一边重新算往后的饭，悲伤没有免除账期。"),
        fallback("伴侣去世后，少掉的不只是说话的人，还有许多从未分配过名字的小事。它们到了时辰，才逐件显出空位。"),
      ],
      effects: [set("relationships.partnerStatus", "widowed"), add("relationships.romance", -18), add("resources.happiness", -8), add("resources.freedom", -3), add("attrs.mental", 1)],
    },
    {
      id: "calendar_relearned",
      title: "重新学会一个人的次序",
      minYears: 1,
      maxYears: 4,
      text: [
        variant([early], "你重新记下赶集、缴账和走亲的日子。有人劝再找个人作伴，你先把眼前几个月过明白，没有急着给余生答话。"),
        variant([rural], "哪天磨粮、哪天买药、哪处活要请邻里搭手，你慢慢排出新的次序。一个人过日子并不清静，只是商量声少了一半。"),
        variant([connected], "你改掉几个曾经共用的账户或家庭日程，保留了一项旧提醒。系统问是否永久删除，你第一次认真觉得这个词太擅长替人作决定。"),
        variant([C("relationships.family", "gte", 55)], "亲友常来问缺什么，你学会接受一部分，也拒绝一部分。被惦记和被接管之间，仍要自己划线。"),
        fallback("你把吃饭、出门和家中琐事重新排成一个人的次序。最难的不是不会做，而是做完后少了那个可以顺口说一句的人。"),
      ],
      effects: [add("resources.freedom", 2), add("relationships.family", 2), add("resources.happiness", -1)],
    },
    {
      id: "new_routine",
      title: "日子没有恢复原样，也继续往前",
      minYears: 3,
      maxYears: 8,
      text: [
        variant([early], "后来你有了新的作息，旧物仍在原处几件。别人不再天天来问，你也不必每次都证明自己已经放下。"),
        variant([C("relationships.friendship", "gte", 45)], "朋友把你重新拉回几次来往，不逼你热闹，只记得多留一把椅子。你偶尔先回家，没人把它解释成扫兴。"),
        variant([connected], "相册和一两项共同用过的设置仍保存着旧习惯，你没有全部清掉，也不再每天打开。记忆获得一处位置，没有占满整张桌子。"),
        variant([lowMoney], "日子仍紧，你把能独自办的办好，需要花钱请人的便早些算。生活没有恢复原样，只少了几次临到门口才发慌。"),
        fallback("几年后，日子有了新次序。伴侣留下的空位没有被填成原样，你也已经能在空位旁边继续吃饭、办事和偶尔笑出声。"),
      ],
      effects: [add("resources.happiness", 4), add("resources.freedom", 3), add("attrs.mental", 1)],
    },
  ],
});

const lateMoney = ageArc("late_money", {
  category: "wealth",
  ageRange: [55, 104],
  lifetimeProbability: 0.32,
  conditions: { all: [C("resources.wealth", "lte", 42)] },
  steps: [
    {
      id: "small_shortfall",
      title: "一笔小缺口开始反复出现",
      text: [
        variant([early], "药钱、粮钱或一笔旧人情使这个月又短了一截。你从箱底翻出可卖可当的东西，先挑不影响过冬的那件。"),
        variant([rural], "零活、家里偶尔的进项和日常开销没有对齐，一笔不大的缺口反复出现。数目写在纸上很短，补它要多跑几趟。"),
        variant([weakHealth], "身体需要持续花钱，收入却没有跟着病情增加。你把药、吃饭和其他开销重新排队，最要紧的那项也不总能站第一。"),
        variant([connected], "几张账单和自动扣款把余额切得很碎，你逐个核对，发现最难取消的往往不是最贵的，而是家里谁都说还会用。"),
        fallback("一笔不大的缺口连续几个月出现。每次都能勉强补上，正因为能补，旁人很难看见它已经反复来过。"),
      ],
      effects: [add("resources.wealth", -3), add("resources.happiness", -2), add("attrs.mental", 1)],
    },
    {
      id: "expense_boundary",
      title: "有一项开销终于被说清",
      minYears: 1,
      maxYears: 4,
      text: [
        variant([C("relationships.family", "gte", 50)], "家里把谁能出钱、谁能出力摊开说了一次。话不都好听，至少那笔缺口不再总等最沉默的人补。"),
        variant([C("relationships.children", "lte", 0)], "你没有可默认求助的子女，便同亲友或邻里把紧急时能搭到哪一步说清。关系没有因此变成账，反而少了临时猜测。"),
        variant([early], "你同债主、掌柜或家里人重新讲定一项开销。人情话说了不少，最后仍以写下的数目最可靠。"),
        variant([connected], "你停掉一项不再需要的费用，也保留一项旁人觉得可以省的支出。账目清楚以后，节省终于不等于别人替你决定。"),
        fallback("你把那项总被含糊带过的开销说清：哪些必须付，哪些可以等，哪些不该永远由你一个人补。"),
      ],
      effects: [add("resources.wealth", 2), add("resources.freedom", 2), add("relationships.family", 1)],
    },
    {
      id: "modest_buffer",
      title: "攒下一点不必立刻动的钱",
      minYears: 3,
      maxYears: 8,
      text: [
        variant([early], "几季下来，你留住一点不必马上拿去还账的钱。数目不足以叫积蓄，遇到一场小病时，已经能让人少低一次头。"),
        variant([rural], "家里留下一点粮、现金或随时能换钱的东西。它没有让日子富起来，只使下一次坏天气来时不必当天借。"),
        variant([weakHealth], "你攒下一点看病备用的钱。它后来也许仍会花掉，能由需要而不是慌乱决定何时花，已经不同。"),
        variant([connected], "账户里终于有一小笔不参加日常扣款的钱。应用不断建议拿去投资，你先让它安静地待着，完成最朴素的职责。"),
        fallback("后来你留住一点不必立刻动的钱。它仍只是一小笔，够在坏一件东西或临时买药时，先把事情办了再发愁。"),
      ],
      effects: [add("resources.wealth", 5), add("resources.happiness", 2), add("resources.freedom", 2)],
    },
  ],
});

const reducedWork = ageArc("reduced_work", {
  category: "career",
  ageRange: [50, 104],
  lifetimeProbability: 0.34,
  conditions: { all: [C("career.status", "eq", "retired")] },
  steps: [
    {
      id: "old_clock_stops",
      title: "旧作息忽然空出一块",
      text: [
        variant([early], "最重的活渐渐不再由你做，清早醒来的时辰却没有跟着改变。你在屋里多坐一会儿，手总想先去找从前那件工具。"),
        variant([rural], "家里把重活分给别人，你仍按旧时辰醒来。院里总有零碎事情，所谓歇下，不过是担子换成了几只篮子。"),
        variant([C("meta.currentYear", "gte", 1950), C("meta.currentYear", "lte", 1977), C("career.field", "neq", "")], "不再按上班钟点出门后，你仍会在原来的时辰醒。广播、买菜和家务接过一天，没人给这些事登记工龄。"),
        variant([connected, C("career.field", "neq", "")], "工作日程从屏幕上消失，身体仍按旧点醒来。你删掉几次提醒，最后留下一条，专门提示自己今天没有会。"),
        fallback("把最重、最急的事情交出去以后，一天忽然空出一块。你起初总想把它立刻填满，像空着便算浪费。"),
      ],
      effects: [add("resources.freedom", 4), add("resources.happiness", -1), add("relationships.family", 1)],
    },
    {
      id: "new_duty",
      title: "空出来的时间很快有了去处",
      minYears: 1,
      maxYears: 4,
      text: [
        variant([connected], "群消息很快发现你不再上班，求帮忙的事一件件来。你学会先看日历再答应，退休后的日历也有拒绝功能。"),
        variant([rural], "近处家事和邻里来往很快填进来，你仍留一段时间只做自己的事。村里人说闲着也是闲着，你没有每次都同意。"),
        variant([C("relationships.children", "gte", 1)], "家中有事开始先来问你是否有空。你愿意帮一部分，也把另一些推回去；不再上班，不等于整天等待分配。"),
        variant([C("relationships.children", "lte", 0)], "没有孩子把日程填满，你便同亲友、邻里和自己的身体重新安排时间。清静不是空白，也不是随叫随到。"),
        fallback("空出来的时间很快被家事、人情和身体占去。你开始分辨哪些是愿意做，哪些只是别人觉得你反正有空。"),
      ],
      effects: [add("resources.freedom", 2), add("relationships.family", 2), add("attrs.mental", 1)],
    },
    {
      id: "own_rhythm",
      title: "一天终于有了自己的速度",
      minYears: 3,
      maxYears: 8,
      text: [
        variant([early], "后来你不再按做了多少活判断一天。能见一个人、修好一样东西，或安稳吃完一顿饭，也各自算数。"),
        variant([rural], "重活少做，节气仍照常来。你保留几件能做的事，不再每回都证明自己同年轻时一样有力气。"),
        variant([weakHealth], "身体好坏决定一天能走多远，你不再提前把每个时段许给别人。力气先归自己支配，剩下的再谈帮忙。"),
        variant([connected], "你不再让每一格日程都填满。工具仍提醒效率，下午那段散步或发呆没有产出，也没有被删除。"),
        fallback("几年后，一天终于有了自己的速度。它不总轻松，也不再完全照旧工作的刻度评价。"),
      ],
      effects: [add("resources.freedom", 5), add("resources.happiness", 4), add("resources.health", 1)],
    },
  ],
});

const nearbyPresence = ageArc("nearby_presence", {
  category: "relationship",
  ageRange: [88, 96],
  lifetimeProbability: 0.18,
  steps: [
    {
      id: "familiar_hour",
      title: "门外每天有一小段准时的动静",
      text: [
        variant([early, rural], "每天差不多的时候，总有熟人挑担、赶牲口或从门前慢慢经过。你不必出门，听见脚步和招呼，便知道日头已经走到哪里。"),
        variant([early, urban], "清早有人扫门前，晚些时候又有小贩沿街叫卖。你坐在门边，偶尔同那个总走这条街的人说两句，话题通常不比天气和价钱更大。"),
        variant([weakHealth], "你能走的路少了，仍认得固定时辰经过门口的几张脸。有人抬手，你也抬一下；两边都没有为这件事专门停步。"),
        variant([rural], "邻里每天经过门前去赶集、拿药或照看近处的事，回来时常顺口报一句路上的消息。你记不全内容，脚步是谁的仍听得清。"),
        variant([connected, urban], "楼道里固定时辰会响起清扫、送货或邻居出门的声音。你偶尔从门内应一声，对方知道这扇门后今天也有人醒着。"),
        variant([urban], "窗下或楼道每天有几个熟面孔经过：买菜的、做清洁的、住在近处的人。你们点头多，长谈少，仍把彼此算进这条路的日常。"),
        fallback("每天差不多的时候，住处外总有一个熟人经过。你们说的话很短，有时只是一声称呼；第二天到了那个时辰，声音通常还会再来。"),
      ],
      effects: [add("relationships.friendship", 2), add("resources.happiness", 1), add("resources.freedom", 1)],
    },
    {
      id: "hour_missing",
      title: "有一天，那阵动静没有来",
      minYears: 1,
      maxYears: 2,
      text: [
        variant([early], "那天门外安静得久一些，平常经过的人没有来。邻里托人问过，才知道对方病了或去了亲族家；原来一句日日听见的招呼，也会在缺席时占地方。"),
        variant([rural], "一连两天没见那人从门前经过，有邻居顺路去看。回来的人说只是身体不适，还带回一句让你别惦记；这句话绕了一圈，路倒没有白走。"),
        variant([connected], "固定时辰没有门响，简短消息也迟迟没来。邻居在群里问了一句，很快有人上门确认；屏幕传得快，最后那几步仍要用脚走。"),
        variant([weakHealth], "你自己不便出门，便请经过的人代问一声。傍晚带回的消息说没有大事，你点点头，把原先留在门边的那句招呼收了回来。"),
        fallback("熟悉的人有一天没有出现。旁人去问过，事情并不严重；等消息的那半日里，门外每一个相近的脚步都让人多听一下。"),
      ],
      effects: [add("resources.happiness", -2), add("relationships.friendship", 2), add("attrs.mental", 1)],
    },
    {
      id: "small_signal",
      title: "后来留下一种简单的报平安",
      minYears: 2,
      maxYears: 3,
      text: [
        variant([early, rural], "后来谁几日不经过，便托邻里带一句话。你仍坐在熟悉的位置，听见担子落地或院门轻响，就知道有人替那句平安送到了。"),
        variant([early, urban], "再后来，门前扫地的人会多敲一下门，小贩经过也把招呼拖长一点。没有谁称它为约定，哪天少了一声，附近的人却都知道该问。"),
        variant([rural], "邻里定下一个很简单的办法：几日不见，便顺路问一声。方法没有写在墙上，赶集回来的人总记得先把消息放在谁家门口。"),
        variant([connected, urban], "你们后来留下一种很短的报平安：门铃响一下、消息回一个字，或隔着楼道喊一声。工具换过，确认有人应答仍只要几秒。"),
        variant([weakHealth], "你不必为报平安走远，只在固定时辰应一声。对方也不多问，隔天照旧经过；彼此省下力气，没有省掉这句。"),
        fallback("此后若有人几天没露面，附近总有一个人顺口问起。你们仍各过各的日子，只把一句到了或没事，留在每天会经过的路上。"),
      ],
      effects: [add("relationships.friendship", 4), add("resources.happiness", 3), add("resources.freedom", 2)],
    },
  ],
});

const centenarianWitness = ageArc("centenarian_witness", {
  category: "relationship",
  yearRange: [1940, 2115],
  ageRange: [100, 106],
  lifetimeProbability: 0.18,
  steps: [
    {
      id: "asked_for_a_century",
      title: "有人来问这一百年",
      text: [
        variant([early, rural], "一个晚辈坐到门边，问旧河道、荒年和从前怎么赶集。你嫌他把几十年问成三道题，先让人把水添上，再从一条已经改名的小路讲起。"),
        variant([early, urban], "有人来问老街原先是什么样。你不肯先谈大事，只指出哪间铺子赊账最宽、哪处屋檐下雨时总漏；一条街的历史先从避雨处恢复。"),
        variant([rural], "年轻人来问旧田界、井水和哪种风最怕倒伏。地图把地块画得很直，你讲的路却总绕过一棵早已不在的树。"),
        variant([connected, urban], "社区的人带着录音工具来问这一百年。设备很会消除杂音，你坚持把楼道里那阵锅铲声也留下，说日子本来就没有纯净音轨。"),
        variant([weakHealth], "来人把问题缩短，一次只问一件。你说得慢，中途几次歇下；一百年并不配合采访时长，身体更不配合。"),
        fallback("有人认真问你这一百年究竟怎样。你没有给出一句能挂在墙上的答案，只先说起一顿饭、一次误路和一个多年没再听见的称呼。"),
      ],
      effects: [add("resources.reputation", 2), add("relationships.friendship", 2), add("attrs.mental", 1)],
    },
    {
      id: "dates_do_not_line_up",
      title: "日期有两种说法",
      minYears: 1,
      maxYears: 2,
      text: [
        variant([early], "晚辈拿来旧历和一张残缺记录，年份同你的说法差了一截。你想了很久，只肯改月份，不肯改那天风里的土味；档案保住日期，你保住天气。"),
        variant([rural], "旧册上写的收成同你记得的不一样。你承认可能把两年叠在了一起，又指出册子从不记谁家把口粮先让给了病人。"),
        variant([connected], "整理工具把两段相近的往事标成矛盾，来人请你选一个。你说可以把不确定也存进去；记忆若每格都满，反而像后来补写的。"),
        variant([urban], "老地图说那家店在街东，你记得明明靠西。争到后来才发现街名换过、门牌也重排过，城市终于替你分担了一部分记错。"),
        variant([weakHealth], "你讲到一半把两个人的名字说混，停下来让那处先空着。来人没有替你猜；空白留在记录里，也是一种诚实。"),
        fallback("第二次整理时，几个年份彼此对不上。你把能确认的说清，不能确认的留空；活得久不等于替时间保管了全部底稿。"),
      ],
      effects: [add("attrs.mental", 2), add("resources.happiness", -1), add("resources.reputation", 1)],
    },
    {
      id: "one_small_detail_remains",
      title: "最后留下一个小细节",
      minYears: 2,
      maxYears: 4,
      text: [
        variant([early, rural], "最后记下来的，是荒年里有人把一小把种子藏在梁上。它没有解释整个时代，只说明第二年仍有人打算播种。"),
        variant([early, urban], "最后留下的是一笔没收利息的赊账和柜台后那张矮凳。大事另有许多人记，小店怎样让一个人熬过月底，也该占几行纸。"),
        variant([rural], "记录最后添上你纠正的一句：那口井不是在村东，是路后来改了方向。小地方终于没有为了配合地图再次搬家。"),
        variant([connected, urban], "成稿发来时，你删掉一句见证百年沧桑，补回某位邻居做饭总多放盐。宏大叙述少了八个字，一个具体的人重新回到里面。"),
        variant([weakHealth], "你没有再讲很久，只补上一个人的全名。许多事情已经模糊，仍有人不该被历史用某某家那位轻轻带过。"),
        fallback("这次讲述最后只留下一个小细节：一句口头禅、一件旧工具，或谁在最难时端来过一碗热的。它解释不了一生，却使一生没有只剩年代。"),
      ],
      effects: [add("relationships.friendship", 3), add("resources.happiness", 2), add("resources.reputation", 2)],
    },
  ],
});

export const structuralAgeArcEvents = [
  ...childhoodDuty,
  ...adolescentCorner,
  ...elderBody,
  ...elderFriendship,
  ...householdKnowledge,
  ...widowCalendar,
  ...lateMoney,
  ...reducedWork,
  ...nearbyPresence,
  ...centenarianWitness,
];
