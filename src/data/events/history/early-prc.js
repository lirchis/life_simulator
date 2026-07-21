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
              "path": "location.currentCityTier",
              "in": ["village", "town", "county"]
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
    "outcomes": [
      {
        "id": "production_team",
        "text": "留在生产队挣工分",
        "resultText": "你留在生产队。日子被工分本记下，太阳每天都像一个准时的上级。",
        "conditions": {
          "all": [
            {
              "path": "location.currentCityTier",
              "in": ["village", "town", "county"]
            }
          ]
        },
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
    "text": [
      {
        "conditions": {
          "all": [
            {
              "path": "location.currentCityTier",
              "in": ["village", "town", "county"]
            }
          ]
        },
        "text": "村里给前线寄包裹，针脚、干粮和祝福塞得满满的。远方的战争也从此占了你家一角。"
      },
      {
        "text": "街道和单位组织给前线寄包裹，针脚、干粮和祝福塞得满满的。远方的战争也从此占了你家一角。"
      }
    ],
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
    "maxOccurrences": 1,
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
    "currentRegions": {
      "cityTiers": ["village", "town", "county"]
    },
    "ageRange": [
      0,
      70
    ],
    "maxOccurrences": 1,
    "priority": 55,
    "baseWeight": 70,
    "text": [
      {
        "conditions": {
          "all": [
            { "path": "meta.age", "lte": 7 }
          ]
        },
        "text": "各家的锅灶停了火，你跟着大人端碗去公共食堂。最初锣一响便有热饭，后来队伍仍照常排，盛到碗里的东西却越来越能照见碗底。"
      },
      {
        "conditions": {
          "any": [
            { "path": "resources.health", "lte": 45 },
            { "path": "resources.wealth", "lte": 30 }
          ]
        },
        "text": "公共食堂的锅灶烧得很大，你却渐渐吃不饱。掌勺人把勺子刮过锅底，前后多半勺都有人盯着；饥饿把一顿集体饭分成了许多私下的眼神。"
      },
      {
        "text": "锅灶并到公共食堂后，家里省下了做饭的柴火和工夫。开头饭菜冒着足够的热气，后来定量越来越薄，你学会先看队伍有多长，再估计今天的锅有多深。"
      }
    ],
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
              "path": "meta.age",
              "lte": 3
            }
          ]
        },
        "text": "后来家里人说，那年春天野菜很苦，锅底很薄。他们轮流把你抱在怀里，谁也不肯说明下一顿还剩多少。"
      },
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
            },
            {
              "path": "meta.age",
              "lte": 17
            }
          ]
        },
        "text": "春天来了，锅里却没有春天。你跟着大人找野菜、照看更小的孩子，也把自己的饿藏得很安静。"
      },
      {
        "conditions": {
          "all": [
            {
              "path": "meta.age",
              "gte": 18
            }
          ]
        },
        "text": "春天来了，锅里却没有春天。你同家里人四处找能下锅的东西，也把省下的一口往更虚弱的人那边推；饥饿让每顿饭都像一次艰难分配。"
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
    "birthRegions": {
      "hukou": [
        "rural"
      ]
    },
    "maxOccurrences": 1,
    "baseWeight": 3,
    "conditions": {
      "all": [
        {
          "hasTag": "famine_memory"
        },
        {
          "path": "resources.health",
          "lte": 38
        }
      ]
    },
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
    "text": [
      {
        "conditions": {
          "all": [
            { "path": "meta.age", "lte": 3 }
          ]
        },
        "text": "箱子被打开，旧书旧信散了一地。大人把你抱到墙边，不许出声；你不懂发生了什么，只被骤然变大的脚步和说话声吓哭。"
      },
      {
        "text": "箱子被打开，旧书旧信散了一地。你站在墙边，觉得沉默也会发出很大的声音。"
      }
    ],
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
      1968,
      1979
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
      0,
      70
    ],
    "maxOccurrences": 1,
    "baseWeight": 26,
    "text": [
      {
        "conditions": {
          "all": [{ "path": "meta.age", "lte": 3 }]
        },
        "text": "你病得还不会说哪里难受，家里人抱着你等赤脚医生来。药箱在桌上打开，大人轮流听用量和时辰；这一夜后来只留在他们的讲述里。"
      },
      {
        "conditions": {
          "all": [{ "path": "meta.age", "lte": 12 }]
        },
        "text": "赤脚医生到家时先问你哪里疼，又问今天吃过什么。药片很苦，大人在旁边说苦才管用；你暂且相信了前半句。"
      },
      {
        "conditions": {
          "all": [{ "path": "resources.health", "lte": 40 }]
        },
        "text": "赤脚医生背着药箱来看你，把能处理的先处理，又反复嘱咐哪种变化必须往公社或县里送。设备不多，知道自己不能治什么也成了一种本事。"
      },
      {
        "conditions": {
          "all": [{ "path": "resources.wealth", "lte": 42 }]
        },
        "text": "你先问药钱，赤脚医生已经蹲下来量体温。几片药记进合作医疗的账，家里仍要仔细过日子，至少这回没有先把病拖成更贵的病。"
      },
      {
        "conditions": {
          "all": [{ "path": "location.currentCityTier", "eq": "county" }]
        },
        "text": "附近卫生室的人背着药箱下到队里，处理完常见病，又把两个不能耽搁的人写在转诊单上。县城并不遥远，病起来时每段路都有长度。"
      },
      {
        "text": "赤脚医生背着药箱走来，针具在开水里滚过，问诊就在炕边或桌旁完成。条件简陋，谁家该换药、谁该赶紧送诊，他记得比许多人家的日历清楚。"
      }
    ],
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
    "outcomes": [
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
    "outcomes": [
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
    "title": "婚姻法传到身边",
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
            { "path": "location.currentCityTier", "in": ["city", "tier2", "tier1"] }
          ]
        },
        "text": "街道和单位开始宣传新的婚姻法，有人认真听，也有人回家仍照旧规矩说话。法条已经进了城门，要走进每一户人家还需要时间。"
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
    "maxOccurrences": 1,
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
    "maxOccurrences": 1,
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
    "maxOccurrences": 1,
    "baseWeight": 20,
    "text": [
      {
        "conditions": {
          "all": [
            { "path": "meta.age", "lte": 18 }
          ]
        },
        "text": "学校广播介绍劳动模范，老师让大家记下他的事迹。你把那些数字抄进本子，也注意到广播没有说，他下班以后要不要补作业。"
      },
      {
        "conditions": {
          "any": [
            { "path": "career.field", "in": ["factory", "manual_worker", "farm_work"] },
            { "path": "career.status", "eq": "employed" }
          ]
        },
        "text": "车间或田间的广播念起劳动模范，身边人一边听一边没有停手。那份荣誉让人振奋，也悄悄抬高了今天的工额；榜样站在远处，汗落在各自脚边。"
      },
      {
        "text": "广播里念着劳模的名字和完成的指标，大家抬头听了一会儿。被国家看见的荣光很远，你仍把手里的活做得更仔细，顺便想了想普通人的名字通常写在哪里。"
      }
    ],
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
    "maxOccurrences": 1,
    "baseWeight": 22,
    "text": [
      {
        "conditions": {
          "all": [
            { "path": "meta.age", "lte": 14 }
          ]
        },
        "text": "大人把粮票和钱分开叠好，让你去粮店排队。你一路捏着口袋，怕掉的是一张薄纸，回家少的却会是几顿饭。"
      },
      {
        "conditions": {
          "all": [
            { "path": "relationships.children", "gte": 1 }
          ]
        },
        "text": "你在粮店队伍里反复核对全家的定量，孩子长身体，票面却不会跟着长。轮到柜台时，你先问粗粮还有没有，再决定月底几顿饭该怎样搭配。"
      },
      {
        "text": "你拿着粮票排队，前面的人算月份，后面的人打听供应品种。生活不只看手里有多少钱，还要看哪张票没有过期、柜台后面今天剩下什么。"
      }
    ],
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
    "currentRegions": {
      "cityTiers": ["village", "town", "county"]
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
    "maxOccurrences": 1,
    "birthRegions": {
      "hukou": [
        "rural"
      ]
    },
    "currentRegions": {
      "cityTiers": ["village", "town", "county"]
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
    "currentRegions": {
      "cityTiers": ["village", "town", "county"]
    },
    "baseWeight": 16,
    "lifetimeProbability": 0.36,
    "maxOccurrences": 1,
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
    "continuity": {
      "education": {
        "action": "enroll",
        "level": "college",
        "track": "academic",
        "mode": "full_time",
        "durationYears": 3,
        "allowWhileEmployed": true,
        "allowTransfer": true,
        "completeCurrentOnEnroll": true
      }
    },
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
    "text": [
      {
        "conditions": {
          "all": [
            { "path": "meta.age", "lte": 12 }
          ]
        },
        "text": "那一年，学校几次组织大家听广播、低头默哀。你未必明白每个名字同国家有什么关系，只记得老师的声音很轻，操场上那么多人，竟能同时安静下来。"
      },
      {
        "conditions": { "all": [{ "path": "career.field", "in": ["factory", "manual_worker", "construction"] }] },
        "text": "广播传来讣告，单位停下手里的活组织悼念。有人真心落泪，有人只把帽子攥在手里；机器重新响起后，大家仍压低声音谈论接下来会怎样。"
      },
      {
        "conditions": { "all": [{ "path": "location.currentCityTier", "in": ["village", "town"] }, { "path": "meta.age", "gte": 13 }] },
        "text": "讣告从村里的喇叭传来，田里的人陆续停下手。风把后半句吹得断断续续，大家回去以后又找收音机核对；那一年，连沉默也常要靠信号接力。"
      },
      {
        "conditions": { "all": [{ "path": "career.field", "in": ["teacher", "education", "public_sector", "grassroots_post"] }] },
        "text": "你在学校或基层单位帮着安排悼念，桌上的名单、黑纱和广播时间写得很具体，关于未来的话却没人敢写。仪式结束后，大家收椅子的声音比平常轻。"
      },
      {
        "conditions": { "all": [{ "path": "meta.age", "gte": 60 }] },
        "text": "广播里的讣告接连传来，你已经见过几次时代转弯，仍觉得这一年的安静不同。家里有人想问以后会怎样，话到嘴边只剩一句：先把收音机再调清楚些。"
      },
      {
        "text": "一九七六年的讣告接连从广播里传来，家人围坐着听，谁也没有急着发表意见。你说不清未来，只觉得熟悉的政治语言忽然失去了几个最常被提起的人。"
      }
    ],
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
  },
  {
    id: "era_patriotic_health_fly_swatter",
    title: "苍蝇也有指标",
    category: "health",
    yearRange: [1952, 1960],
    ageRange: [8, 60],
    maxOccurrences: 1,
    baseWeight: 20,
    text: "街道和学校发起爱国卫生运动，你拿着苍蝇拍四处巡查。窗台擦亮了，水沟清了；只是苍蝇从不看通知，给集体工作增加了不少技术难度。",
    effects: [
      { path: "resources.health", add: 3 },
      { path: "resources.happiness", add: 1 },
      { addTag: "patriotic_health_memory" }
    ]
  },
  {
    id: "era_child_vaccination_queue",
    title: "胳膊上的小疤",
    category: "health",
    yearRange: [1950, 1967],
    ageRange: [0, 8],
    maxOccurrences: 1,
    baseWeight: 25,
    text: [
      {
        conditions: { all: [{ path: "meta.age", lte: 1 }] },
        text: "大人用棉被角裹着你去接种，队伍从诊室排到院里。你后来没有这段记忆，家人却一直记得那声哭有多响——前面几家孩子也可作证。"
      },
      {
        conditions: { all: [{ path: "location.currentCityTier", in: ["county", "city", "tier2", "tier1"] }] },
        text: "街道通知孩子按次序接种，大人拿着登记纸在卫生院排队。针头、酒精棉和哭声轮流经过，护士写字比哄人快，队伍因此还能向前挪。"
      },
      {
        conditions: { all: [{ path: "birth.hukou", eq: "rural" }] },
        text: "接种人员来到乡里，家长抱着孩子从各处赶来。名字在纸上逐个勾掉，哭声则从屋里传到院外；看不见的疾病，第一次有了这样具体的一支队伍。"
      },
      {
        conditions: { all: [{ path: "resources.wealth", lte: 30 }] },
        text: "家里手头很紧，仍按通知带你去接种。针剂不靠家中存款决定，排队的人也因此站在同一条长凳旁；轮到你时，大人先替你把袖口卷好。"
      },
      {
        text: "大人带你去接种，针头带来一阵哭声，也在胳膊上留下一枚小疤。许多年后，你未必记得那天，却一直带着那次公共卫生行动留下的保护。"
      }
    ],
    effects: [
      { path: "resources.health", add: 7 },
      { path: "relationships.family", add: 2 },
      { addTag: "early_vaccination_memory" }
    ]
  },
  {
    id: "era_infant_cloth_ticket_bundle",
    title: "小被子里的布票",
    category: "family",
    yearRange: [1955, 1977],
    ageRange: [0, 3],
    maxOccurrences: 1,
    baseWeight: 18,
    text: "家里攒出布票，给你缝了一床小被子。新棉花不够，就把旧袄拆开续进去；被角花色各不相同，亲人的手却把它们缝成了同一个暖处。",
    effects: [
      { path: "resources.health", add: 3 },
      { path: "relationships.family", add: 5 },
      { path: "resources.wealth", add: -2 },
      { addTag: "rationed_childhood_care" }
    ]
  },
  {
    id: "era_work_unit_nursery_child",
    title: "单位托儿所",
    category: "family",
    yearRange: [1953, 1976],
    ageRange: [1, 6],
    birthFamilyClasses: ["worker_family", "state_worker", "cadre_family", "intellectual_family"],
    currentRegions: { cityTiers: ["county", "city", "tier2", "tier1"] },
    maxOccurrences: 1,
    baseWeight: 24,
    text: "父母上班前把你送进单位托儿所。铁皮小床排成一行，阿姨一声令下，几十只小勺同时碰碗；集体生活的第一课，是哭也最好别挑同一个时辰。",
    effects: [
      { path: "relationships.friendship", add: 3 },
      { path: "resources.health", add: 2 },
      { path: "relationships.family", add: -1 },
      { addTag: "work_unit_nursery_child" }
    ]
  },
  {
    id: "era_primary_school_slate_pencil",
    title: "石板上的一行字",
    category: "school",
    yearRange: [1951, 1965],
    ageRange: [6, 12],
    maxOccurrences: 1,
    baseWeight: 22,
    text: "你用石板和石笔练字，写满了就拿袖口擦掉。字迹留不住，手腕却一天天稳下来；老师说知识要积累，你觉得袖口上的白灰倒是先积累得很快。",
    effects: [
      { path: "education.score", add: 5 },
      { path: "resources.happiness", add: 2 },
      { addTag: "slate_school_memory" }
    ]
  },
  {
    id: "era_pinyin_wall_chart",
    title: "墙上的拼音表",
    category: "school",
    yearRange: [1958, 1966],
    ageRange: [6, 13],
    maxOccurrences: 1,
    baseWeight: 20,
    text: "教室墙上贴起汉语拼音表，你跟着老师把声母韵母一遍遍念齐。有人把四声拐得像山路，全班笑完再重来；陌生的字，开始有了可以问路的办法。",
    effects: [
      { path: "education.score", add: 6 },
      { path: "attrs.intelligence", add: 1 },
      { addTag: "early_pinyin_learner" }
    ]
  },
  {
    id: "era_rural_combined_grade_class",
    title: "一间教室几个年级",
    category: "school",
    yearRange: [1952, 1977],
    ageRange: [7, 14],
    currentRegions: { hukou: ["rural"], cityTiers: ["village", "town"] },
    maxOccurrences: 1,
    baseWeight: 24,
    text: "村小只有一间教室，几个年级朝着同一块黑板。老师给高年级讲算术时，你低头认字；等他转过身，你也顺便偷听懂了一点明年的功课。",
    effects: [
      { path: "education.score", add: 5 },
      { path: "attrs.mental", add: 1 },
      { addTag: "rural_combined_class" }
    ]
  },
  {
    id: "era_school_collective_labor_day",
    title: "课桌搬到田边",
    category: "school",
    yearRange: [1958, 1976],
    ageRange: [9, 18],
    maxOccurrences: 1,
    baseWeight: 22,
    text: "学校安排集体劳动，你和同学去田里、工地或车间帮忙。书本上的劳动很整齐，真正的泥土却会钻进鞋里；一天结束，你对这两个字有了腰酸背痛的注释。",
    effects: [
      { path: "resources.health", add: -2 },
      { path: "education.score", add: 2 },
      { path: "resources.achievement", add: 2 },
      { addTag: "school_labor_memory" }
    ]
  },
  {
    id: "era_urban_latchkey_child",
    title: "钥匙挂在脖子上",
    category: "family",
    yearRange: [1960, 1977],
    ageRange: [7, 14],
    birthFamilyClasses: ["worker_family", "state_worker", "cadre_family", "intellectual_family", "small_trader_transformed"],
    currentRegions: { cityTiers: ["county", "city", "tier2", "tier1"] },
    maxOccurrences: 1,
    baseWeight: 20,
    text: "父母都在上班，家门钥匙用线穿好挂在你脖子上。放学后你先烧水、再看弟妹，年纪不大，却已经是半个当家人；唯一的威严，是不许别人乱动煤炉。",
    effects: [
      { path: "resources.freedom", add: 3 },
      { path: "relationships.family", add: 3 },
      { path: "attrs.mental", add: 1 },
      { addTag: "urban_latchkey_child" }
    ]
  },
  {
    id: "era_rural_child_collects_manure",
    title: "粪筐里的勤快",
    category: "family",
    yearRange: [1960, 1977],
    ageRange: [7, 15],
    currentRegions: { hukou: ["rural"], cityTiers: ["village", "town"] },
    maxOccurrences: 1,
    baseWeight: 18,
    text: "清早你背着小筐出门拾粪，给生产队或自家地里攒肥。路上几个孩子暗暗比较收成，谁也没想到童年的胜负心，有一天会这样朴素地冒着热气。",
    effects: [
      { path: "resources.health", add: 1 },
      { path: "resources.wealth", add: 2 },
      { path: "resources.happiness", add: 1 },
      { addTag: "rural_child_labor" }
    ]
  },
  {
    id: "era_1970s_school_returns",
    title: "教室重新坐满",
    category: "school",
    yearRange: [1971, 1977],
    ageRange: [8, 20],
    maxOccurrences: 1,
    baseWeight: 28,
    conditions: {
      any: [
        { hasTag: "interrupted_schooling" },
        { hasTag: "school_paused_memory" }
      ]
    },
    text: "学校渐渐恢复上课，你又坐回教室。教材、教师和秩序都还不完整，落下的年月也补不齐；但粉笔重新划过黑板时，你仍把那声音听成一条窄窄的路。",
    effects: [
      { path: "education.score", add: 7 },
      { path: "resources.happiness", add: 3 },
      { addTag: "schooling_partly_resumed" }
    ]
  },
  {
    id: "era_soldier_family_letter_wait",
    title: "军邮来的薄信",
    category: "family",
    yearRange: [1950, 1977],
    ageRange: [5, 65],
    birthFamilyClasses: ["soldier_family"],
    maxOccurrences: 1,
    baseWeight: 28,
    text: "家里等到一封军邮，信纸很薄，只写训练、天气和一切都好。没写的部分反而更重，大人把信折回原样，压在箱底最稳妥的地方。",
    effects: [
      { path: "relationships.family", add: 5 },
      { path: "resources.happiness", add: 1 },
      { path: "attrs.mental", add: 1 },
      { addTag: "soldier_family_letter" }
    ]
  },
  {
    id: "era_street_committee_household_book",
    title: "街道名册",
    category: "family",
    yearRange: [1951, 1957],
    ageRange: [18, 70],
    currentRegions: { cityTiers: ["county", "city", "tier2", "tier1"] },
    maxOccurrences: 1,
    baseWeight: 18,
    text: "街道干部挨户登记人口、住处和营生。邻里从此既是熟人，也是名册上的一行；你第一次感到，一座城市可以从灶台和门牌开始被重新组织。",
    effects: [
      { path: "resources.freedom", add: -2 },
      { path: "relationships.friendship", add: 2 },
      { addTag: "street_committee_registry" }
    ]
  },
  {
    id: "era_joint_state_private_shop_abacus",
    title: "算盘换了主人",
    category: "career",
    yearRange: [1955, 1957],
    ageRange: [16, 65],
    birthFamilyClasses: ["craftsman", "shop_clerk", "merchant", "small_trader_transformed"],
    currentRegions: { cityTiers: ["town", "county", "city", "tier2", "tier1"] },
    maxOccurrences: 1,
    baseWeight: 32,
    text: "店铺挂上公私合营的新牌子，柜台、账本和算盘仍在原处，身份却变了。你照常开门做事，只是每拨一颗算珠，都要重新弄懂这笔账算给谁。",
    effects: [
      { path: "career.status", set: "employed" },
      { path: "career.field", set: "grassroots_post" },
      { path: "career.income", add: 5 },
      { path: "resources.freedom", add: -5 },
      { addTag: "joint_state_private_shop" }
    ]
  },
  {
    id: "era_urban_household_grain_book",
    title: "粮本上的人口",
    category: "wealth",
    yearRange: [1958, 1977],
    ageRange: [14, 80],
    currentRegions: { hukou: ["urban"], cityTiers: ["county", "city", "tier2", "tier1"] },
    maxOccurrences: 1,
    baseWeight: 26,
    text: [
      {
        conditions: { all: [{ path: "meta.age", lte: 18 }] },
        text: "粮本写着全家人口和定量，大人让你拿它去粮店时反复叮嘱不能折、不能丢。你对制度还没有概念，只知道柜台盖下一个章，家里的米缸便多出这个月的刻度。"
      },
      {
        conditions: { any: [{ path: "relationships.children", gte: 1 }, { path: "resources.wealth", lte: 38 }] },
        text: "你按粮本核对一家老小的定量，谁出差、谁生病、孩子又长了饭量，都要在同一页数字里周转。月底锅里还剩多少，常比任何算术题都更准确。"
      },
      {
        text: "家里按户口领粮本，人口、定量和月份写得清清楚楚。你把它同粮票一起夹在抽屉深处；吃饭仍是家事，也从此成了表格、印章和供应日期的事。"
      }
    ],
    effects: [
      { path: "resources.wealth", add: 1 },
      { path: "resources.freedom", add: -4 },
      { path: "attrs.mental", add: 1 },
      { addTag: "urban_grain_book" }
    ]
  },
  {
    id: "era_cloth_ticket_coat_handoff",
    title: "旧棉袄往下传",
    category: "family",
    yearRange: [1955, 1977],
    ageRange: [5, 18],
    maxOccurrences: 1,
    baseWeight: 20,
    text: [
      {
        conditions: { all: [{ path: "resources.wealth", lte: 32 }] },
        text: "家里把一件穿小的旧棉袄拆洗、续棉，再改到你身上。布票和棉花都紧，袖口便先学会兼任补丁；针脚不整齐，寒风倒没挑出多少毛病。"
      },
      {
        conditions: { all: [{ path: "birth.hukou", eq: "rural" }] },
        text: "旧棉袄在炕边拆开，能用的棉花重新拍松，磨薄处补上另一块布。它从亲属家传到你家，颜色一路变化，保暖这件事却始终很务实。"
      },
      {
        conditions: { all: [{ path: "meta.age", lte: 8 }] },
        text: "大人把旧棉袄改小给你，袖子仍长，先向里折了两道。你跑起来像临时借来一双胳膊，等到开春，那两道折痕才慢慢放出来。"
      },
      {
        conditions: { all: [{ path: "birth.familyClass", "in": ["worker_family", "state_worker", "cadre_family", "intellectual_family"] }] },
        text: "家里拿布票添一点新布，把旧棉袄的里外重新翻过。领口看着新，里面仍是几年前的棉花；计划供应年代的体面，常很懂得把旧日子翻到内侧。"
      },
      {
        text: "一件旧棉袄拆洗补好后轮到你穿。袖口颜色和衣身不太一致，针脚记着几次修改；衣服没有家谱，却把一家人的身量都留在里面。"
      }
    ],
    effects: [
      { path: "resources.wealth", add: 2 },
      { path: "relationships.family", add: 4 },
      { path: "resources.health", add: 2 },
      { addTag: "handed_down_coat" }
    ]
  },
  {
    id: "era_factory_master_teaches_gauge",
    title: "师傅的卡尺",
    category: "career",
    yearRange: [1953, 1977],
    ageRange: [16, 35],
    conditions: {
      any: [
        { path: "career.field", eq: "factory" },
        { hasTag: "factory_worker" }
      ]
    },
    maxOccurrences: 1,
    baseWeight: 30,
    text: "老工人把卡尺递给你，教你听机器的异响、看零件的毛刺。他不爱讲大道理，只在你差半毫米时敲敲台面；手艺就是这样，从一次次不肯将就里传下来。",
    effects: [
      { path: "career.level", add: 6 },
      { path: "resources.achievement", add: 5 },
      { path: "relationships.friendship", add: 4 },
      { addTag: "factory_apprenticeship" }
    ]
  },
  {
    id: "era_factory_lunchbox_steam",
    title: "饭盒排队蒸",
    category: "career",
    yearRange: [1954, 1977],
    ageRange: [16, 60],
    conditions: {
      any: [
        { path: "career.field", eq: "factory" },
        { hasTag: "factory_worker" }
      ]
    },
    maxOccurrences: 1,
    baseWeight: 20,
    text: "上工前大家把铝饭盒码进蒸箱，盖上都刻着名字。开饭时热气一涌，菜味彼此串门；你家的咸菜偶尔沾上一点别人的肉香，也算完成了短暂的物资交流。",
    effects: [
      { path: "resources.health", add: 1 },
      { path: "relationships.friendship", add: 3 },
      { path: "resources.happiness", add: 2 },
      { addTag: "factory_lunchbox_memory" }
    ]
  },
  {
    id: "era_factory_safety_guard_added",
    title: "给机器补上护罩",
    category: "health",
    yearRange: [1955, 1977],
    ageRange: [18, 60],
    conditions: {
      any: [
        { path: "career.field", eq: "factory" },
        { hasTag: "factory_worker" }
      ]
    },
    maxOccurrences: 1,
    baseWeight: 17,
    text: "车间出过一次险情后，师傅们连夜给皮带轮补护罩。事故报告只有几页，伤口却要长很久；你从此每次开机前，都多看一眼手和机器之间的距离。",
    effects: [
      { path: "resources.health", add: 3 },
      { path: "career.level", add: 2 },
      { path: "attrs.mental", add: 1 },
      { addTag: "factory_safety_memory" }
    ]
  },
  {
    id: "era_work_unit_clinic_visit",
    title: "厂医听诊",
    category: "health",
    yearRange: [1953, 1977],
    ageRange: [18, 65],
    conditions: {
      all: [
        { path: "career.status", eq: "employed" },
        { path: "resources.health", lte: 72 }
      ]
    },
    currentRegions: { cityTiers: ["town", "county", "city", "tier2", "tier1"] },
    maxOccurrences: 1,
    baseWeight: 23,
    text: "你咳了几天，去单位医务室让厂医听诊。药品不算齐全，病假条却写得很端正；有人替你顶了一班，你才承认身体也有权暂时停机。",
    effects: [
      { path: "resources.health", add: 7 },
      { path: "relationships.friendship", add: 2 },
      { path: "career.income", add: -1 },
      { addTag: "work_unit_clinic_memory" }
    ]
  },
  {
    id: "era_factory_mother_nursery_dash",
    title: "下班铃与托儿所",
    category: "family",
    yearRange: [1955, 1976],
    ageRange: [20, 42],
    genders: ["female"],
    conditions: {
      all: [
        { path: "relationships.children", gte: 1 }
      ],
      any: [
        { path: "career.field", eq: "factory" },
        { hasTag: "factory_worker" }
      ]
    },
    maxOccurrences: 1,
    baseWeight: 26,
    text: "下班铃一响，你先把工具归位，再赶去托儿所接孩子。车间说妇女能顶半边天，家里的另外半边却不会因此少洗一件衣裳；你把两边都接住，手一直没闲。",
    effects: [
      { path: "resources.health", add: -3 },
      { path: "relationships.family", add: 5 },
      { path: "resources.achievement", add: 3 },
      { addTag: "working_mother_double_shift" }
    ]
  },
  {
    id: "era_work_unit_room_allocation",
    title: "分到一间屋",
    category: "family",
    yearRange: [1955, 1977],
    ageRange: [22, 50],
    currentRegions: { cityTiers: ["county", "city", "tier2", "tier1"] },
    conditions: {
      all: [
        { path: "career.status", eq: "employed" },
        { path: "relationships.partnerStatus", in: ["partnered", "married"] }
      ]
    },
    maxOccurrences: 1,
    baseWeight: 18,
    text: [
      {
        conditions: { all: [{ path: "relationships.children", gte: 1 }] },
        text: "单位终于分下一间屋，面积不大，门窗也旧。你和爱人拿粉笔在地上比划床、桌子和孩子的位置；几平方米被反复安排，竟也慢慢长出了家的样子。",
      },
      { text: "单位终于分下一间屋，面积不大，门窗也旧。你和爱人拿粉笔在地上比划床、桌子和柜子的位置；几平方米被反复安排，竟也慢慢长出了家的样子。" },
    ],
    effects: [
      { path: "resources.wealth", add: 5 },
      { path: "resources.happiness", add: 7 },
      { path: "relationships.family", add: 5 },
      { path: "resources.freedom", add: -2 },
      { addTag: "work_unit_housing" }
    ]
  },
  {
    id: "era_work_unit_radio_exercise",
    title: "广播操站位",
    category: "health",
    yearRange: [1954, 1977],
    ageRange: [16, 60],
    conditions: { all: [{ path: "career.status", eq: "employed" }] },
    currentRegions: { cityTiers: ["town", "county", "city", "tier2", "tier1"] },
    maxOccurrences: 1,
    baseWeight: 17,
    text: "广播一响，全单位到院里做操。前排动作标准，后排各有理解；你伸展了十分钟，回来继续弯腰工作，至少证明身体曾短暂拥有过统一的方向。",
    effects: [
      { path: "resources.health", add: 3 },
      { path: "relationships.friendship", add: 2 },
      { path: "resources.happiness", add: 1 },
      { addTag: "work_unit_exercise" }
    ]
  },
  {
    id: "era_mended_work_gloves",
    title: "补了又补的手套",
    category: "family",
    yearRange: [1953, 1977],
    ageRange: [18, 60],
    conditions: {
      any: [
        { path: "career.field", eq: "factory" },
        { hasTag: "factory_worker" }
      ]
    },
    maxOccurrences: 1,
    baseWeight: 18,
    text: "劳动手套磨破了，家里用厚布一层层补上。新的那双舍不得领得太勤，旧的又不能真让手指露出来；针线在掌心绕过机器留下的油，也绕过一家人的细算。",
    effects: [
      { path: "resources.wealth", add: 2 },
      { path: "resources.health", add: 2 },
      { path: "relationships.family", add: 3 },
      { addTag: "mended_work_gloves" }
    ]
  },
  {
    id: "era_workpoint_public_recount",
    title: "工分要当面算",
    category: "career",
    yearRange: [1958, 1977],
    ageRange: [16, 70],
    currentRegions: { hukou: ["rural"], cityTiers: ["village", "town"] },
    conditions: {
      any: [
        { path: "career.field", eq: "production_team" },
        { hasTag: "collective_laborer" }
      ]
    },
    maxOccurrences: 1,
    baseWeight: 27,
    text: "年终分配前，队里把每户工分当众念一遍。谁少记半天、谁的重活该算几分，平日压着的话都挤到煤油灯下；账算到最后，最响的往往不是算盘。",
    effects: [
      { path: "resources.wealth", add: 3 },
      { path: "relationships.friendship", add: -2 },
      { path: "resources.reputation", add: 2 },
      { addTag: "workpoint_recount_memory" }
    ]
  },
  {
    id: "era_rural_woman_busy_season",
    title: "双抢里的两副担子",
    category: "family",
    yearRange: [1958, 1977],
    ageRange: [18, 50],
    genders: ["female"],
    currentRegions: { hukou: ["rural"], cityTiers: ["village", "town"] },
    maxOccurrences: 1,
    baseWeight: 28,
    text: [
      {
        conditions: { all: [{ path: "relationships.children", gte: 1 }] },
        text: "农忙时你白天下田抢收抢种，天黑后还要烧饭、洗衣、哄孩子。工分本只记下田里的那一段，灶台旁的劳动没有格子可填；你累得沉默，却知道一家人的日子正压在这两副担子上。",
      },
      { text: "农忙时你白天下田抢收抢种，天黑后还要烧饭、洗衣、照料一家人的零碎。工分本只记下田里的那一段，灶台旁的劳动没有格子可填；你累得沉默，两副担子却一副也不会自己变轻。" },
    ],
    effects: [
      { path: "resources.health", add: -5 },
      { path: "relationships.family", add: 5 },
      { path: "resources.achievement", add: 2 },
      { addTag: "rural_woman_double_labor" }
    ]
  },
  {
    id: "era_production_team_night_accounting",
    title: "替生产队算账",
    category: "career",
    yearRange: [1962, 1977],
    ageRange: [18, 55],
    currentRegions: { hukou: ["rural"], cityTiers: ["village", "town"] },
    conditions: {
      all: [{ path: "education.score", gte: 34 }],
      any: [
        { path: "career.field", eq: "production_team" },
        { hasTag: "collective_laborer" },
        { path: "career.status", eq: "family_labor" }
      ]
    },
    maxOccurrences: 1,
    baseWeight: 20,
    text: "队里看你识字算数，叫你晚上帮忙核工分和口粮。煤油灯下，每一笔都连着一家人的饭碗；你写得比从前更慢，因为数字一旦落错，挨饿的不会是纸。",
    effects: [
      { path: "career.level", add: 4 },
      { path: "resources.reputation", add: 5 },
      { path: "attrs.mental", add: 1 },
      { addTag: "production_team_accountant" }
    ]
  },
  {
    id: "era_first_tractor_shift",
    title: "拖拉机进了田",
    category: "career",
    yearRange: [1965, 1977],
    ageRange: [16, 55],
    currentRegions: {
      provinces: ["heilongjiang", "jilin", "liaoning", "hebei", "henan", "shandong", "anhui", "jiangsu"],
      hukou: ["rural"],
      cityTiers: ["village", "town"]
    },
    maxOccurrences: 1,
    baseWeight: 17,
    text: "公社的拖拉机第一次开进附近田里，孩子跟着跑，大人围着看。机器能顶许多牛力，也会在最忙时趴窝；你闻着柴油味，知道农业的未来先得学会修理。",
    effects: [
      { path: "resources.achievement", add: 3 },
      { path: "education.score", add: 2 },
      { path: "resources.happiness", add: 3 },
      { addTag: "early_tractor_memory" }
    ]
  },
  {
    id: "era_commune_winter_waterworks",
    title: "冬天修水利",
    category: "career",
    yearRange: [1963, 1976],
    ageRange: [16, 60],
    currentRegions: { hukou: ["rural"], cityTiers: ["village", "town"] },
    maxOccurrences: 1,
    baseWeight: 21,
    text: "冬闲时队里组织修渠筑坝，你挑土、夯坡，手掌裂出血口。工程有的后来真挡住旱涝，有的只在汇报里壮观；你记得最清楚的，是冻土落进筐里的分量。",
    effects: [
      { path: "resources.health", add: -4 },
      { path: "resources.achievement", add: 3 },
      { path: "resources.reputation", add: 2 },
      { addTag: "commune_waterworks" }
    ]
  },
  {
    id: "era_rural_hosts_sent_down_youth",
    title: "知青住进队里",
    category: "family",
    yearRange: [1968, 1976],
    ageRange: [25, 70],
    currentRegions: { hukou: ["rural"], cityTiers: ["village", "town"] },
    conditions: { none: [{ hasTag: "sent_down_youth" }] },
    maxOccurrences: 1,
    baseWeight: 22,
    text: "一批城里青年住进生产队，你教他们认庄稼、烧土灶，也看着他们在夜里想家。彼此都被时代安排到这里：他们带来远方的书和口音，你们教会他们泥土并不抽象。",
    effects: [
      { path: "relationships.friendship", add: 5 },
      { path: "education.score", add: 2 },
      { path: "resources.wealth", add: -1 },
      { addTag: "hosted_sent_down_youth" }
    ]
  },
  {
    id: "era_third_front_family_letter",
    title: "山沟厂里的家书",
    category: "family",
    yearRange: [1965, 1977],
    ageRange: [20, 58],
    conditions: { all: [{ hasTag: "third_front_builder" }] },
    maxOccurrences: 1,
    baseWeight: 32,
    text: [
      {
        conditions: { all: [{ path: "relationships.children", gte: 1 }] },
        text: "三线厂区离家很远，你在信里写机器已经安装、宿舍不漏雨，却没写山路封雪和孩子发烧时赶不回去。建设的尺度很大，牵挂仍按一封信、一张车票来计算。",
      },
      { text: "三线厂区离家很远，你在信里写机器已经安装、宿舍不漏雨，却没写山路封雪和家里有人生病时赶不回去。建设的尺度很大，牵挂仍按一封信、一张车票来计算。" },
    ],
    effects: [
      { path: "relationships.family", add: 4 },
      { path: "resources.happiness", add: -2 },
      { path: "attrs.mental", add: 1 },
      { addTag: "third_front_family_distance" }
    ]
  },
  {
    id: "era_urban_air_raid_shelter",
    title: "楼下挖防空洞",
    category: "career",
    yearRange: [1969, 1972],
    ageRange: [14, 65],
    currentRegions: { cityTiers: ["county", "city", "tier2", "tier1"] },
    maxOccurrences: 1,
    baseWeight: 30,
    text: "形势紧张，街道和单位组织挖防空洞。你轮班运土，回家时鞋里全是沙；人们讨论远处可能发生的战争，手里却先得解决一筐土往哪里倒。",
    effects: [
      { path: "resources.health", add: -3 },
      { path: "resources.freedom", add: -3 },
      { path: "relationships.friendship", add: 2 },
      { addTag: "air_raid_shelter_memory" }
    ]
  },
  {
    id: "era_schistosomiasis_control_team",
    title: "血吸虫病防治队",
    category: "health",
    yearRange: [1955, 1970],
    ageRange: [5, 65],
    currentRegions: {
      provinces: ["jiangsu", "zhejiang", "anhui", "jiangxi", "hubei", "hunan", "sichuan", "yunnan", "guangdong", "guangxi"],
      hukou: ["rural"],
      cityTiers: ["village", "town"]
    },
    maxOccurrences: 1,
    baseWeight: 24,
    text: "防治队到村里查病、灭螺，反复叮嘱别赤脚下疫水。那些年大肚子、乏力常被当成命苦，如今第一次有人沿着沟渠和身体，一寸寸追问病从哪里来。",
    effects: [
      { path: "resources.health", add: 8 },
      { path: "education.score", add: 2 },
      { addTag: "schistosomiasis_control_memory" }
    ]
  },
  {
    id: "era_new_method_midwife",
    title: "产房里的开水",
    category: "health",
    yearRange: [1952, 1970],
    ageRange: [18, 42],
    genders: ["female"],
    conditions: {
      all: [
        { path: "relationships.partnerStatus", in: ["partnered", "married"] },
        { path: "relationships.children", gte: 1 }
      ]
    },
    maxOccurrences: 1,
    baseWeight: 22,
    text: "生产时，新法接生员带来消毒过的剪刀、纱布和一盆滚开的水。疼痛没有因此变轻，危险却少了一层；你抱住孩子时，也记住了干净的器具怎样把一条命稳稳接住。",
    effects: [
      { path: "resources.health", add: 7 },
      { path: "relationships.family", add: 6 },
      { path: "resources.happiness", add: 4 },
      { addTag: "new_method_childbirth" }
    ]
  },
  {
    id: "era_hidden_books_in_ceiling",
    title: "书藏到梁上",
    category: "family",
    yearRange: [1966, 1971],
    ageRange: [12, 70],
    maxOccurrences: 1,
    baseWeight: 17,
    conditions: {
      any: [
        { hasTag: "intellectual_family" },
        { path: "education.score", gte: 58 }
      ]
    },
    text: "家里把几本旧书包好，藏进屋梁或箱底。不是每本书都危险，可没人知道危险会怎样被定义；你摸黑放好最后一本，第一次明白保存文字也可能需要胆量。",
    effects: [
      { path: "resources.freedom", add: -7 },
      { path: "resources.happiness", add: -5 },
      { path: "attrs.mental", add: 1 },
      { addTag: "hidden_books_memory" }
    ]
  },
  {
    id: "era_factory_faction_stoppage",
    title: "车间停转的日子",
    category: "career",
    yearRange: [1967, 1969],
    ageRange: [16, 65],
    conditions: {
      any: [
        { path: "career.field", eq: "factory" },
        { hasTag: "factory_worker" }
      ]
    },
    maxOccurrences: 1,
    baseWeight: 28,
    text: "争论和派性进入车间，机器断断续续停转，熟悉的同事也站到不同一边。你守着工位，不知道一句话会把人推到哪里；生产可以恢复，彼此的信任却没有统一的检修规程。",
    effects: [
      { path: "career.income", add: -4 },
      { path: "relationships.friendship", add: -7 },
      { path: "resources.happiness", add: -6 },
      { addTag: "factory_faction_stoppage" }
    ]
  },
  {
    id: "era_rural_cooperative_medical_fee",
    title: "五角钱的合作医疗",
    category: "health",
    yearRange: [1968, 1976],
    ageRange: [18, 70],
    currentRegions: { hukou: ["rural"], cityTiers: ["village", "town"] },
    maxOccurrences: 1,
    baseWeight: 22,
    text: "队里商量办合作医疗，每人凑一点钱和粮，平常小病能少拖几天。账不大，争论不少；可真有人半夜高烧时，大家才明白这点共同出的份子，是给陌生的明天留一条路。",
    effects: [
      { path: "resources.wealth", add: -1 },
      { path: "resources.health", add: 6 },
      { path: "relationships.friendship", add: 3 },
      { addTag: "rural_cooperative_healthcare" }
    ]
  },
  {
    id: "era_rural_substitute_teacher",
    title: "站到村小讲台上",
    category: "career",
    yearRange: [1962, 1977],
    ageRange: [18, 38],
    currentRegions: { hukou: ["rural"], cityTiers: ["village", "town"] },
    conditions: {
      all: [{ path: "education.score", gte: 40 }],
      none: [{ path: "career.field", eq: "factory" }]
    },
    maxOccurrences: 1,
    baseWeight: 16,
    text: "村小缺老师，队里让识字较多的你先顶上。工资和工分都不算宽裕，教具也常靠自己做；孩子们把问题举得很高，你只好一边备课，一边继续学习怎样回答。",
    effects: [
      { path: "career.status", set: "employed" },
      { path: "career.field", set: "grassroots_post" },
      { path: "career.income", add: 5 },
      { path: "resources.reputation", add: 6 },
      { addTag: "rural_substitute_teacher" }
    ]
  },
  {
    id: "era_barefoot_doctor_training",
    title: "背起药箱",
    category: "career",
    yearRange: [1968, 1976],
    ageRange: [18, 38],
    currentRegions: { hukou: ["rural"], cityTiers: ["village", "town"] },
    conditions: {
      all: [{ path: "education.score", gte: 34 }],
      none: [
        { path: "career.field", eq: "factory" },
        { hasTag: "rural_substitute_teacher" }
      ]
    },
    maxOccurrences: 1,
    baseWeight: 14,
    text: "公社选你去学常见病、针灸和基本急救，培训不长，责任却很快落到肩上。你背着药箱走村串户，知道自己能治的有限，于是比谁都认真分辨哪些病不能再等。",
    effects: [
      { path: "career.status", set: "employed" },
      { path: "career.field", set: "grassroots_post" },
      { path: "career.income", add: 4 },
      { path: "resources.reputation", add: 7 },
      { path: "resources.achievement", add: 5 },
      { addTag: "trained_barefoot_doctor" }
    ]
  },
  {
    id: "era_grassroots_postman_bicycle",
    title: "邮包压住后座",
    category: "career",
    yearRange: [1955, 1977],
    ageRange: [18, 58],
    conditions: { all: [{ path: "career.field", eq: "grassroots_post" }] },
    currentRegions: { cityTiers: ["village", "town", "county"] },
    maxOccurrences: 1,
    baseWeight: 16,
    text: "你骑车把信件、汇款单和报纸送进村巷，后座邮包压得车轮发沉。有人盼录取通知，有人只等一句平安；你不能拆信，却渐渐认识了每扇门后最着急的那件事。",
    effects: [
      { path: "career.level", add: 4 },
      { path: "relationships.friendship", add: 5 },
      { path: "resources.health", add: 2 },
      { addTag: "grassroots_postal_route" }
    ]
  }
];
