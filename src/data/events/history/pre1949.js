// Auto-split event data. Keep events in this file focused on one era or theme.
export const historyPre1949Events = [
  {
    "id": "era_pre1949_first_livelihood_male",
    "title": "早早谋生",
    "category": "career",
    "genders": [
      "male"
    ],
    "yearRange": [
      1840,
      1948
    ],
    "ageRange": [
      13,
      26
    ],
    "priority": 68,
    "maxOccurrences": 1,
    "baseWeight": 85,
    "conditions": {
      "none": [
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
    "text": "你到了该谋生的年纪。那时没有“找工作”的说法，更多是托人、拜师、下地，或者跟着亲戚去城里讨一口饭。",
    "outcomes": [
      {
        "id": "farm_work",
        "text": "留在田里，先帮家里扛活",
        "resultText": "你留在田里。土地给不了太多想象，但每天都要人把腰弯下去。",
        "conditions": {
          "all": [
            { "path": "birth.hukou", "eq": "rural" },
            { "path": "location.currentCityTier", "in": ["village", "town", "county"] }
          ]
        },
        "effects": [
          {
            "path": "career.status",
            "set": "employed"
          },
          {
            "path": "career.field",
            "set": "farm_work"
          },
          {
            "path": "career.income",
            "add": 5
          },
          {
            "path": "resources.wealth",
            "add": 3
          },
          {
            "path": "resources.freedom",
            "add": -6
          },
          {
            "addTag": "early_livelihood"
          },
          {
            "addTrait": "physical_labor"
          }
        ]
      },
      {
        "id": "apprentice",
        "text": "进铺子当学徒",
        "resultText": "你进了铺子。师傅的话比钟还准，手艺和委屈都要一点点熬出来。",
        "conditions": {
          "all": [
            { "path": "location.currentCityTier", "in": ["town", "county", "city", "tier2", "tier1"] }
          ]
        },
        "effects": [
          {
            "path": "career.status",
            "set": "employed"
          },
          {
            "path": "career.field",
            "set": "apprentice"
          },
          {
            "path": "career.income",
            "add": 7
          },
          {
            "path": "resources.achievement",
            "add": 5
          },
          {
            "path": "resources.freedom",
            "add": -4
          },
          {
            "addTag": "apprentice_path"
          },
          {
            "addTrait": "practical_skill"
          }
        ]
      },
      {
        "id": "dock_or_factory",
        "text": "去码头、矿场或工场做工",
        "resultText": "你跟着人去了码头、矿场或工场。活重、钱少，但另一种谋生的门缝从此露出一点光。",
        "conditions": {
          "all": [
            { "path": "location.currentCityTier", "in": ["town", "county", "city", "tier2", "tier1"] }
          ]
        },
        "effects": [
          {
            "path": "career.status",
            "set": "employed"
          },
          {
            "path": "career.field",
            "set": "manual_worker"
          },
          {
            "path": "career.income",
            "add": 8
          },
          {
            "path": "resources.wealth",
            "add": 5
          },
          {
            "path": "resources.health",
            "add": -5
          },
          {
            "addTag": "manual_worker_path"
          }
        ]
      }
    ]
  },
  {
    "id": "era_pre1949_first_livelihood_female",
    "title": "早早谋生",
    "category": "career",
    "genders": [
      "female"
    ],
    "yearRange": [
      1840,
      1948
    ],
    "ageRange": [
      12,
      24
    ],
    "priority": 68,
    "maxOccurrences": 1,
    "baseWeight": 85,
    "conditions": {
      "none": [
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
    "text": "你到了该帮家里分担的年纪。那时许多女孩的“工作”不写在账本上，却从天亮做到天黑。",
    "outcomes": [
      {
        "id": "household_care",
        "text": "留在家里，照看弟妹和家务",
        "resultText": "你留在家里，把一家的日子缝缝补补。没人给这份活发工钱，但人人都离不开它。",
        "effects": [
          {
            "path": "career.status",
            "set": "family_labor"
          },
          {
            "path": "career.field",
            "set": "care_work"
          },
          {
            "path": "relationships.family",
            "add": 8
          },
          {
            "path": "resources.freedom",
            "add": -10
          },
          {
            "path": "resources.happiness",
            "add": -3
          },
          {
            "addTag": "unpaid_care_work"
          },
          {
            "addTrait": "care_work_early"
          }
        ]
      },
      {
        "id": "servant_or_helper",
        "text": "去人家帮佣或学手艺",
        "resultText": "你进了别人家的门，也进了更复杂的人情里。手上有活，心里也多了防备。",
        "effects": [
          {
            "path": "career.status",
            "set": "employed"
          },
          {
            "path": "career.field",
            "set": "domestic_helper"
          },
          {
            "path": "career.income",
            "add": 5
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
            "addTag": "domestic_helper_path"
          },
          {
            "addTrait": "self_reliant"
          }
        ]
      },
      {
        "id": "textile_or_factory",
        "text": "进缫丝场、纺织作坊或机器厂做工",
        "resultText": "你进了缫丝场、纺织作坊或新式机器厂。活计又响又累，工钱很薄，但你第一次有了自己挣来的钱。",
        "conditions": {
          "all": [
            { "path": "meta.currentYear", "gte": 1870 },
            { "path": "location.currentCityTier", "in": ["town", "county", "city", "tier2", "tier1"] }
          ]
        },
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
            "add": 7
          },
          {
            "path": "resources.wealth",
            "add": 5
          },
          {
            "path": "resources.health",
            "add": -5
          },
          {
            "addTag": "factory_sisterhood"
          },
          {
            "addTag": "manual_worker_path"
          }
        ]
      }
    ]
  },
  {
    "id": "era_late_qing_learning_path",
    "title": "识字这件事",
    "category": "school",
    "yearRange": [
      1840,
      1911
    ],
    "ageRange": [
      6,
      8
    ],
    "priority": 80,
    "maxOccurrences": 1,
    "baseWeight": 100,
    "text": "你到了该识字或学着做事的年纪。对那时的大多数孩子来说，书本、家务和活计不是平等摆在面前的三条路。",
    "outcomes": [
      {
        "id": "private_school",
        "text": "进私塾读书",
        "resultText": "天还没亮，你已经坐在长凳上背书。先生的戒尺落在桌面，字句和规矩一起进入身体。",
        "baseWeight": 1,
        "weightModifiers": [
          { "path": "attrs.family", "gte": 5, "multiply": 3 },
          { "path": "attrs.intelligence", "gte": 6, "multiply": 1.8 },
          { "path": "birth.gender", "eq": "male", "multiply": 1.6 },
          { "path": "birth.familyClass", "in": ["scholar_gentry", "landlord", "merchant", "comprador_merchant"], "multiply": 2 }
        ],
        "effects": [
          { "path": "education.level", "set": "primary" },
          { "path": "education.score", "add": 9 },
          { "path": "attrs.mental", "add": -1 },
          { "addTrait": "exam_aptitude" },
          { "addTag": "student" },
          { "addTag": "old_learning" }
        ]
      },
      {
        "id": "home_literacy",
        "text": "在家认几个字",
        "resultText": "你跟着家中识字的人认账本、家书和祖先牌位上的字。没有正式入学，字却一点点留了下来。",
        "baseWeight": 3,
        "weightModifiers": [
          { "path": "attrs.family", "gte": 3, "multiply": 1.5 },
          { "path": "birth.gender", "eq": "female", "multiply": 1.4 }
        ],
        "effects": [
          { "path": "education.score", "add": 4 },
          { "addTag": "basic_literacy" }
        ]
      },
      {
        "id": "early_household_work",
        "text": "先学着干活",
        "resultText": "你没有进学。下田、拾柴、带弟妹或替大人照看牲口，才是每天真正要交的功课。",
        "conditions": {
          "all": [
            { "path": "location.currentCityTier", "in": ["village", "town"] }
          ]
        },
        "baseWeight": 5,
        "weightModifiers": [
          { "path": "attrs.family", "lte": 3, "multiply": 1.8 },
          { "path": "birth.hukou", "eq": "rural", "multiply": 1.3 }
        ],
        "effects": [
          { "path": "education.score", "add": -3 },
          { "path": "resources.wealth", "add": 2 },
          { "addTrait": "practical_skill" },
          { "addTag": "early_household_work" }
        ]
      },
      {
        "id": "early_urban_work",
        "text": "先学着干活",
        "resultText": "你没有进学。看铺、带弟妹、跑腿或给师傅递东西，才是每天真正要交的功课。",
        "conditions": {
          "all": [
            { "path": "location.currentCityTier", "in": ["county", "city", "tier2", "tier1"] }
          ]
        },
        "baseWeight": 5,
        "weightModifiers": [
          { "path": "attrs.family", "lte": 3, "multiply": 1.8 }
        ],
        "effects": [
          { "path": "education.score", "add": -3 },
          { "path": "resources.wealth", "add": 2 },
          { "addTrait": "practical_skill" },
          { "addTag": "early_household_work" }
        ]
      }
    ]
  },
  {
    "id": "era_1905_exam_abolished_family_sigh",
    "title": "科举废止",
    "category": "school",
    "yearRange": [
      1905,
      1906
    ],
    "ageRange": [
      6,
      22
    ],
    "birthFamilyClasses": [
      "scholar_gentry",
      "landlord",
      "merchant",
      "smallholder"
    ],
    "maxOccurrences": 1,
    "priority": 45,
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
        "text": "家里人说科举废了，旧路断了。你原本就很难走上那条路，却仍感觉屋里的书声忽然换了方向。"
      },
      {
        "text": "家里人忽然说，旧路断了。你看见长辈把书页抚平，又像在给一条看不见的路送行。"
      }
    ],
    "effects": [
      {
        "path": "resources.happiness",
        "add": -3
      },
      {
        "path": "education.score",
        "add": 4
      },
      {
        "addTag": "exam_gap_child"
      }
    ]
  },
  {
    "id": "era_revolution_1911_hear_cannon",
    "title": "城头炮声",
    "category": "family",
    "yearRange": [
      1911,
      1912
    ],
    "ageRange": [
      0,
      45
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
    "baseWeight": 32,
    "text": "城里传来炮声，茶馆里人人压低嗓子。大人说朝代要换了，你只记得那天街上的风很乱。",
    "effects": [
      {
        "path": "resources.happiness",
        "add": -2
      },
      {
        "path": "attrs.mental",
        "add": 1
      },
      {
        "addTag": "dynasty_end_witness"
      }
    ]
  },
  {
    "id": "era_warlord_tax_grain",
    "title": "摊派粮款",
    "category": "wealth",
    "yearRange": [
      1916,
      1928
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
      8,
      55
    ],
    "maxOccurrences": 1,
    "baseWeight": 36,
    "text": "队伍过境，村里又摊粮又摊款。你第一次明白，纸上的大事最后会落到锅里。",
    "effects": [
      {
        "path": "resources.wealth",
        "add": -7
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
        "addTag": "warlord_years_memory"
      }
    ]
  },
  {
    "id": "era_may_fourth_city_leaflet_memory",
    "title": "传单从手里发热",
    "category": "school",
    "yearRange": [
      1919,
      1925
    ],
    "ageRange": [
      14,
      28
    ],
    "maxOccurrences": 1,
    "currentRegions": {
      "cityTiers": [
        "city",
        "tier2",
        "tier1"
      ]
    },
    "baseWeight": 24,
    "weightModifiers": [
      {
        "path": "education.score",
        "gte": 45,
        "multiply": 1.8
      },
      {
        "hasTrait": "modern_schooling",
        "multiply": 1.5
      }
    ],
    "text": "你在街口接过一张传单。纸很薄，字却很烫，像有人把整个时代塞进你掌心。",
    "effects": [
      {
        "path": "education.score",
        "add": 5
      },
      {
        "path": "resources.reputation",
        "add": 4
      },
      {
        "path": "resources.happiness",
        "add": -2
      },
      {
        "addTrait": "media_ear"
      },
      {
        "addTag": "student_public_voice"
      }
    ]
  },
  {
    "id": "era_nanyang_ticket",
    "title": "下南洋",
    "category": "migration",
    "yearRange": [
      1840,
      1941
    ],
    "ageRange": [
      16,
      38
    ],
    "birthRegions": {
      "provinces": [
        "fujian",
        "guangdong",
        "hainan",
        "guangxi"
      ]
    },
    "maxOccurrences": 1,
    "baseWeight": 30,
    "conditions": {
      "any": [
        {
          "path": "resources.wealth",
          "lte": 28
        },
        {
          "hasTag": "merchant_family"
        },
        {
          "hasTrait": "market_sense"
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
        "text": "你跟着亲眷或同乡往南洋去，船舱里挤满方言、晕船和不敢说出口的担心。海面一黑，明天像被折进小包袱里。"
      },
      {
        "text": "你把家乡装进一个小包袱，跟船往南走。海面一黑，谁也不知道明天是活路还是更远的苦。"
      }
    ],
    "effects": [
      {
        "path": "resources.wealth",
        "add": 8
      },
      {
        "path": "relationships.family",
        "add": -8
      },
      {
        "path": "resources.freedom",
        "add": 10
      },
      {
        "addTag": "nanyang_migrant"
      },
      {
        "addTrait": "survival_instinct"
      }
    ]
  },
  {
    "id": "era_soviet_area_red_tax",
    "title": "苏区夜会",
    "category": "family",
    "yearRange": [
      1928,
      1934
    ],
    "ageRange": [
      12,
      38
    ],
    "birthRegions": {
      "provinces": [
        "jiangxi",
        "fujian",
        "hunan",
        "guangdong",
        "hubei",
        "anhui",
        "henan"
      ]
    },
    "maxOccurrences": 1,
    "baseWeight": 20,
    "text": "夜里有人在祠堂点灯讲话，穷人第一次坐到前排。你听不全道理，只听见命运在换座次。",
    "effects": [
      {
        "path": "resources.reputation",
        "add": 5
      },
      {
        "path": "resources.wealth",
        "add": 3
      },
      {
        "path": "attrs.mental",
        "add": 1
      },
      {
        "addTag": "soviet_area_memory"
      }
    ]
  },
  {
    "id": "era_red_army_join_march",
    "title": "跟队伍走",
    "category": "war",
    "tags": [
      "red_army",
      "war"
    ],
    "yearRange": [
      1930,
      1936
    ],
    "ageRange": [
      15,
      32
    ],
    "birthRegions": {
      "provinces": [
        "jiangxi",
        "fujian",
        "hunan",
        "guangdong",
        "guangxi",
        "guizhou",
        "sichuan",
        "shaanxi",
        "gansu"
      ]
    },
    "maxOccurrences": 1,
    "baseWeight": 10,
    "weightModifiers": [
      {
        "path": "resources.wealth",
        "lte": 25,
        "multiply": 1.8
      },
      {
        "hasTag": "poor_peasant_family",
        "multiply": 1.6
      },
      {
        "hasTrait": "survival_instinct",
        "multiply": 1.4
      },
      {
        "path": "birth.gender",
        "eq": "male",
        "multiply": 1.4
      },
      {
        "path": "birth.gender",
        "eq": "female",
        "multiply": 0.55
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
        "text": "你跟着队伍离开家，做宣传、护理、送信，也在山路上学会把害怕压低。草鞋磨穿，名字被风吹得越来越轻。"
      },
      {
        "text": "你跟着队伍离开家。草鞋磨穿，山路没有尽头，少年人的名字被风吹得越来越轻。"
      }
    ],
    "effects": [
      {
        "path": "resources.health",
        "add": -10
      },
      {
        "path": "resources.reputation",
        "add": 8
      },
      {
        "path": "resources.freedom",
        "add": 8
      },
      {
        "addTag": "joined_red_army"
      },
      {
        "addTimedModifier": {
          "id": "red_army_war_risk",
          "durationYears": 6,
          "target": {
            "eventTag": "war"
          },
          "multiply": 1.7
        }
      }
    ]
  },
  {
    "id": "era_xiangjiang_last_stand",
    "title": "湘江血路",
    "category": "ending",
    "tags": [
      "red_army",
      "war"
    ],
    "yearRange": [
      1934,
      1934
    ],
    "ageRange": [
      15,
      36
    ],
    "birthRegions": {
      "provinces": [
        "jiangxi",
        "fujian",
        "hunan",
        "guangxi",
        "guizhou"
      ]
    },
    "maxOccurrences": 1,
    "baseWeight": 15,
    "weightModifiers": [
      {
        "path": "resources.health",
        "lte": 35,
        "multiply": 2
      },
      {
        "path": "attrs.physique",
        "lte": 2,
        "multiply": 1.6
      }
    ],
    "conditions": {
      "any": [
        {
          "hasTag": "joined_red_army"
        },
        {
          "hasTag": "soviet_area_memory"
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
        "text": "跟随苏区队伍开拔往西，你倒在湘江边。风萧萧兮易水寒，年轻的名字没有等到春天。"
      },
      {
        "text": "跟随苏区红军开拔往西，战死湘江。风萧萧兮易水寒，年轻的骨头没有等到春天。"
      }
    ],
    "effects": [
      {
        "die": "湘江战役"
      },
      {
        "triggerEnding": "xiangjiang_fallen"
      }
    ]
  },
  {
    "id": "era_long_march_survivor",
    "title": "走出雪山草地",
    "category": "war",
    "tags": [
      "red_army",
      "war"
    ],
    "yearRange": [
      1935,
      1936
    ],
    "ageRange": [
      16,
      38
    ],
    "maxOccurrences": 1,
    "baseWeight": 8,
    "conditions": {
      "all": [
        {
          "hasTag": "joined_red_army"
        },
        {
          "path": "resources.health",
          "gte": 25
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
        "text": "你从雪山草地里活着走出来。后来别人总惊讶你也走过那段路，你只是把碗底刮得格外干净。"
      },
      {
        "text": "你从雪山草地里活着走出来。后来你很少讲那段路，只在吃饭时把碗底刮得格外干净。"
      }
    ],
    "effects": [
      {
        "path": "resources.health",
        "add": -8
      },
      {
        "path": "attrs.mental",
        "add": 2
      },
      {
        "path": "resources.reputation",
        "add": 10
      },
      {
        "addTrait": "survival_instinct"
      },
      {
        "addTag": "long_march_survivor"
      }
    ]
  },
  {
    "id": "era_anti_japanese_refugee_train",
    "title": "向内地逃难",
    "category": "migration",
    "tags": [
      "war"
    ],
    "yearRange": [
      1937,
      1945
    ],
    "ageRange": [
      0,
      60
    ],
    "currentRegions": {
      "provinces": [
        "beijing",
        "tianjin",
        "hebei",
        "shandong",
        "jiangsu",
        "shanghai",
        "zhejiang",
        "guangdong",
        "hubei",
        "hunan"
      ]
    },
    "maxOccurrences": 1,
    "baseWeight": 40,
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
              "gte": 12
            }
          ]
        },
        "text": "车站挤满了人，行李和哭声堆在一起。你把自己裹得严实些，乱世里女孩的路总要多绕几道暗处。"
      },
      {
        "text": "车站挤满了人，行李和哭声堆在一起。你不知道自己是在离开家，还是在离开一个旧世界。"
      }
    ],
    "effects": [
      {
        "path": "resources.wealth",
        "add": -12
      },
      {
        "path": "resources.health",
        "add": -7
      },
      {
        "path": "location.migratedTimes",
        "add": 1
      },
      {
        "addTag": "wartime_refugee"
      },
      {
        "addTrait": "survival_instinct"
      }
    ]
  },
  {
    "id": "era_anti_japanese_bombing",
    "title": "空袭警报",
    "category": "health",
    "tags": [
      "war"
    ],
    "yearRange": [
      1937,
      1945
    ],
    "ageRange": [
      0,
      65
    ],
    "maxOccurrences": 1,
    "currentRegions": {
      "cityTiers": [
        "county",
        "city",
        "tier2",
        "tier1"
      ]
    },
    "baseWeight": 18,
    "text": "警报响起时，街上的人一齐往低处跑。你贴着墙根喘气，天上的声音像铁皮撕开。",
    "effects": [
      {
        "path": "resources.health",
        "add": -8
      },
      {
        "path": "resources.happiness",
        "add": -8
      },
      {
        "path": "attrs.mental",
        "add": -1
      },
      {
        "addTag": "air_raid_memory"
      }
    ]
  },
  {
    "id": "era_wartime_school_moves_west",
    "title": "背着书箱往西走",
    "category": "school",
    "tags": [
      "war"
    ],
    "yearRange": [
      1937,
      1945
    ],
    "ageRange": [
      15,
      26
    ],
    "currentRegions": {
      "cityTiers": [
        "city",
        "tier2",
        "tier1"
      ]
    },
    "baseWeight": 12,
    "conditions": {
      "all": [
        {
          "path": "education.score",
          "gte": 45
        }
      ]
    },
    "text": "学校一路往西迁，课堂设在临时屋檐下。炮火很近，黑板上的公式却倔强得像一盏灯。",
    "effects": [
      {
        "path": "education.score",
        "add": 10
      },
      {
        "path": "resources.health",
        "add": -4
      },
      {
        "addTag": "wartime_student"
      },
      {
        "addTrait": "modern_schooling"
      }
    ]
  },
  {
    "id": "era_anti_japanese_guerrilla",
    "title": "青纱帐里传消息",
    "category": "war",
    "tags": [
      "war"
    ],
    "yearRange": [
      1937,
      1945
    ],
    "ageRange": [
      15,
      45
    ],
    "maxOccurrences": 1,
    "birthRegions": {
      "provinces": [
        "hebei",
        "shanxi",
        "shandong",
        "henan",
        "jiangsu",
        "anhui"
      ]
    },
    "currentRegions": {
      "provinces": ["hebei", "shanxi", "shandong", "henan", "jiangsu", "anhui"],
      "cityTiers": ["village", "town", "county"]
    },
    "maxOccurrences": 1,
    "baseWeight": 16,
    "text": "你替村里人送过几次消息。青纱帐一动，心也跟着动，脚下每一步都可能踩响命运。",
    "effects": [
      {
        "path": "resources.reputation",
        "add": 8
      },
      {
        "path": "resources.health",
        "add": -4
      },
      {
        "addTag": "wartime_messenger"
      },
      {
        "addTrait": "local_connector"
      }
    ]
  },
  {
    "id": "era_war_lost_family_member",
    "title": "家书断了",
    "category": "family",
    "tags": [
      "war"
    ],
    "yearRange": [
      1937,
      1949
    ],
    "ageRange": [
      5,
      60
    ],
    "maxOccurrences": 1,
    "baseWeight": 20,
    "text": [
      {
        "conditions": {
          "all": [
            { "path": "meta.age", "lte": 14 }
          ]
        },
        "text": "家里有个大人的消息断在战乱里。长辈仍照旧摆过几次碗，见你要问，又把那只碗轻轻收回橱柜；你先记住的是饭桌突然空了一角。"
      },
      {
        "conditions": {
          "any": [
            { "path": "location.migratedTimes", "gte": 1 },
            { "hasTag": "wartime_refugee" }
          ]
        },
        "text": "逃难的路线一改再改，某个亲人的家书也停在半途。你托返乡的人打听，在车站和收容所抄过名字，最后只得到一句‘没有见过’。"
      },
      {
        "text": "某个亲人的消息断在战乱里。家里没有等到阵亡通知，也没有等到归人，只把他常坐的位置慢慢让给杂物；没有结论的失去，比一句噩耗更难收拾。"
      }
    ],
    "effects": [
      {
        "path": "relationships.family",
        "add": -10
      },
      {
        "path": "resources.happiness",
        "add": -10
      },
      {
        "path": "attrs.mental",
        "add": -1
      },
      {
        "addTag": "family_war_loss"
      }
    ]
  },
  {
    "id": "era_civil_war_conscription",
    "title": "被拉壮丁",
    "category": "war",
    "tags": [
      "war"
    ],
    "genders": [
      "male"
    ],
    "yearRange": [
      1946,
      1949
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
    "maxOccurrences": 1,
    "baseWeight": 12,
    "weightModifiers": [
      {
        "path": "attrs.luck",
        "lte": 3,
        "multiply": 1.8
      },
      {
        "path": "resources.wealth",
        "lte": 25,
        "multiply": 1.5
      }
    ],
    "text": "夜里有人敲门，你被推到队伍里。月光照着土路，家门在身后越来越小；所谓男丁，在乱世里先是一项可以被带走的资源。",
    "effects": [
      {
        "path": "resources.health",
        "add": -12
      },
      {
        "path": "relationships.family",
        "add": -10
      },
      {
        "path": "resources.freedom",
        "add": -12
      },
      {
        "addTag": "forced_conscription"
      }
    ]
  },
  {
    "id": "era_late_qing_new_school_glimpse",
    "title": "新学堂的门",
    "category": "school",
    "yearRange": [
      1905,
      1925
    ],
    "ageRange": [
      7,
      18
    ],
    "maxOccurrences": 1,
    "baseWeight": 18,
    "weightModifiers": [
      {
        "path": "birth.gender",
        "eq": "female",
        "multiply": 0.7
      },
      {
        "path": "birth.cityTier",
        "in": [
          "county",
          "city",
          "tier2",
          "tier1"
        ],
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
        "text": "你听说附近办了新学堂，也听见大人争论女孩子读书有没有用。门开在那里，却不是每个人都能自然走进去。"
      },
      {
        "text": "你听说附近办了新学堂，书本、操场、洋式课程像从另一个世界漏进来的光。旧规矩还在，新门已经开了一条缝。"
      }
    ],
    "effects": [
      {
        "path": "education.score",
        "add": 6
      },
      {
        "path": "attrs.intelligence",
        "add": 1
      },
      {
        "addTag": "new_school_glimpse"
      }
    ]
  },
  {
    "id": "era_republic_market_tax",
    "title": "又添一项捐",
    "category": "wealth",
    "yearRange": [
      1916,
      1936
    ],
    "ageRange": [
      16,
      70
    ],
    "maxOccurrences": 1,
    "baseWeight": 24,
    "text": [
      {
        "conditions": {
          "all": [
            { "path": "birth.hukou", "eq": "rural" }
          ]
        },
        "text": "乡里又来催一项捐，按亩、按户还是按牲口，各处算法不同。你从准备留种的粮里挪出一份，官差带走的是谷子，地里少下去的却是来年的指望。"
      },
      {
        "conditions": {
          "any": [
            { "path": "career.field", "in": ["apprentice", "manual_worker", "small_business", "trade"] },
            { "path": "resources.wealth", "lte": 35 }
          ]
        },
        "text": "地方上又添一项捐，摊到铺面和摊位时已经换了几次名目。你把当天薄利重新拨了一遍算盘，发现官府的那一份总比晚饭更先结清。"
      },
      {
        "text": "地方上又添了一项捐，公文上的名目很整齐，催收时却只认现钱。你翻遍铺账、米缸和抽屉，最后明白地方财政缺的口子，总能在一家人的饭桌上找到边。"
      }
    ],
    "effects": [
      {
        "path": "resources.wealth",
        "add": -6
      },
      {
        "path": "resources.happiness",
        "add": -3
      },
      {
        "addTag": "republic_tax_memory"
      }
    ]
  },
  {
    "id": "era_republic_apprentice_beating",
    "title": "学徒挨训",
    "category": "career",
    "yearRange": [
      1840,
      1948
    ],
    "ageRange": [
      12,
      24
    ],
    "maxOccurrences": 1,
    "conditions": {
      "any": [
        {
          "hasTag": "apprentice_path"
        },
        {
          "path": "career.field",
          "eq": "apprentice"
        }
      ]
    },
    "baseWeight": 28,
    "text": "师傅当众训了你一顿。你把委屈咽下去，手上的活却更稳了一点；旧行当里，脸面常常先于手艺被磨薄。",
    "effects": [
      {
        "path": "career.income",
        "add": 2
      },
      {
        "path": "resources.happiness",
        "add": -5
      },
      {
        "path": "attrs.mental",
        "add": 1
      },
      {
        "addTag": "apprentice_hardening"
      }
    ]
  },
  {
    "id": "era_river_port_carrying_loads",
    "title": "码头扛包",
    "category": "career",
    "yearRange": [
      1840,
      1948
    ],
    "ageRange": [
      15,
      45
    ],
    "maxOccurrences": 1,
    "currentRegions": {
      "provinces": [
        "shanghai",
        "guangdong",
        "jiangsu",
        "zhejiang",
        "hubei",
        "tianjin",
        "chongqing"
      ]
    },
    "baseWeight": 18,
    "text": [
      {
        "conditions": {
          "all": [
            { "path": "meta.age", "lte": 20 }
          ]
        },
        "text": "你初到码头，只能跟着老脚夫学怎样让麻包落在肩胛最硬的地方。船笛一响便要抢活，年轻并不自动多挣几个钱，只是摔倒后爬得快些。"
      },
      {
        "conditions": {
          "any": [
            { "path": "location.migratedTimes", "gte": 1 },
            { "path": "birth.hukou", "eq": "rural" }
          ]
        },
        "text": "从乡下到埠头后，你靠扛包换当天的饭钱。货袋上印着远方商号，自己睡的通铺却离江岸只有几条街；货走得比人远，也比人轻松。"
      },
      {
        "text": "你在码头按包计钱，遇上大船靠岸便从天亮忙到灯火起来。货、汗、工头的催声和江风混在一起，城市的繁华先以重量落到你的肩上。"
      }
    ],
    "effects": [
      {
        "path": "career.income",
        "add": 5
      },
      {
        "path": "resources.health",
        "add": -4
      },
      {
        "path": "resources.wealth",
        "add": 3
      },
      {
        "addTag": "dock_worker_memory"
      }
    ]
  },
  {
    "id": "era_wartime_air_raid_shelter",
    "title": "躲进防空洞",
    "category": "war",
    "tags": [
      "war"
    ],
    "yearRange": [
      1937,
      1945
    ],
    "ageRange": [
      3,
      70
    ],
    "currentRegions": {
      "cityTiers": [
        "county",
        "city",
        "tier2",
        "tier1"
      ],
      "provinces": [
        "beijing",
        "tianjin",
        "hebei",
        "shandong",
        "jiangsu",
        "shanghai",
        "zhejiang",
        "hubei",
        "hunan",
        "jiangxi",
        "guangdong",
        "guangxi",
        "sichuan",
        "chongqing",
        "yunnan",
        "shanxi",
        "shaanxi",
        "henan"
      ]
    },
    "maxOccurrences": 1,
    "baseWeight": 22,
    "weightModifiers": [
      {
        "hasTag": "wartime_refugee",
        "multiply": 1.4
      },
      {
        "path": "birth.cityTier",
        "eq": "village",
        "multiply": 0.45
      }
    ],
    "text": "警报响起，你跟着人群躲进防空洞。黑暗里有人咳嗽，有人抱紧孩子，头顶的声音像铁片刮过天空。",
    "effects": [
      {
        "path": "resources.happiness",
        "add": -8
      },
      {
        "path": "attrs.mental",
        "add": -1
      },
      {
        "addTag": "air_raid_memory"
      }
    ]
  },
  {
    "id": "era_wartime_refugee_school",
    "title": "逃难路上的课",
    "category": "school",
    "yearRange": [
      1937,
      1945
    ],
    "ageRange": [
      7,
      22
    ],
    "conditions": {
      "any": [
        {
          "hasTag": "wartime_refugee"
        },
        {
          "hasTag": "air_raid_memory"
        }
      ]
    },
    "baseWeight": 18,
    "text": "逃难路上，有人把几张桌子拼成临时课堂。风一吹，粉笔灰和尘土一起落下，书声却还是断断续续响起来。",
    "effects": [
      {
        "path": "education.score",
        "add": 4
      },
      {
        "path": "resources.happiness",
        "add": -2
      },
      {
        "addTag": "wartime_school_memory"
      }
    ]
  },
  {
    "id": "era_occupied_area_low_head",
    "title": "沦陷区低头走路",
    "category": "war",
    "tags": [
      "war"
    ],
    "yearRange": [
      1937,
      1945
    ],
    "ageRange": [
      8,
      70
    ],
    "maxOccurrences": 1,
    "currentRegions": {
      "provinces": [
        "beijing",
        "tianjin",
        "hebei",
        "shandong",
        "jiangsu",
        "shanghai",
        "zhejiang",
        "guangdong"
      ]
    },
    "baseWeight": 16,
    "text": "街上多了岗哨和盘问，你学会低头走路。活下去有时不是勇敢，而是把每一步都放轻。",
    "effects": [
      {
        "path": "resources.freedom",
        "add": -8
      },
      {
        "path": "resources.happiness",
        "add": -6
      },
      {
        "addTrait": "survival_instinct"
      },
      {
        "addTag": "occupied_area_memory"
      }
    ]
  },
  {
    "id": "era_wartime_grain_hidden",
    "title": "藏起一袋粮",
    "category": "family",
    "yearRange": [
      1937,
      1949
    ],
    "ageRange": [
      12,
      75
    ],
    "maxOccurrences": 1,
    "birthRegions": {
      "hukou": [
        "rural"
      ]
    },
    "baseWeight": 22,
    "text": "家里把一点粮食藏起来，谁问都说没有。那袋粮不只装着米，也装着一家人对明天的惧怕。",
    "effects": [
      {
        "path": "resources.wealth",
        "add": 3
      },
      {
        "path": "resources.happiness",
        "add": -3
      },
      {
        "addTag": "hidden_grain_memory"
      }
    ]
  },
  {
    "id": "era_civil_war_inflation_money",
    "title": "钱变薄了",
    "category": "wealth",
    "yearRange": [
      1946,
      1949
    ],
    "ageRange": [
      12,
      80
    ],
    "maxOccurrences": 1,
    "baseWeight": 28,
    "text": [
      {
        "conditions": {
          "all": [
            { "path": "birth.hukou", "eq": "rural" }
          ]
        },
        "text": "纸币一天比一天轻，乡下人卖粮后不敢久留现钱，赶紧换成盐、布和农具。你第一次见到卖出一担谷子的人抱着一叠钞票，却仍舍不得在茶摊坐下。"
      },
      {
        "conditions": {
          "any": [
            { "path": "career.status", "eq": "employed" },
            { "path": "resources.wealth", "lte": 35 }
          ]
        },
        "text": "薪水发到手时已追不上米价，你下班便往店铺赶，怕多过一夜又少买半升。钞票的零越来越多，布袋里的东西却越来越少。"
      },
      {
        "text": "钱忽然变得很薄，上午谈好的价钱，下午便要重写。你把钞票扎成一捆去买日用品，找回来的不是零钱，而是店主一句‘明天还要涨’。"
      }
    ],
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
        "addTag": "inflation_memory"
      }
    ]
  },
  {
    "id": "era_nanyang_letter_arrives",
    "title": "南洋来信",
    "category": "migration",
    "yearRange": [
      1910,
      1948
    ],
    "ageRange": [
      5,
      80
    ],
    "maxOccurrences": 1,
    "birthRegions": {
      "provinces": [
        "guangdong",
        "fujian",
        "hainan"
      ]
    },
    "baseWeight": 18,
    "text": "南洋来了封信，纸上有陌生地名，也有熟人的口气。远方第一次变得具体，像一条潮湿的船路通到饭桌边。",
    "effects": [
      {
        "path": "resources.wealth",
        "add": 3
      },
      {
        "path": "relationships.family",
        "add": 3
      },
      {
        "addTag": "nanyang_letter_memory"
      }
    ]
  },
  {
    "id": "era_1911_queue_cut_city",
    "title": "剪掉辫子的街头",
    "category": "random",
    "yearRange": [
      1911,
      1913
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
    "baseWeight": 20,
    "text": "街上有人剪掉辫子，也有人把帽子压得很低。王朝的结束先落在头发、招牌和人们试探的眼神里。",
    "effects": [
      {
        "path": "resources.freedom",
        "add": 3
      },
      {
        "path": "attrs.mental",
        "add": 1
      },
      {
        "addTag": "queue_cut_memory"
      }
    ]
  },
  {
    "id": "era_may_fourth_leaflet",
    "title": "传单从手里递过",
    "category": "school",
    "yearRange": [
      1919,
      1921
    ],
    "ageRange": [
      14,
      28
    ],
    "currentRegions": {
      "cityTiers": [
        "city",
        "tier2",
        "tier1"
      ],
      "provinces": [
        "beijing",
        "tianjin",
        "shanghai",
        "jiangsu",
        "zhejiang",
        "hubei",
        "hunan",
        "guangdong"
      ]
    },
    "weightModifiers": [
      {
        "hasTrait": "modern_schooling",
        "multiply": 1.8
      },
      {
        "path": "education.score",
        "gte": 40,
        "multiply": 1.5
      }
    ],
    "maxOccurrences": 1,
    "baseWeight": 12,
    "text": "传单从学生手里递过来，纸很薄，字却很烫。你不一定完全懂那些大词，但知道街上的年轻人不想再低声说话。",
    "effects": [
      {
        "path": "education.score",
        "add": 4
      },
      {
        "path": "resources.freedom",
        "add": 3
      },
      {
        "addTag": "may_fourth_memory"
      }
    ]
  },
  {
    "id": "era_northeast_occupation_silence",
    "title": "东北的沉默",
    "category": "war",
    "tags": [
      "war"
    ],
    "yearRange": [
      1931,
      1945
    ],
    "ageRange": [
      6,
      80
    ],
    "currentRegions": {
      "provinces": [
        "liaoning",
        "jilin",
        "heilongjiang"
      ]
    },
    "maxOccurrences": 1,
    "baseWeight": 30,
    "text": "街上的旗帜和口音变了，许多话只能咽回去。你学会在熟悉的地方过陌生的日子。",
    "effects": [
      {
        "path": "resources.freedom",
        "add": -10
      },
      {
        "path": "resources.happiness",
        "add": -7
      },
      {
        "addTag": "northeast_occupation_memory"
      }
    ]
  },
  {
    "id": "era_wartime_chongqing_cave_light",
    "title": "山城防空灯",
    "category": "war",
    "tags": [
      "war"
    ],
    "yearRange": [
      1938,
      1943
    ],
    "ageRange": [
      3,
      75
    ],
    "currentRegions": {
      "provinces": [
        "chongqing",
        "sichuan"
      ],
      "cityTiers": [
        "county",
        "city",
        "tier2",
        "tier1"
      ]
    },
    "maxOccurrences": 1,
    "baseWeight": 20,
    "text": "山城夜里熄了灯，人群往防空洞里走。潮湿的石壁贴着背，远处的爆响把每个人都变得很小。",
    "effects": [
      {
        "path": "resources.happiness",
        "add": -8
      },
      {
        "path": "resources.health",
        "add": -3
      },
      {
        "addTag": "chongqing_air_raid_memory"
      }
    ]
  },
  {
    "id": "era_henan_famine_1942",
    "title": "中原荒年",
    "category": "health",
    "yearRange": [
      1942,
      1943
    ],
    "ageRange": [
      2,
      80
    ],
    "currentRegions": {
      "provinces": [
        "henan"
      ]
    },
    "maxOccurrences": 1,
    "baseWeight": 30,
    "weightModifiers": [
      {
        "path": "birth.hukou",
        "eq": "rural",
        "multiply": 1.5
      },
      {
        "path": "resources.wealth",
        "lte": 30,
        "multiply": 1.5
      }
    ],
    "text": "荒年压到中原，粮食、树皮和亲人的脚步都变得稀薄。你记住了饥饿不是空，是身体里一点点被掏走。",
    "effects": [
      {
        "path": "resources.health",
        "add": -14
      },
      {
        "path": "resources.happiness",
        "add": -10
      },
      {
        "addTag": "henan_famine_memory"
      }
    ]
  },
  {
    "id": "era_victory_news_1945",
    "title": "胜利的消息",
    "category": "war",
    "tags": [
      "war"
    ],
    "yearRange": [
      1945,
      1945
    ],
    "ageRange": [
      0,
      90
    ],
    "maxOccurrences": 1,
    "priority": 45,
    "baseWeight": 80,
    "text": [
      {
        "conditions": {
          "all": [
            { "path": "meta.age", "lte": 7 }
          ]
        },
        "text": "胜利的消息传来，大人忽然把你抱起来，街上有人敲锣，也有人站着流泪。你还不懂八年有多长，只知道这一天家里的灯点得比平常久。"
      },
      {
        "conditions": {
          "any": [
            { "eventOccurred": "era_war_lost_family_member" },
            { "path": "location.migratedTimes", "gte": 1 }
          ]
        },
        "text": "胜利的消息传到临时住处，人群欢呼，你却先去邮局和车站打听失散的亲人。战争结束是一张大告示，家能不能重新拼齐，仍要等一封很小的信。"
      },
      {
        "text": "胜利的消息沿着广播、报纸和街头传来，有人放鞭炮，有人抱头痛哭。你跟着人群松了一口气，也知道停火不会把死者、废墟和欠下的日子一并送还。"
      }
    ],
    "effects": [
      {
        "path": "resources.happiness",
        "add": 6
      },
      {
        "path": "attrs.mental",
        "add": 1
      },
      {
        "addTag": "war_victory_memory"
      }
    ]
  },
  {
    "id": "era_1948_student_prices",
    "title": "学生看见物价",
    "category": "school",
    "yearRange": [
      1947,
      1949
    ],
    "ageRange": [
      13,
      25
    ],
    "currentRegions": {
      "cityTiers": [
        "county",
        "city",
        "tier2",
        "tier1"
      ]
    },
    "conditions": {
      "any": [
        {
          "hasTag": "student"
        },
        {
          "path": "education.score",
          "gte": 30
        }
      ]
    },
    "baseWeight": 18,
    "text": "学校门口的小吃又涨价了，纸币像越印越轻。你开始明白，课本外面的世界也会出题，而且没有标准答案。",
    "effects": [
      {
        "path": "education.score",
        "add": 2
      },
      {
        "path": "resources.wealth",
        "add": -4
      },
      {
        "addTag": "student_inflation_memory"
      }
    ]
  },
  {
    id: "era_republic_influenza_1918",
    title: "一场没有名字的热病",
    category: "health",
    yearRange: [1918, 1919],
    ageRange: [0, 80],
    currentRegions: { cityTiers: ["town", "county", "city", "tier2", "tier1"] },
    maxOccurrences: 1,
    baseWeight: 4,
    text: "一场急病从车站、码头和兵营传开，街坊只说是时疫。你烧了几天，门外的脚步声也稀了，谁都说不清风里究竟带着什么。",
    effects: [
      { path: "resources.health", add: -9 },
      { path: "resources.happiness", add: -5 },
      { path: "resources.freedom", add: -3 },
    ],
  },
  {
    id: "era_republic_rickshaw_puller",
    title: "两根车把",
    category: "career",
    yearRange: [1912, 1937],
    ageRange: [17, 45],
    genders: ["male"],
    birthFamilyClasses: ["landless_laborer", "tenant", "poor_peasant", "smallholder", "shop_clerk"],
    currentRegions: { cityTiers: ["county", "city", "tier2", "tier1"] },
    conditions: { any: [{ path: "career.status", eq: "unemployed" }, { path: "career.field", eq: "manual_worker" }, { path: "resources.wealth", lte: 25 }] },
    maxOccurrences: 1,
    baseWeight: 16,
    text: "你租了辆人力车，低头拉着别人穿过街市。车主按天收份钱，乘客按里程讲价，只有你的腿从不参与账目的讨论。",
    effects: [
      { path: "career.status", set: "employed" },
      { path: "career.field", set: "rickshaw_puller" },
      { path: "career.income", add: 5 },
      { path: "resources.wealth", add: 3 },
      { path: "resources.health", add: -6 },
    ],
  },
  {
    id: "era_republic_silk_mill_woman",
    title: "缫丝机旁的姐妹",
    category: "career",
    yearRange: [1915, 1937],
    ageRange: [14, 35],
    genders: ["female"],
    birthFamilyClasses: ["landless_laborer", "tenant", "poor_peasant", "smallholder", "craftsman", "shop_clerk"],
    currentRegions: { provinces: ["jiangsu", "zhejiang", "shanghai", "guangdong"], cityTiers: ["town", "county", "city", "tier2", "tier1"] },
    conditions: { any: [{ path: "career.field", eq: "factory" }, { path: "career.status", eq: "unemployed" }, { path: "resources.wealth", lte: 35 }] },
    maxOccurrences: 1,
    baseWeight: 18,
    text: "你在缫丝机旁站满一班，热水泡皱手指，飞丝粘在发上。女工们说笑很快，因为机器不等人把一句话慢慢讲完。",
    effects: [
      { path: "career.status", set: "employed" },
      { path: "career.field", set: "silk_mill_worker" },
      { path: "career.income", add: 6 },
      { path: "resources.wealth", add: 4 },
      { path: "resources.health", add: -5 },
      { path: "relationships.friendship", add: 4 },
    ],
  },
  {
    id: "era_republic_factory_clock",
    title: "汽笛替人定时辰",
    category: "career",
    yearRange: [1915, 1936],
    ageRange: [15, 50],
    birthFamilyClasses: ["landless_laborer", "tenant", "poor_peasant", "smallholder", "craftsman", "shop_clerk"],
    currentRegions: { provinces: ["shanghai", "tianjin", "jiangsu", "hubei", "guangdong", "liaoning", "shandong"], cityTiers: ["city", "tier2", "tier1"] },
    conditions: { any: [{ path: "career.field", eq: "manual_worker" }, { path: "career.field", eq: "factory" }, { path: "career.status", eq: "unemployed" }] },
    maxOccurrences: 1,
    baseWeight: 17,
    text: "厂门汽笛一响，几百个人同时进出。过去日子看日头，如今看钟；钟的好处是从不迟到，坏处也是。",
    effects: [
      { path: "career.status", set: "employed" },
      { path: "career.field", set: "factory" },
      { path: "career.income", add: 5 },
      { path: "resources.wealth", add: 3 },
      { path: "resources.freedom", add: -5 },
      { path: "resources.health", add: -3 },
    ],
  },
  {
    id: "era_republic_north_drought_1920",
    title: "井绳越放越长",
    category: "health",
    yearRange: [1920, 1921],
    ageRange: [0, 80],
    currentRegions: { provinces: ["hebei", "shanxi", "shandong", "henan", "shaanxi"] },
    conditions: { any: [{ path: "birth.hukou", eq: "rural" }, { path: "resources.wealth", lte: 35 }] },
    maxOccurrences: 1,
    priority: 58,
    baseWeight: 65,
    text: "井绳越放越长，桶底仍只碰到一点泥水。粮价先涨，人的声音后低下去，村路上开始出现背着铺盖离乡的人。",
    effects: [
      { path: "resources.health", add: -11 },
      { path: "resources.wealth", add: -10 },
      { path: "resources.happiness", add: -8 },
      { addTrait: "survival_instinct" },
    ],
  },
  {
    id: "era_republic_worker_night_school",
    title: "下工以后认字",
    category: "school",
    yearRange: [1920, 1936],
    ageRange: [16, 38],
    birthFamilyClasses: ["landless_laborer", "tenant", "poor_peasant", "craftsman", "shop_clerk"],
    currentRegions: { cityTiers: ["town", "county", "city", "tier2", "tier1"] },
    conditions: { any: [{ path: "career.field", eq: "manual_worker" }, { path: "career.field", eq: "factory" }, { path: "career.field", eq: "rickshaw_puller" }, { hasTag: "manual_worker_path" }] },
    maxOccurrences: 1,
    baseWeight: 14,
    text: "下工后，你跟几个人挤在昏灯下认字。先学会写自己的名字，再学工钱、工时和契约；识字从这里起，不只是为了读好听的文章。",
    effects: [
      { path: "education.score", add: 7 },
      { path: "resources.health", add: -2 },
      { path: "resources.freedom", add: 3 },
      { addTrait: "media_ear" },
    ],
  },
  {
    id: "era_republic_railway_strike_1923",
    title: "铁轨安静了一天",
    category: "career",
    yearRange: [1923, 1923],
    ageRange: [16, 50],
    birthFamilyClasses: ["landless_laborer", "poor_peasant", "craftsman", "shop_clerk"],
    currentRegions: { provinces: ["beijing", "hebei", "henan", "hubei", "hunan"], cityTiers: ["town", "county", "city", "tier2", "tier1"] },
    conditions: { any: [{ path: "career.field", eq: "manual_worker" }, { path: "career.field", eq: "factory" }, { path: "career.field", eq: "railway_worker" }, { hasTag: "manual_worker_path" }, { hasTag: "dock_worker_memory" }, { hasTag: "student_public_voice" }] },
    maxOccurrences: 1,
    baseWeight: 10,
    text: "铁路工人停下手里的活，铁轨难得安静。你站在人群边上，看见平日被汽笛分散的人第一次用同一个声音说话。",
    effects: [
      { path: "resources.reputation", add: 4 },
      { path: "resources.freedom", add: 3 },
      { path: "resources.happiness", add: -2 },
    ],
  },
  {
    id: "era_republic_may_thirtieth_crowd",
    title: "街上忽然停市",
    category: "random",
    yearRange: [1925, 1926],
    ageRange: [14, 45],
    currentRegions: { provinces: ["shanghai", "jiangsu", "zhejiang", "beijing", "tianjin", "hubei", "hunan", "guangdong"], cityTiers: ["city", "tier2", "tier1"] },
    conditions: { any: [{ path: "education.score", gte: 25 }, { path: "career.field", eq: "factory" }, { path: "career.field", eq: "manual_worker" }, { path: "career.field", eq: "shop_clerk" }] },
    maxOccurrences: 1,
    baseWeight: 14,
    text: "枪声之后，学生、工人和商户把街市停了下来。你在人群中递水、传话，第一次看见一座城市怎样用关门表达态度。",
    effects: [
      { path: "resources.reputation", add: 4 },
      { path: "resources.freedom", add: 3 },
      { path: "resources.happiness", add: -4 },
    ],
  },
  {
    id: "era_republic_northern_expedition_passes",
    title: "队伍沿官道北去",
    category: "war",
    tags: ["war"],
    yearRange: [1926, 1928],
    ageRange: [6, 65],
    currentRegions: { provinces: ["guangdong", "guangxi", "hunan", "hubei", "jiangxi", "fujian", "zhejiang", "jiangsu", "henan"] },
    maxOccurrences: 1,
    baseWeight: 20,
    text: "队伍沿官道向北，墙上旧标语被新标语盖住。孩子追着看热闹，大人先数自家还剩多少粮——主义走得很快，灶台总要慢一步核账。",
    effects: [
      { path: "resources.wealth", add: -3 },
      { path: "resources.happiness", add: -2 },
      { path: "attrs.mental", add: 1 },
    ],
  },
  {
    id: "era_republic_1927_city_searches",
    title: "夜里有人查门牌",
    category: "war",
    tags: ["war"],
    yearRange: [1927, 1931],
    ageRange: [15, 45],
    currentRegions: { provinces: ["shanghai", "jiangsu", "zhejiang", "guangdong", "hunan", "hubei", "jiangxi", "fujian"], cityTiers: ["county", "city", "tier2", "tier1"] },
    conditions: { any: [{ hasTag: "student_public_voice" }, { hasTag: "may_fourth_memory" }, { hasTrait: "media_ear" }, { path: "resources.reputation", gte: 35 }] },
    maxOccurrences: 1,
    baseWeight: 8,
    text: "夜里有人逐户查门牌，白天熟悉的街道忽然有了不能去的方向。你烧掉几张纸，也从此知道文字并不总比刀枪轻。",
    effects: [
      { path: "resources.freedom", add: -10 },
      { path: "resources.happiness", add: -7 },
      { path: "resources.reputation", add: -3 },
    ],
  },
  {
    id: "era_republic_export_crash_1929",
    title: "洋庄忽然不收货",
    category: "wealth",
    yearRange: [1929, 1933],
    ageRange: [16, 70],
    birthFamilyClasses: ["smallholder", "rich_peasant", "craftsman", "merchant", "comprador_merchant"],
    currentRegions: { provinces: ["shanghai", "jiangsu", "zhejiang", "fujian", "guangdong", "yunnan", "anhui"], cityTiers: ["town", "county", "city", "tier2", "tier1"] },
    maxOccurrences: 1,
    baseWeight: 16,
    text: "洋庄忽然少收生丝、茶叶或桐油，仓里有货，账上却没有活路。远方市场打了个寒战，冷意几个月后才抵达你家。",
    effects: [
      { path: "resources.wealth", add: -9 },
      { path: "career.income", add: -3 },
      { path: "resources.happiness", add: -4 },
      { addTrait: "market_sense" },
    ],
  },
  {
    id: "era_republic_yangtze_flood_1931",
    title: "江水住进了屋里",
    category: "migration",
    tags: ["disaster"],
    yearRange: [1931, 1932],
    ageRange: [0, 80],
    currentRegions: { provinces: ["hubei", "hunan", "jiangxi", "anhui", "jiangsu", "zhejiang", "henan"], cityTiers: ["village", "town", "county", "city"] },
    maxOccurrences: 1,
    priority: 62,
    baseWeight: 76,
    text: "连月大水漫过圩堤，江河像住进了屋里。你们把老人孩子送上船，桌椅和庄稼在浑水中先后失去名字。",
    effects: [
      { path: "resources.health", add: -11 },
      { path: "resources.wealth", add: -14 },
      { path: "relationships.family", add: -4 },
      { path: "location.migratedTimes", add: 1 },
      { addTrait: "survival_instinct" },
    ],
  },
  {
    id: "era_republic_great_wall_wounded",
    title: "长城口外的伤兵",
    category: "war",
    tags: ["war"],
    yearRange: [1933, 1934],
    ageRange: [10, 60],
    currentRegions: { provinces: ["hebei", "beijing", "tianjin", "liaoning", "shanxi"], cityTiers: ["village", "town", "county", "city"] },
    maxOccurrences: 1,
    baseWeight: 18,
    text: "从长城口外退下来的伤兵住进祠堂和学校。你帮着烧水，听他们在梦里喊阵地名；地图上的边线，原来会流血。",
    effects: [
      { path: "resources.happiness", add: -6 },
      { path: "resources.wealth", add: -2 },
      { path: "relationships.friendship", add: 2 },
    ],
  },
  {
    id: "era_republic_student_petition_1935",
    title: "寒风里的请愿队伍",
    category: "school",
    yearRange: [1935, 1936],
    ageRange: [15, 27],
    currentRegions: { provinces: ["beijing", "tianjin", "hebei", "shanghai", "jiangsu", "hubei"], cityTiers: ["city", "tier2", "tier1"] },
    conditions: { any: [{ hasTag: "student" }, { path: "education.score", gte: 40 }, { hasTrait: "modern_schooling" }] },
    maxOccurrences: 1,
    baseWeight: 12,
    text: "学生队伍顶着寒风走过街口，嗓子喊哑了仍不肯散。你在其中，忽然发现年轻人的热血并不暖和，手脚照样会冻得发麻。",
    effects: [
      { path: "resources.reputation", add: 5 },
      { path: "resources.freedom", add: 3 },
      { path: "resources.health", add: -2 },
    ],
  },
  {
    id: "era_wartime_lower_yangtze_night_crossing",
    title: "趁夜过江",
    category: "migration",
    tags: ["war"],
    yearRange: [1937, 1938],
    ageRange: [0, 75],
    birthRegions: { provinces: ["shanghai", "jiangsu", "zhejiang", "anhui"] },
    currentRegions: { provinces: ["shanghai", "jiangsu", "zhejiang", "anhui"], cityTiers: ["town", "county", "city", "tier2", "tier1"] },
    maxOccurrences: 1,
    priority: 54,
    baseWeight: 55,
    text: "你们趁夜挤上一条小船，灯不敢点，孩子的哭声也被大人捂在怀里。江面很宽，身后的火光仍能照见每个人的沉默。",
    effects: [
      { path: "resources.health", add: -7 },
      { path: "resources.wealth", add: -10 },
      { path: "resources.happiness", add: -9 },
      { path: "location.migratedTimes", add: 1 },
      { addTrait: "survival_instinct" },
    ],
  },
  {
    id: "era_wartime_yellow_river_flood_1938",
    title: "河水从战事里来",
    category: "migration",
    tags: ["war", "disaster"],
    yearRange: [1938, 1939],
    ageRange: [0, 80],
    currentRegions: { provinces: ["henan", "anhui", "jiangsu"], cityTiers: ["village", "town", "county", "city"] },
    maxOccurrences: 1,
    priority: 64,
    baseWeight: 78,
    text: "堤口被扒开后，黄水不是从天灾里来，而是从战事里来。你在齐腰深的水中扶着家人，许多年后仍分不清该怨河，还是怨人。",
    effects: [
      { path: "resources.health", add: -12 },
      { path: "resources.wealth", add: -15 },
      { path: "relationships.family", add: -6 },
      { path: "location.migratedTimes", add: 1 },
      { addTrait: "survival_instinct" },
    ],
  },
  {
    id: "era_wartime_occupied_city_shortages",
    title: "肥皂也成了消息",
    category: "wealth",
    yearRange: [1939, 1945],
    ageRange: [10, 75],
    birthRegions: { provinces: ["beijing", "tianjin", "hebei", "shandong", "shanghai", "jiangsu", "zhejiang", "guangdong", "liaoning", "jilin", "heilongjiang"] },
    currentRegions: { provinces: ["beijing", "tianjin", "hebei", "shandong", "shanghai", "jiangsu", "zhejiang", "guangdong", "liaoning", "jilin", "heilongjiang"], cityTiers: ["county", "city", "tier2", "tier1"] },
    conditions: { all: [{ path: "resources.wealth", lte: 55 }] },
    maxOccurrences: 1,
    baseWeight: 8,
    text: "盐、火柴、煤和肥皂轮流短缺。街坊交换的消息越来越实际：哪家铺子还有货，哪种东西可以少用；时代的大题，常常先考人怎么洗衣服。",
    effects: [
      { path: "resources.wealth", add: -6 },
      { path: "resources.happiness", add: -3 },
      { path: "resources.health", add: -2 },
    ],
  },
  {
    id: "era_wartime_overseas_remittance_breaks",
    title: "侨批断了几个月",
    category: "family",
    yearRange: [1941, 1945],
    ageRange: [8, 80],
    birthRegions: { provinces: ["guangdong", "fujian", "hainan"] },
    birthFamilyClasses: ["poor_peasant", "smallholder", "rich_peasant", "merchant", "shop_clerk"],
    conditions: { any: [{ hasTag: "nanyang_letter_memory" }, { hasTag: "nanyang_migrant" }, { path: "resources.wealth", lte: 40 }] },
    maxOccurrences: 1,
    baseWeight: 16,
    text: "海路被战火截断，南洋的侨批几个月没有来。家里先担心钱，后来只担心人；远方越没有消息，饭桌上越常提起那个名字。",
    effects: [
      { path: "resources.wealth", add: -7 },
      { path: "relationships.family", add: -3 },
      { path: "resources.happiness", add: -6 },
    ],
  },
  {
    id: "era_wartime_burma_road_driver",
    title: "公路盘在山腰",
    category: "career",
    tags: ["war"],
    yearRange: [1938, 1942],
    ageRange: [18, 45],
    genders: ["male"],
    birthFamilyClasses: ["landless_laborer", "poor_peasant", "smallholder", "craftsman", "shop_clerk", "merchant"],
    currentRegions: { provinces: ["yunnan", "guizhou", "sichuan", "guangxi"], cityTiers: ["village", "town", "county", "city"] },
    conditions: { any: [{ hasTrait: "practical_skill" }, { path: "career.field", eq: "manual_worker" }, { path: "career.field", eq: "driver" }, { path: "attrs.physique", gte: 5 }] },
    maxOccurrences: 1,
    baseWeight: 11,
    text: "你跟车队沿山路运货，左边是峭壁，右边是深谷，头顶还要防飞机。到站后有人夸公路是生命线，你觉得刹车也很有功劳。",
    effects: [
      { path: "career.status", set: "employed" },
      { path: "career.field", set: "wartime_driver" },
      { path: "career.income", add: 7 },
      { path: "resources.wealth", add: 5 },
      { path: "resources.health", add: -6 },
      { path: "resources.reputation", add: 4 },
    ],
  },
  {
    id: "era_wartime_factory_moves_inland",
    title: "机器也在逃难",
    category: "career",
    tags: ["war"],
    yearRange: [1937, 1943],
    ageRange: [16, 55],
    birthFamilyClasses: ["craftsman", "shop_clerk", "poor_peasant", "smallholder", "merchant"],
    currentRegions: { provinces: ["hubei", "hunan", "sichuan", "chongqing", "guizhou", "yunnan", "shaanxi"], cityTiers: ["town", "county", "city", "tier2"] },
    conditions: { any: [{ path: "career.field", eq: "factory" }, { path: "career.field", eq: "manual_worker" }, { path: "career.field", eq: "arsenal_worker" }, { hasTrait: "practical_skill" }] },
    maxOccurrences: 1,
    baseWeight: 14,
    text: "拆下来的机器沿江沿路往内地运，少一颗螺钉都要沿途找。厂房搭在山沟里，机器重新响起时，像一群沉重的难民终于喘过气。",
    effects: [
      { path: "career.status", set: "employed" },
      { path: "career.field", set: "wartime_factory" },
      { path: "career.income", add: 5 },
      { path: "resources.achievement", add: 5 },
      { path: "resources.health", add: -3 },
    ],
  },
  {
    id: "era_wartime_ichigo_flight",
    title: "公路又一次向后延伸",
    category: "migration",
    tags: ["war"],
    yearRange: [1944, 1945],
    ageRange: [0, 80],
    currentRegions: { provinces: ["henan", "hunan", "guangxi", "guizhou", "jiangxi", "guangdong"], cityTiers: ["village", "town", "county", "city"] },
    maxOccurrences: 1,
    priority: 55,
    baseWeight: 58,
    text: "战线突然压过来，逃难的人群重新塞满公路。你原以为这些年已经学会告别，真正转身时才发现，熟练并不能让离开变轻。",
    effects: [
      { path: "resources.health", add: -8 },
      { path: "resources.wealth", add: -10 },
      { path: "resources.happiness", add: -8 },
      { path: "location.migratedTimes", add: 1 },
    ],
  },
  {
    id: "era_postwar_demobilized_return",
    title: "被带走的人回来了",
    category: "family",
    yearRange: [1947, 1949],
    ageRange: [22, 55],
    genders: ["male"],
    birthFamilyClasses: ["landless_laborer", "tenant", "poor_peasant", "smallholder", "craftsman", "shop_clerk"],
    currentRegions: { cityTiers: ["village", "town", "county"] },
    conditions: { all: [{ hasTag: "forced_conscription" }] },
    maxOccurrences: 1,
    baseWeight: 10,
    text: "被拉进队伍以后，你终于穿着洗褪色的军装回到村口。家人先认出走路的姿势，才认出脸；田还在那里，身体却会突然想起枪声。",
    effects: [
      { path: "career.field", set: "farm_work" },
      { path: "relationships.family", add: 8 },
      { path: "resources.happiness", add: 4 },
      { path: "resources.health", add: -2 },
    ],
  },
  {
    id: "era_civil_war_land_meeting",
    title: "祠堂里重算土地",
    category: "wealth",
    yearRange: [1946, 1949],
    ageRange: [16, 70],
    birthFamilyClasses: ["landless_laborer", "tenant", "poor_peasant"],
    currentRegions: { provinces: ["hebei", "shanxi", "shandong", "henan", "shaanxi", "heilongjiang", "jilin", "liaoning", "jiangsu", "anhui"], hukou: ["rural"], cityTiers: ["village", "town"] },
    maxOccurrences: 1,
    baseWeight: 16,
    text: "祠堂里开会重算土地，过去坐后排的人被请到前面讲话。你分到的不只是几亩地，也是一种陌生的分量：轮到自己说，声音反而先发抖。",
    effects: [
      { path: "resources.wealth", add: 10 },
      { path: "resources.reputation", add: 5 },
      { path: "resources.freedom", add: 5 },
      { path: "relationships.family", add: 2 },
    ],
  },
  {
    id: "era_civil_war_teacher_paid_in_rice",
    title: "薪水按米价折算",
    category: "career",
    yearRange: [1946, 1949],
    ageRange: [20, 70],
    birthFamilyClasses: ["scholar_gentry", "merchant", "shop_clerk", "craftsman"],
    currentRegions: { cityTiers: ["county", "city", "tier2", "tier1"] },
    conditions: { any: [{ path: "career.field", eq: "teacher" }, { path: "education.score", gte: 55 }] },
    maxOccurrences: 1,
    baseWeight: 15,
    text: "学校发薪时先问当天米价，纸币刚到手就赶着换成粮。你教学生算术，最难的一题却是怎样让这个月的薪水活到下个月。",
    effects: [
      { path: "career.income", add: -4 },
      { path: "resources.wealth", add: -7 },
      { path: "resources.happiness", add: -3 },
      { path: "education.score", add: 2 },
    ],
  },
  {
    id: "era_civil_war_gold_yuan_coupon",
    title: "新钞又印得很体面",
    category: "wealth",
    yearRange: [1948, 1949],
    ageRange: [16, 80],
    birthFamilyClasses: ["shop_clerk", "craftsman", "merchant", "comprador_merchant", "scholar_gentry", "landlord", "rich_peasant"],
    currentRegions: { cityTiers: ["county", "city", "tier2", "tier1"] },
    conditions: { all: [{ path: "resources.wealth", gte: 25 }] },
    maxOccurrences: 1,
    baseWeight: 20,
    text: "旧钞限期换成新钞，柜台前排起长队。新票印得很体面，购买力却保持谦虚；你把多年积蓄换来换去，越换越轻。",
    effects: [
      { path: "resources.wealth", add: -12 },
      { path: "resources.happiness", add: -6 },
      { path: "resources.freedom", add: -2 },
    ],
  }
];
