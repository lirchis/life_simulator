// Auto-split event data. Keep events in this file focused on one era or theme.
export const historyEarlyPrcEvents = [
  {
    "id": "era_planned_assignment_first_work",
    "title": "工作分配",
    "category": "career",
    "yearRange": [
      1949,
      1977
    ],
    "ageRange": [
      16,
      26
    ],
    "priority": 70,
    "maxOccurrences": 1,
    "baseWeight": 90,
    "conditions": {
      "none": [
        {
          "path": "career.status",
          "eq": "employed"
        },
        {
          "path": "career.status",
          "eq": "family_labor"
        }
      ]
    },
    "text": [
      {
        "conditions": {
          "all": [
            {
              "path": "birth.hukou",
              "eq": "rural"
            }
          ]
        },
        "text": "你到了该参加劳动的年纪。没有招聘广告，更多是生产队、工分、集体安排和家里缺不缺劳力。"
      },
      {
        "conditions": {
          "all": [
            {
              "path": "birth.gender",
              "eq": "female"
            }
          ]
        },
        "text": "你到了该参加工作的年纪。口号说妇女能顶半边天，分配表和家务账却常常一起落到你面前。"
      },
      {
        "text": "你到了该参加工作的年纪。那时不是投简历，而是分配、招工、介绍信和单位名册。"
      }
    ],
    "choices": [
      {
        "id": "production_team",
        "text": "留在生产队挣工分",
        "resultText": "你留在生产队。日子被工分本记下，太阳每天都像一个准时的上级。",
        "effects": [
          {
            "path": "career.status",
            "set": "employed"
          },
          {
            "path": "career.field",
            "set": "production_team"
          },
          {
            "path": "career.income",
            "add": 6
          },
          {
            "path": "resources.wealth",
            "add": 4
          },
          {
            "path": "resources.freedom",
            "add": -6
          },
          {
            "addTag": "collective_laborer"
          }
        ]
      },
      {
        "id": "factory_recruit",
        "text": "争取进厂或单位",
        "resultText": "你进了厂或单位。工牌挂在胸前，稳定两个字第一次有了实体。",
        "effects": [
          {
            "path": "career.status",
            "set": "employed"
          },
          {
            "path": "career.field",
            "set": "factory"
          },
          {
            "path": "career.income",
            "add": 12
          },
          {
            "path": "resources.wealth",
            "add": 8
          },
          {
            "path": "resources.freedom",
            "add": -3
          },
          {
            "addTag": "factory_worker"
          },
          {
            "addTrait": "industrial_discipline"
          }
        ]
      },
      {
        "id": "grassroots_post",
        "text": "去基层岗位跑腿办事",
        "resultText": "你在基层岗位上跑前跑后。人熟了，路也熟了，规矩慢慢也熟了。",
        "effects": [
          {
            "path": "career.status",
            "set": "employed"
          },
          {
            "path": "career.field",
            "set": "grassroots_post"
          },
          {
            "path": "career.income",
            "add": 8
          },
          {
            "path": "resources.reputation",
            "add": 6
          },
          {
            "addTrait": "local_connector"
          },
          {
            "addTag": "grassroots_worker"
          }
        ]
      }
    ]
  },
  {
    "id": "era_1949_new_state_loudspeaker",
    "title": "新中国成立",
    "category": "family",
    "yearRange": [
      1949,
      1950
    ],
    "ageRange": [
      0,
      80
    ],
    "priority": 50,
    "maxOccurrences": 1,
    "baseWeight": 90,
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
        "text": "喇叭里传来新的国名，街上有人鼓掌，有人沉默。你听见“妇女能顶半边天”的新话，也知道旧日子不会一夜松手。"
      },
      {
        "text": "喇叭里传来新的国名，街上有人鼓掌，有人沉默。你站在人群里，觉得日历忽然翻得很响。"
      }
    ],
    "effects": [
      {
        "path": "resources.happiness",
        "add": 4
      },
      {
        "path": "attrs.mental",
        "add": 1
      },
      {
        "addTag": "new_china_witness"
      }
    ]
  },
  {
    "id": "era_landlord_class_label",
    "title": "成分落章",
    "category": "family",
    "yearRange": [
      1950,
      1953
    ],
    "birthFamilyClasses": [
      "landlord",
      "rich_peasant",
      "comprador_merchant",
      "merchant",
      "scholar_gentry"
    ],
    "maxOccurrences": 1,
    "priority": 60,
    "baseWeight": 70,
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
        "text": "家里的旧账被重新翻开，一个词盖在门楣上。后来谈婚论嫁、读书就业都有人问起它，出身像影子一样跟着你。"
      },
      {
        "text": "家里的旧账被重新翻开，一个词盖在门楣上。你第一次知道，出身也会像影子一样被登记。"
      }
    ],
    "effects": [
      {
        "path": "resources.wealth",
        "add": -18
      },
      {
        "path": "resources.reputation",
        "add": -12
      },
      {
        "path": "resources.happiness",
        "add": -8
      },
      {
        "addTag": "bad_class_origin"
      },
      {
        "addTrait": "class_shadow"
      }
    ]
  },
  {
    "id": "era_korean_war_family_parcel",
    "title": "前线包裹",
    "category": "war",
    "tags": [
      "war"
    ],
    "yearRange": [
      1950,
      1953
    ],
    "ageRange": [
      12,
      45
    ],
    "baseWeight": 16,
    "text": "村里给前线寄包裹，针脚、干粮和祝福塞得满满的。远方的战争也从此占了你家一角。",
    "effects": [
      {
        "path": "resources.wealth",
        "add": -3
      },
      {
        "path": "resources.reputation",
        "add": 4
      },
      {
        "addTag": "frontline_support_memory"
      }
    ]
  },
  {
    "id": "era_first_factory_recruit",
    "title": "进厂",
    "category": "career",
    "yearRange": [
      1953,
      1965
    ],
    "ageRange": [
      16,
      32
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
    "maxOccurrences": 1,
    "baseWeight": 28,
    "conditions": {
      "none": [
        {
          "path": "career.status",
          "eq": "employed"
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
        "text": "你进了厂，领到工牌。女工的手也能拧紧机器上的螺丝，每月发工资的日子，家里人听得最清楚。"
      },
      {
        "text": "你进了厂，领到工牌。机器声很响，但每月发工资的日子，家里人听得最清楚。"
      }
    ],
    "effects": [
      {
        "path": "career.status",
        "set": "employed"
      },
      {
        "path": "career.field",
        "set": "factory"
      },
      {
        "path": "career.income",
        "add": 18
      },
      {
        "path": "resources.wealth",
        "add": 10
      },
      {
        "addTag": "factory_worker"
      },
      {
        "addTrait": "industrial_discipline"
      }
    ]
  },
  {
    "id": "era_industrial_construction_whistle",
    "title": "大建设的汽笛",
    "category": "career",
    "yearRange": [
      1953,
      1978
    ],
    "ageRange": [
      18,
      50
    ],
    "currentRegions": {
      "cityTiers": [
        "city",
        "tier2",
        "tier1"
      ]
    },
    "baseWeight": 26,
    "conditions": {
      "any": [
        {
          "path": "career.field",
          "eq": "factory"
        },
        {
          "hasTag": "worker_family"
        },
        {
          "hasTag": "state_worker_family"
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
        "text": "工地和厂房一起长高，汽笛把清晨切开。你和男工一样上工、流汗、评先进，半边天也要按时打卡。"
      },
      {
        "text": "工地和厂房一起长高，汽笛把清晨切开。你觉得自己只是拧紧一颗螺丝，却也参与了一个巨大的句子。"
      }
    ],
    "effects": [
      {
        "path": "career.level",
        "add": 7
      },
      {
        "path": "resources.achievement",
        "add": 8
      },
      {
        "path": "resources.health",
        "add": -3
      },
      {
        "addTag": "industrial_builder"
      }
    ]
  },
  {
    "id": "era_collective_canteen",
    "title": "公共食堂",
    "category": "family",
    "yearRange": [
      1958,
      1960
    ],
    "birthRegions": {
      "hukou": [
        "rural"
      ]
    },
    "ageRange": [
      0,
      70
    ],
    "maxOccurrences": 1,
    "priority": 55,
    "baseWeight": 70,
    "text": "锅灶并到一起，村里说吃饭不愁。热气一开始很足，后来每个人都学会看锅底的深浅。",
    "effects": [
      {
        "path": "resources.happiness",
        "add": -4
      },
      {
        "path": "resources.health",
        "add": -4
      },
      {
        "addTag": "communal_canteen_memory"
      }
    ]
  },
  {
    "id": "era_great_leap_backyard_furnace",
    "title": "小高炉夜火",
    "category": "career",
    "yearRange": [
      1958,
      1960
    ],
    "ageRange": [
      10,
      60
    ],
    "maxOccurrences": 1,
    "baseWeight": 42,
    "text": "院里砌起小高炉，铁锅铁盆都被送去添火。火光很亮，日子却没有因此更暖。",
    "effects": [
      {
        "path": "resources.wealth",
        "add": -6
      },
      {
        "path": "resources.health",
        "add": -3
      },
      {
        "path": "resources.reputation",
        "add": 3
      },
      {
        "addTag": "great_leap_memory"
      }
    ]
  },
  {
    "id": "era_famine_hungry_spring",
    "title": "饥饿的春天",
    "category": "health",
    "yearRange": [
      1959,
      1962
    ],
    "ageRange": [
      0,
      80
    ],
    "priority": 64,
    "maxOccurrences": 1,
    "baseWeight": 80,
    "weightModifiers": [
      {
        "path": "resources.wealth",
        "lte": 25,
        "multiply": 1.5
      },
      {
        "path": "attrs.physique",
        "lte": 3,
        "multiply": 1.4
      },
      {
        "hasTag": "low_resource_family",
        "multiply": 1.4
      }
    ],
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
              "gte": 10
            }
          ]
        },
        "text": "春天来了，锅里却没有春天。你跟着大人找野菜、照看更小的孩子，也把自己的饿藏得很安静。"
      },
      {
        "text": "春天来了，锅里却没有春天。你记住了野菜的苦，也记住了大人把最后一口让出去的样子。"
      }
    ],
    "effects": [
      {
        "path": "resources.health",
        "add": -16
      },
      {
        "path": "resources.happiness",
        "add": -14
      },
      {
        "path": "attrs.mental",
        "add": 1
      },
      {
        "addTrait": "survival_instinct"
      },
      {
        "addTag": "famine_memory"
      }
    ]
  },
  {
    "id": "era_famine_child_death",
    "title": "没熬过荒年",
    "category": "ending",
    "yearRange": [
      1959,
      1962
    ],
    "ageRange": [
      0,
      8
    ],
    "priority": 70,
    "baseWeight": 2,
    "weightModifiers": [
      {
        "path": "resources.health",
        "lte": 25,
        "multiply": 5
      },
      {
        "path": "attrs.physique",
        "lte": 2,
        "multiply": 2
      },
      {
        "hasTag": "famine_memory",
        "multiply": 2
      }
    ],
    "text": "饥饿把小小的身体一点点掏空。那一年风吹过屋檐，家里再也没人敢说孩子长得快。",
    "effects": [
      {
        "die": "困难时期饥病"
      },
      {
        "triggerEnding": "famine_child_end"
      }
    ]
  },
  {
    "id": "era_sent_down_youth_train",
    "title": "上山下乡",
    "category": "migration",
    "yearRange": [
      1968,
      1978
    ],
    "ageRange": [
      15,
      24
    ],
    "currentRegions": {
      "cityTiers": [
        "city",
        "tier2",
        "tier1"
      ]
    },
    "maxOccurrences": 1,
    "priority": 58,
    "baseWeight": 65,
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
        "text": "你坐上绿皮车，胸前别着红花。站台越来越远，青春被一张调令寄往陌生的田野，也寄进更紧的目光里。"
      },
      {
        "text": "你坐上绿皮车，胸前别着红花。站台越来越远，青春被一张调令寄往陌生的田野。"
      }
    ],
    "effects": [
      {
        "path": "location.migratedTimes",
        "add": 1
      },
      {
        "path": "resources.health",
        "add": -5
      },
      {
        "path": "education.score",
        "add": -8
      },
      {
        "path": "resources.freedom",
        "add": -12
      },
      {
        "addTag": "sent_down_youth"
      },
      {
        "addTrait": "self_reliant"
      }
    ]
  },
  {
    "id": "era_cultural_revolution_school_closed",
    "title": "停课闹革命",
    "category": "school",
    "yearRange": [
      1966,
      1976
    ],
    "ageRange": [
      6,
      22
    ],
    "maxOccurrences": 1,
    "priority": 52,
    "baseWeight": 70,
    "text": [
      {
        "conditions": {
          "all": [
            {
              "path": "birth.gender",
              "eq": "female"
            },
            {
              "path": "birth.hukou",
              "eq": "rural"
            }
          ]
        },
        "text": "课本被合上，操场变成口号的海。你回家分担更多活计，教育断档没有声音，却实实在在从手指缝里漏掉。"
      },
      {
        "text": "课本被合上，操场变成口号的海。你还没学会很多字，却先学会了看大人的脸色。"
      }
    ],
    "effects": [
      {
        "path": "education.score",
        "add": -12
      },
      {
        "path": "resources.happiness",
        "add": -4
      },
      {
        "addTag": "interrupted_schooling"
      },
      {
        "addTrait": "media_ear"
      }
    ]
  },
  {
    "id": "era_cultural_revolution_family_swept",
    "title": "家里被抄",
    "category": "family",
    "yearRange": [
      1966,
      1976
    ],
    "ageRange": [
      0,
      65
    ],
    "maxOccurrences": 1,
    "baseWeight": 18,
    "weightModifiers": [
      {
        "hasTag": "bad_class_origin",
        "multiply": 3
      },
      {
        "hasTag": "intellectual_family",
        "multiply": 2
      },
      {
        "hasTag": "scholar_gentry_family",
        "multiply": 2
      }
    ],
    "text": "箱子被打开，旧书旧信散了一地。你站在墙边，觉得沉默也会发出很大的声音。",
    "effects": [
      {
        "path": "resources.wealth",
        "add": -14
      },
      {
        "path": "resources.reputation",
        "add": -10
      },
      {
        "path": "relationships.family",
        "add": -6
      },
      {
        "addTag": "family_swept_memory"
      }
    ]
  },
  {
    "id": "era_barefoot_doctor",
    "title": "赤脚医生",
    "category": "health",
    "yearRange": [
      1965,
      1979
    ],
    "birthRegions": {
      "hukou": [
        "rural"
      ]
    },
    "ageRange": [
      0,
      70
    ],
    "baseWeight": 26,
    "text": "村里的赤脚医生背着药箱来，针头在开水里滚过。简陋归简陋，很多命就靠这点亮光拖住。",
    "effects": [
      {
        "path": "resources.health",
        "add": 8
      },
      {
        "path": "resources.happiness",
        "add": 2
      },
      {
        "addTag": "barefoot_doctor_memory"
      }
    ]
  },
  {
    "id": "era_restored_gaokao_choice",
    "title": "恢复高考",
    "category": "school",
    "yearRange": [
      1977,
      1979
    ],
    "ageRange": [
      16,
      32
    ],
    "maxOccurrences": 1,
    "priority": 82,
    "baseWeight": 80,
    "conditions": {
      "none": [
        {
          "hasTag": "gaokao_done"
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
        "text": "消息传来，高考恢复。有人说女孩子年纪不小了，别再折腾；你翻出旧课本，看见命运开了一条细缝。"
      },
      {
        "text": "消息传来，高考恢复。有人翻出旧课本，有人夜里点灯，你忽然看见命运开了一条细缝。"
      }
    ],
    "choices": [
      {
        "id": "study_again",
        "text": "拼命复习，抓住这条缝",
        "resultText": "你把荒废的课本重新啃了一遍。窗外天亮时，纸上多了很多密密麻麻的路。",
        "effects": [
          {
            "path": "education.score",
            "add": 18
          },
          {
            "path": "resources.happiness",
            "add": -4
          },
          {
            "path": "resources.achievement",
            "add": 14
          },
          {
            "addTag": "gaokao_done"
          },
          {
            "addTag": "restored_gaokao_generation"
          }
        ]
      },
      {
        "id": "stay_current_path",
        "text": "算了，先守住眼前生活",
        "resultText": "你没有回到考场。人生继续往前，只是偶尔会想起那扇开过的门。",
        "effects": [
          {
            "path": "resources.wealth",
            "add": 4
          },
          {
            "path": "resources.happiness",
            "add": -2
          },
          {
            "addTag": "missed_restored_gaokao"
          }
        ]
      }
    ]
  },
  {
    "id": "era_hongkong_border_attempt",
    "title": "偷渡过港的念头",
    "category": "migration",
    "yearRange": [
      1962,
      1980
    ],
    "ageRange": [
      16,
      40
    ],
    "birthRegions": {
      "provinces": [
        "guangdong",
        "fujian",
        "guangxi"
      ]
    },
    "maxOccurrences": 1,
    "baseWeight": 10,
    "weightModifiers": [
      {
        "path": "resources.wealth",
        "lte": 25,
        "multiply": 2
      },
      {
        "path": "attrs.luck",
        "lte": 3,
        "multiply": 1.5
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
        "text": "有人低声谈起边境那边的灯。对你来说，这不是旅行，是把名声、身体和一条命都压进黑水和草丛。"
      },
      {
        "text": "有人低声谈起边境那边的灯。你知道这不是旅行，是把一条命压进黑水和草丛。"
      }
    ],
    "choices": [
      {
        "id": "attempt_crossing",
        "text": "冒险一试",
        "resultText": "你在夜色里走了很久。那一晚之后，你再也不把自由两个字说得轻巧。",
        "effects": [
          {
            "path": "resources.health",
            "add": -10
          },
          {
            "path": "resources.freedom",
            "add": 14
          },
          {
            "path": "resources.wealth",
            "add": 8
          },
          {
            "addTag": "border_crossing_attempt"
          },
          {
            "addTrait": "survival_instinct"
          }
        ]
      },
      {
        "id": "turn_back_home",
        "text": "转身回家",
        "resultText": "你回去了。灯还在远处亮着，但家里的门也还在。",
        "effects": [
          {
            "path": "relationships.family",
            "add": 4
          },
          {
            "path": "resources.happiness",
            "add": -2
          },
          {
            "addTag": "border_dream_unacted"
          }
        ]
      }
    ]
  },
  {
    "id": "era_literacy_class_evening",
    "title": "夜校识字班",
    "category": "school",
    "yearRange": [
      1950,
      1965
    ],
    "ageRange": [
      12,
      45
    ],
    "maxOccurrences": 1,
    "baseWeight": 26,
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
        "text": "夜里有人办识字班，你跟着念墙上的字。有人说女人识字能管账，也有人说别误了家务；你把两个声音都听见了。"
      },
      {
        "text": "夜里有人办识字班，你跟着念墙上的字。一个字一个字认下来，世界像被重新标了名字。"
      }
    ],
    "effects": [
      {
        "path": "education.score",
        "add": 8
      },
      {
        "path": "attrs.intelligence",
        "add": 1
      },
      {
        "addTag": "literacy_class_memory"
      }
    ]
  },
  {
    "id": "era_marriage_law_whisper",
    "title": "婚姻法传到村里",
    "category": "family",
    "yearRange": [
      1950,
      1958
    ],
    "ageRange": [
      14,
      35
    ],
    "maxOccurrences": 1,
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
        "text": "婚姻法的消息传到村里，有人低声议论婚事能不能自己说话。新法条很远，却让一些旧安排忽然显得不那么稳。"
      },
      {
        "text": "婚姻法的消息传到村里，老人皱眉，年轻人偷听。纸上的新规矩，慢慢碰到了家里的旧规矩。"
      }
    ],
    "effects": [
      {
        "path": "resources.freedom",
        "add": 4
      },
      {
        "path": "relationships.family",
        "add": -1
      },
      {
        "addTag": "marriage_law_memory"
      }
    ]
  },
  {
    "id": "era_collective_canteen_queue",
    "title": "公共食堂排队",
    "category": "family",
    "yearRange": [
      1958,
      1961
    ],
    "ageRange": [
      4,
      80
    ],
    "birthRegions": {
      "hukou": [
        "rural"
      ]
    },
    "baseWeight": 32,
    "text": "你端着碗在公共食堂排队。锅里热气上来，队伍里没人说太多话，所有人都在听勺子碰锅底的声音。",
    "effects": [
      {
        "path": "resources.health",
        "add": -4
      },
      {
        "path": "resources.happiness",
        "add": -5
      },
      {
        "addTag": "communal_canteen_memory"
      }
    ]
  },
  {
    "id": "era_steel_campaign_backyard",
    "title": "土炉边的夜",
    "category": "career",
    "yearRange": [
      1958,
      1960
    ],
    "ageRange": [
      12,
      65
    ],
    "maxOccurrences": 1,
    "baseWeight": 24,
    "text": "夜里还在土炉边忙，火光把每个人的脸照得发红。口号很响，手里的疲惫也很真实。",
    "effects": [
      {
        "path": "resources.health",
        "add": -6
      },
      {
        "path": "career.income",
        "add": 1
      },
      {
        "path": "resources.happiness",
        "add": -4
      },
      {
        "addTag": "backyard_steel_memory"
      }
    ]
  },
  {
    "id": "era_famine_swollen_legs",
    "title": "腿脚浮肿",
    "category": "health",
    "yearRange": [
      1959,
      1962
    ],
    "ageRange": [
      5,
      75
    ],
    "maxOccurrences": 1,
    "baseWeight": 22,
    "weightModifiers": [
      {
        "path": "resources.wealth",
        "lte": 30,
        "multiply": 1.6
      },
      {
        "path": "birth.hukou",
        "eq": "rural",
        "multiply": 1.4
      }
    ],
    "text": "你的腿脚开始浮肿，走路像踩在不属于自己的身体上。饥饿不再只是肚子叫，它慢慢写到皮肤下面。",
    "effects": [
      {
        "path": "resources.health",
        "add": -14
      },
      {
        "path": "attrs.mental",
        "add": -1
      },
      {
        "addTag": "famine_body_memory"
      },
      {
        "addTrait": "famine_hardened"
      }
    ]
  },
  {
    "id": "era_three_front_construction_departure",
    "title": "去三线",
    "category": "migration",
    "yearRange": [
      1964,
      1978
    ],
    "ageRange": [
      18,
      45
    ],
    "conditions": {
      "any": [
        {
          "hasTag": "factory_worker"
        },
        {
          "hasTag": "industrial_builder"
        },
        {
          "path": "career.field",
          "eq": "factory"
        }
      ]
    },
    "maxOccurrences": 1,
    "baseWeight": 16,
    "text": "单位通知一批人去三线。车窗外的城市退下去，山路和厂房接上来，你把家安到地图更深处。",
    "effects": [
      {
        "path": "resources.wealth",
        "add": 4
      },
      {
        "path": "resources.freedom",
        "add": -5
      },
      {
        "path": "career.income",
        "add": 4
      },
      {
        "addTag": "third_front_builder"
      }
    ]
  },
  {
    "id": "era_factory_dormitory_life",
    "title": "厂里宿舍",
    "category": "career",
    "yearRange": [
      1953,
      1977
    ],
    "ageRange": [
      16,
      45
    ],
    "conditions": {
      "any": [
        {
          "hasTag": "factory_worker"
        },
        {
          "path": "career.field",
          "eq": "factory"
        }
      ]
    },
    "baseWeight": 24,
    "text": "你住进厂里宿舍。铃声管着上班，食堂管着饭点，走廊里每个人的故事都被搪瓷盆敲得叮当响。",
    "effects": [
      {
        "path": "relationships.friendship",
        "add": 5
      },
      {
        "path": "resources.freedom",
        "add": -3
      },
      {
        "addTag": "factory_dormitory_memory"
      }
    ]
  },
  {
    "id": "era_sent_down_first_winter",
    "title": "下乡的第一个冬天",
    "category": "migration",
    "yearRange": [
      1968,
      1978
    ],
    "ageRange": [
      15,
      25
    ],
    "conditions": {
      "any": [
        {
          "hasTag": "sent_down_youth"
        },
        {
          "hasTag": "sent_down_big_brother"
        }
      ]
    },
    "baseWeight": 28,
    "text": "下乡后的第一个冬天特别长。炕是热的，手是裂的，你开始明白口号落到泥地里，会先变成一双脚。",
    "effects": [
      {
        "path": "resources.health",
        "add": -5
      },
      {
        "path": "attrs.mental",
        "add": 1
      },
      {
        "path": "resources.happiness",
        "add": -4
      },
      {
        "addTag": "sent_down_winter_memory"
      }
    ]
  },
  {
    "id": "era_cultural_revolution_school_paused",
    "title": "课本合上",
    "category": "school",
    "yearRange": [
      1966,
      1971
    ],
    "ageRange": [
      7,
      22
    ],
    "maxOccurrences": 1,
    "baseWeight": 28,
    "text": "学校忽然不像学校了，课本合上，标语贴满墙。你还在长身体，世界却把课堂换成了更嘈杂的地方。",
    "effects": [
      {
        "path": "education.score",
        "add": -10
      },
      {
        "path": "resources.happiness",
        "add": -5
      },
      {
        "addTag": "school_paused_memory"
      },
      {
        "addTrait": "interrupted_schooling"
      }
    ]
  },
  {
    "id": "era_model_worker_broadcast",
    "title": "劳模广播",
    "category": "career",
    "yearRange": [
      1954,
      1977
    ],
    "ageRange": [
      12,
      60
    ],
    "baseWeight": 20,
    "text": "广播里念着劳模的名字，大家抬头听了一会儿。那种被看见的荣光很远，却也让手里的活多了一点劲。",
    "effects": [
      {
        "path": "career.income",
        "add": 2
      },
      {
        "path": "resources.achievement",
        "add": 4
      },
      {
        "addTag": "model_worker_aspiration"
      }
    ]
  },
  {
    "id": "era_ration_ticket_city_queue",
    "title": "粮票队伍",
    "category": "wealth",
    "yearRange": [
      1955,
      1985
    ],
    "ageRange": [
      6,
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
    "maxOccurrences": 2,
    "baseWeight": 22,
    "text": "你拿着粮票排队，前面的人一边等一边算。那时生活常常不是看想要什么，而是看票上还剩什么。",
    "effects": [
      {
        "path": "resources.wealth",
        "add": -1
      },
      {
        "path": "attrs.mental",
        "add": 1
      },
      {
        "addTag": "ration_queue_memory"
      }
    ]
  },
  {
    "id": "era_cooperative_meeting_rural",
    "title": "合作社会议",
    "category": "family",
    "yearRange": [
      1953,
      1956
    ],
    "ageRange": [
      12,
      70
    ],
    "birthRegions": {
      "hukou": [
        "rural"
      ]
    },
    "maxOccurrences": 1,
    "baseWeight": 26,
    "text": "村里开会说互助组、合作社，锄头、牲口和土地都被放进新的账里。你听见日子正被重新安排。",
    "effects": [
      {
        "path": "resources.freedom",
        "add": -3
      },
      {
        "path": "relationships.family",
        "add": 2
      },
      {
        "addTag": "cooperative_meeting_memory"
      }
    ]
  },
  {
    "id": "era_private_plot_recovery",
    "title": "自留地又绿了",
    "category": "family",
    "yearRange": [
      1962,
      1965
    ],
    "ageRange": [
      8,
      75
    ],
    "birthRegions": {
      "hukou": [
        "rural"
      ]
    },
    "baseWeight": 22,
    "text": "家里那点自留地又慢慢绿起来。菜苗很小，却让人相信饭桌还能一点点缓过来。",
    "effects": [
      {
        "path": "resources.health",
        "add": 4
      },
      {
        "path": "resources.happiness",
        "add": 3
      },
      {
        "addTag": "private_plot_memory"
      }
    ]
  },
  {
    "id": "era_militia_night_training",
    "title": "夜里民兵训练",
    "category": "career",
    "yearRange": [
      1964,
      1976
    ],
    "ageRange": [
      16,
      35
    ],
    "birthRegions": {
      "hukou": [
        "rural"
      ]
    },
    "baseWeight": 16,
    "text": "夜里集合训练，木枪、口令和脚步声把村口变得严肃。你不一定上战场，却也被时代练出一副绷紧的身体。",
    "effects": [
      {
        "path": "resources.health",
        "add": 2
      },
      {
        "path": "resources.freedom",
        "add": -2
      },
      {
        "addTrait": "militia_exposure"
      },
      {
        "addTag": "militia_training_memory"
      }
    ]
  },
  {
    "id": "era_worker_peasant_soldier_college_recommendation",
    "title": "推荐上大学",
    "category": "school",
    "yearRange": [
      1970,
      1976
    ],
    "ageRange": [
      18,
      30
    ],
    "conditions": {
      "any": [
        {
          "hasTag": "factory_worker"
        },
        {
          "hasTag": "collective_laborer"
        },
        {
          "hasTag": "sent_down_youth"
        }
      ]
    },
    "maxOccurrences": 1,
    "baseWeight": 12,
    "text": "有人提到推荐你去上工农兵大学。机会很亮，也很复杂，档案、表现和人缘都在背后悄悄说话。",
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
        "addTag": "worker_peasant_soldier_college"
      }
    ]
  },
  {
    "id": "era_tangshan_quake_news",
    "title": "唐山地震的消息",
    "category": "health",
    "yearRange": [
      1976,
      1976
    ],
    "ageRange": [
      0,
      90
    ],
    "currentRegions": {
      "provinces": [
        "hebei",
        "beijing",
        "tianjin",
        "liaoning"
      ]
    },
    "maxOccurrences": 1,
    "priority": 45,
    "baseWeight": 45,
    "text": "唐山地震的消息传来，夜像裂开过一样。你听着伤亡和救援，忽然觉得脚下的土地也并非永远可靠。",
    "effects": [
      {
        "path": "resources.happiness",
        "add": -8
      },
      {
        "path": "attrs.mental",
        "add": 1
      },
      {
        "addTag": "tangshan_quake_memory"
      }
    ]
  },
  {
    "id": "era_1976_memorial_silence",
    "title": "一九七六年的沉默",
    "category": "random",
    "yearRange": [
      1976,
      1976
    ],
    "ageRange": [
      6,
      90
    ],
    "maxOccurrences": 1,
    "priority": 42,
    "baseWeight": 70,
    "text": "那一年，广播、讣告和人群的沉默一阵阵传来。很多人说不清未来，只觉得一个旧章节正在合上。",
    "effects": [
      {
        "path": "resources.happiness",
        "add": -3
      },
      {
        "path": "attrs.mental",
        "add": 1
      },
      {
        "addTag": "year_1976_memory"
      }
    ]
  }
];
