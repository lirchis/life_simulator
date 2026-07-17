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
              "lte": 1948
            },
            {
              "path": "birth.hukou",
              "eq": "rural"
            }
          ]
        },
        "text": "这一年，田里的活按节气排开，家里的事按长幼排开。没有哪一天足以写进县志，许多天合起来却又是一生。"
      },
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
        "text": "雨水多寡、谷价高低和一场小病，便足够决定这一年的颜色。你照常做活，也照常盼来年能宽一点。"
      },
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
        "text": "这一年没有传奇，只有柴垛变矮又重新堆高，旧衣补了又补。日子不响亮，却一寸也没有少过。"
      },
      {
        "conditions": {
          "all": [
            {
              "path": "meta.currentYear",
              "lte": 1948
            },
            {
              "path": "birth.hukou",
              "eq": "urban"
            }
          ]
        },
        "text": "这一年，街面换了几回告示，铺门照旧早开晚关。大事从报纸上经过，小日子在账本里留下墨迹。"
      },
      {
        "conditions": {
          "all": [
            {
              "path": "meta.currentYear",
              "lte": 1948
            },
            {
              "path": "birth.hukou",
              "eq": "urban"
            }
          ]
        },
        "text": "城里每天都有新消息，真正轮到你身上的仍是房钱、饭钱和熟人的一声招呼。年份就这样从门口走了过去。"
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
        "text": "这一年没有大事。队里的钟声、工分本和灶台烟火照常轮转，你也在集体生活的缝隙里把日子过下去。"
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
        "text": "春耕、夏收、秋分配和冬天的会，把一年划成几段。个人心事没有记分员，只好由你自己记着。"
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
        "text": "这一年，公事和农事都排得很满。你在口号之外记住的，是谁借过一把锄头，谁悄悄多分了半碗热汤。"
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
              "lte": 1977
            },
            {
              "path": "birth.hukou",
              "eq": "urban"
            }
          ]
        },
        "text": "这一年随着上班钟、供应时间和院里的脚步声过去。许多东西按份额领取，烦恼却仍按各家情况分配。"
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
              "lte": 1977
            },
            {
              "path": "birth.hukou",
              "eq": "urban"
            }
          ]
        },
        "text": "单位、学校或街道替这一年安排了大半日程。剩下的一小半，你留给家人、睡眠和没来得及说出口的话。"
      },
      {
        "conditions": {
          "all": [
            {
              "path": "meta.currentYear",
              "gte": 1978
            },
            {
              "path": "meta.currentYear",
              "lte": 1999
            },
            {
              "path": "birth.hukou",
              "eq": "rural"
            }
          ]
        },
        "text": "这一年，村里有人外出，也有人翻修旧屋。远方的机会从信件和传闻里传来，你先把眼前的庄稼照料好。"
      },
      {
        "conditions": {
          "all": [
            {
              "path": "meta.currentYear",
              "gte": 1978
            },
            {
              "path": "meta.currentYear",
              "lte": 1999
            },
            {
              "path": "birth.hukou",
              "eq": "urban"
            }
          ]
        },
        "text": "物价、工资和街上的招牌都在变化，你也学着重新估量安稳与机会。大多数日子没有答案，只有下一步。"
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
      },
      {
        "text": "这一年没有明显的转折。你处理完一件又一件小事，回头看时，季节已经替你翻过了页。"
      },
      {
        "text": "没有人替这一年取名。饭要按顿吃，路要一段段走，时间就在这些不值得讲述的动作里完成了工作。"
      },
      {
        "text": "这一年大体平常。偶尔有好消息，也有几件扫兴的小事，彼此抵消以后，留下的是你又长了一岁。"
      },
      {
        "text": "日历没有因为你停顿。你把手边的生活维持下去，也在无人注意的地方改变了一点点。"
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
    "maxOccurrences": 1,
    "lifetimeProbability": 0.42,
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
        "text": "你夜里烧得迷迷糊糊，大人把土方、热水和请来的郎中都试了一遍。门轴响了一夜，汗味和低声祈祷留在照看你的人心里。"
      },
      {
        "conditions": {
          "all": [
            {
              "path": "meta.currentYear",
              "gte": 1968
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
        "text": "你夜里烧起来，家里人挂号、量体温、看化验单。医院灯光很白，小小的病号睡睡醒醒，全家已经忙乱了一夜。"
      },
      {
        "text": "你夜里烧得迷迷糊糊，家里人轮流摸你的额头。那几天后来未必留在你的记忆里，门轴和药味却被家人讲了很多年。"
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
              "gte": 2010
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
    "currentRegions": {
      "cityTiers": [
        "village",
        "town",
        "county"
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
        "text": "村里丈量田地，分配被一笔笔写进名册。纸面上女人也有了权利，回到家里谁作主却未必立刻改变；你知道每一垄地同样要落下自己的劳动。"
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
    "maxOccurrences": 1,
    "baseWeight": 34,
    "conditions": {
      "any": [
        { "hasTag": "student" },
        { "path": "education.level", "in": ["primary", "middle", "high", "college"] }
      ]
    },
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
    "currentRegions": {
      "cityTiers": [
        "village",
        "town",
        "county",
        "city",
        "tier2"
      ]
    },
    "lifetimeProbability": 0.56,
    "maxOccurrences": 1,
    "baseWeight": 14,
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
    ],
    "outcomes": [
      {
        "id": "provincial_center",
        "baseWeight": 8,
        "resultText": "你先在本省较大的城市落脚。口音还熟，生活规矩已经换了一套。",
        "effects": [
          {
            "path": "location.currentCityTier",
            "set": "tier2"
          }
        ]
      },
      {
        "id": "shanghai",
        "baseWeight": 2,
        "conditions": {
          "all": [
            {
              "path": "meta.currentYear",
              "gte": 1843
            }
          ]
        },
        "resultText": "你去了上海。码头、厂房与楼群随年代改变，昂贵和机会倒一直挨得很近。",
        "effects": [
          {
            "path": "location.currentProvince",
            "set": "shanghai"
          },
          {
            "path": "location.currentProvinceHistoryCode",
            "set": "shanghai"
          },
          {
            "path": "location.currentCityTier",
            "set": "tier1"
          }
        ]
      },
      {
        "id": "beijing",
        "baseWeight": 2,
        "resultText": "你去了北京。城很大，规矩也多，你先学会问路，再学会少问几句。",
        "effects": [
          {
            "path": "location.currentProvince",
            "set": "beijing"
          },
          {
            "path": "location.currentProvinceHistoryCode",
            "set": "beijing"
          },
          {
            "path": "location.currentCityTier",
            "set": "tier1"
          }
        ]
      },
      {
        "id": "wuhan",
        "baseWeight": 2,
        "conditions": {
          "all": [
            {
              "path": "meta.currentYear",
              "lte": 1949
            }
          ]
        },
        "resultText": "你在武汉三镇落脚。江水、轮渡和商埠把陌生人日日送来，也日日送走。",
        "effects": [
          {
            "path": "location.currentProvince",
            "set": "hubei"
          },
          {
            "path": "location.currentProvinceHistoryCode",
            "set": "hubei"
          },
          {
            "path": "location.currentCityTier",
            "set": "tier2"
          }
        ]
      },
      {
        "id": "guangdong",
        "baseWeight": 3,
        "conditions": {
          "all": [
            {
              "path": "meta.currentYear",
              "gte": 1978
            }
          ]
        },
        "resultText": "你去了广东。车站人声很杂，厂门口的招工牌比亲戚的保证更直接。",
        "effects": [
          {
            "path": "location.currentProvince",
            "set": "guangdong"
          },
          {
            "path": "location.currentProvinceHistoryCode",
            "set": "guangdong"
          },
          {
            "path": "location.currentCityTier",
            "set": "tier1"
          }
        ]
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
    "maxOccurrences": 1,
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
    "maxOccurrences": 1,
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
    "lifetimeProbability": 0.7,
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
    "lifetimeProbability": 0.52,
    "maxOccurrences": 1,
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
          "any": [
            {
              "path": "meta.currentYear",
              "lte": 1948
            },
            {
              "path": "location.currentCityTier",
              "in": ["village", "town"]
            },
            {
              "path": "career.field",
              "in": ["farm_work", "manual_worker", "self_employed", "gig_worker"]
            }
          ]
        },
        "text": "你渐渐歇下最重的活，把手里的事交给晚辈。没有正式的退休日子，只是某天起，大家不再让你扛最沉的那一头。"
      },
      {
        "conditions": {
          "all": [
            {
              "path": "career.status",
              "in": ["none", "unemployed"]
            }
          ]
        },
        "text": "你到了渐渐该少做重活的年纪，却没有一张正式通知替生活划线。只是找你的活变少了，身体拒绝的事变多了，日子慢慢换了称呼。"
      },
      {
        "conditions": {
          "all": [
            {
              "path": "career.status",
              "in": ["employed", "retired"]
            }
          ]
        },
        "text": "你退休了。闹钟终于不再像命令，但身体已经记住了多年早醒。"
      },
      {
        "text": "你把最重、最急的事情交出去一些。人没有一下子闲下来，只是从此做每件事，都更愿意先问问身体。"
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
    "priority": 80,
    "baseWeight": 100,
    "triggerProbability": 0.045,
    "probabilityModifiers": [
      {
        "path": "meta.age",
        "gte": 80,
        "multiply": 1.6
      },
      {
        "path": "meta.age",
        "gte": 85,
        "multiply": 1.5
      },
      {
        "path": "meta.age",
        "gte": 90,
        "multiply": 1.5
      },
      {
        "path": "meta.age",
        "gte": 100,
        "multiply": 1.5
      },
      {
        "path": "meta.age",
        "gte": 112,
        "multiply": 100
      },
      {
        "path": "resources.health",
        "lte": 35,
        "multiply": 1.5
      },
      {
        "path": "attrs.physique",
        "lte": 3,
        "multiply": 1.2
      },
      {
        "path": "environment.healthcareAccess",
        "lte": 3,
        "multiply": 1.2
      }
    ],
    "text": [
      {
        "conditions": {
          "all": [
            { "path": "meta.currentYear", "lte": 1949 }
          ]
        },
        "text": "灯火比从前暗了一点，你在家人的守候中走完一生。许多旧事无人再能说全，只剩用过的器物和活着的人替你作证。"
      },
      {
        "conditions": {
          "all": [
            { "path": "location.currentCityTier", "in": ["village", "town"] }
          ]
        },
        "text": "你在熟悉的屋檐下走完一生。田地还会换季，灶烟还会升起；少掉的那个人，要到许多件小事里才慢慢显出来。"
      },
      {
        "conditions": {
          "all": [
            { "path": "relationships.children", "gte": 1 },
            { "path": "relationships.family", "gte": 35 }
          ]
        },
        "text": "家人守在身边，你走完了这一生。最后没有宏大的话，只有被角、呼吸和一只迟迟没有松开的手。"
      },
      {
        "conditions": {
          "all": [
            { "path": "resources.health", "lte": 30 }
          ]
        },
        "text": "身体把日子一点点收窄，终于连疼痛也安静下来。你走完一生，留下的不是结论，是别人往后仍会照做的几种习惯。"
      },
      {
        "text": "你走完了这一生。很多事没有答案，但它们都真实发生过，像一条河终于流进安静的地方。"
      }
    ],
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
