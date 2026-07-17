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
    "lifetimeProbability": 0.42,
    "baseWeight": 34,
    "text": [
      {
        "conditions": {
          "all": [
            { "path": "meta.currentYear", "lte": 1949 },
            { "path": "environment.healthcareAccess", "lte": 3 }
          ]
        },
        "text": "你伤风了几天，灶边煨着热水和家里信得过的土方。病不算大，照样误工误事；穷人的小病，也有自己的分量。"
      },
      {
        "conditions": {
          "all": [
            { "path": "meta.currentYear", "gte": 1950 },
            { "path": "meta.currentYear", "lte": 1985 },
            { "path": "birth.hukou", "eq": "rural" }
          ]
        },
        "text": "你伤风咳嗽了几天，家里从卫生所带回几片药。药片包在折起的小纸里，字不多，叮嘱倒是全家轮流说了一遍。"
      },
      {
        "conditions": {
          "all": [
            { "path": "meta.currentYear", "gte": 1995 },
            { "path": "career.status", "in": ["employed", "self_employed", "gig_worker"] }
          ]
        },
        "text": "你感冒了，鼻音很重，仍把该做的事做完。请假要解释，带病上工不用；生活偶尔对勤奋的理解，和身体不太一致。"
      },
      { "text": "你感冒了几天，鼻音很重，整个人像被一层湿布罩住。病不算传奇，难受却是本人一口一口受完的。" }
    ],
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
    "lifetimeProbability": 0.38,
    "baseWeight": 30,
    "text": [
      {
        "conditions": { "all": [{ "path": "resources.wealth", "lte": 30 }] },
        "text": "你这一晚没有睡好。欠账、米钱或下个月的开销在黑暗里轮流报数，天还没亮，日子已经先来催你。"
      },
      {
        "conditions": { "all": [{ "path": "career.status", "in": ["employed", "self_employed", "gig_worker"] }] },
        "text": "你这一晚没睡好，脑子把白天的差错和明天的活重新排演了一遍。闹钟响时，它倒装作什么都没发生。"
      },
      {
        "conditions": { "all": [{ "path": "meta.age", "gte": 60 }] },
        "text": "你半夜醒来，听见屋里细小的声响。年轻时睡眠像一扇关得住的门，如今风、旧事和身体都各有钥匙。"
      },
      { "text": "你这一晚没睡好。天亮时人还在床上，心却像已经被生活提前叫去排队。" }
    ],
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
    "lifetimeProbability": 0.42,
    "baseWeight": 36,
    "text": [
      {
        "conditions": { "all": [{ "path": "location.currentCityTier", "in": ["village", "town"] }] },
        "text": "你清早沿村路走了一圈，先碰见牲口和炊烟，后碰见同样睡不久的老人。大家谈天气，也顺便互相确认身体还肯出门。"
      },
      {
        "conditions": { "all": [{ "path": "resources.health", "lte": 45 }] },
        "text": "你清晨出去慢慢走，路不长，中间歇了两次。身体没有恢复年轻，只是终于肯同你商量，而不是直接下命令。"
      },
      { "text": "你清晨出去走了一圈。街道慢慢醒来，身体也像被温和地重新启动；熟面孔彼此点头，像一次不收费的签到。" }
    ],
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
    "text": [
      {
        "conditions": { "all": [{ "path": "resources.health", "lte": 45 }] },
        "text": "体检报告上不止一项超出范围，医生把饮食、睡眠和复查日期逐条圈出。你原本想说工作太忙，话到嘴边才发现身体从未签过加班协议。"
      },
      {
        "conditions": { "all": [{ "path": "career.status", "in": ["employed", "self_employed"] }, { "path": "career.income", "gte": 50 }] },
        "text": "单位体检的红字提醒你，收入和职位一起上升的还有腰围与血脂。报告没有评价事业，只冷静建议你少坐一会儿。"
      },
      { "text": "体检报告出现几项需要留意的指标。你把纸折起来，又重新打开，把复查时间记进日历；成年人对健康的重视，常从不能再装没看见开始。" }
    ],
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
    "text": [
      {
        "conditions": { "all": [{ "path": "location.currentCityTier", "in": ["village", "town"] }] },
        "text": "老友的丧事办在熟悉的院子里，来的人说着他年轻时的脾气，也帮忙摆桌收碗。散席后你沿旧路回家，村子没有变大，却又少了一个能谈从前的人。"
      },
      {
        "conditions": { "all": [{ "path": "meta.age", "gte": 78 }] },
        "text": "你送别一位相识大半生的朋友，许多共同认识的人已经不能来。悼词只讲几分钟，你们之间那些误会、借款和笑话却排了几十年。"
      },
      { "text": "你参加了老友的葬礼，同几张久违的面孔坐在一起。回家路上很安静，过去争得面红耳赤的事没有消失，只是终于显得没那么值得。" }
    ],
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
    "text": [
      {
        "conditions": { "all": [{ "path": "resources.wealth", "lte": 35 }] },
        "text": "牙疼了几天，你先问诊费，再说哪里疼。饭只能用一边慢慢嚼，小病不至于停下生活，却能让每一口都提醒钱不够宽裕。"
      },
      {
        "conditions": { "all": [{ "path": "meta.currentYear", "lte": 1975 }, { "path": "location.currentCityTier", "in": ["village", "town"] }] },
        "text": "牙疼拖了几天，你用盐水漱口，等赶集或卫生员来时再问。止疼办法很多，真正能处理坏牙的地方却离得远。"
      },
      { "text": "你把牙疼拖了几天，吃饭时总要避开一边，夜里又被一阵阵钝痛叫醒。小疼痛不体面，却很会把生活占得只剩半张嘴。" }
    ],
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
    "lifetimeProbability": 0.38,
    "baseWeight": 26,
    "weightModifiers": [
      {
        "path": "resources.health",
        "lte": 55,
        "multiply": 1.5
      }
    ],
    "text": [
      {
        "conditions": { "all": [{ "path": "resources.wealth", "lte": 30 }] },
        "text": "你从看病的地方带回一包药，先按轻重缓急把药钱算了一遍。身体要长期照料，口袋却习惯按月发表意见。"
      },
      {
        "conditions": { "all": [{ "path": "meta.currentYear", "lte": 1980 }] },
        "text": "你带回几包药，纸上写着服法，家里人又凭经验补充了另一套。药味在屋里散开，病还没好，讨论已经很充分。"
      },
      { "text": "你从看病的地方带回一包药。身体像一件用了多年的器物，开始需要格外照料；说明书越来越长，脾气倒仍是原装的。" }
    ],
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
    "text": [
      {
        "conditions": { "all": [{ "path": "resources.health", "lte": 45 }] },
        "text": "袖带一圈圈收紧，连续两次数字都偏高。你原本怪机器不准，第三次安静坐好，终于肯把结果记下来带给医生。"
      },
      {
        "conditions": { "all": [{ "path": "location.currentCityTier", "in": ["village", "town"] }] },
        "text": "村医或药店替你量了血压，旁边的人顺便讨论谁家的机器更准。数字报出来以后，大家的经验很多，医嘱仍得单独听。"
      },
      { "text": "你在家或门诊坐好，把手臂伸进血压袖带。机器响过几声，屏幕给出一组平常得不能再平常、又足以改变晚饭咸淡的数字。" }
    ],
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
    "lifetimeProbability": 0.2,
    "baseWeight": 14,
    "conditions": {
      "all": [
        { "path": "resources.health", "lte": 55 }
      ]
    },
    "weightModifiers": [
      {
        "path": "resources.health",
        "lte": 45,
        "multiply": 1.8
      }
    ],
    "text": [
      {
        "conditions": { "all": [{ "path": "resources.health", "lte": 42 }] },
        "text": "你从市场出来忽然分不清回家的方向，手里的菜渐渐勒疼。好心人按你随身卡片上的号码联系家人，你嘴上说没事，回到家才肯坐下。"
      },
      {
        "conditions": { "all": [{ "path": "location.currentCityTier", "in": ["village", "town"] }] },
        "text": "赶集散场后，你一时认错了岔路。路人说出附近几户人家的名字，你才重新接上方向；熟人社会有许多麻烦，这次也充当了路标。"
      },
      { "text": "你在熟悉的街口一时转错方向，绕了一圈才找到认识的店铺。路没有大变，迟疑却留了下来；此后出门，家里多问了一句去哪里。" }
    ],
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
    "lifetimeProbability": 0.3,
    "baseWeight": 18,
    "conditions": {
      "any": [
        { "path": "resources.health", "lte": 55 },
        { "hasTag": "chronic_weakness" }
      ]
    },
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
    "text": [
      {
        "conditions": { "all": [{ "path": "resources.health", "lte": 42 }] },
        "text": "病后第一次下床，几步便出汗，照护者推着椅子跟在后面。你走到窗边就坐下，今天的距离很短，却没有必要拿健康时的自己来羞辱它。"
      },
      {
        "conditions": { "all": [{ "path": "meta.age", "gte": 68 }] },
        "text": "你扶着走廊栏杆练习，一步一步把重心交回双腿。年轻人从旁经过很快，你不追；康复的钟只按自己的刻度走。"
      },
      { "text": "病后你按医嘱慢慢增加步数，走累便停，不再拿逞强当进步。身体没有一下回来，日常却从床边、门口到楼下一点点接上。" }
    ],
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
    "text": [
      {
        "conditions": { "all": [{ "path": "location.currentCityTier", "in": ["village", "town"] }, { "path": "location.migratedTimes", "gte": 1 }] },
        "text": "孩子们在外地生活，院里只剩你按时开关门。电话里都说忙完回来，菜地倒每天准时要水；你先把日子交给这些不会失约的小事。"
      },
      {
        "conditions": { "all": [{ "path": "resources.health", "lte": 48 }] },
        "text": "孩子们各自忙，屋里安静下来后，你最怕的不是无聊，而是身体不舒服时没人立刻知道。家里添了联系办法，安全多一点，空屋仍旧是空屋。"
      },
      { "text": "孩子们各有工作和家庭，来过以后，屋里又只剩钟声与日常物件。你明白这不是无人惦记，也仍会在晚饭时多摆出一只碗才想起收回。" }
    ],
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
