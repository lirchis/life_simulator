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
    "text": "你读到一本让自己停下来想很久的书。它没有立刻改变人生，只是在心里多开了一扇小窗。",
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
    "text": "老师随口说了一句难听的话，教室里没人接住你。那句话后来变轻了，但没有立刻消失。",
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
    "text": "有个老师认真看了你的作业，说你可以再往前走一点。那一刻，教室像多了一扇窗。",
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
    "text": "你忘带了作业本，心一路沉到早读铃响。那天你学到的东西，未必在课本里。",
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
    "text": "同桌把一个小秘密告诉了你。你们压低声音笑了一会儿，好像世界短暂地只剩两张课桌那么大。",
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
        "text": "成绩贴在墙上，你从上往下找自己的名字。那张纸轻飘飘的，却能让人心里一沉。"
      }
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
];
