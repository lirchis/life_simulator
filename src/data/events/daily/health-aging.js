// Auto-split event data. Keep events in this file focused on one era or theme.
export const dailyHealthAgingEvents = [
  {
    "id": "daily_caught_a_cold",
    "title": "伤风感冒",
    "category": "health",
    "ageRange": [
      6,
      85
    ],
    "baseWeight": 34,
    "text": "你感冒了几天，鼻音很重，整个人像被一层湿布罩住。好在日子还能照常往前。",
    "effects": [
      {
        "path": "resources.health",
        "add": -3
      },
      {
        "path": "resources.happiness",
        "add": -1
      }
    ]
  },
  {
    "id": "daily_sleep_badly",
    "title": "没睡好",
    "category": "health",
    "ageRange": [
      16,
      85
    ],
    "baseWeight": 30,
    "text": "你这一晚没睡好。天亮时人还在床上，心却像已经被生活提前叫去排队。",
    "effects": [
      {
        "path": "resources.health",
        "add": -2
      },
      {
        "path": "resources.happiness",
        "add": -2
      }
    ]
  },
  {
    "id": "daily_elder_morning_walk",
    "title": "清晨散步",
    "category": "health",
    "ageRange": [
      55,
      95
    ],
    "baseWeight": 36,
    "text": "你清晨出去走了一圈。街道慢慢醒来，身体也像被温和地重新启动。",
    "effects": [
      {
        "path": "resources.health",
        "add": 3
      },
      {
        "path": "resources.happiness",
        "add": 2
      }
    ]
  },
  {
    "id": "daily_minor_work_injury",
    "title": "工伤小疤",
    "category": "health",
    "ageRange": [
      18,
      60
    ],
    "baseWeight": 20,
    "conditions": {
      "any": [
        {
          "path": "career.field",
          "eq": "factory"
        },
        {
          "path": "career.field",
          "eq": "delivery"
        },
        {
          "hasTag": "migrant_worker"
        }
      ]
    },
    "text": "你在工作里受了点伤，留下一个小疤。它不严重，只是提醒你身体不是免费的。",
    "effects": [
      {
        "path": "resources.health",
        "add": -6
      },
      {
        "path": "resources.wealth",
        "add": 2
      }
    ]
  },
  {
    "id": "daily_midlife_checkup_warning",
    "title": "体检红字",
    "category": "health",
    "ageRange": [
      35,
      60
    ],
    "baseWeight": 30,
    "weightModifiers": [
      {
        "path": "resources.health",
        "lte": 45,
        "multiply": 1.8
      },
      {
        "path": "career.income",
        "gte": 50,
        "multiply": 1.2
      }
    ],
    "text": "体检报告上出现几行红字。你把纸折起来，第一次认真考虑少熬一点夜。",
    "effects": [
      {
        "path": "resources.health",
        "add": -5
      },
      {
        "path": "attrs.mental",
        "add": -1
      },
      {
        "addTimedModifier": {
          "id": "health_warning_recovery",
          "durationYears": 3,
          "target": {
            "category": "health"
          },
          "multiply": 1.3
        }
      }
    ]
  },
  {
    "id": "daily_square_dance_evening",
    "title": "广场舞的晚上",
    "category": "health",
    "ageRange": [
      55,
      80
    ],
    "currentRegions": {
      "cityTiers": [
        "county",
        "city",
        "tier2",
        "tier1"
      ]
    },
    "baseWeight": 30,
    "text": "你在广场边跟着音乐活动筋骨。动作不一定齐，但人群的热闹把晚年照亮了一点。",
    "effects": [
      {
        "path": "resources.health",
        "add": 5
      },
      {
        "path": "relationships.friendship",
        "add": 5
      },
      {
        "path": "resources.happiness",
        "add": 4
      }
    ]
  },
  {
    "id": "daily_old_friend_funeral",
    "title": "老友的葬礼",
    "category": "relationship",
    "ageRange": [
      60,
      90
    ],
    "maxOccurrences": 2,
    "baseWeight": 18,
    "text": "你参加了老友的葬礼。回家的路上很安静，很多年轻时吵过的事，忽然都不重要了。",
    "effects": [
      {
        "path": "resources.happiness",
        "add": -7
      },
      {
        "path": "attrs.mental",
        "add": 1
      },
      {
        "addTag": "old_friend_farewell"
      }
    ]
  },
  {
    "id": "daily_grandchild_video_call",
    "title": "和孙辈视频",
    "category": "family",
    "ageRange": [
      58,
      90
    ],
    "baseWeight": 22,
    "conditions": {
      "all": [
        {
          "path": "relationships.children",
          "gte": 1
        }
      ]
    },
    "text": "屏幕那头的小孩叫你。声音有点卡，但笑脸很清楚，晚年的距离被信号临时缝上。",
    "effects": [
      {
        "path": "relationships.family",
        "add": 6
      },
      {
        "path": "resources.happiness",
        "add": 6
      },
      {
        "addTag": "video_call_grandparent"
      }
    ]
  }
];
