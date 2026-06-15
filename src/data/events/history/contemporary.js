// Auto-split event data. Keep events in this file focused on one era or theme.
export const historyContemporaryEvents = [
  {
    "id": "era_wto_factory_orders",
    "title": "订单像潮水",
    "category": "career",
    "yearRange": [
      2001,
      2008
    ],
    "ageRange": [
      18,
      55
    ],
    "currentRegions": {
      "provinceGroups": [
        "province.coastal"
      ]
    },
    "maxOccurrences": 1,
    "priority": 42,
    "baseWeight": 45,
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
        "text": "加入 WTO 后，厂里的订单像潮水一样涌来。女工宿舍的灯很晚才灭，你在工资条上看见世界，也看见自己的青春被计件。"
      },
      {
        "text": "加入 WTO 后，厂里的订单像潮水一样涌来。你在流水线旁站到腿麻，也在工资条上看见世界的影子。"
      }
    ],
    "effects": [
      {
        "path": "career.income",
        "add": 10
      },
      {
        "path": "resources.wealth",
        "add": 12
      },
      {
        "path": "resources.health",
        "add": -5
      },
      {
        "path": "resources.achievement",
        "add": 5
      },
      {
        "addTag": "wto_wave_worker"
      }
    ]
  },
  {
    "id": "era_sars_quarantine",
    "title": "非典隔离",
    "category": "health",
    "yearRange": [
      2003,
      2003
    ],
    "ageRange": [
      0,
      80
    ],
    "currentRegions": {
      "cityTiers": [
        "city",
        "tier2",
        "tier1"
      ]
    },
    "maxOccurrences": 1,
    "priority": 48,
    "baseWeight": 45,
    "text": "口罩、体温计和消毒水占满生活。城市忽然安静下来，连咳嗽都变得很有重量。",
    "effects": [
      {
        "path": "resources.health",
        "add": -3
      },
      {
        "path": "resources.happiness",
        "add": -6
      },
      {
        "path": "relationships.family",
        "add": 3
      },
      {
        "addTag": "sars_memory"
      }
    ]
  },
  {
    "id": "era_olympic_opening_night",
    "title": "北京奥运夜",
    "category": "random",
    "yearRange": [
      2008,
      2008
    ],
    "ageRange": [
      0,
      100
    ],
    "priority": 42,
    "maxOccurrences": 1,
    "baseWeight": 90,
    "text": "那一夜，很多人围着电视看北京。烟火升起时，你忽然觉得一个国家也会在某个瞬间屏住呼吸。",
    "effects": [
      {
        "path": "resources.happiness",
        "add": 8
      },
      {
        "path": "resources.reputation",
        "add": 3
      },
      {
        "addTag": "beijing_olympics_memory"
      }
    ]
  },
  {
    "id": "era_2008_financial_crisis_order_cut",
    "title": "外贸单少了",
    "category": "wealth",
    "yearRange": [
      2008,
      2010
    ],
    "ageRange": [
      18,
      60
    ],
    "currentRegions": {
      "provinceGroups": [
        "province.coastal"
      ]
    },
    "baseWeight": 32,
    "conditions": {
      "any": [
        {
          "hasTag": "wto_wave_worker"
        },
        {
          "hasTag": "migrant_worker"
        },
        {
          "path": "career.field",
          "eq": "trade"
        }
      ]
    },
    "text": "厂里突然少了订单，加班表空出一大片。远在大洋彼岸的风暴，最后吹到你的工资条上。",
    "effects": [
      {
        "path": "resources.wealth",
        "add": -10
      },
      {
        "path": "resources.happiness",
        "add": -6
      },
      {
        "path": "career.income",
        "add": -8
      },
      {
        "addTag": "financial_crisis_hit"
      }
    ]
  },
  {
    "id": "era_high_speed_rail_home",
    "title": "高铁回家",
    "category": "migration",
    "yearRange": [
      2010,
      2020
    ],
    "ageRange": [
      18,
      70
    ],
    "conditions": {
      "any": [
        {
          "hasTag": "migrant"
        },
        {
          "hasTag": "migrant_worker"
        },
        {
          "path": "resources.wealth",
          "gte": 45
        }
      ]
    },
    "baseWeight": 26,
    "text": "你坐高铁回家，窗外的城市和田野被压成一条流光。距离还在，但它第一次显得没那么硬。",
    "effects": [
      {
        "path": "relationships.family",
        "add": 5
      },
      {
        "path": "resources.happiness",
        "add": 4
      },
      {
        "path": "resources.freedom",
        "add": 3
      },
      {
        "addTag": "high_speed_rail_life"
      }
    ]
  },
  {
    "id": "era_housing_price_pressure",
    "title": "房价压顶",
    "category": "wealth",
    "yearRange": [
      2005,
      2020
    ],
    "ageRange": [
      24,
      45
    ],
    "currentRegions": {
      "cityTiers": [
        "city",
        "tier2",
        "tier1"
      ]
    },
    "baseWeight": 42,
    "weightModifiers": [
      {
        "path": "environment.housingPressure",
        "gte": 8,
        "multiply": 1.8
      },
      {
        "path": "resources.wealth",
        "lte": 45,
        "multiply": 1.4
      }
    ],
    "text": "售楼处的沙盘灯火通明，价格却像另一种高山。你站在模型前，感觉未来被按揭切成很多小块。",
    "effects": [
      {
        "path": "resources.wealth",
        "add": -10
      },
      {
        "path": "resources.happiness",
        "add": -7
      },
      {
        "path": "resources.freedom",
        "add": -6
      },
      {
        "addTag": "housing_pressure"
      }
    ]
  },
  {
    "id": "era_mobile_internet_first_smartphone",
    "title": "第一部智能手机",
    "category": "random",
    "yearRange": [
      2010,
      2020
    ],
    "ageRange": [
      10,
      70
    ],
    "maxOccurrences": 1,
    "baseWeight": 45,
    "text": "你换了第一部智能手机。地图、聊天、支付和短视频挤进手心，世界从桌面搬到了口袋。",
    "effects": [
      {
        "path": "resources.freedom",
        "add": 6
      },
      {
        "path": "relationships.friendship",
        "add": 4
      },
      {
        "path": "resources.happiness",
        "add": 3
      },
      {
        "addTrait": "networked_mind"
      },
      {
        "addTag": "smartphone_generation"
      }
    ]
  },
  {
    "id": "era_ecommerce_side_job",
    "title": "开网店",
    "category": "career",
    "tags": [
      "startup"
    ],
    "yearRange": [
      2005,
      2020
    ],
    "ageRange": [
      20,
      45
    ],
    "maxOccurrences": 1,
    "baseWeight": 22,
    "weightModifiers": [
      {
        "hasTrait": "digital_native",
        "multiply": 1.5
      },
      {
        "hasTrait": "business_mind",
        "multiply": 1.5
      },
      {
        "path": "environment.businessClimate",
        "gte": 7,
        "multiply": 1.4
      }
    ],
    "text": "你在网上开了个小店。旺旺提示音响起时，你感觉柜台忽然变得没有边界。",
    "effects": [
      {
        "path": "resources.wealth",
        "add": 10
      },
      {
        "path": "resources.freedom",
        "add": 5
      },
      {
        "path": "resources.health",
        "add": -3
      },
      {
        "addTag": "ecommerce_seller"
      },
      {
        "addTrait": "platform_hustler"
      }
    ]
  },
  {
    "id": "era_platform_delivery_rider",
    "title": "平台骑手",
    "category": "career",
    "yearRange": [
      2014,
      2020
    ],
    "ageRange": [
      18,
      55
    ],
    "maxOccurrences": 1,
    "baseWeight": 24,
    "conditions": {
      "any": [
        {
          "path": "career.status",
          "eq": "laid_off"
        },
        {
          "path": "resources.wealth",
          "lte": 35
        },
        {
          "hasTag": "migrant_worker"
        }
      ]
    },
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
        "text": "你把手机绑在车把上，城市被拆成一个个倒计时。夜路和差评都要小心，算法在耳机里催促。"
      },
      {
        "text": "你把手机绑在车把上，城市被拆成一个个倒计时。风从脸上刮过去，算法在耳机里催促。"
      }
    ],
    "effects": [
      {
        "path": "career.status",
        "set": "gig_worker"
      },
      {
        "path": "career.field",
        "set": "delivery"
      },
      {
        "path": "resources.wealth",
        "add": 9
      },
      {
        "path": "resources.health",
        "add": -7
      },
      {
        "path": "resources.freedom",
        "add": -3
      },
      {
        "addTag": "platform_worker"
      },
      {
        "addTrait": "gig_adapted"
      }
    ]
  },
  {
    "id": "era_startup_pitch_deck",
    "title": "创业路演",
    "category": "career",
    "tags": [
      "startup"
    ],
    "yearRange": [
      2012,
      2020
    ],
    "ageRange": [
      22,
      40
    ],
    "currentRegions": {
      "provinceGroups": [
        "province.internet"
      ]
    },
    "maxOccurrences": 1,
    "baseWeight": 18,
    "weightModifiers": [
      {
        "hasTag": "startup_path",
        "multiply": 2
      },
      {
        "hasTrait": "digital_native",
        "multiply": 1.4
      },
      {
        "path": "attrs.charm",
        "gte": 6,
        "multiply": 1.3
      }
    ],
    "text": "你站在投影幕前讲增长曲线。台下的人点头时很像命运，摇头时也很像。",
    "effects": [
      {
        "path": "resources.achievement",
        "add": 14
      },
      {
        "path": "resources.wealth",
        "add": -6
      },
      {
        "path": "resources.reputation",
        "add": 8
      },
      {
        "addTag": "startup_pitch"
      },
      {
        "scheduleEvent": {
          "eventId": "era_startup_funding_or_bust",
          "delayYears": [
            1,
            3
          ],
          "weightMultiplier": 2,
          "probability": 0.7
        }
      }
    ]
  },
  {
    "id": "era_startup_funding_or_bust",
    "title": "融资或散伙",
    "category": "career",
    "tags": [
      "startup"
    ],
    "yearRange": [
      2013,
      2020
    ],
    "ageRange": [
      23,
      45
    ],
    "maxOccurrences": 1,
    "baseWeight": 8,
    "conditions": {
      "any": [
        {
          "hasTag": "startup_pitch"
        },
        {
          "hasTag": "startup_attempt"
        }
      ]
    },
    "text": "投资人最后没有把话说死，团队却先累垮了一半。创业像一张湿纸，梦想和债务都写在上面。",
    "effects": [
      {
        "path": "resources.wealth",
        "add": -10
      },
      {
        "path": "resources.achievement",
        "add": 8
      },
      {
        "path": "resources.happiness",
        "add": -8
      },
      {
        "addTag": "startup_bruise"
      }
    ]
  },
  {
    "id": "era_covid_home_silence",
    "title": "封在家里的春天",
    "category": "health",
    "yearRange": [
      2020,
      2020
    ],
    "ageRange": [
      0,
      100
    ],
    "priority": 70,
    "maxOccurrences": 1,
    "baseWeight": 100,
    "text": "街道安静得像被按下暂停。你每天看数字、量体温、等消息，春天隔着窗户慢慢走远。",
    "effects": [
      {
        "path": "resources.happiness",
        "add": -8
      },
      {
        "path": "resources.health",
        "add": -2
      },
      {
        "path": "relationships.family",
        "add": 4
      },
      {
        "addTag": "covid_memory"
      }
    ]
  },
  {
    "id": "era_remote_work_screen",
    "title": "远程会议",
    "category": "career",
    "yearRange": [
      2020,
      2020
    ],
    "ageRange": [
      22,
      60
    ],
    "currentRegions": {
      "cityTiers": [
        "city",
        "tier2",
        "tier1"
      ]
    },
    "baseWeight": 24,
    "conditions": {
      "any": [
        {
          "path": "career.field",
          "eq": "corporate"
        },
        {
          "hasTrait": "digital_native"
        },
        {
          "hasTrait": "networked_mind"
        }
      ]
    },
    "text": "会议搬进屏幕，客厅变成工位。你学会对着头像点头，也学会在静音里叹气。",
    "effects": [
      {
        "path": "career.level",
        "add": 3
      },
      {
        "path": "resources.freedom",
        "add": 3
      },
      {
        "path": "resources.happiness",
        "add": -3
      },
      {
        "addTag": "remote_work_memory"
      }
    ]
  },
  {
    "id": "era_wto_quality_check_line",
    "title": "外贸质检",
    "category": "career",
    "yearRange": [
      2002,
      2012
    ],
    "ageRange": [
      18,
      55
    ],
    "currentRegions": {
      "provinceGroups": [
        "province.coastal"
      ]
    },
    "conditions": {
      "any": [
        {
          "hasTag": "wto_wave_worker"
        },
        {
          "path": "career.field",
          "eq": "factory"
        }
      ]
    },
    "baseWeight": 22,
    "text": "外贸单要求严，质检表一项项压下来。你开始知道，世界市场不是远方的词，它会落在每一道针脚和每一个零件上。",
    "effects": [
      {
        "path": "career.level",
        "add": 4
      },
      {
        "path": "resources.achievement",
        "add": 3
      },
      {
        "path": "resources.health",
        "add": -2
      },
      {
        "addTag": "export_quality_memory"
      }
    ]
  },
  {
    "id": "era_taobao_small_shop",
    "title": "开网店",
    "category": "career",
    "yearRange": [
      2005,
      2016
    ],
    "ageRange": [
      18,
      50
    ],
    "conditions": {
      "any": [
        {
          "hasTrait": "market_sense"
        },
        {
          "hasTag": "getihu_path"
        },
        {
          "hasTrait": "digital_native"
        }
      ]
    },
    "baseWeight": 18,
    "text": "你试着开了个网店，拍照、上架、回消息、打包发货。小小的屏幕背后，生意变成了昼夜不分的敲击声。",
    "effects": [
      {
        "path": "career.status",
        "set": "self_employed"
      },
      {
        "path": "career.field",
        "set": "ecommerce"
      },
      {
        "path": "resources.wealth",
        "add": 8
      },
      {
        "path": "resources.health",
        "add": -3
      },
      {
        "addTag": "ecommerce_seller"
      }
    ]
  },
  {
    "id": "era_mobile_payment_first_time",
    "title": "第一次扫码付款",
    "category": "random",
    "yearRange": [
      2013,
      2020
    ],
    "ageRange": [
      12,
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
    "baseWeight": 24,
    "text": "你第一次用手机扫码付款，钱没有从手里递出去，却真的少了。生活忽然变轻，也变得更容易花出去。",
    "effects": [
      {
        "path": "resources.freedom",
        "add": 4
      },
      {
        "path": "resources.wealth",
        "add": -1
      },
      {
        "addTag": "mobile_payment_memory"
      }
    ]
  },
  {
    "id": "era_rent_shared_room",
    "title": "合租房间",
    "category": "wealth",
    "yearRange": [
      2005,
      2025
    ],
    "ageRange": [
      18,
      40
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
          "hasTag": "migrant_worker"
        },
        {
          "hasTag": "corporate_worker"
        },
        {
          "path": "career.status",
          "eq": "employed"
        }
      ]
    },
    "baseWeight": 26,
    "weightModifiers": [
      {
        "path": "environment.housingPressure",
        "gte": 7,
        "multiply": 1.5
      }
    ],
    "text": "你住进合租房，冰箱格子、卫生间时间和房租日期都要仔细计算。城市很大，你拥有的先是一张床。",
    "effects": [
      {
        "path": "resources.wealth",
        "add": -6
      },
      {
        "path": "resources.freedom",
        "add": -2
      },
      {
        "path": "relationships.friendship",
        "add": 2
      },
      {
        "addTag": "shared_rent_memory"
      }
    ]
  },
  {
    "id": "era_platform_algorithm_penalty",
    "title": "平台扣分",
    "category": "career",
    "yearRange": [
      2014,
      2025
    ],
    "ageRange": [
      18,
      60
    ],
    "conditions": {
      "any": [
        {
          "hasTag": "platform_worker"
        },
        {
          "path": "career.status",
          "eq": "gig_worker"
        },
        {
          "hasTrait": "gig_adapted"
        }
      ]
    },
    "baseWeight": 22,
    "text": "平台因为一次超时扣了分。你想解释天气、红灯和电梯，可系统只认一个数字。",
    "effects": [
      {
        "path": "career.income",
        "add": -5
      },
      {
        "path": "resources.happiness",
        "add": -5
      },
      {
        "addTag": "algorithm_penalty_memory"
      }
    ]
  },
  {
    "id": "era_online_class_child",
    "title": "孩子上网课",
    "category": "family",
    "yearRange": [
      2020,
      2022
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
    "baseWeight": 28,
    "text": "孩子在家上网课，屏幕、作业、摄像头和家务挤在同一张桌子上。你第一次发现，学校也能整个搬进家里。",
    "effects": [
      {
        "path": "relationships.family",
        "add": -2
      },
      {
        "path": "resources.happiness",
        "add": -4
      },
      {
        "path": "education.score",
        "add": 2
      },
      {
        "addTag": "online_class_parent_memory"
      }
    ]
  },
  {
    "id": "era_internet_layoff_notice",
    "title": "裁员通知",
    "category": "career",
    "yearRange": [
      2018,
      2025
    ],
    "ageRange": [
      24,
      45
    ],
    "conditions": {
      "any": [
        {
          "path": "career.field",
          "eq": "corporate"
        },
        {
          "hasTag": "corporate_worker"
        },
        {
          "hasTag": "startup_path"
        }
      ]
    },
    "baseWeight": 18,
    "text": "裁员通知传来得很快，会议室、表格和补偿方案把一段努力压缩成几行字。你走出门时，工牌还没来得及摘。",
    "effects": [
      {
        "path": "career.status",
        "set": "unemployed"
      },
      {
        "path": "career.income",
        "add": -12
      },
      {
        "path": "resources.happiness",
        "add": -8
      },
      {
        "addTag": "internet_layoff_memory"
      }
    ]
  }
];
