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
    "text": "你去了一趟更大的城里。车站、商店、招牌和人群挤在一起，让你忽然知道外面的日子还有很多种样子。",
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
    "title": "菜市场讲价",
    "category": "wealth",
    "ageRange": [
      18,
      85
    ],
    "baseWeight": 24,
    "text": "你在菜市场讲了半天价。省下的钱不多，但那一刻你觉得自己从生活手里掰回了一点主动权。",
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
  }
];
