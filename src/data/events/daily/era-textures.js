const add = (path, value) => ({ path, add: value });

function once(id, title, category, yearRange, ageRange, text, extra = {}) {
  return {
    id,
    title,
    category,
    yearRange,
    ageRange,
    maxOccurrences: 1,
    baseWeight: 20,
    text,
    ...extra,
  };
}

export const dailyEraTextureEvents = [
  once("texture_shared_ox_day", "借牛的一天", "relationship", [1840, 1949], [12, 65], "农忙时，你家向邻户借来一头牛。牛比两家人都沉默，归还时却要连草料、人情和谁先开口道谢一起算清。", {
    birthFamilyClasses: ["tenant", "poor_peasant", "smallholder"],
    currentRegions: { cityTiers: ["village", "town"] },
    effects: [add("relationships.friendship", 4), add("resources.wealth", 2)],
  }),
  once("texture_winter_pawn_ticket", "冬衣进了当铺", "wealth", [1840, 1949], [18, 70], [
    { conditions: { all: [{ path: "resources.wealth", lte: 28 }] }, text: "粮缸快见底时，家里把冬衣送进当铺，换回的钱先买米。掌柜写票很快，你却反复看赎期；夏天尚未过完，寒冷已经先来催账。" },
    { conditions: { all: [{ path: "relationships.children", gte: 1 }] }, text: "家里缺钱，你把自己的厚衣当掉，孩子那件留下。柜台只按成色估价，不问谁冬天更怕冷；做父母的人只好替秤补上这一问。" },
    { text: "青黄不接时，家里把暂时用不上的冬衣送进当铺。柜台递来一张轻薄的票，收好它以后，衣裳才还有被赎回来的可能。" },
  ], {
    birthFamilyClasses: ["landless_laborer", "tenant", "poor_peasant", "shop_clerk", "craftsman"],
    effects: [add("resources.wealth", 4), add("resources.happiness", -4)],
  }),
  once("texture_oil_lamp_wick", "灯芯剪短一点", "family", [1870, 1949], [8, 75], [
    { conditions: { all: [{ path: "resources.wealth", lte: 28 }] }, text: "夜里点煤油灯，家里人把灯芯剪得只剩豆大一点。光不够照全屋，倒把每个人省油时的神情照得很清楚。" },
    { conditions: { any: [{ hasTag: "student" }, { path: "education.score", gte: 45 }] }, text: "你在煤油灯下看书，家人隔一阵便来拨短灯芯。学问想要亮一些，家用却要求它暗一点，双方在桌面上勉强议和。" },
    { text: "夜里点煤油灯，家里人把灯芯剪得很短。光只够照见一张桌子，省下来的那一点油却被认真算进明天。" },
  ], {
    effects: [add("resources.wealth", 2), add("education.score", 2)],
  }),
  once("texture_temple_fair_shadow_play", "庙会的影子戏", "random", [1840, 1949], [5, 70], [
    { conditions: { all: [{ path: "meta.age", lte: 10 }] }, text: "大人带你挤到庙会白幕前，皮影一出场，你只顾看刀枪怎样碰在一起。戏里的忠奸尚未听懂，散场时手里那根糖棍倒记得很清楚。" },
    { conditions: { all: [{ path: "location.currentCityTier", in: ["village", "town"] }, { path: "resources.wealth", lte: 40 }] }, text: "庙会是少有不用买票的热闹，你们早早占在白幕边。锣鼓响过，皮影替穷人演完一场富贵，回家仍要摸黑走田埂。" },
    { text: "庙会上白幕后亮起油灯，皮影人物用几根细杆走遍忠奸离合。你站得腿酸也没走，直到收戏的人把整座江山装回木箱。" },
  ], {
    currentRegions: { cityTiers: ["village", "town", "county"] },
    effects: [add("resources.happiness", 5), add("relationships.friendship", 2)],
  }),
  once("texture_letter_writer_stall", "替人写一封信", "relationship", [1840, 1949], [16, 72], [
    { conditions: { all: [{ path: "location.currentCityTier", in: ["village", "town"] }, { path: "education.score", gte: 55 }] }, text: "邻人知道你识字，带着地址来请你写信。收成写得简略，欠债换成一句‘家中尚可’，乡里的体面由你替他斟酌轻重。" },
    { conditions: { all: [{ path: "birth.gender", eq: "female" }] }, text: "一位妇人低声请你代写给远方亲人的信，许多家事不能直说。你把她的原话写得端正，却没有擅自把委屈改成客气。" },
    { text: "有人请你代写家书，来人说得断断续续，你边听边问清地名。挂念写得直白，难堪留有余地；到落款时，写信和说信的人都停了一会儿。" },
  ], {
    conditions: { all: [{ path: "education.score", gte: 35 }] },
    effects: [add("resources.reputation", 3), add("relationships.friendship", 3)],
  }),
  once("texture_market_scale_argument", "秤杆往哪边低", "wealth", [1840, 1949], [15, 70], [
    { conditions: { all: [{ path: "resources.wealth", lte: 32 }] }, text: "称粮时秤星稍偏，你立刻叫住买主重称。差的不过一点，对家里却是一顿饭；穷人的计较不是性情，是数目真的不能含糊。" },
    { conditions: { all: [{ path: "meta.currentYear", lte: 1911 }] }, text: "集上用的秤、斗和钱色各有说法，你同对方争了半天。官定尺度挂在墙上，真正做买卖时还得靠围观者一起盯秤。" },
    { text: "赶集称货时，买卖双方同时盯住秤星，谁都觉得秤杆偏向别人。最后重称一次、各退一点，围观的人比做成买卖的双方更满意。" },
  ], {
    currentRegions: { cityTiers: ["village", "town", "county"] },
    effects: [add("resources.wealth", -1), add("resources.happiness", 2)],
  }),
  once("texture_river_ferry_wait", "等一班渡船", "migration", [1840, 1965], [8, 78], [
    { conditions: { all: [{ path: "meta.age", lte: 12 }] }, text: "大人牵你在渡口等船，不许靠近湿滑的石阶。你蹲着看缆绳和浮木，船迟了多久并不清楚，只知道带来的干粮已经吃掉一半。" },
    { conditions: { all: [{ path: "location.currentCityTier", in: ["village", "town"] }, { path: "resources.wealth", lte: 40 }] }, text: "你挑着东西等渡船，舍不得另雇小舟，只能随众人看水色。货担越等越沉，船钱却不会因腰酸少收。" },
    { text: "渡船迟迟没靠岸，挑担的、赶路的和探亲的人一同望着水面。几段陌生人的家事先聊完了，船才从对岸慢慢解缆。" },
  ], {
    currentRegions: { provinces: ["hunan", "hubei", "jiangxi", "anhui", "jiangsu", "zhejiang", "fujian", "guangdong", "guangxi", "sichuan"] },
    effects: [add("relationships.friendship", 2), add("resources.happiness", 1)],
  }),
  once("texture_braided_queue_morning", "重新梳好辫子", "family", [1840, 1910], [6, 70], [
    { conditions: { all: [{ path: "meta.age", lte: 12 }] }, text: "清早，大人替男孩重新梳紧辫子，剃过的头皮仍有些发凉。孩子只嫌梳齿扯得疼，关于服制与王朝的道理暂由大人承担。" },
    { conditions: { all: [{ path: "resources.wealth", lte: 35 }] }, text: "你自己用旧梳子理顺辫发，断齿处总勾住几根头发。规矩要求人人一样整齐，家境却连梳子是否完整都分得清楚。" },
    { text: "天刚亮，家人替你把辫子重新梳好，头皮被扯得发紧。每日重复的装束最像天生规矩，正因为很少有人记得它也有开始。" },
  ], {
    genders: ["male"],
    effects: [add("resources.freedom", -3), add("attrs.mental", 1)],
  }),
  once("texture_bound_feet_room", "小鞋与长夜", "health", [1840, 1911], [5, 10], "长辈按旧俗裹紧你的脚。疼痛被说成体面与前程，哭声则被劝得更轻；身体最早学会的，不是美，而是规矩如何留下伤。", {
    genders: ["female"],
    birthFamilyClasses: ["merchant", "scholar_gentry", "landlord"],
    effects: [add("resources.health", -12), add("resources.freedom", -10), add("resources.happiness", -8), { addTrait: "old_rules_body" }],
  }),
  once("texture_sewing_cloth_soles", "灯下纳鞋底", "family", [1840, 1977], [10, 72], [
    { conditions: { all: [{ path: "birth.gender", eq: "female" }, { path: "resources.wealth", lte: 45 }] }, text: "你在灯下把碎布粘成袼褙，再一针针纳紧。全家走路的鞋底从你手里出来，这份工却从不写进谁的职业。" },
    { conditions: { all: [{ path: "location.currentCityTier", in: ["village", "town"] }] }, text: "农闲的晚上，家里人围着灯纳鞋底。锥子穿过厚布要费很大力气，闲话则穿得很轻，常常一句就到了邻村。" },
    { text: "灯下有人把碎布一层层粘起，再用针线纳成鞋底。针脚很密，话不多；一家人的远路，常从这样的夜晚开始。" },
  ], {
    effects: [add("relationships.family", 4), add("resources.wealth", 2)],
  }),
  once("texture_patch_mosquito_net", "补蚊帐", "family", [1880, 1977], [8, 75], [
    { conditions: { all: [{ path: "resources.wealth", lte: 35 }] }, text: "旧蚊帐已经补过多次，家里仍舍不得换，只把新破口同旧补丁接起来。布越来越像一张地图，蚊子负责逐夜核对边界。" },
    { conditions: { all: [{ path: "meta.age", lte: 12 }] }, text: "大人补蚊帐时让你从里面找亮处，你指了几次，又漏掉一孔。晚上蚊子准确找到那处，验收结果在额头上留下一个包。" },
    { text: "入夏前，你们把蚊帐取下洗净，一处处补好小洞。针脚不必漂亮，只要不留缝；可蚊子总像比全家多读了一遍图纸。" },
  ], {
    currentRegions: { provinces: ["hunan", "hubei", "jiangxi", "anhui", "jiangsu", "zhejiang", "fujian", "guangdong", "guangxi", "sichuan", "guizhou", "yunnan", "hainan"] },
    effects: [add("resources.health", 2), add("resources.happiness", 1)],
  }),
  once("texture_village_well_news", "井台边的消息", "relationship", [1840, 1977], [12, 75], [
    { conditions: { all: [{ path: "birth.gender", eq: "female" }] }, text: "你同妇人们在井台排着打水，谁家添丁、谁家病了都在辘轳声里传开。消息免费，挑回去的水却一滴也不会替你减轻。" },
    { conditions: { all: [{ path: "meta.age", gte: 55 }] }, text: "你到井边不只为挑水，也替没出门的人听些消息。年轻人说得快，你偶尔补一句旧账，村里的新闻便顺带有了前情。" },
    { text: "井台边排着水桶，等水的人顺便交换婚丧、收成和远方来信。消息沿路越传越圆，只有满桶的水仍老实保持原来的重量。" },
  ], {
    currentRegions: { cityTiers: ["village", "town"] },
    effects: [add("relationships.friendship", 3), add("resources.happiness", 1)],
  }),

  once("texture_teahouse_shared_newspaper", "一张报纸轮着看", "random", [1912, 1949], [15, 72], [
    { conditions: { all: [{ path: "education.score", gte: 60 }] }, text: "茶客把报纸推到你面前，请你念一段时局消息。生僻地名刚读完，四周已有人开始判断胜负；识字给了你发言顺序，没有给你裁决权。" },
    { conditions: { all: [{ path: "meta.currentYear", gte: 1937 }] }, text: "战事年月，茶馆里一张报纸被轮流翻看，伤亡和失地常被人念出声。有人追问自家亲人所在的地方，报纸却只印到省名。" },
    { text: "茶馆里只有一张报纸，几个人从不同方向凑着读。识字的念新闻，不识字的听完照样评论，纸页每翻一次都要先经过众人同意。" },
  ], {
    currentRegions: { cityTiers: ["town", "county", "city", "tier2", "tier1"] },
    effects: [add("education.score", 3), add("relationships.friendship", 2)],
  }),
  once("texture_republic_tram_bell", "电车铃响", "random", [1912, 1949], [8, 75], "有轨电车摇着铃穿过街面，人力车、行人和摊贩各自让路。现代化来得叮当作响，却不负责把每个人都载上去。", {
    currentRegions: { provinces: ["shanghai", "beijing", "tianjin"] , cityTiers: ["city", "tier2", "tier1"] },
    effects: [add("resources.happiness", 2), add("education.score", 2)],
  }),
  once("texture_cinema_newsreel", "银幕前的世界", "random", [1920, 1949], [10, 70], [
    { conditions: { all: [{ path: "meta.age", lte: 15 }] }, text: "大人带你进电影院，新闻短片里的军队与典礼看得似懂非懂。你等的是后面的故事片，银幕却先让远方世界在眼前走了一遍。" },
    { conditions: { all: [{ path: "resources.wealth", lte: 38 }] }, text: "你难得买一次便宜场的票，连新闻短片也不肯错过。银幕上的名流衣着光鲜，散场后你仍先摸一摸口袋里剩下的车钱。" },
    { text: "正片开始前，新闻短片放过远方城市、军队和政治人物。放映机响得比解说更真切，散场后门口仍是本城熟悉的车铃与灰尘。" },
  ], {
    currentRegions: { cityTiers: ["city", "tier2", "tier1"] },
    conditions: { all: [{ path: "resources.wealth", gte: 25 }] },
    effects: [add("resources.wealth", -2), add("resources.happiness", 5)],
  }),
  once("texture_rickshaw_rain_cape", "雨里叫车", "migration", [1912, 1949], [15, 72], [
    { conditions: { all: [{ path: "resources.wealth", lte: 35 }] }, text: "雨越下越大，你仍同车夫把价讲了几回，最后只坐最难走的一段。鞋和裤脚还是湿了，省下的钱也确实够明天一顿早饭。" },
    { conditions: { all: [{ path: "birth.gender", eq: "female" }, { path: "meta.currentYear", "lte": 1935 }] }, text: "雨天独自赶路，你叫车时先看车夫是否可靠，再谈价钱。车篷挡住一部分雨，也替街上的目光暂时围出一点安全。" },
    { text: "雨下得急，你同车夫为一段路的价钱来回讲。最后两边都退一点：他披着湿蓑衣跑，你坐在车上，谁也没有占到天气的便宜。" },
  ], {
    currentRegions: { cityTiers: ["county", "city", "tier2", "tier1"] },
    effects: [add("resources.wealth", -2), add("resources.happiness", -1)],
  }),
  once("texture_school_chalk_stub", "半截粉笔", "school", [1912, 1949], [7, 20], "先生把一截粉笔用到几乎捏不住，黑板也擦不干净。教室缺很多东西，提问倒不缺；窗外一有动静，全班的注意力就先集体出走。", {
    conditions: { any: [{ path: "education.level", neq: "none" }, { hasTag: "student" }] },
    effects: [add("education.score", 4), add("resources.happiness", 1)],
  }),
  once("texture_factory_time_whistle", "汽笛替钟点说话", "career", [1915, 1949], [15, 60], "厂里的汽笛一响，进门、开工和歇手都有了统一时刻。你的身体第一次被机器规定速度，迟到的几分钟也第一次有了明确价钱。", {
    currentRegions: { cityTiers: ["city", "tier2", "tier1"] },
    conditions: { any: [{ path: "career.field", eq: "factory" }, { hasTag: "factory_worker" }, { path: "birth.familyClass", eq: "worker_family" }] },
    effects: [add("resources.health", -4), add("resources.wealth", 3)],
  }),
  once("texture_blue_ink_home_letter", "蓝墨水家书", "relationship", [1912, 1977], [16, 72], [
    { conditions: { all: [{ path: "location.migratedTimes", gte: 1 }, { path: "resources.wealth", lte: 40 }] }, text: "你在外谋生，给家里写信只说工作尚可，没写住处漏雨和钱快用完。信封里夹了一点汇款，薄纸于是比安慰更有重量。" },
    { conditions: { all: [{ path: "relationships.children", gte: 1 }] }, text: "你写信问孩子吃饭、读书和衣服够不够，自己的难处只用一句‘勿念’带过。父母写家书常很节省篇幅，担心却从不遵守纸张限制。" },
    { text: "你给家里写信，只报平安，不写最难的那一段。蓝墨水在薄纸上慢慢洇开，纸比人先回到故乡，也比人更会把疲惫折好。" },
  ], {
    conditions: { any: [{ hasTag: "migrant" }, { path: "location.migratedTimes", gte: 1 }] },
    effects: [add("relationships.family", 5), add("resources.happiness", 1)],
  }),
  once("texture_coal_briquette_dust", "煤球灰", "family", [1920, 1977], [12, 75], [
    { conditions: { all: [{ path: "resources.wealth", lte: 35 }] }, text: "家里把碎煤和煤末也留着掺用，你蹲在炉前反复引火。屋子暖得慢，煤却烧得很仔细；穷日子的燃料没有资格只挑整齐的。" },
    { conditions: { all: [{ path: "meta.age", lte: 16 }] }, text: "大人让你看着炉门，别把煤球一次添太多。你还是弄得满手黑，洗过两遍，指甲缝仍诚实交代今天做过什么。" },
    { text: "你生炉子时弄了一手煤灰，屋里过了许久才暖。煤球码得很有秩序，烟却偶尔倒灌，提醒全家它不参加室内管理。" },
  ], {
    currentRegions: { cityTiers: ["county", "city", "tier2", "tier1"] },
    effects: [add("resources.health", -2), add("resources.happiness", 2)],
  }),

  once("texture_enamel_mug_name", "搪瓷缸上的名字", "family", [1950, 1990], [6, 75], [
    { conditions: { all: [{ path: "meta.age", lte: 12 }] }, text: "大人在搪瓷缸底写上你的名字，免得学校或托儿所拿错。你真正认它靠的是杯沿那块缺漆，姓名反而要多看一会儿。" },
    { conditions: { all: [{ path: "career.status", eq: "employed" }] }, text: "单位里一排搪瓷缸长得相像，你在自己的杯身写名，又把把手缠一圈线。劳动集体讲求整齐，喝水仍需要一点私人标记。" },
    { text: "搪瓷缸底磕掉一小块漆，侧面还写着名字。它跟着搬家、上班和吃药用了许多年，杯上的字比不少地址留得更久。" },
  ], {
    effects: [add("resources.wealth", 1), add("resources.happiness", 2)],
  }),
  once("texture_lost_ration_coupon", "少了一张票", "wealth", [1955, 1993], [12, 75], [
    { conditions: { all: [{ path: "resources.wealth", lte: 32 }] }, text: "少了一张粮票，全家把抽屉和衣袋翻得见底。票面不大，却关系月底几顿饭；找到以前，没有人真能把它当成小事。" },
    { conditions: { all: [{ path: "meta.age", lte: 18 }] }, text: "大人让你拿票去买东西，你到柜台才发现少了一张。回程一路摸遍口袋，最后它黏在票夹背面，你的委屈和庆幸同时松下来。" },
    { text: "一张票证怎么也找不到，全家进行了一场规模远大于票面的追查。它从旧衣口袋出现时，人人都松口气，又人人声称早就猜到在那里。" },
  ], {
    effects: [add("resources.happiness", -1), add("relationships.family", 2)],
  }),
  once("texture_village_loudspeaker", "高音喇叭先醒", "random", [1950, 1982], [5, 75], "村头高音喇叭比许多人起得早，通知、天气和口号顺着晨雾传来。你有时没听清内容，却很难没听见它。", {
    currentRegions: { cityTiers: ["village", "town"] },
    effects: [add("resources.happiness", 1)],
  }),
  once("texture_coop_candy_jar", "供销社的糖罐", "wealth", [1954, 1985], [5, 15], "供销社玻璃罐里的糖颜色鲜亮，你趴在柜台前看了很久。大人买的是盐和针线，最后多要了一小块糖，像给日子加了一粒标点。", {
    currentRegions: { cityTiers: ["village", "town", "county"] },
    effects: [add("resources.wealth", -1), add("resources.happiness", 5), add("relationships.family", 2)],
  }),
  once("texture_bicycle_chain_grease", "自行车掉链子", "health", [1950, 1998], [12, 72], [
    { conditions: { all: [{ path: "meta.age", lte: 18 }] }, text: "骑到半路链条掉了，你学着大人的样子把车倒过来，试了几次才挂回齿盘。校服袖口多一道油印，算是手艺留下的毕业证。" },
    { conditions: { all: [{ path: "career.status", eq: "employed" }, { path: "resources.wealth", lte: 45 }] }, text: "上班路上自行车掉链，你蹲在路边急着修，眼睛还在估算迟到几分钟。车修好时手已全黑，工厂或单位的钟并不会因此走慢。" },
    { text: "自行车链条半路掉了，你把车支在路边重新挂好。手指沾满黑油，脚蹬转过一圈没有异响，这场小修理便算通过验收。" },
  ], {
    currentRegions: { cityTiers: ["town", "county", "city", "tier2", "tier1"] },
    effects: [add("resources.health", -1), add("resources.happiness", 2)],
  }),
  once("texture_northern_public_bath", "澡堂的号牌", "random", [1950, 1995], [10, 80], "你拿着小号牌进公共澡堂，水汽把所有人的轮廓都变得平等。唯一明显的阶层差别，是谁能抢到离热水更近的位置。", {
    currentRegions: { provinces: ["beijing", "tianjin", "hebei", "shanxi", "neimenggu", "liaoning", "jilin", "heilongjiang", "shandong", "henan", "shaanxi", "gansu"] , cityTiers: ["county", "city", "tier2", "tier1"] },
    effects: [add("resources.health", 3), add("resources.happiness", 3)],
  }),
  once("texture_borrowed_thermos", "借一壶热水", "relationship", [1950, 1995], [8, 80], [
    { conditions: { all: [{ path: "location.currentCityTier", in: ["county", "city", "tier2", "tier1"] }, { path: "resources.wealth", lte: 45 }] }, text: "公用灶或水房不方便，邻居抱暖壶来借开水。热水倒完，人没马上走，狭窄楼道便临时兼作了会客厅。" },
    { conditions: { all: [{ path: "meta.age", gte: 60 }] }, text: "老邻居来借一壶热水，你顺便问了药吃完没有。归还时对方带来两块点心，人情往来总努力把一壶水算得不欠不余。" },
    { text: "邻居来借热水，顺手带来几句消息，归还暖壶时又多聊片刻。木塞拔开的白气很快散了，院子或楼道里的人情多留了一会儿。" },
  ], {
    effects: [add("relationships.friendship", 4), add("resources.happiness", 2)],
  }),
  once("texture_open_air_movie_sheet", "露天电影", "random", [1950, 1988], [5, 75], "放映队支起白幕，附近的人搬着凳子赶来。风把银幕吹得起伏，英雄的脸偶尔皱成一团，没人舍得因此提前离场。", {
    currentRegions: { cityTiers: ["village", "town", "county"] },
    effects: [add("resources.happiness", 6), add("relationships.friendship", 3)],
  }),
  once("texture_work_point_book", "工分本上的一横", "career", [1958, 1977], [14, 70], "收工后，记分员在本子上添了一横。一天的腰酸背痛被压成一个数字，你看了看，明白数字也会累，只是它不喊疼。", {
    currentRegions: { cityTiers: ["village", "town"] },
    effects: [add("resources.health", -3), add("resources.wealth", 2)],
  }),
  once("texture_newspaper_window_patch", "报纸糊窗", "family", [1950, 1977], [8, 75], [
    { conditions: { all: [{ path: "resources.wealth", lte: 30 }] }, text: "窗上的破处越来越多，家里用旧报纸和面糊一层层补。纸上说的是建设与丰收，夜风仍从没粘牢的边角检查家中实际温度。" },
    { conditions: { all: [{ path: "meta.age", lte: 14 }] }, text: "大人糊窗时让你递报纸，你先挑有图的一块留下。补好后那半张图倒贴在窗上，整个冬天只有你知道它原来是什么。" },
    { text: "窗纸破了，家里裁旧报纸补上，再用手把边角压平。白天还能读到半篇消息，夜里天下大事便同屋内寒气一起贴在窗上。" },
  ], {
    conditions: { all: [{ path: "resources.wealth", lte: 35 }] },
    effects: [add("resources.wealth", 1), add("resources.health", -1), add("education.score", 1)],
  }),
  once("texture_sewing_machine_wedding", "缝纫机进门", "relationship", [1965, 1990], [18, 45], "婚后添置的缝纫机抬进家门，亲友围着看了几圈。它既是体面，也是往后许多年补衣、改裤脚和踩到腿酸的日常。", {
    conditions: { all: [{ path: "relationships.partnerStatus", in: ["partnered", "married"] }] },
    effects: [add("resources.wealth", -5), add("relationships.family", 5), add("resources.happiness", 4)],
  }),
  once("texture_work_unit_sports_day", "单位运动会", "career", [1952, 1992], [18, 60], [
    { conditions: { all: [{ path: "career.field", in: ["factory", "manual_worker", "textile"] }] }, text: "厂里开运动会，平日搬料最快的人未必最会跑步。你被工友推去参加接力，名次一般，车间却为交接棒讨论得比生产会还认真。" },
    { conditions: { all: [{ path: "meta.age", gte: 45 }] }, text: "单位运动会缺人，你被安排参加趣味项目。年轻人争名次，你更关心别扭了腰；最后大家都去食堂领奖，奖品是同一份加菜。" },
    { text: "单位开运动会，你被临时安排一个项目。成绩普通、口号响亮，拍照时队伍很齐；赛后最受一致好评的仍是食堂多出的那道菜。" },
  ], {
    conditions: { all: [
      { path: "career.status", eq: "employed" },
      { path: "career.field", in: ["factory", "textile", "state_unit", "public_sector", "teacher", "education", "healthcare", "doctor", "nurse", "grassroots_post", "shop_clerk", "mine", "railway", "professional"] },
    ] },
    effects: [add("resources.health", 3), add("relationships.friendship", 3), add("resources.happiness", 3)],
  }),

  once("texture_rooftop_tv_antenna", "屋顶调天线", "family", [1980, 1998], [8, 72], [
    { conditions: { all: [{ path: "meta.age", lte: 15 }] }, text: "大人在屋顶慢慢转天线，你守着电视负责喊清不清楚。画面刚稳定，你一激动喊早了一次，屋顶的人只好把刚转过的位置再猜回来。" },
    { conditions: { all: [{ path: "resources.wealth", lte: 40 }] }, text: "几户人共看一台电视，也共用一副屋顶天线。谁上楼调、谁在下面喊全靠临时分工，设备不富裕，合作倒练得熟。" },
    { text: "有人在屋顶转天线，楼下的人隔窗大喊‘还有雪花’。方向靠吼，画面靠运气，整栋楼为同一个频道短暂组成技术小组。" },
  ], {
    currentRegions: { cityTiers: ["town", "county", "city", "tier2", "tier1"] },
    effects: [add("relationships.friendship", 3), add("resources.happiness", 5)],
  }),
  once("texture_cassette_pencil_rewind", "铅笔倒磁带", "random", [1984, 2003], [8, 45], [
    { conditions: { all: [{ path: "meta.age", lte: 16 }] }, text: "录音机吐出一截磁带，你怕被大人发现，拿铅笔一点点卷回去。修好后先倒到那首歌，旋律仍在，开头多了一小段被你弄皱的杂音。" },
    { conditions: { all: [{ path: "resources.wealth", lte: 40 }] }, text: "磁带被机器咬了，你舍不得丢，用铅笔慢慢收回盒里。买新的一盘不算天价，却足够让耐心忽然成为很经济的技术。" },
    { text: "磁带被机器咬出一截，你用六角铅笔缓缓卷回去，再小心压平皱处。音乐工业很宏大，家庭维修主要依靠一支文具。" },
  ], {
    effects: [add("resources.happiness", 4), add("attrs.mental", 1)],
  }),
  once("texture_post_office_long_call", "邮局长途电话", "relationship", [1980, 2005], [16, 75], "你在邮局或公用电话亭打长途，接通后先喊几声‘听见没有’。分钟数跳得很快，真正想说的话只好排着队往外挤。", {
    conditions: { any: [{ hasTag: "migrant" }, { path: "location.migratedTimes", gte: 1 }] },
    effects: [add("resources.wealth", -3), add("relationships.family", 5), add("resources.happiness", 2)],
  }),
  once("texture_train_hard_seat_bags", "硬座与行李", "migration", [1978, 2010], [16, 70], [
    { conditions: { all: [{ path: "location.migratedTimes", gte: 1 }, { path: "career.status", in: ["employed", "gig_worker", "self_employed"] }] }, text: "你带着铺盖和装得很紧的包挤上硬座车，去远处谋生。邻座问工资和去向，你说得含糊；车票把人送往机会，也不保证那里留有位置。" },
    { conditions: { all: [{ path: "resources.wealth", lte: 38 }] }, text: "为了省钱，你买长途硬座，夜里困得点头又怕行李被拿错。煮鸡蛋、热水和陌生人让出的半寸靠背，帮你把一夜拆成许多小段。" },
    { text: "你挤上长途硬座车厢，行李、茶缸和食物都像有临时座位，只有人经常没有。天亮时腰很酸，车窗外的目的地却真的近了。" },
  ], {
    conditions: { any: [{ hasTag: "migrant" }, { path: "location.migratedTimes", gte: 1 }] },
    effects: [add("resources.health", -3), add("resources.happiness", 2)],
  }),
  once("texture_family_photo_studio", "照一张全家福", "family", [1978, 2002], [5, 80], [
    { conditions: { all: [{ path: "relationships.children", gte: 1 }] }, text: "全家在照相馆里排位置，孩子刚被哄住，摄影师便喊别眨眼。快门只响一下，大人各自的疲惫都很懂事地没有显影。" },
    { conditions: { all: [{ path: "location.currentCityTier", in: ["village", "town", "county"] }] }, text: "难得全家都在，大家换上体面的衣服去照相。布景里的柱子和花园比真的还整齐，只有鞋上的一点土坚持来自现实。" },
    { text: "全家在照相馆的布景前排好位置，摄影师让大家别眨眼。快门只响一下，谁站中间、谁抱孩子，却把家里的秩序保存了很多年。" },
  ], {
    effects: [add("resources.wealth", -2), add("relationships.family", 6), add("resources.happiness", 4)],
  }),
  once("texture_night_market_calculator", "摊位上的计算器", "wealth", [1985, 2002], [18, 65], "摊主在计算器上飞快按出一个价，你还价，他又按一遍，仿佛数字经过机器就更公正。最后成交时，双方都保留了胜利的表情。", {
    currentRegions: { cityTiers: ["town", "county", "city", "tier2", "tier1"] },
    effects: [add("resources.wealth", -2), add("resources.happiness", 3)],
  }),
  once("texture_pager_number_code", "传呼机上的数字", "relationship", [1992, 2001], [18, 55], "传呼机响了一声，屏幕上只有一串数字。消息短得像暗号，回电话的钱却按分钟认真计算；你走到街边找了一部公用电话。", {
    currentRegions: { cityTiers: ["county", "city", "tier2", "tier1"] },
    effects: [add("resources.wealth", -2), add("relationships.friendship", 3)],
  }),
  once("texture_newspaper_job_ad", "报缝里的招聘", "career", [1992, 2006], [18, 38], "你用笔圈出报纸上的招聘信息，再照着地址去找。职位写得很大，门脸有时很小；‘面议’两个字，通常意味着双方都还没有底。", {
    effects: [add("resources.freedom", 2), add("resources.achievement", 2)],
  }),
  once("texture_vcd_disc_rental", "租回一张影碟", "random", [1995, 2006], [8, 60], [
    { conditions: { all: [{ path: "meta.age", lte: 15 }] }, text: "你跟着大人去影碟店挑片，封面上的热闹比简介更有说服力。机器读碟时你蹲在旁边等，卡住一次，便自告奋勇擦一次。" },
    { conditions: { all: [{ path: "location.currentCityTier", in: ["village", "town"] }, { path: "resources.wealth", lte: 48 }] }, text: "村镇影碟店的新片不多，你租回一张同邻居几家一起看。画面卡住时满屋人都给意见，机器只听负责擦碟的那一个。" },
    { text: "你从影碟店租回一张碟，机器读了几次才成功。画面偶尔停住，全屋人便一同等着，仿佛这段卡顿也属于剧情。" },
  ], {
    effects: [add("resources.wealth", -1), add("resources.happiness", 5), add("relationships.family", 2)],
  }),
  once("texture_appliance_manual_drawer", "说明书那一抽屉", "family", [1985, 2010], [18, 75], [
    { conditions: { all: [{ path: "meta.age", gte: 60 }] }, text: "新电器的说明书字小、按键多，你先把常用步骤折出一角。后来仍会按错，家里人却发现你比他们更记得说明书究竟放在哪。" },
    { conditions: { all: [{ path: "resources.wealth", lte: 40 }] }, text: "家里攒钱添了一件电器，保修卡和说明书都套袋收好。谁也不敢乱试，故障时全家围着看，仿佛多看几个人便能省下一次维修费。" },
    { text: "家里添了新电器，说明书被郑重收进专门的抽屉。真正出故障时大家先凭经验按键，直到有人想起，科技其实附送过答案。" },
  ], {
    effects: [add("resources.wealth", -4), add("resources.happiness", 3)],
  }),

  once("texture_internet_cafe_resume", "网吧里改简历", "career", [1998, 2012], [18, 36], "你在网吧改简历，旁边有人打游戏，身后打印机一页页吐纸。未来被压进一张 A4 纸里，字体调大一号都像在替自己争取空间。", {
    currentRegions: { cityTiers: ["town", "county", "city", "tier2", "tier1"] },
    effects: [add("resources.wealth", -1), add("resources.achievement", 3)],
  }),
  once("texture_charger_family_diplomacy", "只剩一个充电口", "family", [2008, 2035], [10, 80], [
    { conditions: { all: [{ path: "meta.age", lte: 18 }] }, text: "你想给设备充电，大人说先让工作电话用。你举出明早上课也要用的理由，家庭谈判最后按电量排序，百分之三的人获得优先席。" },
    { conditions: { all: [{ path: "meta.age", gte: 65 }] }, text: "家人把靠手边的充电口留给你，免得夜里摸索。你仍常忘记插上电，第二天只好解释，不是人联系不上，是手机先睡了。" },
    { text: "家里方便的充电口不够，几部设备都声称自己更急。插座临时承担家庭外交，剩余电量成为最少受到质疑的证词。" },
  ], {
    effects: [add("resources.happiness", 2), add("relationships.family", -1)],
  }),
  once("texture_parcel_station_shelves", "快递架上找名字", "random", [2013, 2035], [12, 80], [
    { conditions: { all: [{ path: "meta.age", gte: 65 }] }, text: "你拿着取件码在架前一排排核对，工作人员提醒看尾号，不必把所有包裹都读一遍。找到后你先确认寄件人，免得把晚辈的惊喜错当骗局。" },
    { conditions: { all: [{ path: "resources.wealth", lte: 38 }] }, text: "包裹是反复比价后买的日用品，你在架前找得格外仔细。东西并不贵，寄丢一次却足以让省下的那点钱全数失业。" },
    { text: "你在快递架前先看区域，再核对号码和姓名，找了两遍才发现包裹被大箱子挡住。物流走得很快，人的目光仍需要逐层翻找。" },
  ], {
    effects: [add("resources.wealth", -2), add("resources.happiness", 2)],
  }),
  once("texture_old_street_demolition_mark", "墙上的测量记号", "migration", [1998, 2025], [18, 85], [
    { conditions: { all: [{ path: "resources.wealth", lte: 38 }] }, text: "墙上有了测量记号，你最先算补偿能否换回相近的住处。规划图上的新楼很整齐，租金、通勤和旧债却不会自动画进图里。" },
    { conditions: { all: [{ path: "meta.age", gte: 65 }] }, text: "老街将拆，你慢慢整理住了几十年的屋子，许多东西对子女只是旧物，对你却有明确来处。纸箱装得下家具，装不下每天坐惯的门口。" },
    { text: "老街墙上出现测量记号，邻居开始讨论补偿、去处和哪棵树能留下。城市规划落到生活里，首先变成一屋物件该进多少纸箱。" },
  ], {
    currentRegions: { cityTiers: ["county", "city", "tier2", "tier1"] },
    effects: [add("resources.happiness", -4), add("resources.freedom", -3)],
  }),
  once("texture_family_group_red_packet", "家族群红包", "relationship", [2012, 2035], [18, 85], [
    { conditions: { all: [{ path: "meta.age", gte: 65 }] }, text: "家族群里发红包，你点开时早已领完，便逐个看谁说了吉利话。钱没抢到，倒确认许多久未见的晚辈仍在群里好好生活。" },
    { conditions: { all: [{ path: "resources.wealth", lte: 35 }] }, text: "你也想在家族群里发红包，金额设得不大，仍反复确认总数。亲情不该按钱衡量，群里的数字却总让人偷偷衡量一次。" },
    { text: "家族群里有人发红包，平日不说话的亲戚纷纷现身。几块钱完成一次族谱点名，手慢的人则发送一句很有风度的‘大家开心就好’。" },
  ], {
    effects: [add("resources.wealth", 1), add("relationships.family", 3), add("resources.happiness", 3)],
  }),
  once("texture_qr_menu_elder", "扫码点菜", "relationship", [2017, 2035], [55, 100], [
    { conditions: { all: [{ path: "meta.age", gte: 75 }] }, text: "桌上只有二维码，你把手机举近又拿远，仍看不清跳出的字。服务员找来纸单，你终于可以慢慢选；便利若只方便一部分人，就还没有做完。" },
    { conditions: { all: [{ path: "resources.health", lte: 48 }] }, text: "手指不够稳，扫码页面又很快跳走，同行的人便把手机放到你面前逐项念。你坚持自己决定吃什么，帮忙不应顺便拿走选择。" },
    { text: "桌上没有纸菜单，你扫开页面，先关掉一个弹窗才找到菜。年轻人伸手要帮，你让他慢一点教；下次未必记得，今天至少由自己点完。" },
  ], {
    currentRegions: { cityTiers: ["town", "county", "city", "tier2", "tier1"] },
    effects: [add("relationships.family", 3), add("resources.happiness", 2), add("attrs.mental", 1)],
  }),
  once("texture_password_notebook", "密码写在本子上", "random", [2000, 2035], [45, 100], [
    { conditions: { all: [{ path: "meta.age", gte: 70 }] }, text: "账号和验证码越来越多，你在本子上记下用途，不再只写一串看不懂的数字。晚辈劝你别把密码全放一起，你答应后，把本子换了一个更难找的地方。" },
    { conditions: { all: [{ path: "career.status", eq: "employed" }] }, text: "工作系统要求定期换密码，你在小本上把旧密码划掉又写新的。安全规定执行得很彻底，最后最常被拦在门外的是密码本人。" },
    { text: "账号越来越多，你把密码和用途写进一个小本，又郑重收好。几天后信息安全没有出问题，问题只是全家花了一阵才找到本子。" },
  ], {
    effects: [add("resources.happiness", 1), add("attrs.mental", 1)],
  }),
];
