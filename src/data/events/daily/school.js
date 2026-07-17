// Auto-split event data. Keep events in this file focused on one era or theme.
export const dailySchoolEvents = [
  {
    "id": "daily_school_walk_home",
    "title": "放学路上",
    "category": "school",
    "ageRange": [
      7,
      18
    ],
    "baseWeight": 40,
    "text": [
      {
        "conditions": {
          "all": [
            {
              "path": "birth.cityTier",
              "in": [
                "village",
                "town",
                "county"
              ]
            }
          ]
        },
        "text": "你沿着熟悉的路放学回家，路边有田、店铺或低矮的墙。很多心事就在这段路上慢慢长出来。"
      },
      {
        "text": "你在人群里放学回家。书包有点重，天色一点点暗下去，明天的课表已经在等你。"
      }
    ],
    "effects": [
      {
        "path": "resources.happiness",
        "add": 1
      },
      {
        "path": "education.score",
        "add": 1
      }
    ]
  },
  {
    "id": "daily_reading_a_book",
    "title": "读到一本书",
    "category": "school",
    "ageRange": [
      10,
      35
    ],
    "baseWeight": 22,
    "weightModifiers": [
      {
        "path": "attrs.intelligence",
        "gte": 6,
        "multiply": 1.5
      },
      {
        "hasTrait": "modern_schooling",
        "multiply": 1.3
      }
    ],
    "text": [
      {
        "conditions": { "all": [{ "path": "meta.currentYear", "lte": 1949 }, { "path": "resources.wealth", "lte": 45 }] },
        "text": "你借到一本翻得起毛的书，怕弄坏，连饭桌上的油点都躲着它。许多页并未全懂，仍第一次知道自家门外还有别种活法。"
      },
      {
        "conditions": { "all": [{ "path": "location.currentCityTier", "in": ["village", "town"] }, { "path": "education.score", "lte": 55 }] },
        "text": "你在学校或镇上的小书架找到一本书，借期不长，只好赶着读。农活与家务不会替阅读让路，书便常摊在一盏快没电的灯旁。"
      },
      { "text": "你偶然读到一本让人停下来的书。它没有替你解决现实，只把一个原来不知怎样提出的问题，安静地摆到了桌面上。" }
    ],
    "effects": [
      {
        "path": "education.score",
        "add": 4
      },
      {
        "path": "resources.achievement",
        "add": 2
      },
      {
        "path": "resources.happiness",
        "add": 2
      }
    ]
  },
  {
    "id": "daily_bad_teacher_words",
    "title": "一句难听的话",
    "category": "school",
    "ageRange": [
      7,
      18
    ],
    "baseWeight": 22,
    "text": [
      {
        "conditions": { "all": [{ "path": "education.score", "lte": 40 }] },
        "text": "老师当众说你不是读书的料，同学的目光一齐转来。成绩本来只是一次没学会，那句话却差点把它说成了你这个人。"
      },
      {
        "conditions": { "all": [{ "path": "resources.wealth", "lte": 35 }] },
        "text": "老师拿你的旧衣、欠费或家境开了一句难听的玩笑。教室里有人笑，你回家没有提；贫穷已经够忙，不该还替大人提供笑料。"
      },
      { "text": "老师随口用一句刻薄话评价你，教室里没人接住。它后来也许变轻，却让你早早明白，站在讲台上的人同样可能说错。" }
    ],
    "effects": [
      {
        "path": "education.score",
        "add": -3
      },
      {
        "path": "resources.happiness",
        "add": -5
      },
      {
        "path": "attrs.mental",
        "add": -1
      }
    ]
  },
  {
    "id": "daily_good_teacher_window",
    "title": "被老师看见",
    "category": "school",
    "ageRange": [
      7,
      18
    ],
    "baseWeight": 24,
    "weightModifiers": [
      {
        "path": "education.score",
        "gte": 45,
        "multiply": 1.4
      },
      {
        "path": "attrs.charm",
        "gte": 6,
        "multiply": 1.2
      }
    ],
    "text": [
      {
        "conditions": { "all": [{ "path": "education.score", "lte": 42 }] },
        "text": "老师没有只在错题旁画叉，而是放学后陪你重新做了一遍。你仍不是班里最快的，却第一次知道慢一点也能抵达答案。"
      },
      {
        "conditions": { "all": [{ "path": "resources.wealth", "lte": 38 }] },
        "text": "老师看出家里难处，悄悄替你留了旧教材和一套能用的文具，没有在全班面前说明。真正的照顾不只给东西，也替人保留体面。"
      },
      { "text": "老师认真读完你的作业，指出一处真正做得好的地方，又说还能再往前走。夸奖没有很响，却把下一步说得具体。" }
    ],
    "effects": [
      {
        "path": "education.score",
        "add": 7
      },
      {
        "path": "resources.achievement",
        "add": 4
      },
      {
        "path": "resources.happiness",
        "add": 4
      },
      {
        "addTag": "teacher_encouraged"
      }
    ]
  },
  {
    "id": "daily_classroom_window_daze",
    "title": "望着窗外发呆",
    "category": "school",
    "ageRange": [
      7,
      18
    ],
    "baseWeight": 38,
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
        "text": "你望着教室窗外发呆。操场、树影、远处的炊烟都比黑板上的字更容易把你带走。"
      },
      {
        "text": "你望着教室窗外发呆。老师的声音还在继续，心却先跑到了很远的地方。"
      }
    ],
    "effects": [
      {
        "path": "education.score",
        "add": -1
      },
      {
        "path": "resources.happiness",
        "add": 2
      }
    ]
  },
  {
    "id": "daily_class_monitor_errand",
    "title": "帮老师跑腿",
    "category": "school",
    "ageRange": [
      8,
      17
    ],
    "baseWeight": 24,
    "weightModifiers": [
      {
        "path": "education.score",
        "gte": 55,
        "multiply": 1.3
      }
    ],
    "text": "老师让你帮忙收作业、抱本子或传话。事情不大，却让你第一次尝到被信任和被盯着的味道。",
    "effects": [
      {
        "path": "resources.reputation",
        "add": 3
      },
      {
        "path": "education.score",
        "add": 2
      },
      {
        "addTag": "class_monitor_seed"
      }
    ]
  },
  {
    "id": "daily_homework_by_dim_light",
    "title": "昏灯下写作业",
    "category": "school",
    "ageRange": [
      7,
      18
    ],
    "baseWeight": 32,
    "weightModifiers": [
      {
        "path": "resources.wealth",
        "lte": 35,
        "multiply": 1.5
      }
    ],
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
        "text": "你在昏黄的灯下写作业，纸页边角被手肘磨软。大人说读书能改命，你先学会了忍住困。"
      },
      {
        "text": "你在夜里写作业，桌面只剩笔尖和影子。题目一道道过去，时间也一道道过去。"
      }
    ],
    "effects": [
      {
        "path": "education.score",
        "add": 5
      },
      {
        "path": "resources.happiness",
        "add": -2
      },
      {
        "path": "attrs.mental",
        "add": 1
      }
    ]
  },
  {
    "id": "daily_forgot_homework",
    "title": "忘带作业",
    "category": "school",
    "ageRange": [
      7,
      16
    ],
    "baseWeight": 24,
    "text": [
      {
        "conditions": { "all": [{ "path": "meta.currentYear", "lte": 1911 }] },
        "text": "你把先生布置的习字页落在家里，进塾后才想起来。戒尺搁在案边，比没交的那张纸更早抵达课堂。"
      },
      {
        "conditions": { "all": [{ "path": "location.currentCityTier", "in": ["village", "town"] }, { "path": "meta.currentYear", "lte": 1990 }] },
        "text": "你走到学校才发现作业本压在家里，回去取已经来不及。同桌替你作证确实写过，老师的脸色仍像阴天一样没有立刻转晴。"
      },
      { "text": "早读铃快响时，你才发现作业忘在家里。解释听起来总像借口，那天你先承认疏忽，回家便把书包从底到顶整理了一遍。" }
    ],
    "effects": [
      {
        "path": "education.score",
        "add": -2
      },
      {
        "path": "resources.happiness",
        "add": -3
      },
      {
        "path": "attrs.mental",
        "add": 1
      }
    ]
  },
  {
    "id": "daily_same_desk_secret",
    "title": "同桌的小秘密",
    "category": "relationship",
    "ageRange": [
      9,
      18
    ],
    "baseWeight": 30,
    "text": [
      {
        "conditions": { "all": [{ "path": "meta.currentYear", "lte": 1949 }] },
        "text": "同窗趁先生转身，把一件家里的小秘密写在纸角推给你。你看完便揉进袖口，纸团很小，信任却需要保管一整天。"
      },
      {
        "conditions": { "all": [{ "path": "meta.age", "gte": 15 }] },
        "text": "同桌把一件不愿让全班知道的烦恼告诉你。你没有拿它换笑声，只在放学路上陪对方多走了一段。"
      },
      { "text": "同桌压低声音告诉你一个小秘密，你也认真保证不外传。上课铃打断了谈话，两张课桌之间却多了一点只有你们知道的信任。" }
    ],
    "effects": [
      {
        "path": "relationships.friendship",
        "add": 6
      },
      {
        "path": "resources.happiness",
        "add": 4
      },
      {
        "addTag": "same_desk_memory"
      }
    ]
  },
  {
    "id": "daily_schoolyard_conflict",
    "title": "操场上的冲突",
    "category": "school",
    "ageRange": [
      8,
      17
    ],
    "baseWeight": 22,
    "text": "操场上有人推搡、起哄，事情很快被老师压下去。可你记住了人群站队时的眼神。",
    "effects": [
      {
        "path": "relationships.friendship",
        "add": -3
      },
      {
        "path": "resources.happiness",
        "add": -4
      },
      {
        "path": "attrs.mental",
        "add": 1
      }
    ]
  },
  {
    "id": "daily_exam_rank_posted",
    "title": "成绩贴在墙上",
    "category": "school",
    "ageRange": [
      10,
      19
    ],
    "baseWeight": 26,
    "text": [
      {
        "conditions": {
          "all": [
            {
              "path": "education.score",
              "gte": 65
            }
          ]
        },
        "text": "成绩贴在墙上，你的名字排得靠前。有人羡慕，有人不服，你也开始习惯被数字衡量。"
      },
      {
        "conditions": { "all": [{ "path": "education.score", "lte": 40 }] },
        "text": "名次从高到低贴满一张纸，你的名字靠后。真正难受的不只是分数，而是路过的人都可以顺手把你看成那一个位置。"
      },
      { "text": "成绩贴在墙上，你在人群肩膀之间找自己的名字。有人先看自己，有人先看别人；一张纸很轻，却临时替全班排出了高低。" }
    ],
    "effects": [
      {
        "path": "education.score",
        "add": 2
      },
      {
        "path": "resources.happiness",
        "add": -1
      },
      {
        "addTag": "rank_pressure_memory"
      }
    ]
  },
  {
    "id": "daily_after_school_tutoring",
    "title": "课后补课",
    "category": "school",
    "yearRange": [
      1990,
      2035
    ],
    "ageRange": [
      8,
      18
    ],
    "baseWeight": 30,
    "weightModifiers": [
      {
        "path": "environment.educationPressure",
        "gte": 7,
        "multiply": 1.6
      }
    ],
    "text": "放学以后你又坐进另一间教室。窗外天色暗下去，题目却像不会天黑。",
    "effects": [
      {
        "path": "education.score",
        "add": 6
      },
      {
        "path": "resources.wealth",
        "add": -4
      },
      {
        "path": "resources.happiness",
        "add": -5
      },
      {
        "addTag": "tutoring_years"
      }
    ]
  },
  {
    "id": "daily_rural_teacher_absent",
    "title": "老师又请假了",
    "category": "school",
    "ageRange": [
      7,
      15
    ],
    "birthRegions": {
      "cityTiers": [
        "village",
        "town"
      ]
    },
    "baseWeight": 20,
    "weightModifiers": [
      {
        "path": "resources.wealth",
        "lte": 35,
        "multiply": 1.4
      }
    ],
    "text": "老师又请假了，几个年级挤在一起自习。你隐约知道，有些地方连读书这件事都要靠运气接上。",
    "effects": [
      {
        "path": "education.score",
        "add": -4
      },
      {
        "path": "resources.happiness",
        "add": -1
      },
      {
        "addTag": "rural_school_gap"
      }
    ]
  },
  {
    "id": "daily_public_recitation",
    "title": "站起来朗读",
    "category": "school",
    "ageRange": [
      7,
      18
    ],
    "baseWeight": 24,
    "text": [
      {
        "conditions": {
          "all": [
            {
              "path": "attrs.charm",
              "gte": 6
            }
          ]
        },
        "text": "你站起来朗读课文，声音比自己想象中稳。有人回头看你，你没有躲开。"
      },
      {
        "text": "你站起来朗读课文，声音一开始发紧，后来慢慢顺了。坐下时，心还在砰砰跳。"
      }
    ],
    "effects": [
      {
        "path": "attrs.charm",
        "add": 1
      },
      {
        "path": "education.score",
        "add": 2
      },
      {
        "path": "resources.happiness",
        "add": 1
      }
    ]
  },
  {
    "id": "daily_library_corner",
    "title": "图书角",
    "category": "school",
    "yearRange": [
      1980,
      2035
    ],
    "ageRange": [
      8,
      18
    ],
    "baseWeight": 22,
    "text": "教室角落多了一个小小的图书角。书不多，书页也旧，但你还是从里面摸到了一点别处的空气。",
    "effects": [
      {
        "path": "education.score",
        "add": 4
      },
      {
        "path": "resources.happiness",
        "add": 3
      },
      {
        "addTag": "library_corner_memory"
      }
    ]
  }
].map((event) => ({
  yearRange: event.yearRange ?? [1912, 2035],
  ...event,
  conditions: {
    ...(event.conditions ?? {}),
    all: [...(event.conditions?.all ?? []), { hasTag: "student" }],
  },
}));
