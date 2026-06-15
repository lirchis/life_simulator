// Auto-split event data. Keep events in this file focused on one era or theme.
export const historyFutureEvents = [
  {
    "id": "era_ai_tool_arrives",
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
  }
];
