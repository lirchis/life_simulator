// Auto-split event data. Keep events in this file focused on one era or theme.
export const historyFutureEvents = [
  {
    "id": "era_ai_tool_arrives",
    "maxOccurrences": 1,
    "title": "AI 工具来了",
    "category": "career",
    "yearRange": [
      2023,
      2035
    ],
    "ageRange": [
      16,
      70
    ],
    "baseWeight": 30,
    "weightModifiers": [
      {
        "hasTrait": "digital_native",
        "multiply": 1.6
      },
      {
        "hasTrait": "networked_mind",
        "multiply": 1.5
      },
      {
        "path": "attrs.intelligence",
        "gte": 6,
        "multiply": 1.3
      }
    ],
    "text": [
      {
        "conditions": {
          "all": [
            { "path": "meta.age", "lte": 22 }
          ]
        },
        "text": "你第一次让 AI 帮着梳理资料和修改作业，答案来得太快，快到必须反过来查它有没有编造。它替你省下几小时，也把‘哪些话算自己的’变成了新的作业。"
      },
      {
        "conditions": {
          "any": [
            { "path": "career.status", "in": ["self_employed", "gig_worker"] },
            { "path": "career.field", "in": ["small_business", "trade", "ecommerce"] }
          ]
        },
        "text": "你让 AI 写商品介绍、回客户消息、整理一周的订单。它把小店暂时变成了有文案和表格部门的公司，只是老板、客服和核对错误的人仍都是你。"
      },
      {
        "text": "你第一次让 AI 帮你改表格、起草材料和整理会议要点。它几分钟交出一份像样的初稿，你也很快学会：省下的是从空白开始的时间，核实责任仍完整地留在自己名下。"
      }
    ],
    "effects": [
      {
        "path": "resources.achievement",
        "add": 8
      },
      {
        "path": "career.level",
        "add": 4
      },
      {
        "path": "resources.freedom",
        "add": 3
      },
      {
        "addTrait": "system_reader"
      },
      {
        "addTag": "ai_tool_user"
      }
    ]
  },
  {
    "id": "era_ai_job_anxiety",
    "maxOccurrences": 1,
    "title": "被自动化追上",
    "category": "career",
    "yearRange": [
      2024,
      2035
    ],
    "ageRange": [
      22,
      60
    ],
    "baseWeight": 18,
    "conditions": {
      "any": [
        {
          "path": "career.field",
          "eq": "corporate"
        },
        {
          "path": "career.field",
          "eq": "trade"
        },
        {
          "path": "career.field",
          "eq": "small_business"
        }
      ]
    },
    "text": "你发现一些活真的被机器接走了。办公室没有风，心里却像有一扇窗没关严。",
    "effects": [
      {
        "path": "resources.happiness",
        "add": -7
      },
      {
        "path": "career.income",
        "add": -5
      },
      {
        "addTag": "ai_anxiety"
      },
      {
        "addTimedModifier": {
          "id": "ai_adaptation_window",
          "durationYears": 4,
          "target": {
            "category": "career"
          },
          "multiply": 1.2
        }
      }
    ]
  },
  {
    "id": "era_ai_reskilling_night",
    "maxOccurrences": 1,
    "title": "夜里学 AI",
    "category": "school",
    "yearRange": [
      2024,
      2035
    ],
    "ageRange": [
      18,
      55
    ],
    "conditions": {
      "any": [
        {
          "hasTag": "ai_anxiety"
        },
        {
          "hasTag": "ai_tool_user"
        },
        {
          "path": "career.field",
          "eq": "corporate"
        }
      ]
    },
    "baseWeight": 24,
    "text": "你夜里打开教程学 AI 工具，屏幕亮得像一盏新式台灯。焦虑还在，但至少你开始把它拆成一个个按钮。",
    "effects": [
      {
        "path": "career.level",
        "add": 5
      },
      {
        "path": "education.score",
        "add": 4
      },
      {
        "path": "resources.happiness",
        "add": -1
      },
      {
        "addTag": "ai_reskilling_memory"
      }
    ]
  },
  {
    "id": "era_ai_homework_companion",
    "maxOccurrences": 1,
    "title": "AI 陪孩子写作业",
    "category": "family",
    "yearRange": [
      2024,
      2035
    ],
    "ageRange": [
      28,
      55
    ],
    "conditions": {
      "all": [
        {
          "path": "relationships.children",
          "gte": 1
        }
      ]
    },
    "baseWeight": 20,
    "text": "孩子用 AI 问作业，你在旁边又省心又不放心。答案来得太快，教育焦虑换了一种新的形状。",
    "effects": [
      {
        "path": "relationships.family",
        "add": 2
      },
      {
        "path": "education.score",
        "add": 3
      },
      {
        "path": "resources.happiness",
        "add": -2
      },
      {
        "addTag": "ai_homework_parent"
      }
    ]
  },
  {
    "id": "era_ai_small_business_copywriting",
    "maxOccurrences": 1,
    "title": "AI 帮小店写文案",
    "category": "career",
    "yearRange": [
      2024,
      2035
    ],
    "ageRange": [
      20,
      65
    ],
    "conditions": {
      "any": [
        {
          "hasTag": "getihu_path"
        },
        {
          "hasTag": "ecommerce_seller"
        },
        {
          "path": "career.field",
          "eq": "small_business"
        }
      ]
    },
    "baseWeight": 22,
    "text": "你让 AI 给小店写了几版文案。词句比你想得会吆喝，生意没有立刻变好，但门面像被重新擦了一遍。",
    "effects": [
      {
        "path": "career.income",
        "add": 4
      },
      {
        "path": "resources.achievement",
        "add": 3
      },
      {
        "addTag": "ai_small_business_use"
      }
    ]
  },
  {
    "id": "era_aging_parent_care_schedule",
    "maxOccurrences": 1,
    "title": "照护排班",
    "category": "family",
    "yearRange": [
      2025,
      2035
    ],
    "ageRange": [
      35,
      65
    ],
    "baseWeight": 20,
    "text": [
      {
        "conditions": {
          "all": [
            { "path": "location.migratedTimes", "gte": 1 }
          ]
        },
        "text": "老人需要长期照护后，你同兄弟姐妹在群里排班。离家最远的人多出钱，离得最近的人多出时间；高铁缩短了路程，却没有缩短一次请假的手续。"
      },
      {
        "conditions": {
          "any": [
            { "path": "relationships.children", "gte": 1 },
            { "path": "resources.wealth", "lte": 40 }
          ]
        },
        "text": "你把老人的复诊、孩子的接送和自己的工作排进同一张日历。请护工的钱和请假的损失各占一栏，亲情没有标价，照护的每个小时却都有成本。"
      },
      {
        "text": "家里开始讨论老人照护排班，谁陪诊、谁夜里守、谁负责买药都写进表格。大家仍会争执，但表格至少让那句含糊的‘有空去看看’变成了具体日期。"
      }
    ],
    "effects": [
      {
        "path": "relationships.family",
        "add": -2
      },
      {
        "path": "resources.wealth",
        "add": -5
      },
      {
        "path": "attrs.mental",
        "add": 1
      },
      {
        "addTag": "eldercare_schedule_memory"
      }
    ]
  },
  {
    "id": "era_delayed_retirement_talk",
    "maxOccurrences": 1,
    "title": "延迟退休的消息",
    "category": "career",
    "yearRange": [
      2025,
      2035
    ],
    "ageRange": [
      45,
      62
    ],
    "conditions": {
      "any": [
        {
          "path": "career.status",
          "eq": "employed"
        },
        {
          "path": "career.status",
          "eq": "self_employed"
        }
      ]
    },
    "baseWeight": 18,
    "text": "延迟退休的消息又被讨论起来。你算了算年龄、养老金和身体，发现未来并不会因为靠近就变得更清楚。",
    "effects": [
      {
        "path": "resources.happiness",
        "add": -3
      },
      {
        "path": "resources.freedom",
        "add": -3
      },
      {
        "addTag": "delayed_retirement_anxiety"
      }
    ]
  },
  {
    "id": "era_extreme_heat_workday",
    "maxOccurrences": 1,
    "title": "热浪里的工作日",
    "category": "health",
    "yearRange": [
      2023,
      2035
    ],
    "ageRange": [
      16,
      75
    ],
    "currentRegions": {
      "provinces": [
        "chongqing",
        "sichuan",
        "hunan",
        "hubei",
        "jiangxi",
        "zhejiang",
        "jiangsu",
        "shanghai",
        "guangdong",
        "guangxi",
        "fujian",
        "hainan"
      ]
    },
    "baseWeight": 18,
    "weightModifiers": [
      {
        "path": "career.field",
        "in": [
          "delivery",
          "factory",
          "manual_worker",
          "farm_work"
        ],
        "multiply": 1.5
      }
    ],
    "text": [
      {
        "conditions": {
          "all": [
            { "path": "career.field", "in": ["delivery", "construction", "manual_worker", "farm_work"] }
          ]
        },
        "text": "热浪把路面、脚手架或田地晒得发白，你的工作却不能搬进天气预报。水很快喝完，手机和工头仍在催进度；高温补贴写在通知里，中暑先写在人的脸上。"
      },
      {
        "conditions": {
          "any": [
            { "path": "resources.health", "lte": 45 },
            { "path": "meta.age", "gte": 60 }
          ]
        },
        "text": "连续高温让你比往年更早感到胸闷和乏力。你把出门改到清晨，药和水装进同一个袋子；日历上的一天没有变长，能安全活动的时段却缩短了。"
      },
      {
        "text": "热浪压住城市和田野，空调外机整夜轰鸣。你在通勤和工作间寻找阴影，下午的效率被汗水一点点拖慢；天气不再只是闲谈，而是当天能做多少事的上限。"
      }
    ],
    "effects": [
      {
        "path": "resources.health",
        "add": -5
      },
      {
        "path": "resources.happiness",
        "add": -3
      },
      {
        "addTag": "extreme_heat_memory"
      }
    ]
  },
  {
    "id": "era_low_birthrate_family_pressure",
    "maxOccurrences": 1,
    "title": "要不要生孩子",
    "category": "family",
    "yearRange": [
      2021,
      2035
    ],
    "ageRange": [
      24,
      42
    ],
    "conditions": {
      "all": [
        {
          "path": "relationships.children",
          "lte": 0
        }
      ]
    },
    "baseWeight": 18,
    "text": [
      {
        "conditions": {
          "all": [
            {
              "path": "birth.gender",
              "eq": "female"
            }
          ]
        },
        "text": "家里又谈起要不要孩子，问题落到钱、身体、工作和谁来照顾上。你发现选择变多了，压力也没有少。"
      },
      {
        "text": "家里又谈起要不要孩子，账本、房子、工作和父母期待都坐上了桌。沉默有时比回答更长。"
      }
    ],
    "effects": [
      {
        "path": "relationships.family",
        "add": -3
      },
      {
        "path": "resources.freedom",
        "add": 2
      },
      {
        "path": "resources.happiness",
        "add": -3
      },
      {
        "addTag": "low_birthrate_pressure"
      }
    ]
  },
  {
    id: "era_platform_injury_protection_pilot",
    title: "跑单也有了伤害保障",
    category: "health",
    yearRange: [2022, 2035],
    ageRange: [18, 65],
    conditions: { any: [{ hasTag: "platform_worker" }, { path: "career.status", eq: "gig_worker" }, { path: "career.field", in: ["delivery", "ride_hailing", "logistics"] }] },
    maxOccurrences: 1,
    baseWeight: 22,
    text: "平台通知你纳入职业伤害保障，条款读着仍有些绕，至少摔倒和受伤不再完全靠自己扛。你把页面截了图，像给风雨添了一小块屋檐。",
    effects: [
      { path: "resources.health", add: 4 },
      { path: "resources.wealth", add: 3 },
      { path: "resources.freedom", add: 2 },
      { addTag: "platform_injury_protection_memory" }
    ]
  },
  {
    id: "era_gig_worker_rest_station",
    title: "骑手歇脚点",
    category: "career",
    yearRange: [2021, 2035],
    ageRange: [18, 65],
    currentRegions: { cityTiers: ["town", "county", "city", "tier2", "tier1"] },
    conditions: { any: [{ hasTag: "platform_worker" }, { path: "career.status", eq: "gig_worker" }, { path: "career.field", in: ["delivery", "ride_hailing", "logistics"] }] },
    maxOccurrences: 1,
    baseWeight: 20,
    text: "街边设了新就业群体歇脚点，你进去接热水、充电，顺便让膝盖休息十分钟。插座前排得比人整齐，大家的电量倒都差不多见底。",
    effects: [
      { path: "resources.health", add: 3 },
      { path: "relationships.friendship", add: 3 },
      { path: "resources.happiness", add: 2 },
      { addTag: "gig_worker_rest_station_memory" }
    ]
  },
  {
    id: "era_flexible_worker_social_insurance",
    title: "自己缴社保",
    category: "wealth",
    yearRange: [2021, 2035],
    ageRange: [22, 60],
    conditions: { any: [{ path: "career.status", eq: "gig_worker" }, { path: "career.status", eq: "self_employed" }, { hasTag: "platform_worker" }, { hasTag: "ecommerce_seller" }] },
    maxOccurrences: 1,
    baseWeight: 22,
    text: [
      {
        conditions: { any: [{ path: "career.status", eq: "gig_worker" }, { hasTag: "platform_worker" }] },
        text: "平台按单结算收入，社保却要你按月自己缴。淡季时扣款尤其扎眼，你多跑几单才把它补回去；保障像一件必须先淋雨挣钱、再替未来买下的雨衣。"
      },
      {
        conditions: { any: [{ path: "career.status", eq: "self_employed" }, { hasTag: "ecommerce_seller" }] },
        text: "你以灵活就业身份自己缴社保，店里有收入便按时续上，生意清淡时也动过停缴的念头。账本只看这个月，养老和医疗却要求你替几十年后的自己留一行。"
      },
      {
        text: "你第一次自己办完社保登记和扣款，每月到账前先少去固定一笔。没有单位替你分担，缴费显得格外具体；想到生病和年老，它又像一封寄得很慢、最好别退回来的信。"
      }
    ],
    effects: [
      { path: "resources.wealth", add: -4 },
      { path: "resources.health", add: 3 },
      { path: "resources.freedom", add: 2 },
      { addTag: "flexible_social_insurance_memory" }
    ]
  },
  {
    id: "era_after_school_service_pickup",
    title: "课后服务结束再接娃",
    category: "family",
    yearRange: [2021, 2035],
    ageRange: [27, 52],
    conditions: { all: [{ path: "relationships.children", gte: 1 }] },
    maxOccurrences: 1,
    baseWeight: 24,
    text: "学校有了课后服务，你终于不必在下班铃和放学铃之间表演分身术。晚一点接到孩子时，作业做了一半，精力倒还完整地剩着。",
    effects: [
      { path: "relationships.family", add: 3 },
      { path: "resources.freedom", add: 3 },
      { path: "resources.happiness", add: 2 },
      { addTag: "after_school_service_memory" }
    ]
  },
  {
    id: "era_childcare_slot_waitlist",
    title: "托育名额",
    category: "family",
    yearRange: [2022, 2035],
    ageRange: [24, 45],
    currentRegions: { cityTiers: ["town", "county", "city", "tier2", "tier1"] },
    conditions: { all: [{ path: "relationships.children", gte: 1 }] },
    maxOccurrences: 1,
    baseWeight: 21,
    text: "你去问普惠托育名额，收费表、接送时间和候补名单一字排开。孩子还不会数数，你已经替全家把每一种安排算到了小数点后。",
    effects: [
      { path: "resources.wealth", add: -4 },
      { path: "resources.freedom", add: 3 },
      { path: "relationships.family", add: 2 },
      { addTag: "childcare_waitlist_memory" }
    ]
  },
  {
    id: "era_woman_return_after_childbirth",
    title: "重回工位",
    category: "career",
    yearRange: [2021, 2035],
    ageRange: [25, 42],
    genders: ["female"],
    conditions: { all: [{ path: "relationships.children", gte: 1 }], any: [{ path: "career.status", eq: "employed" }, { path: "career.status", eq: "unemployed" }, { path: "career.status", eq: "self_employed" }] },
    maxOccurrences: 1,
    baseWeight: 24,
    text: "生育后重回工作，你一边补上岗位变化，一边安排接送和夜里的照料。别人问你能否兼顾，你很想反问：为什么总是同一个人接受这场考试？",
    effects: [
      { path: "career.level", add: 3 },
      { path: "resources.health", add: -3 },
      { path: "attrs.mental", add: 1 },
      { addTag: "postpartum_return_to_work_memory" }
    ]
  },
  {
    id: "era_elder_meal_canteen",
    title: "社区老年食堂",
    category: "health",
    yearRange: [2023, 2035],
    ageRange: [60, 90],
    currentRegions: { cityTiers: ["village", "town", "county", "city", "tier2", "tier1"] },
    maxOccurrences: 1,
    baseWeight: 26,
    text: [
      {
        conditions: { all: [{ path: "location.currentCityTier", in: ["village", "town"] }] },
        text: "村镇助餐点开在旧活动室里，中午按人头盛热饭。你走过去不远，顺手替腿脚更慢的邻居带一份；一项公共服务落到日常，先变成饭盒上的名字。"
      },
      {
        conditions: { any: [{ path: "resources.health", lte: 48 }, { path: "relationships.partnerStatus", eq: "none" }] },
        text: "附近有了老年食堂，你不必每天站在灶前，也少用剩菜凑合一顿。几张桌子慢慢坐熟，谁哪天没来，大家便先打电话问是不是身体不舒服。"
      },
      {
        text: "社区助餐点中午供应一荤一素，价钱和盐都放得克制。你起初只图省事，后来习惯同几位老人拼桌；饭菜每天不同，彼此的旧故事倒常有续集。"
      }
    ],
    effects: [
      { path: "resources.health", add: 4 },
      { path: "relationships.friendship", add: 4 },
      { path: "resources.happiness", add: 3 },
      { addTag: "elder_meal_service_memory" }
    ]
  },
  {
    id: "era_aging_home_renovation",
    title: "给老房子装扶手",
    category: "health",
    yearRange: [2021, 2035],
    ageRange: [65, 92],
    currentRegions: { cityTiers: ["town", "county", "city", "tier2", "tier1"] },
    conditions: { any: [{ path: "resources.health", lte: 65 }, { path: "attrs.physique", lte: 5 }] },
    maxOccurrences: 1,
    baseWeight: 22,
    text: "家里给卫生间装上扶手，又把门槛磨平。年轻时觉得房子要好看，年纪大了才知道，半夜起身时稳稳站住就是很好的设计。",
    effects: [
      { path: "resources.wealth", add: -3 },
      { path: "resources.health", add: 5 },
      { path: "resources.freedom", add: 4 },
      { addTag: "aging_home_renovation_memory" }
    ]
  },
  {
    id: "era_daughter_eldercare_double_shift",
    title: "下班后的第二班",
    category: "family",
    yearRange: [2021, 2035],
    ageRange: [38, 62],
    genders: ["female"],
    conditions: { any: [{ path: "career.status", eq: "employed" }, { path: "career.status", eq: "self_employed" }, { hasTag: "eldercare_schedule_memory" }] },
    maxOccurrences: 1,
    baseWeight: 20,
    text: "下班后你又赶去陪老人看病、取药、做饭，兄弟姐妹在群里说辛苦了，真正能到场的仍常是你。照护没有工牌，却把一天排成了两班。",
    effects: [
      { path: "resources.health", add: -4 },
      { path: "resources.freedom", add: -5 },
      { path: "relationships.family", add: 3 },
      { addTag: "daughter_eldercare_memory" }
    ]
  },
  {
    id: "era_chronic_disease_community_followup",
    title: "社区医生来电话",
    category: "health",
    yearRange: [2023, 2035],
    ageRange: [50, 90],
    conditions: { any: [{ path: "resources.health", lte: 62 }, { path: "attrs.physique", lte: 4 }] },
    maxOccurrences: 1,
    baseWeight: 24,
    text: [
      {
        conditions: { any: [{ path: "meta.age", gte: 75 }, { path: "resources.health", lte: 40 }] },
        text: "社区医生隔一阵便来电话，核对血压、血糖和药量，还问最近有没有头晕。你嫌问题重复，回答却一次比一次认真；年纪大后，有人按时追问本身也是一种治疗。"
      },
      {
        conditions: { all: [{ path: "location.currentCityTier", in: ["village", "town", "county"] }] },
        text: "基层医生把随访日期记在册上，赶集日顺便替你量血压，缺药便提醒去补。诊室设备不算多，好处是他认得你，也知道你那句‘一直按时吃’通常要打一点折扣。"
      },
      {
        text: "社区医生提醒你复查指标和调整用药，又把注意事项发到手机上。你嘴上说都记得，挂电话后仍老实把药盒挪到餐桌旁；提醒若足够具体，倔强也会配合。"
      }
    ],
    effects: [
      { path: "resources.health", add: 5 },
      { path: "resources.happiness", add: 2 },
      { path: "attrs.mental", add: 1 },
      { addTag: "community_chronic_followup_memory" }
    ]
  },
  {
    id: "era_cross_region_medical_settlement",
    title: "看病不用来回报销",
    category: "health",
    yearRange: [2022, 2035],
    ageRange: [35, 85],
    conditions: { any: [{ hasTag: "migrant" }, { hasTag: "migrant_worker" }, { path: "location.migratedTimes", gte: 1 }] },
    maxOccurrences: 1,
    baseWeight: 19,
    text: [
      {
        conditions: { any: [{ hasTag: "migrant_worker" }, { path: "resources.wealth", lte: 38 }] },
        text: "你在务工地住院时直接结算了医保，不必先四处借齐全款，再带票据回老家报销。病床费仍让人心疼，但少压几个月现金，对一个靠工资周转的家已经很要紧。"
      },
      {
        conditions: { any: [{ path: "meta.age", gte: 65 }, { path: "resources.health", lte: 45 }] },
        text: "你随子女在外地生活，复诊时终于能直接结算，不必为盖章和票据再坐长途车。病并没有因此变轻，腿脚和家人却少替手续受一遍累。"
      },
      {
        text: "你在外地看病时完成异地就医结算，出院窗口直接算清应付部分。过去要装满文件袋的一摞票据，如今只留几张清单；制度的进步有时就是少跑几扇门。"
      }
    ],
    effects: [
      { path: "resources.wealth", add: 4 },
      { path: "resources.health", add: 3 },
      { path: "resources.freedom", add: 3 },
      { addTag: "cross_region_medical_settlement_memory" }
    ]
  },
  {
    id: "era_return_to_county_job",
    title: "回县城找一份生活",
    category: "migration",
    yearRange: [2021, 2035],
    ageRange: [24, 48],
    currentRegions: { cityTiers: ["city", "tier2", "tier1"] },
    conditions: { any: [{ hasTag: "migrant" }, { hasTag: "migrant_worker" }, { hasTag: "internet_layoff_memory" }, { hasTag: "remote_work_memory" }] },
    maxOccurrences: 1,
    baseWeight: 16,
    text: "你回县城找工作，收入比大城市薄一些，房租和通勤也终于肯讲道理。熟人社会消息传得快，连你面试没过都比通知邮件先到家。",
    effects: [
      { path: "location.currentCityTier", set: "county" },
      { path: "location.migratedTimes", add: 1 },
      { path: "resources.wealth", add: 3 },
      { path: "resources.freedom", add: 5 },
      { addTag: "returned_to_county_memory" }
    ]
  },
  {
    id: "era_points_based_city_settlement",
    title: "积分落户材料",
    category: "migration",
    yearRange: [2021, 2035],
    ageRange: [25, 50],
    birthFamilyClasses: ["migrant_worker_family", "rural_left_behind", "rural_farming_household", "working"],
    currentRegions: { cityTiers: ["city", "tier2", "tier1"] },
    conditions: { all: [{ path: "location.migratedTimes", gte: 1 }] },
    maxOccurrences: 1,
    baseWeight: 17,
    text: "你整理居住证、社保和学历材料，计算离落户还差多少积分。城市早已熟到能闭眼换乘，承认你属于这里却仍需要一摞证明。",
    effects: [
      { path: "resources.freedom", add: 4 },
      { path: "resources.reputation", add: 2 },
      { path: "resources.happiness", add: -1 },
      { addTag: "points_settlement_memory" }
    ]
  },
  {
    id: "era_old_neighborhood_elevator",
    title: "老楼加装电梯",
    category: "family",
    yearRange: [2021, 2035],
    ageRange: [50, 88],
    currentRegions: { cityTiers: ["county", "city", "tier2", "tier1"] },
    maxOccurrences: 1,
    baseWeight: 20,
    text: [
      {
        conditions: { any: [{ path: "meta.age", gte: 70 }, { path: "resources.health", lte: 45 }] },
        text: "老楼商量加装电梯时，你拿自己的膝盖解释六层有多高。低层担心采光，费用也谈不拢；你每次爬到家门口，都觉得会议纪要还差一段楼梯的证词。"
      },
      {
        conditions: { all: [{ path: "resources.wealth", lte: 40 }] },
        text: "加装电梯的方案通过了，分摊到你家的费用却不是小数。你同邻居比较补贴、楼层系数和付款期限，终于明白便利可以按楼层计算，难处却按各家的存款计算。"
      },
      {
        text: "老楼为加装电梯开了好几轮会，低层谈采光，高层谈膝盖，家家都拿出自己的道理。争论结束后，大家又一起盯施工噪声和进度；邻里关系从未升降得这样频繁。"
      }
    ],
    effects: [
      { path: "resources.wealth", add: -4 },
      { path: "resources.health", add: 3 },
      { path: "relationships.friendship", add: -1 },
      { path: "resources.freedom", add: 4 },
      { addTag: "old_building_elevator_memory" }
    ]
  },
  {
    id: "era_single_person_household",
    title: "一个人的晚饭",
    category: "family",
    yearRange: [2021, 2035],
    ageRange: [28, 55],
    currentRegions: { cityTiers: ["county", "city", "tier2", "tier1"] },
    conditions: { all: [{ path: "relationships.partnerStatus", eq: "none" }, { path: "relationships.children", lte: 0 }] },
    maxOccurrences: 1,
    baseWeight: 18,
    text: "你习惯了一个人住，晚饭做多了要连吃三顿，做少了又像对自己敷衍。自由是真的，偶尔的寂寞也是真的，两者共用同一把门锁。",
    effects: [
      { path: "resources.freedom", add: 6 },
      { path: "resources.happiness", add: -1 },
      { path: "attrs.mental", add: 1 },
      { addTag: "single_person_household_memory" }
    ]
  },
  {
    id: "era_child_after_school_service",
    title: "放学后的教室",
    category: "school",
    yearRange: [2025, 2035],
    ageRange: [7, 15],
    currentRegions: { cityTiers: ["town", "county", "city", "tier2", "tier1"] },
    maxOccurrences: 1,
    baseWeight: 30,
    text: "放学后你留在教室参加课后服务，先写作业，再和同学活动。父母终于不用一路催着下班来接，你也第一次见到傍晚六点的校园是什么颜色。",
    effects: [
      { path: "education.score", add: 5 },
      { path: "relationships.friendship", add: 3 },
      { path: "relationships.family", add: 2 },
      { addTag: "child_after_school_service_memory" }
    ]
  },
  {
    id: "era_child_ai_study_helper",
    title: "会回答追问的学习助手",
    category: "school",
    yearRange: [2026, 2035],
    ageRange: [10, 17],
    conditions: { any: [{ path: "education.score", gte: 42 }, { hasTrait: "digital_native" }, { hasTrait: "networked_mind" }] },
    maxOccurrences: 1,
    baseWeight: 25,
    text: "你用 AI 学习助手追问一道没听懂的题，它很耐心，有时也很自信地讲错。老师让你核对来源，你才明白新工具带来的不只是答案，还有判断答案的责任。",
    effects: [
      { path: "education.score", add: 6 },
      { path: "attrs.intelligence", add: 1 },
      { path: "resources.freedom", add: 2 },
      { addTag: "child_ai_study_memory" }
    ]
  },
  {
    id: "era_rural_boarding_school_week",
    title: "住校的一星期",
    category: "school",
    yearRange: [2025, 2035],
    ageRange: [10, 16],
    birthFamilyClasses: ["rural_farming_household", "rural_left_behind", "rural_business_family", "migrant_worker_family"],
    currentRegions: { hukou: ["rural"], cityTiers: ["village", "town", "county"] },
    maxOccurrences: 1,
    baseWeight: 28,
    text: "学校离家远，你开始按星期住校。晚自习后宿舍很热闹，熄灯铃一响，想家的声音却都学会了压得很轻。",
    effects: [
      { path: "education.score", add: 5 },
      { path: "relationships.family", add: -2 },
      { path: "attrs.mental", add: 1 },
      { addTag: "rural_boarding_school_memory" }
    ]
  },
  {
    id: "era_rural_school_bus_last_stop",
    title: "校车最后一站",
    category: "migration",
    yearRange: [2021, 2035],
    ageRange: [6, 15],
    birthFamilyClasses: ["rural_farming_household", "rural_left_behind", "rural_business_family", "migrant_worker_family"],
    currentRegions: { hukou: ["rural"], cityTiers: ["village", "town"] },
    maxOccurrences: 1,
    baseWeight: 28,
    text: "你每天坐校车去镇上，家在路线的最后一站。司机认识每个孩子和每段坑洼，冬天天没亮就出发，车窗上的雾比你先写满一页。",
    effects: [
      { path: "education.score", add: 4 },
      { path: "resources.health", add: -1 },
      { path: "resources.freedom", add: -2 },
      { addTag: "rural_school_bus_memory" }
    ]
  },
  {
    id: "era_school_vision_screening",
    title: "黑板上的视力表",
    category: "health",
    yearRange: [2021, 2035],
    ageRange: [6, 18],
    maxOccurrences: 1,
    baseWeight: 27,
    text: "学校做视力筛查，你站在视力表前努力猜开口方向。回家后父母开始管屏幕时间，仿佛只要手机先睡，你的眼睛就肯跟着恢复精神。",
    effects: [
      { path: "resources.health", add: 3 },
      { path: "resources.freedom", add: -2 },
      { path: "relationships.family", add: 1 },
      { addTag: "school_vision_screening_memory" }
    ]
  },
  {
    id: "era_school_heat_adjusted_sports",
    title: "被高温改期的体育课",
    category: "health",
    yearRange: [2023, 2035],
    ageRange: [7, 18],
    currentRegions: { provinces: ["chongqing", "sichuan", "hunan", "hubei", "jiangxi", "zhejiang", "jiangsu", "shanghai", "anhui", "fujian", "guangdong", "guangxi", "hainan" ] },
    maxOccurrences: 1,
    baseWeight: 24,
    text: "连续高温让体育课改到清晨或室内，操场在正午亮得发白。你们对少跑几圈暗自高兴，又在走出教学楼时立刻理解了老师为什么妥协。",
    effects: [
      { path: "resources.health", add: -1 },
      { path: "resources.happiness", add: 2 },
      { path: "attrs.mental", add: 1 },
      { addTag: "school_heat_adjustment_memory" }
    ]
  },
  {
    id: "era_child_short_video_limit",
    title: "屏幕时间到了",
    category: "family",
    yearRange: [2021, 2035],
    ageRange: [10, 17],
    maxOccurrences: 1,
    baseWeight: 26,
    text: "短视频看得正起劲，系统和父母先后提醒屏幕时间到了。你坚称再看一个就停，这句话的可信度和每个视频的长度一样，始终难以测量。",
    effects: [
      { path: "resources.freedom", add: -3 },
      { path: "resources.health", add: 2 },
      { path: "relationships.family", add: -1 },
      { addTag: "adolescent_screen_limit_memory" }
    ]
  },
  {
    id: "era_child_hears_mortgage_table",
    title: "饭桌上的房贷",
    category: "wealth",
    yearRange: [2021, 2035],
    ageRange: [8, 17],
    birthFamilyClasses: ["urban_low_income", "migrant_worker_family", "working", "state_system_family", "professional_family_modern", "middle"],
    currentRegions: { cityTiers: ["county", "city", "tier2", "tier1"] },
    maxOccurrences: 1,
    baseWeight: 24,
    text: "父母在饭桌上谈房贷、利率和提前还款，你听不懂全部，却听得懂他们语气里的轻重。从那以后，你买文具前偶尔也会先看一眼价签。",
    effects: [
      { path: "attrs.mental", add: 1 },
      { path: "resources.happiness", add: -2 },
      { path: "resources.wealth", add: 1 },
      { addTag: "child_mortgage_table_memory" }
    ]
  },
  {
    id: "era_child_grandparent_care",
    title: "外婆的接送表",
    category: "family",
    yearRange: [2021, 2035],
    ageRange: [6, 14],
    birthFamilyClasses: ["migrant_worker_family", "working", "state_system_family", "professional_family_modern", "small_business_owner", "middle", "tech_new_money"],
    maxOccurrences: 1,
    baseWeight: 25,
    text: "父母工作忙，接送和晚饭常由老人接手。你熟悉他们慢一点的脚步，也熟悉那句‘别告诉你爸妈’，通常后面跟着一块点心。",
    effects: [
      { path: "relationships.family", add: 5 },
      { path: "resources.happiness", add: 3 },
      { path: "resources.health", add: 1 },
      { addTag: "grandparent_care_childhood_memory" }
    ]
  },
  {
    id: "era_county_child_weekend_train",
    title: "周末去市里上课",
    category: "school",
    yearRange: [2024, 2035],
    ageRange: [8, 17],
    birthFamilyClasses: ["rural_business_family", "state_system_family", "professional_family_modern", "small_business_owner", "middle", "rich", "elite"],
    currentRegions: { cityTiers: ["town", "county"] },
    conditions: { all: [{ path: "resources.wealth", gte: 45 }] },
    maxOccurrences: 1,
    baseWeight: 19,
    text: "周末家里带你去市里上课，车程比课程还长。大人说这是给未来铺路，你坐在返程车上睡着，先把今天的路完整地压在脸上。",
    effects: [
      { path: "education.score", add: 6 },
      { path: "resources.wealth", add: -4 },
      { path: "resources.happiness", add: -2 },
      { addTag: "county_weekend_training_memory" }
    ]
  }
];
