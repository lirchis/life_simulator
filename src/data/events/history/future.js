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
    "text": "你第一次让 AI 帮你写东西、改表格、想方案。它不像同事，也不像工具，更像一面会回话的镜子。",
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
    "text": "家里开始讨论老人照护排班，谁请假、谁出钱、谁离得近，每一句都像在重新称量亲情。",
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
    "text": "热浪压在城市和田野上，空气像一块拧不干的热毛巾。你照常出门，身体却比往年更早发出警告。",
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
    text: "你按灵活就业身份给自己缴社保，每月扣款时肉疼，停缴的念头也来坐过几次。想到年老和生病，它又像一封寄得很慢的回信。",
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
    text: "附近有了老年助餐点，你中午去吃一份热饭，价钱和盐都放得克制。几张桌子慢慢坐熟，谁哪天没来，反而成了大家最先发现的事。",
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
    text: "社区医生提醒你复查血压、血糖和用药，问得比有些亲戚还细。你嘴上说都记着，挂电话后还是老实把药盒摆到了显眼处。",
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
    text: "你在外地看病时办了异地就医结算，不必再攥着一袋票据回老家跑手续。窗口少跑几趟，病并不会更轻，人的疲惫却会。",
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
    text: "老楼商量加装电梯，低层谈采光，高层谈膝盖，费用分摊开了好几轮会。邻居们争得面红耳赤，最后仍一起盯着施工队有没有按时来。",
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
