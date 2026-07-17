import { coreLifecycleEvents } from "./events/core/lifecycle.js?v=birth-1840-story-1";
import { historyPre1949Events } from "./events/history/pre1949.js?v=birth-1840-story-1";
import { historyLateQingEvents } from "./events/history/late-qing.js?v=birth-1840-story-1";
import { historyEarlyPrcEvents } from "./events/history/early-prc.js?v=birth-1840-story-1";
import { historyReformEraEvents } from "./events/history/reform-era.js?v=birth-1840-story-1";
import { historyContemporaryEvents } from "./events/history/contemporary.js?v=birth-1840-story-1";
import { historyFutureEvents } from "./events/history/future.js?v=birth-1840-story-1";
import { dailyChildhoodEvents } from "./events/daily/childhood.js?v=birth-1840-story-1";
import { dailySchoolEvents } from "./events/daily/school.js?v=birth-1840-story-1";
import { dailyFamilyRelationshipsEvents } from "./events/daily/family-relationships.js?v=birth-1840-story-1";
import { dailyWorkWealthEvents } from "./events/daily/work-wealth.js?v=birth-1840-story-1";
import { dailyHealthAgingEvents } from "./events/daily/health-aging.js?v=birth-1840-story-1";

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
];
