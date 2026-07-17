// Low-probability mortality between early childhood and old age. Without this
// layer, simulated lives unrealistically jump from age five straight to a
// near-universal death after 75. These are conservative literary hazards, not
// a population life table; period, health, physique, work and care access all
// affect risk.

const vulnerabilityModifiers = [
  { path: "resources.health", lte: 35, multiply: 1.8 },
  { path: "attrs.physique", lte: 2, multiply: 1.35 },
  { path: "environment.healthcareAccess", lte: 2, multiply: 1.25 },
  { path: "career.field", in: ["mine", "mining", "dock", "construction", "factory", "military"], multiply: 1.25 },
  { path: "resources.health", gte: 75, multiply: 0.7 },
];

function ending({ id, title, yearRange, ageRange, probability, reason, text }) {
  return {
    id,
    title,
    category: "ending",
    yearRange,
    ageRange,
    priority: 86,
    maxOccurrences: 1,
    baseWeight: 100,
    triggerProbability: probability,
    probabilityModifiers: vulnerabilityModifiers,
    text,
    effects: [
      { die: reason },
      { triggerEnding: id.replace(/^life_/, "") },
    ],
  };
}

const poor = (text) => ({
  conditions: { all: [{ path: "resources.wealth", lte: 35 }] },
  text,
});

const rural = (text) => ({
  conditions: { all: [{ path: "location.currentCityTier", in: ["village", "town"] }] },
  text,
});

export const adultMortalityEvents = [
  ending({
    id: "life_school_age_illness_death_pre1949",
    title: "一场病没有过去",
    yearRange: [1840, 1949],
    ageRange: [6, 14],
    probability: 0.004,
    reason: "童年急病",
    text: [
      poor("病先是发热，后来连水也难咽。家里借钱请人、抓药，能做的都做了；小小的鞋仍停在门边，像主人只是暂时没回来。"),
      rural("一场急病拖了几日，路远、药少，邻里轮流来问。院里的活照常有人接手，这个孩子的位置却没人能够代替。"),
      { text: "一场感染很快耗尽身体。诊治与守夜都没有把病势拦住；大人收起书本和衣物时，才发现一个孩子也已经在家中留下许多秩序。" },
    ],
  }),
  ending({
    id: "life_young_adult_illness_death_pre1949",
    title: "壮年未至",
    yearRange: [1840, 1949],
    ageRange: [15, 39],
    probability: 0.003,
    reason: "急病早逝",
    text: [
      poor("病来以后，家里在药钱、饭钱和继续做工之间来回挪动。身体没有等到账目理顺便停了下来，欠下的并不只有钱。"),
      rural("起初只当是累着了，后来高热和咳喘再也压不住。田里与家中的活被亲友分走，你的人生却在本该最能做活的年纪结束。"),
      { text: "一场急病在数周内恶化，医治仍没能留下你。旁人说年纪还轻，像年轻本应是一张可以向死亡退货的凭据。" },
    ],
  }),
  ending({
    id: "life_midlife_illness_death_pre1949",
    title: "病倒在半路",
    yearRange: [1840, 1949],
    ageRange: [40, 64],
    probability: 0.007,
    reason: "中年重病",
    text: [
      poor("多年劳损终于变成一场卧床不起的病。药方换过几张，家底先薄下去，身体随后也没能回来。"),
      rural("你在一季忙乱后病倒，家人接过牲口、田地和灶上的事。庄稼仍按时抽穗，人的时辰却没有同它商量。"),
      { text: "旧病忽然加重，几次诊治之后仍无转机。你留下未办完的家事和几件顺手的工具，死亡先替生活做了一次仓促交接。" },
    ],
  }),
  ending({
    id: "life_older_adult_death_pre1949",
    title: "没走到古稀",
    yearRange: [1840, 1949],
    ageRange: [65, 74],
    probability: 0.025,
    reason: "年老病逝",
    text: [
      poor("年老和旧病一同压下来，家中拿得出的药与照料都很有限。你在亲人守候中离世，寿数在当时已不算短，告别仍不会因此变轻。"),
      rural("入冬以后，你的脚步越来越少，最后没有再从床上起来。院里的人照旧添柴、喂牲口，把哭声放在活计的间隙里。"),
      { text: "身体在几个月里慢慢衰下去。家人轮流照看，你最终在熟悉的声音中离世；活到这个年纪被称作有福，痛失亲人仍是另一回事。" },
    ],
  }),

  ending({
    id: "life_school_age_illness_death_early_prc",
    title: "没有回到课桌",
    yearRange: [1950, 1977],
    ageRange: [6, 14],
    probability: 0.0015,
    reason: "童年重症",
    text: [
      poor("孩子从诊室回到家，又因病势加重被送回去。药费、车程和守夜挤在一起，最后带回来的只有书包和一叠单据。"),
      rural("卫生员来过，家人也想办法往医院送，重症仍没有退。课本被同学送回家，夹着一张没写完的作业。"),
      { text: "一场少见的重症突然恶化，医治没有换来康复。座位很快被重新排过，认识你的人却要用更久适应那块空处。" },
    ],
  }),
  ending({
    id: "life_young_adult_illness_death_early_prc",
    title: "年轻的讣告",
    yearRange: [1950, 1977],
    ageRange: [15, 39],
    probability: 0.0012,
    reason: "青年急病",
    text: [
      poor("病假条一张接一张，收入和体力一起往下掉。家人尽力借钱寻医，你仍在很年轻的时候离开，留下的衣服都像还在等人上工。"),
      rural("劳作间的一场病被拖了几天，等送到医院时已经太重。队里有人接过你的工，家里却没有办法把一个人按工分补回来。"),
      { text: "急病来得很快，医院尽力抢救，仍未能把你留下。单位整理遗物时把水杯、笔记和未办完的事放在一起，分类忽然变得困难。" },
    ],
  }),
  ending({
    id: "life_midlife_illness_death_early_prc",
    title: "工作做到一半",
    yearRange: [1950, 1977],
    ageRange: [40, 64],
    probability: 0.004,
    reason: "中年重病",
    text: [
      poor("多年劳损和没有及时治疗的旧病一起发作。家里把票证、药钱和住院用品算了又算，最后仍没等到你回家。"),
      rural("你病倒后，家人与邻里分担了地里和屋里的活。生活很快找到了替手，亲人却不断在日常小事里碰见你的缺席。"),
      { text: "一场重病持续恶化，治疗没能扭转。档案上添了去世日期，家人真正需要处理的，是此后每一个没有你的日期。" },
    ],
  }),
  ending({
    id: "life_older_adult_death_early_prc",
    title: "晚年的病床",
    yearRange: [1950, 1977],
    ageRange: [65, 74],
    probability: 0.018,
    reason: "年老病逝",
    text: [
      poor("旧病反复，家里在有限条件下轮流照料。你最后在亲人身边离世，没用完的药被整齐收起，仿佛整齐能使告别稍微可办。"),
      rural("一个冬天里，你越来越少下床。灶火、探望和换洗衣物构成最后的日子，春天到来以前，你安静地离开。"),
      { text: "身体逐渐衰竭，几次住院后没有好转。亲友来作最后探望，谈的仍是吃饭和天气，因为真正的告别很难直接说出口。" },
    ],
  }),

  ending({
    id: "life_school_age_illness_death_reform",
    title: "病历停在童年",
    yearRange: [1978, 1999],
    ageRange: [6, 14],
    probability: 0.0007,
    reason: "儿童重症",
    text: [
      poor("家人带着你在几处医院之间奔波，也向亲友借钱。重症仍没有逆转，后来抽屉里长期留着缴费单和一张小小的学生证。"),
      rural("从乡里送到县城，再转去更远的医院，路一段段走完，病却没有退。家人带回你的书包，车费票夹在作业本里。"),
      { text: "一场凶险的重症没有等来康复。病历完整记录了每次处置，却没有一种格式能够记录同学和家人怎样理解失去。" },
    ],
  }),
  ending({
    id: "life_young_adult_illness_death_reform",
    title: "人生忽然停工",
    yearRange: [1978, 1999],
    ageRange: [15, 39],
    probability: 0.0007,
    reason: "青年重病",
    text: [
      poor("重病很快吃掉积蓄，亲友又凑来一些。钱和办法都尽力往前赶，仍没追上恶化的身体。"),
      rural("病初只当作劳累，后来从乡镇医院转往县城，已没有多少时间。家中收起你常用的农具，谁拿起来都觉得不顺手。"),
      { text: "一场重病在很短时间里恶化。工作、感情和打算都没有机会逐项告别，人生不是做完以后才被收走的。" },
    ],
  }),
  ending({
    id: "life_midlife_illness_death_reform",
    title: "没有等到出院",
    yearRange: [1978, 1999],
    ageRange: [40, 64],
    probability: 0.0025,
    reason: "中年重病",
    text: [
      poor("检查、住院和停工同时消耗家底。家人反复说钱还能再想办法，身体却没有再给一次想办法的时间。"),
      rural("你从县医院转去城里，家人轮换陪床，地里的事托给亲戚。病最终没有好转，回乡的车上少了一个醒着的人。"),
      { text: "重病经过一段治疗仍持续恶化，你没能等到出院。床头柜里的钥匙和零钱被交给家人，日常生活在最不日常的一天完成交接。" },
    ],
  }),
  ending({
    id: "life_older_adult_death_reform",
    title: "家人守到最后",
    yearRange: [1978, 1999],
    ageRange: [65, 74],
    probability: 0.014,
    reason: "晚年病逝",
    text: [
      poor("病情反复后，家人商量把有限的钱用在最需要的治疗和照料上。你在亲人轮流守候中离世，账能算清，告别不能。"),
      rural("晚年的病把活动范围从村路缩到院子，又缩到床边。亲友来过几轮，你在一个安静清晨停止呼吸。"),
      { text: "身体在几次住院后继续衰弱，最终没有熬过这一年。家人办完手续，把你常用的杯子带回家，物件比人更晚离开病房。" },
    ],
  }),

  ending({
    id: "life_school_age_illness_death_modern",
    title: "没有等到返校",
    yearRange: [2000, 2200],
    ageRange: [6, 14],
    probability: 0.0002,
    reason: "罕见儿童重症",
    text: [
      poor("这场罕见重症需要漫长治疗，家人在费用与希望之间尽力支撑，最终仍未等到康复。众筹页面停止更新后，失去才真正开始。"),
      rural("孩子从本地转往更远的医院，亲人轮流陪护。医疗已经尽力，重症仍没有退；返乡时带回的是书包和一盆同学送的植物。"),
      { text: "这是一场极少见而凶险的重症，治疗未能换来返校。班级群里很久没人愿意撤掉你的名字，像保留一把暂时无人坐的椅子。" },
    ],
  }),
  ending({
    id: "life_young_adult_illness_death_modern",
    title: "未完成的人生清单",
    yearRange: [2000, 2200],
    ageRange: [15, 39],
    probability: 0.00035,
    reason: "青年重症",
    text: [
      poor("重病让工作先停下，积蓄随后见底。亲友和医疗团队都尽了力，你仍在很年轻时离世；未完成清单上的多数事项其实只是吃饭、还款和见一个人。"),
      rural("从本地医院转诊以后，家人轮流奔波照护。现代交通缩短了路，没有保证每条路都通往康复。"),
      { text: "一场低概率的重症快速恶化，治疗没有奏效。设备保存了完整数据，亲友保存的是语音、照片和一些没有得到回复的普通消息。" },
    ],
  }),
  ending({
    id: "life_midlife_illness_death_modern",
    title: "治疗没有等来转折",
    yearRange: [2000, 2200],
    ageRange: [40, 64],
    probability: 0.0018,
    reason: "中年重病",
    text: [
      poor("确诊后，你在治疗、副作用和费用之间坚持了一段时间。家人不断说再试一次，病情却没有接受这份商量。"),
      rural("你往返本地与外地医院，复查日期写满日历。医疗条件比旧时好得多，仍有一些疾病不会因为路更快就让步。"),
      { text: "重病经过治疗仍持续进展，你最终在亲友陪伴中离世。工作账号很快停用，家人却很久不敢动你留在门口的鞋。" },
    ],
  }),
  ending({
    id: "life_older_adult_death_modern",
    title: "在照护中告别",
    yearRange: [2000, 2200],
    ageRange: [65, 74],
    probability: 0.01,
    reason: "晚年病逝",
    text: [
      poor("慢性病恶化后，家人和医护把有限条件用在止痛与照料上。你在熟悉的人身边离世，体面不是治愈一切，而是最后仍被当作一个人询问。"),
      rural("身体衰弱以后，你在家与医院之间往返。最后一次回家，亲友轮流坐在床边，院里的光照到傍晚才慢慢退去。"),
      { text: "多种旧病在这一年加重，治疗没能扭转衰竭。家人尊重你的意愿陪伴到最后，告别没有宏大台词，只有一遍遍掖好被角。" },
    ],
  }),
];
