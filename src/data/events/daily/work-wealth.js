// Auto-split event data. Keep events in this file focused on one era or theme.
export const dailyWorkWealthEvents = [
  {
    "id": "daily_lost_small_money",
    "title": "丢了点钱",
    "category": "wealth",
    "ageRange": [
      10,
      80
    ],
    "lifetimeProbability": 0.35,
    "baseWeight": 24,
    "weightModifiers": [
      {
        "path": "attrs.luck",
        "lte": 3,
        "multiply": 1.5
      }
    ],
    "text": [
      {
        "conditions": { "all": [{ "path": "resources.wealth", "lte": 30 }] },
        "text": "你丢了点钱。数目在别人看来不大，却正好够买几样已经算过的东西；你沿原路找了两遍，最后只捡回一肚子自责。"
      },
      {
        "conditions": { "all": [{ "path": "meta.currentYear", "lte": 1949 }] },
        "text": "你不知在哪里掉了几枚钱。衣袋翻过，来路走过，钱仍没有回来；那一天的日子并未停下，只是处处都像多收了一点价。"
      },
      { "text": "你丢了点钱，数额不大，却足够让这一天变得别扭。小损失最会占便宜：拿走的不多，留在心里的时间倒很长。" }
    ],
    "effects": [
      {
        "path": "resources.wealth",
        "add": -3
      },
      {
        "path": "resources.happiness",
        "add": -2
      }
    ]
  },
  {
    "id": "daily_skill_practice",
    "title": "练了一门手艺",
    "category": "career",
    "ageRange": [
      14,
      45
    ],
    "baseWeight": 26,
    "text": [
      {
        "conditions": { "all": [{ "path": "meta.currentYear", "lte": 1949 }] },
        "text": "你跟着熟手练认料、磨刃或走针，先做许多看不出成果的基本功。师傅很少夸人，只在一天收工时把更难的活递给了你。"
      },
      {
        "conditions": { "all": [{ "path": "career.status", "in": ["self_employed", "gig_worker"] }] },
        "text": "为了多接一种活，你在空闲时反复练一门实用技能。第一次成品只能自己留着，第二次勉强能交付，手艺便这样从废料里长出来。"
      },
      { "text": "你花一段时间练习一门实用手艺，把同一个动作做了又做。进步不显眼，直到某天遇到问题，双手先于脑子知道下一步。" }
    ],
    "effects": [
      {
        "path": "career.level",
        "add": 3
      },
      {
        "path": "resources.achievement",
        "add": 3
      },
      {
        "addTrait": "practical_skill"
      }
    ]
  },
  {
    "id": "daily_short_trip_to_town",
    "title": "去了一趟城里",
    "category": "migration",
    "ageRange": [
      8,
      55
    ],
    "currentRegions": {
      "cityTiers": [
        "village",
        "town",
        "county"
      ]
    },
    "baseWeight": 28,
    "text": [
      {
        "conditions": { "all": [{ "path": "meta.currentYear", "lte": 1948 }, { "path": "meta.age", "lte": 17 }] },
        "text": "你跟着大人或同伴去了一趟城里，先在渡口或城门边辨方向。集市、药铺和密集人群让路程显得很远，回来还要替邻居捎几样东西。"
      },
      {
        "conditions": { "all": [{ "path": "meta.currentYear", "gte": 1949 }, { "path": "meta.currentYear", "lte": 1978 }, { "path": "meta.age", "lte": 17 }] },
        "text": "你跟着大人或同伴去了一趟城里，先在车站、渡口或城门边辨方向。供销店、医院和密集人群让路程显得很远，回来还要替邻居捎几样东西。"
      },
      {
        "conditions": { "all": [{ "path": "meta.age", "lte": 12 }] },
        "text": "大人带你去更大的城里办事，始终叮嘱别松手。你记住高楼、车流和一份路上吃的东西，至于办了什么手续，很快便忘了。"
      },
      {
        "conditions": { "all": [{ "path": "meta.currentYear", "lte": 1948 }, { "path": "meta.age", "gte": 18 }] },
        "text": "你从村镇去城里办了一趟事，在渡口、城门和几条陌生街巷之间辨路。回程时还替邻居捎了药和日用品，肩上的包袱比见闻更先说明这趟路的用处。"
      },
      {
        "conditions": { "all": [{ "path": "meta.currentYear", "gte": 1949 }, { "path": "meta.currentYear", "lte": 1978 }, { "path": "meta.age", "gte": 18 }] },
        "text": "你从村镇去城里办了一趟事，跑过车站、供销店或医院。回来时还替邻居捎了几样东西；一趟路不只属于出门的人，也替没出门的人带回所需。"
      },
      { "text": "你从村镇去了一趟更大的城市，办事之外也看了看橱窗、车站和匆忙的人群。回程时景物已不新鲜，自己的生活却像被从外面看了一眼。" }
    ],
    "effects": [
      {
        "path": "resources.freedom",
        "add": 3
      },
      {
        "path": "resources.happiness",
        "add": 2
      },
      {
        "addTag": "town_trip_memory"
      }
    ]
  },
  {
    "id": "daily_workday_overtime",
    "title": "多干了一阵活",
    "category": "career",
    "ageRange": [
      20,
      60
    ],
    "baseWeight": 32,
    "conditions": {
      "any": [
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
          "eq": "gig_worker"
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
        "text": "你为东家或家里多赶了一阵活。天色早就暗了，手上的活计还没到能停的时候。"
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
              "lte": 1985
            }
          ]
        },
        "text": "你多干了一阵活。那时不一定叫加班，可能叫突击、赶任务，或者大家都不走你也不好走。"
      },
      {
        "text": "你加了一阵班。灯还亮着，消息还在响，身体已经开始偷偷抗议。"
      }
    ],
    "effects": [
      {
        "path": "resources.wealth",
        "add": 3
      },
      {
        "path": "resources.health",
        "add": -2
      },
      {
        "path": "resources.happiness",
        "add": -2
      }
    ]
  },
  {
    "id": "daily_small_promotion",
    "title": "被夸了一次",
    "category": "career",
    "ageRange": [
      18,
      60
    ],
    "baseWeight": 22,
    "conditions": {
      "any": [
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
    "text": [
      {
        "conditions": { "all": [{ "path": "career.status", "eq": "self_employed" }] },
        "text": "一位老客人当面夸你做事可靠，还介绍了新生意。自雇者没有表扬栏，回头客就是盖在账本上的红章。"
      },
      {
        "conditions": { "all": [{ "path": "meta.currentYear", "lte": 1948 }, { "path": "career.status", "eq": "employed" }] },
        "text": "东家、掌柜或工头当众说你这回做得稳妥，随后把下一件难活也递了过来。夸奖没有装进工钱袋，倒先替你证明能者确实容易多劳。"
      },
      {
        "conditions": { "all": [{ "path": "meta.currentYear", "gte": 1949 }, { "path": "meta.currentYear", "lte": 1985 }, { "path": "career.status", "eq": "employed" }] },
        "text": "班组或单位点名表扬你把一件活做得扎实，红榜上的名字比奖金先到。你回到岗位继续忙，同事说请客可以等工资，光荣最好别赊账。"
      },
      {
        "conditions": { "all": [{ "path": "career.income", "lte": 35 }, { "path": "meta.currentYear", "gte": 1986 }] },
        "text": "上级或同事夸你把一件琐碎工作做得稳妥，夸奖没有带来加薪。你仍高兴了一阵，也更清楚肯定与待遇不是同一种货币。"
      },
      {
        "conditions": { "all": [{ "path": "meta.currentYear", "gte": 2010 }, { "path": "career.field", "in": ["technology", "internet", "media", "office", "finance"] }] },
        "text": "你解决了一个拖了几天的问题，名字被认真写进工作群的感谢里。表情接了长长一串，待办事项也顺手多了两个；现代掌声很轻，常同新任务一起弹出来。"
      },
      { "text": "你妥善处理了一件工作，被人在众人面前认真肯定。掌声很短，回到座位仍是原来的活；那几句话却让疲惫暂时有了出处。" }
    ],
    "effects": [
      {
        "path": "career.level",
        "add": 2
      },
      {
        "path": "resources.achievement",
        "add": 3
      },
      {
        "path": "resources.happiness",
        "add": 2
      }
    ]
  },
  {
    "id": "daily_market_bargain",
    "title": "市集讲价",
    "category": "wealth",
    "ageRange": [
      18,
      85
    ],
    "lifetimeProbability": 0.4,
    "baseWeight": 24,
    "text": [
      {
        "conditions": { "all": [{ "path": "meta.currentYear", "lte": 1949 }] },
        "text": "你在集上同摊主讲了许久价。铜钱、秤星和彼此的脸色来回移动，最后各退一步；买卖做成了，双方仍坚持自己吃了亏。"
      },
      {
        "conditions": { "all": [{ "path": "resources.wealth", "lte": 35 }] },
        "text": "你为几样日用品讲了半天价。省下的钱很少，却能再添一顿菜；体面先站在旁边，等日子宽些再请回来。"
      },
      {
        "conditions": { "all": [{ "path": "meta.currentYear", "gte": 2015 }] },
        "text": "你比较了几家价格，又领券、凑单，终于省下一点钱。为了证明自己没有被算法安排，你认真配合了算法的全部步骤。"
      },
      { "text": "你在市集上讲了半天价。省下的钱不多，但那一刻你觉得自己从生活手里掰回了一点主动权。" }
    ],
    "effects": [
      {
        "path": "resources.wealth",
        "add": 2
      },
      {
        "path": "resources.happiness",
        "add": 1
      }
    ]
  },
  {
    "id": "daily_lottery_small_win",
    "title": "小奖",
    "category": "wealth",
    "yearRange": [
      1987,
      2035
    ],
    "ageRange": [
      18,
      80
    ],
    "baseWeight": 8,
    "weightModifiers": [
      {
        "path": "attrs.luck",
        "gte": 7,
        "multiply": 2.5
      },
      {
        "hasTrait": "strong_luck",
        "multiply": 2
      }
    ],
    "text": [
      {
        "conditions": { "all": [{ "path": "resources.wealth", "lte": 35 }] },
        "text": "一张票中了小奖，你先高兴，随后便把钱分给几项欠着的开支。好运在手里停得很短，倒确实让这个月松了一口气。"
      },
      {
        "conditions": { "all": [{ "path": "meta.age", "gte": 60 }] },
        "text": "你核对几遍才相信中了小奖，笑着说够请家里吃顿饭。金额不大，晚辈却难得听你主动说一次‘今天我来付’。"
      },
      { "text": "你偶然买的一张票中了小奖，金额离改变人生很远，却够让一天变得轻快。领奖后你把票根留了一阵，像保存命运一次不太正式的道歉。" }
    ],
    "effects": [
      {
        "path": "resources.wealth",
        "add": 8
      },
      {
        "path": "resources.happiness",
        "add": 5
      },
      {
        "addTag": "small_luck_win"
      }
    ]
  },
  {
    "id": "daily_payday_small_relief",
    "title": "发工资那天",
    "category": "wealth",
    "yearRange": [
      1950,
      2035
    ],
    "ageRange": [
      18,
      70
    ],
    "conditions": {
      "any": [
        {
          "path": "career.status",
          "eq": "employed"
        },
        {
          "path": "career.status",
          "eq": "gig_worker"
        }
      ]
    },
    "baseWeight": 28,
    "text": [
      {
        "conditions": {
          "all": [
            {
              "path": "meta.currentYear",
              "lte": 1992
            }
          ]
        },
        "text": "发工资那天，你把钱和票据仔细收好。数字不大，却能让一家人的饭桌暂时稳住。"
      },
      {
        "conditions": {
          "all": [
            {
              "path": "meta.currentYear",
              "gte": 1993
            },
            {
              "path": "meta.currentYear",
              "lte": 2009
            }
          ]
        },
        "text": "发工资那天，你核对信封、存折或银行卡上的数字。很多压力没有消失，只是终于能按先后排一排。"
      },
      {
        "text": "发工资那天，手机或银行卡里的数字终于落下。很多压力没有消失，只是暂时往后挪了几步。"
      }
    ],
    "effects": [
      {
        "path": "resources.wealth",
        "add": 5
      },
      {
        "path": "resources.happiness",
        "add": 2
      }
    ]
  },
  {
    "id": "daily_work_mistake_scolded",
    "title": "工作出了错",
    "category": "career",
    "yearRange": [
      1950,
      2035
    ],
    "ageRange": [
      18,
      65
    ],
    "conditions": {
      "any": [
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
          "eq": "gig_worker"
        }
      ]
    },
    "baseWeight": 24,
    "text": [
      {
        "conditions": { "all": [{ "path": "career.status", "in": ["self_employed", "gig_worker"] }] },
        "text": "你把一单活的时间、尺寸或地址弄错，只能自己赔礼、返工并承担损失。没人正式训你，顾客的一句质问和少掉的收入已经够完整。"
      },
      {
        "conditions": { "all": [{ "path": "career.income", "lte": 35 }] },
        "text": "工作里一处小错被上级当众放大，你低头补救，不敢争辩语气是否过分。岗位越不稳，人的尊严越常被要求等下班后再处理。"
      },
      { "text": "你在工作中漏掉一个环节，被当面说了几句。事情后来补上，你也记下怎样避免再犯；错误是一课，羞辱并不是必需的教材。" }
    ],
    "effects": [
      {
        "path": "career.level",
        "add": -1
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
        "addTag": "work_mistake_memory"
      }
    ]
  },
  {
    "id": "daily_colleague_shared_meal",
    "title": "同事一起吃饭",
    "category": "relationship",
    "yearRange": [
      1950,
      2035
    ],
    "ageRange": [
      18,
      65
    ],
    "conditions": {
      "all": [
        {
          "path": "career.status",
          "eq": "employed"
        }
      ]
    },
    "baseWeight": 24,
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
        "text": "你和同事在食堂或小馆子里吃了一顿饭。饭菜普通，闲话却让单位的墙变得没那么冷。"
      },
      {
        "text": "你和同事一起吃了顿饭，聊工作，也聊一些不方便写进工作群的事。关系就在这些缝隙里变熟。"
      }
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
        "addTag": "workplace_friendship"
      }
    ]
  },
  {
    "id": "daily_small_tool_bought",
    "title": "买了件趁手工具",
    "category": "wealth",
    "yearRange": [
      1978,
      2035
    ],
    "ageRange": [
      16,
      65
    ],
    "baseWeight": 20,
    "text": [
      {
        "conditions": {
          "all": [
            {
              "path": "career.field",
              "in": [
                "factory",
                "manual_worker",
                "apprentice",
                "township_business"
              ]
            }
          ]
        },
        "text": "你买了件趁手工具。它不贵，却让手里的活顺了一点，像给日子加了一个小齿轮。"
      },
      {
        "conditions": {
          "all": [
            { "path": "career.field", "in": ["farm_work", "agriculture", "rural_work"] },
            { "path": "location.currentCityTier", "in": ["village", "town"] }
          ]
        },
        "text": "你换了一件握着更顺手的农具，旧的没有扔，靠在墙边留作备用。新工具省下几分力气，田里的活便很快把省下的力气也安排完了。"
      },
      {
        "conditions": {
          "all": [
            { "path": "career.status", "in": ["self_employed", "gig_worker"] }
          ]
        },
        "text": "你给自己添了一件接活常用的小工具，先在三家店比价，又把保修单收好。它还没替你挣钱，已经先获得了一个不能弄丢的位置。"
      },
      {
        "conditions": {
          "all": [
            { "path": "resources.wealth", "lte": 38 }
          ]
        },
        "text": "你买下一件修过的旧工具，外壳有前任留下的磕痕，关键处仍好用。便宜不是缺点，突然坏在交活那天才是；你回家先把螺丝又紧了一遍。"
      },
      {
        "conditions": {
          "all": [
            { "path": "meta.currentYear", "gte": 2010 },
            { "path": "career.field", "in": ["professional", "teacher", "education", "healthcare", "office", "technology"] }
          ]
        },
        "text": "你添了一件每天都会用到的小设备，把反复卡手的步骤缩短一点。购买页面许诺提高效率，真正见效的是你从此少骂那根接触不良的线。"
      },
      {
        "text": "你买了件真正用得上的小工具。花钱时心疼，后来每次用上，又觉得这笔钱没有消失，只是变成手里一声干脆的咔哒。"
      }
    ],
    "effects": [
      {
        "path": "resources.wealth",
        "add": -3
      },
      {
        "path": "career.level",
        "add": 2
      },
      {
        "path": "resources.achievement",
        "add": 2
      },
      {
        "addTag": "useful_tool_memory"
      }
    ]
  },
  {
    "id": "daily_debt_due_day",
    "title": "还账的日子",
    "category": "wealth",
    "yearRange": [
      1978,
      2035
    ],
    "ageRange": [
      20,
      70
    ],
    "baseWeight": 18,
    "weightModifiers": [
      {
        "path": "resources.wealth",
        "lte": 35,
        "multiply": 1.7
      },
      {
        "hasTag": "kinship_debt_memory",
        "multiply": 1.4
      }
    ],
    "text": [
      {
        "conditions": { "all": [{ "hasTag": "kinship_debt_memory" }] },
        "text": "向亲友借的钱到了约定归还的时候，你把数目凑齐，也带上一点礼。熟人不一定催，正因为不催，这笔账在心里反而更响。"
      },
      {
        "conditions": { "all": [{ "path": "resources.wealth", "lte": 35 }] },
        "text": "还款日到了，钱仍差一点。你重新安排吃穿，又打电话商量期限；欠债让每个普通开支都像站到法庭上说明自己为何必要。"
      },
      { "text": "到了还账的日子，你把本金、利息和手头余钱重新核了一遍。钱转出去以后并不轻松，只是那张一直悬着的日历终于翻过一页。" }
    ],
    "effects": [
      {
        "path": "resources.wealth",
        "add": -7
      },
      {
        "path": "resources.happiness",
        "add": -5
      },
      {
        "addTag": "debt_pressure_memory"
      }
    ]
  },
  {
    "id": "daily_commute_long_ride",
    "title": "很长的通勤",
    "category": "career",
    "yearRange": [
      1995,
      2035
    ],
    "ageRange": [
      18,
      65
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
          "path": "career.status",
          "eq": "employed"
        },
        {
          "path": "career.status",
          "eq": "gig_worker"
        }
      ]
    },
    "baseWeight": 22,
    "text": "你在路上花了很久，车厢里的人一起沉默着摇晃。城市给了你机会，也把时间切成一段一段。",
    "effects": [
      {
        "path": "resources.health",
        "add": -2
      },
      {
        "path": "resources.happiness",
        "add": -3
      },
      {
        "path": "career.income",
        "add": 1
      },
      {
        "addTag": "long_commute_memory"
      }
    ]
  },
  {
    "id": "daily_side_job_attempt",
    "title": "试着赚点外快",
    "category": "wealth",
    "yearRange": [
      1985,
      2035
    ],
    "ageRange": [
      18,
      60
    ],
    "baseWeight": 20,
    "text": [
      {
        "conditions": {
          "all": [
            {
              "path": "meta.currentYear",
              "lte": 1999
            }
          ]
        },
        "text": "你试着做点小买卖、接点零活。白天的身份还在，晚上却多了一本自己的小账。"
      },
      {
        "text": "你试着赚点外快。时间被挤得更紧，但银行卡里多出来的数字让你舍不得停。"
      }
    ],
    "effects": [
      {
        "path": "resources.wealth",
        "add": 5
      },
      {
        "path": "resources.health",
        "add": -2
      },
      {
        "path": "resources.freedom",
        "add": 1
      },
      {
        "addTag": "side_job_memory"
      }
    ]
  }
];
