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
    "title": "做活留下的疤",
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
    "text": "你在做活时受了点伤，留下一个小疤。它不严重，只是提醒你身体不是免费的。",
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
    "yearRange": [
      1980,
      2035
    ],
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
    "yearRange": [
      2000,
      2035
    ],
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
    "maxOccurrences": 1,
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
    "yearRange": [
      2000,
      2035
    ],
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
  },
  {
    "id": "daily_toothache_delay",
    "title": "牙疼拖了几天",
    "category": "health",
    "ageRange": [
      12,
      80
    ],
    "baseWeight": 24,
    "weightModifiers": [
      {
        "path": "resources.wealth",
        "lte": 35,
        "multiply": 1.4
      }
    ],
    "text": "你牙疼拖了几天，吃饭时总要避开一边。小疼痛不体面，却很会占据生活。",
    "effects": [
      {
        "path": "resources.health",
        "add": -4
      },
      {
        "path": "resources.happiness",
        "add": -3
      },
      {
        "addTag": "toothache_memory"
      }
    ]
  },
  {
    "id": "daily_prescription_bag",
    "title": "一袋子药",
    "category": "health",
    "ageRange": [
      45,
      90
    ],
    "baseWeight": 26,
    "weightModifiers": [
      {
        "path": "resources.health",
        "lte": 55,
        "multiply": 1.5
      }
    ],
    "text": "你从看病的地方带回一包药。身体像一件用了多年的器物，开始需要格外照料。",
    "effects": [
      {
        "path": "resources.wealth",
        "add": -4
      },
      {
        "path": "resources.health",
        "add": 2
      },
      {
        "addTag": "medicine_bag_memory"
      }
    ]
  },
  {
    "id": "daily_blood_pressure_machine",
    "title": "量血压",
    "category": "health",
    "yearRange": [
      1990,
      2035
    ],
    "ageRange": [
      50,
      90
    ],
    "baseWeight": 24,
    "text": "你坐下来量血压，袖带慢慢收紧。数字跳出来的一刻，往后的健康像被压缩成了几行指标。",
    "effects": [
      {
        "path": "resources.health",
        "add": 1
      },
      {
        "path": "resources.happiness",
        "add": -1
      },
      {
        "addTag": "blood_pressure_routine"
      }
    ]
  },
  {
    "id": "daily_elder_lost_in_market",
    "title": "一时迷路",
    "category": "health",
    "ageRange": [
      68,
      95
    ],
    "baseWeight": 14,
    "weightModifiers": [
      {
        "path": "resources.health",
        "lte": 45,
        "multiply": 1.8
      }
    ],
    "text": "你在熟悉的街口一时转错了方向。路没有变太多，变的是你忽然不敢完全相信自己的记忆。",
    "effects": [
      {
        "path": "resources.happiness",
        "add": -5
      },
      {
        "path": "attrs.mental",
        "add": -1
      },
      {
        "addTag": "elder_confusion_memory"
      }
    ]
  },
  {
    "id": "daily_rehab_walk_after_illness",
    "title": "病后慢慢走",
    "category": "health",
    "ageRange": [
      35,
      90
    ],
    "baseWeight": 18,
    "weightModifiers": [
      {
        "path": "resources.health",
        "lte": 45,
        "multiply": 1.7
      },
      {
        "hasTag": "chronic_weakness",
        "multiply": 1.4
      }
    ],
    "text": "病后你扶着栏杆慢慢走，几步路也要算力气。身体没有立刻回来，但你愿意一点点把它接回来。",
    "effects": [
      {
        "path": "resources.health",
        "add": 4
      },
      {
        "path": "attrs.mental",
        "add": 1
      },
      {
        "addTag": "rehab_walk_memory"
      }
    ]
  },
  {
    "id": "daily_elder_community_clinic",
    "title": "社区门诊",
    "category": "health",
    "yearRange": [
      2000,
      2035
    ],
    "ageRange": [
      55,
      90
    ],
    "currentRegions": {
      "cityTiers": [
        "county",
        "city",
        "tier2",
        "tier1"
      ]
    },
    "baseWeight": 24,
    "text": "你去社区门诊量血糖、开常用药。医生认识你的脸，病历也像一本慢慢变厚的日记。",
    "effects": [
      {
        "path": "resources.health",
        "add": 3
      },
      {
        "path": "resources.wealth",
        "add": -2
      },
      {
        "addTag": "community_clinic_memory"
      }
    ]
  },
  {
    "id": "daily_elder_empty_room",
    "title": "屋里安静",
    "category": "family",
    "ageRange": [
      60,
      95
    ],
    "baseWeight": 20,
    "conditions": {
      "all": [
        {
          "path": "relationships.children",
          "gte": 1
        }
      ]
    },
    "text": "孩子们各自忙去了，屋里安静得能听见钟走。你知道这不是没人爱你，只是每个人都被自己的生活带走。",
    "effects": [
      {
        "path": "resources.happiness",
        "add": -4
      },
      {
        "path": "attrs.mental",
        "add": 1
      },
      {
        "addTag": "empty_nest_memory"
      }
    ]
  }
];
