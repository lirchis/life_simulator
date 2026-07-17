import { coreLifecycleEvents } from "./events/core/lifecycle.js?v=deep-literature-2";
import { historyPre1949Events } from "./events/history/pre1949.js?v=deep-literature-2";
import { historyLateQingEvents } from "./events/history/late-qing.js?v=deep-literature-2";
import { historyEarlyPrcEvents } from "./events/history/early-prc.js?v=deep-literature-2";
import { historyReformEraEvents } from "./events/history/reform-era.js?v=deep-literature-2";
import { historyContemporaryEvents } from "./events/history/contemporary.js?v=deep-literature-2";
import { historyFutureEvents } from "./events/history/future.js?v=deep-literature-2";
import { dailyChildhoodEvents } from "./events/daily/childhood.js?v=deep-literature-2";
import { dailySchoolEvents } from "./events/daily/school.js?v=deep-literature-2";
import { dailyFamilyRelationshipsEvents } from "./events/daily/family-relationships.js?v=deep-literature-2";
import { dailyWorkWealthEvents } from "./events/daily/work-wealth.js?v=deep-literature-2";
import { dailyHealthAgingEvents } from "./events/daily/health-aging.js?v=deep-literature-2";
import { dailyEraTextureEvents } from "./events/daily/era-textures.js?v=deep-literature-2";

export const events = [
  ...coreLifecycleEvents,
  ...historyLateQingEvents,
  ...historyPre1949Events,
  ...historyEarlyPrcEvents,
  ...historyReformEraEvents,
  ...historyContemporaryEvents,
  ...historyFutureEvents,
  ...dailyChildhoodEvents,
  ...dailySchoolEvents,
  ...dailyFamilyRelationshipsEvents,
  ...dailyWorkWealthEvents,
  ...dailyHealthAgingEvents,
  ...dailyEraTextureEvents,
];
