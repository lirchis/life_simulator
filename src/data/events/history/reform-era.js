// Auto-split event data. Keep events in this file focused on one era or theme.
export const historyReformEraEvents = [
  {
    "id": "era_reform_first_job_choice",
    "title": "第一份工作",
    "category": "career",
    "yearRange": [
      1978,
      1991
    ],
    "ageRange": [
      18,
      28
    ],
    "priority": 70,
    "maxOccurrences": 1,
    "baseWeight": 95,
    "conditions": {
      "none": [
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
    "text": "你开始面对第一份工作。单位还很重要，市场也开始冒头，时代像一扇半开的卷闸门。",
    "choices": [
      {
        "id": "state_unit",
        "text": "进国企或事业单位，先求稳",
        "resultText": "你进了单位。饭碗不算闪亮，但端起来让一家人安心。",
        "effects": [
          {
            "path": "career.status",
            "set": "employed"
          },
          {
            "path": "career.field",
            "set": "state_unit"
          },
          {
            "path": "career.income",
            "add": 11
          },
          {
            "path": "resources.wealth",
            "add": 7
          },
          {
            "path": "resources.freedom",
            "add": -4
          },
          {
            "addTrait": "institutional_adapted"
          },
          {
            "addTag": "danwei_memory"
          }
        ]
      },
      {
        "id": "township_business",
        "text": "去乡镇企业或小生意里试试",
        "resultText": "你走向更热闹也更不稳的地方。机器、账本和饭局一起教你市场的脾气。",
        "effects": [
          {
            "path": "career.status",
            "set": "employed"
          },
          {
            "path": "career.field",
            "set": "township_business"
          },
          {
            "path": "career.income",
            "add": 13
          },
          {
            "path": "resources.wealth",
            "add": 9
          },
          {
            "path": "resources.freedom",
            "add": 5
          },
          {
            "addTrait": "market_sense"
          },
          {
            "addTag": "early_market_worker"
          }
        ]
      },
      {
        "id": "study_or_exam",
        "text": "继续考试或学技术",
        "resultText": "你把眼前的收入往后放了放，想用证书、技术或学历换一条更长的路。",
        "effects": [
          {
            "path": "education.score",
            "add": 8
          },
          {
            "path": "resources.wealth",
            "add": -4
          },
          {
            "path": "resources.achievement",
            "add": 8
          },
          {
            "addTag": "skill_training_path"
          }
        ]
      }
    ]
  },
  {
    "id": "era_reform_open_market_stall",
    "title": "集市重新热闹",
    "category": "wealth",
    "yearRange": [
      1978,
      1985
    ],
    "ageRange": [
      12,
      65
    ],
    "maxOccurrences": 1,
    "priority": 45,
    "baseWeight": 58,
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
        "text": "集市上又有人吆喝，布、糖、零件和消息一起流动。你看见女人也能摆摊、算账、谈价钱，生活不只会被安排。"
      },
      {
        "text": "集市上又有人吆喝，布、糖、零件和消息一起流动。你发现生活不只会被安排，也会自己找路。"
      }
    ],
    "effects": [
      {
        "path": "resources.wealth",
        "add": 6
      },
      {
        "path": "resources.freedom",
        "add": 8
      },
      {
        "path": "resources.happiness",
        "add": 4
      },
      {
        "addTag": "reform_opening_witness"
      }
    ]
  },
  {
    "id": "era_household_responsibility",
    "title": "包产到户",
    "category": "family",
    "yearRange": [
      1978,
      1984
    ],
    "birthRegions": {
      "hukou": [
        "rural"
      ]
    },
    "ageRange": [
      8,
      70
    ],
    "maxOccurrences": 1,
    "priority": 50,
    "baseWeight": 65,
    "text": [
      {
        "conditions": {
          "all": [
            {
              "path": "birth.gender",
              "eq": "female"
            },
            {
              "path": "meta.age",
              "gte": 12
            }
          ]
        },
        "text": "地又分到各家手里。账多半由父亲去算，活却要全家一起干；你在田埂上明白，明天也会压到自己肩上。"
      },
      {
        "text": "地又分到各家手里。父亲蹲在田埂上算账，像重新把一家人的明天攥回掌心。"
      }
    ],
    "effects": [
      {
        "path": "resources.wealth",
        "add": 10
      },
      {
        "path": "resources.happiness",
        "add": 8
      },
      {
        "path": "resources.freedom",
        "add": 6
      },
      {
        "addTag": "household_responsibility_memory"
      }
    ]
  },
  {
    "id": "era_special_zone_story",
    "title": "南方特区的传闻",
    "category": "wealth",
    "yearRange": [
      1980,
      1992
    ],
    "ageRange": [
      16,
      45
    ],
    "birthRegions": {
      "provinces": [
        "guangdong",
        "fujian",
        "hainan",
        "guangxi",
        "hunan",
        "jiangxi",
        "sichuan"
      ]
    },
    "baseWeight": 26,
    "text": "亲戚从南方寄来照片，楼房和招牌像一夜长出来。你盯着照片看了很久，心里有东西开始松动。",
    "effects": [
      {
        "path": "resources.freedom",
        "add": 5
      },
      {
        "path": "attrs.luck",
        "add": 1
      },
      {
        "addTag": "coastal_dream"
      },
      {
        "addTimedModifier": {
          "id": "coastal_work_pull",
          "durationYears": 8,
          "target": {
            "eventTag": "coastal_work"
          },
          "multiply": 1.8
        }
      }
    ]
  },
  {
    "id": "era_tv_enters_home",
    "title": "第一台电视",
    "category": "random",
    "yearRange": [
      1982,
      1996
    ],
    "ageRange": [
      0,
      70
    ],
    "maxOccurrences": 1,
    "baseWeight": 30,
    "conditions": {
      "all": [
        {
          "path": "resources.wealth",
          "gte": 28
        }
      ]
    },
    "text": "家里买了第一台电视，邻居搬着凳子来看。雪花点很多，但世界从此有了更多入口。",
    "effects": [
      {
        "path": "resources.happiness",
        "add": 6
      },
      {
        "path": "relationships.friendship",
        "add": 5
      },
      {
        "addTrait": "mass_media_native"
      },
      {
        "addTag": "tv_child"
      }
    ]
  },
  {
    "id": "era_getihu_license",
    "title": "个体户执照",
    "category": "career",
    "yearRange": [
      1980,
      1995
    ],
    "ageRange": [
      20,
      50
    ],
    "maxOccurrences": 1,
    "baseWeight": 24,
    "weightModifiers": [
      {
        "hasTrait": "business_mind",
        "multiply": 1.8
      },
      {
        "hasTrait": "market_sense",
        "multiply": 1.8
      },
      {
        "path": "attrs.luck",
        "gte": 6,
        "multiply": 1.3
      }
    ],
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
        "text": "你领到一张个体户执照。薄薄一张纸压在柜台玻璃下，别人叫你会过日子，你知道那也是胆子。"
      },
      {
        "text": "你领到一张个体户执照。薄薄一张纸，压在柜台玻璃下，像给胆子盖了个章。"
      }
    ],
    "effects": [
      {
        "path": "career.status",
        "set": "self_employed"
      },
      {
        "path": "career.field",
        "set": "small_business"
      },
      {
        "path": "resources.wealth",
        "add": 12
      },
      {
        "path": "resources.freedom",
        "add": 10
      },
      {
        "addTag": "getihu_path"
      },
      {
        "addTrait": "risk_taker"
      }
    ]
  },
  {
    "id": "era_sea_business_choice",
    "title": "下海",
    "category": "career",
    "yearRange": [
      1988,
      1998
    ],
    "ageRange": [
      22,
      48
    ],
    "maxOccurrences": 1,
    "priority": 46,
    "baseWeight": 28,
    "conditions": {
      "any": [
        {
          "hasTrait": "business_mind"
        },
        {
          "hasTag": "coastal_dream"
        },
        {
          "path": "resources.wealth",
          "gte": 35
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
        "text": "有人劝你下海。岸上稳，海里乱，亲戚说女人别太冒险；可浪头上的金光不只照男人。"
      },
      {
        "text": "有人劝你下海。岸上稳，海里乱，但浪头上也许真有金光。"
      }
    ],
    "choices": [
      {
        "id": "jump_into_market",
        "text": "辞掉稳定，去市场里搏",
        "resultText": "你跳了下去。海水呛人，但你也第一次摸到了潮水的方向。",
        "effects": [
          {
            "path": "career.status",
            "set": "self_employed"
          },
          {
            "path": "career.field",
            "set": "trade"
          },
          {
            "path": "resources.wealth",
            "add": 18
          },
          {
            "path": "resources.freedom",
            "add": 12
          },
          {
            "path": "resources.happiness",
            "add": -3
          },
          {
            "addTag": "went_into_business"
          },
          {
            "addTrait": "risk_taker"
          }
        ]
      },
      {
        "id": "keep_iron_rice_bowl",
        "text": "留在单位，先吃稳饭",
        "resultText": "你留在岸上。风浪没直接打到你脸上，但远处的船越来越多。",
        "effects": [
          {
            "path": "resources.wealth",
            "add": 4
          },
          {
            "path": "resources.freedom",
            "add": -3
          },
          {
            "addTag": "kept_stable_job"
          }
        ]
      }
    ]
  },
  {
    "id": "era_stock_market_first_screen",
    "title": "股票屏幕",
    "category": "wealth",
    "yearRange": [
      1990,
      2001
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
    "maxOccurrences": 1,
    "baseWeight": 20,
    "text": "营业部里人头攒动，红绿数字跳得像心电图。你第一次发现，钱也会让人集体屏住呼吸。",
    "effects": [
      {
        "path": "resources.wealth",
        "add": 6
      },
      {
        "path": "resources.happiness",
        "add": -2
      },
      {
        "addTag": "stock_market_memory"
      }
    ]
  },
  {
    "id": "era_dagang_layoff_notice",
    "title": "下岗通知",
    "category": "career",
    "yearRange": [
      1994,
      2003
    ],
    "ageRange": [
      32,
      55
    ],
    "maxOccurrences": 1,
    "priority": 60,
    "baseWeight": 32,
    "conditions": {
      "any": [
        {
          "path": "career.field",
          "eq": "factory"
        },
        {
          "hasTag": "factory_worker"
        },
        {
          "hasTag": "state_worker_family"
        },
        {
          "hasTag": "worker_family"
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
        "text": "通知贴出来，名字排成一列。女工被劝回家、照顾老人孩子，曾经像铁一样的饭碗，摔在地上也会响。"
      },
      {
        "text": "通知贴出来，名字排成一列。曾经像铁一样的饭碗，原来摔在地上也会响。"
      }
    ],
    "effects": [
      {
        "path": "career.status",
        "set": "laid_off"
      },
      {
        "path": "career.income",
        "add": -18
      },
      {
        "path": "resources.wealth",
        "add": -18
      },
      {
        "path": "resources.happiness",
        "add": -12
      },
      {
        "addTag": "laid_off_shadow"
      },
      {
        "addTrait": "security_hungry"
      }
    ]
  },
  {
    "id": "era_coastal_factory_work",
    "title": "去沿海打工",
    "category": "migration",
    "tags": [
      "coastal_work"
    ],
    "yearRange": [
      1992,
      2012
    ],
    "ageRange": [
      16,
      42
    ],
    "birthRegions": {
      "hukou": [
        "rural"
      ]
    },
    "maxOccurrences": 1,
    "baseWeight": 36,
    "currentRegions": {
      "provinceGroups": [
        "province.region.west"
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
        "text": "你买了去沿海的硬座票。车厢里全是蛇皮袋和年轻人的沉默，家里人反复叮嘱你别信陌生人。"
      },
      {
        "text": "你买了去沿海的硬座票。车厢里全是蛇皮袋和年轻人的沉默，窗外的山一座座往后退。"
      }
    ],
    "effects": [
      {
        "path": "location.currentProvince",
        "set": "guangdong"
      },
      {
        "path": "location.currentCityTier",
        "set": "city"
      },
      {
        "path": "location.migratedTimes",
        "add": 1
      },
      {
        "path": "resources.wealth",
        "add": 14
      },
      {
        "path": "resources.health",
        "add": -5
      },
      {
        "addTag": "migrant_worker"
      },
      {
        "addTag": "coastal_worked"
      }
    ]
  },
  {
    "id": "era_spring_festival_train_ticket",
    "title": "春运车票",
    "category": "family",
    "yearRange": [
      1992,
      2020
    ],
    "ageRange": [
      18,
      60
    ],
    "baseWeight": 30,
    "conditions": {
      "any": [
        {
          "hasTag": "migrant_worker"
        },
        {
          "hasTag": "migrant"
        },
        {
          "path": "location.migratedTimes",
          "gte": 1
        }
      ]
    },
    "text": "你攥着一张回家的票，像攥着一年里最硬的一点盼头。人潮推着人潮，方向只有一个：回去。",
    "effects": [
      {
        "path": "relationships.family",
        "add": 6
      },
      {
        "path": "resources.happiness",
        "add": 4
      },
      {
        "path": "resources.wealth",
        "add": -2
      },
      {
        "addTag": "spring_festival_travel_memory"
      }
    ]
  },
  {
    "id": "era_internet_cafe_night",
    "title": "网吧通宵",
    "category": "random",
    "yearRange": [
      1998,
      2010
    ],
    "ageRange": [
      12,
      28
    ],
    "currentRegions": {
      "cityTiers": [
        "town",
        "county",
        "city",
        "tier2",
        "tier1"
      ]
    },
    "baseWeight": 34,
    "text": "网吧里烟味、泡面味和键盘声混在一起。凌晨三点，你在屏幕蓝光里短暂拥有了另一个宇宙。",
    "effects": [
      {
        "path": "resources.happiness",
        "add": 5
      },
      {
        "path": "education.score",
        "add": -2
      },
      {
        "path": "relationships.friendship",
        "add": 5
      },
      {
        "addTrait": "digital_native"
      },
      {
        "addTag": "internet_cafe_memory"
      }
    ]
  },
  {
    "id": "era_small_town_exam_path",
    "title": "小镇做题",
    "category": "school",
    "yearRange": [
      1995,
      2020
    ],
    "ageRange": [
      12,
      19
    ],
    "birthRegions": {
      "cityTiers": [
        "county",
        "town",
        "village"
      ]
    },
    "baseWeight": 35,
    "weightModifiers": [
      {
        "path": "attrs.intelligence",
        "gte": 6,
        "multiply": 1.5
      },
      {
        "path": "environment.educationPressure",
        "gte": 7,
        "multiply": 1.4
      },
      {
        "hasTrait": "exam_aptitude",
        "multiply": 1.6
      }
    ],
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
        "text": "你把很多黄昏都交给试卷。窗外的县城很小，题目像铁轨，也像一张能替你推开偏见的证明。"
      },
      {
        "text": "你把很多黄昏都交给试卷。窗外的县城很小，题目却像一节节通往远方的铁轨。"
      }
    ],
    "effects": [
      {
        "path": "education.score",
        "add": 10
      },
      {
        "path": "resources.happiness",
        "add": -5
      },
      {
        "path": "resources.achievement",
        "add": 6
      },
      {
        "addTag": "small_town_questioner"
      },
      {
        "addTrait": "pressure_trained"
      }
    ]
  },
  {
    "id": "era_college_expansion_notice",
    "title": "扩招之后",
    "category": "school",
    "yearRange": [
      1999,
      2008
    ],
    "ageRange": [
      17,
      22
    ],
    "maxOccurrences": 1,
    "baseWeight": 30,
    "conditions": {
      "all": [
        {
          "path": "education.score",
          "gte": 35
        }
      ]
    },
    "text": "大学扩招，录取线像松了一口气。你拿到通知书时，家里人把它翻来覆去看了好几遍。",
    "effects": [
      {
        "path": "education.level",
        "set": "college"
      },
      {
        "path": "resources.achievement",
        "add": 10
      },
      {
        "path": "resources.wealth",
        "add": -4
      },
      {
        "addTag": "college_expansion_generation"
      },
      {
        "addTag": "college"
      }
    ]
  },
  {
    "id": "era_rural_surplus_to_market",
    "title": "挑着余粮去卖",
    "category": "wealth",
    "yearRange": [
      1981,
      1988
    ],
    "birthRegions": {
      "hukou": [
        "rural"
      ]
    },
    "ageRange": [
      14,
      65
    ],
    "conditions": {
      "any": [
        {
          "hasTag": "household_responsibility_memory"
        },
        {
          "hasTag": "peasant_household"
        }
      ]
    },
    "baseWeight": 24,
    "text": "家里把一点余粮和土货挑到集上卖。称杆一抬一落，你第一次看见土地之外也有价钱和机会。",
    "effects": [
      {
        "path": "resources.wealth",
        "add": 7
      },
      {
        "path": "resources.freedom",
        "add": 3
      },
      {
        "addTag": "rural_market_memory"
      }
    ]
  },
  {
    "id": "era_getihu_license_window",
    "title": "办个体户执照",
    "category": "career",
    "yearRange": [
      1980,
      1992
    ],
    "ageRange": [
      18,
      55
    ],
    "conditions": {
      "none": [
        {
          "hasTag": "getihu_path"
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
        "text": "你站在窗口前打听个体户执照。有人说女人做买卖太抛头露面，你却更关心明天能不能多赚一块钱。"
      },
      {
        "text": "你站在窗口前打听个体户执照。章盖下去的时候，稳定和风险像两枚硬币一起落进口袋。"
      }
    ],
    "choices": [
      {
        "id": "open_small_stall",
        "text": "试着摆个小摊",
        "resultText": "你开始摆摊。天亮前进货，天黑后数钱，城市的缝隙里也能长出一条路。",
        "effects": [
          {
            "path": "career.status",
            "set": "self_employed"
          },
          {
            "path": "career.field",
            "set": "small_business"
          },
          {
            "path": "resources.wealth",
            "add": 8
          },
          {
            "path": "resources.freedom",
            "add": 7
          },
          {
            "addTag": "getihu_path"
          },
          {
            "addTrait": "market_sense"
          }
        ]
      },
      {
        "id": "keep_waiting",
        "text": "再观望一阵",
        "resultText": "你暂时没有下场。街上的叫卖声越来越熟，你知道机会还会来，也可能擦肩而过。",
        "effects": [
          {
            "path": "resources.happiness",
            "add": -1
          },
          {
            "addTag": "market_wait_and_see"
          }
        ]
      }
    ]
  },
  {
    "id": "era_southern_tour_fever",
    "title": "南方谈话后的热",
    "category": "career",
    "yearRange": [
      1992,
      1995
    ],
    "ageRange": [
      18,
      50
    ],
    "currentRegions": {
      "provinces": [
        "guangdong",
        "fujian",
        "hainan",
        "shanghai",
        "zhejiang",
        "jiangsu"
      ]
    },
    "baseWeight": 24,
    "weightModifiers": [
      {
        "hasTag": "coastal_dream",
        "multiply": 1.4
      },
      {
        "hasTrait": "risk_taker",
        "multiply": 1.5
      }
    ],
    "text": "南方的消息一阵阵传来，工地、厂房、公司牌子都像被太阳晒得发烫。你站在路口，觉得时代正在催人快走。",
    "effects": [
      {
        "path": "resources.freedom",
        "add": 6
      },
      {
        "path": "resources.achievement",
        "add": 4
      },
      {
        "addTag": "southern_tour_fever"
      }
    ]
  },
  {
    "id": "era_factory_girl_dormitory",
    "title": "厂妹宿舍",
    "category": "migration",
    "genders": [
      "female"
    ],
    "yearRange": [
      1988,
      2005
    ],
    "ageRange": [
      16,
      30
    ],
    "currentRegions": {
      "provinceGroups": [
        "province.coastal"
      ]
    },
    "conditions": {
      "any": [
        {
          "hasTag": "migrant_worker"
        },
        {
          "path": "career.field",
          "eq": "factory"
        }
      ]
    },
    "baseWeight": 28,
    "text": "你住进女工宿舍，上铺下铺挂满衣服和远方寄来的牵挂。机器声很硬，姐妹们夜里说话的声音却很软。",
    "effects": [
      {
        "path": "relationships.friendship",
        "add": 6
      },
      {
        "path": "resources.health",
        "add": -3
      },
      {
        "path": "resources.wealth",
        "add": 5
      },
      {
        "addTag": "factory_sisterhood"
      }
    ]
  },
  {
    "id": "era_temporary_residence_permit",
    "title": "暂住证",
    "category": "migration",
    "yearRange": [
      1985,
      2003
    ],
    "ageRange": [
      16,
      55
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
          "hasTag": "coastal_worked"
        },
        {
          "hasTrait": "floating_population"
        }
      ]
    },
    "baseWeight": 24,
    "text": "你去办暂住证，表格、照片和队伍把外地两个字写得很具体。城市接纳你的劳力，却不急着接纳你这个人。",
    "effects": [
      {
        "path": "resources.freedom",
        "add": -5
      },
      {
        "path": "resources.happiness",
        "add": -4
      },
      {
        "addTag": "temporary_residence_memory"
      }
    ]
  },
  {
    "id": "era_spring_festival_motorbike_return",
    "title": "骑摩托返乡",
    "category": "migration",
    "yearRange": [
      1995,
      2015
    ],
    "ageRange": [
      18,
      55
    ],
    "birthRegions": {
      "provinces": [
        "guangxi",
        "guangdong",
        "hunan",
        "jiangxi",
        "guizhou",
        "sichuan"
      ]
    },
    "conditions": {
      "any": [
        {
          "hasTag": "migrant_worker"
        },
        {
          "hasTag": "coastal_worked"
        }
      ]
    },
    "baseWeight": 18,
    "text": "春节前，你和一队人骑摩托往家赶。风钻进袖口，行李绑得很紧，回家的路长得像一场硬仗。",
    "effects": [
      {
        "path": "relationships.family",
        "add": 6
      },
      {
        "path": "resources.health",
        "add": -4
      },
      {
        "addTag": "motorbike_return_memory"
      }
    ]
  },
  {
    "id": "era_layoff_reemployment_market",
    "title": "再就业市场",
    "category": "career",
    "yearRange": [
      1996,
      2005
    ],
    "ageRange": [
      35,
      55
    ],
    "conditions": {
      "any": [
        {
          "hasTag": "laid_off_shadow"
        },
        {
          "hasTag": "laid_off_worker_family"
        },
        {
          "path": "career.field",
          "eq": "state_unit"
        }
      ]
    },
    "baseWeight": 22,
    "text": "你去再就业市场看岗位，纸牌上写着年龄、工资和要求。曾经稳定的履历忽然变轻了，你只能把自己重新介绍一遍。",
    "effects": [
      {
        "path": "career.income",
        "add": -4
      },
      {
        "path": "resources.happiness",
        "add": -6
      },
      {
        "path": "attrs.mental",
        "add": 1
      },
      {
        "addTag": "reemployment_market_memory"
      }
    ]
  }
];
