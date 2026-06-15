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
  }
];
