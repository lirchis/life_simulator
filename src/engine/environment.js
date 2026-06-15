import { clamp } from "./path.js";

const CITY_BONUS = {
  village: 1,
  town: 2,
  county: 3,
  city: 5,
  tier2: 7,
  tier1: 9,
};

export function calculateEnvironment(state, aggregateRegistry) {
  const cityBonus = CITY_BONUS[state.location.currentCityTier] ?? 3;
  const province = state.location.currentProvince;
  const coastal = aggregateRegistry.includes("province.coastal", province);
  const internet = aggregateRegistry.includes("province.internet", province);
  const highPressureBirth = ["henan", "shandong", "jiangsu", "zhejiang"].includes(state.birth.province);
  const modern = state.meta.currentYear >= 2000 ? 1 : 0;

  return {
    educationPressure: clamp(3 + cityBonus + (highPressureBirth ? 2 : 0), 0, 10),
    jobOpportunity: clamp(cityBonus + (coastal ? 2 : 0) + modern, 0, 10),
    businessClimate: clamp(cityBonus + (internet ? 2 : 0), 0, 10),
    housingPressure: clamp(cityBonus + (state.location.currentCityTier === "tier1" ? 2 : 0), 0, 10),
    healthcareAccess: clamp(cityBonus + 1, 0, 10),
    migrationPull: clamp(cityBonus + (coastal ? 2 : 0), 0, 10),
  };
}
