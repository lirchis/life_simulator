import { coreLifecycleEvents } from "./events/core/lifecycle.js";
import { historyPre1949Events } from "./events/history/pre1949.js";
import { historyEarlyPrcEvents } from "./events/history/early-prc.js";
import { historyReformEraEvents } from "./events/history/reform-era.js";
import { historyContemporaryEvents } from "./events/history/contemporary.js";
import { historyFutureEvents } from "./events/history/future.js";
import { dailyChildhoodEvents } from "./events/daily/childhood.js";
import { dailySchoolEvents } from "./events/daily/school.js";
import { dailyFamilyRelationshipsEvents } from "./events/daily/family-relationships.js";
import { dailyWorkWealthEvents } from "./events/daily/work-wealth.js";
import { dailyHealthAgingEvents } from "./events/daily/health-aging.js";

export const events = [
  ...coreLifecycleEvents,
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
];
