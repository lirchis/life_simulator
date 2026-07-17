// Auto-split event data. Keep events in this file focused on one era or theme.
export const dailyFamilyRelationshipsEvents = [
  {
    "id": "daily_childhood_small_chore",
    "title": "帮家里跑腿",
    "category": "family",
    "ageRange": [
      5,
      13
    ],
    "baseWeight": 46,
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
        "text": "你帮家里喂鸡、看火、带更小的孩子。大人说你懂事，你却只是很早学会别给人添麻烦。"
      },
      {
        "conditions": {
          "all": [
            {
              "path": "birth.gender",
              "eq": "male"
            },
            {
              "path": "birth.hukou",
              "eq": "rural"
            }
          ]
        },
        "text": "你帮家里跑腿、挑水、看田边的牲口。大人说男孩子要有力气，你把这句话听得半懂不懂。"
      },
      {
        "text": "你帮家里跑腿做些小事。事情不大，却让你慢慢知道一个家的日子怎么转起来。"
      }
    ],
    "effects": [
      {
        "path": "relationships.family",
        "add": 4
      },
      {
        "path": "resources.happiness",
        "add": 1
      },
      {
        "path": "attrs.mental",
        "add": 1
      }
    ]
  },
  {
    "id": "daily_childhood_street_game",
    "title": "街边游戏",
    "category": "relationship",
    "ageRange": [
      4,
      12
    ],
    "baseWeight": 44,
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
        "text": "你和一群孩子在巷口玩到天黑。没有什么玩具，石子、粉笔线和一阵风就够撑起半个下午。"
      },
      {
        "conditions": {
          "all": [
            {
              "path": "meta.currentYear",
              "gte": 2000
            }
          ]
        },
        "text": "你和同龄人在小区或学校边玩了一阵。大人总担心安全，你们还是能在缝隙里找到一点野。"
      },
      {
        "text": "你和同龄人玩到忘了时间。童年的快乐有时很便宜，只要有人一起喊你的名字。"
      }
    ],
    "effects": [
      {
        "path": "relationships.friendship",
        "add": 5
      },
      {
        "path": "resources.happiness",
        "add": 4
      }
    ]
  },
  {
    "id": "daily_new_clothes_new_year",
    "title": "新衣服",
    "category": "family",
    "ageRange": [
      3,
      16
    ],
    "baseWeight": 32,
    "text": [
      {
        "conditions": {
          "all": [
            {
              "path": "resources.wealth",
              "lte": 30
            }
          ]
        },
        "text": "过年时你得了一件新衣服，也可能是亲戚改小的旧衣服。你还是把它叠得很平，像叠住一点体面。"
      },
      {
        "text": "过年时你穿上新衣服，在镜子前多站了一会儿。那一刻，日子像被洗亮了一点。"
      }
    ],
    "effects": [
      {
        "path": "resources.happiness",
        "add": 4
      },
      {
        "path": "relationships.family",
        "add": 2
      },
      {
        "path": "resources.wealth",
        "add": -1
      }
    ]
  },
  {
    "id": "daily_small_argument_at_home",
    "title": "家里拌嘴",
    "category": "family",
    "ageRange": [
      8,
      70
    ],
    "baseWeight": 36,
    "text": "家里因为一点小事拌了几句嘴。锅铲、门声和沉默轮流响起，过一会儿又像什么都没发生。",
    "effects": [
      {
        "path": "relationships.family",
        "add": -3
      },
      {
        "path": "resources.happiness",
        "add": -2
      }
    ]
  },
  {
    "id": "daily_helped_by_neighbor",
    "title": "邻里帮忙",
    "category": "relationship",
    "ageRange": [
      0,
      90
    ],
    "baseWeight": 34,
    "text": "邻居顺手帮了你家一个忙。人情不大，却像一根细线，把附近几户人的日子轻轻系在一起。",
    "effects": [
      {
        "path": "relationships.friendship",
        "add": 4
      },
      {
        "path": "resources.happiness",
        "add": 2
      },
      {
        "addTag": "neighbor_help_memory"
      }
    ]
  },
  {
    "id": "daily_memory_with_old_photo",
    "title": "翻到旧照片",
    "category": "family",
    "yearRange": [
      1900,
      2035
    ],
    "ageRange": [
      35,
      95
    ],
    "baseWeight": 24,
    "text": "你翻到一张旧照片。照片里的人还年轻，时间却已经在背面悄悄写了很多行小字。",
    "effects": [
      {
        "path": "relationships.family",
        "add": 3
      },
      {
        "path": "resources.happiness",
        "add": 1
      }
    ]
  },
  {
    "id": "daily_city_stairwell_neighbors",
    "title": "楼道里的邻居",
    "category": "relationship",
    "yearRange": [
      1950,
      2035
    ],
    "ageRange": [
      5,
      18
    ],
    "currentRegions": {
      "cityTiers": [
        "county",
        "city",
        "tier2",
        "tier1"
      ]
    },
    "baseWeight": 35,
    "text": "楼道里总有饭菜味和脚步声。你认识了隔壁家的孩子，也认识了成年人吵架时的回音。",
    "effects": [
      {
        "path": "relationships.friendship",
        "add": 5
      },
      {
        "path": "resources.happiness",
        "add": 2
      },
      {
        "addTag": "stairwell_childhood"
      }
    ]
  },
  {
    "id": "daily_parent_silent_support",
    "title": "沉默的支持",
    "category": "family",
    "ageRange": [
      10,
      35
    ],
    "baseWeight": 32,
    "text": "家里人没有说漂亮话，只是在你需要的时候多塞了一点钱、多留了一盏灯。",
    "effects": [
      {
        "path": "relationships.family",
        "add": 7
      },
      {
        "path": "resources.happiness",
        "add": 4
      },
      {
        "path": "attrs.mental",
        "add": 1
      }
    ]
  },
  {
    "id": "daily_first_love_bicycle",
    "title": "自行车后座",
    "category": "relationship",
    "yearRange": [
      1920,
      2035
    ],
    "ageRange": [
      15,
      24
    ],
    "maxOccurrences": 1,
    "baseWeight": 24,
    "weightModifiers": [
      {
        "path": "attrs.charm",
        "gte": 6,
        "multiply": 1.5
      },
      {
        "path": "relationships.friendship",
        "gte": 40,
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
            },
            {
              "path": "meta.currentYear",
              "lte": 2005
            }
          ]
        },
        "text": "你坐过某个人的自行车后座。风把校服吹得鼓起来，你一边心动，一边怕被熟人看见。"
      },
      {
        "text": "你坐过某个人的自行车后座。风把校服吹得鼓起来，很多年后你还记得那段路的坡度。"
      }
    ],
    "effects": [
      {
        "path": "relationships.romance",
        "add": 18
      },
      {
        "path": "resources.happiness",
        "add": 8
      },
      {
        "addTag": "first_love_memory"
      }
    ]
  },
  {
    "id": "daily_breakup_rain",
    "title": "雨里的分手",
    "category": "relationship",
    "ageRange": [
      18,
      35
    ],
    "maxOccurrences": 1,
    "baseWeight": 16,
    "conditions": {
      "all": [
        {
          "path": "relationships.romance",
          "gte": 20
        }
      ],
      "none": [
        {
          "hasTag": "married"
        }
      ]
    },
    "text": "你们在雨里说了很多没用的话。伞很小，沉默很大，最后谁也没有回头。",
    "effects": [
      {
        "path": "relationships.romance",
        "add": -20
      },
      {
        "path": "resources.happiness",
        "add": -10
      },
      {
        "addTag": "breakup_memory"
      }
    ]
  },
  {
    "id": "daily_friend_night_noodles",
    "title": "深夜面摊",
    "category": "relationship",
    "ageRange": [
      18,
      45
    ],
    "baseWeight": 30,
    "text": "你和朋友坐在夜里的面摊边，聊活计、钱和不敢说出口的害怕。汤很烫，话也是真话。",
    "effects": [
      {
        "path": "relationships.friendship",
        "add": 7
      },
      {
        "path": "resources.happiness",
        "add": 4
      },
      {
        "path": "attrs.mental",
        "add": 1
      }
    ]
  },
  {
    "id": "daily_parent_illness",
    "title": "父母生病",
    "category": "family",
    "ageRange": [
      28,
      60
    ],
    "maxOccurrences": 1,
    "baseWeight": 24,
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
        "text": "父母开始频繁看病抓药。很多照料默认落到你身上，你突然意识到，山也会慢慢变矮，还会需要人扶。"
      },
      {
        "conditions": {
          "all": [
            {
              "path": "birth.gender",
              "eq": "male"
            }
          ]
        },
        "text": "父母开始频繁看病抓药。你突然意识到，他们不是一直站在你身后的山，而你也被默认该撑起下一段路。"
      },
      {
        "text": "父母开始频繁看病抓药。你突然意识到，他们不是一直站在你身后的山，山也会慢慢变矮。"
      }
    ],
    "effects": [
      {
        "path": "resources.wealth",
        "add": -10
      },
      {
        "path": "relationships.family",
        "add": 5
      },
      {
        "path": "resources.happiness",
        "add": -8
      },
      {
        "addTag": "parent_illness_memory"
      }
    ]
  },
  {
    "id": "daily_child_born_mother",
    "title": "孩子出生",
    "category": "family",
    "genders": [
      "female"
    ],
    "ageRange": [
      24,
      42
    ],
    "maxOccurrences": 3,
    "baseWeight": 20,
    "conditions": {
      "all": [
        {
          "hasTag": "married"
        }
      ]
    },
    "text": "孩子出生了。小小一团哭声把你的人生往前推了一大步，也把疼痛、虚弱和新的身份一起留在你身上。",
    "effects": [
      {
        "path": "relationships.children",
        "add": 1
      },
      {
        "path": "relationships.family",
        "add": 8
      },
      {
        "path": "resources.happiness",
        "add": 7
      },
      {
        "path": "resources.health",
        "add": -6
      },
      {
        "path": "resources.wealth",
        "add": -8
      },
      {
        "addTag": "has_child"
      }
    ]
  },
  {
    "id": "daily_child_born_father",
    "title": "孩子出生",
    "category": "family",
    "genders": [
      "male"
    ],
    "ageRange": [
      24,
      45
    ],
    "maxOccurrences": 3,
    "baseWeight": 20,
    "conditions": {
      "all": [
        {
          "hasTag": "married"
        }
      ]
    },
    "text": "孩子出生了。你抱着那团小小的哭声，突然明白“当父亲”不是一个称呼，而是一张从今天开始长期扣款的账单。",
    "effects": [
      {
        "path": "relationships.children",
        "add": 1
      },
      {
        "path": "relationships.family",
        "add": 7
      },
      {
        "path": "resources.happiness",
        "add": 6
      },
      {
        "path": "resources.wealth",
        "add": -10
      },
      {
        "path": "attrs.mental",
        "add": -1
      },
      {
        "addTag": "has_child"
      }
    ]
  },
  {
    "id": "daily_child_education_pressure",
    "title": "孩子的补习班",
    "category": "family",
    "yearRange": [
      1990,
      2035
    ],
    "ageRange": [
      32,
      55
    ],
    "baseWeight": 24,
    "conditions": {
      "all": [
        {
          "path": "relationships.children",
          "gte": 1
        }
      ]
    },
    "weightModifiers": [
      {
        "path": "environment.educationPressure",
        "gte": 8,
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
        "text": "你给孩子报了补习班。沟通老师、接送、作业和情绪多半绕回你这里，题目换了一种字体又回到家里。"
      },
      {
        "conditions": {
          "all": [
            {
              "path": "birth.gender",
              "eq": "male"
            }
          ]
        },
        "text": "你给孩子报了补习班。账单来得很准时，你开始理解教育焦虑也可以按月扣款。"
      },
      {
        "text": "你给孩子报了补习班。小时候你做过的题，换了一种字体又回到家里。"
      }
    ],
    "effects": [
      {
        "path": "resources.wealth",
        "add": -8
      },
      {
        "path": "resources.happiness",
        "add": -4
      },
      {
        "path": "relationships.family",
        "add": -2
      },
      {
        "addTag": "parent_education_pressure"
      }
    ]
  },
  {
    "id": "daily_sibling_shared_snack",
    "title": "分一口零食",
    "category": "family",
    "ageRange": [
      4,
      16
    ],
    "baseWeight": 30,
    "text": "家里只有一点零食，你和兄弟姐妹或邻居孩子分着吃。甜味很快没了，分给谁、留给谁却记得更久。",
    "effects": [
      {
        "path": "relationships.family",
        "add": 4
      },
      {
        "path": "relationships.friendship",
        "add": 2
      },
      {
        "path": "resources.happiness",
        "add": 3
      },
      {
        "addTag": "shared_snack_memory"
      }
    ]
  },
  {
    "id": "daily_parent_compares_children",
    "title": "被拿来比较",
    "category": "family",
    "ageRange": [
      7,
      24
    ],
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
        "text": "亲戚把你和别人家的孩子放在一起比较，话里还夹着女孩该怎样的规矩。你笑了笑，心里却把那句话折起来收好。"
      },
      {
        "text": "亲戚把你和别人家的孩子放在一起比较。大人的几句话很轻，却能让一个下午都变得别扭。"
      }
    ],
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
        "path": "attrs.mental",
        "add": 1
      },
      {
        "addTag": "comparison_shadow"
      }
    ]
  },
  {
    "id": "daily_grandparent_story",
    "title": "老人讲旧事",
    "category": "family",
    "ageRange": [
      5,
      35
    ],
    "baseWeight": 28,
    "text": "家里的老人讲起旧事，讲到一半又停住。你那时未必懂，只觉得一个人的沉默里也住着很多年。",
    "effects": [
      {
        "path": "relationships.family",
        "add": 5
      },
      {
        "path": "attrs.intelligence",
        "add": 1
      },
      {
        "addTag": "family_oral_history"
      }
    ]
  },
  {
    "id": "daily_family_medical_bill",
    "title": "家里有人看病",
    "category": "family",
    "ageRange": [
      12,
      70
    ],
    "baseWeight": 24,
    "text": "家里有人去看病，药包和欠下的账摊在桌上。那天你发现，身体一疼，钱也会跟着疼。",
    "effects": [
      {
        "path": "resources.wealth",
        "add": -7
      },
      {
        "path": "relationships.family",
        "add": 3
      },
      {
        "path": "resources.happiness",
        "add": -5
      },
      {
        "addTag": "family_medical_pressure"
      }
    ]
  },
  {
    "id": "daily_lunar_new_year_table",
    "title": "年夜饭桌",
    "category": "family",
    "ageRange": [
      3,
      90
    ],
    "baseWeight": 26,
    "text": [
      {
        "conditions": {
          "all": [
            {
              "path": "meta.currentYear",
              "lte": 1980
            }
          ]
        },
        "text": "年夜饭桌上的菜不一定多，但每个人都像在给过去一年收尾。有人夹菜，有人算账，有人悄悄叹气。"
      },
      {
        "text": "年夜饭桌上热闹了一阵。祝福、催问、玩笑和沉默混在一起，像每个家都会熬的一锅汤。"
      }
    ],
    "effects": [
      {
        "path": "relationships.family",
        "add": 4
      },
      {
        "path": "resources.happiness",
        "add": 2
      },
      {
        "addTag": "new_year_table_memory"
      }
    ]
  },
  {
    "id": "daily_care_for_younger_child",
    "title": "照看更小的孩子",
    "category": "family",
    "ageRange": [
      7,
      18
    ],
    "baseWeight": 30,
    "weightModifiers": [
      {
        "path": "birth.gender",
        "eq": "female",
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
            }
          ]
        },
        "text": "你常被叫去照看更小的孩子。大人夸你懂事，懂事两个字有时像一件提前穿上的旧衣服。"
      },
      {
        "text": "你帮忙照看更小的孩子。哭声、喂饭和催促挤在一起，你比同龄人更早知道照顾是什么。"
      }
    ],
    "effects": [
      {
        "path": "relationships.family",
        "add": 5
      },
      {
        "path": "resources.freedom",
        "add": -3
      },
      {
        "addTag": "early_caregiver_memory"
      }
    ]
  },
  {
    "id": "daily_parent_child_long_talk",
    "title": "和父母长谈",
    "category": "family",
    "ageRange": [
      15,
      45
    ],
    "baseWeight": 20,
    "text": "你和父母难得认真谈了一次。话没有全说开，但至少有些沉默终于换成了句子。",
    "effects": [
      {
        "path": "relationships.family",
        "add": 8
      },
      {
        "path": "resources.happiness",
        "add": 3
      },
      {
        "addTag": "family_long_talk"
      }
    ]
  },
  {
    "id": "daily_relative_borrows_money",
    "title": "亲戚来借钱",
    "category": "wealth",
    "ageRange": [
      22,
      70
    ],
    "baseWeight": 20,
    "text": "亲戚开口借钱，话说得客气，难处却是真的。你在情分和账本之间停了很久。",
    "outcomes": [
      {
        "id": "lend_some",
        "text": "多少借一点",
        "resultText": "你借出去一些钱。情分保住了一点，心里也多了一笔没有日期的账。",
        "effects": [
          {
            "path": "resources.wealth",
            "add": -6
          },
          {
            "path": "relationships.family",
            "add": 5
          },
          {
            "addTag": "kinship_debt_memory"
          }
        ]
      },
      {
        "id": "refuse_gently",
        "text": "委婉拒绝",
        "resultText": "你委婉拒绝了。日子还要过，但有些亲戚之间的空气变薄了一点。",
        "effects": [
          {
            "path": "relationships.family",
            "add": -4
          },
          {
            "path": "resources.wealth",
            "add": 1
          }
        ]
      }
    ]
  },
  {
    "id": "daily_neighbor_funeral",
    "title": "邻里丧事",
    "category": "relationship",
    "ageRange": [
      10,
      90
    ],
    "baseWeight": 18,
    "text": "附近有人家办丧事，巷道或村路忽然安静下来。你第一次或又一次意识到，每个熟面孔都会有告别的一天。",
    "effects": [
      {
        "path": "resources.happiness",
        "add": -4
      },
      {
        "path": "attrs.mental",
        "add": 1
      },
      {
        "addTag": "neighbor_farewell_memory"
      }
    ]
  },
  {
    "id": "daily_matchmaker_visit",
    "title": "媒人上门",
    "category": "family",
    "yearRange": [
      1950,
      2015
    ],
    "ageRange": [
      18,
      35
    ],
    "conditions": {
      "none": [
        {
          "hasTag": "married"
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
        "text": "媒人或亲戚上门说亲，话里绕着年龄、工作、家境和脾气。你坐在旁边，像被放进一张看不见的秤。"
      },
      {
        "text": "媒人或亲戚上门说亲，茶杯一放，话题就绕到年龄、工作和家境。婚姻第一次像一件要被估价的事。"
      }
    ],
    "effects": [
      {
        "path": "relationships.family",
        "add": -1
      },
      {
        "path": "resources.happiness",
        "add": -2
      },
      {
        "addTag": "matchmaker_visit_memory"
      }
    ]
  },
  {
    "id": "daily_wedding_banquet_table",
    "title": "婚宴桌边",
    "category": "family",
    "ageRange": [
      18,
      50
    ],
    "baseWeight": 20,
    "text": "你参加了一场婚宴。敬酒、红包、玩笑和比较挤在一张桌上，喜庆里也藏着许多现实的账。",
    "effects": [
      {
        "path": "relationships.family",
        "add": 3
      },
      {
        "path": "resources.wealth",
        "add": -2
      },
      {
        "path": "resources.happiness",
        "add": 2
      },
      {
        "addTag": "wedding_banquet_memory"
      }
    ]
  },
  {
    "id": "daily_couple_money_argument",
    "title": "为钱拌嘴",
    "category": "family",
    "ageRange": [
      22,
      65
    ],
    "conditions": {
      "all": [
        {
          "hasTag": "married"
        }
      ]
    },
    "baseWeight": 24,
    "weightModifiers": [
      {
        "path": "resources.wealth",
        "lte": 35,
        "multiply": 1.5
      }
    ],
    "text": "你们为了钱拌了几句嘴。账单不大，却能把很多没说出口的不安一并翻出来。",
    "effects": [
      {
        "path": "relationships.family",
        "add": -4
      },
      {
        "path": "resources.happiness",
        "add": -3
      },
      {
        "addTag": "money_argument_memory"
      }
    ]
  },
  {
    "id": "daily_friend_moves_away",
    "title": "朋友搬走了",
    "category": "relationship",
    "ageRange": [
      8,
      55
    ],
    "baseWeight": 22,
    "text": "一个熟悉的朋友搬走了。路口还是那个路口，只是少了一个会喊你名字的人。",
    "effects": [
      {
        "path": "relationships.friendship",
        "add": -4
      },
      {
        "path": "resources.happiness",
        "add": -3
      },
      {
        "addTag": "friend_moved_away"
      }
    ]
  },
  {
    "id": "daily_inlaw_visit",
    "title": "姻亲来访",
    "category": "family",
    "ageRange": [
      22,
      70
    ],
    "conditions": {
      "all": [
        {
          "hasTag": "married"
        }
      ]
    },
    "baseWeight": 18,
    "text": "姻亲来家里坐了一阵，客气话和真心话隔着茶水来回试探。婚姻不只是两个人，也是一串人情往来。",
    "effects": [
      {
        "path": "relationships.family",
        "add": 2
      },
      {
        "path": "resources.happiness",
        "add": -1
      },
      {
        "addTag": "inlaw_visit_memory"
      }
    ]
  },
  {
    "id": "daily_child_fever_night",
    "title": "孩子半夜发烧",
    "category": "health",
    "ageRange": [
      24,
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
    "baseWeight": 18,
    "text": "孩子半夜发烧，你摸着额头、找药、等体温降下来。那一夜很长，长到足够让人重新理解牵挂。",
    "effects": [
      {
        "path": "resources.happiness",
        "add": -5
      },
      {
        "path": "relationships.family",
        "add": 4
      },
      {
        "addTag": "child_fever_night_memory"
      }
    ]
  },
  {
    "id": "daily_old_classmate_reunion",
    "title": "老同学聚会",
    "category": "relationship",
    "yearRange": [
      1980,
      2035
    ],
    "ageRange": [
      25,
      70
    ],
    "baseWeight": 18,
    "text": "你见到多年不见的老同学。大家说起从前，又悄悄比较现在；笑声里有亲近，也有一点无法回头的距离。",
    "effects": [
      {
        "path": "relationships.friendship",
        "add": 4
      },
      {
        "path": "resources.happiness",
        "add": 2
      },
      {
        "addTag": "classmate_reunion_memory"
      }
    ]
  }
];
