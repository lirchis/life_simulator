// Auto-split event data. Keep events in this file focused on one era or theme.
export const historyContemporaryEvents = [
  {
    "id": "era_wto_factory_orders",
    "title": "订单像潮水",
    "category": "career",
    "yearRange": [
      2001,
      2008
    ],
    "ageRange": [
      18,
      55
    ],
    "currentRegions": {
      "provinceGroups": [
        "province.coastal"
      ]
    },
    "maxOccurrences": 1,
    "priority": 42,
    "baseWeight": 45,
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
        "text": "加入 WTO 后，厂里的订单像潮水一样涌来。女工宿舍的灯很晚才灭，你在工资条上看见世界，也看见自己的青春被计件。"
      },
      {
        "text": "加入 WTO 后，厂里的订单像潮水一样涌来。你在流水线旁站到腿麻，也在工资条上看见世界的影子。"
      }
    ],
    "effects": [
      {
        "path": "career.income",
        "add": 10
      },
      {
        "path": "resources.wealth",
        "add": 12
      },
      {
        "path": "resources.health",
        "add": -5
      },
      {
        "path": "resources.achievement",
        "add": 5
      },
      {
        "addTag": "wto_wave_worker"
      }
    ]
  },
  {
    "id": "era_sars_quarantine",
    "title": "非典隔离",
    "category": "health",
    "yearRange": [
      2003,
      2003
    ],
    "ageRange": [
      0,
      80
    ],
    "currentRegions": {
      "cityTiers": [
        "city",
        "tier2",
        "tier1"
      ]
    },
    "maxOccurrences": 1,
    "priority": 48,
    "baseWeight": 45,
    "text": [
      {
        "conditions": {
          "all": [
            { "path": "meta.age", "gte": 6 },
            { "path": "meta.age", "lte": 18 }
          ]
        },
        "text": "学校停课，老师隔着电话布置作业，大人每天给你量体温。你第一次看见春天的操场空着，也第一次知道一声咳嗽会让整节楼道同时安静。"
      },
      {
        "conditions": {
          "any": [
            { "path": "career.field", "in": ["healthcare", "doctor", "nurse"] },
            { "path": "resources.health", "lte": 40 }
          ]
        },
        "text": "口罩勒痕、体温表和消毒水成了每天的次序。你离发热门诊或病床比多数人更近，回家前先在门外换衣服，怕把工作里看不见的东西带给家人。"
      },
      {
        "text": "小区登记出入，单位反复量体温，口罩和消毒水占满生活。城市忽然安静下来，你同家人把新闻声音调得很小，仿佛大声说话也会惊动风险。"
      }
    ],
    "effects": [
      {
        "path": "resources.health",
        "add": -3
      },
      {
        "path": "resources.happiness",
        "add": -6
      },
      {
        "path": "relationships.family",
        "add": 3
      },
      {
        "addTag": "sars_memory"
      }
    ]
  },
  {
    "id": "era_olympic_opening_night",
    "title": "北京奥运夜",
    "category": "random",
    "yearRange": [
      2008,
      2008
    ],
    "ageRange": [
      0,
      100
    ],
    "priority": 42,
    "maxOccurrences": 1,
    "baseWeight": 90,
    "text": [
      {
        "conditions": {
          "all": [
            { "path": "meta.age", "lte": 8 }
          ]
        },
        "text": "那一夜，大人把你抱到电视前看烟火和会发光的脚印。你未必懂开幕式意味着什么，只记得所有人同时喊好，平常催你睡觉的人也破例熬了夜。"
      },
      {
        "conditions": {
          "any": [
            { "hasTag": "migrant_worker" },
            { "path": "career.field", "in": ["construction", "factory", "logistics", "manual_worker"] }
          ]
        },
        "text": "你同工友挤在宿舍或值班室的小电视前看开幕式。镜头里的北京灯火通明，镜头外还有夜班要接；你为那份盛大高兴，也知道盛大是许多普通人的工时搭起来的。"
      },
      {
        "conditions": {
          "all": [
            { "path": "location.currentProvince", "eq": "beijing" },
            { "path": "meta.age", "gte": 9 }
          ]
        },
        "text": "你在北京听见远处场馆和街面一层层响起欢呼，没进现场的人也守着电视和窗外。安保绕路、临时管制和烟火同时存在，城市难得把麻烦与骄傲排在同一晚。"
      },
      {
        "conditions": {
          "all": [
            { "path": "meta.age", "gte": 9 },
            { "path": "meta.age", "lte": 22 },
            { "hasTag": "student" }
          ]
        },
        "text": "你同同学守着开幕式，讨论点火方式比讨论作业认真得多。第二天有人能复述整套节目，却想不起暑假作业放在哪一页，记忆显然也会挑大型项目。"
      },
      {
        "conditions": {
          "all": [
            { "path": "meta.age", "gte": 65 }
          ]
        },
        "text": "你坐在家里看开幕式，听年轻人解释那些新技术，也认出画面里几处旧北京的影子。国家和城市走了很远，遥控器上的小字则拒绝共同进步。"
      },
      {
        "conditions": {
          "all": [
            { "path": "resources.wealth", "lte": 35 },
            { "path": "meta.age", "gte": 9 }
          ]
        },
        "text": "你在邻居家、店铺门口或公共电视前看开幕式，人挤得遥控器彻底失去意义。烟火升起时大家一同叫好，散场后仍各自回到要早起的日子。"
      },
      {
        "text": "那一夜，一家人围着电视看北京，烟火升起时楼上楼下同时传来掌声。你跟着高兴，也把遥控器放在桌上——这样完整地一起看完一个节目，已经很久没有过。"
      }
    ],
    "effects": [
      {
        "path": "resources.happiness",
        "add": 8
      },
      {
        "path": "resources.reputation",
        "add": 3
      },
      {
        "addTag": "beijing_olympics_memory"
      }
    ]
  },
  {
    "id": "era_2008_financial_crisis_order_cut",
    "maxOccurrences": 1,
    "title": "外贸单少了",
    "category": "wealth",
    "yearRange": [
      2008,
      2010
    ],
    "ageRange": [
      18,
      60
    ],
    "currentRegions": {
      "provinceGroups": [
        "province.coastal"
      ]
    },
    "baseWeight": 32,
    "conditions": {
      "any": [
        {
          "hasTag": "wto_wave_worker"
        },
        {
          "hasTag": "migrant_worker"
        },
        {
          "path": "career.field",
          "eq": "trade"
        }
      ]
    },
    "text": "厂里突然少了订单，加班表空出一大片。远在大洋彼岸的风暴，最后吹到你的工资条上。",
    "effects": [
      {
        "path": "resources.wealth",
        "add": -10
      },
      {
        "path": "resources.happiness",
        "add": -6
      },
      {
        "path": "career.income",
        "add": -8
      },
      {
        "addTag": "financial_crisis_hit"
      }
    ]
  },
  {
    "id": "era_high_speed_rail_home",
    "maxOccurrences": 1,
    "title": "高铁回家",
    "category": "migration",
    "yearRange": [
      2010,
      2020
    ],
    "ageRange": [
      18,
      70
    ],
    "conditions": {
      "any": [
        {
          "hasTag": "migrant"
        },
        {
          "hasTag": "migrant_worker"
        },
        {
          "path": "resources.wealth",
          "gte": 45
        }
      ]
    },
    "baseWeight": 26,
    "text": [
      {
        "conditions": {
          "any": [
            { "hasTag": "migrant_worker" },
            { "path": "resources.wealth", "lte": 40 }
          ]
        },
        "text": "你算过普快、长途车和误工的价钱，最后买了一张高铁二等座。票不便宜，省下的十几个小时却能多在家吃一顿饭；速度第一次被你按工资和团聚一起衡量。"
      },
      {
        "conditions": {
          "all": [
            { "path": "relationships.children", "gte": 1 }
          ]
        },
        "text": "你带着孩子坐高铁回家，零食、行李和老人催问到哪儿的电话挤在小桌板上。孩子嫌几个小时太久，你想起从前在站外排一夜队，觉得抱怨也是交通进步的一种证据。"
      },
      {
        "conditions": {
          "all": [
            { "path": "meta.age", "gte": 55 }
          ]
        },
        "text": "你第一次独自坐高铁回去，进站前把车次和座位抄在纸上，手机里也存了一份。列车开得很稳，你仍提前很久收好水杯，像旧日慢车随时会突然到站。"
      },
      {
        "conditions": {
          "all": [
            { "path": "location.currentCityTier", "in": ["village", "town", "county"] }
          ]
        },
        "text": "你先坐一段车到高铁站，再沿更快的线路回家。最快的那一程反而最省心，真正难算的是出村、换乘和最后还有谁肯来接。"
      },
      {
        "conditions": {
          "all": [
            { "path": "resources.wealth", "gte": 68 }
          ]
        },
        "text": "你临时买票回去看家里人，不必再为一趟路专门请下整天假。方便使探望少了些壮举意味，也少了一个总说等有长假再回的借口。"
      },
      {
        "text": "你坐高铁回家，熟悉的城市和田野在窗外迅速后退。距离没有消失，只从一整天的颠簸变成几个小时的安静，让临时决定回去看看不再像一项工程。"
      }
    ],
    "effects": [
      {
        "path": "relationships.family",
        "add": 5
      },
      {
        "path": "resources.happiness",
        "add": 4
      },
      {
        "path": "resources.freedom",
        "add": 3
      },
      {
        "addTag": "high_speed_rail_life"
      }
    ]
  },
  {
    "id": "era_housing_price_pressure",
    "maxOccurrences": 1,
    "title": "房价压顶",
    "category": "wealth",
    "yearRange": [
      2005,
      2020
    ],
    "ageRange": [
      24,
      45
    ],
    "currentRegions": {
      "cityTiers": [
        "city",
        "tier2",
        "tier1"
      ]
    },
    "baseWeight": 42,
    "weightModifiers": [
      {
        "path": "environment.housingPressure",
        "gte": 8,
        "multiply": 1.8
      },
      {
        "path": "resources.wealth",
        "lte": 45,
        "multiply": 1.4
      }
    ],
    "text": [
      {
        "conditions": {
          "all": [
            { "path": "resources.wealth", "lte": 35 }
          ]
        },
        "text": "你在中介橱窗前把总价除以一年收入，又除了一遍，仍觉得计算器出了问题。买房暂时不像选择，更像一道负责提醒差距的应用题；你转身继续问下个月房租。"
      },
      {
        "conditions": {
          "all": [
            { "path": "relationships.children", "gte": 1 }
          ]
        },
        "text": "你和家人看房时同时比较通勤、学位、老人能否帮忙和孩子住哪一间。沙盘只展示楼间距，没有展示接下来二十多年谁不敢失业。"
      },
      {
        "text": "售楼处的沙盘灯火通明，你在首付、月供和通勤时间之间反复移动预算。未来终于有了门牌号，也被银行整齐地切成许多个还款日。"
      }
    ],
    "effects": [
      {
        "path": "resources.wealth",
        "add": -10
      },
      {
        "path": "resources.happiness",
        "add": -7
      },
      {
        "path": "resources.freedom",
        "add": -6
      },
      {
        "addTag": "housing_pressure"
      }
    ]
  },
  {
    "id": "era_mobile_internet_first_smartphone",
    "title": "第一部智能手机",
    "category": "random",
    "yearRange": [
      2010,
      2020
    ],
    "ageRange": [
      10,
      70
    ],
    "maxOccurrences": 1,
    "baseWeight": 45,
    "text": [
      {
        "conditions": {
          "all": [
            {
              "path": "meta.currentYear",
              "lte": 2012
            }
          ]
        },
        "text": "你换了第一部智能手机。地图、聊天和网页第一次一起装进口袋，屏幕不算大，手指却像忽然多了很多路。"
      },
      {
        "conditions": {
          "all": [
            {
              "path": "meta.currentYear",
              "lte": 2016
            }
          ]
        },
        "text": "你换了第一部智能手机。拍照、群聊、地图和打车挤进手心，许多原来要在电脑前做的事开始跟着人走。"
      },
      {
        "text": "你换了第一部智能手机。地图、聊天、支付和短视频挤进手心，世界从桌面搬到了口袋。"
      }
    ],
    "effects": [
      {
        "path": "resources.freedom",
        "add": 6
      },
      {
        "path": "relationships.friendship",
        "add": 4
      },
      {
        "path": "resources.happiness",
        "add": 3
      },
      {
        "addTrait": "networked_mind"
      },
      {
        "addTag": "smartphone_generation"
      }
    ]
  },
  {
    "id": "era_ecommerce_side_job",
    "title": "开网店",
    "category": "career",
    "tags": [
      "startup"
    ],
    "yearRange": [
      2005,
      2020
    ],
    "ageRange": [
      20,
      45
    ],
    "maxOccurrences": 1,
    "baseWeight": 22,
    "weightModifiers": [
      {
        "hasTrait": "digital_native",
        "multiply": 1.5
      },
      {
        "hasTrait": "business_mind",
        "multiply": 1.5
      },
      {
        "path": "environment.businessClimate",
        "gte": 7,
        "multiply": 1.4
      }
    ],
    "text": [
      {
        "conditions": {
          "all": [
            { "path": "location.currentCityTier", "in": ["village", "town", "county"] }
          ]
        },
        "text": "你把家乡的干货和土产拍照挂到网上，白天收拾货，晚上学着回消息。快递车第一次频繁开进村里，田地没有变小，通向买家的路却忽然多了。"
      },
      {
        "conditions": {
          "any": [
            { "path": "career.status", "in": ["self_employed", "gig_worker"] },
            { "path": "resources.wealth", "lte": 38 }
          ]
        },
        "text": "你在租住的房间里开网店，床边堆货，纸箱占走半条过道。提示音半夜也会响，每一个订单都很小，却让你暂时不用先向老板解释自己的时间。"
      },
      {
        "text": "你在网上开了个小店，给商品拍照、量尺寸、同陌生买家解释色差。柜台从街边搬进屏幕以后没有了关门时间，生意的边界远了，客服的下班也远了。"
      }
    ],
    "effects": [
      {
        "path": "resources.wealth",
        "add": 10
      },
      {
        "path": "resources.freedom",
        "add": 5
      },
      {
        "path": "resources.health",
        "add": -3
      },
      {
        "addTag": "ecommerce_seller"
      },
      {
        "addTrait": "platform_hustler"
      }
    ]
  },
  {
    "id": "era_platform_delivery_rider",
    "title": "平台骑手",
    "category": "career",
    "yearRange": [
      2014,
      2020
    ],
    "ageRange": [
      18,
      55
    ],
    "maxOccurrences": 1,
    "baseWeight": 24,
    "conditions": {
      "any": [
        {
          "path": "career.status",
          "eq": "laid_off"
        },
        {
          "path": "resources.wealth",
          "lte": 35
        },
        {
          "hasTag": "migrant_worker"
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
        "text": "你把手机绑在车把上，城市被拆成一个个倒计时。夜路和差评都要小心，算法在耳机里催促。"
      },
      {
        "text": "你把手机绑在车把上，城市被拆成一个个倒计时。风从脸上刮过去，算法在耳机里催促。"
      }
    ],
    "effects": [
      {
        "path": "career.status",
        "set": "gig_worker"
      },
      {
        "path": "career.field",
        "set": "delivery"
      },
      {
        "path": "resources.wealth",
        "add": 9
      },
      {
        "path": "resources.health",
        "add": -7
      },
      {
        "path": "resources.freedom",
        "add": -3
      },
      {
        "addTag": "platform_worker"
      },
      {
        "addTrait": "gig_adapted"
      }
    ]
  },
  {
    "id": "era_startup_pitch_deck",
    "title": "创业路演",
    "category": "career",
    "tags": [
      "startup"
    ],
    "yearRange": [
      2012,
      2020
    ],
    "ageRange": [
      22,
      40
    ],
    "currentRegions": {
      "provinceGroups": [
        "province.internet"
      ]
    },
    "maxOccurrences": 1,
    "baseWeight": 18,
    "weightModifiers": [
      {
        "hasTag": "startup_path",
        "multiply": 2
      },
      {
        "hasTrait": "digital_native",
        "multiply": 1.4
      },
      {
        "path": "attrs.charm",
        "gte": 6,
        "multiply": 1.3
      }
    ],
    "text": "你站在投影幕前讲增长曲线。台下的人点头时很像命运，摇头时也很像。",
    "effects": [
      {
        "path": "resources.achievement",
        "add": 14
      },
      {
        "path": "resources.wealth",
        "add": -6
      },
      {
        "path": "resources.reputation",
        "add": 8
      },
      {
        "addTag": "startup_pitch"
      },
      {
        "scheduleEvent": {
          "eventId": "era_startup_funding_or_bust",
          "delayYears": [
            1,
            3
          ],
          "weightMultiplier": 2,
          "probability": 0.7
        }
      }
    ]
  },
  {
    "id": "era_startup_funding_or_bust",
    "title": "融资或散伙",
    "category": "career",
    "tags": [
      "startup"
    ],
    "yearRange": [
      2013,
      2020
    ],
    "ageRange": [
      23,
      45
    ],
    "maxOccurrences": 1,
    "baseWeight": 8,
    "conditions": {
      "any": [
        {
          "hasTag": "startup_pitch"
        },
        {
          "hasTag": "startup_attempt"
        }
      ]
    },
    "text": "投资人最后没有把话说死，团队却先累垮了一半。创业像一张湿纸，梦想和债务都写在上面。",
    "effects": [
      {
        "path": "resources.wealth",
        "add": -10
      },
      {
        "path": "resources.achievement",
        "add": 8
      },
      {
        "path": "resources.happiness",
        "add": -8
      },
      {
        "addTag": "startup_bruise"
      }
    ]
  },
  {
    "id": "era_covid_home_silence",
    "title": "封在家里的春天",
    "category": "health",
    "yearRange": [
      2020,
      2020
    ],
    "ageRange": [
      0,
      100
    ],
    "priority": 70,
    "maxOccurrences": 1,
    "baseWeight": 100,
    "text": [
      {
        "conditions": {
          "all": [
            { "path": "meta.age", "lte": 3 }
          ]
        },
        "text": "街道忽然安静，大人很少带你出门，抱着你时也常低头看消息。你不懂口罩和数字，只知道熟悉的脸被遮住了一半。"
      },
      {
        "conditions": {
          "all": [
            { "path": "meta.age", "gte": 4 },
            { "path": "meta.age", "lte": 18 }
          ]
        },
        "text": "学校和玩耍都搬进屏幕，窗外的春天照常变绿。老师问听见没有，许多同学同时沉默，网络替全班保守了不少秘密。"
      },
      {
        "conditions": {
          "all": [
            { "path": "meta.age", "gte": 19 },
            { "path": "location.currentCityTier", "in": ["village", "town"] }
          ]
        },
        "text": "村口多了登记和劝返，远方的家人一时回不来。田里的季节没有停，走亲访友却第一次成了需要忍住的习惯。"
      },
      {
        "conditions": {
          "all": [
            { "path": "meta.age", "gte": 19 },
            { "path": "career.status", "in": ["employed", "self_employed", "gig_worker"] }
          ]
        },
        "text": "工作、出门和回家都有了新手续。你每天看数字、量体温、等消息，也第一次发现，维持普通生活本身就是一份工作。"
      },
      {
        "text": "街道安静得像被按下暂停。你每天看数字、量体温、等消息，春天隔着窗户慢慢走远。"
      }
    ],
    "effects": [
      {
        "path": "resources.happiness",
        "add": -8
      },
      {
        "path": "resources.health",
        "add": -2
      },
      {
        "path": "relationships.family",
        "add": 4
      },
      {
        "addTag": "covid_memory"
      }
    ]
  },
  {
    "id": "era_remote_work_screen",
    "maxOccurrences": 1,
    "title": "远程会议",
    "category": "career",
    "yearRange": [
      2020,
      2020
    ],
    "ageRange": [
      22,
      60
    ],
    "currentRegions": {
      "cityTiers": [
        "city",
        "tier2",
        "tier1"
      ]
    },
    "baseWeight": 24,
    "conditions": {
      "any": [
        {
          "path": "career.field",
          "eq": "corporate"
        },
        {
          "hasTrait": "digital_native"
        },
        {
          "hasTrait": "networked_mind"
        }
      ]
    },
    "text": "会议搬进屏幕，客厅变成工位。你学会对着头像点头，也学会在静音里叹气。",
    "effects": [
      {
        "path": "career.level",
        "add": 3
      },
      {
        "path": "resources.freedom",
        "add": 3
      },
      {
        "path": "resources.happiness",
        "add": -3
      },
      {
        "addTag": "remote_work_memory"
      }
    ]
  },
  {
    "id": "era_wto_quality_check_line",
    "maxOccurrences": 1,
    "title": "外贸质检",
    "category": "career",
    "yearRange": [
      2002,
      2012
    ],
    "ageRange": [
      18,
      55
    ],
    "currentRegions": {
      "provinceGroups": [
        "province.coastal"
      ]
    },
    "conditions": {
      "any": [
        {
          "hasTag": "wto_wave_worker"
        },
        {
          "path": "career.field",
          "eq": "factory"
        }
      ]
    },
    "baseWeight": 22,
    "text": "外贸单要求严，质检表一项项压下来。你开始知道，世界市场不是远方的词，它会落在每一道针脚和每一个零件上。",
    "effects": [
      {
        "path": "career.level",
        "add": 4
      },
      {
        "path": "resources.achievement",
        "add": 3
      },
      {
        "path": "resources.health",
        "add": -2
      },
      {
        "addTag": "export_quality_memory"
      }
    ]
  },
  {
    "id": "era_taobao_small_shop",
    "maxOccurrences": 1,
    "title": "开网店",
    "category": "career",
    "yearRange": [
      2005,
      2016
    ],
    "ageRange": [
      18,
      50
    ],
    "conditions": {
      "any": [
        {
          "hasTrait": "market_sense"
        },
        {
          "hasTag": "getihu_path"
        },
        {
          "hasTrait": "digital_native"
        }
      ]
    },
    "baseWeight": 18,
    "text": "你试着开了个网店，拍照、上架、回消息、打包发货。小小的屏幕背后，生意变成了昼夜不分的敲击声。",
    "effects": [
      {
        "path": "career.status",
        "set": "self_employed"
      },
      {
        "path": "career.field",
        "set": "ecommerce"
      },
      {
        "path": "resources.wealth",
        "add": 8
      },
      {
        "path": "resources.health",
        "add": -3
      },
      {
        "addTag": "ecommerce_seller"
      }
    ]
  },
  {
    "id": "era_mobile_payment_first_time",
    "maxOccurrences": 1,
    "title": "第一次扫码付款",
    "category": "random",
    "yearRange": [
      2013,
      2020
    ],
    "ageRange": [
      12,
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
    "baseWeight": 24,
    "text": "你第一次用手机扫码付款，钱没有从手里递出去，却真的少了。生活忽然变轻，也变得更容易花出去。",
    "effects": [
      {
        "path": "resources.freedom",
        "add": 4
      },
      {
        "path": "resources.wealth",
        "add": -1
      },
      {
        "addTag": "mobile_payment_memory"
      }
    ]
  },
  {
    "id": "era_rent_shared_room",
    "maxOccurrences": 1,
    "title": "合租房间",
    "category": "wealth",
    "yearRange": [
      2005,
      2025
    ],
    "ageRange": [
      18,
      40
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
          "hasTag": "migrant_worker"
        },
        {
          "hasTag": "corporate_worker"
        },
        {
          "path": "career.status",
          "eq": "employed"
        }
      ]
    },
    "baseWeight": 26,
    "weightModifiers": [
      {
        "path": "environment.housingPressure",
        "gte": 7,
        "multiply": 1.5
      }
    ],
    "text": "你住进合租房，冰箱格子、卫生间时间和房租日期都要仔细计算。城市很大，你拥有的先是一张床。",
    "effects": [
      {
        "path": "resources.wealth",
        "add": -6
      },
      {
        "path": "resources.freedom",
        "add": -2
      },
      {
        "path": "relationships.friendship",
        "add": 2
      },
      {
        "addTag": "shared_rent_memory"
      }
    ]
  },
  {
    "id": "era_platform_algorithm_penalty",
    "maxOccurrences": 1,
    "title": "平台扣分",
    "category": "career",
    "yearRange": [
      2014,
      2025
    ],
    "ageRange": [
      18,
      60
    ],
    "conditions": {
      "any": [
        {
          "hasTag": "platform_worker"
        },
        {
          "path": "career.status",
          "eq": "gig_worker"
        },
        {
          "hasTrait": "gig_adapted"
        }
      ]
    },
    "baseWeight": 22,
    "text": "平台因为一次超时扣了分。你想解释天气、红灯和电梯，可系统只认一个数字。",
    "effects": [
      {
        "path": "career.income",
        "add": -5
      },
      {
        "path": "resources.happiness",
        "add": -5
      },
      {
        "addTag": "algorithm_penalty_memory"
      }
    ]
  },
  {
    "id": "era_online_class_child",
    "maxOccurrences": 1,
    "title": "孩子上网课",
    "category": "family",
    "yearRange": [
      2020,
      2022
    ],
    "ageRange": [
      28,
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
    "baseWeight": 28,
    "text": "孩子在家上网课，屏幕、作业、摄像头和家务挤在同一张桌子上。你第一次发现，学校也能整个搬进家里。",
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
        "path": "education.score",
        "add": 2
      },
      {
        "addTag": "online_class_parent_memory"
      }
    ]
  },
  {
    "id": "era_internet_layoff_notice",
    "maxOccurrences": 1,
    "title": "裁员通知",
    "category": "career",
    "yearRange": [
      2018,
      2025
    ],
    "ageRange": [
      24,
      45
    ],
    "conditions": {
      "any": [
        {
          "path": "career.field",
          "eq": "corporate"
        },
        {
          "hasTag": "corporate_worker"
        },
        {
          "hasTag": "startup_path"
        }
      ]
    },
    "baseWeight": 18,
    "text": "裁员通知传来得很快，会议室、表格和补偿方案把一段努力压缩成几行字。你走出门时，工牌还没来得及摘。",
    "effects": [
      {
        "path": "career.status",
        "set": "unemployed"
      },
      {
        "path": "career.income",
        "add": -12
      },
      {
        "path": "resources.happiness",
        "add": -8
      },
      {
        "addTag": "internet_layoff_memory"
      }
    ]
  },
  {
    id: "era_rural_school_long_commute",
    title: "上学的路变长了",
    category: "school",
    yearRange: [2001, 2015],
    ageRange: [7, 15],
    birthFamilyClasses: ["rural_farming_household", "rural_left_behind", "rural_business_family", "migrant_worker_family"],
    currentRegions: { hukou: ["rural"], cityTiers: ["village", "town"] },
    maxOccurrences: 1,
    baseWeight: 24,
    text: "附近的教学点并到镇上，你每天更早起床，沿着公路去上学。书包里除了课本，还常塞着一只怕半路饿着的馒头。",
    effects: [
      { path: "education.score", add: 5 },
      { path: "resources.health", add: -2 },
      { path: "resources.freedom", add: -2 },
      { addTag: "rural_school_commute_memory" }
    ]
  },
  {
    id: "era_left_behind_weekly_call",
    title: "公用电话那头",
    category: "family",
    yearRange: [2002, 2015],
    ageRange: [6, 17],
    birthFamilyClasses: ["rural_left_behind", "migrant_worker_family"],
    currentRegions: { hukou: ["rural"], cityTiers: ["village", "town", "county"] },
    maxOccurrences: 1,
    baseWeight: 34,
    text: "你按约定时间守在小卖部的电话旁，听父母从很远的工地或厂房打来。几分钟里先问成绩，再问吃饭，真正想说的话总在挂断后才冒出来。",
    effects: [
      { path: "relationships.family", add: -2 },
      { path: "attrs.mental", add: 1 },
      { path: "resources.happiness", add: -3 },
      { addTag: "left_behind_call_memory" }
    ]
  },
  {
    id: "era_new_rural_coop_medical_booklet",
    title: "一本合作医疗证",
    category: "health",
    yearRange: [2003, 2012],
    ageRange: [18, 75],
    birthFamilyClasses: ["rural_farming_household", "rural_left_behind", "rural_business_family", "migrant_worker_family"],
    currentRegions: { hukou: ["rural"], cityTiers: ["village", "town", "county"] },
    maxOccurrences: 1,
    baseWeight: 28,
    text: "村里通知参加新型农村合作医疗，薄薄一本证被夹进户口簿。报销比例还要反复打听，但家里再谈起住院，声音没有从前那么虚。",
    effects: [
      { path: "resources.health", add: 4 },
      { path: "resources.wealth", add: 3 },
      { path: "relationships.family", add: 2 },
      { addTag: "rural_coop_medical_memory" }
    ]
  },
  {
    id: "era_student_loan_remittance",
    title: "助学贷款到账",
    category: "school",
    yearRange: [2000, 2018],
    ageRange: [18, 24],
    birthFamilyClasses: ["rural_farming_household", "rural_left_behind", "migrant_worker_family", "urban_low_income", "working"],
    conditions: { all: [{ path: "education.score", gte: 48 }, { path: "resources.wealth", lte: 48 }] },
    maxOccurrences: 1,
    baseWeight: 22,
    text: "助学贷款终于到账，你先把学费补上，又把余额算了三遍。大学生活尚未展开，毕业后的第一笔债已经很懂事地坐在旁边。",
    effects: [
      { path: "education.score", add: 8 },
      { path: "resources.wealth", add: 5 },
      { path: "resources.happiness", add: 2 },
      { addTag: "student_loan_memory" }
    ]
  },
  {
    id: "era_university_expansion_dorm",
    title: "八人间的大学",
    category: "school",
    yearRange: [2000, 2010],
    ageRange: [18, 23],
    conditions: { all: [{ path: "education.score", gte: 55 }] },
    maxOccurrences: 1,
    baseWeight: 20,
    text: "扩招后的校园到处在盖楼，你住进一间塞满行李和口音的宿舍。八个人共用两张书桌，关于未来的意见却足足有十六种。",
    effects: [
      { path: "education.score", add: 7 },
      { path: "relationships.friendship", add: 6 },
      { path: "resources.freedom", add: 4 },
      { addTag: "university_expansion_generation" }
    ]
  },
  {
    id: "era_motorcycle_spring_festival_return",
    title: "骑摩托回家",
    category: "migration",
    yearRange: [2005, 2015],
    ageRange: [20, 55],
    currentRegions: { provinces: ["guangdong", "guangxi", "fujian"], cityTiers: ["county", "city", "tier2", "tier1"] },
    conditions: { any: [{ hasTag: "migrant_worker" }, { hasTag: "migrant_worker_family" }, { path: "career.field", eq: "factory" }] },
    maxOccurrences: 1,
    baseWeight: 18,
    text: "春运车票难买，你和同乡把年货绑在摩托后座，沿国道往家赶。风把脸吹得发木，保温杯和归心倒都很烫。",
    effects: [
      { path: "relationships.family", add: 6 },
      { path: "resources.health", add: -4 },
      { path: "resources.happiness", add: 5 },
      { addTag: "motorcycle_homecoming_memory" }
    ]
  },
  {
    id: "era_express_sorting_night",
    title: "快递分拣夜班",
    category: "career",
    yearRange: [2010, 2025],
    ageRange: [18, 58],
    currentRegions: { cityTiers: ["town", "county", "city", "tier2", "tier1"] },
    conditions: { any: [{ hasTag: "migrant_worker" }, { hasTag: "platform_worker" }, { path: "career.status", eq: "unemployed" }, { path: "resources.wealth", lte: 34 }] },
    maxOccurrences: 1,
    baseWeight: 22,
    text: "你在转运仓上夜班，纸箱沿传送带不停涌来，每件都写着别人等待的生活。天亮时腰先直不起来，手机里的计件数倒站得笔直。",
    effects: [
      { path: "career.status", set: "gig_worker" },
      { path: "career.field", set: "logistics" },
      { path: "career.income", add: 7 },
      { path: "resources.health", add: -5 },
      { addTag: "express_sorter_memory" }
    ]
  },
  {
    id: "era_ride_hailing_night_shift",
    title: "夜里跑网约车",
    category: "career",
    yearRange: [2015, 2025],
    ageRange: [23, 60],
    currentRegions: { cityTiers: ["county", "city", "tier2", "tier1"] },
    conditions: { any: [{ path: "career.status", eq: "unemployed" }, { path: "career.status", eq: "gig_worker" }, { hasTag: "internet_layoff_memory" }, { path: "resources.wealth", lte: 40 }] },
    maxOccurrences: 1,
    baseWeight: 20,
    text: "你开始在夜里跑网约车，跟着导航穿过熟悉又陌生的街道。乘客把故事留在后座，平台把抽成留得更稳，只有困意坚持全额到账。",
    effects: [
      { path: "career.status", set: "gig_worker" },
      { path: "career.field", set: "ride_hailing" },
      { path: "career.income", add: 8 },
      { path: "resources.health", add: -5 },
      { addTag: "ride_hailing_driver_memory" }
    ]
  },
  {
    id: "era_shared_bike_commute",
    title: "一辆找得到的共享单车",
    category: "random",
    yearRange: [2016, 2019],
    ageRange: [12, 65],
    currentRegions: { cityTiers: ["county", "city", "tier2", "tier1"] },
    maxOccurrences: 1,
    baseWeight: 24,
    text: "街角忽然多出一排共享单车。你扫码骑走一辆，先为最后一公里高兴，后来又学会在十几辆车里挑出座椅没坏、车锁肯开的那一辆。",
    effects: [
      { path: "resources.freedom", add: 4 },
      { path: "resources.health", add: 2 },
      { path: "resources.happiness", add: 2 },
      { addTag: "shared_bike_memory" }
    ]
  },
  {
    id: "era_targeted_poverty_household_file",
    title: "家里有了帮扶档案",
    category: "wealth",
    yearRange: [2014, 2020],
    ageRange: [18, 75],
    birthFamilyClasses: ["rural_left_behind", "migrant_worker_family", "rural_farming_household"],
    currentRegions: { hukou: ["rural"], cityTiers: ["village", "town"] },
    conditions: { all: [{ path: "resources.wealth", lte: 36 }] },
    maxOccurrences: 1,
    baseWeight: 25,
    text: "干部上门核实收入、住房和病情，家里多了一份帮扶档案。被看见让人松口气，被逐项写下贫困又让人一时不知该把手放在哪里。",
    effects: [
      { path: "resources.wealth", add: 8 },
      { path: "resources.health", add: 2 },
      { path: "resources.reputation", add: -1 },
      { addTag: "poverty_relief_household_memory" }
    ]
  },
  {
    id: "era_second_child_family_account",
    title: "二孩账本",
    category: "family",
    yearRange: [2016, 2020],
    ageRange: [25, 43],
    conditions: { all: [{ path: "relationships.children", gte: 1 }, { path: "relationships.children", lte: 1 }] },
    maxOccurrences: 1,
    baseWeight: 20,
    text: [
      { conditions: { all: [{ path: "birth.gender", eq: "female" }] }, text: "二孩政策放开后，亲友把问题热心地递到你面前。你算工作、身体、托育和房间，发现一句‘再要一个’后面跟着一整支后勤队。" },
      { text: "二孩政策放开后，家里认真算起奶粉、托育和房间。长辈负责说‘总有办法’，你负责把办法换算成每个月的数字。" }
    ],
    effects: [
      { path: "relationships.family", add: -1 },
      { path: "resources.happiness", add: -2 },
      { path: "resources.freedom", add: -2 },
      { addTag: "second_child_account_memory" }
    ]
  },
  {
    id: "era_women_recruitment_marriage_question",
    title: "简历之外的问题",
    category: "career",
    yearRange: [2000, 2025],
    ageRange: [21, 38],
    genders: ["female"],
    currentRegions: { cityTiers: ["county", "city", "tier2", "tier1"] },
    conditions: { all: [{ path: "education.score", gte: 45 }] },
    maxOccurrences: 1,
    baseWeight: 22,
    text: "面试谈完能力，对方又绕着问起婚育安排。你把不快压进礼貌里，忽然明白有些门槛从不写在招聘启事上。",
    effects: [
      { path: "resources.happiness", add: -5 },
      { path: "attrs.mental", add: 1 },
      { path: "resources.reputation", add: 2 },
      { addTag: "gendered_recruitment_memory" }
    ]
  },
  {
    id: "era_elder_smartphone_service_hall",
    title: "窗口前学扫码",
    category: "family",
    yearRange: [2015, 2025],
    ageRange: [55, 82],
    currentRegions: { cityTiers: ["town", "county", "city", "tier2", "tier1"] },
    maxOccurrences: 1,
    baseWeight: 25,
    text: "办事窗口请你先用手机扫码，你把亮度调到最大，仍找不到刚才那个页面。年轻人帮了两下就办完，你道谢后悄悄把步骤写在纸上。",
    effects: [
      { path: "resources.freedom", add: -2 },
      { path: "attrs.intelligence", add: 1 },
      { path: "relationships.family", add: 2 },
      { addTag: "elder_digital_learning_memory" }
    ]
  },
  {
    id: "era_county_home_down_payment",
    title: "县城那套房",
    category: "wealth",
    yearRange: [2010, 2025],
    ageRange: [24, 45],
    currentRegions: { cityTiers: ["town", "county"] },
    conditions: { all: [{ path: "resources.wealth", gte: 25 }, { path: "resources.wealth", lte: 72 }], any: [{ path: "career.status", eq: "employed" }, { path: "career.status", eq: "self_employed" }, { hasTag: "migrant_worker" }] },
    maxOccurrences: 1,
    baseWeight: 26,
    text: "家里把多年积蓄摊开，讨论要不要在县城交首付。那套房离学校和医院更近，也让几代人的钱第一次如此整齐地站到同一张桌上。",
    effects: [
      { path: "resources.wealth", add: -14 },
      { path: "resources.freedom", add: -5 },
      { path: "relationships.family", add: 3 },
      { addTag: "county_home_mortgage_memory" }
    ]
  },
  {
    id: "era_public_rental_housing_wait",
    title: "公租房名单",
    category: "wealth",
    yearRange: [2011, 2025],
    ageRange: [22, 58],
    birthFamilyClasses: ["urban_low_income", "migrant_worker_family", "working", "rural_left_behind"],
    currentRegions: { cityTiers: ["county", "city", "tier2", "tier1"] },
    conditions: { all: [{ path: "resources.wealth", lte: 45 }] },
    maxOccurrences: 1,
    baseWeight: 20,
    text: "你递交收入、住房和社保材料，等公租房名单公布。表格很多，等待很长，但想到可能有一扇真正能关上的门，心里仍留了一盏灯。",
    effects: [
      { path: "resources.wealth", add: 6 },
      { path: "resources.freedom", add: 4 },
      { path: "resources.happiness", add: 3 },
      { addTag: "public_rental_housing_memory" }
    ]
  },
  {
    id: "era_covid_health_code_checkpoint",
    title: "门口的健康码",
    category: "health",
    yearRange: [2020, 2022],
    ageRange: [10, 82],
    currentRegions: { cityTiers: ["town", "county", "city", "tier2", "tier1"] },
    maxOccurrences: 1,
    baseWeight: 45,
    text: "进门前要测温、登记、出示健康码。你把手机举得很熟练，偶尔网络一转圈，身后整支队伍便一同体会什么叫命运加载中。",
    effects: [
      { path: "resources.health", add: 2 },
      { path: "resources.freedom", add: -4 },
      { path: "resources.happiness", add: -2 },
      { addTag: "health_code_memory" }
    ]
  },
  {
    id: "era_community_group_buying_pickup",
    title: "去团长家取菜",
    category: "family",
    yearRange: [2020, 2022],
    ageRange: [18, 75],
    currentRegions: { cityTiers: ["town", "county", "city", "tier2", "tier1"] },
    maxOccurrences: 1,
    baseWeight: 22,
    text: "你在群里下单，第二天去小区团长家取菜。萝卜、纸巾和邻里消息堆在同一个门口，数字生意最后还是要靠一个人弯腰分袋。",
    effects: [
      { path: "resources.wealth", add: 2 },
      { path: "relationships.friendship", add: 3 },
      { path: "resources.freedom", add: 2 },
      { addTag: "community_group_buying_memory" }
    ]
  },
  {
    id: "era_rural_livestream_sales",
    title: "土货进了直播间",
    category: "career",
    yearRange: [2018, 2025],
    ageRange: [18, 65],
    birthFamilyClasses: ["rural_farming_household", "rural_business_family", "rural_left_behind", "migrant_worker_family"],
    currentRegions: { hukou: ["rural"], cityTiers: ["village", "town", "county"] },
    conditions: { any: [{ hasTrait: "digital_native" }, { hasTrait: "networked_mind" }, { path: "attrs.charm", gte: 5 }] },
    maxOccurrences: 1,
    baseWeight: 21,
    text: "你把蜂蜜、干货或自家果子搬到镜头前，学着在直播间里讲产地和收成。面对邻居不紧张，面对一个小红点倒先忘了词。",
    effects: [
      { path: "career.field", set: "rural_ecommerce" },
      { path: "career.income", add: 6 },
      { path: "resources.achievement", add: 4 },
      { addTag: "rural_livestream_seller" }
    ]
  },
  {
    id: "era_vocational_college_expansion",
    title: "实训室里的新学期",
    category: "school",
    continuity: {
      education: {
        action: "enroll",
        level: "vocational",
        track: "vocational",
        mode: "full_time",
        durationYears: 3,
        allowTransfer: true,
      },
    },
    yearRange: [2019, 2025],
    ageRange: [16, 23],
    conditions: { all: [{ path: "education.score", lte: 65 }] },
    maxOccurrences: 1,
    baseWeight: 24,
    text: "职业院校扩招，你在实训室里第一次摸到真正要上岗使用的设备。亲戚还爱追问‘算不算大学’，你拧紧手里的零件，觉得会做事也是一种回答。",
    effects: [
      { path: "education.level", set: "vocational" },
      { path: "education.score", add: 7 },
      { path: "career.level", add: 5 },
      { path: "resources.achievement", add: 4 },
      { addTrait: "practical_skill" },
      { addTag: "vocational_expansion_student" }
    ]
  }
];
