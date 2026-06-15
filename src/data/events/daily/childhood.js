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
    "text": "夏夜很黑，萤火虫一闪一闪。你把它们捧在手心，像捧住了一小把会呼吸的星星。",
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
    "baseWeight": 28,
    "text": "你偶然听到一首旧歌。旋律一响，很多早就不提的年份忽然从心里抬头。",
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
  }
];
