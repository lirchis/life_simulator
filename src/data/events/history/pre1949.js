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
      1900,
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
        "text": "去码头或厂里做工",
        "resultText": "你跟着人去了码头或厂里。活重、钱少，但城市的门缝从此露出一点光。",
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
      1900,
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
        "text": "进纱厂或作坊做女工",
        "resultText": "你进了纱厂或作坊。机器声很硬，工钱很薄，但你第一次有了自己挣来的钱。",
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
    "id": "era_late_qing_old_school",
    "title": "私塾晨读",
    "category": "school",
    "yearRange": [
      1900,
      1911
    ],
    "ageRange": [
      6,
      15
    ],
    "birthFamilyClasses": [
      "scholar_gentry",
      "landlord",
      "merchant",
      "comprador_merchant",
      "smallholder"
    ],
    "maxOccurrences": 1,
    "baseWeight": 34,
    "weightModifiers": [
      {
        "path": "birth.gender",
        "eq": "male",
        "multiply": 1.6
      },
      {
        "path": "birth.gender",
        "eq": "female",
        "multiply": 0.45
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
        "text": "天还没亮，你在家中跟着识字的大人读书。能摸到书页已经不易，先生的戒尺和正式的学堂仍离你很远。"
      },
      {
        "text": "天还没亮，你已经坐在长凳上背书。先生的戒尺落在桌面，像旧时代还不肯退场的回声。"
      }
    ],
    "effects": [
      {
        "path": "education.score",
        "add": 7
      },
      {
        "path": "attrs.mental",
        "add": -1
      },
      {
        "addTrait": "exam_aptitude"
      },
      {
        "addTag": "old_learning"
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
    "ageRange": [
      8,
      55
    ],
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
      1900,
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
    "baseWeight": 2,
    "priority": 62,
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
    "baseWeight": 20,
    "text": "某个亲人的消息断在战乱里。饭桌上少了一副碗筷，后来谁也不主动提起。",
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
    "baseWeight": 24,
    "text": "地方上又添了一项捐。名目换来换去，最后都落到米袋、铺账和一家人的饭桌上。",
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
      1900,
      1948
    ],
    "ageRange": [
      12,
      24
    ],
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
      1900,
      1948
    ],
    "ageRange": [
      15,
      45
    ],
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
    "text": "你在码头扛过包。船笛一响，货、汗、骂声和江风混在一起，城市的饭碗沉得很具体。",
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
    "maxOccurrences": 2,
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
    "baseWeight": 28,
    "text": "钱忽然变得很薄，今天能买的东西，明天就差一截。你看见大人把钞票捏得很紧，像捏住一把正在漏的沙。",
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
    "text": "胜利的消息传来，有人哭，有人笑，也有人先问失散的人还能不能回来。八年像一条长河，终于听见了回声。",
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
  }
];
