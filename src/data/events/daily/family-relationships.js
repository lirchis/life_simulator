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
            { "path": "meta.age", "lte": 3 }
          ]
        },
        "text": "过年时，大人给你换上了一件新衣，也可能是亲戚家的旧衣改小的。你只顾摸扣子和袖口；至于这件衣服有多难得，是家人后来才说给你听的。"
      },
      {
        "conditions": {
          "all": [
            {
              "path": "resources.wealth",
              "lte": 30
            },
            { "path": "meta.age", "gte": 4 }
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
    "text": [
      {
        "conditions": { "all": [{ "path": "meta.age", "lte": 16 }, { "path": "education.status", "eq": "enrolled" }] },
        "text": "家里为作业、晚归或一件弄坏的东西拌了几句。大人的火气来得快，饭仍旧盛到你面前；和好没有仪式，只是筷子又开始往同一盘菜里伸。"
      },
      {
        "conditions": { "all": [{ "path": "meta.age", "lte": 16 }] },
        "text": "家里为晚归、忘做一件差事或弄坏的东西拌了几句。大人的火气来得快，饭仍旧盛到你面前；和好没有仪式，只是筷子又开始往同一盘菜里伸。"
      },
      {
        "conditions": { "all": [{ "path": "relationships.partnerStatus", "eq": "married" }] },
        "text": "你和伴侣为家务或一句没听清的话拌嘴，门声比事情本身响。过一会儿谁也没道歉，只把晾在外面的衣服一起收了。"
      },
      { "text": "家里因为一点小事拌了几句，锅铲、脚步和沉默轮流响起。事情未必真正解决，只是日子还要继续，水开了总得有人关火。" }
    ],
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
    "lifetimeProbability": 0.4,
    "baseWeight": 34,
    "text": [
      {
        "conditions": { "all": [{ "path": "location.currentCityTier", "in": ["village", "town"] }] },
        "text": "邻里来搭了一把手，可能是借牲口、抬东西，也可能只是替你家守了一阵门。乡下的人情不写收据，却记得比收据久。"
      },
      {
        "conditions": {
          "all": [
            { "path": "meta.currentYear", "gte": 1950 },
            { "path": "meta.currentYear", "lte": 1995 },
            { "path": "location.currentCityTier", "in": ["county", "city", "tier2", "tier1"] }
          ]
        },
        "text": "邻居顺手帮了你家一个忙。楼道里锅碗和脚步声挨得近，谁家有难处，也很难真正关在门后。"
      },
      {
        "conditions": { "all": [{ "path": "meta.currentYear", "gte": 2000 }] },
        "text": "邻居替你收了东西，又在消息里说了一声。城市里的人情常被压缩成几句话和一次顺手，分量却不一定轻。"
      },
      { "text": "邻居顺手帮了你家一个忙。事情不大，日后也未必专门提起；许多关系，就是这样在小事里没有散掉。" }
    ],
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
    "text": [
      {
        "conditions": { "all": [{ "path": "meta.currentYear", "lte": 1965 }] },
        "text": "你从木箱或旧书里翻出一张发黄的合影，背面只写了年月。有人已经叫不出名字，留下的人便围着衣着和站位，一点点把关系认回来。"
      },
      {
        "conditions": { "all": [{ "path": "relationships.children", "gte": 1 }] },
        "text": "孩子翻到你年轻时的照片，先笑那时的衣服，又追问旁边是谁。你讲了很久，才发现一张小照片装得下许多他们从未见过的人。"
      },
      { "text": "你整理旧物时翻到一张照片，影中人仍停在当年的年龄。背面的字已经淡了，几段往事却因一个站姿、一扇旧门重新有了声音。" }
    ],
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
    "text": [
      {
        "conditions": { "all": [{ "path": "resources.wealth", "lte": 35 }] },
        "text": "家里拿不出多少余钱，只把你出门要带的饭装得更实，又悄悄塞进一点零用。支持不够解决难处，却是从本来就紧的日子里挤出来的。"
      },
      {
        "conditions": { "all": [{ "path": "meta.age", "gte": 24 }, { "path": "career.status", "in": ["employed", "self_employed"] }] },
        "text": "你为工作进退犹豫，父母没有替你作决定，只说累了可以回来吃饭。那句话不提供方案，却替最坏的结果留了一把椅子。"
      },
      { "text": "家里人不擅长说漂亮话，只在你晚归时留灯，在需要时把能给的东西放进包里。关心没有署名，你一看摆放的位置便知道是谁。" }
    ],
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
    "conditions": {
      "any": [
        { "path": "meta.currentYear", "gte": 1950 },
        { "path": "location.currentCityTier", "in": ["county", "city", "tier2", "tier1"] },
        { "path": "resources.wealth", "gte": 55 }
      ]
    },
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
            { "path": "meta.currentYear", "lte": 1949 }
          ]
        },
        "text": "那辆自行车在街上还算稀罕。你坐上后座，沿途很怕碰见熟人；车铃只响了两次，心里那点动静却一路没有停。"
      },
      {
        "conditions": {
          "all": [
            { "path": "meta.currentYear", "gte": 1950 },
            { "path": "meta.currentYear", "lte": 1977 },
            { "path": "education.status", "eq": "enrolled" }
          ]
        },
        "text": "放学后你坐在某个人的自行车后座，书包夹在两人中间，既碍事又像一道很薄的掩护。到了熟人多的路口，你提前跳下来走。"
      },
      {
        "conditions": {
          "all": [
            { "path": "birth.gender", "eq": "female" },
            { "path": "meta.currentYear", "gte": 1978 },
            { "path": "meta.currentYear", "lte": 2005 }
          ]
        },
        "text": "你坐在某个人的自行车后座，风把衣角吹得鼓起来。你一边心动，一边怕被熟人看见；到了路口，还故意把手放得很规矩。"
      },
      {
        "conditions": {
          "all": [
            { "path": "birth.gender", "eq": "male" },
            { "path": "meta.currentYear", "gte": 1978 },
            { "path": "meta.currentYear", "lte": 2005 }
          ]
        },
        "text": "你骑车载着喜欢的人，路面每个坑忽然都显得是对车技的公开考试。一路说的话不多，到了以后，手心比上坡时还湿。"
      },
      {
        "conditions": {
          "all": [
            { "path": "meta.currentYear", "gte": 2006 },
            { "path": "location.currentCityTier", "in": ["county", "city", "tier2", "tier1"] }
          ]
        },
        "text": "你们骑车绕开堵着的路，一个人在前面辨方向，一个人在后面说刚才又错过路口。导航重新规划了三次，谁也没有真的急着抵达。"
      },
      {
        "text": "你坐过某个人的自行车后座，车链偶尔响一声，路也并不平。很多年后，人和话都模糊了，那段上坡该在哪里下车帮推却还记得。"
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
    "yearRange": [
      1880,
      2035
    ],
    "ageRange": [
      18,
      45
    ],
    "lifetimeProbability": 0.32,
    "currentRegions": {
      "cityTiers": [
        "town",
        "county",
        "city",
        "tier2",
        "tier1"
      ]
    },
    "baseWeight": 30,
    "text": [
      {
        "conditions": {
          "all": [
            { "path": "meta.currentYear", "lte": 1949 }
          ]
        },
        "text": "收市以后，你和相熟的人蹲在夜摊边分一碗热面，谈工钱，也谈白日里不便谈的话。汤寡淡，话倒有些分量。"
      },
      {
        "conditions": {
          "all": [
            { "path": "meta.currentYear", "gte": 1950 },
            { "path": "meta.currentYear", "lte": 1992 }
          ]
        },
        "text": "夜班散了，你和朋友在小面摊坐下，谈单位、家用和不敢让家里听见的发愁。辣椒放得豪爽，办法仍旧没有。"
      },
      {
        "text": "你和朋友坐在夜里的面摊边，聊活计、钱和不敢说出口的害怕。汤很烫，话也是真话。"
      }
    ],
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
    "lifetimeProbability": 0.82,
    "baseWeight": 20,
    "conditions": {
      "all": [
        {
          "path": "relationships.partnerStatus",
          "eq": "married"
        }
      ]
    },
    "text": [
      {
        "conditions": { "all": [{ "path": "relationships.children", "lte": 0 }] },
        "text": "孩子出生了。小小一团哭声把你的人生往前推了一大步，也把疼痛、虚弱和新的身份一起留在你身上。"
      },
      {
        "conditions": { "all": [{ "path": "relationships.children", "eq": 1 }] },
        "text": "家里又添了一个孩子。你比上次更熟悉襁褓的重量，却仍会在深夜听见哭声时怀疑自己是否准备充分。"
      },
      {
        "text": "又一个孩子来到家里。喜悦没有比从前少，手忙脚乱也没有；你抱着孩子，知道一家人的日程又要重新排过。"
      }
    ],
    "effects": [
      {
        "path": "relationships.children",
        "add": 1
      },
      {
        "recordChildBirth": true
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
    "lifetimeProbability": 0.82,
    "baseWeight": 20,
    "conditions": {
      "all": [
        {
          "path": "relationships.partnerStatus",
          "eq": "married"
        }
      ]
    },
    "text": [
      {
        "conditions": { "all": [{ "path": "relationships.children", "lte": 0 }] },
        "text": "孩子出生了。你抱着那团小小的哭声，突然明白“当父亲”不是一个称呼，而是一张从今天开始长期扣款的账单。"
      },
      {
        "conditions": { "all": [{ "path": "relationships.children", "eq": 1 }] },
        "text": "家里又添了一个孩子。你抱人的姿势熟练了一点，心里的账却越算越长；好在孩子打了个哈欠，暂时拒绝参与财务讨论。"
      },
      {
        "text": "又一个孩子来到家里。你在喜悦与责任之间来回走动，最后发现两者都不会替你值夜。"
      }
    ],
    "effects": [
      {
        "path": "relationships.children",
        "add": 1
      },
      {
        "recordChildBirth": true
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
        },
        {
          "path": "relationships.oldestChildAge",
          "gte": 6
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
    "text": [
      {
        "conditions": { "all": [{ "path": "meta.age", "lte": 7 }] },
        "text": "大人把仅有的一小块吃食掰开，放进几个孩子手里。你先盯着别人那块是不是更大，吃完又把纸递给还没分到的人。"
      },
      {
        "conditions": { "all": [{ "path": "resources.wealth", "lte": 32 }, { "path": "meta.currentYear", "lte": 1985 }] },
        "text": "家里难得有一点糖果或糕点，兄弟姐妹按人数分开。每份都小，负责分的人却切了又比，像在主持一场很严肃的公平。"
      },
      { "text": "你把手里不多的零食分给兄弟姐妹或邻居孩子。甜味很快吃完，大家仍把包装折来折去，仿佛还能从里面找出一点。" }
    ],
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
    "text": [
      {
        "conditions": { "all": [{ "path": "meta.currentYear", "lte": 1949 }] },
        "text": "老人借着灯火讲起逃荒、兵乱或一次远行，许多地名你没听过。讲到难处时他停下来拨了拨灯芯，故事便由那一小段沉默继续。"
      },
      {
        "conditions": { "all": [{ "path": "meta.age", "lte": 10 }] },
        "text": "老人讲起年轻时住过的房子，你听着听着去摆弄手边东西，只记住其中一个好笑的细节。多年以后，留下来的也许正是这一小段。"
      },
      { "text": "家中老人说起一件旧事，前后年份有些对不上，情绪却没有记错。你没有急着纠正，只把尚能确认的人名和地方再问一遍。" }
    ],
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
    "text": [
      {
        "conditions": {
          "all": [
            { "path": "meta.currentYear", "lte": 1949 },
            { "path": "resources.wealth", "lte": 35 }
          ]
        },
        "text": "家里有人病了，药铺的纸包和借来的钱一起摊在桌上。郎中说要静养，欠账却很有精神，当晚便跟着全家一起醒着。"
      },
      {
        "conditions": {
          "all": [
            { "path": "location.currentCityTier", "in": ["village", "town"] },
            { "path": "meta.currentYear", "lte": 2000 }
          ]
        },
        "text": "家里有人去看病，车钱、药钱和误工的日子被一项项算出来。病人躺着，一家人的生计也跟着歇了半边。"
      },
      {
        "conditions": {
          "all": [
            { "path": "resources.wealth", "lte": 35 }
          ]
        },
        "text": "检查单和缴费单在手里越攒越厚。医生谈身体，家里谈钱，两边说的其实是同一场难处。"
      },
      {
        "text": "家里有人去看病，药包和账单摊在桌上。身体一疼，时间、钱和照料便一起有了具体数目。"
      }
    ],
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
      6,
      90
    ],
    "lifetimeProbability": 0.28,
    "baseWeight": 16,
    "text": [
      {
        "conditions": {
          "all": [
            { "path": "meta.currentYear", "lte": 1911 },
            { "path": "resources.wealth", "lte": 35 },
            { "path": "location.currentCityTier", "in": ["village", "town"] }
          ]
        },
        "text": "除夕前先有人上门催旧账，家里把门闩落得比往常早。桌上留了一碗白米和一点荤腥，大人仍说年关总要像个年关；所谓体面，有时就是欠债的人也把碗摆正。"
      },
      {
        "conditions": {
          "all": [
            { "path": "meta.currentYear", "gte": 1937 },
            { "path": "meta.currentYear", "lte": 1949 }
          ]
        },
        "text": "这一年的团圆饭没有坐满。有人避难未归，有人的音信停在几个月前；长辈仍多放了一双筷子，又说只是忘了收。桌上的人都听见这句解释，没有人帮它圆得更好。"
      },
      {
        "conditions": {
          "all": [
            { "path": "meta.currentYear", "gte": 1950 },
            { "path": "meta.currentYear", "lte": 1977 },
            { "path": "resources.wealth", "lte": 45 }
          ]
        },
        "text": "家里把平日舍不得用的粮票、油票攒到年根，凑出一桌比往常丰盛的饭。孩子问明年还能不能这样吃，大人忙着夹菜，像是这道问题不在供应范围里。"
      },
      {
        "conditions": {
          "all": [
            { "path": "meta.currentYear", "gte": 1983 },
            { "path": "meta.currentYear", "lte": 1998 },
            { "path": "location.currentCityTier", "in": ["village", "town", "county"] }
          ]
        },
        "text": "年夜饭摆好后，几家人端着碗去邻居有电视的屋里看晚会。荧光屏把远方照得热闹，屋外还有人惦记明早喂牲口；时代进村时，先占了堂屋里最好的一张凳子。"
      },
      {
        "conditions": {
          "all": [
            { "path": "meta.currentYear", "gte": 1990 },
            { "path": "location.migratedTimes", "gte": 1 },
            { "path": "meta.age", "gte": 18 }
          ]
        },
        "text": "你赶回去吃了一顿年夜饭。路上花了许多时间，桌边真正安静下来的只有几分钟；一家人用夹菜代替了不少不会说的话。"
      },
      {
        "conditions": {
          "all": [
            { "path": "meta.currentYear", "gte": 2000 },
            { "path": "relationships.family", "lte": 34 },
            { "path": "meta.age", "gte": 18 }
          ]
        },
        "text": "饭桌上的话题绕到收入、婚姻和谁该照顾老人，几句祝福很快长出倒刺。电视负责制造笑声，你们负责在广告时沉默；零点一过，人人又礼貌地说新年快乐。"
      },
      {
        "conditions": {
          "all": [
            { "path": "meta.currentYear", "gte": 2036 }
          ]
        },
        "text": "远处的家人投在墙面的影像里同桌吃饭，延迟让每次举杯都慢半拍。订制年菜按营养指标摆得齐整，老人仍嫌没有从前那一口；技术解决了到场，没能替任何人回答明年住在哪里。"
      },
      {
        "conditions": {
          "all": [
            { "path": "resources.wealth", "lte": 30 }
          ]
        },
        "text": "年夜饭的菜不多，每一碗却都摆得认真。大人说够吃就是福气，孩子看着盘底，负责判断这句话是否需要复议。"
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
    "text": [
      {
        "conditions": { "all": [{ "path": "meta.age", "lte": 22 }, { "path": "education.status", "eq": "enrolled" }] },
        "text": "你和父母谈到升学、离家或喜欢做的事。他们先说现实，你先觉得不被理解；谈到最后仍没一致，至少彼此知道争执背后在怕什么。"
      },
      {
        "conditions": { "all": [{ "path": "meta.age", "lte": 22 }, { "path": "education.status", "neq": "enrolled" }] },
        "text": "你和父母谈到谋生、离家或喜欢做的事。他们先说日子要紧，你先觉得不被理解；谈到最后仍没一致，至少彼此知道争执背后在怕什么。"
      },
      {
        "conditions": { "all": [{ "path": "meta.age", "gte": 35 }] },
        "text": "父母年纪大了，你们难得把病情、养老和过去的误会放在一张桌上谈。许多旧事无法重来，今后的安排总算不再全靠猜。"
      },
      { "text": "你和父母认真谈了一次工作、家庭和彼此的期待。话没有全说开，也有几句说重了；临走前有人把水果塞给你，谈话便获得一个不算漂亮但可以继续的结尾。" }
    ],
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
    "maxOccurrences": 1,
    "lifetimeProbability": 0.24,
    "baseWeight": 12,
    "text": [
      {
        "conditions": {
          "all": [
            { "path": "meta.currentYear", "lte": 1949 },
            { "path": "location.currentCityTier", "in": ["village", "town"] }
          ]
        },
        "text": "亲戚来借买种、抓药或赎田的钱，开口前先把族里的辈分重新叙了一遍。借据写不写都伤体面，不借又会在下一场红白事上重逢；乡土很大，大到容得下几代人，也小到躲不开一笔账。"
      },
      {
        "conditions": {
          "all": [
            { "path": "meta.currentYear", "gte": 1950 },
            { "path": "meta.currentYear", "lte": 1977 }
          ]
        },
        "text": "亲戚来借一笔现钱，还试探着问能不能匀几张票证。工资簿上的数字彼此都知道，他仍从孩子近况说起，绕了很久才说难处；那个年代钱不算多，缺口却同样会挑一家人最薄的地方出现。"
      },
      {
        "conditions": {
          "all": [
            { "path": "meta.currentYear", "gte": 1978 },
            { "path": "meta.currentYear", "lte": 1999 },
            { "path": "career.status", "in": ["self_employed", "employed"] }
          ]
        },
        "text": "亲戚说想盘铺、进货或买一台机器，借钱时把将来的利润讲得很近。你听见机会，也听见他刻意没提的风险；亲情在这几年学会了谈生意，却还不习惯写清退出办法。"
      },
      {
        "conditions": {
          "all": [
            { "path": "meta.currentYear", "gte": 2000 },
            { "path": "resources.wealth", "lte": 34 }
          ]
        },
        "text": "亲戚知道你也不宽裕，还是来借医药费、学费或周转的钱。两个缺钱的人把各自账单摊开，像在比较哪一种窘迫更有资格先被照顾；最后谁开口说不，谁便显得比较残忍。"
      },
      {
        "conditions": {
          "all": [
            { "path": "meta.currentYear", "gte": 2015 },
            { "path": "resources.wealth", "gte": 65 }
          ]
        },
        "text": "亲戚在消息里发来一串解释和收款码，说只差这一笔就能把窟窿填上。你收入好些以后，族人便默认你离困难更远；屏幕上的转账只要一次确认，往后的关系却没有撤回键。"
      },
      {
        "conditions": {
          "all": [
            { "path": "relationships.family", "lte": 32 }
          ]
        },
        "text": "一位平日很少往来的亲戚忽然来借钱，把从前的亲近说得像刚发生过。你们都没有提上一笔迟迟未还的账；有些家庭记忆并未消失，只是在需要签字时才重新上线。"
      },
      {
        "text": "亲戚开口借钱，话说得客气，难处却是真的。你在情分和账本之间停了很久；他等一个数目，你想的却是下一次见面还能不能照常称呼。"
      }
    ],
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
    "lifetimeProbability": 0.4,
    "baseWeight": 18,
    "text": [
      {
        "conditions": { "all": [{ "path": "location.currentCityTier", "in": ["village", "town"] }] },
        "text": "村里有人家办丧事，来帮忙的人各自找到事情做。锅灶、白布和压低的说话声连成几天，你看见一个人的离开怎样由许多人共同料理。"
      },
      {
        "conditions": { "all": [{ "path": "meta.age", "lte": 18 }] },
        "text": "附近有人家办丧事，大人不让你多问。你从突然安静的巷道和几张疲惫的脸上，先明白了告别，再慢慢学会那个词。"
      },
      { "text": "附近有人家办丧事，巷道或楼道忽然安静下来。一个熟面孔从日常里消失以后，人们才发现他原来占着那么具体的位置。" }
    ],
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
    "text": [
      {
        "conditions": { "all": [{ "path": "meta.currentYear", "lte": 1978 }] },
        "text": "你去吃一场婚宴，借来的桌凳摆满院子，菜从灶房一盆盆端来。喜帖很薄，两家为席面、礼金和人情记下的账却要翻很久。"
      },
      {
        "conditions": { "all": [{ "path": "resources.wealth", "lte": 35 }] },
        "text": "你参加婚宴前把礼金数了几遍，既不能太少，也不能让这个月太难。席间人人说添福，回家后还是要把余下日子重新算平。"
      },
      { "text": "婚宴桌上挤着敬酒、亲戚玩笑和对新人的各种盘问。喜庆是真的，彼此比较也是真的；最后打包的剩菜比大多数祝词更实在。" }
    ],
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
          "path": "relationships.partnerStatus",
          "eq": "married"
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
    "text": [
      {
        "conditions": { "all": [{ "path": "resources.wealth", "lte": 35 }] },
        "text": "你们为一笔必要开支争起来：每一项都省过，每个人也都觉得自己已经退让。钱少时，账本不只记数字，还替疲惫寻找责任人。"
      },
      {
        "conditions": { "all": [{ "path": "relationships.children", "gte": 1 }] },
        "text": "你们为孩子的花费拌嘴，一个怕亏待眼前，一个怕拖累以后。争的看似是一张账单，其实是两种都说得通的担心。"
      },
      {
        "conditions": { "all": [{ "path": "meta.currentYear", "lte": 1975 }] },
        "text": "你和伴侣为储蓄、花费或谁承担得更多争了几句。算盘珠拨得很响，真正需要重新分配的却不只是钱。"
      },
      { "text": "你和伴侣为储蓄、花费或谁承担得更多争了几句。计算器按得很响，真正需要重新分配的却不只是钱。" }
    ],
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
    "text": [
      {
        "conditions": { "all": [{ "path": "meta.age", "lte": 16 }] },
        "text": "朋友随家人搬走，最后一天把几样小东西分给你。第二天你仍走原来的路，只是到了约好的地方，才想起以后不用等了。"
      },
      {
        "conditions": { "all": [{ "path": "meta.currentYear", "gte": 1990 }, { "path": "location.currentCityTier", "in": ["county", "city", "tier2", "tier1"] }] },
        "text": "朋友因为工作或房租搬到城市另一头。联系方式还在，见面却从‘下楼就来’变成要提前两周翻日程。"
      },
      { "text": "一个熟悉的朋友搬走了，临行前说以后常联系。住处留下空房，关系没有立刻消失，只是从日常碰面改成偶尔想起。" }
    ],
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
          "path": "relationships.partnerStatus",
          "eq": "married"
        }
      ]
    },
    "baseWeight": 18,
    "text": [
      {
        "conditions": { "all": [{ "path": "location.currentCityTier", "in": ["village", "town"] }] },
        "text": "姻亲带着自家种的东西来坐，先问收成和身体，再慢慢绕到夫妻过日子的事。茶换了几次，真正想说的话才走进屋里。"
      },
      {
        "conditions": { "all": [{ "path": "resources.wealth", "lte": 38 }] },
        "text": "姻亲来访，你们把家里体面的东西摆出来，谁也不先提最近的难处。临走时对方悄悄留下一个信封，客气话终于有了一点实际重量。"
      },
      { "text": "姻亲来家里坐了一阵，茶水、礼物和近况依次摆上桌。双方都在关心，也都小心不把关心问得太像审查。" }
    ],
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
    "text": [
      {
        "conditions": { "all": [{ "path": "meta.currentYear", "lte": 1985 }, { "path": "location.currentCityTier", "in": ["village", "town"] }] },
        "text": "孩子半夜烧得滚烫，你和家人轮流用湿布擦身，天没亮便准备去找卫生员。钟表不在手边，漫长主要由一次次摸额头来丈量。"
      },
      {
        "conditions": { "all": [{ "path": "resources.wealth", "lte": 35 }] },
        "text": "孩子半夜发烧，你一边量体温、找药，一边盘算若去医院要花多少。最后还是把钱塞进口袋；有些账可以以后再怕。"
      },
      { "text": "孩子半夜发烧，你记体温、喂水，又在灯下等药慢慢起效。每隔一会儿便去摸额头，那一夜被切成许多短短的担心。" }
    ],
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
    "text": [
      {
        "conditions": { "all": [{ "path": "meta.age", "gte": 55 }] },
        "text": "老同学聚在一起，先认人，再对着旧照片确认谁坐过哪排。有人谈退休，有人谈病，最响的笑声仍来自一件几十年前不肯承认的糗事。"
      },
      {
        "conditions": { "all": [{ "path": "resources.wealth", "lte": 38 }, { "path": "meta.currentYear", "lte": 1999 }] },
        "text": "同学聚会选的地方不算便宜，你犹豫后还是去了。席间有人谈工资、住房和孩子的去处，你把近况说得简短；真正让你放松的，是还有人记得你当年怕哪门课。"
      },
      {
        "conditions": { "all": [{ "path": "resources.wealth", "lte": 38 }] },
        "text": "同学聚会选的地方不算便宜，你犹豫后还是去了。席间有人谈房车职位，你把近况说得简短；真正让你放松的，是还有人记得你当年怕哪门课。"
      },
      { "text": "你见到多年不见的老同学，大家一边说从前，一边小心交换现在。亲近和比较同桌坐着，散席时仍有人陪你走到车站。" }
    ],
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
