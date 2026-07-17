// Auto-split event data. Keep events in this file focused on one era or theme.
export const dailyWorkWealthEvents = [
  {
    "id": "daily_lost_small_money",
    "title": "丢了点钱",
    "category": "wealth",
    "ageRange": [
      10,
      80
    ],
    "baseWeight": 24,
    "weightModifiers": [
      {
        "path": "attrs.luck",
        "lte": 3,
        "multiply": 1.5
      }
    ],
    "text": "你丢了点钱，数额不大，但足够让这一天变得别扭。人有时就是会被小损失牵着走很久。",
    "effects": [
      {
        "path": "resources.wealth",
        "add": -3
      },
      {
        "path": "resources.happiness",
        "add": -2
      }
    ]
  },
  {
    "id": "daily_skill_practice",
    "title": "练了一门手艺",
    "category": "career",
    "ageRange": [
      14,
      45
    ],
    "baseWeight": 26,
    "text": "你花了一段时间练一门实用手艺。进步很慢，但手上多一点本事，心里就多一点底。",
    "effects": [
      {
        "path": "career.level",
        "add": 3
      },
      {
        "path": "resources.achievement",
        "add": 3
      },
      {
        "addTrait": "practical_skill"
      }
    ]
  },
  {
    "id": "daily_short_trip_to_town",
    "title": "去了一趟城里",
    "category": "migration",
    "ageRange": [
      8,
      55
    ],
    "birthRegions": {
      "cityTiers": [
        "village",
        "town",
        "county"
      ]
    },
    "baseWeight": 28,
    "text": "你去了一趟更大的城里。渡口、店铺、招牌和人群挤在一起，让你忽然知道外面的日子还有很多种样子。",
    "effects": [
      {
        "path": "resources.freedom",
        "add": 3
      },
      {
        "path": "resources.happiness",
        "add": 2
      },
      {
        "addTag": "town_trip_memory"
      }
    ]
  },
  {
    "id": "daily_workday_overtime",
    "title": "多干了一阵活",
    "category": "career",
    "ageRange": [
      20,
      60
    ],
    "baseWeight": 32,
    "conditions": {
      "any": [
        {
          "path": "career.status",
          "eq": "employed"
        },
        {
          "path": "career.status",
          "eq": "self_employed"
        },
        {
          "path": "career.status",
          "eq": "gig_worker"
        }
      ]
    },
    "text": [
      {
        "conditions": {
          "all": [
            {
              "path": "meta.currentYear",
              "lte": 1948
            }
          ]
        },
        "text": "你为东家或家里多赶了一阵活。天色早就暗了，手上的活计还没到能停的时候。"
      },
      {
        "conditions": {
          "all": [
            {
              "path": "meta.currentYear",
              "gte": 1949
            },
            {
              "path": "meta.currentYear",
              "lte": 1985
            }
          ]
        },
        "text": "你多干了一阵活。那时不一定叫加班，可能叫突击、赶任务，或者大家都不走你也不好走。"
      },
      {
        "text": "你加了一阵班。灯还亮着，消息还在响，身体已经开始偷偷抗议。"
      }
    ],
    "effects": [
      {
        "path": "resources.wealth",
        "add": 3
      },
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
    "id": "daily_small_promotion",
    "title": "被夸了一次",
    "category": "career",
    "ageRange": [
      18,
      60
    ],
    "baseWeight": 22,
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
    "text": "你因为一件事被夸了一次。夸奖很快过去，但那天你走路比平时轻了一点。",
    "effects": [
      {
        "path": "career.level",
        "add": 2
      },
      {
        "path": "resources.achievement",
        "add": 3
      },
      {
        "path": "resources.happiness",
        "add": 2
      }
    ]
  },
  {
    "id": "daily_market_bargain",
    "title": "市集讲价",
    "category": "wealth",
    "ageRange": [
      18,
      85
    ],
    "baseWeight": 24,
    "text": "你在市集上讲了半天价。省下的钱不多，但那一刻你觉得自己从生活手里掰回了一点主动权。",
    "effects": [
      {
        "path": "resources.wealth",
        "add": 2
      },
      {
        "path": "resources.happiness",
        "add": 1
      }
    ]
  },
  {
    "id": "daily_lottery_small_win",
    "title": "小奖",
    "category": "wealth",
    "yearRange": [
      1987,
      2035
    ],
    "ageRange": [
      18,
      80
    ],
    "baseWeight": 8,
    "weightModifiers": [
      {
        "path": "attrs.luck",
        "gte": 7,
        "multiply": 2.5
      },
      {
        "hasTrait": "strong_luck",
        "multiply": 2
      }
    ],
    "text": "你随手买的一张票中了小奖。金额不大，但足够让这一天显得像被命运眨了一下眼。",
    "effects": [
      {
        "path": "resources.wealth",
        "add": 8
      },
      {
        "path": "resources.happiness",
        "add": 5
      },
      {
        "addTag": "small_luck_win"
      }
    ]
  },
  {
    "id": "daily_payday_small_relief",
    "title": "发工资那天",
    "category": "wealth",
    "yearRange": [
      1950,
      2035
    ],
    "ageRange": [
      18,
      70
    ],
    "conditions": {
      "any": [
        {
          "path": "career.status",
          "eq": "employed"
        },
        {
          "path": "career.status",
          "eq": "gig_worker"
        }
      ]
    },
    "baseWeight": 28,
    "text": [
      {
        "conditions": {
          "all": [
            {
              "path": "meta.currentYear",
              "lte": 1992
            }
          ]
        },
        "text": "发工资那天，你把钱和票据仔细收好。数字不大，却能让一家人的饭桌暂时稳住。"
      },
      {
        "text": "发工资那天，手机或信封里的数字终于落下。很多压力没有消失，只是暂时往后挪了几步。"
      }
    ],
    "effects": [
      {
        "path": "resources.wealth",
        "add": 5
      },
      {
        "path": "resources.happiness",
        "add": 2
      }
    ]
  },
  {
    "id": "daily_work_mistake_scolded",
    "title": "工作出了错",
    "category": "career",
    "yearRange": [
      1950,
      2035
    ],
    "ageRange": [
      18,
      65
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
        },
        {
          "path": "career.status",
          "eq": "gig_worker"
        }
      ]
    },
    "baseWeight": 24,
    "text": "你在工作里出了点错，被人当面说了几句。事情后来补上了，脸上的热却退得更慢。",
    "effects": [
      {
        "path": "career.level",
        "add": -1
      },
      {
        "path": "resources.happiness",
        "add": -4
      },
      {
        "path": "attrs.mental",
        "add": 1
      },
      {
        "addTag": "work_mistake_memory"
      }
    ]
  },
  {
    "id": "daily_colleague_shared_meal",
    "title": "同事一起吃饭",
    "category": "relationship",
    "yearRange": [
      1950,
      2035
    ],
    "ageRange": [
      18,
      65
    ],
    "conditions": {
      "all": [
        {
          "path": "career.status",
          "eq": "employed"
        }
      ]
    },
    "baseWeight": 24,
    "text": [
      {
        "conditions": {
          "all": [
            {
              "path": "meta.currentYear",
              "lte": 1995
            }
          ]
        },
        "text": "你和同事在食堂或小馆子里吃了一顿饭。饭菜普通，闲话却让单位的墙变得没那么冷。"
      },
      {
        "text": "你和同事一起吃了顿饭，聊工作，也聊一些不方便写进工作群的事。关系就在这些缝隙里变熟。"
      }
    ],
    "effects": [
      {
        "path": "relationships.friendship",
        "add": 4
      },
      {
        "path": "resources.happiness",
        "add": 2
      },
      {
        "addTag": "workplace_friendship"
      }
    ]
  },
  {
    "id": "daily_small_tool_bought",
    "title": "买了件趁手工具",
    "category": "wealth",
    "yearRange": [
      1978,
      2035
    ],
    "ageRange": [
      16,
      65
    ],
    "baseWeight": 20,
    "text": [
      {
        "conditions": {
          "all": [
            {
              "path": "career.field",
              "in": [
                "factory",
                "manual_worker",
                "apprentice",
                "township_business"
              ]
            }
          ]
        },
        "text": "你买了件趁手工具。它不贵，却让手里的活顺了一点，像给日子加了一个小齿轮。"
      },
      {
        "text": "你买了件真正用得上的小东西。花钱时心疼，后来每次用上，又觉得这钱花得有声响。"
      }
    ],
    "effects": [
      {
        "path": "resources.wealth",
        "add": -3
      },
      {
        "path": "career.level",
        "add": 2
      },
      {
        "path": "resources.achievement",
        "add": 2
      },
      {
        "addTag": "useful_tool_memory"
      }
    ]
  },
  {
    "id": "daily_debt_due_day",
    "title": "还账的日子",
    "category": "wealth",
    "yearRange": [
      1978,
      2035
    ],
    "ageRange": [
      20,
      70
    ],
    "baseWeight": 18,
    "weightModifiers": [
      {
        "path": "resources.wealth",
        "lte": 35,
        "multiply": 1.7
      },
      {
        "hasTag": "kinship_debt_memory",
        "multiply": 1.4
      }
    ],
    "text": "到了还账的日子，你把钱数了又数。欠条、情分和利息压在一起，连呼吸都像要算成本。",
    "effects": [
      {
        "path": "resources.wealth",
        "add": -7
      },
      {
        "path": "resources.happiness",
        "add": -5
      },
      {
        "addTag": "debt_pressure_memory"
      }
    ]
  },
  {
    "id": "daily_commute_long_ride",
    "title": "很长的通勤",
    "category": "career",
    "yearRange": [
      1995,
      2035
    ],
    "ageRange": [
      18,
      65
    ],
    "currentRegions": {
      "cityTiers": [
        "city",
        "tier2",
        "tier1"
      ]
    },
    "conditions": {
      "any": [
        {
          "path": "career.status",
          "eq": "employed"
        },
        {
          "path": "career.status",
          "eq": "gig_worker"
        }
      ]
    },
    "baseWeight": 22,
    "text": "你在路上花了很久，车厢里的人一起沉默着摇晃。城市给了你机会，也把时间切成一段一段。",
    "effects": [
      {
        "path": "resources.health",
        "add": -2
      },
      {
        "path": "resources.happiness",
        "add": -3
      },
      {
        "path": "career.income",
        "add": 1
      },
      {
        "addTag": "long_commute_memory"
      }
    ]
  },
  {
    "id": "daily_side_job_attempt",
    "title": "试着赚点外快",
    "category": "wealth",
    "yearRange": [
      1985,
      2035
    ],
    "ageRange": [
      18,
      60
    ],
    "baseWeight": 20,
    "text": [
      {
        "conditions": {
          "all": [
            {
              "path": "meta.currentYear",
              "lte": 1999
            }
          ]
        },
        "text": "你试着做点小买卖、接点零活。白天的身份还在，晚上却多了一本自己的小账。"
      },
      {
        "text": "你试着赚点外快。时间被挤得更紧，但银行卡里多出来的数字让你舍不得停。"
      }
    ],
    "effects": [
      {
        "path": "resources.wealth",
        "add": 5
      },
      {
        "path": "resources.health",
        "add": -2
      },
      {
        "path": "resources.freedom",
        "add": 1
      },
      {
        "addTag": "side_job_memory"
      }
    ]
  }
];
