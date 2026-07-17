import { aggregates } from "./aggregates.js";
import { birthYearRange } from "./config.js?v=library-qa-1";
import { events } from "./events.js?v=library-qa-1";
import {
  cityTierEras,
  familyClassEras,
  familyClassMeta,
  getFamilyClassOptionsForContext,
  getFamilyAttrRange,
  getCityTierOptionsForYear,
  getEffectiveHukou,
  getFamilyClassOptionsForYear,
  getHukouOptionsForYear,
  getOptionLabel,
  getProvinceDisplayName,
  getProvinceOptionsForYear,
  historicalProvinceAliases,
  hasHukouChoiceForYear,
  hukouEras,
  resolveHistoricalProvince,
} from "./history.js?v=library-qa-1";
import { familyClasses, cityTiers, genderTypes, hukouTypes, provinces } from "./regions.js";
import { tagLabels } from "./tagLabels.js?v=library-qa-1";
import { getTalentBudgetForYear, getTalentCost, getTalentEraName, getTalentsForYear, talentBudgetEras, talents } from "./talents.js?v=library-qa-1";
import { historicalLives } from "./historicalLives/index.js?v=library-qa-1";

export const data = {
  aggregates,
  birthYearRange,
  events,
  familyClasses,
  familyClassEras,
  familyClassMeta,
  getFamilyClassOptionsForContext,
  getFamilyAttrRange,
  getCityTierOptionsForYear,
  getEffectiveHukou,
  getFamilyClassOptionsForYear,
  getHukouOptionsForYear,
  getOptionLabel,
  getProvinceDisplayName,
  getProvinceOptionsForYear,
  historicalProvinceAliases,
  hasHukouChoiceForYear,
  hukouEras,
  cityTiers,
  hukouTypes,
  genderTypes,
  provinces,
  cityTierEras,
  resolveHistoricalProvince,
  tagLabels,
  getTalentBudgetForYear,
  getTalentCost,
  getTalentEraName,
  getTalentsForYear,
  talentBudgetEras,
  talents,
  historicalLives,
};
