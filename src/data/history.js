import { cityTiers, familyClasses, hukouTypes, provinces } from "./regions.js";

const provinceLabels = Object.fromEntries(provinces);

export const historicalProvinceAliases = [
  {
    code: "zhili",
    name: "直隶",
    currentCode: "hebei",
    weightedCurrentCodes: [{ code: "hebei", weight: 74 }, { code: "beijing", weight: 13 }, { code: "tianjin", weight: 13 }],
    startYear: 1900,
    endYear: 1928,
    note: "1928 年直隶改称河北，北京、天津后续成为独立直辖市。首版按历史人口/辖区粗略权重随机。",
  },
  {
    code: "fengtian",
    name: "奉天",
    currentCode: "liaoning",
    startYear: 1900,
    endYear: 1928,
    note: "1929 年奉天省改称辽宁省。首版按辽宁计算。",
  },
  {
    code: "jiangsu_old",
    name: "江苏",
    currentCode: "jiangsu",
    weightedCurrentCodes: [{ code: "jiangsu", weight: 88 }, { code: "shanghai", weight: 12 }],
    startYear: 1900,
    endYear: 1927,
    note: "上海 1927 年设特别市。1900 年出生在江苏口径下，首版按历史人口/辖区粗略权重随机到江苏或上海。",
  },
  {
    code: "gansu_old",
    name: "甘肃",
    currentCode: "gansu",
    weightedCurrentCodes: [{ code: "gansu", weight: 70 }, { code: "ningxia", weight: 16 }, { code: "qinghai", weight: 14 }],
    startYear: 1900,
    endYear: 1928,
    note: "宁夏、青海在 1928 年前多在甘肃等旧行政口径内。首版按粗略权重随机。",
  },
  {
    code: "mongol_leagues",
    name: "蒙古盟旗",
    currentCode: "neimenggu",
    startYear: 1900,
    endYear: 1946,
    note: "1947 年内蒙古自治区成立前，首版以蒙古盟旗作为近代口径，按内蒙古计算。",
  },
  {
    code: "xizang_old",
    name: "西藏地方",
    currentCode: "xizang",
    startYear: 1900,
    endYear: 1964,
    note: "1965 年西藏自治区成立前，首版以西藏地方作为历史展示名，按西藏计算。",
  },
  {
    code: "taiwan_japanese",
    name: "台湾（日治）",
    currentCode: "taiwan",
    startYear: 1900,
    endYear: 1945,
    note: "1895-1945 年台湾处于日治时期。首版按台湾计算，并保留日治标签口径。",
  },
  {
    code: "hongkong_british",
    name: "香港（英属）",
    currentCode: "xianggang",
    startYear: 1900,
    endYear: 1996,
    note: "1997 年香港回归前，首版以英属香港作为历史展示名，按香港计算。",
  },
  {
    code: "macau_portuguese",
    name: "澳门（葡属）",
    currentCode: "aomen",
    startYear: 1900,
    endYear: 1998,
    note: "1999 年澳门回归前，首版以葡属澳门作为历史展示名，按澳门计算。",
  },
  { code: "xikang", name: "西康", currentCode: "sichuan", startYear: 1912, endYear: 1955, note: "民国时期曾有川边特别区/西康建省脉络；1955 年撤销。首版按四川计算。" },
  {
    code: "chahar",
    name: "察哈尔",
    currentCode: "hebei",
    weightedCurrentCodes: [{ code: "hebei", weight: 55 }, { code: "shanxi", weight: 25 }, { code: "neimenggu", weight: 20 }],
    startYear: 1912,
    endYear: 1952,
    note: "1952 年撤销，辖境分入河北、山西、内蒙古等地。首版按粗略辖区权重随机。",
  },
  { code: "suiyuan", name: "绥远", currentCode: "neimenggu", startYear: 1928, endYear: 1954, note: "1954 年撤销，并入内蒙古自治区。" },
  {
    code: "rehe",
    name: "热河",
    currentCode: "hebei",
    weightedCurrentCodes: [{ code: "hebei", weight: 45 }, { code: "liaoning", weight: 35 }, { code: "neimenggu", weight: 20 }],
    startYear: 1914,
    endYear: 1955,
    note: "1955 年撤销，辖境分入河北、辽宁、内蒙古。首版按粗略辖区权重随机。",
  },
  { code: "ningxia_old", name: "宁夏省", currentCode: "ningxia", startYear: 1928, endYear: 1954, note: "1954 年撤销并入甘肃，1958 年成立宁夏回族自治区。" },
  { code: "songjiang", name: "松江", currentCode: "heilongjiang", startYear: 1945, endYear: 1954, note: "1954 年撤销，并入黑龙江。" },
  { code: "liaodong", name: "辽东", currentCode: "liaoning", startYear: 1949, endYear: 1954, note: "1954 年与辽西合并恢复辽宁。" },
  { code: "liaoxi", name: "辽西", currentCode: "liaoning", startYear: 1949, endYear: 1954, note: "1954 年与辽东合并恢复辽宁。" },
  {
    code: "pingyuan",
    name: "平原",
    currentCode: "henan",
    weightedCurrentCodes: [{ code: "henan", weight: 55 }, { code: "shandong", weight: 45 }],
    startYear: 1949,
    endYear: 1952,
    note: "1952 年撤销，辖境分入河南、山东。首版按粗略辖区权重随机。",
  },
  { code: "chuanxi", name: "川西行署区", currentCode: "sichuan", startYear: 1950, endYear: 1952, note: "1952 年撤销，复设四川省。" },
  { code: "chuandong", name: "川东行署区", currentCode: "sichuan", startYear: 1950, endYear: 1952, note: "1952 年撤销，复设四川省。重庆相关事件仍可按重庆/四川细化。" },
  { code: "chuannan", name: "川南行署区", currentCode: "sichuan", startYear: 1950, endYear: 1952, note: "1952 年撤销，复设四川省。" },
  { code: "chuanbei", name: "川北行署区", currentCode: "sichuan", startYear: 1950, endYear: 1952, note: "1952 年撤销，复设四川省。" },
  {
    code: "guangdong_old",
    name: "广东",
    currentCode: "guangdong",
    weightedCurrentCodes: [{ code: "guangdong", weight: 90 }, { code: "hainan", weight: 10 }],
    startYear: 1900,
    endYear: 1987,
    note: "1988 年海南建省。首版按历史人口规模粗略权重随机到广东或海南。",
  },
  {
    code: "sichuan_old",
    name: "四川",
    currentCode: "sichuan",
    weightedCurrentCodes: [{ code: "sichuan", weight: 73 }, { code: "chongqing", weight: 27 }],
    startYear: 1900,
    endYear: 1996,
    note: "1997 年重庆恢复直辖市。首版按川渝拆分前后人口规模粗略权重随机到四川或重庆。",
  },
];

export const cityTierEras = [
  {
    startYear: 1900,
    endYear: 1948,
    options: [
      ["village", "乡村"],
      ["town", "市镇"],
      ["county", "县城"],
      ["city", "府城 / 商埠"],
      ["tier2", "省城"],
      ["tier1", "京沪大城"],
    ],
  },
  {
    startYear: 1949,
    endYear: 1977,
    options: [
      ["village", "农村生产队"],
      ["town", "人民公社 / 集镇"],
      ["county", "县城"],
      ["city", "地级市"],
      ["tier2", "省会 / 工业城市"],
      ["tier1", "直辖市核心区"],
    ],
  },
  {
    startYear: 1978,
    endYear: 1999,
    options: [
      ["village", "农村"],
      ["town", "乡镇"],
      ["county", "县城"],
      ["city", "普通城市"],
      ["tier2", "省会 / 沿海城市"],
      ["tier1", "北上广深雏形"],
    ],
  },
  { startYear: 2000, endYear: 2020, options: cityTiers },
];

export const familyClassEras = [
  {
    startYear: 1900,
    endYear: 1948,
    options: [
      ["landless_laborer", "无地雇农"],
      ["tenant", "佃户"],
      ["poor_peasant", "贫农"],
      ["smallholder", "自耕农"],
      ["rich_peasant", "富农"],
      ["craftsman", "手工业户"],
      ["shop_clerk", "店员 / 学徒"],
      ["merchant", "商户"],
      ["comprador_merchant", "买办 / 洋行商人"],
      ["scholar_gentry", "士绅 / 读书人家"],
      ["landlord", "地主"],
    ],
  },
  {
    startYear: 1949,
    endYear: 1977,
    options: [
      ["poor_peasant", "贫下中农"],
      ["middle_peasant", "中农"],
      ["rich_peasant_origin", "富农成分"],
      ["worker_family", "工人家庭"],
      ["state_worker", "国营厂矿职工"],
      ["cadre_family", "干部家庭"],
      ["soldier_family", "军属 / 烈属"],
      ["intellectual_family", "知识分子家庭"],
      ["small_trader_transformed", "小商小贩改造户"],
      ["overseas_relation", "海外关系家庭"],
      ["landlord_old", "地主 / 富农成分"],
    ],
  },
  {
    startYear: 1978,
    endYear: 1991,
    options: [
      ["peasant_household", "农户"],
      ["township_enterprise_family", "乡镇企业家庭"],
      ["worker_family", "工人家庭"],
      ["state_worker", "国企职工"],
      ["cadre_child", "干部子弟"],
      ["teacher_doctor", "教师 / 医生家庭"],
      ["getihu", "个体户"],
      ["first_rich", "先富家庭"],
      ["returned_overseas_family", "归侨 / 港澳台亲属"],
    ],
  },
  {
    startYear: 1992,
    endYear: 1999,
    options: [
      ["peasant_household", "农户"],
      ["township_enterprise_family", "乡镇企业家庭"],
      ["migrant_worker_family", "外出务工家庭"],
      ["worker_family", "工人家庭"],
      ["state_worker", "国企职工"],
      ["laid_off_worker_family", "下岗职工家庭"],
      ["cadre_child", "干部子弟"],
      ["teacher_doctor", "教师 / 医生家庭"],
      ["getihu", "个体户"],
      ["first_rich", "先富家庭"],
      ["returned_overseas_family", "归侨 / 港澳台亲属"],
    ],
  },
  {
    startYear: 2000,
    endYear: 2020,
    options: [
      ["rural_farming_household", "普通农户"],
      ["rural_left_behind", "留守农村家庭"],
      ["rural_business_family", "种养殖 / 小作坊家庭"],
      ["migrant_worker_family", "进城务工家庭"],
      ["urban_low_income", "城市低保 / 灵活就业家庭"],
      ["working", "普通工薪家庭"],
      ["state_system_family", "体制内家庭"],
      ["professional_family_modern", "专业人士家庭"],
      ["small_business_owner", "小老板家庭"],
      ["middle", "城市中产"],
      ["tech_new_money", "互联网 / 新经济家庭"],
      ["rich", "富裕家庭"],
      ["elite", "权贵 / 精英家庭"],
    ],
  },
];

export const hukouEras = [
  { startYear: 1958, endYear: 2020, options: hukouTypes },
];

export const familyClassMeta = {
  poor: { score: 1, tags: ["low_resource_family"] },
  working: { score: 3, tags: ["working_family"] },
  middle: { score: 5, tags: ["middle_class_family"] },
  rich: { score: 7, tags: ["wealthy_family"] },
  elite: { score: 9, tags: ["elite_family"] },
  landless_laborer: { score: 1, tags: ["landless_laborer_family", "low_resource_family"] },
  tenant: { score: 1, tags: ["tenant_family"] },
  poor_peasant: { score: 2, tags: ["poor_peasant_family"] },
  middle_peasant: { score: 3, tags: ["middle_peasant_family"] },
  smallholder: { score: 4, tags: ["smallholder_family"] },
  rich_peasant: { score: 6, tags: ["rich_peasant_family"] },
  craftsman: { score: 4, tags: ["craft_family"] },
  shop_clerk: { score: 3, tags: ["shop_clerk_family"] },
  merchant: { score: 6, tags: ["merchant_family"] },
  comprador_merchant: { score: 8, tags: ["comprador_family", "merchant_family"] },
  scholar_gentry: { score: 7, tags: ["scholar_gentry_family"] },
  landlord: { score: 8, tags: ["landlord_family"] },
  worker_family: { score: 4, tags: ["worker_family"] },
  state_worker: { score: 5, tags: ["state_worker_family", "worker_family"] },
  cadre_family: { score: 7, tags: ["cadre_family"] },
  soldier_family: { score: 5, tags: ["soldier_family"] },
  intellectual_family: { score: 5, tags: ["intellectual_family"] },
  small_trader_transformed: { score: 3, tags: ["small_trader_family"] },
  overseas_relation: { score: 4, tags: ["overseas_relation_family"] },
  rich_peasant_origin: { score: 2, tags: ["bad_class_origin", "rich_peasant_family"] },
  landlord_old: { score: 2, tags: ["bad_class_origin", "landlord_family"] },
  peasant_household: { score: 3, tags: ["peasant_household"] },
  township_enterprise_family: { score: 5, tags: ["township_enterprise_family"] },
  migrant_worker_family: { score: 2, tags: ["migrant_worker_family", "low_resource_family"] },
  laid_off_worker_family: { score: 2, tags: ["laid_off_worker_family"] },
  cadre_child: { score: 7, tags: ["cadre_child"] },
  teacher_doctor: { score: 6, tags: ["professional_family"] },
  getihu: { score: 5, tags: ["getihu_family"] },
  first_rich: { score: 8, tags: ["first_rich_family"] },
  returned_overseas_family: { score: 6, tags: ["returned_overseas_family"] },
  rural_farming_household: { score: 3, tags: ["peasant_household"] },
  rural_left_behind: { score: 2, tags: ["rural_left_behind_family", "low_resource_family"] },
  rural_business_family: { score: 5, tags: ["rural_business_family"] },
  urban_low_income: { score: 2, tags: ["urban_low_income_family", "low_resource_family"] },
  state_system_family: { score: 6, tags: ["state_system_family"] },
  professional_family_modern: { score: 6, tags: ["professional_family"] },
  small_business_owner: { score: 6, tags: ["small_business_family"] },
  tech_new_money: { score: 8, tags: ["tech_new_money_family", "wealthy_family"] },
};

export const familyClassAvailability = {
  landless_laborer: { hukou: ["rural"], cityTier: ["village", "town"] },
  tenant: { hukou: ["rural"], cityTier: ["village"] },
  poor_peasant: { hukou: ["rural"], cityTier: ["village", "town"] },
  middle_peasant: { hukou: ["rural"], cityTier: ["village", "town"] },
  smallholder: { hukou: ["rural"], cityTier: ["village", "town"] },
  rich_peasant: { hukou: ["rural"], cityTier: ["village", "town", "county"] },
  craftsman: { cityTier: ["town", "county", "city", "tier2", "tier1"] },
  shop_clerk: { cityTier: ["town", "county", "city", "tier2", "tier1"] },
  merchant: { cityTier: ["town", "county", "city", "tier2", "tier1"] },
  comprador_merchant: { cityTier: ["city", "tier2", "tier1"] },
  scholar_gentry: { cityTier: ["county", "city", "tier2", "tier1"] },
  landlord: { cityTier: ["village", "town", "county", "city", "tier2"] },

  worker_family: { cityTier: ["town", "county", "city", "tier2", "tier1"] },
  state_worker: { cityTier: ["town", "county", "city", "tier2", "tier1"] },
  cadre_family: { cityTier: ["county", "city", "tier2", "tier1"] },
  soldier_family: {},
  intellectual_family: { cityTier: ["county", "city", "tier2", "tier1"] },
  small_trader_transformed: { cityTier: ["town", "county", "city", "tier2", "tier1"] },
  overseas_relation: { cityTier: ["county", "city", "tier2", "tier1"] },
  rich_peasant_origin: { hukou: ["rural"], cityTier: ["village", "town"] },
  landlord_old: { hukou: ["rural"], cityTier: ["village", "town"] },

  peasant_household: { hukou: ["rural"], cityTier: ["village", "town"] },
  township_enterprise_family: { hukou: ["rural"], cityTier: ["town", "county"] },
  migrant_worker_family: { hukou: ["rural"], cityTier: ["village", "town", "county", "city"] },
  laid_off_worker_family: { cityTier: ["town", "county", "city", "tier2", "tier1"] },
  cadre_child: { cityTier: ["county", "city", "tier2", "tier1"] },
  teacher_doctor: { cityTier: ["town", "county", "city", "tier2", "tier1"] },
  getihu: { cityTier: ["town", "county", "city", "tier2", "tier1"] },
  first_rich: { cityTier: ["town", "county", "city", "tier2", "tier1"] },
  returned_overseas_family: { cityTier: ["county", "city", "tier2", "tier1"] },

  rural_farming_household: { hukou: ["rural"], cityTier: ["village", "town"] },
  rural_left_behind: { hukou: ["rural"], cityTier: ["village", "town"] },
  rural_business_family: { hukou: ["rural"], cityTier: ["village", "town", "county"] },
  urban_low_income: { cityTier: ["town", "county", "city", "tier2", "tier1"] },
  state_system_family: { cityTier: ["county", "city", "tier2", "tier1"] },
  professional_family_modern: { cityTier: ["county", "city", "tier2", "tier1"] },
  small_business_owner: { cityTier: ["town", "county", "city", "tier2", "tier1"] },
  tech_new_money: { cityTier: ["city", "tier2", "tier1"] },

  poor: { hukou: ["rural"], cityTier: ["village", "town", "county"] },
  working: { cityTier: ["town", "county", "city", "tier2", "tier1"] },
  middle: { cityTier: ["county", "city", "tier2", "tier1"] },
  rich: { cityTier: ["county", "city", "tier2", "tier1"] },
  elite: { cityTier: ["city", "tier2", "tier1"] },
};

export function getProvinceOptionsForYear(year) {
  const specialCurrentCodes = new Set();
  const historical = historicalProvinceAliases
    .filter((item) => inYearRange(year, item))
    .map((item) => {
      for (const code of getAliasCurrentCodes(item)) specialCurrentCodes.add(code);
      return [item.code, item.name, item.currentCode, item.note];
    });

  const current = provinces
    .filter(([code]) => code !== "other" && !specialCurrentCodes.has(code))
    .map(([code, name]) => [code, name, code, ""]);

  return [...current, ...historical, ["other", "其他", "other", ""]];
}

export function resolveHistoricalProvince(code, year, rng) {
  const options = getProvinceOptionsForYear(year);
  const option = options.find(([value]) => value === code) ?? options.find(([, , currentCode]) => currentCode === code);
  if (!option) {
    const alias = historicalProvinceAliases.find((item) => item.code === code)
      ?? historicalProvinceAliases.find((item) => inYearRange(year, item) && getAliasCurrentCodes(item).includes(code));
    if (alias) return resolveAlias(alias, rng);
    return { code: "other", name: provinceLabels.other, currentCode: "other", note: "" };
  }
  const alias = historicalProvinceAliases.find((item) => item.code === option[0]);
  if (alias) return resolveAlias(alias, rng);
  return { code: option[0], name: option[1], currentCode: option[2], note: option[3] };
}

export function getProvinceDisplayName(currentCode, historyCode, year) {
  const alias = historicalProvinceAliases.find((item) => item.code === historyCode);
  if (alias && getAliasCurrentCodes(alias).includes(currentCode) && inYearRange(year, alias)) return alias.name;
  return provinceLabels[currentCode] ?? currentCode;
}

export function getCityTierOptionsForYear(year) {
  return findEra(cityTierEras, year)?.options ?? cityTiers;
}

export function getFamilyClassOptionsForYear(year) {
  return findEra(familyClassEras, year)?.options ?? familyClasses;
}

export function getFamilyClassOptionsForContext(year, cityTier, hukou) {
  const effectiveHukou = getEffectiveHukou(year, cityTier, hukou);
  const options = getFamilyClassOptionsForYear(year);
  const filtered = options.filter(([code]) => isFamilyClassAvailable(code, cityTier, effectiveHukou));
  return filtered.length ? filtered : options;
}

export function getHukouOptionsForYear(year) {
  return findEra(hukouEras, year)?.options ?? [];
}

export function hasHukouChoiceForYear(year) {
  return getHukouOptionsForYear(year).length > 0;
}

export function getEffectiveHukou(year, cityTier, hukou) {
  if (hasHukouChoiceForYear(year)) return hukou;
  return ["village", "town"].includes(cityTier) ? "rural" : "urban";
}

export function getOptionLabel(options, code) {
  return options.find(([value]) => value === code)?.[1] ?? code;
}

function findEra(eras, year) {
  return eras.find((era) => inYearRange(year, era));
}

function inYearRange(year, item) {
  return year >= item.startYear && year <= item.endYear;
}

function isFamilyClassAvailable(code, cityTier, hukou) {
  const rule = familyClassAvailability[code];
  if (!rule) return true;
  if (rule.cityTier && !rule.cityTier.includes(cityTier)) return false;
  if (rule.hukou && !rule.hukou.includes(hukou)) return false;
  return true;
}

function resolveAlias(alias, rng) {
  const currentCode = pickWeightedCurrentCode(alias, rng);
  return { code: alias.code, name: alias.name, currentCode, note: alias.note };
}

function getAliasCurrentCodes(alias) {
  return alias.weightedCurrentCodes?.map((item) => item.code) ?? [alias.currentCode];
}

function pickWeightedCurrentCode(alias, rng) {
  const weights = alias.weightedCurrentCodes;
  if (!weights?.length || typeof rng !== "function") return alias.currentCode;
  const total = weights.reduce((sum, item) => sum + item.weight, 0);
  let roll = rng() * total;
  for (const item of weights) {
    roll -= item.weight;
    if (roll <= 0) return item.code;
  }
  return weights[weights.length - 1].code;
}
