// Auto-split event data. Keep events in this file focused on one era or theme.
export const historyReformEraEvents = [
  {
    "id": "era_reform_first_job_choice",
    "title": "毕业后的去向",
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
      "all": [
        {
          "path": "career.jobsHeld",
          "eq": 0
        }
      ],
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
    "text": "你开始面对离校后的去向。单位还很重要，市场也开始冒头，时代像一扇半开的卷闸门。",
    "outcomes": [
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
    "currentRegions": {
      "cityTiers": ["village", "town", "county"]
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
    "lifetimeProbability": 0.4,
    "maxOccurrences": 1,
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
    "text": [
      {
        "conditions": {
          "all": [
            { "path": "meta.age", "lte": 3 }
          ]
        },
        "text": "家里买回第一台电视，大人把你抱到屏幕前。你只会追着亮处和声音转头；至于全家怎样调天线、招呼邻居，是他们后来讲给你听的。"
      },
      {
        "conditions": {
          "all": [
            { "path": "meta.age", "gte": 4 },
            { "path": "meta.age", "lte": 14 }
          ]
        },
        "text": "家里买回第一台电视，你早早坐到屏幕前。雪花很多，节目时间却记得很清楚；从前只在图画里的地方，忽然会在晚饭后自己出现。"
      },
      {
        "conditions": {
          "all": [
            { "path": "location.currentCityTier", "in": ["village", "town"] }
          ]
        },
        "text": "村里少有的电视搬进你家后，邻居自带板凳，院子一到晚上便坐满。天线要有人在屋顶慢慢转，屋里的人齐声喊‘有了’，看电视也成了一项集体协作。"
      },
      {
        "text": "家里买了第一台电视，邻居和亲戚陆续过来看。你不时起身调天线，雪花点仍在屏幕上游动；世界的入口不算清楚，却从此按节目表准时抵达客厅。"
      }
    ],
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
    "outcomes": [
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
    "maxOccurrences": 1,
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
    "text": [
      {
        "conditions": {
          "all": [
            { "hasTag": "migrant_worker" }
          ]
        },
        "text": "你在售票窗外排了很久，终于买到一张硬座或站票。蛇皮袋里装着给家人的衣物和糖，车厢里几乎转不开身；一年挣来的体面，常先要经得住这趟拥挤。"
      },
      {
        "conditions": {
          "all": [
            { "path": "relationships.children", "gte": 1 }
          ]
        },
        "text": "你带着孩子挤上春运列车，行李架塞满，热水口前也排队。孩子问还有多久到家，你看一眼表，又看一眼窗外，知道老人已经把这班车的时刻念了许多遍。"
      },
      {
        "conditions": {
          "all": [
            { "path": "meta.currentYear", "lte": 2002 }
          ]
        },
        "text": "售票窗口外的队伍拐过几道弯，你把车次和日期抄在纸上，轮到时只剩一张慢车票。回家的路没有因多转几次车变短，家里却一直按你报过的日子留着饭。"
      },
      {
        "conditions": {
          "all": [
            { "path": "meta.age", "lte": 30 }
          ]
        },
        "text": "你第一次独自挤春运，包里塞着不贵却占地方的年货。检票一开，人群把你向前推；真正坐稳以后，你才敢给家里捎一句已经上车。"
      },
      {
        "conditions": {
          "all": [
            { "path": "meta.age", "gte": 46 }
          ]
        },
        "text": "这些年你已经熟悉怎样少带一件行李、早到一会儿，仍不熟悉人群怎样把腰和耐心一起挤薄。车开以后，你把座位让给更老的人，自己扶着椅背站了一段。"
      },
      {
        "conditions": {
          "all": [
            { "path": "resources.wealth", "lte": 38 }
          ]
        },
        "text": "你算过几种车次，最后选了最便宜也最慢的一张票。候车室里，行李既是年货也是枕头；回家这件事很贵，人们仍一年年想办法支付。"
      },
      {
        "text": "你几次托人、排队，终于攥住一张回家的车票。候车室里的人睡在行李旁，广播一响便同时起身；这一年走过很多方向，到春节才有一个方向被直接叫作回去。"
      }
    ],
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
    "maxOccurrences": 1,
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
    "lifetimeProbability": 0.48,
    "maxOccurrences": 1,
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
    "continuity": {
      "education": {
        "action": "enroll",
        "level": "college",
        "track": "academic",
        "mode": "full_time",
        "durationYears": 4,
        "allowTransfer": true,
        "completeCurrentOnEnroll": true
      }
    },
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
    "maxOccurrences": 1,
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
    "maxOccurrences": 1,
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
    "outcomes": [
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
    "lifetimeProbability": 0.42,
    "maxOccurrences": 1,
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
  },
  {
    id: "era_reform_field_contract_thumbprint",
    title: "田埂上的手印",
    category: "family",
    yearRange: [1979, 1985],
    ageRange: [18, 70],
    currentRegions: { hukou: ["rural"], cityTiers: ["village", "town"] },
    maxOccurrences: 1,
    priority: 48,
    baseWeight: 38,
    text: "队里把田块、产量和责任写到纸上，各家在煤油灯下按手印。你分到的不只是几垄地：收成好坏终于会沿着同一条田埂，直接走进自家的饭锅。",
    effects: [
      { path: "resources.freedom", add: 7 },
      { path: "resources.wealth", add: 5 },
      { path: "relationships.family", add: 3 },
      { addTag: "household_contract_witness" },
      { addTag: "peasant_household" }
    ]
  },
  {
    id: "era_reform_fertilizer_queue",
    title: "排队等化肥",
    category: "wealth",
    yearRange: [1981, 1989],
    ageRange: [18, 68],
    currentRegions: { hukou: ["rural"], cityTiers: ["village", "town", "county"] },
    maxOccurrences: 1,
    baseWeight: 27,
    text: "供销社说化肥快到了，你天不亮便扛着蛇皮袋去排队。队伍从沉默排到打趣，庄稼还没长，消息先长了三茬；轮到你时，肩膀和耐心都已称过斤两。",
    effects: [
      { path: "resources.health", add: -2 },
      { path: "resources.wealth", add: 4 },
      { path: "relationships.friendship", add: 2 },
      { addTag: "rural_supply_queue_memory" }
    ]
  },
  {
    id: "era_reform_woman_pig_account",
    title: "猪圈也是账本",
    category: "family",
    genders: ["female"],
    yearRange: [1982, 1994],
    ageRange: [18, 58],
    currentRegions: { hukou: ["rural"], cityTiers: ["village", "town"] },
    maxOccurrences: 1,
    baseWeight: 25,
    text: "你把灶边的剩食拌进猪食，又在墙上记下饲料和集市价。家里称这是顺手做的副业，可孩子的书本、过年的新布和一笔应急钱，都从你的猪圈里慢慢拱了出来。",
    effects: [
      { path: "resources.wealth", add: 8 },
      { path: "resources.health", add: -3 },
      { path: "resources.achievement", add: 3 },
      { addTag: "rural_woman_household_economy" },
      { addTrait: "market_sense" }
    ]
  },
  {
    id: "era_reform_township_factory_whistle",
    title: "乡镇厂的汽笛",
    category: "career",
    yearRange: [1984, 1996],
    ageRange: [18, 45],
    currentRegions: { hukou: ["rural"], cityTiers: ["town", "county"] },
    maxOccurrences: 1,
    baseWeight: 34,
    conditions: {
      none: [
        { path: "career.status", eq: "self_employed" },
        { path: "career.field", eq: "state_unit" }
      ]
    },
    text: "镇边新厂招人，你从锄头旁走到车床前。工牌把农民和工人暂时别在同一件上衣上：白天赶订单，农忙仍得回田，两个钟点表一起支配你的腰。",
    effects: [
      { path: "career.status", set: "employed" },
      { path: "career.field", set: "township_enterprise" },
      { path: "career.income", add: 11 },
      { path: "resources.wealth", add: 9 },
      { path: "resources.health", add: -3 },
      { addTag: "township_enterprise_worker" }
    ]
  },
  {
    id: "era_reform_township_woman_accountant",
    title: "算盘旁的女会计",
    category: "career",
    genders: ["female"],
    yearRange: [1986, 1998],
    ageRange: [20, 48],
    currentRegions: { cityTiers: ["town", "county"] },
    maxOccurrences: 1,
    baseWeight: 20,
    conditions: {
      any: [
        { path: "career.field", eq: "township_enterprise" },
        { hasTag: "township_enterprise_family" },
        { path: "education.score", gte: 35 }
      ]
    },
    text: "厂里把工资册交给你，几个师傅先问女人能不能管账。月底你把错一分钱的账重新拨平，算盘珠响得又脆又稳；后来他们不再问，只在领钱时排得格外整齐。",
    effects: [
      { path: "career.field", set: "township_accounting" },
      { path: "career.level", add: 6 },
      { path: "resources.achievement", add: 7 },
      { path: "resources.reputation", add: 4 },
      { addTag: "township_woman_accountant" }
    ]
  },
  {
    id: "era_reform_township_export_sample",
    title: "一只寄走的样品",
    category: "career",
    yearRange: [1988, 1999],
    ageRange: [20, 58],
    currentRegions: {
      provinces: ["jiangsu", "zhejiang", "fujian", "shandong", "guangdong"],
      cityTiers: ["town", "county", "city"]
    },
    maxOccurrences: 1,
    baseWeight: 22,
    conditions: {
      any: [
        { path: "career.field", eq: "township_enterprise" },
        { path: "career.field", eq: "factory" },
        { hasTag: "township_enterprise_worker" }
      ]
    },
    text: [
      {
        conditions: { all: [{ path: "location.currentCityTier", in: ["town", "county"] }] },
        text: "外地客商带走一只样品，要求针脚、尺寸和交期全照单执行。你们第一次明白，远处的订单不会体谅停电、农忙或机器闹脾气；市场把世界拉近，也把误差压得更窄。"
      },
      {
        text: "外地客商带走一只样品，要求针脚、尺寸和交期全照单执行。你们第一次明白，远处的订单不会体谅停电、缺料或机器闹脾气；市场把世界拉近，也把误差压得更窄。"
      }
    ],
    effects: [
      { path: "career.income", add: 7 },
      { path: "resources.wealth", add: 7 },
      { path: "resources.happiness", add: -2 },
      { path: "resources.achievement", add: 5 },
      { addTag: "township_order_discipline" }
    ]
  },
  {
    id: "era_reform_village_motor_pump",
    title: "电泵第一次转起来",
    category: "wealth",
    yearRange: [1983, 1993],
    ageRange: [15, 70],
    currentRegions: { hukou: ["rural"], cityTiers: ["village", "town"] },
    maxOccurrences: 1,
    baseWeight: 24,
    text: "村里的电泵第一次把水送上高田，电线抖着，围观的人比秧苗还密。你少挑了几十担水，却也开始担心电费、零件和下一次停电；省下来的力气，从来不是凭空来的。",
    effects: [
      { path: "resources.health", add: 4 },
      { path: "resources.wealth", add: 4 },
      { path: "resources.happiness", add: 3 },
      { addTag: "rural_mechanization_memory" }
    ]
  },
  {
    id: "era_reform_unit_bonus_envelope",
    title: "奖金装进信封",
    category: "career",
    yearRange: [1984, 1992],
    ageRange: [20, 60],
    currentRegions: { cityTiers: ["town", "county", "city", "tier2", "tier1"] },
    maxOccurrences: 1,
    baseWeight: 28,
    conditions: {
      any: [
        { path: "career.field", eq: "state_unit" },
        { path: "career.field", eq: "factory" },
        { hasTag: "state_worker_family" },
        { hasTag: "factory_worker" }
      ]
    },
    text: "单位开始按产量和表现发奖金，信封厚薄不再完全一样。你在食堂听见新的比较，也看见老师傅把不满咽进汤里；多劳多得像一阵新风，先吹动了每个人的目光。",
    effects: [
      { path: "career.income", add: 5 },
      { path: "resources.wealth", add: 6 },
      { path: "relationships.friendship", add: -2 },
      { addTag: "unit_bonus_memory" }
    ]
  },
  {
    id: "era_reform_unit_housing_scoreboard",
    title: "分房计分表",
    category: "family",
    yearRange: [1979, 1994],
    ageRange: [25, 58],
    currentRegions: { cityTiers: ["town", "county", "city", "tier2", "tier1"] },
    maxOccurrences: 1,
    baseWeight: 26,
    conditions: {
      any: [
        { path: "career.field", eq: "state_unit" },
        { hasTag: "state_worker_family" },
        { hasTag: "worker_family" },
        { hasTag: "danwei_memory" }
      ]
    },
    text: "分房名单贴出来，工龄、职称、人口和困难程度都换成了分数。你们搬进一间带水泥地的新屋，厨房要共用，墙薄得连邻居咳嗽都像在发表意见，但钥匙仍被全家传着看。",
    effects: [
      { path: "resources.wealth", add: 9 },
      { path: "relationships.family", add: 7 },
      { path: "resources.freedom", add: -2 },
      { addTag: "unit_housing_memory" }
    ]
  },
  {
    id: "era_reform_factory_lunchbox",
    title: "铝饭盒排成一列",
    category: "career",
    yearRange: [1978, 1991],
    ageRange: [18, 60],
    currentRegions: { cityTiers: ["town", "county", "city", "tier2", "tier1"] },
    maxOccurrences: 1,
    baseWeight: 24,
    conditions: {
      any: [
        { path: "career.field", eq: "factory" },
        { path: "career.field", eq: "state_unit" },
        { hasTag: "factory_worker" }
      ]
    },
    text: "午休铃响，铝饭盒在蒸笼边排成一列。谁家炒了肉不用揭盖也瞒不住，大家笑着交换咸菜和厂里的消息；流水线把人分在不同工位，饭桌又把一天重新拼起来。",
    effects: [
      { path: "relationships.friendship", add: 6 },
      { path: "resources.happiness", add: 3 },
      { addTag: "factory_canteen_memory" }
    ]
  },
  {
    id: "era_reform_factory_stopwatch",
    title: "秒表来到车间",
    category: "career",
    yearRange: [1986, 1997],
    ageRange: [20, 58],
    currentRegions: { cityTiers: ["town", "county", "city", "tier2", "tier1"] },
    maxOccurrences: 1,
    baseWeight: 21,
    conditions: {
      any: [
        { path: "career.field", eq: "factory" },
        { path: "career.field", eq: "state_unit" },
        { hasTag: "factory_worker" },
        { hasTag: "township_enterprise_worker" }
      ]
    },
    text: "车间开始核工时、算损耗，班组长拿着秒表在机器旁站了一天。过去凭经验留下的喘息被一格格量出来，你的工资可能多一点，胳膊却先知道了效率是什么意思。",
    effects: [
      { path: "career.income", add: 4 },
      { path: "resources.wealth", add: 4 },
      { path: "resources.health", add: -4 },
      { path: "resources.happiness", add: -3 },
      { addTag: "factory_efficiency_pressure" }
    ]
  },
  {
    id: "era_reform_northeast_wage_arrears",
    title: "工资表停在墙上",
    category: "career",
    yearRange: [1995, 2002],
    ageRange: [30, 58],
    currentRegions: {
      provinces: ["liaoning", "jilin", "heilongjiang"],
      cityTiers: ["town", "county", "city", "tier2"]
    },
    maxOccurrences: 1,
    baseWeight: 27,
    conditions: {
      any: [
        { path: "career.field", eq: "factory" },
        { path: "career.field", eq: "state_unit" },
        { hasTag: "factory_worker" },
        { hasTag: "state_worker_family" }
      ]
    },
    text: "工资表照旧贴着，钱却一月月没到账。冬天先从暖气片的凉意里进屋，你们把买煤、看病和孩子学费重新排序；一个厂的困难，最后都要在各家的饭桌上逐项削减。",
    effects: [
      { path: "career.income", add: -10 },
      { path: "resources.wealth", add: -11 },
      { path: "resources.happiness", add: -7 },
      { path: "relationships.family", add: -2 },
      { addTag: "wage_arrears_memory" }
    ]
  },
  {
    id: "era_reform_northeast_heating_after_layoff",
    title: "暖气费的冬天",
    category: "family",
    yearRange: [1996, 2005],
    ageRange: [35, 62],
    currentRegions: { provinces: ["liaoning", "jilin", "heilongjiang"] },
    maxOccurrences: 1,
    baseWeight: 24,
    conditions: {
      any: [
        { path: "career.status", eq: "laid_off" },
        { hasTag: "laid_off_shadow" },
        { hasTag: "laid_off_worker_family" },
        { hasTag: "wage_arrears_memory" }
      ]
    },
    text: "离开单位后，你才发现暖气费、医药费和孩子托管费都曾藏在那只饭碗后面。窗缝结霜，全家挤在一间屋里睡；所谓转型不是一个词，而是每张票据忽然认得你的姓名。",
    effects: [
      { path: "resources.wealth", add: -9 },
      { path: "resources.health", add: -4 },
      { path: "relationships.family", add: 4 },
      { addTag: "post_unit_welfare_gap" }
    ]
  },
  {
    id: "era_reform_layoff_night_market_stall",
    title: "夜市重新开张",
    category: "career",
    yearRange: [1996, 2005],
    ageRange: [32, 58],
    currentRegions: { cityTiers: ["town", "county", "city", "tier2", "tier1"] },
    maxOccurrences: 1,
    baseWeight: 30,
    conditions: {
      any: [
        { path: "career.status", eq: "laid_off" },
        { hasTag: "laid_off_shadow" },
        { hasTag: "reemployment_market_memory" }
      ]
    },
    text: "你借来一辆三轮车，在夜市卖袜子、熟食或修理小件。头几天碰见旧同事还有些尴尬，后来忙得顾不上脸面；尊严没有丢，只是脱下工装，站到了风口里。",
    effects: [
      { path: "career.status", set: "self_employed" },
      { path: "career.field", set: "small_business" },
      { path: "career.income", add: 8 },
      { path: "resources.wealth", add: 6 },
      { path: "resources.freedom", add: 4 },
      { addTag: "laid_off_self_employment" }
    ]
  },
  {
    id: "era_reform_getihu_purchase_train",
    title: "坐夜车去进货",
    category: "wealth",
    yearRange: [1983, 1995],
    ageRange: [20, 55],
    maxOccurrences: 1,
    baseWeight: 28,
    conditions: {
      any: [
        { path: "career.status", eq: "self_employed" },
        { path: "career.field", eq: "small_business" },
        { hasTag: "getihu_path" },
        { hasTag: "getihu_family" }
      ]
    },
    text: "你把现金缝进内衣夹层，坐夜车去外地进货。车站、招待所和批发市场连成一条不睡觉的路；货还没卖出去，胆量、眼力和防偷的本事已经先交了学费。",
    effects: [
      { path: "resources.wealth", add: 9 },
      { path: "resources.health", add: -4 },
      { path: "resources.freedom", add: 4 },
      { addTrait: "market_sense" },
      { addTag: "wholesale_purchase_route" }
    ]
  },
  {
    id: "era_reform_counter_bargaining",
    title: "柜台前的还价",
    category: "wealth",
    yearRange: [1982, 1999],
    ageRange: [18, 60],
    maxOccurrences: 1,
    baseWeight: 25,
    conditions: {
      any: [
        { path: "career.status", eq: "self_employed" },
        { path: "career.field", eq: "small_business" },
        { hasTag: "getihu_path" },
        { hasTag: "laid_off_self_employment" }
      ]
    },
    text: "顾客把一毛钱的差价谈成了一场外交，你嘴硬说真没利润，手却已经去拿包装纸。一天结束，嗓子哑了，账本也厚了一页；买卖教人的第一课，是笑着守住很薄的边界。",
    effects: [
      { path: "resources.wealth", add: 5 },
      { path: "relationships.friendship", add: 3 },
      { path: "attrs.charm", add: 1 },
      { addTag: "counter_bargaining_memory" }
    ]
  },
  {
    id: "era_reform_getihu_fee_ledger",
    title: "账本夹着缴费单",
    category: "wealth",
    yearRange: [1987, 1999],
    ageRange: [22, 60],
    maxOccurrences: 1,
    baseWeight: 23,
    conditions: {
      any: [
        { path: "career.status", eq: "self_employed" },
        { path: "career.field", eq: "small_business" },
        { hasTag: "getihu_path" },
        { hasTag: "first_rich_family" }
      ]
    },
    text: "你把税票、摊位费和进货欠条夹进同一本账。柜台外看着热闹，柜台后每一笔都有去处；直到算完最后一行，你才知道今天赚的是钱，还是只赚了继续开门的资格。",
    effects: [
      { path: "resources.wealth", add: -3 },
      { path: "education.score", add: 2 },
      { path: "attrs.mental", add: 1 },
      { addTag: "small_business_ledger" }
    ]
  },
  {
    id: "era_reform_shop_landline",
    title: "店里装了座机",
    category: "career",
    yearRange: [1993, 2001],
    ageRange: [22, 60],
    currentRegions: { cityTiers: ["town", "county", "city", "tier2", "tier1"] },
    maxOccurrences: 1,
    baseWeight: 18,
    conditions: {
      all: [
        { path: "resources.wealth", gte: 38 },
        {
          any: [
            { path: "career.status", eq: "self_employed" },
            { path: "career.field", eq: "small_business" },
            { hasTag: "getihu_path" }
          ]
        }
      ]
    },
    text: "店里装上座机，号码被你认真印在纸袋上。铃一响，全屋亲戚都以为大生意来了，接起才发现是邻铺借秤，大家先乐了；可从此订单真能穿过几条街，直接找到你。",
    effects: [
      { path: "career.income", add: 5 },
      { path: "resources.wealth", add: 4 },
      { path: "resources.happiness", add: 3 },
      { addTag: "shop_landline_memory" }
    ]
  },
  {
    id: "era_reform_wenzhou_family_workshop",
    title: "楼下作坊，楼上睡觉",
    category: "career",
    yearRange: [1984, 1997],
    ageRange: [18, 58],
    currentRegions: { provinces: ["zhejiang"], cityTiers: ["town", "county", "city"] },
    maxOccurrences: 1,
    baseWeight: 25,
    conditions: {
      any: [
        { path: "career.status", eq: "self_employed" },
        { hasTag: "getihu_family" },
        { hasTag: "first_rich_family" },
        { hasTrait: "business_mind" }
      ]
    },
    text: "你家楼下摆机器，楼上铺床，亲戚按工序围着一双鞋或一个开关转。饭点就是交班，孩子在纸箱间写作业；家庭成了最便宜也最难下班的工厂。",
    effects: [
      { path: "career.status", set: "self_employed" },
      { path: "career.field", set: "family_workshop" },
      { path: "resources.wealth", add: 13 },
      { path: "resources.health", add: -5 },
      { path: "relationships.family", add: -2 },
      { addTag: "family_workshop_path" }
    ]
  },
  {
    id: "era_reform_hainan_property_receipt",
    title: "海南的一张收据",
    category: "wealth",
    yearRange: [1992, 1995],
    ageRange: [24, 58],
    currentRegions: { provinces: ["hainan", "guangdong"] },
    maxOccurrences: 1,
    baseWeight: 16,
    conditions: {
      any: [
        { path: "resources.wealth", gte: 45 },
        { hasTrait: "risk_taker" },
        { hasTag: "went_into_business" },
        { hasTag: "first_rich_family" }
      ]
    },
    text: "朋友拿来一张海南项目的收据，地块在地图上比在现实里清楚。几个月里价格和酒桌上的胆气一起上涨，随后风向骤变；你终于明白，纸面财富跑得最快，回头时也最不等人。",
    effects: [
      { path: "resources.wealth", add: -9 },
      { path: "resources.happiness", add: -5 },
      { path: "attrs.mental", add: 1 },
      { addTag: "hainan_bubble_memory" }
    ]
  },
  {
    id: "era_reform_shenzhen_border_pass",
    title: "关口检查边防证",
    category: "migration",
    yearRange: [1984, 1999],
    ageRange: [17, 50],
    currentRegions: { provinces: ["guangdong"], cityTiers: ["city", "tier2", "tier1"] },
    maxOccurrences: 1,
    baseWeight: 24,
    conditions: {
      any: [
        { hasTag: "migrant_worker" },
        { hasTag: "coastal_worked" },
        { path: "location.migratedTimes", gte: 1 }
      ]
    },
    text: "过关口时，你把边防证、暂住材料和车票叠在一起递出去。高楼就在不远处，进入这座新城却要先证明自己从哪里来；证件盖章以后，你才被允许继续追赶它的速度。",
    effects: [
      { path: "resources.freedom", add: -3 },
      { path: "resources.achievement", add: 3 },
      { addTag: "shenzhen_border_pass_memory" }
    ]
  },
  {
    id: "era_reform_labor_broker_departure",
    title: "跟着老乡上车",
    category: "migration",
    yearRange: [1987, 1997],
    ageRange: [17, 40],
    currentRegions: {
      provinces: ["sichuan", "chongqing", "hunan", "hubei", "jiangxi", "anhui", "henan", "guangxi", "guizhou"],
      hukou: ["rural"],
      cityTiers: ["village", "town", "county"]
    },
    maxOccurrences: 1,
    baseWeight: 31,
    conditions: {
      none: [
        { hasTag: "migrant_worker" },
        { hasTag: "coastal_worked" }
      ]
    },
    text: "村里先出去的老乡带回招工消息，你把被褥塞进编织袋，跟着一串熟人和半熟人上车。父母不知道厂名怎么写，只反复记住了一个车站；你的第一份远方，从来信地址开始。",
    effects: [
      { path: "location.currentProvince", set: "guangdong" },
      { path: "location.currentCityTier", set: "city" },
      { path: "location.migratedTimes", add: 1 },
      { path: "career.status", set: "employed" },
      { path: "career.field", set: "factory" },
      { path: "resources.wealth", add: 8 },
      { path: "relationships.family", add: -4 },
      { addTag: "migrant_worker" },
      { addTag: "coastal_worked" }
    ]
  },
  {
    id: "era_reform_pearl_river_night_shift",
    title: "珠江边的夜班",
    category: "career",
    yearRange: [1988, 2002],
    ageRange: [17, 42],
    currentRegions: { provinces: ["guangdong"], cityTiers: ["town", "county", "city", "tier2", "tier1"] },
    maxOccurrences: 1,
    baseWeight: 31,
    conditions: {
      any: [
        { path: "career.field", eq: "factory" },
        { hasTag: "migrant_worker" },
        { hasTag: "factory_sisterhood" },
        { hasTag: "coastal_worked" }
      ]
    },
    text: "夜班把窗外的霓虹和车间的白炽灯接在一起。打卡机比门卫更快认得你，流水线却不记得谁刚发烧、谁收到了家书；清晨走出厂门时，你的工资正在增长，影子却轻得发飘。",
    effects: [
      { path: "career.income", add: 8 },
      { path: "resources.wealth", add: 8 },
      { path: "resources.health", add: -7 },
      { path: "resources.happiness", add: -3 },
      { addTag: "pearl_river_night_shift" }
    ]
  },
  {
    id: "era_reform_construction_bunk",
    title: "脚手架下的通铺",
    category: "career",
    genders: ["male"],
    yearRange: [1988, 2003],
    ageRange: [18, 48],
    currentRegions: { cityTiers: ["city", "tier2", "tier1"] },
    maxOccurrences: 1,
    baseWeight: 23,
    conditions: {
      any: [
        { hasTag: "migrant_worker" },
        { path: "career.field", eq: "manual_worker" },
        { path: "career.field", eq: "construction" },
        { hasTrait: "floating_population" }
      ]
    },
    text: "你在脚手架上砌起别人将住进去的房子，晚上却和十几个人睡在工棚通铺。城市每天往高处长，你的住址跟着工地移动；只有安全帽内沿的汗渍，一层层留得很牢。",
    effects: [
      { path: "career.field", set: "construction" },
      { path: "career.income", add: 7 },
      { path: "resources.wealth", add: 6 },
      { path: "resources.health", add: -6 },
      { addTag: "construction_migrant" }
    ]
  },
  {
    id: "era_reform_domestic_worker_key",
    title: "雇主家的钥匙",
    category: "career",
    genders: ["female"],
    yearRange: [1988, 2003],
    ageRange: [18, 50],
    currentRegions: { cityTiers: ["city", "tier2", "tier1"] },
    maxOccurrences: 1,
    baseWeight: 24,
    conditions: {
      any: [
        { hasTag: "migrant_worker" },
        { path: "career.field", eq: "domestic_work" },
        { hasTrait: "floating_population" },
        { hasTag: "low_resource_family" }
      ]
    },
    text: "雇主把家门钥匙交给你，却把抽屉和冰箱里的数量记得很清。你替另一户人家做饭、照顾老人和孩子，自己的家只能靠信和汇款维系；信任给了一半，劳动却要做得完整。",
    effects: [
      { path: "career.status", set: "employed" },
      { path: "career.field", set: "domestic_work" },
      { path: "career.income", add: 6 },
      { path: "resources.wealth", add: 5 },
      { path: "resources.happiness", add: -4 },
      { addTag: "domestic_worker_memory" }
    ]
  },
  {
    id: "era_reform_post_office_remittance",
    title: "邮局汇款单",
    category: "family",
    yearRange: [1988, 2007],
    ageRange: [18, 58],
    maxOccurrences: 1,
    baseWeight: 29,
    conditions: {
      any: [
        { hasTag: "migrant_worker" },
        { hasTag: "coastal_worked" },
        { hasTag: "construction_migrant" },
        { path: "location.migratedTimes", gte: 1 }
      ]
    },
    text: "发薪后你去邮局填汇款单，金额写得比家书工整。手续费让你心疼了一下，想到家里要买种子、药和课本，又把数字重描一遍；钱先替你回到了故乡。",
    effects: [
      { path: "resources.wealth", add: -3 },
      { path: "relationships.family", add: 8 },
      { path: "resources.happiness", add: 3 },
      { addTag: "postal_remittance_memory" }
    ]
  },
  {
    id: "era_reform_uncontracted_injury",
    title: "没有写下来的工伤",
    category: "health",
    yearRange: [1990, 2007],
    ageRange: [18, 55],
    currentRegions: { cityTiers: ["town", "county", "city", "tier2", "tier1"] },
    maxOccurrences: 1,
    priority: 42,
    baseWeight: 18,
    conditions: {
      any: [
        { hasTag: "migrant_worker" },
        { hasTag: "construction_migrant" },
        { path: "career.field", eq: "factory" },
        { path: "career.field", eq: "construction" }
      ]
    },
    text: "机器或脚手架伤了你，老板先问能不能私下解决。没有正式合同，责任像地上的油一样被几双鞋来回踩散；你拿到一笔不够久养的补偿，也第一次知道身体会替制度缺口留疤。",
    effects: [
      { path: "resources.health", add: -13 },
      { path: "resources.wealth", add: -7 },
      { path: "resources.happiness", add: -7 },
      { addTrait: "chronic_condition" },
      { addTag: "uncontracted_injury_memory" }
    ]
  },
  {
    id: "era_reform_migrant_child_school_fee",
    title: "借读费收据",
    category: "family",
    yearRange: [1994, 2007],
    ageRange: [25, 48],
    currentRegions: { cityTiers: ["county", "city", "tier2", "tier1"] },
    maxOccurrences: 1,
    baseWeight: 22,
    conditions: {
      all: [
        { path: "relationships.children", gte: 1 },
        {
          any: [
            { hasTag: "migrant_worker" },
            { hasTag: "coastal_worked" },
            { path: "location.migratedTimes", gte: 1 }
          ]
        }
      ]
    },
    text: "你拿着户口材料去给孩子报名，窗口又开出一张借读费收据。孩子已经会说本地口音，你却仍被表格归在外面；你把几个月省下的钱交进去，只求课桌别再追问来处。",
    effects: [
      { path: "resources.wealth", add: -8 },
      { path: "relationships.family", add: 5 },
      { path: "resources.happiness", add: -3 },
      { addTag: "migrant_child_schooling_memory" }
    ]
  },
  {
    id: "era_reform_gaokao_review_sheets",
    title: "借来的复习资料",
    category: "school",
    yearRange: [1978, 1984],
    ageRange: [17, 30],
    maxOccurrences: 1,
    priority: 44,
    baseWeight: 32,
    conditions: {
      all: [
        { path: "education.score", gte: 27 },
        { path: "education.level", neq: "college" }
      ]
    },
    text: "你从亲友手里借到一套缺页的复习资料，边角已经被几个人写满。白天干活，夜里在灯下重做题目；考试重新打开的门很窄，却让年龄、出身和耽误过的年月都来门前排队。",
    effects: [
      { path: "education.score", add: 10 },
      { path: "resources.health", add: -3 },
      { path: "resources.achievement", add: 6 },
      { addTag: "early_reform_exam_candidate" }
    ]
  },
  {
    id: "era_reform_campus_meal_ticket",
    title: "饭票夹在课本里",
    category: "school",
    yearRange: [1978, 1996],
    ageRange: [18, 27],
    currentRegions: { cityTiers: ["county", "city", "tier2", "tier1"] },
    maxOccurrences: 1,
    baseWeight: 29,
    conditions: {
      any: [
        { path: "education.level", eq: "college" },
        { hasTag: "college" },
        { hasTag: "worker_peasant_soldier_college" }
      ]
    },
    text: "你把饭票夹在最厚的课本里，仍有一张被风吹进了水沟。食堂师傅看你捞得狼狈，笑着多添半勺菜；大学既讨论国家和世界，也认真教育你一张饭票有多具体。",
    effects: [
      { path: "education.score", add: 5 },
      { path: "relationships.friendship", add: 5 },
      { path: "resources.happiness", add: 3 },
      { addTag: "campus_meal_ticket_memory" }
    ]
  },
  {
    id: "era_reform_english_cassette",
    title: "倒带学英语",
    category: "school",
    yearRange: [1985, 1999],
    ageRange: [12, 24],
    currentRegions: { cityTiers: ["town", "county", "city", "tier2", "tier1"] },
    maxOccurrences: 1,
    baseWeight: 26,
    conditions: {
      any: [
        { hasTag: "student" },
        { path: "education.level", neq: "none" },
        { path: "education.score", gte: 30 }
      ]
    },
    text: "你用录音机反复倒带学英语，一句问候被磁带拉得忽快忽慢。全家笑着记住了那句发音，只有你在课堂上仍会紧张；陌生语言第一次变成一项能决定升学和工作的本事。",
    effects: [
      { path: "education.score", add: 7 },
      { path: "resources.achievement", add: 3 },
      { path: "resources.happiness", add: -1 },
      { addTag: "cassette_english_memory" }
    ]
  },
  {
    id: "era_reform_graduate_job_fair",
    title: "毕业生供需见面会",
    category: "career",
    yearRange: [1993, 2002],
    ageRange: [21, 30],
    currentRegions: { cityTiers: ["county", "city", "tier2", "tier1"] },
    maxOccurrences: 1,
    baseWeight: 28,
    conditions: {
      any: [
        { path: "education.level", eq: "college" },
        { hasTag: "college" },
        { hasTag: "college_expansion_generation" }
      ]
    },
    text: "毕业分配不再替所有人安排去处，你拿着几份手写简历挤进供需见面会。单位挑学生，学生也打听工资和城市；所谓双向选择，在大厅里首先表现为两边都笑着努力显得不着急。",
    effects: [
      { path: "career.status", set: "employed" },
      { path: "career.field", set: "professional" },
      { path: "career.income", add: 9 },
      { path: "resources.freedom", add: 5 },
      { path: "resources.happiness", add: -2 },
      { addTag: "market_job_assignment_generation" }
    ]
  },
  {
    id: "era_reform_rural_college_tuition",
    title: "学费摊在饭桌上",
    category: "family",
    yearRange: [1994, 2007],
    ageRange: [18, 25],
    birthRegions: { hukou: ["rural"] },
    maxOccurrences: 1,
    baseWeight: 26,
    conditions: {
      any: [
        { path: "education.level", eq: "college" },
        { hasTag: "college" },
        { hasTag: "college_expansion_generation" }
      ]
    },
    text: "录取通知书旁边附着学费和住宿费，父母把数字抄到旧账本上，开始盘算卖粮、借钱和少盖一间新房。你去上大学不是一个人的远行，而是全家把几年收成提前压在一张纸上。",
    effects: [
      { path: "resources.wealth", add: -10 },
      { path: "relationships.family", add: 6 },
      { path: "resources.achievement", add: 6 },
      { path: "resources.happiness", add: -3 },
      { addTag: "rural_college_financing" }
    ]
  },
  {
    id: "era_reform_working_mother_return",
    title: "产假后的工位",
    category: "career",
    genders: ["female"],
    yearRange: [1980, 1997],
    ageRange: [22, 40],
    currentRegions: { cityTiers: ["town", "county", "city", "tier2", "tier1"] },
    maxOccurrences: 1,
    baseWeight: 23,
    conditions: {
      all: [
        { path: "relationships.children", gte: 1 },
        {
          any: [
            { path: "career.status", eq: "employed" },
            { path: "career.field", eq: "factory" },
            { path: "career.field", eq: "state_unit" },
            { hasTag: "township_enterprise_worker" }
          ]
        }
      ]
    },
    text: "产假结束，你把孩子托给老人或单位托儿所，重新站回工位。工资证明你没有离开公共生活，夜里一次次起身又提醒你：同一份现代生活，在女人身上常要排两遍班。",
    effects: [
      { path: "career.level", add: 3 },
      { path: "resources.wealth", add: 4 },
      { path: "resources.health", add: -5 },
      { path: "relationships.family", add: 3 },
      { addTag: "working_mother_double_shift" }
    ]
  },
  {
    id: "era_reform_birth_permit_folder",
    title: "装满证明的纸袋",
    category: "family",
    genders: ["female"],
    yearRange: [1982, 1999],
    ageRange: [22, 40],
    maxOccurrences: 1,
    baseWeight: 20,
    conditions: {
      all: [
        { path: "relationships.partnerStatus", in: ["partnered", "married"] },
        { path: "relationships.children", lte: 1 }
      ]
    },
    text: "你把婚姻、户口和检查证明装进一个纸袋，在几个窗口之间来回。长辈讨论香火，单位或户籍所在地核对指标，医生询问身体；关于生育的决定看似属于一家人，却有许多双手同时按在纸上。",
    effects: [
      { path: "resources.freedom", add: -6 },
      { path: "resources.happiness", add: -4 },
      { path: "relationships.family", add: -2 },
      { addTag: "family_planning_paperwork_memory" }
    ]
  },
  {
    id: "era_reform_daughter_takes_counter",
    title: "女儿站到柜台后",
    category: "career",
    genders: ["female"],
    yearRange: [1985, 1999],
    ageRange: [16, 38],
    currentRegions: { cityTiers: ["town", "county", "city", "tier2", "tier1"] },
    maxOccurrences: 1,
    baseWeight: 22,
    conditions: {
      any: [
        { hasTag: "getihu_family" },
        { path: "career.status", eq: "self_employed" },
        { hasTag: "getihu_path" },
        { hasTag: "family_workshop_path" }
      ]
    },
    text: "家里原想让儿子学进货，却发现你记价、认人和催欠账都更稳。你正式站到柜台后，亲戚仍说只是帮家里；可钥匙、现金和明天开不开门，已经开始等你的主意。",
    effects: [
      { path: "career.status", set: "self_employed" },
      { path: "career.field", set: "small_business" },
      { path: "career.level", add: 7 },
      { path: "resources.achievement", add: 7 },
      { path: "resources.freedom", add: 5 },
      { addTag: "woman_family_business_successor" }
    ]
  },
  {
    id: "era_reform_coastal_seafood_hands",
    title: "冷库里的手",
    category: "career",
    genders: ["female"],
    yearRange: [1986, 2003],
    ageRange: [17, 48],
    currentRegions: {
      provinces: ["liaoning", "shandong", "jiangsu", "zhejiang", "fujian", "guangdong", "guangxi", "hainan"],
      cityTiers: ["town", "county", "city"]
    },
    maxOccurrences: 1,
    baseWeight: 20,
    conditions: {
      any: [
        { path: "career.field", eq: "factory" },
        { hasTag: "migrant_worker" },
        { hasTag: "factory_sisterhood" },
        { path: "career.status", eq: "unemployed" }
      ]
    },
    text: "你在水产加工间分拣、剥壳、装箱，海货要赶鲜，手指却长期泡在冰水里。出口纸箱印着很远的地名，你只在下班后关心指节还能不能握紧筷子。",
    effects: [
      { path: "career.status", set: "employed" },
      { path: "career.field", set: "seafood_processing" },
      { path: "career.income", add: 6 },
      { path: "resources.wealth", add: 5 },
      { path: "resources.health", add: -7 },
      { addTag: "coastal_seafood_worker" }
    ]
  },
  {
    id: "era_reform_xinjiang_cotton_season",
    title: "棉花地里的季节工",
    category: "career",
    yearRange: [1990, 2007],
    ageRange: [18, 58],
    currentRegions: { provinces: ["xinjiang"], hukou: ["rural"], cityTiers: ["village", "town", "county"] },
    maxOccurrences: 1,
    baseWeight: 20,
    conditions: {
      any: [
        { path: "resources.wealth", lte: 45 },
        { hasTag: "peasant_household" },
        { hasTag: "migrant_worker" },
        { path: "career.field", eq: "farm_work" }
      ]
    },
    text: "采棉季一到，你跟着人群住进地头简棚，天亮弯腰，天黑过秤。雪白棉絮粘满衣襟，看着轻，一天的分量却全压在腰上；结算时，每一公斤才恢复成家用。",
    effects: [
      { path: "career.field", set: "seasonal_farm_labor" },
      { path: "resources.wealth", add: 7 },
      { path: "resources.health", add: -6 },
      { path: "relationships.friendship", add: 3 },
      { addTag: "cotton_season_worker" }
    ]
  },
  {
    id: "era_reform_northeast_border_bag",
    title: "边境列车的提包",
    category: "wealth",
    yearRange: [1991, 1999],
    ageRange: [25, 58],
    currentRegions: { provinces: ["heilongjiang", "jilin", "liaoning"] },
    maxOccurrences: 1,
    baseWeight: 17,
    conditions: {
      any: [
        { path: "career.status", eq: "laid_off" },
        { path: "career.status", eq: "self_employed" },
        { hasTag: "laid_off_shadow" },
        { hasTrait: "market_sense" }
      ]
    },
    text: "你拎着装满日用品和衣物的大提包赶边境列车，过道里每只包都比主人更有体积。大家拿绳结、暗号和玩笑守着货；过去靠机器吃饭的手，如今先学会护住一张薄薄的差价。",
    effects: [
      { path: "career.status", set: "self_employed" },
      { path: "career.field", set: "cross_border_trade" },
      { path: "resources.wealth", add: 9 },
      { path: "resources.health", add: -4 },
      { path: "resources.freedom", add: 4 },
      { addTag: "northeast_border_trade" }
    ]
  }
];

const SPECIAL_ADMINISTRATIVE_REGIONS = ["xianggang", "aomen", "taiwan"];

for (const event of historyReformEraEvents) {
  event.conditions ??= {};
  event.conditions.none = [
    ...(event.conditions.none ?? []),
    { path: "location.currentProvince", in: SPECIAL_ADMINISTRATIVE_REGIONS },
  ];
}

historyReformEraEvents.push(
  {
    id: "era_hongkong_factory_moves_north",
    title: "机器过了关口",
    category: "career",
    yearRange: [1980, 1996],
    ageRange: [18, 65],
    currentRegions: { provinces: ["xianggang"], cityTiers: ["town", "county", "city", "tier2", "tier1"] },
    maxOccurrences: 1,
    baseWeight: 28,
    text: "珠江对岸的厂房越来越多，香港的机器、订单和师傅陆续北移。老板说成本降了，旧车间的人先问自己的工位还在不在；一条边界让货更快，也把同一份工作拆成两种工资。",
    effects: [
      { path: "resources.wealth", add: 3 },
      { path: "resources.happiness", add: -3 },
      { path: "attrs.mental", add: 1 },
      { addTag: "hongkong_factory_relocation_memory" }
    ]
  },
  {
    id: "era_hongkong_handover_1997",
    title: "雨里的交接",
    category: "family",
    narrativeTier: "historical_pressure",
    yearRange: [1997, 1998],
    ageRange: [5, 90],
    currentRegions: { provinces: ["xianggang"] },
    maxOccurrences: 1,
    priority: 56,
    baseWeight: 52,
    text: "交接仪式在雨里进行，旗帜、证件与新闻称呼一夜换了次序。街坊有人期待，有人盘算去留，也有人第二天照常赶早班；历史翻页时，巴士仍按站收费。",
    effects: [
      { path: "attrs.mental", add: 1 },
      { path: "resources.happiness", add: 2 },
      { path: "resources.freedom", add: 1 },
      { addTag: "hongkong_handover_memory" }
    ]
  },
  {
    id: "era_taiwan_martial_law_lifted",
    title: "报纸忽然多了说法",
    category: "family",
    narrativeTier: "historical_pressure",
    yearRange: [1987, 1989],
    ageRange: [12, 90],
    currentRegions: { provinces: ["taiwan"] },
    maxOccurrences: 1,
    priority: 48,
    baseWeight: 42,
    text: "戒严解除以后，报纸与街头忽然多出彼此争吵的说法。你起初嫌声音太杂，后来才明白，能公开争论本身就是过去没有的一种日常。",
    effects: [
      { path: "resources.freedom", add: 7 },
      { path: "attrs.mental", add: 1 },
      { path: "relationships.friendship", add: 2 },
      { addTag: "taiwan_martial_law_lifted_memory" }
    ]
  },
  {
    id: "era_taiwan_electronics_export_line",
    title: "电路板经过许多双手",
    category: "career",
    yearRange: [1980, 1999],
    ageRange: [16, 62],
    currentRegions: { provinces: ["taiwan"], cityTiers: ["town", "county", "city", "tier2", "tier1"] },
    maxOccurrences: 1,
    baseWeight: 28,
    text: "电子厂的电路板沿流水线经过许多双手，最后装箱去往海外。新闻把它叫产业升级，你更熟悉的是无尘衣里的汗、加班表和月底那笔确实增加的工资。",
    effects: [
      { path: "resources.wealth", add: 6 },
      { path: "resources.health", add: -3 },
      { path: "resources.achievement", add: 4 },
      { addTag: "taiwan_electronics_memory" }
    ]
  },
  {
    id: "era_macau_tourism_shift",
    title: "旧街转向游客",
    category: "career",
    yearRange: [1980, 1998],
    ageRange: [18, 70],
    currentRegions: { provinces: ["aomen"], cityTiers: ["town", "county", "city", "tier2", "tier1"] },
    maxOccurrences: 1,
    baseWeight: 25,
    text: "酒店、赌场与游客把小城的班次拖到深夜。有人靠小费和加班把家用撑宽，也有人发现旧邻居的店面先学会说价钱，再学会说欢迎。",
    effects: [
      { path: "resources.wealth", add: 5 },
      { path: "resources.health", add: -2 },
      { path: "relationships.friendship", add: 1 },
      { addTag: "macau_tourism_shift_memory" }
    ]
  },
  {
    id: "era_macau_handover_1999",
    title: "关闸两边都在倒数",
    category: "family",
    narrativeTier: "historical_pressure",
    yearRange: [1999, 2000],
    ageRange: [5, 95],
    currentRegions: { provinces: ["aomen"] },
    maxOccurrences: 1,
    priority: 54,
    baseWeight: 50,
    text: "交接前后，街上换旗、换称呼，也反复解释哪些制度暂时不换。你收好旧证件，又去办新的手续；宏大的归属最后总要落到一张照片尺寸是否合格。",
    effects: [
      { path: "attrs.mental", add: 1 },
      { path: "resources.happiness", add: 2 },
      { addTag: "macau_handover_memory" }
    ]
  }
);
