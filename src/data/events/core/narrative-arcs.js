// Cross-year structural arcs for ordinary lives. These are not "epic event"
// decorations: each chain changes a durable condition, lets it exert pressure,
// and later gives that pressure a partial resolution. Player input is never
// required; the existing state decides which life can enter each chain.

const add = (path, value) => ({ path, add: value });
const set = (path, value) => ({ path, set: value });
const has = (path, operator, value) => ({ path, [operator]: value });
const within = (eventId, years = 7) => ({ eventOccurredWithin: { eventId, years } });

function arc(id, title, category, ageRange, text, extra = {}) {
  return {
    id: `arc_${id}`,
    title,
    category,
    ageRange,
    maxOccurrences: 1,
    baseWeight: 28,
    text,
    ...extra,
  };
}

export const narrativeArcEvents = [
  arc("household_debt_begins", "账本摆到桌面中央", "wealth", [18, 62], [
    { conditions: { all: [has("meta.currentYear", "lte", 1948), has("birth.hukou", "eq", "rural")] }, text: "歉收、药钱和旧欠账挤到一起，家里不得不把欠谁几斗谷、几吊钱写在纸上。过去只是紧，如今每一季收成都先有了主人。" },
    { conditions: { all: [has("meta.currentYear", "lte", 1978)] }, text: "家里几笔急用凑成了债。借据压在箱底，饭桌上的话却总会绕回它；数字不大，已经足以替全家安排下一年。" },
    { text: "房租、治疗或一场失手让家里的收支断了口。你们第一次把每笔欠款摊在桌上，发现焦虑原来可以逐项编号，却不能因此变轻。" },
  ], {
    conditions: { all: [has("resources.wealth", "lte", 42)], none: [{ hasTag: "arc_household_debt" }] },
    effects: [add("resources.wealth", -8), add("resources.happiness", -6), add("relationships.family", -3), { addTag: "arc_household_debt" }],
    narrativeTier: "turning_point",
    narrativeDomain: "livelihood",
    lifetimeProbability: 0.6,
  }),
  arc("household_debt_collects", "债不会替人过日子", "wealth", [19, 68], [
    { conditions: { all: [has("meta.currentYear", "lte", 1948)] }, text: "到期的日子比节气还准。你多接活、少添衣，把能卖的余物一件件估价；债主只认数目，日子却还要照常烧饭。" },
    { text: "你开始把收入一到手就分成几份，最先拿走的那份属于过去。偶尔也会买一顿稍好的饭，算是提醒全家：还债不是活着的唯一动词。" },
  ], {
    requiresEvents: ["arc_household_debt_begins"],
    conditions: { all: [within("arc_household_debt_begins"), { hasTag: "arc_household_debt" }] },
    effects: [add("resources.wealth", 4), add("resources.health", -3), add("attrs.mental", 1), { addTag: "arc_debt_being_paid" }],
    narrativeTier: "consequence",
    narrativeDomain: "livelihood",
  }),
  arc("household_debt_closes", "最后一笔划掉", "wealth", [20, 72], [
    "你把最后一笔欠款结清，纸上的名字被一道线划过去。家境没有忽然宽裕，但从这个月起，一部分未来终于不再预先属于别人。",
    "最后一笔账终于还上。你把收据收得比借据还仔细，不是怕谁反悔，只是想留一张纸证明这几年确实走到了头。",
    "你算过几遍，确认旧债已经归零。那天没有庆祝，只在买东西时第一次不必先从过去的欠款里扣除。",
    "债清以后，家里仍旧节省，语气却变了：从‘这个月怎么撑’变成‘明年可以做什么’。未来重新获得了被商量的资格。",
  ], {
    requiresEvents: ["arc_household_debt_collects"],
    conditions: { all: [within("arc_household_debt_collects", 9), { hasTag: "arc_household_debt" }] },
    effects: [add("resources.wealth", -2), add("resources.happiness", 8), add("relationships.family", 3), { removeTag: "arc_household_debt" }, { addTag: "arc_debt_repaid" }],
    narrativeTier: "consequence",
    narrativeDomain: "livelihood",
    narrativeThread: { close: true },
  }),

  arc("care_burden_arrives", "家里的时间重新排班", "family", [28, 65], [
    { conditions: { all: [has("location.migratedTimes", "gte", 1)] }, text: "父母的复诊渐渐变成固定日程。离家远的人多出钱，住得近的人多出时间；路比从前快了，照护却仍要从某个人的一天里完整地拿走几个小时。" },
    { conditions: { all: [has("birth.gender", "eq", "female")] }, text: "父母需要长期照护后，亲戚很自然地先来问你有没有空。你把买药、陪诊和自己的生活挤进同一本日历，也开始追问：为什么所谓孝顺总有一个默认的性别。" },
    { text: "父母需要长期照护，家里的时间从此重新排班。谁陪诊、谁取药、谁夜里守着，终于从含糊的‘大家想办法’变成了具体的人和日期。" },
  ], {
    requiresEvents: ["daily_parent_illness"],
    conditions: { all: [within("daily_parent_illness", 8)] },
    effects: [add("resources.wealth", -6), add("resources.freedom", -7), add("relationships.family", 2), { addTag: "arc_family_care_burden" }],
    narrativeTier: "consequence",
    narrativeDomain: "family",
  }),
  arc("care_siblings_ledger", "兄弟姐妹的另一种账", "family", [29, 68], [
    "照护久了，兄弟姐妹之间开始计算钱、时间和谁上次请过假。争执并不证明亲情是假的，只证明劳动若总被说成心意，最后一定有人多做而不能开口。",
    "一次陪诊安排让全家吵了起来。出钱的人觉得自己已经尽力，出时间的人觉得时间从未被算成成本；亲情在两种算法之间站得很累。",
    "你们终于把谁守夜、谁买药、谁承担费用写出来。表格看着冷，倒比一句‘大家都是一家人’更肯承认每个人的辛苦。",
    "照护逐渐成了兄弟姐妹之间最难对的账。有人总在场，有人总有理由；旧日的亲疏，也在每次排班里重新显影。",
  ], {
    requiresEvents: ["arc_care_burden_arrives"],
    conditions: { all: [within("arc_care_burden_arrives"), { hasTag: "arc_family_care_burden" }] },
    effects: [add("relationships.family", -5), add("resources.happiness", -4), add("attrs.mental", 1), { addTag: "arc_care_conflict_spoken" }],
    narrativeTier: "consequence",
    narrativeDomain: "family",
  }),
  arc("care_new_order", "照护有了新秩序", "family", [30, 72], [
    "家里终于把照护分成能执行的小事，也承认出钱与出力不是同一种辛苦。问题没有消失，只是不再全压在最沉默的人身上。",
    "几次争执后，家里定下了较稳定的轮次。仍会有人迟到、有人抱怨，但再没有谁能假装照护只是顺手帮忙。",
    "你们把钱、时间和紧急时谁先到场说清，也给主要照护的人留出休息。孝顺仍是感情，劳动终于有了边界。",
    "照护慢慢从临时救火变成可以接力的日程。家人不再等最能忍的人先倒下，才承认分工出了问题。",
  ], {
    requiresEvents: ["arc_care_siblings_ledger"],
    conditions: { all: [within("arc_care_siblings_ledger", 9), { hasTag: "arc_family_care_burden" }] },
    effects: [add("relationships.family", 7), add("resources.freedom", 4), add("resources.happiness", 3), { removeTag: "arc_family_care_burden" }, { addTag: "arc_care_shared" }],
    narrativeTier: "consequence",
    narrativeDomain: "family",
    narrativeThread: { close: true },
  }),

  arc("work_breaks_off", "这份活忽然没有了", "career", [18, 60], [
    { conditions: { all: [has("meta.currentYear", "lte", 1948)] }, text: "东家停了买卖，工棚也散了。昨天还嫌活重，今天连重活都轮不到你；一份生计消失时，没有通知，只有门板比平日更早合上。" },
    { conditions: { all: [has("meta.currentYear", "lte", 1999)] }, text: "原本以为会一直做下去的活忽然停了。名单、口头通知或一扇不开的门，把多年熟练变成了暂时没人购买的东西。" },
    { text: "工作结束得比你准备得快。账号、工牌或排班表先失效，身体还在旧时间醒来；失业最先夺走的不是收入，而是每天该去哪里的确定。" },
  ], {
    conditions: { all: [has("career.status", "in", ["employed", "self_employed", "family_labor", "gig_worker"]), has("meta.age", "lte", 60)] },
    effects: [set("career.status", "unemployed"), add("career.income", -10), add("resources.wealth", -8), add("resources.happiness", -7), { addTag: "arc_work_lost" }],
    narrativeTier: "turning_point",
    narrativeDomain: "career",
    lifetimeProbability: 0.36,
  }),
  arc("work_odd_jobs", "零活把日子接住", "career", [19, 64], [
    { conditions: { all: [has("meta.currentYear", "lte", 1948)] }, text: "你替人搬货、守夜、赶一段车，哪处缺手便往哪处去。零活没有前程这个词，却先把当天的米钱接住了。" },
    { text: "你开始接临时活，按天、按件或按单结算。自由听起来体面，真正落到日历上，常常只是今天干完仍不知道下周在哪里。" },
  ], {
    requiresEvents: ["arc_work_breaks_off"],
    conditions: { all: [within("arc_work_breaks_off", 6), { hasTag: "arc_work_lost" }] },
    effects: [set("career.status", "self_employed"), add("career.income", 5), add("resources.wealth", 5), add("resources.health", -3), { addTag: "arc_odd_jobs" }],
    narrativeTier: "consequence",
    narrativeDomain: "career",
  }),
  arc("work_stands_again", "重新站稳", "career", [20, 68], [
    "日子终于重新有了较稳定的来处。你没有回到原来的位置，手上却多了几种过去看不起眼的本事；人被生活改行，履历往往最后才知道。",
    "零活里的一项渐渐做成了稳定生计。它未必是理想的去处，却让下个月重新可以计划，而不是只靠猜。",
    "你没有等回旧岗位，反倒在别处站稳。过去那段失业仍留在习惯里：手头一宽，你先想到的是留一点退路。",
    "新的活计终于接得住日常开销。你承认这条路不是自己当初选的，也承认走久以后，脚已经在这里长出了一点根。",
  ], {
    requiresEvents: ["arc_work_odd_jobs"],
    conditions: { all: [within("arc_work_odd_jobs", 9), { hasTag: "arc_work_lost" }] },
    effects: [set("career.status", "self_employed"), add("career.income", 7), add("resources.achievement", 6), add("attrs.mental", 1), { removeTag: "arc_work_lost" }, { addTag: "arc_work_rebuilt" }],
    narrativeTier: "consequence",
    narrativeDomain: "career",
    narrativeThread: { close: true },
  }),

  arc("migration_address_sticks", "地址终于写熟了", "migration", [18, 62], [
    { conditions: { all: [has("meta.currentYear", "lte", 1948)] }, text: "离乡几年后，你终于能不问路写下现住的街巷。口音仍会暴露来处，赊账和借工具的人却已知道到哪里找你。异乡不是突然变成家，只是生活先在那里留下了固定地址。" },
    { text: "搬来几年后，你填表时不再犹豫现住址怎么写。熟悉的店、能托付钥匙的人和一条闭眼也走得回去的路，慢慢把‘暂住’改成了生活。" },
  ], {
    conditions: { all: [has("location.migratedTimes", "gte", 1)], none: [{ hasTag: "arc_settled_away" }] },
    effects: [add("resources.freedom", 4), add("relationships.friendship", 4), add("relationships.family", -2), { addTag: "arc_settled_away" }],
    narrativeTier: "turning_point",
    narrativeDomain: "migration",
  }),
  arc("migration_two_homes", "故乡开始需要解释", "migration", [19, 70], [
    "回乡时，有人说你口音变了；回到住处，又有人问你老家究竟在哪里。你拥有了两个能被称作家的地方，也从此要向两边解释为什么不能永远留下。",
    "你回去时仍被当作自家人，也被笑话许多习惯已经变了。故乡没有拒绝你，只是不再允许你毫无解释地属于那里。",
    "表格只留一个籍贯栏，生活却给了你两个答案。一个地方知道你的童年，另一个地方知道你怎样成为现在的人。",
    "你在新住处想念家乡，真正回去又惦记这里没做完的事。迁居久了，乡愁也学会了往返。",
  ], {
    requiresEvents: ["arc_migration_address_sticks"],
    conditions: { all: [within("arc_migration_address_sticks", 8), { hasTag: "arc_settled_away" }] },
    effects: [add("relationships.family", 3), add("resources.happiness", -2), add("attrs.mental", 1), { addTag: "arc_two_homes" }],
    narrativeTier: "consequence",
    narrativeDomain: "migration",
  }),
  arc("migration_belongs", "留下的人也成了当地人", "migration", [22, 76], [
    "有人向新来者介绍附近的路，顺口说‘你问他，他住得久’。你这才发现，自己已经从那个拎着行李找门牌的人，变成了替别人指路的人。",
    "邻里托你代收东西，办事的人也认得你的脸。归属没有证书，只是在许多小事里，别人开始默认你明天还会在这里。",
    "一个初来的人向你打听怎样安顿，你把当年吃过的亏都讲了。说到一半才意识到，这座城的生存门道已经成了你的本地知识。",
    "你第一次自然地对外地人说‘我们这里’。话出口后自己也笑了；一个代词，悄悄完成了多年迁居没有举行的仪式。",
  ], {
    requiresEvents: ["arc_migration_two_homes"],
    conditions: { all: [within("arc_migration_two_homes", 10), { hasTag: "arc_settled_away" }] },
    effects: [add("relationships.friendship", 6), add("resources.reputation", 4), add("resources.happiness", 4), { addTag: "arc_local_belonging" }],
    narrativeTier: "consequence",
    narrativeDomain: "migration",
    narrativeThread: { close: true },
  }),

  arc("marriage_silence", "两个人之间的沉默变长", "relationship", [25, 62], [
    "你们说的多是钱、家务和第二天几点出门，很少再问彼此最近过得怎样。婚姻没有发生一场足够响亮的事故，只是沉默一点点占了更多位置。",
    "同住一个屋檐下，你们却各自在心里过完许多事。真正的争吵反而少了，因为连解释都开始嫌费力。",
    "饭桌上的安排越来越准确，别的话越来越短。生活像一台运转正常的机器，只有两个人都知道里面某个零件已经很久没有上油。",
    "你们并没有不关心彼此，只是每次想开口，总有账单、家务或疲惫先坐下来。久而久之，关心也学会了保持沉默。",
  ], {
    conditions: { all: [has("relationships.partnerStatus", "eq", "married"), has("relationships.partnerQuality", "lte", 75)], none: [{ hasTag: "arc_marriage_strain" }] },
    effects: [add("relationships.partnerQuality", -10), add("relationships.romance", -7), add("resources.happiness", -5), { addTag: "arc_marriage_strain" }],
    narrativeTier: "turning_point",
    narrativeDomain: "relationship",
    lifetimeProbability: 0.38,
  }),
  arc("marriage_speaks", "把账和话一起摊开", "relationship", [26, 66], [
    "一次争执后，你们没有像往常那样各自睡去，而是把钱、家务、委屈和谁总在道歉一件件说开。谈话并不浪漫，诚实有时甚至很难听，却终于比猜测便宜。",
    "你们终于谈的不是那件小事，而是小事背后几年没有说完的话。谁承担什么、谁总被默认让步，一项项摆到了明处。",
    "一晚的谈话几次说不下去，又几次重新开始。你们没有立刻和好，却第一次准确知道对方究竟在生什么气。",
    "你们把各自以为对方应该懂的事说了出来。原来默契也会过期，需要用不太体面的实话重新续上。",
  ], {
    requiresEvents: ["arc_marriage_silence"],
    conditions: { all: [within("arc_marriage_silence", 7), { hasTag: "arc_marriage_strain" }, has("relationships.partnerStatus", "eq", "married")] },
    effects: [add("relationships.partnerQuality", 7), add("relationships.romance", 3), add("resources.happiness", -1), { addTag: "arc_marriage_spoken" }],
    narrativeTier: "consequence",
    narrativeDomain: "relationship",
  }),
  arc("marriage_after", "没有回到从前", "relationship", [27, 70], [
    "日子没有回到最初，也没有必要。你们重新分过一些责任，保留各自一小块不被打扰的时间；关系真正恢复时，常常不是更甜，而是更少让一个人独自撑着。",
    "后来你们仍会为旧问题争执，只是更早知道该在哪里停。修复没有抹去裂缝，而是让双方不再假装裂缝从未存在。",
    "一些责任重新分过，几句谢谢也重新出现。婚姻没有焕然一新，只从一人默默补洞，变成两个人都肯拿工具。",
    "你们不再追问能否回到从前，而是商量以后怎样过。关系从热烈里退下来，又在公平和体谅里找到另一种温度。",
  ], {
    requiresEvents: ["arc_marriage_speaks"],
    conditions: { all: [within("arc_marriage_speaks", 9), { hasTag: "arc_marriage_strain" }, has("relationships.partnerStatus", "eq", "married")] },
    effects: [add("relationships.partnerQuality", 8), add("relationships.romance", 4), add("resources.freedom", 3), { removeTag: "arc_marriage_strain" }, { addTag: "arc_marriage_reworked" }],
    narrativeTier: "consequence",
    narrativeDomain: "relationship",
    narrativeThread: { close: true },
  }),

  arc("body_draws_line", "身体划出一条界线", "health", [20, 76], [
    { conditions: { all: [has("meta.currentYear", "lte", 1948)] }, text: "一场病后，你再也不能像从前那样连续做重活。没人替这种变化命名，身体却每天按新的规矩收工；你第一次知道，力气也会有旧账。" },
    "一次检查或反复发作的症状告诉你，身体不能再按从前的办法使用。诊断给了它一个名字，生活则要为这个名字腾出时间、钱和耐心。",
    "身体用一次明显的失灵终止了你的侥幸。医生说得平静，你却花了很久才接受，过去那个能硬撑过去的自己已经不能继续当作标准。",
    "一项长期问题终于被确认。知道原因使人安心一点，也使人难过一点；从此每个计划都要给身体留一个有否决权的位置。",
  ], {
    conditions: { all: [has("resources.health", "lte", 48)], none: [{ hasTrait: "arc_chronic_limit" }] },
    effects: [add("resources.health", -5), add("career.income", -4), add("resources.freedom", -5), { addTrait: "arc_chronic_limit" }],
    narrativeTier: "turning_point",
    narrativeDomain: "health",
    lifetimeProbability: 0.58,
  }),
  arc("body_new_schedule", "按身体重新安排一天", "health", [21, 80], [
    "你开始把药、休息和能做多少活写进一天，而不是等身体把你强行按住。节制并不英雄，却让许多个普通早晨免于变成急诊。",
    "你学会在还没累垮以前停下，也把复诊和用药放进固定日程。身体并不因此听话，只是不再每次都要靠出事提醒。",
    "一天被重新切分：什么时候能做重活，什么时候必须坐下，哪些药不能忘。生活少了一点随意，多了一点可以持续。",
    "你不再拿最好的那一天要求每一天。按身体实际能给出的力气安排事情，最初像退让，后来证明是另一种掌握。",
  ], {
    requiresEvents: ["arc_body_draws_line"],
    conditions: { all: [within("arc_body_draws_line", 7), { hasTrait: "arc_chronic_limit" }] },
    effects: [add("resources.health", 5), add("resources.freedom", -2), add("attrs.mental", 1), { addTag: "arc_health_routine" }],
    narrativeTier: "consequence",
    narrativeDomain: "health",
  }),
  arc("body_life_adapts", "病没有消失，生活换了方法", "health", [22, 86], [
    "身体并未恢复成从前的样子，你却学会了在哪些地方停、向谁开口、怎样不把每次复发都解释成失败。接受不是投降，是不再把余下的力气花在假装无事。",
    "你逐渐知道什么症状该警惕，什么难受可以慢慢等。疾病仍在，恐惧不再每次都先于它抵达。",
    "生活为身体换了一套办法：少做一些，提前求助，也允许计划临时改变。你失去了一部分随意，却重新得到对日子的判断。",
    "你不再把能否回到从前当作唯一的康复标准。能在新的界线内把生活过下去，也是一种没有奖状的复原。",
  ], {
    requiresEvents: ["arc_body_new_schedule"],
    conditions: { all: [within("arc_body_new_schedule", 10), { hasTrait: "arc_chronic_limit" }] },
    effects: [add("resources.health", 3), add("resources.happiness", 5), add("attrs.mental", 1), { addTag: "arc_health_adapted" }],
    narrativeTier: "consequence",
    narrativeDomain: "health",
    narrativeThread: { close: true },
  }),

  arc("family_pillar_missing", "家里少了一根支柱", "family", [12, 55], [
    { conditions: { all: [has("meta.age", "lte", 18)] }, text: "家里一个能挣钱或主事的人忽然长期缺席，可能是病、远行，也可能是再也补不上的变故。大人仍说‘你只管读书’，分给你的活却一件件多了起来。" },
    { text: "家里一个原本撑事的人因病、离开或生计失败退到了后面。许多决定开始等你开口，你并没有准备好，只是别人已经没有更合适的人可等。" },
  ], {
    conditions: { all: [has("resources.wealth", "lte", 52)], none: [{ hasTag: "arc_family_pillar_missing" }] },
    effects: [add("relationships.family", -4), add("resources.wealth", -7), add("resources.freedom", -6), { addTag: "arc_family_pillar_missing" }],
    narrativeTier: "turning_point",
    narrativeDomain: "family",
    lifetimeProbability: 0.43,
  }),
  arc("family_steps_forward", "你被推到前面", "family", [13, 60], [
    { conditions: { all: [has("meta.age", "lte", 20)] }, text: "你开始替家里跑更远的路、听更难的话，也学会在大人面前装作不慌。所谓懂事，常常只是一个孩子发现哭完以后事情仍要有人做。" },
    { text: "你接过账目、联络和那些没人愿意作的决定。亲戚夸你能扛事，夸奖很轻，责任却不会因为被说得体面而少一件。" },
  ], {
    requiresEvents: ["arc_family_pillar_missing"],
    conditions: { all: [within("arc_family_pillar_missing", 7), { hasTag: "arc_family_pillar_missing" }] },
    effects: [add("relationships.family", 5), add("resources.achievement", 4), add("resources.happiness", -4), add("attrs.mental", 1), { addTag: "arc_family_responsible" }],
    narrativeTier: "consequence",
    narrativeDomain: "family",
  }),
  arc("family_breathes_again", "终于轮到你喘一口气", "family", [16, 68], [
    "几年过去，家里的难处没有奇迹般消失，只是被一点点分担、还清或接受。某天你办完事回家，忽然发现晚上没有谁等你作决定，于是安静坐了一会儿。",
    "家里的事情终于不再件件追着你。闲下来时你反而有些不习惯，像一个长期背重物的人，放下后仍保持着弯腰的姿势。",
    "难关慢慢退到往事里，没人说得清究竟从哪一天开始好转。你只是某次出门时发现，不必再把所有人的问题都装在身上。",
    "有人接过了一部分责任，旧账也有了着落。你第一次为自己安排一件无关全家的事，甚至因此感到一点不必要的内疚。",
  ], {
    requiresEvents: ["arc_family_steps_forward"],
    conditions: { all: [within("arc_family_steps_forward", 10), { hasTag: "arc_family_pillar_missing" }] },
    effects: [add("relationships.family", 5), add("resources.freedom", 5), add("resources.happiness", 4), { removeTag: "arc_family_pillar_missing" }, { addTag: "arc_family_stabilized" }],
    narrativeTier: "consequence",
    narrativeDomain: "family",
    narrativeThread: { close: true },
  }),

  arc("private_ambition", "原来的路忽然不够了", "education", [15, 32], [
    { conditions: { all: [has("meta.currentYear", "lte", 1948)] }, text: "你从一张旧报、一个远客或一次进城里看见另一种活法。那条路未必容得下你，知道它存在以后，原来的日子却再也不能被说成唯一。" },
    { text: "一次见闻让你开始认真想换一条路：继续学、离开这里，或做一件家里没人做过的事。愿望尚未成为计划，已经先使眼前的安稳显得狭窄。" },
  ], {
    conditions: { any: [has("attrs.intelligence", "gte", 5), has("attrs.mental", "gte", 6), has("education.score", "gte", 38)], none: [{ hasTag: "arc_private_ambition" }] },
    effects: [add("resources.freedom", 6), add("resources.achievement", 4), add("relationships.family", -2), { addTag: "arc_private_ambition" }],
    narrativeTier: "turning_point",
    narrativeDomain: "education",
    lifetimeProbability: 0.58,
  }),
  arc("ambition_costs", "愿望开始收取代价", "education", [16, 38], [
    "为了那条尚未走通的路，你花掉钱、睡眠和家人的耐心。理想最初总像免费的，真正开始做以后，才一项项寄来账单。",
    "你为新的方向挤出时间，也不断解释为什么眼前的安稳还不够。愿望使人向前，也使每一次失败显得格外像辜负。",
    "那条路比想象中更贵：要交学费、误工，或承受旁人说你不务正业。你没有因此放弃，只是不再把理想说得轻巧。",
    "真正开始行动后，热情很快遇到重复、琐碎和退步。你终于知道，所谓坚持多半不是每天激动，而是第二天仍肯把同一件难事再做一遍。",
  ], {
    requiresEvents: ["arc_private_ambition"],
    conditions: { all: [within("arc_private_ambition", 6), { hasTag: "arc_private_ambition" }] },
    effects: [add("resources.wealth", -6), add("resources.health", -3), add("education.score", 5), add("resources.achievement", 3), { addTag: "arc_ambition_paid" }],
    narrativeTier: "consequence",
    narrativeDomain: "education",
  }),
  arc("ambition_becomes_path", "走成一条自己的路", "education", [18, 45], [
    "结果并不完全像最初想象：有些目标缩小了，有些本事留下来。你终于不再只用‘如果当时’谈那段愿望，因为它已经以某种不完美的方式进入了生活。",
    "那份愿望没有完整实现，却替你打开了另一条路。多年后回看，真正改变你的不是抵达，而是曾经不肯把原处当成唯一答案。",
    "你终于把想做的事变成了生活的一部分，规模比梦想小，代价比梦想具体。它不再耀眼，却开始能够持续。",
    "道路走到这里，与起初画的地图已经很不一样。你保留真正重要的部分，也放过几个年轻时以为非实现不可的目标。",
  ], {
    requiresEvents: ["arc_ambition_costs"],
    conditions: { all: [within("arc_ambition_costs", 9), { hasTag: "arc_private_ambition" }] },
    effects: [add("resources.achievement", 8), add("resources.happiness", 5), add("attrs.mental", 1), { addTag: "arc_self_directed_path" }],
    narrativeTier: "consequence",
    narrativeDomain: "education",
    narrativeThread: { close: true },
  }),

  arc("work_becomes_skilled", "手上的活开始认你", "career", [21, 58], [
    { conditions: { all: [has("meta.currentYear", "lte", 1948)] }, text: "你做这门活久了，手比嘴更早知道哪里不对。东家未必肯多给工钱，同行遇到难处却开始先来问你；熟练替你挣到位置，也让人更放心把麻烦推来。" },
    { conditions: { all: [has("career.status", "eq", "family_labor")] }, text: "节气、牲口和地里的活没有说明书，你却已知道哪阵风后该先收什么、哪件农具响一声便要停手。家里人渐渐先来问你，熟练也因此多背了一份操心。" },
    { conditions: { all: [has("career.status", "in", ["self_employed", "gig_worker"])] }, text: "同一种活做得多了，你开始在动手前便看出最费工的地方。顾客未必知道这份分寸从哪来，只知道难办的事渐渐会点名找你。" },
    "几年做下来，你成了别人嘴里的熟手。许多问题不再需要请示便能处理，代价是出了差错时，大家也会很自然地先来找你。",
    "你终于能靠经验提前看出事情会在哪里出错。技能没有颁奖仪式，只是新人把工具递给你时，开始默认你知道下一步。",
    "工作渐渐长进到手里，别人看你做得轻松，只有你知道那是许多次返工叠出来的。熟练最会伪装成天生如此。",
  ], {
    conditions: { all: [has("career.status", "in", ["employed", "self_employed", "family_labor", "gig_worker"])] , none: [{ hasTag: "arc_work_skilled" }] },
    effects: [add("career.level", 8), add("resources.achievement", 6), add("resources.reputation", 4), { addTag: "arc_work_skilled" }],
    narrativeTier: "turning_point",
    narrativeDomain: "career",
    lifetimeProbability: 0.70,
  }),
  arc("work_skill_cost", "能者总被多派一件事", "career", [22, 62], [
    "你因为做得快，得到的奖励是更多的活。拒绝显得不够仗义，答应又把自己的时间一点点吃掉；能力若没有边界，很容易被当成公共财产。",
    "重要的事渐渐都绕到你手上，名声和疲惫一起增加。你开始明白，可靠并不等于永远有空。",
    "别人说‘这事还是你来放心’，语气像夸奖，落到日程上却是一项没有加钱的责任。你第一次认真计算熟练究竟替自己省了什么。",
    "你成了出了问题就被叫到的人。解决问题带来成就，也使许多原本不属于你的问题从此认得了门。",
  ], {
    requiresEvents: ["arc_work_becomes_skilled"],
    conditions: { all: [within("arc_work_becomes_skilled", 8), { hasTag: "arc_work_skilled" }] },
    effects: [add("resources.achievement", 4), add("resources.freedom", -5), add("resources.health", -3), add("resources.happiness", -2), { addTag: "arc_work_overrelied" }],
    narrativeTier: "consequence",
    narrativeDomain: "career",
  }),
  arc("work_teaches_next", "把门道交给后来的人", "career", [24, 70], [
    "你开始带一个后来的人，没有只说照着做，而是把哪些地方最容易吃亏也讲清。经验一旦肯解释，才不再只是老师傅维持地位的谜语。",
    "新人问了一个你从前挨骂才弄懂的问题。你没有照样骂回去，而是把缘由说清；一门活的传统因此少继承了一点坏脾气。",
    "你把常犯的错和省力的门道告诉后来者，也承认有些旧规矩只是过去的人懒得改。传艺不必连偏见一起打包。",
    "有人在你身边逐渐做熟。你发现真正的本事不是让别人永远离不开自己，而是有一天可以放心把活交出去。",
  ], {
    requiresEvents: ["arc_work_skill_cost"],
    conditions: { all: [within("arc_work_skill_cost", 10), { hasTag: "arc_work_skilled" }] },
    effects: [add("resources.reputation", 7), add("resources.achievement", 5), add("resources.freedom", 3), { addTag: "arc_work_mentor" }],
    narrativeTier: "consequence",
    narrativeDomain: "career",
    narrativeThread: { close: true },
  }),

  arc("home_has_door", "终于有了一处能关门的地方", "livelihood", [24, 66], [
    { conditions: { all: [has("meta.currentYear", "lte", 1948), has("birth.hukou", "eq", "rural")] }, text: "多年攒下的粮钱和人情，终于换来一间能由自家关门的屋或一小块可长期安身的地方。屋顶仍漏，地契或租约也薄，睡下时却第一次不用听别人何时叫你搬走。" },
    { conditions: { all: [has("meta.currentYear", "lte", 1978)] }, text: "家里终于分到、租到或腾出一处相对稳定的住处。地方不大，家具也多是凑来的；能决定墙上钉哪一颗钉子，已经像一种缓慢到来的自由。" },
    "你终于有了一处相对稳定的住处，也第一次为押金、修缮或长期付款认真算账。关上门的那刻很安静，未来许多年的钱却已经在门外排队。",
    "住址终于不再像临时答案。你把常用东西从箱子里拿出来，挂到固定的位置；安居并非从此没有负担，只是负担第一次有了门牌。",
  ], {
    conditions: { all: [has("resources.wealth", "gte", 43)], none: [{ hasTag: "arc_stable_home" }] },
    effects: [add("resources.wealth", -10), add("resources.freedom", 6), add("resources.happiness", 6), { addTag: "arc_stable_home" }],
    narrativeTier: "turning_point",
    narrativeDomain: "livelihood",
    lifetimeProbability: 0.72,
  }),
  arc("home_demands", "住处也有自己的胃口", "livelihood", [25, 72], [
    "屋顶、管线、租约或一件忽然坏掉的东西开始要钱。你发现房子能替人挡风，也很会在最不方便的时候张口。",
    "安顿下来以后，修补和费用接连出现。每解决一处，住处便更像自己的；账本也以同样速度证明这一点。",
    "家里一处毛病拖不得，你只好挪用原本留给别的计划的钱。所谓稳定，并不是不再出事，而是出了事仍知道要把哪里修好。",
    "一张费用单或一场修缮把安居的浪漫压回现实。你一边嫌它费钱，一边监督得比谁都细，已经很像一个真正的住户。",
  ], {
    requiresEvents: ["arc_home_has_door"],
    conditions: { all: [within("arc_home_has_door", 8), { hasTag: "arc_stable_home" }] },
    effects: [add("resources.wealth", -7), add("resources.health", -2), add("resources.happiness", -2), { addTag: "arc_home_repaired" }],
    narrativeTier: "consequence",
    narrativeDomain: "livelihood",
  }),
  arc("home_becomes_memory", "这个地址进入了家里的往事", "livelihood", [27, 80], [
    "几年以后，家里人开始用‘那时我们住在这里’给往事分段。墙上的裂纹、门后的身高线和一次争吵的位置，都替这个地址取得了比产权更难转让的东西。",
    "这处住址渐渐装下婚丧、节日和许多并不起眼的晚饭。房子仍只是材料，反复回去的人把它变成了家。",
    "有人提议搬走时，全家才发现各自舍不得的并不是同一件东西。一个地址能容纳许多版本的家史，连争论都有固定回声。",
    "你终于不再每次介绍这里都先说‘暂时住着’。日子在墙角留下痕迹，住处也在你的叙述里获得了过去时。",
  ], {
    requiresEvents: ["arc_home_demands"],
    conditions: { all: [within("arc_home_demands", 10), { hasTag: "arc_stable_home" }] },
    effects: [add("relationships.family", 5), add("resources.happiness", 4), add("resources.reputation", 2), { addTag: "arc_home_memory" }],
    narrativeTier: "consequence",
    narrativeDomain: "livelihood",
    narrativeThread: { close: true },
  }),

  arc("collective_affair", "有件公事必须有人开口", "history", [22, 66], [
    { conditions: { all: [has("meta.currentYear", "lte", 1948), has("birth.hukou", "eq", "rural")] }, text: "水路、租谷或一项摊派让几户人家聚到一起。大家都嫌麻烦，却总得有人把不公平说成一句能当面听懂的话；你最后站了起来。" },
    { conditions: { all: [has("meta.currentYear", "lte", 1948)] }, text: "同行、街坊或同乡为一件共同的难处商量对策。人人都希望别人先开口，你听到最后，还是把那句可能得罪人的话说了出来。" },
    { conditions: { all: [has("meta.currentYear", "gte", 1949), has("meta.currentYear", "lte", 1999)] }, text: "所在的单位、行当或街坊遇到一件谁都绕不过去的公事。会议说了很久套话，你终于把真正的问题提出来；屋里安静了一下，事情也终于有了名字。" },
    "一件涉及许多人的事迟迟没人负责。你整理过情况，在会上或群里把问题讲清；发言只用了几分钟，决定开口却花了好几个晚上。",
  ], {
    conditions: { none: [{ hasTag: "arc_collective_affair" }] },
    effects: [add("resources.reputation", 6), add("resources.freedom", -3), add("relationships.friendship", -2), { addTag: "arc_collective_affair" }],
    narrativeTier: "historical_pressure",
    narrativeDomain: "history",
    lifetimeProbability: 0.64,
  }),
  arc("collective_cost", "开口以后，麻烦认得了你", "history", [23, 70], [
    "事情有了推进，抱怨和跑腿也从此先来找你。站出来的人常被误认为从今以后都该负责，你开始学习把共同的事重新分给共同的人。",
    "有人感谢，也有人说你爱出头。你发现公共事务最难的不是讲出道理，而是让赞成的人也肯承担下一步。",
    "开口以后，你被叫去补材料、解释和收拾细节。意见一旦留下姓名，便会收到比掌声更持久的后续。",
    "问题不再无人看见，你却也成了各种不满最方便的地址。做一件公事的代价，常是别人开始把更多公事寄来。",
  ], {
    requiresEvents: ["arc_collective_affair"],
    conditions: { all: [within("arc_collective_affair", 8), { hasTag: "arc_collective_affair" }] },
    effects: [add("resources.reputation", 3), add("resources.freedom", -4), add("resources.happiness", -3), add("attrs.mental", 1), { addTag: "arc_collective_cost" }],
    narrativeTier: "consequence",
    narrativeDomain: "history",
  }),
  arc("collective_rule", "事情最后留下了一条规矩", "history", [24, 74], [
    "争论没有解决所有问题，却留下了一条更清楚的办法：账目怎么记、轮次怎么排、谁有权问。个人的勇敢会用完，能重复执行的规矩才接得住后来的人。",
    "大家终于把一次争执写成了以后可照办的办法。它并不完美，至少下一次不必再靠嗓门最大的人决定。",
    "事情收尾时，没有谁成为英雄，只多了一张公开的表、一项轮值或一句可追问的承诺。制度偶尔就是把好意从记性里抢救出来。",
    "最后留下的不是掌声，而是一条能被后来人使用的规则。你因此明白，真正的改变常比故事结尾更像一份略显乏味的说明。",
  ], {
    requiresEvents: ["arc_collective_cost"],
    conditions: { all: [within("arc_collective_cost", 10), { hasTag: "arc_collective_affair" }] },
    effects: [add("resources.reputation", 5), add("relationships.friendship", 5), add("resources.freedom", 3), { addTag: "arc_collective_rule" }],
    narrativeTier: "consequence",
    narrativeDomain: "history",
    narrativeThread: { close: true },
  }),

  arc("old_age_keys_change_hands", "钥匙换到了另一双手里", "family", [62, 94], [
    { conditions: { all: [has("birth.hukou", "eq", "rural"), has("meta.currentYear", "lte", 1978)] }, text: "腿脚慢下来后，你把粮柜、工具或家中要紧处的钥匙交给晚辈。钥匙很轻，递出去时却像把许多不肯承认的衰老也一并放到了对方手里。" },
    { conditions: { all: [has("relationships.children", "gte", 1), has("resources.health", "lte", 45)] }, text: "取药、缴费和几件要紧事开始由孩子经手。你把钥匙递过去，又把抽屉次序讲了三遍；对方说记住了，第二天仍照你的老办法找，算是给交接留一点面子。" },
    { conditions: { all: [has("relationships.children", "lte", 0), has("relationships.family", "gte", 35)] }, text: "身体慢下来后，你把备用钥匙交给一位可信的亲属。没有哪种称谓自动附带照护义务，你们把能代办什么逐项说清，连备用钥匙放哪里也另外写了一张纸。" },
    { conditions: { all: [has("meta.currentYear", "gte", 2000), has("resources.wealth", "gte", 55)] }, text: "家里的门卡、证件和缴费账号开始由家人协助保管。你先交出一串密码，又立即叮嘱不要乱点；数字时代没有让交接变轻，只让钥匙忽然多得记不住。" },
    { text: "有些事终于不再由你亲自去办。你把证件和钥匙交给可信的人，一连嘱咐几遍；对方没有催，只在纸上把每句话认真记下。" },
  ], {
    conditions: { all: [has("resources.health", "lte", 75)], none: [{ hasTag: "arc_old_age_handoff" }] },
    effects: [add("resources.freedom", -7), add("relationships.family", 4), add("resources.happiness", -3), { addTag: "arc_old_age_handoff" }],
    narrativeTier: "turning_point",
    narrativeDomain: "family",
    lifetimeProbability: 0.68,
  }),
  arc("old_age_boundary", "替你办，不替你决定", "family", [63, 96], [
    { conditions: { all: [has("relationships.children", "lte", 0)] }, text: "亲属替你办好一件事，也顺手替你改了主意。你们后来把边界说清：钥匙可以托付，决定仍要回来问本人；亲戚称谓不是一张空白委托书。" },
    { conditions: { all: [has("resources.wealth", "lte", 35)] }, text: "钱紧时，家人替你选了最省的一种安排，直到办完才告诉你。你没有反对节省，只要求以后先把选择摆出来；贫穷已经够爱替人作主，不必再添一个人。" },
    { conditions: { all: [has("meta.currentYear", "gte", 2000)] }, text: "家人替你在线办事很快，验证码却常同决定一起被拿走。你要求每次点下确认前先把屏幕转过来；字可以放大，人的意见不能缩成默认选项。" },
    { conditions: { all: [has("relationships.family", "lte", 35)] }, text: "一次代办变成争执，你担心别人嫌麻烦，对方也担心你逞强。最后约定能帮到哪一步便停在哪一步，关系不算亲密，规矩反而说得很清楚。" },
    { text: "家人怕你劳累，渐渐什么都不让你管。你说自己需要的是扶手，不是撤职；这句带火气的话，反而把照护的边界说清了。" },
  ], {
    requiresEvents: ["arc_old_age_keys_change_hands"],
    conditions: { all: [within("arc_old_age_keys_change_hands", 7), { hasTag: "arc_old_age_handoff" }] },
    effects: [add("resources.freedom", 5), add("relationships.family", -1), add("attrs.mental", 1), { addTag: "arc_old_age_boundary" }],
    narrativeTier: "consequence",
    narrativeDomain: "family",
  }),
  arc("old_age_keeps_one_duty", "还留着一件由你做主的事", "family", [64, 100], [
    { conditions: { all: [has("relationships.children", "lte", 0)] }, text: "你仍自己决定一笔小开支、一次出门或谁可以拿备用钥匙。没有孩子替生活排班，亲属和朋友便按说好的范围帮忙；你的日子不是一张等待别人接管的空表。" },
    { conditions: { all: [has("birth.hukou", "eq", "rural")] }, text: "院里仍有一小块事归你：看天气收晒物、记种子放处，或提醒哪件工具别淋雨。动作慢了，判断还准；家人偶尔不听，第二天便去捡被雨追过的东西。" },
    { conditions: { all: [has("meta.currentYear", "gte", 2000)] }, text: "家人替你办复杂手续，仍留一项日常缴费或群里的通知由你处理。你偶尔把表情发错地方，正事倒从没漏过，证明数字生活也容得下一点不熟练的主权。" },
    { conditions: { all: [has("resources.health", "lte", 35)] }, text: "身体能做的事少了，你仍负责决定每天先做哪一件。有人递药、扶门，却不把整天预先排满；有限的力气终于由你自己分配。" },
    { text: "你仍负责记一个日子、照看一样东西或作一笔小决定。事情不大，却每天留下一处不是由别人替你安排的位置。" },
  ], {
    requiresEvents: ["arc_old_age_boundary"],
    conditions: { all: [within("arc_old_age_boundary", 9), { hasTag: "arc_old_age_handoff" }] },
    effects: [add("resources.freedom", 4), add("resources.happiness", 5), add("relationships.family", 3), { addTag: "arc_old_age_agency" }],
    narrativeTier: "consequence",
    narrativeDomain: "family",
    narrativeThread: { close: true },
  }),

  arc("generation_thins", "同辈的人渐渐少了", "relationship", [55, 94], [
    "能一开口就明白你在说哪一年、哪条街的人，渐渐少了。讣告和病讯来得比喜帖勤，你开始意识到，长寿并不只是多拥有时间，也是在替一代人多记一会儿。",
    "记着旧地址和熟人姓名的那一页，渐渐有些人再也联系不上，你却一直没有划掉。和同代人告别多了以后，活得久显出另一面：许多旧笑话只剩你记得为什么好笑。",
    "一次聚会比上次少了几把椅子。留下的人互相问身体，也仍旧拿年轻时的糗事取笑；死亡坐在桌边，大家偏给它夹了一筷子笑话。",
    "你忽然找不到一个能核对某段往事的人。记忆从共同经历变成单方陈述，这种孤单没有声音，却使那一年显得很远。",
  ], {
    conditions: { none: [{ hasTag: "arc_generation_thins" }] },
    effects: [add("relationships.friendship", -6), add("resources.happiness", -6), add("attrs.mental", 1), { addTag: "arc_generation_thins" }],
    narrativeTier: "turning_point",
    narrativeDomain: "relationship",
    lifetimeProbability: 0.62,
  }),
  arc("generation_names_memory", "把旧人旧事说出名字", "relationship", [56, 97], [
    "晚辈问起一张照片，你没有只说‘都是从前的人’，而是慢慢讲出姓名、脾气和谁曾欠谁一顿饭。记忆不再只是你一个人的负担，开始有了新的保管者。",
    "你把几位故人的名字写在照片背后，正事写完，又添上谁唱歌跑调、谁借钱总忘。历史若只留履历，便太像一张没人愿意再看的表格。",
    "家里人录下你讲旧事。你嫌他们总问年份，却也承认自己常把年份记错；大家最后决定，先把人的名字和故事留下。",
    "你第一次认真向晚辈介绍那些已经不在的人，不只说关系，也说他们怎样笑、怎样发火。一个人被记住，往往靠这些不够庄重的细节。",
  ], {
    requiresEvents: ["arc_generation_thins"],
    conditions: { all: [within("arc_generation_thins", 8), { hasTag: "arc_generation_thins" }] },
    effects: [add("relationships.family", 4), add("resources.reputation", 3), add("resources.happiness", 2), { addTag: "arc_memory_shared" }],
    narrativeTier: "consequence",
    narrativeDomain: "relationship",
  }),
  arc("generation_accepts_blank", "也允许有些地方空着", "relationship", [58, 101], [
    "有些名字终于想不起来，你没有再编一个圆满说法。你把记得的认真留下，把不知道的地方空着；承认遗忘，也是对过去的一种诚实。",
    "讲到一半，你发现两件往事可能被自己拼到了一起。你让晚辈在记录旁写上‘不确定’，记忆从此不必为了体面冒充档案。",
    "一张照片仍没有人认得。家里没有随便给它安一个故事，只在背后留下问号；空白被认真保存，也是一种纪念。",
    "你承认一个名字已经找不回来了。晚辈没有催你再想，大家把能够确认的部分写下；过去没有因此完整，却变得诚实。",
  ], {
    requiresEvents: ["arc_generation_names_memory"],
    conditions: { all: [within("arc_generation_names_memory", 10), { hasTag: "arc_generation_thins" }] },
    effects: [add("resources.happiness", 4), add("attrs.mental", 1), { addTag: "arc_memory_honest" }],
    narrativeTier: "consequence",
    narrativeDomain: "relationship",
    narrativeThread: { close: true },
  }),

  arc("deep_old_age_horizon", "世界慢慢缩到近处", "health", [78, 102], [
    "远路和久坐都渐渐吃力，你活动的范围从一座城缩到几条街，再缩到能随时找到椅子的地方。世界变小了，细节却变得更大：一段平路、一扇不沉的门，都开始决定一天能否独立完成。",
    "你不再轻易答应远行，先问有没有台阶、厕所和能歇脚的地方。年轻时用时间计算路程，晚年还要加上体力；地图没有变，比例尺已经不同。",
    "身体把生活半径一点点画小。你起初生气，后来认真经营留下的范围：哪家店肯送到门口，哪个邻居能在夜里敲门，心里都有了一张新地图。",
    "你能去的地方少了，来见你的人便显得更重要。晚年不是纯粹的安静，而是一场关于门槛、距离和谁愿意多走几步的长期谈判。",
  ], {
    conditions: { none: [{ hasTag: "arc_deep_old_age" }] },
    effects: [add("resources.freedom", -8), add("resources.health", -4), add("relationships.friendship", -2), { addTag: "arc_deep_old_age" }],
    narrativeTier: "turning_point",
    narrativeDomain: "health",
  }),
  arc("deep_old_age_wishes", "把最难猜的话先说清", "health", [79, 105], [
    "你和家人谈起若病重时希望怎样被照顾。话说得断断续续，却让爱不必在最慌乱的时候猜谜；宏大的终点和一件旧衣该留给谁，被写在了同一张纸上。",
    "一次住院后，你主动说起以后：哪些治疗愿意承受，谁来替你签字，最怕什么。家人几次岔开话题，最后还是坐回来听完。",
    "你把证件、药物和几个重要联系人的位置讲清，也说明不要为了显得孝顺而让你受太多折腾。死亡没有因此靠近，只是少了一层仓促。",
    "你先用玩笑开头，说以后别买太贵的花。笑过以后，家人终于肯谈真正重要的安排；有些体贴必须提前说，临到头只剩慌张。",
  ], {
    requiresEvents: ["arc_deep_old_age_horizon"],
    conditions: { all: [within("arc_deep_old_age_horizon", 8), { hasTag: "arc_deep_old_age" }] },
    effects: [add("relationships.family", 5), add("attrs.mental", 1), add("resources.happiness", -1), { addTag: "arc_care_wishes_spoken" }],
    narrativeTier: "consequence",
    narrativeDomain: "health",
  }),
  arc("deep_old_age_order", "把身后事放回生活里", "health", [80, 108], [
    "几件要紧的安排终于有了着落。你们收好纸张，接着讨论晚饭；终点没有吞掉这一天，反而让剩下的时间重新回到吃饭、晒太阳和等一个电话。",
    "该交代的事写清后，你明显轻松了一点，又为一件旧物究竟算不算值钱和家人争了几句。死亡很庄重，生活坚持夹带琐碎。",
    "你把物件和心愿分得尽量明白，也允许晚辈以后作不同决定。安排身后不是控制未来，而是替最爱的人少留几道互相猜测的题。",
    "文件收进固定抽屉后，全家一度不知道说什么。你先问水果还有没有，谈话便回到日常；能从终点话题平安走回来，也是一种准备。",
  ], {
    requiresEvents: ["arc_deep_old_age_wishes"],
    conditions: { all: [within("arc_deep_old_age_wishes", 9), { hasTag: "arc_deep_old_age" }] },
    effects: [add("relationships.family", 4), add("resources.happiness", 4), add("attrs.mental", 1), { addTag: "arc_affairs_in_order" }],
    narrativeTier: "consequence",
    narrativeDomain: "health",
    narrativeThread: { close: true },
  }),

  arc("very_old_future_tense", "仍旧使用将来时", "self", [88, 110], [
    "你仍会说等天气好些、等孩子下次来、等那盆花再开。年纪很大以后还使用将来时，并非不知道终点，而是不肯让终点替今天取消所有约定。",
    "你为几个月后的一件小事作打算，家人听见时愣了一下，随即认真同你商量。未来不因长度有限便失去语法。",
    "日历已经不用记太多事，你仍圈出一个将来的日子。计划可能改变，期待本身却把时间从纯粹的倒数重新变成了生活。",
    "你问明年还会不会有同样的花，旁人答会。没人补充那句多余的‘如果’，大家一起把将来时保留了下来。",
  ], {
    conditions: { none: [{ hasTag: "arc_future_tense" }] },
    effects: [add("resources.happiness", 5), add("attrs.mental", 1), { addTag: "arc_future_tense" }],
    narrativeTier: "turning_point",
    narrativeDomain: "self",
  }),
  arc("very_old_last_gift", "把一件东西交到后来", "self", [89, 111], [
    "你把一件用过许多年的东西交给晚辈，连同真正的用法和几条不必遵守的规矩。传下去的不是古董，是一段仍能被继续使用的时间。",
    "你选了一件并不贵重的旧物给后来人，解释它为什么一直没扔。对方认真收下，也答应若将来不需要，可以再交给别人。",
    "一门小手艺、一道做法或一件工具终于有了接手的人。你示范得很慢，晚辈没有催；传承第一次拥有了适合你身体的速度。",
    "你把一件旧东西送出去，先声明它不值钱。晚辈说知道，却仍问清来历；价值有时正从这句‘不值钱’以后开始。",
  ], {
    requiresEvents: ["arc_very_old_future_tense"],
    conditions: { all: [within("arc_very_old_future_tense", 8), { hasTag: "arc_future_tense" }] },
    effects: [add("relationships.family", 5), add("resources.reputation", 3), add("resources.happiness", 2), { addTag: "arc_last_gift" }],
    narrativeTier: "consequence",
    narrativeDomain: "self",
  }),
  arc("very_old_tomorrow", "明天还有一件小事", "self", [90, 112], [
    "睡前，你仍替明天留下一件小事：回一个电话、晒一件衣服，或看一眼天气。人生到了很晚，意义没有变得宏大，只是更诚实地使用这些微小的将来。",
    "你嘱咐家人明天记得叫醒你，有件并不紧急的事要做。对方答应得很认真；被明天需要一点，是今晚最安稳的理由。",
    "桌边放着明天要处理的一样东西。它普通得不值得写进遗嘱，却使这一夜仍与下一天相连。",
    "你说明天再把一个故事讲完。晚辈没有催结局，只把椅子往近处挪了挪；未完待续是一种很朴素的生命力。",
  ], {
    requiresEvents: ["arc_very_old_last_gift"],
    conditions: { all: [within("arc_very_old_last_gift", 8), { hasTag: "arc_future_tense" }] },
    effects: [add("resources.happiness", 4), add("relationships.family", 3), { addTag: "arc_tomorrow_task" }],
    narrativeTier: "consequence",
    narrativeDomain: "self",
    narrativeThread: { close: true },
  }),
];
