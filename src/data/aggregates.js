export const aggregates = [
  {
    id: "province.region.west",
    name: "西部省份",
    domain: "province",
    values: ["sichuan", "guizhou", "yunnan", "xizang", "shaanxi", "gansu", "qinghai", "ningxia", "xinjiang", "chongqing"],
  },
  {
    id: "province.coastal",
    name: "沿海省份",
    domain: "province",
    values: ["liaoning", "hebei", "tianjin", "shandong", "jiangsu", "shanghai", "zhejiang", "fujian", "guangdong", "guangxi", "hainan"],
  },
  {
    id: "province.internet",
    name: "互联网机会地区",
    domain: "province",
    values: ["beijing", "shanghai", "guangdong", "zhejiang", "jiangsu"],
  },
  {
    id: "city.large",
    name: "大城市",
    domain: "cityTier",
    values: ["tier1", "tier2"],
  },
];
