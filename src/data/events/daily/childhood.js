// Auto-split event data. Keep events in this file focused on one era or theme.
export const dailyChildhoodEvents = [
  {
    "id": "daily_childhood_firefly",
    "title": "捉萤火虫",
    "category": "random",
    "ageRange": [
      4,
      10
    ],
    "birthRegions": {
      "cityTiers": [
        "village",
        "town",
        "county"
      ]
    },
    "baseWeight": 42,
    "text": [
      {
        "conditions": { "all": [{ "path": "meta.currentYear", "lte": 1949 }, { "path": "location.currentCityTier", "in": ["village", "town"] }] },
        "text": "夏夜没有多少灯，田埂和草沟里的萤火便显得很亮。你跟着大孩子用蒲扇轻轻拢住几点微光，空罐子被轮流看了半天，谁都舍不得先说其实没抓住。"
      },
      {
        "conditions": { "all": [{ "path": "meta.currentYear", "gte": 1950 }, { "path": "meta.currentYear", "lte": 1989 }, { "path": "location.currentCityTier", "eq": "village" }] },
        "text": "收工后的大人坐在院边说话，你和伙伴沿田脚追萤火虫。有人拿旧药瓶当灯笼，瓶盖扎了孔，郑重得像给几只虫子办了户口。"
      },
      {
        "conditions": { "all": [{ "path": "meta.currentYear", "gte": 1990 }, { "path": "location.currentCityTier", "eq": "county" }] },
        "text": "城边难得见到几只萤火虫，大人让你先关掉手电。黑暗安静下来以后，那几点微光才肯出现；你追了几步，又怕追得太近把它们吓回草里。"
      },
      {
        "conditions": { "all": [{ "path": "meta.currentYear", "gte": 2005 }, { "path": "location.currentCityTier", "in": ["village", "town"] }] },
        "text": "夏夜里，草丛亮起零星萤火。伙伴说手机拍不出来才算真的，你们便把屏幕收起来追了一阵，最后每个人都声称自己刚才看见的最大。"
      },
      {
        "conditions": { "all": [{ "path": "resources.wealth", "lte": 30 }] },
        "text": "天黑以后没有新的玩具，草边的萤火虫便足够让一群孩子忙上一晚。你摊开手，掌心只有草叶的凉气，回家时仍觉得带走了一点光。"
      },
      { "text": "夏夜里，草丛间有萤火虫忽明忽暗。你同伙伴追了一阵，最后都停下来只看；有些微光装不进口袋，也不妨碍它照亮一个晚上。" }
    ],
    "effects": [
      {
        "path": "resources.happiness",
        "add": 5
      },
      {
        "path": "relationships.friendship",
        "add": 2
      },
      {
        "addTag": "rural_childhood_light"
      }
    ]
  },
  {
    "id": "daily_old_song_on_radio",
    "title": "听到一首旧歌",
    "category": "random",
    "ageRange": [
      30,
      90
    ],
    "lifetimeProbability": 0.4,
    "baseWeight": 28,
    "text": [
      {
        "conditions": { "all": [{ "path": "meta.currentYear", "lte": 1949 }] },
        "text": "你听见有人哼起一支旧调。词已经记不全了，腔却还在；许多没留下相片的年月，顺着那一点旋律回到眼前。"
      },
      {
        "conditions": {
          "all": [
            { "path": "meta.currentYear", "gte": 1950 },
            { "path": "meta.currentYear", "lte": 1995 }
          ]
        },
        "text": "收音机里忽然响起一首旧歌。旋律比记忆可靠，前奏才走几步，你已经回到另一个屋子和另一张年轻的脸旁边。"
      },
      {
        "conditions": { "all": [{ "path": "meta.currentYear", "gte": 2005 }] },
        "text": "播放列表偶然推来一首旧歌。机器并不知道它替你打开了哪一年，只知道你停下来，完整听完了一遍。"
      },
      { "text": "你偶然听到一首旧歌。旋律一响，很多早就不提的年份忽然从心里抬头。" }
    ],
    "effects": [
      {
        "path": "resources.happiness",
        "add": 2
      },
      {
        "path": "attrs.mental",
        "add": 1
      }
    ]
  },
  {
    "id": "daily_childhood_mud_after_rain",
    "title": "雨后踩泥",
    "category": "random",
    "ageRange": [
      3,
      10
    ],
    "birthRegions": {
      "cityTiers": [
        "village",
        "town",
        "county"
      ]
    },
    "baseWeight": 34,
    "text": [
      {
        "conditions": { "all": [{ "path": "meta.age", "lte": 3 }] },
        "text": "雨停后，大人牵着三岁的孩子绕过泥坑，鞋尖还是不慎踩进去。孩子低头看水花，大人先把人抱稳，再去想这双鞋怎样洗。"
      },
      {
        "conditions": { "all": [{ "path": "meta.currentYear", "lte": 1949 }] },
        "text": "雨后土路软下来，你跟着大孩子挑浅处走，草鞋和布鞋仍各自带回一圈泥。进门前大家刮了半天鞋底，门槛最后也分到了一份。"
      },
      {
        "conditions": { "all": [
          { "path": "meta.currentYear", "gte": 1950 },
          { "path": "meta.currentYear", "lte": 1977 },
          { "path": "location.currentCityTier", "in": ["village", "town"] }
        ] },
        "text": "雨后田边的土软了，你和几个孩子用树枝划出不能踩的秧地，再专挑路上的泥印脚。规矩执行得很好，裤脚对此另有记录。"
      },
      {
        "conditions": { "all": [
          { "path": "meta.currentYear", "gte": 1978 },
          { "path": "meta.currentYear", "lte": 2005 },
          { "path": "location.currentCityTier", "in": ["village", "town"] }
        ] },
        "text": "雨停以后，村路上留下拖拉机和自行车压出的水沟。你们沿着凸起处比赛走直线，最先掉进泥里的人负责宣布这局不算。"
      },
      {
        "conditions": { "all": [
          { "path": "meta.currentYear", "gte": 2006 },
          { "path": "location.currentCityTier", "in": ["village", "town"] }
        ] },
        "text": "雨后路边的土软了，你和孩子们挑不深的地方踩脚印，还用鞋印比谁跳得远。回家前先在草上蹭鞋，办法很认真，效果比较谦虚。"
      },
      {
        "conditions": { "all": [{ "path": "location.currentCityTier", "eq": "county" }] },
        "text": "雨水在县城边的空地积成几处浅洼，你跟着同伴绕着走，最后仍有人故意踩响最大的一处。袜子先湿，大人的责问随后按脚印找到本人。"
      },
      { "text": "雨停后，几个孩子带着你在泥地边留下一串大小不一的脚印。大人远远喊别再踩了，队伍这才拖着湿鞋往回走。" }
    ],
    "effects": [
      {
        "path": "resources.happiness",
        "add": 4
      },
      {
        "path": "relationships.friendship",
        "add": 3
      },
      {
        "addTag": "muddy_childhood_memory"
      }
    ]
  },
  {
    "id": "daily_childhood_small_shop_glass_jar",
    "title": "小卖部玻璃罐",
    "category": "wealth",
    "ageRange": [
      5,
      14
    ],
    "yearRange": [
      1978,
      2015
    ],
    "currentRegions": {
      "cityTiers": [
        "village",
        "town",
        "county",
        "city"
      ]
    },
    "baseWeight": 30,
    "text": "小卖部柜台上摆着玻璃罐，糖果和零钱在里面发亮。你攥着几枚硬币，认真计算今天的快乐值多少钱。",
    "effects": [
      {
        "path": "resources.wealth",
        "add": -1
      },
      {
        "path": "resources.happiness",
        "add": 4
      },
      {
        "addTag": "small_shop_childhood"
      }
    ]
  },
  {
    "id": "daily_childhood_first_bicycle_ride",
    "title": "学骑车",
    "category": "random",
    "ageRange": [
      6,
      14
    ],
    "yearRange": [
      1965,
      2025
    ],
    "baseWeight": 24,
    "text": "你学着骑车，车把晃得厉害，膝盖也磕了一下。可真正骑出去那几米时，风像突然站到了你这边。",
    "effects": [
      {
        "path": "resources.health",
        "add": 2
      },
      {
        "path": "resources.freedom",
        "add": 4
      },
      {
        "addTag": "first_bicycle_memory"
      }
    ]
  },
  {
    "id": "daily_childhood_hide_from_adults",
    "title": "躲着大人玩",
    "category": "relationship",
    "ageRange": [
      5,
      13
    ],
    "baseWeight": 28,
    "text": [
      {
        "conditions": { "all": [{ "path": "location.currentCityTier", "in": ["village", "town"] }] },
        "text": "你和几个孩子躲到柴垛或屋后玩，大人一喊名字，大家立刻安静。秘密地点离灶台没几步，胆量倒像走了很远。"
      },
      {
        "conditions": { "all": [{ "path": "meta.currentYear", "gte": 1995 }, { "path": "location.currentCityTier", "in": ["county", "city", "tier2", "tier1"] }] },
        "text": "你们躲在楼梯转角或小区角落玩，约好不让大人找到。监控和家长的喊声使这块领地很短命，规矩却由孩子们自己定。"
      },
      { "text": "你和几个孩子找到一处不太显眼的角落，躲着大人玩了一阵。谁负责望风、谁可以加入，第一次都由你们自己商量。" }
    ],
    "effects": [
      {
        "path": "relationships.friendship",
        "add": 5
      },
      {
        "path": "resources.freedom",
        "add": 2
      },
      {
        "addTag": "childhood_secret_place"
      }
    ]
  },
  {
    "id": "daily_childhood_scared_by_thunder",
    "title": "被雷声吓醒",
    "category": "health",
    "ageRange": [
      2,
      9
    ],
    "baseWeight": 20,
    "text": [
      {
        "conditions": { "all": [{ "path": "meta.age", "lte": 3 }] },
        "text": "雷声在半夜突然压过屋顶，两三岁的孩子惊醒大哭。照料者摸黑把孩子抱起，轻拍后背；窗外仍在闪，怀里的呼吸先慢下来。"
      },
      {
        "conditions": { "all": [{ "path": "location.currentCityTier", "in": ["village", "town"] }, { "path": "meta.currentYear", "lte": 1985 }] },
        "text": "雷声滚过瓦屋，窗纸一亮一暗。大人起身查看门窗，又把你往被里掖好；他们也怕屋漏，只是先顾不上表现。"
      },
      { "text": "半夜一声闷雷把你惊醒，家人来到床边，开一盏小灯陪了片刻。雷雨没有马上过去，屋里有人在便已不同。" }
    ],
    "effects": [
      {
        "path": "resources.happiness",
        "add": -2
      },
      {
        "path": "relationships.family",
        "add": 3
      },
      {
        "addTag": "thunder_night_memory"
      }
    ]
  },
  {
    "id": "daily_childhood_fair_crowd",
    "title": "赶集的人群",
    "category": "random",
    "ageRange": [
      4,
      15
    ],
    "birthRegions": {
      "cityTiers": [
        "village",
        "town",
        "county"
      ]
    },
    "baseWeight": 26,
    "text": [
      {
        "conditions": { "all": [{ "path": "meta.currentYear", "lte": 1978 }] },
        "text": "你跟着大人赶集，布匹、农具和几筐时鲜排在土路两边。大人反复还价，你盯着油锅，双方关心的都是有限家用怎样花。"
      },
      {
        "conditions": { "all": [{ "path": "resources.wealth", "lte": 35 }] },
        "text": "集上吃食很多，大人只给你买了最便宜的一小份，又把要买的盐和针线逐项数清。热闹可以随便看，花钱仍要排次序。"
      },
      { "text": "你随大人去赶集，人声、秤砣、车铃和熟食香挤在一路。大人怕你走散，始终攥着你的手；你走得慢，眼睛却忙得很。" }
    ],
    "effects": [
      {
        "path": "attrs.intelligence",
        "add": 1
      },
      {
        "path": "resources.happiness",
        "add": 3
      },
      {
        "addTag": "rural_fair_memory"
      }
    ]
  },
  {
    "id": "daily_childhood_television_neighbors",
    "title": "挤着看电视",
    "category": "random",
    "yearRange": [
      1982,
      2005
    ],
    "ageRange": [
      4,
      16
    ],
    "baseWeight": 22,
    "text": "晚上，几个邻居挤在一台电视前。屏幕不大，雪花点也不少，可整个院子或楼道都跟着亮了起来。",
    "effects": [
      {
        "path": "relationships.friendship",
        "add": 4
      },
      {
        "path": "resources.happiness",
        "add": 4
      },
      {
        "addTag": "shared_tv_childhood"
      }
    ]
  }
];
