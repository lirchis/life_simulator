// Structural late-life events for people born in the nineteenth century and
// still alive during the Republic-era decades.  These events are deliberately
// sparse.  Two openings act as narrative safety nets after a long quiet spell;
// the other two pressures remain ordinary low-probability candidates.

const PREFIX = "elder_republic_";
const BIRTH_RANGE = [1840, 1874];
const YEAR_RANGE = [1915, 1949];
const ELDER_AGES = [75, 109];
const ALL_PLACES = { cityTiers: ["village", "town", "county", "city", "tier2", "tier1"] };

const C = (path, operator, value) => ({ path, [operator]: value });
const add = (path, value) => ({ path, add: value });
const V = (conditions, text) => ({ conditions, text });
const F = (text) => ({ text });
const tagged = (tag) => ({ hasTag: tag });
const missing = (tag) => ({ missingTag: tag });
const between = (eventId, minYears, maxYears) => ({
  eventOccurredBetween: { eventId: `${PREFIX}${eventId}`, minYears, maxYears },
});

const rural = { all: [C("location.currentCityTier", "in", ["village", "town"])] };
const urban = { all: [C("location.currentCityTier", "in", ["county", "city", "tier2", "tier1"])] };
const poor = { all: [C("resources.wealth", "lte", 35)] };
const secure = { all: [C("resources.wealth", "gte", 64)] };
const weak = { all: [C("resources.health", "lte", 35)] };
const strainedFamily = { all: [C("relationships.family", "lte", 34)] };
const closeFamily = { all: [C("relationships.family", "gte", 62)] };
const hasChildren = { all: [C("relationships.children", "gte", 1)] };
const migrated = { all: [C("location.migratedTimes", "gte", 1)] };
const woman = { all: [C("birth.gender", "eq", "female")] };
const wartime = { all: [C("meta.currentYear", "gte", 1937), C("meta.currentYear", "lte", 1945)] };

const handoffOpeningId = `${PREFIX}household_handoff`;
const displacementOpeningId = `${PREFIX}last_threshold_lost`;

export const republicanElderStructuralEvents = [
  {
    id: handoffOpeningId,
    title: "家账从你的席边挪开",
    category: "family",
    birthYearRange: BIRTH_RANGE,
    yearRange: [1915, 1947],
    ageRange: [75, 100],
    currentRegions: ALL_PLACES,
    maxOccurrences: 1,
    baseWeight: 18,
    lifetimeProbability: 0.24,
    narrativeSafetyNet: true,
    narrativeTier: "turning_point",
    narrativeDomain: `${PREFIX}household_handoff`,
    narrativeThread: { expiresAfterYears: 9 },
    conditions: {
      all: [C("relationships.family", "gte", 30), missing(`${PREFIX}household_handoff`)],
      any: [C("relationships.children", "gte", 1), C("relationships.family", "gte", 52)],
      none: [tagged("arc_old_age_handoff")],
    },
    text: [
      V({ all: [C("meta.currentYear", "lte", 1927), C("location.currentCityTier", "in", ["village", "town"])] }, "收租、纳粮或分家又要核一次账，晚辈把账簿从你席边拿走，请你只说哪块田挨着哪条沟。你说得比他翻页快，印章却已挂到他的腰间。"),
      V({ all: [C("career.field", "in", ["trade", "small_business", "family_workshop", "apprentice", "pharmacy"]), C("location.currentCityTier", "in", ["town", "county", "city", "tier2", "tier1"])] }, "铺里决定由晚辈接账，你交出柜门钥匙，仍把三个老主顾的赊欠背得分毫不差。新掌柜换了算盘珠，第一天便找不到你藏零钞的小抽屉。"),
      V(woman, "家里真正的米缸、药钱和亲戚往来多年都经你的手，分家纸上却只请男人交接。你把钥匙交给媳妇或女儿，又当着众人说清哪一笔钱从来不在那张纸上。"),
      V(poor, "家中没有多少可交的产业，只有欠账、粮缸和谁还能去做工。晚辈说往后由他拿主意，你把债主的脾气逐个讲完，最后留下一句别在饭前去借。"),
      V(closeFamily, "晚辈把家账接过去，每问一项都等你答完。你嘴上嫌他算盘慢，夜里却第一次不用把钥匙压在枕边；第二天醒来，手仍照旧往枕下摸。"),
      F("晚辈正式接过家中账簿、钥匙和对外说话的位置。你仍坐在原来的地方，来问事的人却开始先把脸转向另一把椅子。"),
    ],
    effects: [
      add("resources.freedom", -8), add("resources.happiness", -3), add("resources.reputation", -3), add("relationships.family", -2),
      { addTag: `${PREFIX}household_handoff` }, { addTag: "arc_old_age_handoff" },
      { scheduleEvent: { eventId: `${PREFIX}handoff_younger_gone`, delayYears: [2, 9], weightMultiplier: 18 } },
    ],
  },
  {
    id: `${PREFIX}handoff_younger_gone`,
    title: "接账的人先走了",
    category: "family",
    birthYearRange: BIRTH_RANGE,
    yearRange: [1917, 1956],
    ageRange: [77, 109],
    maxOccurrences: 1,
    baseWeight: 104,
    narrativeTier: "consequence",
    narrativeDomain: `${PREFIX}household_handoff`,
    narrativeThread: { close: true },
    requiresEvents: [handoffOpeningId],
    conditions: {
      all: [between("household_handoff", 2, 9), tagged(`${PREFIX}household_handoff`)],
    },
    text: [
      V(wartime, "接过家账的晚辈死在战事里，或从此没有消息。家里把他的衣冠或一件随身物送回来，你扶着棺木边沿，竟还记得几年前自己怎样嫌他算盘拨得慢。"),
      V(hasChildren, "替你当家的孩子先病故了。葬礼上有人来问旧账该找谁，你把孝布往上提了一下，说今日不算；第二天，那本账又摆回你面前，却没有把原来的力气一并送回。"),
      V(migrated, "接班的晚辈在外地去世，遗骨、衣物或一封迟到的信辗转送到你手里。路走了许多站，人只回来一只小包；你把包袱放在原先交账的那张桌上。"),
      V(poor, "接过重担的人被劳作和病拖垮，白发的你反而坐在灵前。家里没钱久停棺木，哭声和借钱声挤在同一天里，来帮忙的人先问米够不够。"),
      V(strainedFamily, "晚辈先走后，另一支亲属接管家事，也接管了对旧账的解释。你几次想纠正，众人说老人不要劳神；灵位前的香有人续，你的话没人续。"),
      F("接过家事的晚辈先于你离世。你替他收起算盘、钥匙或一双鞋，家中又换人当家；轮到你交代后事的话，被白发人送黑发人的仪式压回了喉咙里。"),
    ],
    effects: [
      add("relationships.family", -10), add("resources.happiness", -13), add("resources.health", -5), add("resources.freedom", -3),
      { addTag: `${PREFIX}younger_buried` },
    ],
  },
  {
    id: displacementOpeningId,
    title: "住了一生的门槛留在身后",
    category: "migration",
    birthYearRange: BIRTH_RANGE,
    yearRange: [1915, 1948],
    ageRange: [75, 103],
    currentRegions: ALL_PLACES,
    maxOccurrences: 1,
    baseWeight: 17,
    lifetimeProbability: 0.22,
    narrativeSafetyNet: true,
    narrativeTier: "turning_point",
    narrativeDomain: `${PREFIX}last_displacement`,
    narrativeThread: { expiresAfterYears: 7 },
    conditions: {
      all: [missing(`${PREFIX}last_displacement`)],
      any: [C("resources.wealth", "lte", 52), C("location.migratedTimes", "gte", 1), C("resources.health", "lte", 38)],
    },
    text: [
      V({ all: [C("meta.currentYear", "lte", 1936), C("location.currentCityTier", "in", ["village", "town"])] }, "欠租、旧债或一张新契把住了一生的屋地交给别人。你出门前摸了摸门框上几道身高刻痕，来接屋的人等在院里，不好催老人，也没有打算把屋还给老人。"),
      V({ all: [C("meta.currentYear", "lte", 1936), C("location.currentCityTier", "in", ["county", "city", "tier2", "tier1"])] }, "房东、债主或修路的人来收回住处，你被催着从后屋搬走。大件早已没有几件，最难装箱的是用了几十年的灶台；它不肯配合，只好整个留下。"),
      V(wartime, "战火逼近时，家人把你扶上车、船或独轮车，谁也没有问这是不是最后一次离家。你怀里抱着祖先牌位，路颠得厉害，几位祖先一路互相磕头。"),
      V(migrated, "你年轻时已经离乡一次，晚年又因债、灾或战事搬走。旧包袱还认得打结的方法，手却没有从前利落；家人等你系完，没有说这套本事最好别再用第三回。"),
      V(weak, "身体已经很难走远，住处仍因债务、灾害或战事不能再留。家人用门板或担架抬你出去，你从躺着的角度最后看了一遍屋梁。"),
      F("你在高龄时失去旧屋、旧地或原来的落脚处。家人催着只带要紧的东西，你把钥匙收进口袋；走出很远以后，才想起那扇门已经不再等它。"),
    ],
    effects: [
      add("location.migratedTimes", 1), add("resources.wealth", -11), add("resources.freedom", -8), add("resources.happiness", -9), add("resources.health", -5),
      { addTag: `${PREFIX}last_displacement` },
      { scheduleEvent: { eventId: `${PREFIX}borrowed_corner`, delayYears: [1, 7], weightMultiplier: 20 } },
    ],
  },
  {
    id: `${PREFIX}borrowed_corner`,
    title: "新住处没有你的旧规矩",
    category: "migration",
    birthYearRange: BIRTH_RANGE,
    yearRange: [1916, 1955],
    ageRange: [76, 110],
    maxOccurrences: 1,
    baseWeight: 108,
    narrativeTier: "consequence",
    narrativeDomain: `${PREFIX}last_displacement`,
    narrativeThread: { close: true },
    requiresEvents: [displacementOpeningId],
    conditions: {
      all: [between("last_threshold_lost", 1, 7), tagged(`${PREFIX}last_displacement`)],
    },
    text: [
      V(rural, "你住进亲属家的侧屋或村外临时棚子，清早仍按旧习惯起来看天。主人家的鸡不归你管，你提醒了两次下雨，第三次便坐着看他们追晒在外面的谷。"),
      V(urban, "新落脚处在会馆、寺庙、救济所或亲属家的后间，一张帘子算作墙。夜里有人磨牙，有人说梦话，你从不同口音里听出许多人都把故乡落在了别处。"),
      V(poor, "你没有钱另租住处，饭和床位都要看亲属当天怎样安排。盛饭的人说老人吃不了多少，你把碗底刮得很干净，第二顿仍按他的估计少盛半勺。"),
      V(closeFamily, "家人把最好的一角腾给你，仍容不下旧屋那些器物和习惯。晚辈怕你冷，给被子压得很厚；你半夜动不了，第二天先感谢，再要求少盖一层。"),
      V(strainedFamily, "借住久了，主人家开始把你放东西的位置一点点往里挪。没人开口赶你，常用的茶碗却从桌上移到柜顶；你够不到，也没有再请人拿。"),
      F("你在别人的屋檐下安顿下来，睡处、吃饭时辰和谁能进门都不再由你定。旧钥匙一直留在衣袋里，磨得发亮，没有一扇门再认它。"),
    ],
    effects: [
      add("resources.freedom", -6), add("resources.happiness", -5), add("relationships.family", -4), add("resources.health", -2),
      { addTag: `${PREFIX}borrowed_corner` },
    ],
  },
  {
    id: `${PREFIX}regime_receipts`,
    title: "同一只木箱收过几朝凭据",
    category: "history",
    birthYearRange: BIRTH_RANGE,
    yearRange: YEAR_RANGE,
    ageRange: ELDER_AGES,
    currentRegions: ALL_PLACES,
    maxOccurrences: 1,
    baseWeight: 13,
    lifetimeProbability: 0.2,
    narrativeTier: "historical_pressure",
    narrativeDomain: `${PREFIX}regime_witness`,
    narrativeThread: { expiresAfterYears: 3 },
    conditions: { all: [missing(`${PREFIX}regime_receipts`)] },
    text: [
      V({ all: [C("meta.currentYear", "lte", 1916)] }, "改用民国纪年后，你办事写新年份，回家仍按旧年号算自己的岁数。晚辈说这样会多活几岁，你说官府若肯认，寿桃也可以多吃一盘。"),
      V({ all: [C("meta.currentYear", "gte", 1917), C("meta.currentYear", "lte", 1927)] }, "县里的旗号、官名和捐税凭据换过几回，你把每张都收进同一只木箱。来收钱的人认新印，你先让他认上一张收据，双方都觉得对方的规矩更新得太慢。"),
      V({ all: [C("meta.currentYear", "gte", 1928), C("meta.currentYear", "lte", 1936), C("location.currentCityTier", "in", ["village", "town", "county"])] }, "保甲、地籍或户口又来重新登记，办事的人问你家从哪年住在这里。你从前朝讲起，他只给表格留了两行，只好把一辈子压成四个字：世居本地。"),
      V({ all: [C("meta.currentYear", "gte", 1928), C("meta.currentYear", "lte", 1936), C("location.currentCityTier", "in", ["city", "tier2", "tier1"])] }, "街名、门牌和办事机关接连换过，你出门仍报旧地名，车夫听得懂，新来的办事员反而要查图。城市先学会改名，人的脚慢慢才跟上。"),
      V(wartime, "通行证、粮票和货币随控制者变化，木箱里的印章彼此不承认。你学会出门前问今天该带哪一张纸；活到这个年纪，身份仍要按窗口重新证明。"),
      V({ all: [C("meta.currentYear", "gte", 1946), C("meta.currentYear", "lte", 1949)] }, "战事停下以后，户口、契纸和钱票仍在接连换样。你拿一张旧凭据去办事，窗口说要补新证明；活过许多制度的人，又被一张新表要求从头介绍自己。"),
      F("你把不同年月的契纸、税票、钱票和证明叠在一只木箱里。纸上的称谓彼此推翻，箱子照旧合得严实；晚辈要扔，你说先等下一套规矩来认祖宗。"),
    ],
    effects: [
      add("education.score", 2), add("resources.freedom", -2), add("resources.happiness", -2), add("attrs.mental", 1),
      { addTag: `${PREFIX}regime_receipts` },
    ],
  },
  {
    id: `${PREFIX}care_answered_for`,
    title: "有人照料，也有人替你回答",
    category: "family",
    birthYearRange: BIRTH_RANGE,
    yearRange: [1915, 1955],
    ageRange: [78, 109],
    currentRegions: ALL_PLACES,
    maxOccurrences: 1,
    baseWeight: 12,
    lifetimeProbability: 0.19,
    narrativeTier: "turning_point",
    narrativeDomain: `${PREFIX}care_without_voice`,
    narrativeThread: { expiresAfterYears: 3 },
    conditions: {
      all: [C("resources.health", "lte", 48), C("relationships.family", "gte", 15), missing(`${PREFIX}care_answered_for`)],
    },
    text: [
      V(rural, "家人替你决定睡哪间屋、几点吃药，也把粮柜钥匙挂到你够不到的墙钉上。你问为何挪了地方，他们说怕你操心；从此每次拿一把米，都要先证明自己不是在操心。"),
      V(urban, "看病时，医生问你哪里难受，陪来的人先替你答完。你在旁边补一句，他又解释你年纪大记不清；诊桌上摆着三个人的手，处方听了最快的那一双。"),
      V(secure, "家里请人照料你，饭、药和洗漱都有时辰。照护者称你老太爷或老太太，真正要改安排时却去问付钱的晚辈；称呼很尊敬，决定绕开了本人。"),
      V(poor, "你寄住亲属家，吃饭、如厕和睡下都要等别人腾出手。催得急会被说难伺候，不催又常被忘；你后来敲碗沿提醒，声音不雅，倒比叹气管用。"),
      V(woman, "你一生替许多人记住吃药、添衣和祭日，轮到自己被照料，晚辈却当着你面商量你的去处。你把话插进去，说我耳朵还在；屋里停了一下，又从头讲。"),
      V(weak, "身体需要人翻身、喂饭和扶起，屋里也渐渐把你当作一件要搬稳的东西。一次换衣时你叫众人先出去，只留一个人；门关上后，你才让照料继续。"),
      F("身体衰弱以后，家人确实来照料，也开始替你回答、替你保管、替你决定。你有时争回一句，有时懒得再说；一天仍被安排得很妥当，只少了几处由本人点头的时刻。"),
    ],
    effects: [
      add("resources.health", 2), add("resources.freedom", -9), add("resources.happiness", -5), add("relationships.family", -4),
      { addTag: `${PREFIX}care_answered_for` },
    ],
  },
];
