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
  once("texture_winter_pawn_ticket", "冬衣进了当铺", "wealth", [1840, 1949], [18, 70], "青黄不接时，家里把暂时用不上的冬衣送进当铺。柜台递来一张轻薄的票，压在手里却比衣裳还沉。", {
    birthFamilyClasses: ["landless_laborer", "tenant", "poor_peasant", "shop_clerk", "craftsman"],
    effects: [add("resources.wealth", 4), add("resources.happiness", -4)],
  }),
  once("texture_oil_lamp_wick", "灯芯剪短一点", "family", [1870, 1949], [8, 75], "夜里点煤油灯，家里人把灯芯剪得很短。光只够照见一张桌子，省下来的那一点油却被认真算进明天。", {
    effects: [add("resources.wealth", 2), add("education.score", 2)],
  }),
  once("texture_temple_fair_shadow_play", "庙会的影子戏", "random", [1840, 1949], [5, 70], "庙会上锣鼓一响，白布后的皮影比真人更敢说话。你挤在人群里看忠奸善恶，散场后还得摸黑走很长的土路。", {
    currentRegions: { cityTiers: ["village", "town", "county"] },
    effects: [add("resources.happiness", 5), add("relationships.friendship", 2)],
  }),
  once("texture_letter_writer_stall", "替人写一封信", "relationship", [1840, 1949], [16, 72], "有人请你代写家书。来人说得断断续续，你把挂念写得端正，把难堪写得含蓄；落款之前，两个人都沉默了一会儿。", {
    conditions: { all: [{ path: "education.score", gte: 35 }] },
    effects: [add("resources.reputation", 3), add("relationships.friendship", 3)],
  }),
  once("texture_market_scale_argument", "秤杆往哪边低", "wealth", [1840, 1949], [15, 70], "赶集称粮时，买卖双方都盯着秤星。秤杆只偏了一点，争论却足够绕场半圈；最后少算两文钱，人人都说自己吃了亏。", {
    currentRegions: { cityTiers: ["village", "town", "county"] },
    effects: [add("resources.wealth", -1), add("resources.happiness", 2)],
  }),
  once("texture_river_ferry_wait", "等一班渡船", "migration", [1840, 1965], [8, 78], "你在渡口等船。挑担的、赶路的和回娘家的人一起望着水面；船还没靠岸，几段陌生人的家事已经听全了。", {
    currentRegions: { provinces: ["hunan", "hubei", "jiangxi", "anhui", "jiangsu", "zhejiang", "fujian", "guangdong", "guangxi", "sichuan"] },
    effects: [add("relationships.friendship", 2), add("resources.happiness", 1)],
  }),
  once("texture_braided_queue_morning", "重新梳好辫子", "family", [1840, 1910], [6, 70], "清早，家人替你把辫子重新梳紧。头皮被扯得发疼，规矩也差不多如此：天天贴在身上，久了便容易被当成天生。", {
    genders: ["male"],
    effects: [add("resources.freedom", -3), add("attrs.mental", 1)],
  }),
  once("texture_bound_feet_room", "小鞋与长夜", "health", [1840, 1911], [5, 10], "长辈按旧俗裹紧你的脚。疼痛被说成体面与前程，哭声则被劝得更轻；身体最早学会的，不是美，而是规矩如何留下伤。", {
    genders: ["female"],
    birthFamilyClasses: ["merchant", "scholar_gentry", "landlord"],
    effects: [add("resources.health", -12), add("resources.freedom", -10), add("resources.happiness", -8), { addTrait: "old_rules_body" }],
  }),
  once("texture_sewing_cloth_soles", "灯下纳鞋底", "family", [1840, 1977], [10, 72], "灯下有人把碎布一层层粘起，再用针线纳成鞋底。针脚很密，话不多；一家人的远路，常从这样的夜晚开始。", {
    effects: [add("relationships.family", 4), add("resources.wealth", 2)],
  }),
  once("texture_patch_mosquito_net", "补蚊帐", "family", [1880, 1977], [8, 75], "入夏前，你们把蚊帐上的破洞一处处补好。蚊子总能发现遗漏，像一位不领工资、却极认真验收的监工。", {
    currentRegions: { provinces: ["hunan", "hubei", "jiangxi", "anhui", "jiangsu", "zhejiang", "fujian", "guangdong", "guangxi", "sichuan", "guizhou", "yunnan", "hainan"] },
    effects: [add("resources.health", 2), add("resources.happiness", 1)],
  }),
  once("texture_village_well_news", "井台边的消息", "relationship", [1840, 1977], [12, 75], "挑水的人在井台边交换消息：谁家添丁，谁家欠租，谁又同婆家闹了别扭。村里没有报纸时，水桶也兼任过一点新闻事业。", {
    currentRegions: { cityTiers: ["village", "town"] },
    effects: [add("relationships.friendship", 3), add("resources.happiness", 1)],
  }),

  once("texture_teahouse_shared_newspaper", "一张报纸轮着看", "random", [1912, 1949], [15, 72], "茶馆里只有一张报纸，几个人从不同方向凑着读。识字的念出新闻，不识字的负责判断真假，谁也没耽误发表意见。", {
    currentRegions: { cityTiers: ["town", "county", "city", "tier2", "tier1"] },
    effects: [add("education.score", 3), add("relationships.friendship", 2)],
  }),
  once("texture_republic_tram_bell", "电车铃响", "random", [1912, 1949], [8, 75], "有轨电车摇着铃穿过街面，人力车、行人和摊贩各自让路。现代化来得叮当作响，却不负责把每个人都载上去。", {
    currentRegions: { provinces: ["shanghai", "beijing", "tianjin"] , cityTiers: ["city", "tier2", "tier1"] },
    effects: [add("resources.happiness", 2), add("education.score", 2)],
  }),
  once("texture_cinema_newsreel", "银幕前的世界", "random", [1920, 1949], [10, 70], "你在电影院先看新闻短片，再看正片。远方的军队、城市与名流从银幕上经过，散场后门口仍是熟悉的尘土和车铃。", {
    currentRegions: { cityTiers: ["city", "tier2", "tier1"] },
    conditions: { all: [{ path: "resources.wealth", gte: 25 }] },
    effects: [add("resources.wealth", -2), add("resources.happiness", 5)],
  }),
  once("texture_rickshaw_rain_cape", "雨里叫车", "migration", [1912, 1949], [15, 72], "雨下得急，你同车夫为一段路的价钱来回讲。最后两边都退了一点：他披着湿蓑衣跑，你坐在车上，谁也没有占到天气的便宜。", {
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
  once("texture_blue_ink_home_letter", "蓝墨水家书", "relationship", [1912, 1977], [16, 72], "你给家里写信，只报平安，不写最难的那一段。蓝墨水慢慢洇进纸里，路途很远，纸比人先回到故乡。", {
    conditions: { any: [{ hasTag: "migrant" }, { path: "location.migratedTimes", gte: 1 }] },
    effects: [add("relationships.family", 5), add("resources.happiness", 1)],
  }),
  once("texture_coal_briquette_dust", "煤球灰", "family", [1920, 1977], [12, 75], "你生炉子时弄了一手煤灰，屋里半天才暖。煤球摆得整整齐齐，黑得很有秩序；只有烟不太服从安排。", {
    currentRegions: { cityTiers: ["county", "city", "tier2", "tier1"] },
    effects: [add("resources.health", -2), add("resources.happiness", 2)],
  }),

  once("texture_enamel_mug_name", "搪瓷缸上的名字", "family", [1950, 1990], [6, 75], "家里的搪瓷缸底磕掉一小块漆，侧面还写着名字。东西要用很多年，写名字既防拿错，也像提前宣布它没有退休计划。", {
    effects: [add("resources.wealth", 1), add("resources.happiness", 2)],
  }),
  once("texture_lost_ration_coupon", "少了一张票", "wealth", [1955, 1993], [12, 75], "一张粮票怎么也找不到，全家进行了一场规模远大于票面的追查。最后从旧衣口袋里翻出时，人人都松了口气，又都声称早就猜到在那里。", {
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
  once("texture_bicycle_chain_grease", "自行车掉链子", "health", [1950, 1998], [12, 72], "自行车链条半路掉了，你蹲在路边把它重新挂好。手指黑得像替机器签了名，车铃一响，修理就算正式验收。", {
    currentRegions: { cityTiers: ["town", "county", "city", "tier2", "tier1"] },
    effects: [add("resources.health", -1), add("resources.happiness", 2)],
  }),
  once("texture_northern_public_bath", "澡堂的号牌", "random", [1950, 1995], [10, 80], "你拿着小号牌进公共澡堂，水汽把所有人的轮廓都变得平等。唯一明显的阶层差别，是谁能抢到离热水更近的位置。", {
    currentRegions: { provinces: ["beijing", "tianjin", "hebei", "shanxi", "neimenggu", "liaoning", "jilin", "heilongjiang", "shandong", "henan", "shaanxi", "gansu"] , cityTiers: ["county", "city", "tier2", "tier1"] },
    effects: [add("resources.health", 3), add("resources.happiness", 3)],
  }),
  once("texture_borrowed_thermos", "借一壶热水", "relationship", [1950, 1995], [8, 80], "邻居来借热水，顺手带来两句消息，归还暖壶时又多聊了一刻钟。楼道或院子里的人情，常从一只木塞慢慢冒出热气。", {
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
  once("texture_newspaper_window_patch", "报纸糊窗", "family", [1950, 1977], [8, 75], "窗纸破了，家里用旧报纸补上。白天能读到半篇新闻，夜里风从字缝里钻进来；天下大事和屋内寒气挨得很近。", {
    conditions: { all: [{ path: "resources.wealth", lte: 35 }] },
    effects: [add("resources.wealth", 1), add("resources.health", -1), add("education.score", 1)],
  }),
  once("texture_sewing_machine_wedding", "缝纫机进门", "relationship", [1965, 1990], [18, 45], "婚后添置的缝纫机抬进家门，亲友围着看了几圈。它既是体面，也是往后许多年补衣、改裤脚和踩到腿酸的日常。", {
    conditions: { all: [{ path: "relationships.partnerStatus", in: ["partnered", "married"] }] },
    effects: [add("resources.wealth", -5), add("relationships.family", 5), add("resources.happiness", 4)],
  }),
  once("texture_work_unit_sports_day", "单位运动会", "career", [1952, 1992], [18, 60], "单位开运动会，你被临时安排了一个项目。成绩普通，口号响亮；赛后大家最关心的，还是食堂加的那道菜。", {
    conditions: { all: [{ path: "career.status", eq: "employed" }] },
    effects: [add("resources.health", 3), add("relationships.friendship", 3), add("resources.happiness", 3)],
  }),

  once("texture_rooftop_tv_antenna", "屋顶调天线", "family", [1980, 1998], [8, 72], "有人在屋顶转天线，楼下的人隔窗大喊‘还有雪花’。方向靠吼，画面靠运气，整栋楼却为同一个频道短暂合作。", {
    currentRegions: { cityTiers: ["town", "county", "city", "tier2", "tier1"] },
    effects: [add("relationships.friendship", 3), add("resources.happiness", 5)],
  }),
  once("texture_cassette_pencil_rewind", "铅笔倒磁带", "random", [1984, 2003], [8, 45], "磁带被机器咬出一截，你用铅笔慢慢卷回去。音乐工业很宏大，修复工作却主要依靠耐心和一支六角形铅笔。", {
    effects: [add("resources.happiness", 4), add("attrs.mental", 1)],
  }),
  once("texture_post_office_long_call", "邮局长途电话", "relationship", [1980, 2005], [16, 75], "你在邮局或公用电话亭打长途，接通后先喊几声‘听见没有’。分钟数跳得很快，真正想说的话只好排着队往外挤。", {
    conditions: { any: [{ hasTag: "migrant" }, { path: "location.migratedTimes", gte: 1 }] },
    effects: [add("resources.wealth", -3), add("relationships.family", 5), add("resources.happiness", 2)],
  }),
  once("texture_train_hard_seat_bags", "硬座与行李", "migration", [1978, 2010], [16, 70], "你挤上长途硬座车厢，行李、搪瓷缸和煮鸡蛋都像有临时座位，只有人经常没有。天亮时腰很酸，目的地却真的近了。", {
    conditions: { any: [{ hasTag: "migrant" }, { path: "location.migratedTimes", gte: 1 }] },
    effects: [add("resources.health", -3), add("resources.happiness", 2)],
  }),
  once("texture_family_photo_studio", "照一张全家福", "family", [1978, 2002], [5, 80], "全家在照相馆的布景前排好位置，摄影师让大家别眨眼。快门只响一下，谁站中间、谁抱孩子，却把家里的秩序保存了很多年。", {
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
  once("texture_vcd_disc_rental", "租回一张影碟", "random", [1995, 2006], [8, 60], "你从影碟店租回一张碟，机器读了几次才成功。画面偶尔卡住，全屋的人便一起保持耐心，仿佛这也是剧情的一部分。", {
    effects: [add("resources.wealth", -1), add("resources.happiness", 5), add("relationships.family", 2)],
  }),
  once("texture_appliance_manual_drawer", "说明书那一抽屉", "family", [1985, 2010], [18, 75], "家里添了新电器，说明书被郑重收进抽屉。真正出故障时谁也找不到它，于是全家凭经验按键，把科技重新交还给运气。", {
    effects: [add("resources.wealth", -4), add("resources.happiness", 3)],
  }),

  once("texture_internet_cafe_resume", "网吧里改简历", "career", [1998, 2012], [18, 36], "你在网吧改简历，旁边有人打游戏，身后打印机一页页吐纸。未来被压进一张 A4 纸里，字体调大一号都像在替自己争取空间。", {
    currentRegions: { cityTiers: ["town", "county", "city", "tier2", "tier1"] },
    effects: [add("resources.wealth", -1), add("resources.achievement", 3)],
  }),
  once("texture_charger_family_diplomacy", "只剩一个充电口", "family", [2008, 2035], [10, 80], "家里只剩一个方便的充电口，几部手机都声称自己更急。插座忽然承担起家庭外交，电量百分比成为最有说服力的证词。", {
    effects: [add("resources.happiness", 2), add("relationships.family", -1)],
  }),
  once("texture_parcel_station_shelves", "快递架上找名字", "random", [2013, 2035], [12, 80], "你在快递架前来回找包裹，先看号码，再看姓名，最后开始怀疑自己买过什么。消费很快，回忆偶尔跟不上物流。", {
    effects: [add("resources.wealth", -2), add("resources.happiness", 2)],
  }),
  once("texture_old_street_demolition_mark", "墙上的测量记号", "migration", [1998, 2025], [18, 85], "老街墙上出现测量记号，邻居们开始讨论补偿、去处和哪棵树能不能留下。城市规划画的是线，落到生活里却是一屋子东西该装进多少纸箱。", {
    currentRegions: { cityTiers: ["county", "city", "tier2", "tier1"] },
    effects: [add("resources.happiness", -4), add("resources.freedom", -3)],
  }),
  once("texture_family_group_red_packet", "家族群红包", "relationship", [2012, 2035], [18, 85], "家族群里有人发了红包，平日潜水的亲戚纷纷现身。几块钱完成了一次族谱点名，手慢的人则负责发送一句‘大家开心就好’。", {
    effects: [add("resources.wealth", 1), add("relationships.family", 3), add("resources.happiness", 3)],
  }),
  once("texture_qr_menu_elder", "扫码点菜", "relationship", [2017, 2035], [55, 100], "桌上没有纸菜单，你把手机举近二维码，又拿远一点。年轻人伸手帮忙时，你嘴上说麻烦，心里认真记住了下一步该点哪里。", {
    currentRegions: { cityTiers: ["town", "county", "city", "tier2", "tier1"] },
    effects: [add("relationships.family", 3), add("resources.happiness", 2), add("attrs.mental", 1)],
  }),
  once("texture_password_notebook", "密码写在本子上", "random", [2000, 2035], [45, 100], "账号越来越多，你把密码写进一个小本子，又郑重地把本子藏好。几天后，信息安全没有出问题，问题是你忘了藏在哪里。", {
    effects: [add("resources.happiness", 1), add("attrs.mental", 1)],
  }),
];
