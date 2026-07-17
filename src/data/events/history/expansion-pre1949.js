// Ordinary lives before 1949: tightly scoped, low-frequency historical textures.
// This batch deliberately favors small material facts over retrospective slogans.

const add = (path, value) => ({ path, add: value });
const urban = ["town", "county", "city", "tier2", "tier1"];
const largeCity = ["city", "tier2", "tier1"];
const rural = ["village", "town"];
const poorRural = ["landless_laborer", "tenant", "poor_peasant", "smallholder"];
const townWorkers = ["craftsman", "shop_clerk", "poor_peasant", "landless_laborer"];
const literateHomes = ["scholar_gentry", "merchant", "comprador_merchant", "landlord"];

function event(id, title, category, yearRange, ageRange, text, extra = {}) {
  return {
    id: `exp_pre49_${id}`,
    title,
    category,
    yearRange,
    ageRange,
    maxOccurrences: 1,
    baseWeight: 16,
    text,
    ...extra,
  };
}

const variant = (conditions, text, weight = 1) => ({ conditions, text, weight });
const fallback = (text, weight = 1) => ({ text, weight });

export const expansionPre1949Events = [
  // Late-Qing countryside: land, water, tax, tools, kinship and hunger.
  event("qing_spring_seed_debt", "借来的种子", "wealth", [1840, 1911], [17, 68], [
    variant({ all: [{ path: "birth.familyClass", "in": ["landless_laborer", "tenant", "poor_peasant"] }] }, "开春缺种，家里从粮户手里借来一袋谷种。秋后要连本带息还，种子还没落土，收成已经先少了一角。"),
    fallback("开春时，家里同邻户调换了些谷种。两家把数目记在心里，乡下的账没有纸，见面时却总能想起来。"),
  ], {
    birthFamilyClasses: poorRural,
    currentRegions: { hukou: ["rural"], cityTiers: rural },
    conditions: { all: [{ path: "resources.wealth", lte: 48 }] },
    effects: [add("resources.wealth", -3), add("relationships.family", 2)],
  }),
  event("qing_night_irrigation", "轮到半夜放水", "career", [1840, 1911], [15, 65], [
    variant({ all: [{ path: "birth.gender", eq: "female" }] }, "轮水排到后半夜，你提灯守在田口。水声很轻，蚊虫很勤快；天亮回家，灶上的活并没有因为你一夜没睡而客气。"),
    fallback("轮水排到后半夜，你守着田口，不敢打盹。上游若多留一刻钟，下游一亩苗就少喝一口，乡亲的和气全系在一道泥埂上。"),
  ], {
    birthFamilyClasses: ["tenant", "poor_peasant", "smallholder", "rich_peasant"],
    currentRegions: { provinces: ["jiangsu", "zhejiang", "anhui", "jiangxi", "hunan", "hubei", "sichuan", "guangdong", "guangxi"], hukou: ["rural"], cityTiers: rural },
    effects: [add("resources.health", -2), add("resources.wealth", 2)],
  }),
  event("qing_dryland_dung_basket", "粪筐也是家当", "career", [1840, 1911], [10, 62], "你沿路拾草木灰和牲口粪，装满一筐便挑回田里。庄稼不嫌肥料来路寒碜，只有路过的孩子捂着鼻子，显得很有身份。", {
    birthFamilyClasses: poorRural,
    currentRegions: { provinces: ["hebei", "shanxi", "shandong", "henan", "shaanxi", "gansu", "ningxia"], hukou: ["rural"], cityTiers: rural },
    effects: [add("resources.wealth", 2), add("resources.happiness", 1)],
  }),
  event("qing_thresher_rental", "借一架风谷车", "wealth", [1840, 1911], [16, 66], [
    variant({ all: [{ path: "birth.familyClass", eq: "rich_peasant" }] }, "秋收后，几户人来借你家的风谷车。木叶转得呼呼响，谷壳飞出去，人情也一笔笔落进了家里的账。"),
    fallback("秋收后，你家向较宽裕的人家借风谷车。机器只转半天，归还时却要搭上工钱、饭食和往后一次帮忙。"),
  ], {
    birthFamilyClasses: ["poor_peasant", "smallholder", "rich_peasant"],
    currentRegions: { hukou: ["rural"], cityTiers: rural },
    effects: [add("resources.wealth", 2), add("relationships.friendship", 2)],
  }),
  event("qing_rent_after_hail", "雹子打过以后", "wealth", [1840, 1911], [18, 70], [
    variant({ all: [{ path: "birth.familyClass", eq: "tenant" }] }, "一场雹子把麦穗打进泥里。收租的人来时也叹了口气，叹完照旧量粮；同情很轻，斗很沉。"),
    fallback("雹子过后，田里像被乱棍扫过。家里把尚能入口的麦粒一颗颗拣起，饭桌上从此更少有人掉一粒米。"),
  ], {
    birthFamilyClasses: poorRural,
    currentRegions: { hukou: ["rural"], cityTiers: rural },
    conditions: { all: [{ path: "resources.wealth", lte: 55 }] },
    effects: [add("resources.wealth", -6), add("resources.happiness", -3)],
  }),
  event("qing_flood_boat_roof", "船靠到屋檐边", "health", [1840, 1911], [3, 78], [
    variant({ all: [{ path: "location.currentProvince", "in": ["anhui", "jiangsu", "henan", "shandong"] }] }, "河水漫进村时，小船几乎靠到屋檐。家里先把粮瓮垫高，再把老人孩子送走；鸡被抱上船后，比谁都镇定。"),
    fallback("连日大雨把田埂抹平，水进了屋。你们把能浮的东西拴在一起，等水退时，才发现泥比水更会赖着不走。"),
  ], {
    currentRegions: { provinces: ["anhui", "jiangsu", "henan", "shandong", "hubei", "hunan", "jiangxi", "zhejiang", "guangdong", "guangxi"], hukou: ["rural"], cityTiers: rural },
    effects: [add("resources.health", -4), add("resources.wealth", -7), add("relationships.family", 2)],
  }),
  event("qing_north_cellar_grain", "窖里还剩多少", "wealth", [1840, 1911], [12, 72], "入冬前，家里掀开粮窖数了又数。老人算到明年青黄不接，你算到下个月；两个答案都不宽裕，只好把锅里的水再添一点。", {
    birthFamilyClasses: poorRural,
    currentRegions: { provinces: ["hebei", "shanxi", "shandong", "henan", "shaanxi", "gansu", "ningxia"], hukou: ["rural"], cityTiers: rural },
    conditions: { all: [{ path: "resources.wealth", lte: 38 }] },
    effects: [add("resources.health", -2), add("resources.wealth", 1)],
  }),
  event("qing_mulberry_frost", "桑叶遭了晚霜", "wealth", [1840, 1911], [13, 65], [
    variant({ all: [{ path: "birth.gender", eq: "female" }] }, "晚霜伤了桑叶，蚕匾里的沙沙声跟着弱下去。你同家中女眷四处找叶，手指冻红，丝价却不会因此多照顾一文。"),
    fallback("晚霜伤了桑叶，一季蚕事顿时紧张。全家把尚好的叶子分得极细，蚕比人吃得讲究，人只好更俭省。"),
  ], {
    birthFamilyClasses: ["poor_peasant", "smallholder", "rich_peasant", "craftsman"],
    currentRegions: { provinces: ["zhejiang", "jiangsu", "anhui", "sichuan", "guangdong"], hukou: ["rural"], cityTiers: rural },
    effects: [add("resources.wealth", -4), add("resources.health", -1)],
  }),
  event("qing_tea_picking_rain", "雨前茶", "career", [1840, 1911], [9, 58], [
    variant({ all: [{ path: "birth.gender", eq: "female" }] }, "清明前后，你同妇女们天不亮便上山采茶。嫩芽按斤计钱，雨却不按斤落；湿衣贴在背上，手仍得快。"),
    fallback("茶季一到，你跟着家人上山抢摘嫩芽。收茶人嫌叶老、嫌筐重，唯独不嫌自己开的价低。"),
  ], {
    birthFamilyClasses: ["landless_laborer", "tenant", "poor_peasant", "smallholder"],
    currentRegions: { provinces: ["zhejiang", "anhui", "fujian", "jiangxi", "hunan", "hubei", "sichuan", "yunnan"], hukou: ["rural"], cityTiers: rural },
    effects: [add("resources.wealth", 3), add("resources.health", -2)],
  }),
  event("qing_salt_carrier", "盐担压肩", "career", [1840, 1911], [15, 52], "你替人挑盐走山路，扁担把肩头磨出一条硬印。盐在城里按钱卖，汗在路上白白流，只有伤口知道两样东西都咸。", {
    genders: ["male"],
    birthFamilyClasses: ["landless_laborer", "poor_peasant", "smallholder"],
    currentRegions: { provinces: ["sichuan", "yunnan", "guizhou", "hunan", "hubei", "fujian", "guangdong"], cityTiers: ["village", "town", "county"] },
    effects: [add("resources.wealth", 4), add("resources.health", -4)],
  }),
  event("qing_cotton_spinning_night", "纺车转到夜深", "career", [1840, 1911], [11, 67], [
    variant({ all: [{ path: "birth.gender", eq: "female" }] }, "夜深后，纺车还在脚边吱呀转。男人的活多在门外被看见，你的工钱藏在线团里，细而不断。"),
    fallback("家里赶着纺棉交货，灯油舍不得添。线断了再接，瞌睡来了再忍，只有纺车很忠于自己的坏脾气。"),
  ], {
    genders: ["female"],
    birthFamilyClasses: ["poor_peasant", "smallholder", "craftsman"],
    currentRegions: { provinces: ["hebei", "shandong", "henan", "jiangsu", "anhui", "hubei"], cityTiers: rural },
    effects: [add("resources.wealth", 3), add("resources.health", -2), add("resources.freedom", -1)],
  }),
  event("qing_widow_field_work", "一双手顶几个人", "family", [1840, 1911], [22, 62], "家里少了能出重力的人，你把田间和灶上的活一并接过来。村人夸你能干，夸奖说完便各自回家，没有谁替你少挑一担水。", {
    genders: ["female"],
    birthFamilyClasses: poorRural,
    currentRegions: { hukou: ["rural"], cityTiers: rural },
    conditions: { all: [{ path: "relationships.partnerStatus", "in": ["none", "widowed"] }, { path: "resources.wealth", lte: 42 }] },
    effects: [add("resources.wealth", 3), add("resources.health", -3), add("attrs.mental", 1)],
  }),
  event("qing_child_grazes_cattle", "跟着牛走一天", "family", [1840, 1911], [7, 13], [
    variant({ all: [{ path: "education.level", neq: "none" }] }, "散学后，你赶着牛去坡上吃草，书夹在腋下。牛只认嫩草，不认文章；你背错一句时，它也很宽厚。"),
    fallback("你替家里放牛，从日头偏东跟到偏西。村塾的读书声隔着田传来，牛抬头听了一会儿，又低头做它更实际的学问。"),
  ], {
    birthFamilyClasses: ["tenant", "poor_peasant", "smallholder", "rich_peasant"],
    currentRegions: { hukou: ["rural"], cityTiers: rural },
    effects: [add("relationships.family", 3), add("education.score", 1), add("resources.freedom", -2)],
  }),
  event("qing_temple_school_fee", "束脩凑不齐", "school", [1840, 1904], [6, 15], [
    variant({ all: [{ path: "birth.familyClass", "in": literateHomes }] }, "家里送你进塾，束脩按时备下。先生教你把字写端正，也教你见长辈时站得端正；两样本事，后者见效更快。"),
    fallback("家里想送你进塾，却一时凑不齐束脩。你在门外听了几回，先认会自己的姓，余下的字要等日子宽一点。"),
  ], {
    birthFamilyClasses: ["poor_peasant", "smallholder", "rich_peasant", "merchant", "scholar_gentry", "landlord"],
    currentRegions: { cityTiers: ["village", "town", "county"] },
    effects: [add("education.score", 4), add("resources.wealth", -2)],
  }),
  event("qing_clan_grain_relief", "族仓开门", "family", [1840, 1911], [8, 72], [
    variant({ all: [{ path: "birth.familyClass", "in": ["scholar_gentry", "landlord", "rich_peasant"] }] }, "歉收后，族里议定开仓借粮，你家也出了几石。账簿写的是周济，来借粮的人仍把腰弯得很低。"),
    fallback("歉收后，族仓开门借粮。你领到的一小袋米能撑些日子，名字也从此留在账上；救急和欠情，常用同一支笔写。"),
  ], {
    birthFamilyClasses: ["landless_laborer", "tenant", "poor_peasant", "smallholder", "rich_peasant", "scholar_gentry", "landlord"],
    currentRegions: { provinces: ["jiangxi", "hunan", "hubei", "anhui", "jiangsu", "zhejiang", "fujian", "guangdong"], hukou: ["rural"], cityTiers: rural },
    conditions: { all: [{ path: "resources.wealth", lte: 55 }] },
    effects: [add("resources.wealth", 4), add("resources.freedom", -1)],
  }),
  event("qing_new_year_debt_door", "债主先来拜年", "wealth", [1840, 1911], [18, 70], "年关前，债主比亲戚先到门口。家里把仅有的一点肉藏到灶后，又把笑脸摆上桌；穷人的礼数，有时比富人的账还周全。", {
    birthFamilyClasses: ["landless_laborer", "tenant", "poor_peasant", "shop_clerk", "craftsman"],
    currentRegions: { cityTiers: ["village", "town", "county"] },
    conditions: { all: [{ path: "resources.wealth", lte: 25 }] },
    effects: [add("resources.wealth", -2), add("resources.happiness", -3), add("relationships.family", 1)],
  }),
  event("qing_livestock_vet", "牛病了", "health", [1840, 1911], [15, 68], [
    variant({ all: [{ path: "birth.familyClass", eq: "rich_peasant" }] }, "家里的耕牛病倒，请来的兽医看牙、摸腹，又开了一张方子。全家围着牛，比照看一个脾气温和的长工还仔细。"),
    fallback("借来耕田的牛忽然病倒，你们急着请懂牲口的人来看。牛不是你家的，赔起来却很可能比一年的口粮还贵。"),
  ], {
    birthFamilyClasses: ["tenant", "poor_peasant", "smallholder", "rich_peasant"],
    currentRegions: { hukou: ["rural"], cityTiers: rural },
    effects: [add("resources.wealth", -3), add("resources.happiness", -2)],
  }),
  event("qing_mountain_charcoal_kiln", "守一窑木炭", "career", [1840, 1911], [15, 57], "你在山里守炭窑，火候要慢，烟却总往脸上扑。几天后开窑，黑炭码得整齐；人也黑了一层，卖相没人过问。", {
    genders: ["male"],
    birthFamilyClasses: ["landless_laborer", "poor_peasant", "smallholder", "craftsman"],
    currentRegions: { provinces: ["fujian", "jiangxi", "hunan", "hubei", "guangdong", "guangxi", "sichuan", "guizhou", "yunnan", "zhejiang"], cityTiers: rural },
    effects: [add("resources.wealth", 4), add("resources.health", -3)],
  }),
  event("qing_fishing_net_repair", "补一张旧网", "career", [1840, 1911], [11, 68], [
    variant({ all: [{ path: "birth.gender", eq: "female" }] }, "男人出船后，你在门前补网，破处比昨日多。鱼在水里，债在岸上；针梭来回，把两边勉强连住。"),
    fallback("出船前，你把渔网破口一一补好。老人说网眼不能贪小，鱼有鱼的命；收成不好时，这句话听来很有哲理，也很不管饭。"),
  ], {
    birthFamilyClasses: ["landless_laborer", "poor_peasant", "smallholder", "craftsman"],
    currentRegions: { provinces: ["jiangsu", "zhejiang", "fujian", "shandong", "guangdong", "guangxi", "hainan", "hubei", "hunan"], cityTiers: ["village", "town", "county"] },
    effects: [add("resources.wealth", 3), add("resources.health", -1)],
  }),
  event("qing_wedding_borrowed_chair", "借来的花轿", "family", [1840, 1911], [17, 38], [
    variant({ all: [{ path: "birth.gender", eq: "female" }] }, "出嫁那天，花轿和首饰大半是借来的。鞭炮很响，旁人看见的是喜气；你隔着轿帘，听见母亲把最后一句叮嘱说得很轻。"),
    fallback("亲族替婚事借来桌凳和碗盏，席面总算摆齐。酒喝到后来，人人都说情分无价，主人却知道明日每样东西该还给哪一家。"),
  ], {
    birthFamilyClasses: ["tenant", "poor_peasant", "smallholder", "craftsman", "shop_clerk"],
    currentRegions: { cityTiers: ["village", "town", "county"] },
    conditions: { all: [{ path: "resources.wealth", lte: 45 }, { path: "relationships.partnerStatus", "in": ["none", "partnered", "married"] }] },
    effects: [add("resources.wealth", -4), add("relationships.family", 4), add("resources.happiness", 2)],
  }),
  event("qing_midwife_basin", "产婆的铜盆", "family", [1840, 1911], [19, 43], [
    variant({ all: [{ path: "birth.gender", eq: "female" }] }, "临产时，家里请来的产婆把铜盆、布条和热水摆好。门外的人只会来回踱步，门内的疼痛却有自己的时辰。"),
    fallback("家里有人生产，你被差去一趟趟烧水。院里的人压低声音等待，灶火忙得最有把握，仿佛只要水够热，事情就能平安。"),
  ], {
    birthFamilyClasses: ["tenant", "poor_peasant", "smallholder", "rich_peasant", "craftsman", "shop_clerk"],
    currentRegions: { cityTiers: ["village", "town", "county"] },
    conditions: { any: [{ path: "birth.gender", eq: "female" }, { path: "relationships.partnerStatus", eq: "married" }] },
    effects: [add("resources.health", -2), add("relationships.family", 4)],
  }),
  event("qing_smallpox_mark", "痘后留下的印", "health", [1840, 1911], [2, 22], [
    variant({ all: [{ path: "resources.wealth", gte: 55 }] }, "一场天花过去，你活了下来，家里也为药钱和照料耗去不少积蓄。镜中留下几点痘痕，长辈说人平安就好，说得很对，也说得很迟。"),
    fallback("高热退后，你脸上留下痘痕。邻人来探望，都说这是命硬的记号；你后来才懂，许多没留下记号的人，是没能留下来。"),
  ], {
    currentRegions: { cityTiers: ["village", "town", "county", "city"] },
    conditions: { all: [{ path: "resources.health", lte: 65 }] },
    triggerProbability: 0.16,
    effects: [add("resources.health", -5), add("resources.happiness", -2)],
  }),
  event("qing_malaria_mosquito_smoke", "熏蚊子的烟", "health", [1840, 1911], [5, 65], "夏夜潮热，家里点起艾草和湿柴熏蚊。人先被烟呛得咳，蚊子仍在帐外耐心等候，双方都表现出惊人的毅力。", {
    currentRegions: { provinces: ["hunan", "hubei", "jiangxi", "anhui", "zhejiang", "fujian", "guangdong", "guangxi", "hainan", "sichuan", "guizhou", "yunnan"], cityTiers: ["village", "town", "county"] },
    effects: [add("resources.health", 1), add("resources.happiness", 1)],
  }),
  event("qing_funeral_white_cloth", "白布要用几尺", "family", [1840, 1911], [12, 70], [
    variant({ all: [{ path: "birth.familyClass", "in": ["landlord", "scholar_gentry", "rich_peasant"] }] }, "族中长辈去世，丧礼按身份铺陈。礼生念得郑重，孝服分得细密；悲伤之外，一家人的次序也被重新念了一遍。"),
    fallback("家中办丧事，白布、薄棺和几桌素饭都得借钱筹。哭声是真，账也是真；人入土后，活人还要慢慢把两样都收拾好。"),
  ], {
    birthFamilyClasses: ["landless_laborer", "tenant", "poor_peasant", "smallholder", "rich_peasant", "scholar_gentry", "landlord"],
    currentRegions: { hukou: ["rural"], cityTiers: rural },
    conditions: { all: [{ path: "relationships.family", lte: 70 }] },
    effects: [add("resources.wealth", -4), add("resources.happiness", -4), add("relationships.family", 2)],
  }),

  // Treaty ports, mines, workshops, transport and clerical life.
  event("port_dock_tally_stick", "码头的筹码", "career", [1843, 1911], [15, 58], [
    variant({ all: [{ path: "birth.familyClass", eq: "shop_clerk" }] }, "你在埠头替货栈记下挑夫的趟数。木筹一根根落进筐里，人的腰力被算得很清，只有摔伤和喘气不入账。"),
    fallback("你在码头扛包，每走一趟领一根木筹。收工后按筹算钱，少一根便少一顿饭；木片很轻，大家攥得很紧。"),
  ], {
    birthFamilyClasses: townWorkers,
    currentRegions: { provinces: ["shanghai", "tianjin", "guangdong", "fujian", "zhejiang", "jiangsu", "hubei", "shandong"], cityTiers: largeCity },
    effects: [add("resources.wealth", 4), add("resources.health", -3)],
  }),
  event("port_warehouse_rain", "货栈漏雨", "career", [1843, 1911], [16, 63], "暴雨从货栈屋顶漏下，你们忙着挪茶箱和棉包。货不能湿，人湿一点无妨；掌柜这套次序，讲得比天气还明白。", {
    birthFamilyClasses: ["shop_clerk", "craftsman", "landless_laborer", "poor_peasant"],
    currentRegions: { provinces: ["shanghai", "tianjin", "guangdong", "fujian", "zhejiang", "jiangsu", "hubei"], cityTiers: largeCity },
    conditions: { any: [{ path: "career.status", eq: "employed" }, { path: "resources.wealth", lte: 45 }] },
    effects: [add("resources.health", -2), add("resources.wealth", 2)],
  }),
  event("port_customs_copyist", "抄一页关单", "career", [1860, 1911], [17, 48], [
    variant({ all: [{ path: "birth.familyClass", eq: "comprador_merchant" }] }, "你替洋行核对关单，银元、平码和英文缩写挤在一张纸上。家里的人说这是体面差事，柜台后的你知道，写错一位数便不太体面。"),
    fallback("你在海关或货栈做抄写，照样誊录船名与货数。字迹要端正，身份要安静；来往的货物漂洋过海，你每日只在几张桌子之间移动。"),
  ], {
    birthFamilyClasses: ["shop_clerk", "merchant", "comprador_merchant", "scholar_gentry"],
    currentRegions: { provinces: ["shanghai", "tianjin", "guangdong", "fujian", "shandong", "zhejiang"], cityTiers: largeCity },
    conditions: { all: [{ path: "education.score", gte: 38 }] },
    effects: [add("resources.wealth", 4), add("education.score", 2), add("resources.freedom", -1)],
  }),
  event("port_pigeon_english", "柜台英语", "school", [1860, 1911], [13, 36], "为了在洋行和码头谋事，你跟人学几句货名、数目和问候。发音未必漂亮，能让对方听懂价钱便算学问有了着落。", {
    birthFamilyClasses: ["shop_clerk", "merchant", "comprador_merchant", "craftsman"],
    currentRegions: { provinces: ["shanghai", "tianjin", "guangdong", "fujian", "zhejiang", "hubei"], cityTiers: largeCity },
    conditions: { all: [{ path: "education.score", gte: 24 }, { path: "resources.wealth", gte: 20 }] },
    effects: [add("education.score", 3), add("resources.achievement", 2)],
  }),
  event("port_coal_lighter", "煤船靠岸", "career", [1870, 1911], [15, 55], [
    variant({ all: [{ path: "location.currentProvince", "in": ["tianjin", "shandong"] }] }, "北风里，煤船靠岸，你们踩着结霜的跳板卸货。煤灰钻进棉衣，晚上拍一拍，屋里像又下了一场黑雪。"),
    fallback("煤船一靠岸，码头便扬起黑灰。你扛包到天暗，牙缝里都是细沙似的煤末，只有工钱仍旧干净得看不见多少。"),
  ], {
    genders: ["male"],
    birthFamilyClasses: ["landless_laborer", "poor_peasant", "shop_clerk"],
    currentRegions: { provinces: ["shanghai", "tianjin", "shandong", "hubei", "guangdong"], cityTiers: largeCity },
    effects: [add("resources.wealth", 4), add("resources.health", -4)],
  }),
  event("mine_cage_descent", "下井的木笼", "career", [1875, 1911], [15, 49], [
    variant({ all: [{ path: "location.currentProvince", "in": ["hebei", "liaoning"] }] }, "天没亮，你同矿工挤进木笼下井。地面上的寒风被留在上面，井下另有潮气、煤尘和不肯明说的危险。"),
    fallback("你跟着班头下井，油灯只照亮脚前几步。地底没有昼夜，只有出煤的数目；升井时看见天光，人人都像暂时领到一份奖赏。"),
  ], {
    genders: ["male"],
    birthFamilyClasses: ["landless_laborer", "poor_peasant", "smallholder", "craftsman"],
    currentRegions: { provinces: ["hebei", "shanxi", "liaoning", "shandong", "hunan", "jiangxi", "yunnan"], cityTiers: ["town", "county", "city"] },
    conditions: { all: [{ path: "resources.health", gte: 38 }] },
    effects: [add("resources.wealth", 5), add("resources.health", -5), add("resources.freedom", -2)],
  }),
  event("mine_lamp_account", "灯油从工钱里扣", "wealth", [1875, 1911], [16, 52], "月底结工钱，账房把灯油、工具和欠下的伙食一项项扣掉。你在井下挖的是煤，到了桌前，工钱也像被挖过一遍。", {
    birthFamilyClasses: ["landless_laborer", "poor_peasant", "smallholder", "craftsman"],
    currentRegions: { provinces: ["hebei", "shanxi", "liaoning", "shandong", "hunan", "jiangxi", "yunnan"], cityTiers: ["town", "county", "city"] },
    conditions: { all: [{ path: "career.status", eq: "employed" }, { path: "resources.wealth", lte: 48 }] },
    effects: [add("resources.wealth", -3), add("resources.happiness", -2)],
  }),
  event("mine_cough_bowl", "咳在饭碗旁", "health", [1880, 1911], [25, 60], "干了几年矿活以后，你的咳嗽在饭桌旁有了固定位置。家里劝你少下井，账本却劝得更响；第二天，你仍把布巾围到脸上。", {
    genders: ["male"],
    birthFamilyClasses: ["landless_laborer", "poor_peasant", "craftsman"],
    currentRegions: { provinces: ["hebei", "shanxi", "liaoning", "shandong", "hunan", "jiangxi", "yunnan"], cityTiers: ["town", "county", "city"] },
    conditions: { all: [{ path: "resources.health", lte: 55 }, { path: "resources.wealth", lte: 48 }] },
    effects: [add("resources.health", -4), add("relationships.family", -1)],
  }),
  event("silk_reeling_basin", "缫丝盆里的热气", "career", [1870, 1911], [12, 42], [
    variant({ all: [{ path: "birth.gender", eq: "female" }] }, "你在缫丝作坊把蚕茧浸进热水，指尖整日发白。丝线细得像没有分量，许多女工的日子却被它牢牢牵住。"),
    fallback("作坊里水汽不断，你负责添水、搬茧和收丝。掌柜用手指捻一捻便说成色，你的烫伤则不在检验之列。"),
  ], {
    birthFamilyClasses: ["poor_peasant", "smallholder", "craftsman", "shop_clerk"],
    currentRegions: { provinces: ["shanghai", "jiangsu", "zhejiang", "guangdong", "sichuan"], cityTiers: ["town", "county", "city", "tier2"] },
    effects: [add("resources.wealth", 4), add("resources.health", -3), add("resources.freedom", -2)],
  }),
  event("cotton_mill_night_shift", "纱厂夜班", "career", [1890, 1911], [13, 45], [
    variant({ all: [{ path: "birth.gender", eq: "female" }] }, "你进纱厂做夜班，机器声大得说话只能靠喊。工头说女孩手细，接断线快；这句称赞没有让工钱变多。"),
    fallback("夜班汽笛响后，你进车间看机器。棉絮沾在头发和鼻孔里，天亮出门时，街上安静得像世界刚刚开机。"),
  ], {
    birthFamilyClasses: townWorkers,
    currentRegions: { provinces: ["shanghai", "jiangsu", "hubei", "tianjin", "shandong"], cityTiers: largeCity },
    effects: [add("resources.wealth", 5), add("resources.health", -4), add("resources.freedom", -3)],
  }),
  event("match_factory_phosphorus", "火柴厂的气味", "career", [1890, 1911], [12, 45], "你在火柴作坊排梗、蘸药，空气里总有刺鼻气味。盒面印着鲜亮图案，工人的脸色却一天比一天灰。", {
    birthFamilyClasses: townWorkers,
    currentRegions: { provinces: ["shanghai", "tianjin", "guangdong", "hubei", "jiangsu"], cityTiers: largeCity },
    conditions: { all: [{ path: "resources.wealth", lte: 48 }] },
    effects: [add("resources.wealth", 4), add("resources.health", -5)],
  }),
  event("printing_woodblock_wash", "洗一块墨版", "career", [1840, 1911], [14, 58], [
    variant({ all: [{ path: "education.score", gte: 40 }] }, "你在书坊校看木版，发现错字便用纸条标出。坊主心疼重刻的钱，你心疼错字传出去；两种心疼最后按成本分出高下。"),
    fallback("你在书坊磨墨、刷版、晾纸，一天下来指甲缝都是黑的。印出来的圣贤文章洁白端正，背后的活计不必署名。"),
  ], {
    birthFamilyClasses: ["craftsman", "shop_clerk", "scholar_gentry"],
    currentRegions: { provinces: ["beijing", "jiangsu", "zhejiang", "anhui", "fujian", "sichuan", "guangdong"], cityTiers: urban },
    effects: [add("education.score", 2), add("resources.wealth", 3)],
  }),
  event("porcelain_kiln_saggar", "窑火不认人情", "career", [1840, 1911], [13, 58], "你在瓷窑搬匣钵、看火色。开窑时，成器和废坯一起见天日；师傅先看瓷，你先数自己的手指还齐不齐。", {
    birthFamilyClasses: ["craftsman", "poor_peasant", "shop_clerk"],
    currentRegions: { provinces: ["jiangxi", "fujian", "zhejiang", "guangdong", "hunan", "shandong"], cityTiers: ["town", "county", "city"] },
    effects: [add("resources.wealth", 4), add("resources.health", -3), add("resources.achievement", 2)],
  }),
  event("paper_mill_lime", "纸坊里的石灰水", "career", [1840, 1911], [14, 60], "你在纸坊浸料、舂浆，手长久泡在碱水里，裂口一碰便疼。纸出槽时白而平整，人的手倒显得像用旧的草纸。", {
    birthFamilyClasses: ["craftsman", "poor_peasant", "shop_clerk"],
    currentRegions: { provinces: ["fujian", "jiangxi", "zhejiang", "anhui", "sichuan", "yunnan", "guangdong"], cityTiers: ["town", "county", "city"] },
    effects: [add("resources.wealth", 4), add("resources.health", -3)],
  }),
  event("blacksmith_bellows_child", "替师傅拉风箱", "career", [1840, 1911], [9, 18], [
    variant({ all: [{ path: "birth.familyClass", eq: "craftsman" }] }, "你在自家铁匠铺拉风箱，火一旺，师傅的锤便落得更密。旁人说这是家传手艺，你先传到手上的，是一层水泡。"),
    fallback("你给镇上的铁匠当小工，整日拉风箱、扫铁屑。师傅说多看少问，你便看着一块废铁被锤成农具，也看着自己慢慢学会不喊累。"),
  ], {
    genders: ["male"],
    birthFamilyClasses: ["craftsman", "shop_clerk", "poor_peasant"],
    currentRegions: { cityTiers: ["town", "county", "city"] },
    effects: [add("resources.wealth", 2), add("resources.health", -2), add("resources.achievement", 2)],
  }),
  event("embroidery_middleman", "绣件交到经手人手里", "wealth", [1840, 1911], [12, 55], [
    variant({ all: [{ path: "birth.gender", eq: "female" }] }, "你把绣了许多夜的衣片交给经手人。他翻看针脚，挑出几处不齐，又把价压低；灯油和眼力都由你出，讲价的本事归他。"),
    fallback("家里收来绣件替商户赶工，你负责描样、配线。成品送进大户时价钱翻了几番，作坊里的人只从传闻中见过那个数。"),
  ], {
    genders: ["female"],
    birthFamilyClasses: ["craftsman", "shop_clerk", "poor_peasant", "smallholder"],
    currentRegions: { provinces: ["jiangsu", "zhejiang", "hunan", "sichuan", "guangdong", "beijing"], cityTiers: urban },
    effects: [add("resources.wealth", 3), add("resources.health", -2), add("resources.happiness", -1)],
  }),
  event("shop_apprentice_floor", "学徒睡在柜台后", "career", [1840, 1911], [11, 22], [
    variant({ all: [{ path: "birth.familyClass", eq: "merchant" }] }, "家里让你到熟识的铺子学买卖。你从扫地、递茶和记货名做起，亲缘替你开了门，却没替你免掉师傅的眼色。"),
    fallback("你进铺做学徒，夜里在柜台后铺一张席。头几年没有多少工钱，掌柜说管饭便是栽培；饭确实管，只是每碗都带着规矩。"),
  ], {
    genders: ["male"],
    birthFamilyClasses: ["shop_clerk", "craftsman", "merchant", "poor_peasant", "smallholder"],
    currentRegions: { cityTiers: urban },
    conditions: { all: [{ path: "career.status", "in": ["none", "family_labor"] }] },
    effects: [add("resources.wealth", 2), add("resources.freedom", -4), add("education.score", 2)],
  }),
  event("shop_abacus_close", "算盘打到打烊", "career", [1840, 1911], [15, 58], "铺门落板以后，你还在油灯下核账。算盘珠响得很利落，缺的那几文钱却迟迟找不到，仿佛也知道掌柜今晚心情不好。", {
    birthFamilyClasses: ["shop_clerk", "merchant", "comprador_merchant"],
    currentRegions: { cityTiers: urban },
    conditions: { all: [{ path: "education.score", gte: 25 }] },
    effects: [add("resources.wealth", 3), add("resources.health", -1), add("education.score", 2)],
  }),
  event("guild_festival_dues", "行会要收一份钱", "wealth", [1840, 1911], [20, 65], [
    variant({ all: [{ path: "birth.familyClass", "in": ["merchant", "comprador_merchant"] }] }, "同行会馆筹办祭祀和宴席，你按铺面大小出了一份钱。席上大家称兄道弟，谈到生意时，兄弟便暂时各有算盘。"),
    fallback("行会催交会费，师傅从工钱里匀出一点。遇到纠纷时会馆也许能说句话，这个‘也许’，每年都按足数收钱。"),
  ], {
    birthFamilyClasses: ["craftsman", "shop_clerk", "merchant", "comprador_merchant"],
    currentRegions: { cityTiers: urban },
    effects: [add("resources.wealth", -2), add("resources.reputation", 2), add("relationships.friendship", 2)],
  }),
  event("pawnshop_ticket_clerk", "当票上的小字", "career", [1840, 1911], [17, 60], [
    variant({ all: [{ path: "birth.familyClass", eq: "shop_clerk" }] }, "你在当铺柜后写当票，衣物、首饰和家传物件都被压成几行小字。来人仰头听价，你低头写字，谁也不便多看谁。"),
    fallback("你替亲戚拿物件去当铺，高柜台后的人把成色说得一文不值。等银钱递下来，那件东西忽然又显得很有纪念。"),
  ], {
    birthFamilyClasses: ["shop_clerk", "merchant", "craftsman", "poor_peasant"],
    currentRegions: { cityTiers: ["town", "county", "city", "tier2"] },
    conditions: { all: [{ path: "resources.wealth", lte: 42 }] },
    effects: [add("resources.wealth", 3), add("resources.happiness", -2)],
  }),
  event("postal_runner_rain", "邮路上的油布包", "career", [1896, 1911], [17, 48], "你替邮局背着油布邮件袋赶路，遇雨先护信，再护自己。信封里装着别人的急事，脚下的泥却一视同仁。", {
    genders: ["male"],
    birthFamilyClasses: ["shop_clerk", "craftsman", "poor_peasant", "smallholder"],
    currentRegions: { provinces: ["beijing", "tianjin", "hebei", "shandong", "jiangsu", "zhejiang", "hubei", "hunan", "guangdong"], cityTiers: ["county", "city", "tier2"] },
    conditions: { all: [{ path: "education.score", gte: 22 }, { path: "resources.health", gte: 42 }] },
    effects: [add("resources.wealth", 4), add("resources.health", -2), add("education.score", 1)],
  }),
  event("telegraph_errand", "电报房外等回音", "relationship", [1880, 1911], [15, 65], [
    variant({ all: [{ path: "education.score", gte: 45 }] }, "你替人拟一封电报，字越少钱越省，只得把焦急删成几个硬邦邦的词。报务员数的是字，收报的人要从字缝里把心事补回来。"),
    fallback("家里有急事，你到电报房托识字的人代拟。每个字都要钱，问候被省去，只留下病、归、速几个字，倒比长信更叫人心惊。"),
  ], {
    birthFamilyClasses: ["shop_clerk", "merchant", "comprador_merchant", "scholar_gentry", "craftsman"],
    currentRegions: { cityTiers: ["county", "city", "tier2", "tier1"] },
    conditions: { all: [{ path: "resources.wealth", gte: 24 }] },
    lifetimeProbability: 0.42,
    effects: [add("resources.wealth", -2), add("relationships.family", 2), add("resources.happiness", -1)],
  }),
  event("railway_station_porter", "站台上的行李", "career", [1898, 1911], [15, 56], [
    variant({ all: [{ path: "location.currentProvince", "in": ["hebei", "tianjin", "beijing"] }] }, "火车进站时白汽扑上站台，你抢着替旅客搬箱笼。机器跑得比马快，找活的人仍要靠一双腿先跑到车门边。"),
    fallback("汽笛一响，站台上的脚步都快起来。你替旅客扛箱，听见他们谈远方地名；火车带人走很远，你的工钱只够走回住处。"),
  ], {
    genders: ["male"],
    birthFamilyClasses: ["landless_laborer", "poor_peasant", "shop_clerk", "craftsman"],
    currentRegions: { provinces: ["beijing", "tianjin", "hebei", "shandong", "henan", "hubei", "hunan", "jiangsu", "liaoning"], cityTiers: ["county", "city", "tier2", "tier1"] },
    effects: [add("resources.wealth", 4), add("resources.health", -3)],
  }),
  event("rickshaw_first_pull", "第一次套上车把", "career", [1895, 1911], [17, 48], "你向车厂租来一辆人力车，先交份钱，再上街找客。车是老板的，腿是自己的；这桩买卖分得很公平——各自拿出最不心疼的东西。", {
    genders: ["male"],
    birthFamilyClasses: ["landless_laborer", "poor_peasant", "shop_clerk", "craftsman"],
    currentRegions: { provinces: ["beijing", "tianjin", "shanghai", "hubei", "guangdong"], cityTiers: largeCity },
    conditions: { all: [{ path: "resources.health", gte: 50 }, { path: "resources.wealth", lte: 42 }] },
    effects: [add("resources.wealth", 5), add("resources.health", -4), add("resources.freedom", -2)],
  }),
  event("domestic_servant_backstairs", "从后门进出", "career", [1840, 1911], [12, 48], [
    variant({ all: [{ path: "birth.gender", eq: "female" }] }, "你到城里一户人家帮佣，从后门进出，管灶火、针线和孩子。主人常夸你像家里人，发月钱时又记得你不是。"),
    fallback("你在大户人家做杂役，扫院、跑腿、守门。宅子很大，你熟悉其中每一条路，却没有一间屋能关上门算自己的。"),
  ], {
    birthFamilyClasses: ["landless_laborer", "tenant", "poor_peasant", "shop_clerk"],
    currentRegions: { cityTiers: ["county", "city", "tier2", "tier1"] },
    conditions: { all: [{ path: "resources.wealth", lte: 38 }] },
    effects: [add("resources.wealth", 4), add("resources.freedom", -3), add("relationships.family", -1)],
  }),
  event("laundry_stone", "替人洗一盆衣", "career", [1840, 1911], [14, 58], "你替城里人家浆洗衣物，冬水咬手，夏天汗又滴进盆里。衣裳晾干后平展体面，你把裂开的指口藏进袖中。", {
    genders: ["female"],
    birthFamilyClasses: ["landless_laborer", "poor_peasant", "shop_clerk", "craftsman"],
    currentRegions: { cityTiers: ["county", "city", "tier2", "tier1"] },
    conditions: { all: [{ path: "resources.wealth", lte: 45 }] },
    effects: [add("resources.wealth", 3), add("resources.health", -3)],
  }),
  event("night_soil_cart", "城门边的粪车", "career", [1840, 1911], [16, 58], "天亮前，你推着粪车穿过尚未热闹的街巷。富户关窗嫌味，城外菜农却等着这车肥；一样东西走过半座城，身份便从污秽变成了本钱。", {
    genders: ["male"],
    birthFamilyClasses: ["landless_laborer", "poor_peasant", "shop_clerk"],
    currentRegions: { cityTiers: ["county", "city", "tier2", "tier1"] },
    conditions: { all: [{ path: "resources.wealth", lte: 38 }] },
    effects: [add("resources.wealth", 4), add("resources.health", -2), add("resources.reputation", -1)],
  }),
  event("merchant_fire_inspection", "铺门前多摆一只水缸", "wealth", [1860, 1911], [22, 68], [
    variant({ all: [{ path: "birth.familyClass", eq: "comprador_merchant" }] }, "邻街失火后，你让伙计在仓库外添水缸、分开油货。洋行的保单条文很细，真正着火时，仍得先靠附近人的水桶。"),
    fallback("邻街一场火烧掉几间铺面，你家把水缸挪到门口。掌柜反复叮嘱小心灯烛，伙计们点头；到了夜里，最旧的那盏灯仍旧漏油。"),
  ], {
    birthFamilyClasses: ["shop_clerk", "merchant", "comprador_merchant", "craftsman"],
    currentRegions: { cityTiers: ["town", "county", "city", "tier2", "tier1"] },
    conditions: { all: [{ path: "resources.wealth", gte: 32 }] },
    effects: [add("resources.wealth", -2), add("resources.health", 1)],
  }),

  // Women, children, schooling, gentry households and the uneven arrival of new institutions.
  event("qing_daughter_dowry_chest", "嫁妆箱从小备起", "family", [1840, 1911], [8, 17], [
    variant({ all: [{ path: "resources.wealth", gte: 55 }] }, "家里给你备下一口嫁妆箱，布匹首饰逐年添进去。那是长辈给未来的保障，也是一个女孩尚未长大，去处便已被量好尺寸。"),
    fallback("母亲把零碎布头收进一只旧箱，说慢慢攒着将来用。箱子很空，话说得很满；穷人替女儿打算，常从一块舍不得用的布开始。"),
  ], {
    genders: ["female"],
    birthFamilyClasses: ["poor_peasant", "smallholder", "rich_peasant", "craftsman", "shop_clerk", "merchant", "scholar_gentry", "landlord"],
    currentRegions: { cityTiers: ["village", "town", "county", "city"] },
    effects: [add("resources.wealth", -2), add("relationships.family", 3), add("resources.freedom", -2)],
  }),
  event("qing_child_bride_kitchen", "先学会叫人", "family", [1840, 1905], [7, 15], "你被送到另一户人家生活，先学会按辈分叫人，再学灶上和针线。大人说往后就是一家人，孩子听见的，却是原来的家已经远了。", {
    genders: ["female"],
    birthFamilyClasses: ["landless_laborer", "tenant", "poor_peasant"],
    currentRegions: { provinces: ["fujian", "guangdong", "guangxi", "jiangxi", "hunan", "zhejiang", "sichuan"], cityTiers: ["village", "town"] },
    conditions: { all: [{ path: "resources.wealth", lte: 28 }, { path: "relationships.family", lte: 62 }] },
    triggerProbability: 0.08,
    effects: [add("relationships.family", -4), add("resources.freedom", -6), add("resources.happiness", -4)],
  }),
  event("qing_women_market_eggs", "鸡蛋只卖不吃", "wealth", [1840, 1911], [12, 65], [
    variant({ all: [{ path: "relationships.children", gte: 1 }] }, "你把家里的鸡蛋攒到集上卖，孩子问为什么不能留一个。你说鸡还会下，盐和针却不会自己长出来；说完把篮底最后一枚也递给了买主。"),
    fallback("你提着一篮鸡蛋去赶集，换回盐、灯油和几文零钱。一路小心没碰破一枚，回家数钱时，却总觉得每个价都比来时薄了一点。"),
  ], {
    genders: ["female"],
    birthFamilyClasses: ["tenant", "poor_peasant", "smallholder", "rich_peasant"],
    currentRegions: { hukou: ["rural"], cityTiers: rural },
    effects: [add("resources.wealth", 3), add("relationships.family", 2)],
  }),
  event("qing_women_temple_incense", "替一家人上香", "family", [1840, 1911], [18, 65], "逢到家人生病或远行，你去庙里添一炷香。香资有多有少，愿望大致相同；庙祝收下铜钱，也收下许多无处安放的担心。", {
    genders: ["female"],
    birthFamilyClasses: ["tenant", "poor_peasant", "smallholder", "rich_peasant", "craftsman", "shop_clerk", "merchant"],
    currentRegions: { cityTiers: ["village", "town", "county", "city"] },
    conditions: { any: [{ path: "resources.health", lte: 52 }, { path: "relationships.family", lte: 55 }] },
    effects: [add("resources.wealth", -1), add("resources.happiness", 2)],
  }),
  event("qing_boy_ancestral_tablet", "族谱里的一行", "family", [1840, 1911], [6, 18], [
    variant({ all: [{ path: "birth.familyClass", "in": ["scholar_gentry", "landlord", "rich_peasant"] }] }, "族里续谱，你的名字被写进一行。长辈讲起祖先与排行，纸上的位置端端正正；同岁的姐妹在旁递茶，没有那一行。"),
    fallback("祭祖时，大人照族谱念出男丁的名字。你站在香案后记住自己的排行，也隐约明白，有些人活在家里，却不一定活在纸上。"),
  ], {
    genders: ["male"],
    birthFamilyClasses: ["smallholder", "rich_peasant", "scholar_gentry", "landlord"],
    currentRegions: { provinces: ["jiangxi", "hunan", "hubei", "anhui", "jiangsu", "zhejiang", "fujian", "guangdong"], cityTiers: ["village", "town", "county"] },
    effects: [add("relationships.family", 3), add("resources.freedom", -1)],
  }),
  event("qing_exam_lodging", "赶考住进会馆", "school", [1840, 1904], [17, 39], [
    variant({ all: [{ path: "resources.wealth", gte: 62 }] }, "赶考途中，你住进同乡会馆，书箱有人照看，盘缠也还充足。考棚里真正平等的，大约只有每个人都睡不好。"),
    fallback("家里东拼西凑出盘缠，你带着干粮赶考。客店嫌贵便住会馆通铺，临进考棚还在默诵；文章未必忘，欠下的钱一定记得。"),
  ], {
    genders: ["male"],
    birthFamilyClasses: ["smallholder", "rich_peasant", "merchant", "scholar_gentry", "landlord"],
    currentRegions: { cityTiers: ["county", "city", "tier2", "tier1"] },
    conditions: { all: [{ path: "education.score", gte: 58 }, { path: "education.level", neq: "none" }] },
    effects: [add("resources.wealth", -4), add("education.score", 3), add("resources.happiness", -1)],
  }),
  event("qing_failed_candidate_tutoring", "回乡教几个孩子", "career", [1840, 1905], [22, 58], "功名没有着落，你在乡里替几户孩子开蒙。家长送来束脩，还顺便托你写信、择日、看契；读书人的用途，比考卷上宽得多。", {
    genders: ["male"],
    birthFamilyClasses: ["smallholder", "rich_peasant", "merchant", "scholar_gentry", "landlord"],
    currentRegions: { cityTiers: ["village", "town", "county"] },
    conditions: { all: [{ path: "education.score", gte: 52 }, { path: "resources.achievement", lte: 28 }] },
    effects: [add("resources.wealth", 3), add("resources.reputation", 3), add("education.score", 1)],
  }),
  event("qing_contract_witness", "在契纸上画押", "wealth", [1840, 1911], [24, 70], [
    variant({ all: [{ path: "birth.familyClass", "in": ["scholar_gentry", "landlord"] }] }, "两家请你作中人，在田契上署名。你把界址和银数念得清楚，至于谁更需要这块地，契纸一向没有这一栏。"),
    fallback("家里租换田地，请识字中人把契纸念了一遍。你在名字旁按下手印，墨迹很快干了，往后许多年的收成都从这一点红泥算起。"),
  ], {
    birthFamilyClasses: ["tenant", "poor_peasant", "smallholder", "rich_peasant", "scholar_gentry", "landlord"],
    currentRegions: { hukou: ["rural"], cityTiers: rural },
    effects: [add("resources.wealth", -1), add("resources.reputation", 1)],
  }),
  event("qing_yamen_petition_writer", "衙门外的状纸", "wealth", [1840, 1911], [20, 68], [
    variant({ all: [{ path: "education.score", gte: 55 }] }, "有人请你在衙门外代写状纸。来人讲了一肚子委屈，你按格式削成几页字；冤情进门以前，先得学会合乎文书的样子。"),
    fallback("为了一桩田界纠纷，你托人写状纸。纸墨、代书和门上的规矩都要钱，事情尚未开审，家里的耐性已先花掉不少。"),
  ], {
    birthFamilyClasses: ["tenant", "poor_peasant", "smallholder", "rich_peasant", "merchant", "scholar_gentry", "landlord"],
    currentRegions: { cityTiers: ["town", "county", "city"] },
    conditions: { any: [{ path: "education.score", gte: 55 }, { path: "resources.wealth", gte: 25 }] },
    effects: [add("resources.wealth", -2), add("resources.happiness", -2), add("education.score", 1)],
  }),
  event("qing_local_charity_congee", "粥棚冒起白气", "health", [1840, 1911], [3, 75], [
    variant({ all: [{ path: "birth.familyClass", "in": ["merchant", "scholar_gentry", "landlord"] }] }, "灾年里，地方绅商合办粥棚，你也去帮着登记、分勺。有人夸善举，有人嫌粥薄；锅底的米多少，比匾额上的字更实在。"),
    fallback("灾年里，城外支起粥棚。你排了很久才领到一碗稀粥，白气扑脸时像一顿饱饭，喝完却很快又只剩碗。"),
  ], {
    birthFamilyClasses: ["landless_laborer", "tenant", "poor_peasant", "smallholder", "merchant", "scholar_gentry", "landlord"],
    currentRegions: { cityTiers: ["town", "county", "city"] },
    conditions: { all: [{ path: "resources.wealth", lte: 55 }] },
    triggerProbability: 0.18,
    effects: [add("resources.health", 2), add("resources.wealth", 1), add("resources.happiness", -1)],
  }),
  event("qing_vaccination_notice", "种痘告示", "health", [1880, 1911], [1, 18], [
    variant({ all: [{ path: "birth.familyClass", "in": ["merchant", "comprador_merchant", "scholar_gentry"] }] }, "家里听从告示，带你去种痘。长辈仍有疑虑，却更怕天花；针痕很小，新旧两种办法在门外争论了许久。"),
    fallback("城里贴出种痘告示，家中人围着问安不安全、要花多少钱。最后是否去成，取决于胆量，也取决于去一趟会不会耽误当天的工。"),
  ], {
    birthFamilyClasses: ["craftsman", "shop_clerk", "merchant", "comprador_merchant", "scholar_gentry", "landlord"],
    currentRegions: { provinces: ["shanghai", "tianjin", "beijing", "guangdong", "fujian", "jiangsu", "zhejiang", "hubei"], cityTiers: ["county", "city", "tier2", "tier1"] },
    effects: [add("resources.health", 4), add("resources.wealth", -2)],
  }),
  event("qing_mission_girls_school", "女塾门前", "school", [1880, 1911], [7, 17], [
    variant({ all: [{ path: "resources.freedom", gte: 45 }] }, "家里让你进了女塾，识字、算术和针线排在同一张课表上。亲戚问女孩读书有什么用，你把新认的字写给母亲看，没有回答。"),
    fallback("女塾招生的消息传来，家里议论了几晚。有人怕闲话，有人嫌学费，最后你只在门外看过几次学生进出，记住那扇门开向街里。"),
  ], {
    genders: ["female"],
    birthFamilyClasses: ["craftsman", "shop_clerk", "merchant", "comprador_merchant", "scholar_gentry"],
    currentRegions: { provinces: ["shanghai", "tianjin", "beijing", "guangdong", "fujian", "jiangsu", "zhejiang", "hubei", "sichuan"], cityTiers: ["county", "city", "tier2", "tier1"] },
    conditions: { all: [{ path: "education.score", gte: 20 }] },
    effects: [add("education.score", 5), add("resources.freedom", 2), add("resources.wealth", -2)],
  }),
  event("qing_new_school_uniform", "新学堂的操衣", "school", [1902, 1911], [9, 22], [
    variant({ all: [{ path: "birth.familyClass", "in": ["scholar_gentry", "merchant", "landlord"] }] }, "你进新学堂后穿上操衣，读国文、算学，也列队做操。父亲看课程单看了很久，最后只问先生还教不教做人。"),
    fallback("县里办起新学堂，你凑钱进去旁听。课桌、钟点和体操都很新，欠学费这件事仍旧十分古老。"),
  ], {
    genders: ["male"],
    birthFamilyClasses: ["smallholder", "rich_peasant", "craftsman", "shop_clerk", "merchant", "scholar_gentry", "landlord"],
    currentRegions: { cityTiers: ["town", "county", "city", "tier2"] },
    conditions: { all: [{ path: "education.score", gte: 28 }] },
    effects: [add("education.score", 6), add("resources.wealth", -3), add("resources.achievement", 2)],
  }),
  event("qing_abolished_exam_house", "考棚不再开门", "family", [1905, 1907], [15, 45], [
    variant({ all: [{ path: "education.score", gte: 55 }] }, "科举停了，家里替你备下的经书和盘缠忽然没了明确去处。长辈叹息，你重新盘算学堂、教书或谋职；制度转身时，读书人的脚还站在原地。"),
    fallback("县里传来停科举的消息，茶馆里争了许久。你本不曾进考棚，日子照旧谋生；只是从此，穷孩子偶尔做的那个旧梦也换了门牌。"),
  ], {
    birthFamilyClasses: ["smallholder", "rich_peasant", "craftsman", "shop_clerk", "merchant", "scholar_gentry", "landlord"],
    currentRegions: { cityTiers: ["town", "county", "city", "tier2"] },
    conditions: { any: [{ path: "education.score", gte: 40 }, { path: "birth.familyClass", eq: "scholar_gentry" }] },
    effects: [add("resources.happiness", -2), add("resources.freedom", 2)],
  }),
  event("qing_anti_footbinding_group", "一张不缠足的约", "family", [1898, 1911], [4, 13], [
    variant({ all: [{ path: "birth.gender", eq: "female" }] }, "几户人家彼此约定不给女儿缠足，也愿意让儿子娶天足女子。纸上几行名字挡不住所有闲话，却让你日后走路时不必一步步偿还旧规矩。"),
    fallback("城里有人传看不缠足的约章，家中长辈各说各的道理。男人们谈新风气很热闹，真正要不要裹脚，仍落在一个小女孩身上。"),
  ], {
    genders: ["female"],
    birthFamilyClasses: ["rich_peasant", "craftsman", "shop_clerk", "merchant", "comprador_merchant", "scholar_gentry"],
    currentRegions: { provinces: ["shanghai", "jiangsu", "zhejiang", "fujian", "guangdong", "hunan", "hubei", "sichuan"], cityTiers: ["town", "county", "city", "tier2", "tier1"] },
    conditions: { all: [{ path: "attrs.family", gte: 4 }] },
    effects: [add("resources.freedom", 5), add("resources.health", 2)],
  }),
  event("qing_braid_cut_school", "辫子剪下以后", "school", [1905, 1911], [14, 32], "新学堂里有人剪了辫子，你也在旁看着。剪刀响一下，头立刻轻了；回家解释却花了很久，旧规矩失去一截，嗓门反而更长。", {
    genders: ["male"],
    birthFamilyClasses: ["craftsman", "shop_clerk", "merchant", "comprador_merchant", "scholar_gentry", "landlord"],
    currentRegions: { cityTiers: ["county", "city", "tier2", "tier1"] },
    conditions: { all: [{ path: "education.score", gte: 35 }, { path: "resources.freedom", gte: 35 }] },
    effects: [add("resources.freedom", 3), add("relationships.family", -2), add("resources.reputation", 1)],
  }),
  event("qing_local_newspaper_reading", "报馆门口读消息", "random", [1895, 1911], [14, 65], [
    variant({ all: [{ path: "education.score", gte: 42 }] }, "新报送到茶馆，你把上面的时局读给旁人听。每念一段便有人插话，报纸负责印消息，茶客负责把天下重新安排一遍。"),
    fallback("报馆门口贴出新报，你挤在人群外听识字的人念。听不全的地方由旁人补上，到了街尾，一条消息已经有了三种结局。"),
  ], {
    birthFamilyClasses: ["craftsman", "shop_clerk", "merchant", "comprador_merchant", "scholar_gentry"],
    currentRegions: { provinces: ["beijing", "tianjin", "shanghai", "jiangsu", "zhejiang", "hubei", "hunan", "guangdong", "sichuan"], cityTiers: ["county", "city", "tier2", "tier1"] },
    effects: [add("education.score", 3), add("relationships.friendship", 2)],
  }),

  // Republican-era work, school, public health, migration and city survival.
  event("republic_factory_gate_hiring", "厂门口点人", "career", [1912, 1936], [14, 42], [
    variant({ all: [{ path: "birth.gender", eq: "female" }] }, "清早，女工们挤在厂门口等管事点人。对方先看手脚，再问年纪，最后把工钱说得像一份恩惠；你被点中，先松气，再开始站一整天。"),
    fallback("你同许多人守在厂门口等短工。管事从队里随手点出几名，没点到的人继续等；城市有机器，也保留了不少碰运气的办法。"),
  ], {
    birthFamilyClasses: townWorkers,
    currentRegions: { provinces: ["shanghai", "tianjin", "jiangsu", "hubei", "guangdong", "shandong", "liaoning"], cityTiers: largeCity },
    conditions: { all: [{ path: "career.status", "in": ["none", "family_labor", "employed"] }, { path: "resources.wealth", lte: 48 }] },
    effects: [add("resources.wealth", 4), add("resources.health", -3), add("resources.freedom", -2)],
  }),
  event("republic_factory_fine_book", "罚款写在小本上", "wealth", [1912, 1936], [15, 55], "月底发薪时，迟到、坏料和借住工房的费用都从工钱里扣去。账房的小本很薄，却有本事把一个月的辛苦再削薄一层。", {
    birthFamilyClasses: ["landless_laborer", "poor_peasant", "craftsman", "shop_clerk"],
    currentRegions: { provinces: ["shanghai", "tianjin", "jiangsu", "hubei", "guangdong", "shandong", "liaoning"], cityTiers: largeCity },
    conditions: { all: [{ path: "career.status", eq: "employed" }, { path: "resources.wealth", lte: 55 }] },
    effects: [add("resources.wealth", -3), add("resources.happiness", -2)],
  }),
  event("republic_workers_dormitory", "十几张铺挨在一起", "relationship", [1912, 1937], [14, 45], [
    variant({ all: [{ path: "birth.gender", eq: "female" }] }, "女工宿舍里十几张铺挨得很近，夜里有人咳嗽，有人悄悄想家。大家轮着写信，也轮着借针线，私事很少能真正关上门。"),
    fallback("工棚里一排通铺挨到墙边，你的包袱塞在枕下。鼾声、乡音和脚臭混成一屋，出门在外的人很快学会把体面叠得小一点。"),
  ], {
    birthFamilyClasses: townWorkers,
    currentRegions: { provinces: ["shanghai", "tianjin", "jiangsu", "hubei", "guangdong", "shandong", "liaoning"], cityTiers: largeCity },
    conditions: { any: [{ hasTag: "migrant" }, { path: "location.migratedTimes", gte: 1 }, { path: "resources.wealth", lte: 35 }] },
    effects: [add("relationships.friendship", 4), add("resources.health", -2), add("resources.happiness", 1)],
  }),
  event("republic_rickshaw_rental_rain", "雨天的车份", "career", [1912, 1937], [18, 52], "大雨压住了街上的客人，你仍得把当天车份交给车厂。空车拉回去时比有客时轻，心里那本账却坐得很稳。", {
    genders: ["male"],
    birthFamilyClasses: ["landless_laborer", "poor_peasant", "shop_clerk", "craftsman"],
    currentRegions: { provinces: ["beijing", "tianjin", "shanghai", "hubei", "guangdong", "jiangsu"], cityTiers: largeCity },
    conditions: { all: [{ path: "resources.health", gte: 35 }, { path: "resources.wealth", lte: 42 }] },
    effects: [add("resources.wealth", -2), add("resources.health", -2), add("resources.happiness", -2)],
  }),
  event("republic_seamstress_piecework", "按件算钱", "career", [1912, 1937], [15, 56], [
    variant({ all: [{ path: "relationships.children", gte: 1 }] }, "你把成捆衣片带回家缝，孩子睡后才真正安静下来。工钱按件算，照料孩子不算；一盏灯下做着两份活，只有一份有人付钱。"),
    fallback("你替成衣铺缝扣眼、滚边，做完一件才记一件钱。针脚稍慢便少挣，扎到手也不能污染布面，血只好由自己悄悄擦掉。"),
  ], {
    genders: ["female"],
    birthFamilyClasses: ["poor_peasant", "craftsman", "shop_clerk", "smallholder"],
    currentRegions: { cityTiers: urban },
    conditions: { all: [{ path: "resources.wealth", lte: 52 }] },
    effects: [add("resources.wealth", 4), add("resources.health", -2), add("resources.freedom", -2)],
  }),
  event("republic_boy_newspaper_seller", "沿街喊报", "career", [1912, 1937], [8, 16], [
    variant({ all: [{ path: "education.score", gte: 30 }] }, "你抱着一摞报纸沿街叫卖，标题上的字渐渐认全。天下大事从你嘴里喊出去，晚上数零钱时，你最关心的仍是还有几份没卖掉。"),
    fallback("你替报贩沿街喊报，照着别人教的词一遍遍喊。字不全认得，哪条消息最好卖却很快知道；新闻先教会你的，是人们爱听什么。"),
  ], {
    genders: ["male"],
    birthFamilyClasses: ["landless_laborer", "poor_peasant", "shop_clerk", "craftsman"],
    currentRegions: { cityTiers: ["county", "city", "tier2", "tier1"] },
    conditions: { all: [{ path: "resources.wealth", lte: 35 }] },
    effects: [add("resources.wealth", 2), add("education.score", 2), add("resources.freedom", -1)],
  }),
  event("republic_night_school_lamp", "下工以后认字", "school", [1912, 1937], [15, 38], [
    variant({ all: [{ path: "birth.gender", eq: "female" }] }, "下工后，你去女工夜校认字。手上还有机油或线屑，握笔不稳；写会自己名字那晚，你看了好几遍，像第一次领到属于自己的东西。"),
    fallback("收工后，你到夜校听课，困得眼皮直往下落。先生教写姓名和算工资，你立刻清醒一些：学问一旦碰到账目，便显得格外亲切。"),
  ], {
    birthFamilyClasses: ["landless_laborer", "poor_peasant", "craftsman", "shop_clerk"],
    currentRegions: { provinces: ["shanghai", "tianjin", "beijing", "jiangsu", "hubei", "guangdong", "liaoning"], cityTiers: largeCity },
    conditions: { all: [{ path: "education.score", lte: 55 }, { path: "career.status", eq: "employed" }] },
    effects: [add("education.score", 5), add("resources.health", -1), add("resources.achievement", 2)],
  }),
  event("republic_school_lunch_cold", "冷饭带进教室", "school", [1912, 1937], [7, 18], [
    variant({ all: [{ path: "resources.wealth", lte: 32 }] }, "你带到学校的午饭只有冷杂粮和一点咸菜。午间大家打开饭盒，香味也分家境；你吃得很快，省得看得太久。"),
    fallback("你把家里装的冷饭带进学校，午间就着热水吃。先生讲新知识，饭盒装旧日子，两样并不冲突，只是后者每天都要洗。"),
  ], {
    birthFamilyClasses: ["poor_peasant", "smallholder", "craftsman", "shop_clerk", "merchant", "scholar_gentry"],
    currentRegions: { cityTiers: ["town", "county", "city", "tier2"] },
    conditions: { all: [{ path: "education.level", neq: "none" }] },
    effects: [add("education.score", 2), add("resources.health", -1), add("resources.happiness", 1)],
  }),
  event("republic_tuition_arrears", "学费单压在书下", "school", [1912, 1937], [8, 22], [
    variant({ all: [{ path: "birth.familyClass", "in": ["merchant", "scholar_gentry", "landlord"] }] }, "学校催缴学费，家里虽能付，也要先问你成绩值不值得。你把分数单递过去，第一次知道读书也会被拿来核算收益。"),
    fallback("催缴学费的单子被你压在书下，拖了几天才交给家里。大人没有责怪，只把米缸和钱袋重新算了一遍；你从那阵沉默里听懂了数目。"),
  ], {
    birthFamilyClasses: ["poor_peasant", "smallholder", "craftsman", "shop_clerk", "merchant", "scholar_gentry", "landlord"],
    currentRegions: { cityTiers: ["town", "county", "city", "tier2"] },
    conditions: { all: [{ path: "education.level", neq: "none" }, { path: "resources.wealth", lte: 58 }] },
    effects: [add("resources.wealth", -3), add("education.score", 2), add("relationships.family", 1)],
  }),
  event("republic_women_normal_school", "师范校里的女生", "school", [1912, 1937], [15, 25], [
    variant({ all: [{ path: "birth.familyClass", "in": ["merchant", "scholar_gentry"] }] }, "你进女子师范读书，家里希望毕业后有一份稳妥教职。课堂谈新女性，来信仍催问婚事；两种时代隔着一张课桌相互打量。"),
    fallback("你考进师范，靠减免和节省维持学业。制服洗得发白，课本却翻得很勤；教书尚在以后，眼前先得学会不向窘迫低头。"),
  ], {
    genders: ["female"],
    birthFamilyClasses: ["smallholder", "rich_peasant", "craftsman", "shop_clerk", "merchant", "scholar_gentry"],
    currentRegions: { provinces: ["beijing", "tianjin", "shanghai", "jiangsu", "zhejiang", "hubei", "hunan", "guangdong", "sichuan"], cityTiers: ["county", "city", "tier2", "tier1"] },
    conditions: { all: [{ path: "education.score", gte: 48 }, { path: "resources.freedom", gte: 32 }] },
    effects: [add("education.score", 6), add("resources.achievement", 4), add("resources.wealth", -2)],
  }),
  event("republic_library_reading_room", "阅览室里坐一下午", "school", [1915, 1937], [13, 42], "你在学校或城里的阅览室坐了一下午，报刊轮到手时已被翻软。窗外车声不断，纸上的世界更大；管理员只希望大家翻页时轻一点。", {
    birthFamilyClasses: ["craftsman", "shop_clerk", "merchant", "comprador_merchant", "scholar_gentry", "landlord"],
    currentRegions: { cityTiers: ["county", "city", "tier2", "tier1"] },
    conditions: { all: [{ path: "education.score", gte: 36 }] },
    effects: [add("education.score", 4), add("resources.happiness", 2)],
  }),
  event("republic_printshop_proof", "铅字里捉错", "career", [1912, 1937], [16, 55], [
    variant({ all: [{ path: "education.score", gte: 55 }] }, "你在印刷所校样，从密密铅字里找错。文章谈国家、社会和新生活，你最先负责的，是一个标点别站错位置。"),
    fallback("你在印刷所搬铅字、洗墨辊，手总是黑的。每天许多新话从机器里印出来，工人下班时仍旧用旧毛巾擦手。"),
  ], {
    birthFamilyClasses: ["craftsman", "shop_clerk", "scholar_gentry", "merchant"],
    currentRegions: { provinces: ["beijing", "tianjin", "shanghai", "jiangsu", "zhejiang", "hubei", "guangdong", "sichuan"], cityTiers: largeCity },
    conditions: { all: [{ path: "education.score", gte: 28 }] },
    effects: [add("education.score", 3), add("resources.wealth", 3), add("resources.health", -1)],
  }),
  event("republic_public_tap_queue", "公用水龙头前", "relationship", [1912, 1937], [10, 70], [
    variant({ all: [{ path: "location.currentProvince", eq: "shanghai" }] }, "弄堂里只有一处公用水龙头，清早便排起桶。谁多接半盆都有人记得，谁家断炊也会有人顺手让一步；邻里规矩比水管更曲折。"),
    fallback("巷子或杂院只有一处公用水龙头，清早便排起桶。谁多接半盆都有人记得，谁家断炊也会有人顺手让一步；邻里规矩比水管更曲折。"),
  ], {
    birthFamilyClasses: ["landless_laborer", "poor_peasant", "craftsman", "shop_clerk"],
    currentRegions: { cityTiers: ["county", "city", "tier2", "tier1"] },
    conditions: { all: [{ path: "resources.wealth", lte: 46 }] },
    effects: [add("relationships.friendship", 3), add("resources.happiness", 1)],
  }),
  event("republic_tenement_partition", "一间屋隔成三间", "family", [1912, 1937], [18, 65], [
    variant({ all: [{ path: "relationships.children", gte: 1 }] }, "孩子渐多，你们用木板和旧布把一间屋隔出睡处。墙很薄，秘密很少，夜里每个人翻身都像全家共同商议。"),
    fallback("为省房钱，你同别户合租一间大屋，中间挂布作墙。彼此看不见，咳嗽、争嘴和锅里炒什么却都听得明白。"),
  ], {
    birthFamilyClasses: ["landless_laborer", "poor_peasant", "craftsman", "shop_clerk"],
    currentRegions: { cityTiers: largeCity },
    conditions: { all: [{ path: "resources.wealth", lte: 38 }] },
    effects: [add("resources.wealth", 1), add("resources.freedom", -3), add("relationships.family", -1)],
  }),
  event("republic_cholera_boiled_water", "井水要烧开", "health", [1912, 1937], [5, 70], [
    variant({ all: [{ path: "education.score", gte: 38 }] }, "城里闹霍乱，告示劝人把水烧开，你回家反复叮嘱。家人嫌柴贵，也嫌你学了几行字便管起灶来；最后水还是滚了一锅。"),
    fallback("城里传出急病，街坊说法一天几变。你们把水多烧一阵，把生食收起来；不知道病从哪里来时，人只能先把能做的小事做得很认真。"),
  ], {
    currentRegions: { provinces: ["shanghai", "tianjin", "beijing", "jiangsu", "zhejiang", "hubei", "guangdong", "fujian", "shandong"], cityTiers: urban },
    conditions: { all: [{ path: "resources.health", lte: 70 }] },
    effects: [add("resources.health", 3), add("resources.wealth", -1)],
  }),
  event("republic_trachoma_clinic", "眼药水滴进眼里", "health", [1912, 1937], [6, 35], "眼睛总红痒，学校或工场的诊所给你滴药。药水一进眼便刺得流泪，旁人说这说明有效；那年月，许多治疗先靠忍耐来证明。", {
    birthFamilyClasses: ["poor_peasant", "craftsman", "shop_clerk", "smallholder"],
    currentRegions: { cityTiers: ["town", "county", "city", "tier2"] },
    conditions: { all: [{ path: "resources.health", lte: 58 }] },
    effects: [add("resources.health", 3), add("resources.wealth", -1)],
  }),
  event("republic_maternity_fee", "产院的押金", "family", [1920, 1937], [20, 42], [
    variant({ all: [{ path: "resources.wealth", gte: 52 }] }, "临产时，家里把你送进城里的产院。走廊有消毒水味，也有不断催问的费用；新办法带来几分安全，也把安全写成一张账单。"),
    fallback("听说产院更稳妥，家里却凑不齐押金，最后仍请接生婆上门。热水一盆盆端进屋，门外的人把医院的好处谈了许久。"),
  ], {
    genders: ["female"],
    birthFamilyClasses: ["craftsman", "shop_clerk", "merchant", "scholar_gentry", "poor_peasant"],
    currentRegions: { provinces: ["shanghai", "tianjin", "beijing", "jiangsu", "zhejiang", "hubei", "guangdong"], cityTiers: largeCity },
    conditions: { any: [{ path: "relationships.partnerStatus", eq: "married" }, { path: "relationships.children", gte: 1 }] },
    effects: [add("resources.wealth", -3), add("resources.health", 2), add("relationships.family", 2)],
  }),
  event("republic_hometown_remittance", "钱庄汇回一笔钱", "relationship", [1912, 1937], [18, 62], [
    variant({ all: [{ path: "resources.wealth", gte: 48 }] }, "你到钱庄把一笔工钱汇回乡下，柜员核对姓名和地名。凭单很薄，却能替你走几百里；家书里仍叮嘱父母省着用，仿佛他们会不省。"),
    fallback("你把省下的小钱托同乡捎回家，银数当面点了两遍。路远、人情也要算一份；钱到家时少了一点，家里仍回信说全数收到了。"),
  ], {
    birthFamilyClasses: ["landless_laborer", "tenant", "poor_peasant", "smallholder", "craftsman", "shop_clerk"],
    currentRegions: { cityTiers: ["county", "city", "tier2", "tier1"] },
    conditions: { any: [{ hasTag: "migrant" }, { path: "location.migratedTimes", gte: 1 }] },
    effects: [add("resources.wealth", -3), add("relationships.family", 5), add("resources.happiness", 2)],
  }),
  event("republic_steamship_deck", "在统舱里过夜", "migration", [1912, 1937], [15, 62], "你坐江轮或海轮的统舱去外地谋生，行李压在身边，陌生人挤得很近。头等舱也在同一条船上，只是连江风都像经过了分配。", {
    birthFamilyClasses: ["landless_laborer", "tenant", "poor_peasant", "smallholder", "craftsman", "shop_clerk"],
    currentRegions: { provinces: ["sichuan", "chongqing", "hubei", "hunan", "jiangxi", "anhui", "jiangsu", "zhejiang", "fujian", "guangdong", "shanghai"], cityTiers: urban },
    conditions: { any: [{ hasTag: "migrant" }, { path: "location.migratedTimes", gte: 1 }, { path: "resources.wealth", lte: 38 }] },
    effects: [add("resources.health", -2), add("resources.freedom", 2), add("resources.wealth", -1)],
  }),

  // Epidemics, disasters, war displacement and the civilian rear, 1918-1949.
  event("flu_1918_closed_school", "咳嗽声挤满屋", "health", [1918, 1920], [4, 65], [
    variant({ all: [{ path: "education.level", neq: "none" }] }, "流行病起来后，学校停了些日子。你带回课本，也带回几句防病告诫；街坊更信姜汤和关窗，屋里于是既闷又很有信心。"),
    fallback("一场大疫从城镇传到乡里，许多人高热咳嗽。家中把病人与孩子尽量隔开，可几间屋住着一家人，‘隔开’常只是一幅帘子。"),
  ], {
    currentRegions: { provinces: ["beijing", "tianjin", "hebei", "shandong", "shanghai", "jiangsu", "zhejiang", "hubei", "hunan", "guangdong", "liaoning", "jilin", "heilongjiang"], cityTiers: ["town", "county", "city", "tier2", "tier1"] },
    conditions: { all: [{ path: "resources.health", lte: 72 }] },
    triggerProbability: 0.28,
    effects: [add("resources.health", -5), add("resources.happiness", -2)],
  }),
  event("north_drought_1920_water", "井绳越放越长", "health", [1920, 1921], [5, 75], [
    variant({ all: [{ path: "birth.familyClass", "in": ["landlord", "rich_peasant"] }] }, "旱情加重后，家里看守粮仓，也安排人往更远的井取水。院内尚能开灶，门外求借的人渐多；一场旱把墙的两边照得很清楚。"),
    fallback("井水一天天低下去，绳子接了一段又一段。挑回的水先给人喝，再给牲口，最后才轮到洗脸；尘土因此在每个人身上住得很安稳。"),
  ], {
    birthFamilyClasses: ["landless_laborer", "tenant", "poor_peasant", "smallholder", "rich_peasant", "landlord"],
    currentRegions: { provinces: ["hebei", "shanxi", "shandong", "henan", "shaanxi"], hukou: ["rural"], cityTiers: rural },
    effects: [add("resources.health", -4), add("resources.wealth", -5), add("resources.happiness", -2)],
  }),
  event("flood_1931_attic", "在阁楼等水退", "health", [1931, 1932], [2, 78], [
    variant({ all: [{ path: "location.currentProvince", "in": ["hubei", "hunan", "jiangxi"] }] }, "江水冲进住处，你们挤到高处等船。灶具、被褥和一家的小物件浮在浑水里，平日各有用途，落水后都只剩同一种狼狈。"),
    fallback("洪水漫过田地和街巷，你跟家人搬到堤上或高屋。救济粥按人头分，夜里没有床位可分；水退以前，大家都把明天说得很近。"),
  ], {
    currentRegions: { provinces: ["hubei", "hunan", "jiangxi", "anhui", "jiangsu", "zhejiang", "henan", "shandong"], cityTiers: ["village", "town", "county", "city"] },
    effects: [add("resources.health", -5), add("resources.wealth", -8), add("relationships.family", 2)],
  }),
  event("manchuria_shop_sign_change", "招牌底下换了字", "wealth", [1932, 1936], [12, 68], [
    variant({ all: [{ path: "birth.familyClass", "in": ["shop_clerk", "merchant"] }] }, "街上的招牌和票据渐渐换了新格式，你在铺里重新学盖章、报货。生意还得做，规矩却不再由熟悉的人解释；掌柜把话说得越来越少。"),
    fallback("街口多了检查和新的告示，出门要带好证件。你照常买米、上工、回家，只是每件小事前后都多了一次张望。"),
  ], {
    birthFamilyClasses: ["craftsman", "shop_clerk", "merchant", "poor_peasant", "smallholder"],
    currentRegions: { provinces: ["liaoning", "jilin", "heilongjiang"], cityTiers: ["town", "county", "city", "tier2"] },
    effects: [add("resources.freedom", -4), add("resources.happiness", -3), add("resources.wealth", -1)],
  }),
  event("war_shanghai_bundle", "只带得走两个包袱", "migration", [1937, 1938], [1, 72], [
    variant({ all: [{ path: "resources.wealth", gte: 55 }] }, "战事逼近，你家托关系找车船离城，仍只带得走几只箱子。挑选行李时才发现，钱能买座位，却不能替人决定哪段生活该留下。"),
    fallback("炮声渐近，你们把衣被和干粮扎成两个包袱，跟着人群往外走。屋门锁上时钥匙仍揣在身上，像一件对未来很有信心的小东西。"),
  ], {
    currentRegions: { provinces: ["shanghai", "jiangsu", "zhejiang"], cityTiers: ["county", "city", "tier2", "tier1"] },
    effects: [add("resources.wealth", -8), add("resources.health", -4), add("resources.freedom", -4)],
  }),
  event("war_refugee_temple_floor", "庙里铺满草席", "migration", [1937, 1945], [2, 75], [
    variant({ all: [{ path: "relationships.children", gte: 1 }] }, "逃难途中，你带孩子在庙里借宿。草席一张挨一张，孩子问何时回家，你说等路平安；大人擅长把不知道说成一个可以等待的日期。"),
    fallback("你同难民在祠堂、庙宇或学校过夜，头边就是行李。素不相识的人互借热水，也彼此提防；流离让人靠得很近，并不保证心就安稳。"),
  ], {
    birthFamilyClasses: ["landless_laborer", "tenant", "poor_peasant", "smallholder", "craftsman", "shop_clerk", "merchant"],
    currentRegions: { provinces: ["hebei", "shandong", "henan", "shanxi", "jiangsu", "zhejiang", "anhui", "jiangxi", "hubei", "hunan", "guangdong", "guangxi", "sichuan", "guizhou", "yunnan"], cityTiers: ["village", "town", "county", "city"] },
    conditions: { any: [{ hasTag: "migrant" }, { path: "location.migratedTimes", gte: 1 }, { path: "resources.wealth", lte: 32 }] },
    effects: [add("resources.health", -3), add("relationships.family", 3), add("resources.freedom", -2)],
  }),
  event("war_air_raid_basket", "警报一响就提篮子", "health", [1938, 1944], [4, 72], [
    variant({ all: [{ path: "location.currentProvince", "in": ["chongqing", "sichuan"] }] }, "警报响起，你提着装有水、干粮和证件的篮子往防空洞赶。洞里闷热，人们挤着等轰鸣远去；孩子把每次解除警报都当成放学铃。"),
    fallback("一听见警报，你们便按熟路去壕沟或空地躲避。带什么、扶谁、门要不要锁，早已练得很快；熟练本身，是那几年最令人难过的本事。"),
  ], {
    currentRegions: { provinces: ["chongqing", "sichuan", "hubei", "hunan", "guangxi", "yunnan", "shaanxi", "gansu"], cityTiers: ["county", "city", "tier2"] },
    effects: [add("resources.health", -2), add("resources.happiness", -4), add("attrs.mental", 1)],
  }),
  event("war_factory_inland_crates", "机器拆成木箱", "career", [1937, 1941], [15, 58], [
    variant({ all: [{ path: "birth.familyClass", eq: "shop_clerk" }] }, "厂里内迁，你跟着清点机器零件，把编号写在木箱上。账册不能丢，螺丝也不能少；到了内地，大家靠这堆箱子重新拼出一座车间。"),
    fallback("工厂把机器拆装西运，你参与搬运和复建。设备在船、车和人肩上辗转，到了新厂房还要校准；机器尚未开动，人已先磨损一轮。"),
  ], {
    birthFamilyClasses: ["craftsman", "shop_clerk", "landless_laborer", "poor_peasant"],
    currentRegions: { provinces: ["hubei", "hunan", "sichuan", "chongqing", "guizhou", "yunnan", "shaanxi", "gansu", "guangxi"], cityTiers: ["town", "county", "city", "tier2"] },
    conditions: { any: [{ path: "career.status", eq: "employed" }, { hasTag: "migrant" }, { path: "location.migratedTimes", gte: 1 }] },
    effects: [add("resources.wealth", 3), add("resources.health", -3), add("resources.achievement", 2)],
  }),
  event("war_refugee_school_blackboard", "借来的教室", "school", [1937, 1945], [7, 23], [
    variant({ all: [{ path: "resources.wealth", lte: 35 }] }, "迁到后方后，学校借祠堂或民房上课，课本几人合看一本。你把字抄在旧纸背面，纸的正面有账目，背面有尚未停下来的功课。"),
    fallback("学校辗转迁到内地，教室和宿舍都很简陋。警报来时停课，解除后再继续；先生把粉笔头收好，像保存一小截正常日子。"),
  ], {
    birthFamilyClasses: ["smallholder", "rich_peasant", "craftsman", "shop_clerk", "merchant", "scholar_gentry", "landlord"],
    currentRegions: { provinces: ["sichuan", "chongqing", "yunnan", "guizhou", "guangxi", "hunan", "shaanxi", "gansu"], cityTiers: ["town", "county", "city", "tier2"] },
    conditions: { all: [{ path: "education.level", neq: "none" }] },
    effects: [add("education.score", 4), add("resources.health", -1), add("resources.achievement", 2)],
  }),
  event("war_salt_cloth_shortage", "盐和布都紧", "wealth", [1938, 1945], [10, 75], [
    variant({ all: [{ path: "birth.familyClass", "in": ["merchant", "landlord", "rich_peasant"] }] }, "盐、布和煤油都难买，你家虽有钱，也得托人或排队。货架空时，财富并不消失，只是暂时找不到能换成的东西。"),
    fallback("盐价和布价不断涨，家里把旧衣拆开再缝，咸菜也腌得更淡。节省做到后来，连补丁上都能看出上一件衣服的身世。"),
  ], {
    currentRegions: { provinces: ["sichuan", "chongqing", "yunnan", "guizhou", "guangxi", "hunan", "hubei", "shaanxi", "gansu", "jiangxi"], cityTiers: ["village", "town", "county", "city", "tier2"] },
    conditions: { all: [{ path: "resources.wealth", lte: 68 }] },
    effects: [add("resources.wealth", -4), add("resources.happiness", -2)],
  }),
  event("war_burma_road_repair", "公路被雨冲坏", "career", [1938, 1942], [16, 55], [
    variant({ all: [{ path: "birth.gender", eq: "female" }] }, "雨季里，滇缅公路一段路基塌了，你同乡里妇女抬石、填土、照看伤病。运输讲的是国家大事，落到肩上，仍是一筐筐会磨破手的石头。"),
    fallback("雨季里，滇缅公路一段路基塌了，你跟着人群抬石、填土、推车。运输讲的是国家大事，落到肩上，仍是一块一块会磨破手的石头。"),
  ], {
    birthFamilyClasses: ["landless_laborer", "poor_peasant", "smallholder", "craftsman"],
    currentRegions: { provinces: ["yunnan"], cityTiers: ["village", "town", "county", "city"] },
    conditions: { all: [{ path: "resources.health", gte: 42 }] },
    effects: [add("resources.wealth", 3), add("resources.health", -4), add("resources.achievement", 2)],
  }),
  event("war_wounded_train_water", "给伤兵递一碗水", "relationship", [1937, 1945], [12, 68], [
    variant({ all: [{ path: "birth.gender", eq: "female" }] }, "运伤员的车停靠时，你同妇女们送水、换布、抬担架。许多人年纪不比你大，却已经学会忍着不喊；你回家后，把沾血的盆洗了很久。"),
    fallback("一列运伤员的车临时停靠，你帮着递水和搬东西。车很快又开走，只留下站台上的布条和水渍；远方战事短暂地有了几张年轻的脸。"),
  ], {
    currentRegions: { provinces: ["henan", "hubei", "hunan", "guangxi", "sichuan", "chongqing", "guizhou", "yunnan", "shaanxi", "gansu"], cityTiers: ["town", "county", "city"] },
    conditions: { all: [{ path: "resources.health", gte: 35 }] },
    effects: [add("relationships.friendship", 2), add("resources.happiness", -2), add("resources.reputation", 2)],
  }),
  event("war_orphan_shared_bowl", "饭桌上多了一副碗", "family", [1937, 1946], [20, 65], [
    variant({ all: [{ path: "relationships.children", gte: 1 }] }, "亲友家的孩子失了照应，暂住进你家，同自家孩子挤一张床。饭桌多一副碗，米缸便空得快一点；孩子们争过被子，第二天又一起出门。"),
    fallback("逃难途中，有个失散孩子跟着你们走了一程。你替他问人、分饭，最终交给亲友或收容处；多年后，你还记得他把碗捧得很稳。"),
  ], {
    birthFamilyClasses: ["poor_peasant", "smallholder", "rich_peasant", "craftsman", "shop_clerk", "merchant", "scholar_gentry"],
    currentRegions: { provinces: ["hebei", "shandong", "henan", "jiangsu", "anhui", "hubei", "hunan", "jiangxi", "guangxi", "sichuan", "chongqing", "guizhou", "yunnan", "shaanxi"], cityTiers: ["village", "town", "county", "city"] },
    conditions: { all: [{ path: "relationships.family", gte: 30 }, { path: "resources.wealth", gte: 20 }] },
    effects: [add("resources.wealth", -3), add("relationships.family", 4), add("resources.happiness", -1)],
  }),
  event("war_conscription_hiding", "壮丁名册到了村里", "family", [1937, 1945], [18, 42], [
    variant({ all: [{ path: "resources.wealth", gte: 55 }] }, "征丁名册到了村里，家中托人打听能否缓征或另想办法。钱和人情来回走动，最后换来一阵暂时的平安；门外别家仍有人被叫走。"),
    fallback("征丁的人进村后，适龄男人有的躲到山里，有的被绳子串着带走。你家把灯点得很暗，夜里每一阵狗叫都像有人敲门。"),
  ], {
    genders: ["male"],
    birthFamilyClasses: ["landless_laborer", "tenant", "poor_peasant", "smallholder", "rich_peasant", "landlord"],
    currentRegions: { provinces: ["sichuan", "hunan", "hubei", "henan", "guangxi", "guizhou", "yunnan", "shaanxi", "gansu", "jiangxi"], hukou: ["rural"], cityTiers: rural },
    conditions: { all: [{ path: "resources.health", gte: 38 }] },
    triggerProbability: 0.18,
    effects: [add("resources.freedom", -5), add("resources.happiness", -4), add("relationships.family", -2)],
  }),
  event("war_women_sewing_group", "针线也有定额", "career", [1937, 1945], [15, 62], [
    variant({ all: [{ path: "relationships.children", gte: 1 }] }, "你同邻里妇女赶缝衣被，孩子在桌下玩碎布。大家一边做针线一边交换菜价和前线消息，宏大的战争从针脚间穿过，也要先顾孩子别碰到剪刀。"),
    fallback("你参加缝制衣被或纱布的活计，布料按数领、成品按数交。针脚要密，时间要快；手指扎破以后，在衣角上擦一下便继续。"),
  ], {
    genders: ["female"],
    birthFamilyClasses: ["poor_peasant", "smallholder", "craftsman", "shop_clerk", "merchant"],
    currentRegions: { provinces: ["sichuan", "chongqing", "hunan", "hubei", "guangxi", "yunnan", "guizhou", "shaanxi", "gansu", "jiangxi"], cityTiers: ["village", "town", "county", "city"] },
    effects: [add("resources.wealth", 2), add("resources.health", -1), add("relationships.friendship", 3)],
  }),
  event("war_black_market_kerosene", "煤油藏在柜台下", "wealth", [1939, 1945], [18, 68], [
    variant({ all: [{ path: "birth.familyClass", "in": ["merchant", "shop_clerk"] }] }, "货越来越少，铺里把煤油和布藏到柜台下，只卖给熟客。你记得每个人欠多少人情；明码标价消失后，买卖反而需要更好的记性。"),
    fallback("煤油买不到，你托熟人从暗处匀来一点，价钱比从前高许多。家里把灯芯剪短，夜晚因此显得格外节约。"),
  ], {
    birthFamilyClasses: ["poor_peasant", "smallholder", "craftsman", "shop_clerk", "merchant"],
    currentRegions: { cityTiers: ["town", "county", "city", "tier2"] },
    conditions: { all: [{ path: "resources.wealth", gte: 20 }, { path: "resources.wealth", lte: 65 }] },
    effects: [add("resources.wealth", -3), add("resources.happiness", -1)],
  }),
  event("war_letter_returned", "信退了回来", "relationship", [1937, 1946], [15, 72], "寄往旧居或前方的一封信退了回来，信封上多了几枚戳和一句地址不详。你没有拆，因为里面写了什么自己知道；不知道的是，该把它再寄到哪里。", {
    birthFamilyClasses: ["smallholder", "rich_peasant", "craftsman", "shop_clerk", "merchant", "scholar_gentry"],
    currentRegions: { cityTiers: ["town", "county", "city", "tier2", "tier1"] },
    conditions: { any: [{ hasTag: "migrant" }, { path: "location.migratedTimes", gte: 1 }, { path: "relationships.family", lte: 48 }] },
    lifetimeProbability: 0.32,
    effects: [add("resources.happiness", -4), add("relationships.family", -1)],
  }),
  event("inflation_salary_bundle", "一沓钞票买几样菜", "wealth", [1946, 1949], [18, 68], [
    variant({ all: [{ path: "career.status", eq: "employed" }] }, "发薪时拿到厚厚一沓钞票，你下班便赶去买米。脚步若慢，价格可能又变；工资在口袋里还没焐热，购买力先冷了。"),
    fallback("家里把钞票一叠叠数好，换回的米面却越来越少。孩子觉得钱很多，大人没有解释，只把今日要买的东西赶紧买下。"),
  ], {
    currentRegions: { provinces: ["shanghai", "tianjin", "beijing", "jiangsu", "zhejiang", "hubei", "hunan", "guangdong", "sichuan", "chongqing"], cityTiers: ["town", "county", "city", "tier2", "tier1"] },
    conditions: { all: [{ path: "resources.wealth", lte: 72 }] },
    effects: [add("resources.wealth", -6), add("resources.happiness", -3)],
  }),
  event("postwar_returned_workbench", "旧铺重新开门", "career", [1945, 1948], [20, 68], [
    variant({ all: [{ path: "birth.familyClass", "in": ["merchant", "shop_clerk"] }] }, "战后回到旧城，你找到原来的铺面，门板、货架或主人都已有变化。大家扫尘、补窗、重新进货，仿佛把门一开，失去的年月也能跟着营业。"),
    fallback("战事过去，你把留下的工具擦净，重新接活。手艺还在，熟客散了许多；第一笔生意不大，却让屋里久违地有了做事的声响。"),
  ], {
    birthFamilyClasses: ["craftsman", "shop_clerk", "merchant"],
    currentRegions: { cityTiers: ["town", "county", "city", "tier2", "tier1"] },
    conditions: { any: [{ path: "career.status", eq: "employed" }, { path: "education.score", gte: 22 }] },
    effects: [add("resources.wealth", 4), add("resources.achievement", 2), add("resources.happiness", 2)],
  }),
  event("civilwar_rail_delay", "火车停在小站", "migration", [1946, 1949], [10, 72], "局势反复，列车在小站停了很久，没人说得准何时再开。旅客把干粮拿出来交换消息，时刻表贴在墙上，显得比人更相信秩序。", {
    birthFamilyClasses: ["poor_peasant", "smallholder", "craftsman", "shop_clerk", "merchant", "scholar_gentry"],
    currentRegions: { provinces: ["beijing", "tianjin", "hebei", "shandong", "henan", "jiangsu", "anhui", "hubei", "hunan", "liaoning", "jilin"], cityTiers: ["county", "city", "tier2", "tier1"] },
    conditions: { any: [{ hasTag: "migrant" }, { path: "location.migratedTimes", gte: 1 }, { path: "resources.wealth", gte: 24 }] },
    effects: [add("resources.health", -1), add("resources.happiness", -2), add("relationships.friendship", 2)],
  }),
  event("civilwar_rural_grain_hiding", "谷子藏进夹墙", "wealth", [1946, 1949], [15, 72], [
    variant({ all: [{ path: "birth.familyClass", "in": ["rich_peasant", "landlord"] }] }, "征粮和兵事的消息一来，家里把一部分谷子转进夹墙或远仓。谁来问都说见底了；粮食会不会保住不知道，猜疑已经先装满院子。"),
    fallback("村里局势不稳，家家把一点口粮藏进坛底、柴堆或夹墙。藏处对孩子保密，对亲戚也只说一半；乱世让一家人连信任都要分开存放。"),
  ], {
    birthFamilyClasses: ["tenant", "poor_peasant", "smallholder", "rich_peasant", "landlord"],
    currentRegions: { provinces: ["hebei", "shandong", "henan", "shanxi", "shaanxi", "jiangsu", "anhui", "hubei", "hunan", "liaoning", "jilin"], hukou: ["rural"], cityTiers: rural },
    conditions: { all: [{ path: "resources.wealth", gte: 18 }] },
    effects: [add("resources.wealth", -2), add("resources.happiness", -3), add("relationships.family", -1)],
  }),
  event("civilwar_family_photo", "照相馆里留一张影", "family", [1946, 1949], [5, 75], [
    variant({ all: [{ path: "location.migratedTimes", gte: 1 }] }, "又要动身以前，全家去照相馆留了一张影。每个人都穿得尽量整齐，快门响时没人知道，下次团聚还会不会仍是这些人。"),
    fallback("局势不稳，家里难得凑齐，便去照一张合影。摄影师让大家看镜头、别动；那一刻的安静只有几秒，后来却在相纸上留了很多年。"),
  ], {
    birthFamilyClasses: ["craftsman", "shop_clerk", "merchant", "comprador_merchant", "scholar_gentry", "landlord", "smallholder"],
    currentRegions: { cityTiers: ["county", "city", "tier2", "tier1"] },
    conditions: { all: [{ path: "resources.wealth", gte: 28 }, { path: "relationships.family", gte: 35 }] },
    lifetimeProbability: 0.3,
    effects: [add("resources.wealth", -2), add("relationships.family", 5), add("resources.happiness", 1)],
  }),
];
