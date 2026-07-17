// Auto-split event data. Keep events in this file focused on one era or theme.
export const coreLifecycleEvents = [
  {
    "id": "life_birth_ordinary_room",
    "title": "出生",
    "category": "birth",
    "ageRange": [
      0,
      0
    ],
    "priority": 90,
    "maxOccurrences": 1,
    "baseWeight": 100,
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
            },
            {
              "path": "birth.year",
              "lte": 1990
            }
          ]
        },
        "text": "你出生了。屋里先安静了一下，又很快忙起来；有人说女孩也好，声音轻得像怕被旧规矩听见。"
      },
      {
        "conditions": {
          "all": [
            {
              "path": "birth.gender",
              "eq": "male"
            },
            {
              "path": "meta.currentYear",
              "lte": 1979
            },
            {
              "path": "birth.hukou",
              "eq": "rural"
            }
          ]
        },
        "text": "你出生了。家里人把香火、姓氏和以后的力气都悄悄放到你身上，而你只是攥着小拳头睡着。"
      },
      {
        "text": "你出生了。窗外的时代照常奔涌，屋里的人先数你的手指，再给你取一个要用很多年的名字。"
      }
    ],
    "effects": [
      {
        "path": "relationships.family",
        "add": 6
      },
      {
        "path": "resources.happiness",
        "add": 2
      },
      {
        "addTag": "born"
      }
    ]
  },
  {
    "id": "life_birth_hard_beginning",
    "title": "艰难降生",
    "category": "health",
    "ageRange": [
      0,
      0
    ],
    "priority": 86,
    "maxOccurrences": 1,
    "baseWeight": 4,
    "weightModifiers": [
      {
        "path": "attrs.physique",
        "lte": 2,
        "multiply": 2
      },
      {
        "path": "resources.health",
        "lte": 40,
        "multiply": 2
      },
      {
        "path": "environment.healthcareAccess",
        "lte": 3,
        "multiply": 1.8
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
              "path": "meta.currentYear",
              "lte": 1979
            },
            {
              "path": "environment.healthcareAccess",
              "lte": 3
            }
          ]
        },
        "text": "你来得并不轻松。大人们围在昏暗的灯下，先盼你活下来，再把没说出口的失望咽回去。"
      },
      {
        "text": "你来得并不轻松。大人们围在昏暗的灯下，连松一口气都像怕惊动命运。"
      }
    ],
    "effects": [
      {
        "path": "resources.health",
        "add": -10
      },
      {
        "path": "relationships.family",
        "add": 4
      },
      {
        "addTag": "hard_birth"
      }
    ]
  },
  {
    "id": "life_newborn_dies_before_dawn",
    "title": "没等到天亮",
    "category": "ending",
    "ageRange": [
      0,
      0
    ],
    "priority": 90,
    "maxOccurrences": 1,
    "baseWeight": 1,
    "weightModifiers": [
      {
        "path": "attrs.luck",
        "lte": 1,
        "multiply": 4
      },
      {
        "path": "resources.health",
        "lte": 32,
        "multiply": 5
      },
      {
        "path": "environment.healthcareAccess",
        "lte": 2,
        "multiply": 2
      }
    ],
    "text": "你只在这个世界短暂停了一会儿。窗纸发白以前，哭声已经轻得听不见。",
    "effects": [
      {
        "die": "新生儿夭折"
      },
      {
        "triggerEnding": "newborn_death"
      }
    ]
  },
  {
    "id": "life_quiet_year",
    "title": "平常一年",
    "category": "random",
    "baseWeight": 74,
    "text": [
      {
        "conditions": {
          "all": [
            {
              "path": "meta.currentYear",
              "lte": 1948
            },
            {
              "path": "birth.hukou",
              "eq": "rural"
            }
          ]
        },
        "text": "这一年没有被史书记住。村里的季节按老规矩换，麦子、柴火和亲戚的闲话把日子往前推了一格。"
      },
      {
        "conditions": {
          "all": [
            {
              "path": "meta.currentYear",
              "gte": 1958
            },
            {
              "path": "meta.currentYear",
              "lte": 1977
            },
            {
              "path": "birth.hukou",
              "eq": "rural"
            }
          ]
        },
        "text": "这一年没有大事。队里的钟声、工分本和灶台烟火照常轮转，你在集体生活的缝隙里慢慢长大。"
      },
      {
        "conditions": {
          "all": [
            {
              "path": "meta.currentYear",
              "gte": 1990
            },
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
        "text": "这一年没有被人专门记住。你帮家里做事，也把自己的小心思藏起来，日子像一条窄路，还是一步步往前。"
      },
      {
        "conditions": {
          "all": [
            {
              "path": "meta.currentYear",
              "gte": 2000
            },
            {
              "path": "birth.cityTier",
              "in": [
                "city",
                "tier2",
                "tier1"
              ]
            }
          ]
        },
        "text": "这一年没有特别的标题。通勤、消息、账单和节假日把生活切成小块，你就在这些小块之间继续往前。"
      },
      {
        "text": "这一年没有被史书记住，也没有被亲戚反复提起。日子只是往前挪了一格。"
      }
    ],
    "effects": [
      {
        "path": "resources.happiness",
        "add": 1
      }
    ]
  },
  {
    "id": "life_childhood_fever",
    "title": "夜里发烧",
    "category": "health",
    "ageRange": [
      1,
      12
    ],
    "baseWeight": 28,
    "weightModifiers": [
      {
        "path": "attrs.physique",
        "lte": 3,
        "multiply": 1.8
      },
      {
        "path": "environment.healthcareAccess",
        "lte": 3,
        "multiply": 1.4
      }
    ],
    "text": [
      {
        "conditions": {
          "all": [
            {
              "path": "meta.currentYear",
              "lte": 1949
            },
            {
              "path": "environment.healthcareAccess",
              "lte": 3
            }
          ]
        },
        "text": "你夜里烧得迷迷糊糊，大人把土方、热水和请来的郎中都试了一遍。那几天，门轴、汗味和低声祈祷一起被你记住。"
      },
      {
        "conditions": {
          "all": [
            {
              "path": "meta.currentYear",
              "gte": 1960
            },
            {
              "path": "meta.currentYear",
              "lte": 1985
            },
            {
              "path": "birth.hukou",
              "eq": "rural"
            }
          ]
        },
        "text": "你夜里发烧，家里人去找赤脚医生。针头在开水里滚过，药味很苦，但有人把你从昏沉里一点点拉回来。"
      },
      {
        "conditions": {
          "all": [
            {
              "path": "meta.currentYear",
              "gte": 2000
            },
            {
              "path": "birth.cityTier",
              "in": [
                "city",
                "tier2",
                "tier1"
              ]
            }
          ]
        },
        "text": "你夜里烧起来，家里人挂号、量体温、看化验单。医院灯光很白，你第一次知道小病也能把全家弄得手忙脚乱。"
      },
      {
        "text": "你夜里烧得迷迷糊糊，家里人轮流摸你的额头。那几天，门轴和药味一起被你记住。"
      }
    ],
    "effects": [
      {
        "path": "resources.health",
        "add": -5
      },
      {
        "path": "relationships.family",
        "add": 3
      }
    ]
  },
  {
    "id": "life_frail_after_long_illness",
    "title": "病后体虚",
    "category": "health",
    "ageRange": [
      3,
      80
    ],
    "maxOccurrences": 1,
    "baseWeight": 22,
    "conditions": {
      "all": [
        {
          "path": "resources.health",
          "lte": 35
        },
        {
          "missingTrait": "frail_body"
        }
      ]
    },
    "text": "病是过去了，身体却像被多收了一笔账。你开始更早感到疲惫，也更懂得保存力气。",
    "effects": [
      {
        "addTrait": "frail_body"
      },
      {
        "path": "attrs.mental",
        "add": -1
      }
    ]
  },
  {
    "id": "life_primary_school_first_day",
    "title": "入学",
    "category": "school",
    "yearRange": [
      1912,
      2035
    ],
    "ageRange": [
      6,
      7
    ],
    "priority": 80,
    "maxOccurrences": 1,
    "baseWeight": 100,
    "text": [
      {
        "conditions": {
          "all": [
            {
              "path": "birth.gender",
              "eq": "female"
            },
            {
              "path": "meta.currentYear",
              "lte": 1948
            },
            {
              "path": "attrs.family",
              "lte": 3
            }
          ]
        },
        "text": "你终于走进学堂，但家里人说女孩子读几年识字就够了。你把课本抱得很紧，像抱住一段随时会被收回的时间。"
      },
      {
        "conditions": {
          "all": [
            {
              "path": "meta.currentYear",
              "gte": 1950
            },
            {
              "path": "meta.currentYear",
              "lte": 1977
            }
          ]
        },
        "text": "你背着书包走进学校。课本、队列和墙上的标语一起教你认字，也教你把个人愿望放进更大的句子里。"
      },
      {
        "conditions": {
          "all": [
            {
              "path": "meta.currentYear",
              "gte": 1995
            },
            {
              "path": "birth.cityTier",
              "in": [
                "city",
                "tier2",
                "tier1"
              ]
            }
          ]
        },
        "text": "你背着新书包走进学校。铃声、兴趣班传单和家长群里的消息，慢慢把童年切成一格一格。"
      },
      {
        "text": "你背着书包走进学校。人生第一次被铃声、课表和作业本切成一格一格。"
      }
    ],
    "effects": [
      {
        "path": "education.level",
        "set": "primary"
      },
      {
        "path": "education.score",
        "add": 6
      },
      {
        "addTag": "student"
      }
    ]
  },
  {
    "id": "life_land_reform_receives_field",
    "title": "分到土地",
    "category": "family",
    "yearRange": [
      1950,
      1953
    ],
    "birthFamilyClasses": [
      "poor_peasant",
      "tenant",
      "landless_laborer"
    ],
    "familyTags": [
      "poor_peasant_family",
      "tenant_family",
      "landless_laborer_family"
    ],
    "birthRegions": {
      "hukou": [
        "rural"
      ]
    },
    "priority": 78,
    "maxOccurrences": 1,
    "baseWeight": 100,
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
              "gte": 14
            }
          ]
        },
        "text": "村里丈量田地，你也跟着家里去听分配。地契和名字多半不写你，但你知道明年的口粮也有你弯腰的一份。"
      },
      {
        "text": "村里丈量田地，你家第一次把几亩地说成“自己的”。大人没有大声笑，只是在夜里反复算明年的口粮。"
      }
    ],
    "effects": [
      {
        "path": "resources.wealth",
        "add": 10
      },
      {
        "path": "relationships.family",
        "add": 6
      },
      {
        "path": "resources.happiness",
        "add": 5
      },
      {
        "addTag": "land_reform_beneficiary"
      }
    ]
  },
  {
    "id": "life_exam_goes_well",
    "title": "考得不错",
    "category": "school",
    "yearRange": [
      1912,
      2035
    ],
    "ageRange": [
      9,
      18
    ],
    "baseWeight": 34,
    "weightModifiers": [
      {
        "path": "attrs.intelligence",
        "gte": 6,
        "multiply": 1.6
      },
      {
        "hasTrait": "exam_aptitude",
        "multiply": 1.8
      },
      {
        "hasTrait": "pressure_trained",
        "multiply": 1.2
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
              "path": "meta.currentYear",
              "gte": 1912
            },
            {
              "path": "meta.currentYear",
              "lte": 1977
            },
            {
              "path": "birth.hukou",
              "eq": "rural"
            }
          ]
        },
        "text": "这次考试你发挥不错。老师夸了你，家里人却先算你还能读多久。那张卷子像一小块亮处，照得人高兴，也照出路的窄。"
      },
      {
        "conditions": {
          "all": [
            {
              "path": "meta.currentYear",
              "gte": 1995
            },
            {
              "hasTrait": "pressure_trained"
            }
          ]
        },
        "text": "这次考试你发挥不错。分数刚出来，下一轮目标也跟着来了；你被夸奖，也被继续推着往前跑。"
      },
      {
        "conditions": {
          "all": [
            {
              "path": "attrs.family",
              "gte": 6
            },
            {
              "path": "birth.cityTier",
              "in": [
                "city",
                "tier2",
                "tier1"
              ]
            }
          ]
        },
        "text": "这次考试你发挥不错。家里人很快开始比较学校、老师和下一阶段规划，喜悦还没落地，就被安排成新的路线。"
      },
      {
        "text": "这次考试你发挥不错。老师点了点头，家里人把卷子又看了一遍，像确认一张小小的船票。"
      }
    ],
    "effects": [
      {
        "path": "education.score",
        "add": 8
      },
      {
        "path": "resources.achievement",
        "add": 4
      },
      {
        "addTag": "good_student"
      }
    ]
  },
  {
    "id": "life_gaokao_crossroads",
    "title": "高考",
    "category": "school",
    "ageRange": [
      17,
      19
    ],
    "yearRange": [
      1977,
      2035
    ],
    "priority": 85,
    "maxOccurrences": 1,
    "baseWeight": 100,
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
            },
            {
              "path": "meta.currentYear",
              "lte": 1995
            }
          ]
        },
        "text": "高考到了。家里支持你，也有人说女孩子读太远以后难回头；你站在校门口，知道这不只是一场考试。"
      },
      {
        "conditions": {
          "all": [
            {
              "path": "birth.gender",
              "eq": "male"
            },
            {
              "path": "meta.currentYear",
              "gte": 1912
            },
            {
              "path": "birth.hukou",
              "eq": "rural"
            },
            {
              "path": "meta.currentYear",
              "lte": 1995
            }
          ]
        },
        "text": "高考到了。家里把翻身、门楣和远方都塞进你的书包，你站在校门口，觉得肩上比准考证重得多。"
      },
      {
        "text": "高考到了。校门口挤满家长、汗水和沉默的期待，你站在人生第一个巨大岔路口前。"
      }
    ],
    "outcomes": [
      {
        "id": "steady",
        "text": "稳住，正常发挥",
        "resultText": "你把会做的题尽量做对。走出考场时，天还是那个天，但你知道自己已经被推向下一段路。",
        "effects": [
          {
            "path": "education.score",
            "add": 10
          },
          {
            "path": "attrs.mental",
            "add": 1
          },
          {
            "path": "resources.achievement",
            "add": 8
          },
          {
            "addTag": "gaokao_done"
          }
        ]
      },
      {
        "id": "all_in",
        "text": "冲一把，搏上限",
        "resultText": "你把能押的都押上了。结果有点刺激，心态也被拧了一下。",
        "effects": [
          {
            "path": "education.score",
            "add": 14
          },
          {
            "path": "resources.happiness",
            "add": -4
          },
          {
            "path": "resources.achievement",
            "add": 12
          },
          {
            "addTag": "gaokao_done"
          }
        ]
      }
    ]
  },
  {
    "id": "life_college_admission_letter",
    "title": "大学录取",
    "category": "school",
    "requiresEvents": [
      "life_gaokao_crossroads"
    ],
    "ageRange": [
      18,
      23
    ],
    "maxOccurrences": 1,
    "baseWeight": 75,
    "conditions": {
      "all": [
        {
          "path": "education.score",
          "gte": 45
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
            },
            {
              "path": "birth.hukou",
              "eq": "rural"
            },
            {
              "path": "meta.currentYear",
              "lte": 1995
            }
          ]
        },
        "text": "录取通知到了。有人替你高兴，也有人小声算女孩子读这么远值不值。你把通知书压在书页里，第一次认真想象另一个城市里的自己。"
      },
      {
        "conditions": {
          "all": [
            {
              "path": "birth.hukou",
              "eq": "rural"
            },
            {
              "path": "attrs.family",
              "lte": 3
            }
          ]
        },
        "text": "录取通知到了。家里先高兴，随后开始算路费、学费和行李。那张纸很轻，却把一家人的指望都压上去了。"
      },
      {
        "conditions": {
          "all": [
            {
              "path": "meta.currentYear",
              "gte": 1999
            },
            {
              "path": "birth.cityTier",
              "in": [
                "city",
                "tier2",
                "tier1"
              ]
            }
          ]
        },
        "text": "录取通知到了。亲友群里很快热闹起来，你在祝贺、专业排名和城市想象之间，慢慢看见下一段人生。"
      },
      {
        "text": "录取通知到了。红纸、邮戳和亲戚的目光一起落到桌上，你第一次认真想象另一个城市里的自己。"
      }
    ],
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
        "add": -3
      },
      {
        "addTag": "college"
      }
    ]
  },
  {
    "id": "life_leave_for_bigger_city",
    "title": "去大城市",
    "category": "migration",
    "ageRange": [
      18,
      32
    ],
    "maxOccurrences": 1,
    "baseWeight": 32,
    "weightModifiers": [
      {
        "path": "environment.jobOpportunity",
        "lte": 4,
        "multiply": 1.8
      },
      {
        "hasTag": "college",
        "multiply": 1.5
      },
      {
        "hasTrait": "migration_ready",
        "multiply": 1.5
      }
    ],
    "text": [
      {
        "conditions": {
          "all": [
            {
              "path": "meta.currentYear",
              "lte": 1911
            }
          ]
        },
        "text": "你离开熟悉的地方，沿水路或驿道去往更大的城。行囊很轻，路却很长，城门外的喧声像另一种人生在招手。"
      },
      {
        "conditions": {
          "all": [
            {
              "path": "birth.gender",
              "eq": "female"
            },
            {
              "path": "meta.currentYear",
              "gte": 1912
            },
            {
              "path": "meta.currentYear",
              "lte": 2005
            }
          ]
        },
        "text": "你离开熟悉的地方，去了更大的城市。家里人反复叮嘱安全和名声，你把担心塞进行李，也把自由塞进去。"
      },
      {
        "conditions": {
          "all": [
            {
              "path": "birth.gender",
              "eq": "male"
            },
            {
              "path": "meta.currentYear",
              "gte": 1912
            },
            {
              "path": "birth.hukou",
              "eq": "rural"
            }
          ]
        },
        "text": "你离开熟悉的地方，去了更大的城市。亲戚说男孩子总要出去闯，你听着像鼓励，也像命令。"
      },
      {
        "text": "你离开熟悉的地方，去了更大的城市。房租很贵，机会也是真的多，夜里连路灯都像没空休息。"
      }
    ],
    "effects": [
      {
        "path": "location.currentProvince",
        "set": "shanghai"
      },
      {
        "path": "location.currentCityTier",
        "set": "tier1"
      },
      {
        "path": "location.migratedTimes",
        "add": 1
      },
      {
        "path": "resources.freedom",
        "add": 5
      },
      {
        "addTag": "migrant"
      }
    ]
  },
  {
    "id": "life_cross_region_accent_memory",
    "title": "远方口音",
    "category": "migration",
    "currentRegions": {
      "provinces": [
        "shanghai",
        "beijing",
        "guangdong",
        "zhejiang",
        "jiangsu"
      ]
    },
    "ageRange": [
      18,
      55
    ],
    "baseWeight": 34,
    "conditions": {
      "all": [
        {
          "past": {
            "ageRange": [
              0,
              3
            ],
            "where": {
              "all": [
                {
                  "path": "location.currentProvince",
                  "inGroup": "province.region.west"
                }
              ]
            }
          }
        }
      ]
    },
    "text": "你在大城市生活多年，但偶尔冒出的童年口音，还是会把你带回很远的地方。",
    "effects": [
      {
        "path": "resources.happiness",
        "add": 2
      },
      {
        "addTag": "cross_region_memory"
      }
    ]
  },
  {
    "id": "life_first_job_choice",
    "title": "第一份工作",
    "category": "career",
    "yearRange": [
      1992,
      2035
    ],
    "ageRange": [
      21,
      27
    ],
    "priority": 70,
    "maxOccurrences": 1,
    "baseWeight": 100,
    "conditions": {
      "none": [
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
          "eq": "family_labor"
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
            },
            {
              "path": "meta.currentYear",
              "lte": 2005
            }
          ]
        },
        "text": "你拿到了几份方向不同的工作机会。有人问你稳不稳定，也有人拐弯问你什么时候结婚；门票递到手里，背面还有小字。"
      },
      {
        "conditions": {
          "all": [
            {
              "path": "birth.gender",
              "eq": "male"
            },
            {
              "path": "meta.currentYear",
              "lte": 2005
            }
          ]
        },
        "text": "你拿到了几份方向不同的工作机会。别人默认你该扛起收入、房子和以后的一家人，成年人世界的第一张门票很快变重。"
      },
      {
        "text": "你拿到了几份方向不同的工作机会。成年人世界的第一张门票，背面写着价格。"
      }
    ],
    "outcomes": [
      {
        "id": "stable_company",
        "text": "去大公司，先求稳定",
        "resultText": "你进入大公司，学会了会议、周报和假装不困。",
        "effects": [
          {
            "path": "career.status",
            "set": "employed"
          },
          {
            "path": "career.field",
            "set": "corporate"
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
            "addTag": "corporate_worker"
          }
        ]
      },
      {
        "id": "startup_company",
        "text": "加入创业公司，赌一把",
        "resultText": "你加入创业公司。空气里都是机会，也都是加班味。",
        "effects": [
          {
            "path": "career.status",
            "set": "employed"
          },
          {
            "path": "career.field",
            "set": "startup"
          },
          {
            "path": "resources.wealth",
            "add": -4
          },
          {
            "path": "resources.achievement",
            "add": 10
          },
          {
            "addTag": "startup_path"
          },
          {
            "addTimedModifier": {
              "id": "startup_boost",
              "durationYears": 5,
              "target": {
                "eventTag": "startup"
              },
              "multiply": 2
            }
          }
        ]
      },
      {
        "id": "public_sector",
        "text": "考进体制，换一份确定性",
        "resultText": "你进入一个更讲规则和资历的系统。速度慢了点，但风也小了点。",
        "effects": [
          {
            "path": "career.status",
            "set": "employed"
          },
          {
            "path": "career.field",
            "set": "public_sector"
          },
          {
            "path": "career.income",
            "add": 8
          },
          {
            "path": "resources.freedom",
            "add": -4
          },
          {
            "path": "resources.happiness",
            "add": 3
          },
          {
            "addTag": "public_sector_worker"
          },
          {
            "addTrait": "institutional_adapted"
          }
        ]
      }
    ]
  },
  {
    "id": "life_startup_friend_invite",
    "title": "创业邀约",
    "category": "career",
    "yearRange": [
      1992,
      2035
    ],
    "tags": [
      "startup"
    ],
    "ageRange": [
      22,
      38
    ],
    "baseWeight": 12,
    "conditions": {
      "any": [
        {
          "hasTag": "startup_path"
        },
        {
          "hasTrait": "business_mind"
        },
        {
          "hasTrait": "market_sense"
        }
      ]
    },
    "text": "一个朋友拉你做新项目。听起来不靠谱，但说到后来，你还是在纸上写下了几个可能的名字。",
    "effects": [
      {
        "path": "resources.wealth",
        "add": -6
      },
      {
        "path": "resources.achievement",
        "add": 12
      },
      {
        "addTag": "startup_attempt"
      }
    ]
  },
  {
    "id": "life_marriage_decision",
    "title": "结婚",
    "category": "relationship",
    "ageRange": [
      24,
      40
    ],
    "maxOccurrences": 1,
    "baseWeight": 28,
    "conditions": {
      "none": [
        {
          "hasTag": "married"
        }
      ]
    },
    "weightModifiers": [
      {
        "path": "relationships.romance",
        "gte": 25,
        "multiply": 1.8
      },
      {
        "path": "resources.wealth",
        "gte": 40,
        "multiply": 1.2
      }
    ],
    "text": [
      {
        "conditions": {
          "all": [
            {
              "path": "meta.currentYear",
              "lte": 1911
            },
            {
              "path": "birth.gender",
              "eq": "female"
            }
          ]
        },
        "text": "媒人和两家的长辈把婚事谈定了。聘礼、嫁妆和往后的本分被一项项说清，你坐在一旁，自己的声音很轻。"
      },
      {
        "conditions": {
          "all": [
            {
              "path": "meta.currentYear",
              "lte": 1911
            },
            {
              "path": "birth.gender",
              "eq": "male"
            }
          ]
        },
        "text": "媒人和两家的长辈把婚事谈定了。聘礼、门户和传宗接代被反复掂量，成亲更像两个家庭把日子接在一起。"
      },
      {
        "conditions": {
          "all": [
            {
              "path": "birth.gender",
              "eq": "female"
            },
            {
              "path": "meta.currentYear",
              "gte": 1912
            },
            {
              "path": "meta.currentYear",
              "lte": 2015
            }
          ]
        },
        "text": "你和一个人决定结婚。亲戚们讨论彩礼、房子和你以后怎么顾家，婚礼很吵，未来也被许多人提前安排了一遍。"
      },
      {
        "conditions": {
          "all": [
            {
              "path": "birth.gender",
              "eq": "male"
            },
            {
              "path": "meta.currentYear",
              "gte": 1912
            },
            {
              "path": "meta.currentYear",
              "lte": 2015
            }
          ]
        },
        "text": "你和一个人决定结婚。房子、收入和责任被一项项摆上桌，婚礼很吵，未来很长，誓词像轻轻签下一份巨大的合同。"
      },
      {
        "text": "你和一个人决定把两条人生线绑在一起。婚礼很吵，未来很长，誓词说出口时像轻轻签下一份巨大的合同。"
      }
    ],
    "effects": [
      {
        "path": "relationships.partnerStatus",
        "set": "married"
      },
      {
        "path": "relationships.partnerQuality",
        "add": 15
      },
      {
        "path": "resources.happiness",
        "add": 6
      },
      {
        "addTag": "married"
      }
    ]
  },
  {
    "id": "life_midlife_pressure_arrives",
    "title": "中年压力",
    "category": "wealth",
    "ageRange": [
      35,
      56
    ],
    "baseWeight": 42,
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
        "text": "生计、老人、孩子和家里的活一起压过来。你把能挣的、能省的都重新算了一遍，然后照常起身去做事。"
      },
      {
        "conditions": {
          "all": [
            {
              "path": "birth.gender",
              "eq": "female"
            },
            {
              "path": "meta.currentYear",
              "gte": 1949
            },
            {
              "path": "relationships.children",
              "gte": 1
            }
          ]
        },
        "text": "工作、孩子、父母和家务一起挤过来。你像同时开着几个窗口的人，深夜才想起自己也需要喘口气。"
      },
      {
        "conditions": {
          "all": [
            {
              "path": "birth.gender",
              "eq": "male"
            },
            {
              "path": "meta.currentYear",
              "gte": 1949
            },
            {
              "path": "relationships.children",
              "gte": 1
            }
          ]
        },
        "text": "钱、房子、孩子和父母一起挤过来。你开始学会在深夜叹气，也学会第二天把责任重新扛回肩上。"
      },
      {
        "text": "钱、健康、家庭和工作一起挤过来。你开始学会在深夜叹气，也学会第二天照常起床。"
      }
    ],
    "effects": [
      {
        "path": "resources.health",
        "add": -5
      },
      {
        "path": "resources.happiness",
        "add": -5
      },
      {
        "path": "resources.wealth",
        "add": 4
      }
    ]
  },
  {
    "id": "life_retirement_day",
    "title": "歇下重活",
    "category": "career",
    "ageRange": [
      58,
      65
    ],
    "priority": 65,
    "maxOccurrences": 1,
    "baseWeight": 100,
    "conditions": {
      "none": [
        {
          "path": "career.status",
          "eq": "retired"
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
        "text": "你渐渐歇下最重的活，把手里的事交给晚辈。没有正式的退休日子，只是某天起，大家不再让你扛最沉的那一头。"
      },
      {
        "text": "你退休了。闹钟终于不再像命令，但身体已经记住了多年早醒。"
      }
    ],
    "effects": [
      {
        "path": "career.status",
        "set": "retired"
      },
      {
        "path": "resources.freedom",
        "add": 20
      },
      {
        "path": "career.income",
        "add": -8
      },
      {
        "addTag": "retired"
      }
    ]
  },
  {
    "id": "life_natural_death_after_long_road",
    "title": "自然死亡",
    "category": "ending",
    "ageRange": [
      75,
      112
    ],
    "baseWeight": 30,
    "weightModifiers": [
      {
        "path": "resources.health",
        "lte": 35,
        "multiply": 4
      },
      {
        "path": "attrs.physique",
        "lte": 3,
        "multiply": 1.6
      },
      {
        "path": "meta.age",
        "gte": 90,
        "multiply": 2
      }
    ],
    "text": "你走完了这一生。很多事没有答案，但它们都真实发生过，像一条河终于流进安静的地方。",
    "effects": [
      {
        "die": "自然死亡"
      },
      {
        "triggerEnding": "natural_end"
      }
    ]
  }
];
