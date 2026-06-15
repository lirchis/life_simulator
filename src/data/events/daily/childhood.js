// Auto-split event data. Keep events in this file focused on one era or theme.
export const dailyChildhoodEvents = [
  {
    "id": "daily_childhood_firefly",
    "title": "捉萤火虫",
    "category": "random",
    "ageRange": [
      4,
      10
    ],
    "birthRegions": {
      "cityTiers": [
        "village",
        "town",
        "county"
      ]
    },
    "baseWeight": 42,
    "text": "夏夜很黑，萤火虫一闪一闪。你把它们捧在手心，像捧住了一小把会呼吸的星星。",
    "effects": [
      {
        "path": "resources.happiness",
        "add": 5
      },
      {
        "path": "relationships.friendship",
        "add": 2
      },
      {
        "addTag": "rural_childhood_light"
      }
    ]
  },
  {
    "id": "daily_old_song_on_radio",
    "title": "听到一首旧歌",
    "category": "random",
    "ageRange": [
      30,
      90
    ],
    "baseWeight": 28,
    "text": "你偶然听到一首旧歌。旋律一响，很多早就不提的年份忽然从心里抬头。",
    "effects": [
      {
        "path": "resources.happiness",
        "add": 2
      },
      {
        "path": "attrs.mental",
        "add": 1
      }
    ]
  },
  {
    "id": "daily_childhood_mud_after_rain",
    "title": "雨后踩泥",
    "category": "random",
    "ageRange": [
      3,
      10
    ],
    "birthRegions": {
      "cityTiers": [
        "village",
        "town",
        "county"
      ]
    },
    "baseWeight": 34,
    "text": "雨停以后，你和孩子们在泥地边踩出一串脚印。鞋脏了要挨说，可那一刻世界软得像能重新捏一遍。",
    "effects": [
      {
        "path": "resources.happiness",
        "add": 4
      },
      {
        "path": "relationships.friendship",
        "add": 3
      },
      {
        "addTag": "muddy_childhood_memory"
      }
    ]
  },
  {
    "id": "daily_childhood_small_shop_glass_jar",
    "title": "小卖部玻璃罐",
    "category": "wealth",
    "ageRange": [
      5,
      14
    ],
    "yearRange": [
      1978,
      2015
    ],
    "currentRegions": {
      "cityTiers": [
        "village",
        "town",
        "county",
        "city"
      ]
    },
    "baseWeight": 30,
    "text": "小卖部柜台上摆着玻璃罐，糖果和零钱在里面发亮。你攥着几枚硬币，认真计算今天的快乐值多少钱。",
    "effects": [
      {
        "path": "resources.wealth",
        "add": -1
      },
      {
        "path": "resources.happiness",
        "add": 4
      },
      {
        "addTag": "small_shop_childhood"
      }
    ]
  },
  {
    "id": "daily_childhood_first_bicycle_ride",
    "title": "学骑车",
    "category": "random",
    "ageRange": [
      6,
      14
    ],
    "yearRange": [
      1965,
      2025
    ],
    "baseWeight": 24,
    "text": "你学着骑车，车把晃得厉害，膝盖也磕了一下。可真正骑出去那几米时，风像突然站到了你这边。",
    "effects": [
      {
        "path": "resources.health",
        "add": 2
      },
      {
        "path": "resources.freedom",
        "add": 4
      },
      {
        "addTag": "first_bicycle_memory"
      }
    ]
  },
  {
    "id": "daily_childhood_hide_from_adults",
    "title": "躲着大人玩",
    "category": "relationship",
    "ageRange": [
      5,
      13
    ],
    "baseWeight": 28,
    "text": "你和几个孩子躲着大人玩了一阵。秘密地点其实很近，但对你们来说，已经像一块独立的小国土。",
    "effects": [
      {
        "path": "relationships.friendship",
        "add": 5
      },
      {
        "path": "resources.freedom",
        "add": 2
      },
      {
        "addTag": "childhood_secret_place"
      }
    ]
  },
  {
    "id": "daily_childhood_scared_by_thunder",
    "title": "被雷声吓醒",
    "category": "health",
    "ageRange": [
      2,
      9
    ],
    "baseWeight": 20,
    "text": "半夜雷声滚过屋顶，你被吓醒了。有人把你往怀里搂了搂，世界才慢慢从黑暗里退远。",
    "effects": [
      {
        "path": "resources.happiness",
        "add": -2
      },
      {
        "path": "relationships.family",
        "add": 3
      },
      {
        "addTag": "thunder_night_memory"
      }
    ]
  },
  {
    "id": "daily_childhood_fair_crowd",
    "title": "赶集的人群",
    "category": "random",
    "ageRange": [
      4,
      15
    ],
    "birthRegions": {
      "cityTiers": [
        "village",
        "town",
        "county"
      ]
    },
    "baseWeight": 26,
    "text": "你跟着大人去赶集，人声、秤砣、牲口味和油锅香混在一起。小地方的热闹，也能把眼睛塞得很满。",
    "effects": [
      {
        "path": "attrs.intelligence",
        "add": 1
      },
      {
        "path": "resources.happiness",
        "add": 3
      },
      {
        "addTag": "rural_fair_memory"
      }
    ]
  },
  {
    "id": "daily_childhood_television_neighbors",
    "title": "挤着看电视",
    "category": "random",
    "yearRange": [
      1982,
      2005
    ],
    "ageRange": [
      4,
      16
    ],
    "baseWeight": 22,
    "text": "晚上，几个邻居挤在一台电视前。屏幕不大，雪花点也不少，可整个院子或楼道都跟着亮了起来。",
    "effects": [
      {
        "path": "relationships.friendship",
        "add": 4
      },
      {
        "path": "resources.happiness",
        "add": 4
      },
      {
        "addTag": "shared_tv_childhood"
      }
    ]
  }
];
