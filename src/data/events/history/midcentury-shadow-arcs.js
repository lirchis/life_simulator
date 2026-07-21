// Moral-shadow chains rooted in the planned-economy decades, 1949—1977.
//
// An opening never treats an era, class or occupation as moral character. It
// requires a concrete place beside a roster, account book, allocation sheet,
// accusation, referral slip or storeroom. Once opened, the chain advances
// through scheduled continuations. Later prose remembers both changed
// circumstances and the material trace left by a small exercise of power.

const PREFIX = "shadow_midcentury_";
const ACTIVE = ["employed", "family_labor"];
const RURAL = { hukou: ["rural"], cityTiers: ["village", "town"] };
const URBAN = { cityTiers: ["county", "city", "tier2", "tier1"] };

const add = (path, value) => ({ path, add: value });
const C = (path, operator, value) => ({ path, [operator]: value });
const V = (conditions, text) => ({ conditions, text });
const F = (text) => ({ text });
const between = (eventId, minYears, maxYears) => ({
  eventOccurredBetween: { eventId: `${PREFIX}${eventId}`, minYears, maxYears },
});

function scopeThreadConditions(value, domain) {
  if (Array.isArray(value)) return value.map((item) => scopeThreadConditions(item, domain));
  if (!value || typeof value !== "object") return value;
  const scoped = Object.fromEntries(Object.entries(value).map(([key, item]) => [key, scopeThreadConditions(item, domain)]));
  if (scoped.path === "shadow.guilt") scoped.path = `shadow.threads.${domain}.guilt`;
  if (scoped.path === "shadow.selfDeception") scoped.path = `shadow.threads.${domain}.justification`;
  if (scoped.path === "shadow.benefitRetained") scoped.path = `shadow.threads.${domain}.benefitRetained`;
  return scoped;
}

function threadEffects(effects, domain, close) {
  // A closing scene reads the responsibility already accumulated by this
  // thread. It must not force remorse and hardening through the same effect.
  const adjusted = close
    ? effects.filter((effect) => !(effect.add > 0
      && ["shadow.guilt", "shadow.hardness", "shadow.selfDeception"].includes(effect.path)))
    : effects;
  return adjusted.flatMap((effect) => {
    const mirrored = [];
    if (effect.path === "shadow.guilt" && effect.add > 0) {
      mirrored.push(add(`shadow.threads.${domain}.guilt`, effect.add));
    }
    if (effect.path === "shadow.selfDeception" && effect.add > 0) {
      mirrored.push(add(`shadow.threads.${domain}.justification`, effect.add));
    }
    if (effect.add > 0 && ["resources.wealth", "resources.reputation", "resources.achievement"].includes(effect.path)) {
      mirrored.push(add(`shadow.threads.${domain}.benefitRetained`, Math.min(4, effect.add)));
    }
    return [effect, ...mirrored];
  });
}

const ruralNow = { all: [C("location.currentCityTier", "in", ["village", "town"])] };
const urbanNow = { all: [C("location.currentCityTier", "in", ["county", "city", "tier2", "tier1"])] };
const poor = { all: [C("resources.wealth", "lte", 42)] };
const secure = { all: [C("resources.wealth", "gte", 64)] };
const female = { all: [C("birth.gender", "eq", "female")] };
const older = { all: [C("meta.age", "gte", 52)] };
const leftRole = { all: [C("career.status", "in", ["none", "unemployed", "laid_off", "retired"])] };
const moved = { all: [C("location.migratedTimes", "gte", 1)] };
const guilty = { all: [C("shadow.guilt", "gte", 2)] };
const hardened = { all: [C("shadow.hardness", "gte", 7), C("shadow.selfDeception", "gte", 6)] };
const benefited = { all: [C("shadow.benefitRetained", "gte", 2)] };

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
  lifetimeProbability = 0.12,
  eraEnd = 2005,
  steps,
}) {
  const ids = steps.map((step) => `${key}_${step.id}`);
  const domain = `${PREFIX}${key}`;

  return steps.map((step, index) => {
    const next = steps[index + 1];
    const elapsedMin = steps.slice(1, index + 1).reduce((sum, item) => sum + item.minYears, 0);
    const elapsedMax = steps.slice(1, index + 1).reduce((sum, item) => sum + item.maxYears, 0);
    const required = index === 0
      ? [{ missingTag: "shadow_midcentury_actor" }, { missingTag: "shadow_public_actor" }]
      : [between(ids[index - 1], step.minYears, step.maxYears), { hasTag: `${PREFIX}${ids[index - 1]}` }];

    return {
      id: `${PREFIX}${ids[index]}`,
      title: step.title,
      category: step.category ?? category,
      yearRange: step.yearRange ?? (index === 0
        ? yearRange
        : [yearRange[0] + elapsedMin, Math.min(eraEnd, yearRange[1] + elapsedMax)]),
      ageRange: step.ageRange ?? (index === 0
        ? ageRange
        : [ageRange[0] + elapsedMin, Math.min(105, ageRange[1] + elapsedMax)]),
      ...((step.currentRegions ?? (index === 0 ? currentRegions : undefined))
        ? { currentRegions: step.currentRegions ?? currentRegions }
        : {}),
      conditions: scopeThreadConditions(joinConditions(required, step.conditions ?? (index === 0 ? conditions : {})), domain),
      ...(index > 0 ? { requiresEvents: [`${PREFIX}${ids[index - 1]}`] } : {}),
      maxOccurrences: 1,
      baseWeight: index === 0 ? 34 : index === 1 ? 98 : 122,
      ...(index === 0 ? { lifetimeProbability } : {}),
      narrativeTier: index === 0 ? "turning_point" : "consequence",
      narrativeDomain: domain,
      narrativeThread: next ? { expiresAfterYears: next.maxYears } : { close: true },
      text: scopeThreadConditions(step.text, domain),
      effects: [
        ...(index === 0 ? [{ initializeShadowThread: domain }] : []),
        ...threadEffects(step.effects ?? [], domain, !next),
        ...(next ? [{
          scheduleEvent: {
            eventId: `${PREFIX}${ids[index + 1]}`,
            delayYears: [next.minYears, next.maxYears],
            weightMultiplier: index === 0 ? 24 : 18,
          },
        }] : []),
        { addTag: "shadow_midcentury_actor" },
        { addTag: "shadow_public_actor" },
        { addTag: `${PREFIX}${key}` },
        { addTag: `${PREFIX}${ids[index]}` },
      ],
    };
  });
}

const recruitmentRoster = makeChain("recruitment_roster", {
  yearRange: [1953, 1972],
  ageRange: [24, 60],
  currentRegions: { cityTiers: ["town", "county", "city", "tier2", "tier1"] },
  lifetimeProbability: 0.14,
  conditions: {
    all: [C("career.status", "eq", "employed"), C("career.field", "eq", "grassroots_post")],
    any: [C("career.level", "gte", 5), C("resources.reputation", "gte", 6), { hasTrait: "local_connector" }],
  },
  steps: [
    {
      id: "pencil_hook",
      title: "名册边上多了一道铅笔勾",
      minYears: 0,
      maxYears: 0,
      text: [
        V(ruralNow, "公社转来一个进城招工名额，你替人核户口、年龄和家庭劳力。表弟差半年才够条件，你先在他名字旁画了勾，又把另一户完全合格的青年压到下一页。"),
        V(urbanNow, "街道让你汇总一批厂里的招工名单。熟人把两包点心留在抽屉边，你没有拆，只把他女儿的材料放到最上面；纸张换了次序，人也跟着换了去处。"),
        V(poor, "家里正为药费发愁，一位远亲答应替你周转，求的是名单里一个位置。你把他的年龄少写一岁，借来的钱装进信封，两件事都办得很安静。"),
        V(female, "你负责誊写女工招收表，知道一名已订婚的姑娘会被嫌将来要请产假。你替熟识的一家隐去婚约，却把同样处境的另一个名字圈了出来。"),
        F("一批招工材料经过你的桌面。你把一个相熟的名字往前挪，又用字迹不清退回另一个人的证明；公章盖下去，两个人的路从同一张桌上分开。"),
      ],
      effects: [add("resources.wealth", 2), add("resources.reputation", 3), add("shadow.complicity", 4), add("shadow.harmDone", 4), add("shadow.guilt", 2), add("shadow.selfDeception", 3), add("shadow.trustDebt", 4)],
    },
    {
      id: "one_person_waited",
      title: "有人在车站等不到通知",
      minYears: 1,
      maxYears: 4,
      text: [
        V(leftRole, "你已调走或离开岗位，旧同事仍照你排下的次序发通知。那名被退材料的人来问时，只得到一句经手人不在；你的椅子空着，铅笔勾仍然有效。"),
        V(ruralNow, "被压下的青年背着铺盖到公社问消息，回去时又把铺盖背走。你看见他经过晒场，手里捏着那张盖过章却没有去处的证明。"),
        V(urbanNow, "新工人坐上通勤车，被退材料的人仍在街道门口等补招。熟人请你吃饭庆贺，饭桌上谁也没有提这两个名字原先挨在一起。"),
        V(guilty, "你托人把那份材料塞进下一批卷宗。缩招通知贴出，他的名字又落在红线下面；你回家时，熟人送来的点心已经吃完。"),
        V(hardened, "有人质疑名单顺序，你把户口、年龄和字迹三项逐一念给他听。理由各自都能成立，合在一起正好挡住最需要解释的那一道铅笔勾。"),
        F("招工的人领了工牌，落选的人继续等。你把原始草表塞进卷宗底下，正式名册干净得像从未改过。"),
      ],
      effects: [add("resources.reputation", 2), add("relationships.friendship", -2), add("shadow.complicity", 3), add("shadow.harmDone", 4), add("shadow.guilt", 3), add("shadow.selfDeception", 3), add("shadow.trustDebt", 4)],
    },
    {
      id: "factory_gate_memory",
      title: "旧厂门认得不同的人",
      minYears: 5,
      maxYears: 14,
      text: [
        V(leftRole, "你早已不管招工，旧厂门口换过保卫和牌子。靠名单进去的人已站稳脚跟，被挤掉的人也另谋了生活；你交回钢笔和抽屉钥匙，名册上的前后仍照旧。"),
        V(moved, "你迁到别处后，亲戚来信说厂里分了福利房。信纸上都是家常，你读到钥匙二字时，想起另一个人在车站把铺盖重新系紧。"),
        V(benefited, "受你照应的人逢年送来东西，后来也替你家晚辈办过一回手续。最初的一道勾长成了一圈互相帮忙的人，圈外是谁，饭桌上不必点名。"),
        V(guilty, "你晚年把那次换名告诉了家里人，也找机会向对方承认。对方听完只问原始材料还在不在；卷宗早已清理，你能交出的只剩一句迟到的实话。"),
        V(hardened, "你常说那时谁没有托过关系，晚辈听后把这句话学得很快。旧名册不在了，这套办事方法却不需要纸张保存。"),
        F("多年后，人们谈起第一份工作，总说赶上或没赶上。有人问及细节，你把两手摊开；当年握铅笔的右手，早已看不出痕迹。"),
      ],
      effects: [add("shadow.hardness", 2), add("shadow.selfDeception", 3), add("shadow.trustDebt", 2), add("resources.reputation", 1)],
    },
  ],
});

const workpointLedger = makeChain("workpoint_ledger", {
  yearRange: [1958, 1974],
  ageRange: [20, 65],
  currentRegions: RURAL,
  lifetimeProbability: 0.15,
  conditions: {
    all: [C("career.field", "eq", "production_team"), C("education.score", "gte", 32)],
    any: [{ hasTag: "production_team_accountant" }, C("career.level", "gte", 5), C("resources.reputation", "gte", 6)],
  },
  steps: [
    {
      id: "half_point_erased",
      title: "半个工分擦掉以后",
      minYears: 0,
      maxYears: 0,
      text: [
        V(female, "你替队里记工，一名常带孩子下田的女人又晚到半晌。她干完了整垄，你仍按规矩扣去半个工分；轮到自家嫂子时，孩子哭闹被你写成公事耽搁。"),
        V(poor, "你家口粮也紧，队长暗示多照顾几户骨干。你从几个势单力薄的人名下各抹去半分，添到能在年终替你说话的那几栏里。"),
        V(older, "你记了多年工分，知道哪一种改动最不显眼。一次返工被你算给平日顶撞你的人，算盘珠拨过去，他一天的汗便有了另一个责任人。"),
        V({ all: [C("shadow.resentment", "gte", 5)] }, "同队一人曾当众笑你账算得慢。月底誊本时，你把他两次重活记成中等工；墨迹只矮一点，正够私怨穿上集体标准的衣服。"),
        F("你管着队里的工分本。几笔零头被你挪给亲近的人，又从几个不敢争的人名下扣走；纸上的差距很小，年底落进粮袋便有了斤两。"),
      ],
      effects: [add("resources.wealth", 2), add("resources.reputation", 2), add("shadow.complicity", 4), add("shadow.harmDone", 4), add("shadow.guilt", 2), add("shadow.selfDeception", 4), add("shadow.trustDebt", 5)],
    },
    {
      id: "ration_bag_lighter",
      title: "粮袋比账本轻",
      minYears: 1,
      maxYears: 3,
      text: [
        V(leftRole, "你不再记工，接手的人沿用已经誊清的底数。有人追问去年的半分，现任记分员把旧本推出来；你离开了煤油灯下的位置，数字仍替你坐在那里。"),
        V(poor, "年终粮食分到各户，你自家的袋子也算不上满，却确实比原来多了一点。被扣分的人把袋口扎了两遍，空出来的布绳比粮更显眼。"),
        V(ruralNow, "念账时有人当众争起来，你用算盘复核，合计一分不少。问题藏在每天那一横怎样落下，年终总数当然端正。"),
        V(guilty, "你偷偷在杂项里给一户补回几分，没有说明缘由。那家多领了一小瓢粮，另几户的旧账仍在；你把一次补写做得像最初的擦除一样隐蔽。"),
        V(hardened, "队长夸你会把账压平，你开始替更多集体事务记数。熟练让每次偏置都更小，也让它们更难被单独抓住。"),
        F("分粮那天，几只粮袋比预想的轻。你把总账又算一遍，数目严丝合缝；被扣分的一户提着半袋粮先走，麻绳在袋口多绕了两圈。"),
      ],
      effects: [add("relationships.friendship", -3), add("shadow.complicity", 3), add("shadow.harmDone", 4), add("shadow.guilt", 3), add("shadow.trustDebt", 5), add("resources.reputation", 1)],
    },
    {
      id: "ledger_in_the_roof",
      title: "旧账本塞在房梁上",
      minYears: 4,
      maxYears: 12,
      text: [
        V(leftRole, "生产队的账本后来装进麻袋清理，你已经离岗。有人来问旧数，你说材料不归自己保管；这句话在手续上准确，也把你的手从每一道旧横线旁边移开了。"),
        V(older, "老屋翻修时，一本潮过的旧账从房梁上掉下来。你认出自己的笔迹，先拍灰，再合上；数字已经不能换粮，仍能叫几个名字重新沉默。"),
        V(guilty, "你把保存的一页旧底交给受亏的一家，承认当初有几笔偏差。对方用它确认了父辈没有记错，却已无处补领那些口粮；纸终于回到该看见它的人手里，粮食没有。"),
        V(hardened, "你拿旧工分本教育晚辈办事要细，指给他们看自己整齐的竖栏。被擦掉的半分看不清了，整齐因而获得了最后一次胜利。"),
        V(benefited, "自家晚辈说起那些年能熬过来，多谢你会过日子。你点头收下这句夸奖，房梁上的旧本没有掉下来打断饭局。"),
        F("后来工分不再决定分粮，旧账本失去用途。少领过的人把那几年记在身体和家话里，你把它记成一项已经取消的制度。"),
      ],
      effects: [add("shadow.hardness", 2), add("shadow.selfDeception", 3), add("shadow.trustDebt", 3), add("relationships.friendship", -1)],
    },
  ],
});

const housingQueue = makeChain("housing_queue", {
  yearRange: [1955, 1973],
  ageRange: [25, 58],
  currentRegions: URBAN,
  lifetimeProbability: 0.13,
  conditions: {
    all: [C("career.status", "eq", "employed"), C("career.field", "in", ["factory", "grassroots_post"])],
    any: [C("career.level", "gte", 6), C("resources.reputation", "gte", 7), { hasTrait: "local_connector" }],
  },
  steps: [
    {
      id: "score_column",
      title: "住房表上添了一栏",
      minYears: 0,
      maxYears: 0,
      text: [
        V(urbanNow, "单位叫你协助核分房顺序。你替一位常照应自己的同事加上临时困难一栏，他的名字越过两户人；表格比走廊窄，只容得下结果。"),
        V(poor, "你家也挤在筒子楼里，一名掌握物资的人答应今后帮忙，求你先安排他的弟弟。你把那户漏水写成危房，把另一户屋里的病人写成家庭可自行照料。"),
        V(female, "你知道一名女工独自带孩子，按困难程度本该靠前。科里说单身家庭不如双职工稳定，你没有争，转身把熟人的人口数多算了一个。"),
        V(secure, "你自己已有住处，替谁往前挪似乎与自家无关。也正因无关，这份人情显得便宜：一行字换来长期的感激，代价由没拿到钥匙的人承担。"),
        F("单位分房前，你帮着汇总工龄、人口和困难。一个熟人的分数被你补高，另一户真实的拥挤被归进材料不全；钥匙尚未发出，门已经先向一边开了。"),
      ],
      effects: [add("resources.reputation", 3), add("shadow.complicity", 4), add("shadow.harmDone", 4), add("shadow.guilt", 2), add("shadow.selfDeception", 3), add("shadow.trustDebt", 4)],
    },
    {
      id: "key_changed_hands",
      title: "钥匙换了手",
      minYears: 1,
      maxYears: 4,
      text: [
        V(leftRole, "你已离开分房小组，新屋仍按那张表交付。被越过的一家去找现任干部，对方说顺序是前任集体议定；你的名字从解释里消失，分数没有。"),
        V(urbanNow, "熟人搬进新屋，用报纸糊墙，孩子围着一把钥匙传看。被压后的那户还在公共灶旁吃饭，两家的烟从同一条楼道升起。"),
        V(guilty, "你试着在下一批名单里给被越过的一户加分，却没说明上次为何落后。他们后来拿到更小的一间，向你道了谢；你接住谢意，没有纠正对象。"),
        V(hardened, "有人在会上问分数怎么算，你把新增的困难栏解释得很完整。制度听起来越全面，越少人继续追问那一栏为何恰好替某个名字出现。"),
        V(benefited, "搬进去的人逢年给你送来一块自家腌肉，称多亏你按政策照顾。你每次都推两下再收，门里的生活也一年年显得理所当然。"),
        F("钥匙交到熟人手里，被推后的那户没有闹，只把床又抬高一层。楼道里人人知道住房紧张，紧张因此成了许多具体偏向共用的解释。"),
      ],
      effects: [add("relationships.friendship", 2), add("resources.reputation", 2), add("shadow.complicity", 3), add("shadow.harmDone", 3), add("shadow.guilt", 3), add("shadow.trustDebt", 5)],
    },
    {
      id: "wall_knocked_through",
      title: "两间屋后来打通了",
      minYears: 6,
      maxYears: 16,
      text: [
        V(leftRole, "单位住房制度变过几回，你也早已离岗。那套房仍由原先受照应的一家住着，墙上挂的新日历不认识旧表；手续换了名称，居住的先后没有跟着重来。"),
        V(moved, "你搬离那座城后，听说熟人把隔壁一间也并了进去。信里夸房子宽敞，你想起当年表格上被缩写成材料不全的那户，没问他们后来住到哪里。"),
        V(guilty, "你把当年的打分经过告诉了曾被越过的人，也替其子女开过一封证明。对方把证明折进材料袋，朝你点了一下头；旧屋钥匙仍挂在另一户腰间。"),
        V(hardened, "后来有人请你讲单位工作经验，你说分房最难的是平衡。听众认真记下这个词，它把两户人不同的等待时间压成了一句稳妥的话。"),
        V(benefited, "受照应的一家逢大事仍来找你，两家的关系从一把钥匙长成亲近往来。席上添过许多双筷子，最初被越过的那户从未写进请客名单。"),
        F("多年后，那间屋重新粉刷，原先的门框仍能看见。熟人一家把日子过进去了，被推后的人也在别处老去；墙比名单保存得久。"),
      ],
      effects: [add("shadow.hardness", 2), add("shadow.selfDeception", 3), add("shadow.trustDebt", 3), add("resources.reputation", 1)],
    },
  ],
});

const publicGrievance = makeChain("public_grievance", {
  yearRange: [1957, 1971],
  ageRange: [21, 62],
  lifetimeProbability: 0.11,
  conditions: {
    all: [C("career.status", "in", ACTIVE), C("career.field", "in", ["grassroots_post", "factory", "production_team"])],
    any: [C("career.level", "gte", 6), C("resources.reputation", "gte", 7), { hasTrait: "local_connector" }],
  },
  steps: [
    {
      id: "private_line_in_public_paper",
      title: "公家的纸上添了一件私事",
      minYears: 0,
      maxYears: 0,
      text: [
        V(ruralNow, "队里整理一人的问题材料，你负责把大家说的话记下来。多年前他家同你争过一段田埂，你把那次吵架改写成一贯自私，墨水把私怨接到了更大的词后面。"),
        V(urbanNow, "单位开会前让你归拢意见。一个旧同事曾抢过你的晋级机会，你便把他的几句牢骚抄进正式材料，删掉酒桌和争执的来由，只留下态度。"),
        V(female, "那人过去当众拿你的婚姻和性别取笑，你一直记得。运动材料送到手边时，你写下了他确有作风问题，却没有区分羞辱你的那部分同眼前的公共指控。"),
        V(poor, "你在单位一向说不上话，这回被叫去提供情况。第一次有人认真记你的意见，你把多年受过的轻慢全塞进一段定性；笔杆终于有重量，也没有秤。"),
        F("小组让你补充一名熟人的情况。你把一次旧冲突放进材料，却隐去冲突中自己的那一半；私怨盖上公章以后，不再需要以私怨的名义出现。"),
      ],
      effects: [add("resources.reputation", 3), add("shadow.resentment", 4), add("shadow.complicity", 5), add("shadow.harmDone", 5), add("shadow.guilt", 2), add("shadow.selfDeception", 4), add("shadow.trustDebt", 5)],
    },
    {
      id: "desk_was_empty",
      title: "那张桌子空了",
      minYears: 1,
      maxYears: 4,
      text: [
        V(leftRole, "你很快离开原岗位，材料却沿着组织关系继续走。有人后来问是谁最先写下那句话，只得到一叠不同笔迹；你的工位空了，句子已不需要作者。"),
        V(ruralNow, "那户人被调去做更重的活，院门常关着。路过时你看见门槛上的泥鞋少了一双，仍向旁人说安排是集体决定。"),
        V(urbanNow, "旧同事的桌子空下来，抽屉里剩一只搪瓷杯。有人顺手拿去公用，你没有拿；留下一只杯子，已经足够让你显得记得分寸。"),
        V(guilty, "你向小组补充说旧冲突可能影响了自己的判断。记录人点点头，把这句写在另一页；原先那页已经转走，你第一次说出的保留意见没有原话跑得快。"),
        V(hardened, "别人开始来问你更多情况，你学会把猜测写成听说，把旧事写成一贯。纸张越积越厚，你指着自己那几行，说整本材料又不归一个人写。"),
        F("材料交上去后，那人被调离、停职或长期审查。你没有下最后决定，却知道最后决定里有一句话来自自己，而且那句话少写了一半来由。"),
      ],
      effects: [add("relationships.friendship", -5), add("resources.reputation", 2), add("shadow.complicity", 4), add("shadow.harmDone", 5), add("shadow.guilt", 4), add("shadow.trustDebt", 5)],
    },
    {
      id: "sentence_outlived_meeting",
      title: "一句话比会议活得久",
      minYears: 5,
      maxYears: 18,
      text: [
        V(leftRole, "你已退休、调走或失去原来的位置，那份材料还夹在别人的档案里。你的工作证塞进旧抽屉，对方补发的工龄表上仍空着几年。"),
        V(moved, "你去了别处生活，偶然听说那人后来恢复了工作。消息传来时只占饭桌上一句，你当年写下的那句却曾占去他好几年。"),
        V(guilty, "你写了一份说明，承认旧怨影响过措辞，并在末尾签了真名。对方补回一点待遇，把通知收进信封；工龄表跳过的几年仍是一片空格。"),
        V(hardened, "你把那段经历讲成自己坚持原则的一次考验，后来连那场纠纷或考评怎样开始都记不清了。故事越讲越短，自己在其中站得越直。"),
        V(older, "晚辈整理旧物，问起一张会议通知。你说那阵子事情很多，随手把纸压到箱底；箱盖合上时很轻，纸里那个人的一生并不轻。"),
        F("多年后，有人把那份材料里的词念给你听。会议早散了，主持人也换了，那句由私怨磨尖的话仍夹在档案中，字迹没有老。"),
      ],
      effects: [add("shadow.hardness", 2), add("shadow.selfDeception", 3), add("shadow.trustDebt", 3), add("resources.happiness", -2)],
    },
  ],
});

const referralSlip = makeChain("referral_slip", {
  yearRange: [1962, 1975],
  ageRange: [22, 68],
  currentRegions: { hukou: ["rural"], cityTiers: ["village", "town", "county"] },
  category: "health",
  lifetimeProbability: 0.16,
  conditions: {
    all: [C("career.status", "in", ACTIVE)],
    any: [{ hasTag: "trained_barefoot_doctor" }, C("career.field", "eq", "grassroots_post")],
  },
  steps: [
    {
      id: "later_date",
      title: "转诊单上写了一个较晚的日期",
      minYears: 0,
      maxYears: 0,
      text: [
        V(ruralNow, "县里只给了几个住院床位，你协助排转诊。亲近的一家孩子病得急，你把他放在前面，又把独居老人胸痛的日期往后写；两种病都不能等，纸上却必须排成一列。"),
        V(urbanNow, "卫生院让你核对转院顺序。一位单位熟人把检查单递来时夹着介绍信，你先给他开了车票日期；另一名病人没有介绍信，只有反复来问的家属。"),
        V(poor, "亲戚答应替你家弄到紧缺药品，请你在转诊表上照顾一位熟人。你没有收钱，只把另一人的红笔急字改成蓝笔待查。"),
        V(female, "一名妇女反复说腹痛，旁人嫌她讲不清。你把她排在一位会说干部姓名的男病人后面，落笔时也相信会表达病情的人大概更急。"),
        F("基层转诊名额不够，你负责排先后。熟人的病历被放到上面，另一个不善争辩的名字得到较晚日期；医生按你排好的次序签字，介绍信的红章压住了下一行。"),
      ],
      effects: [add("resources.reputation", 2), add("shadow.complicity", 4), add("shadow.harmDone", 4), add("shadow.guilt", 2), add("shadow.selfDeception", 3), add("shadow.trustDebt", 4)],
    },
    {
      id: "bed_was_filled",
      title: "病床先住进了别人",
      minYears: 1,
      maxYears: 3,
      text: [
        V(leftRole, "你已不再经手转诊，县医院仍按旧单接收。家属赶来找你时，新负责人只看见日期，不知道它曾被改过；离岗把解释换了窗口，没有腾出床位。"),
        V(ruralNow, "排后的病人病情加重，家属借车连夜往县里送。第二天你看见车辙停在卫生室门口，桌上的转诊本仍摊在原来那页。"),
        V(urbanNow, "熟人住进病床，带来的水果分给了同屋。走廊里另一家人靠墙等加床，两只网兜放得很近，待遇却不在同一行。"),
        V(guilty, "你打电话或托车为排后的人另找位置，最终让他早了几天入院。病情多受了几天耽搁，你确实跑了路，也始终没向家属说明路为何变长。"),
        V(hardened, "你把转诊原则重新抄在墙上，强调急重优先。熟人的病历已经补齐了急重证明，规则因执行得很完整而更难追溯第一处偏向。"),
        F("床位给了排在前面的人，后面的病人继续等。你忙着处理新的咳嗽、发热和外伤，旧的一次先后很快混进每天都不够用的名额里。"),
      ],
      effects: [add("resources.reputation", -1), add("relationships.friendship", -3), add("shadow.complicity", 3), add("shadow.harmDone", 5), add("shadow.guilt", 4), add("shadow.trustDebt", 5)],
    },
    {
      id: "folded_carbon_copy",
      title: "一张复写纸折了很多年",
      minYears: 4,
      maxYears: 14,
      text: [
        V(leftRole, "你不再行医或办基层事务，旧转诊本也换了格式。那家人的复写联却一直留着，日期比任何人的回忆准确；你失去岗位后才发现，纸可以在没有你的地方继续作证。"),
        V(older, "晚年看病时，你也拿着单子在走廊等号。广播叫到别人，你想起当年排过的先后，却没有把今天的等待讲成偿还；护士只让你别堵住门。"),
        V(guilty, "你去向那家人说明当年改过日期，并交回保存的一份底单。他们用它补办了一项证明，临走把底单重新折成四折；病历袋里又多一张纸，病人走路仍要扶墙。"),
        V(hardened, "你仍认为熟人的孩子当时也很危险，后来每次讲起都先说床位太少。床位确实太少，而你在这句真话里替那个较晚的日期留出了藏身处。"),
        V(benefited, "受照顾的一家多年仍来送药问候，你成了他们口中的救命恩人。另一家的复写联折在抽屉里，纸边磨白，没有进入这份名声。"),
        F("医院后来添了病床，旧转诊制度也几经改变。那家人把复写联同药费收据订在一起，纸钉生了锈，两个日期的先后仍清清楚楚。"),
      ],
      effects: [add("shadow.hardness", 2), add("shadow.selfDeception", 3), add("shadow.trustDebt", 3), add("resources.reputation", 1)],
    },
  ],
});

const collectiveStock = makeChain("collective_stock", {
  yearRange: [1956, 1975],
  ageRange: [22, 65],
  lifetimeProbability: 0.14,
  conditions: {
    all: [C("career.status", "in", ACTIVE), C("career.field", "in", ["factory", "production_team", "grassroots_post"])],
    any: [C("career.level", "gte", 5), C("resources.reputation", "gte", 6), { hasTag: "production_team_accountant" }],
  },
  steps: [
    {
      id: "one_piece_under_coat",
      title: "领料单少写了一件",
      minYears: 0,
      maxYears: 0,
      text: [
        V(ruralNow, "你临时管队里的工具和建材，自家屋顶正漏雨。领瓦时你少写了十片，把多出的夹在柴车底下；集体少十片看不出，你家那块湿墙先干了。"),
        V(urbanNow, "车间让你代管一阵库房。家里缺一只合用的轴承，你把报废件里还能用的那只揣进棉衣；报废章已经盖过，机器却还认得它。"),
        V(poor, "孩子的课桌腿断了，你从单位领料余数里带回两根木条。第一回只为修桌，第二回便顺带拿了几枚钉子；领料单始终保持整数。"),
        V(female, "你管着托儿所和食堂的零散用品，家里布票不够，便把一块说是擦桌的棉布带走做衣襟。针脚很细，布从哪里来没人问得细。"),
        F("你有一阵负责领用集体材料。一次清点后，几件仍能使用的东西漏在账外。下班时，它们随你穿过门卫，填进家里早就量好的缺口。"),
      ],
      effects: [add("resources.wealth", 4), add("relationships.family", 2), add("shadow.complicity", 4), add("shadow.harmDone", 3), add("shadow.guilt", 2), add("shadow.selfDeception", 4), add("shadow.trustDebt", 3)],
    },
    {
      id: "shortage_became_waste",
      title: "缺口被写成了损耗",
      minYears: 1,
      maxYears: 4,
      text: [
        V(leftRole, "你已调岗或离开库房，接手的人清点出缺口，只能按旧账追到损耗一栏。你说交接时已经讲清，双方都找不到那张口头说明；东西留在你家，责任留在交接缝里。"),
        V(ruralNow, "修水渠或屋顶时少了那批材料，队里让各户再匀一点。你也从家里拿出两件，众人夸你顾全大局；你归还了一部分，夸奖却按全部计算。"),
        V(urbanNow, "车间检修临时缺件，几个人翻了半天库房。你知道自家抽屉里正有一只，仍跟着找，最后把短缺写成保管不善。"),
        V(guilty, "你趁夜把拿走的东西送回一部分，放在库门边假装上次漏清。物件回来了，清点时受过批评的人没有因此少挨那顿批。"),
        V(hardened, "你学会先在账上做出合理损耗，再决定哪些余料可以带走。第一次是顺手，后来有了次序；熟练使手脚更干净，也使家里慢慢齐全。"),
        F("盘点时出现一个小缺口，你把它并进自然损耗。真正需要那件东西的人多等了一阵，仓库照常落锁，你也照常把钥匙交回。"),
      ],
      effects: [add("resources.wealth", 3), add("resources.reputation", -1), add("shadow.complicity", 4), add("shadow.harmDone", 4), add("shadow.guilt", 3), add("shadow.selfDeception", 3), add("shadow.trustDebt", 4)],
    },
    {
      id: "object_in_daily_use",
      title: "那件东西一直很好用",
      minYears: 5,
      maxYears: 16,
      text: [
        V(leftRole, "你早已离开原单位，那件东西仍在家里日常使用。岗位变化使旧仓库与你无关，饭桌、门窗或机器上的零件却每天安静地证明，关系并没有完全断开。"),
        V(moved, "搬家时家人嫌那件旧东西沉，你仍让他们装上车。一路没人问来历，它从集体物资变成家中旧物，完成变化靠的是被使用得足够久。"),
        V(guilty, "你把保存较好的物件送回原单位，又补买了一件新的。库房员开了张新收条，旧盘点表仍压在别的年份里；当年挨批的人早已调走。"),
        V(hardened, "你指着那件耐用的东西教晚辈从前物资质量好。它的确耐用，耐用到来路被磨成一道家常掌故，只剩质量值得谈。"),
        V(benefited, "家里靠那些零散材料少花了不少钱，后来把省下的日子说成勤俭。你也确实会修会补；占用与手艺装在同一件物品里，很难再从外观分开。"),
        F("多年后，那件从仓库带回的东西仍在使用，漆掉了，边角被手摸亮。集体早已换过账本，它却靠实用获得了最稳妥的私人身份。"),
      ],
      effects: [add("resources.wealth", 2), add("shadow.hardness", 2), add("shadow.selfDeception", 4), add("shadow.trustDebt", 2)],
    },
  ],
});

export const midcenturyShadowArcEvents = [
  ...recruitmentRoster,
  ...workpointLedger,
  ...housingQueue,
  ...publicGrievance,
  ...referralSlip,
  ...collectiveStock,
];
