import { coreLifecycleEvents } from "./events/core/lifecycle.js?v=library-qa-1";
import { earlyMortalityEvents } from "./events/core/early-mortality.js?v=library-qa-1";
import { adultMortalityEvents } from "./events/core/adult-mortality.js?v=library-qa-1";
import { historyPre1949Events } from "./events/history/pre1949.js?v=library-qa-1";
import { historyLateQingEvents } from "./events/history/late-qing.js?v=library-qa-1";
import { expansionPre1949Events } from "./events/history/expansion-pre1949.js?v=library-qa-1";
import { expansion1840DenseEvents } from "./events/history/expansion-1840-dense.js?v=library-qa-1";
import { historyEarlyPrcEvents } from "./events/history/early-prc.js?v=library-qa-1";
import { historyReformEraEvents } from "./events/history/reform-era.js?v=library-qa-1";
import { historyContemporaryEvents } from "./events/history/contemporary.js?v=library-qa-1";
import { historyFutureEvents } from "./events/history/future.js?v=library-qa-1";
import { historyExpansionFuture2036Events } from "./events/history/expansion-future-2036.js?v=library-qa-1";
import { historyExpansionPost1949Events } from "./events/history/expansion-post1949.js?v=library-qa-1";
import { dailyChildhoodEvents } from "./events/daily/childhood.js?v=library-qa-1";
import { dailySchoolEvents } from "./events/daily/school.js?v=library-qa-1";
import { dailyFamilyRelationshipsEvents } from "./events/daily/family-relationships.js?v=library-qa-1";
import { dailyWorkWealthEvents } from "./events/daily/work-wealth.js?v=library-qa-1";
import { dailyHealthAgingEvents } from "./events/daily/health-aging.js?v=library-qa-1";
import { dailyEraTextureEvents } from "./events/daily/era-textures.js?v=library-qa-1";
import { dailyContextMicroevents } from "./events/daily/context-microevents.js?v=library-qa-1";

export const events = [
  ...coreLifecycleEvents,
  ...earlyMortalityEvents,
  ...adultMortalityEvents,
  ...historyLateQingEvents,
  ...historyPre1949Events,
  ...expansionPre1949Events,
  ...expansion1840DenseEvents,
  ...historyEarlyPrcEvents,
  ...historyReformEraEvents,
  ...historyContemporaryEvents,
  ...historyFutureEvents,
  ...historyExpansionFuture2036Events,
  ...historyExpansionPost1949Events,
  ...dailyChildhoodEvents,
  ...dailySchoolEvents,
  ...dailyFamilyRelationshipsEvents,
  ...dailyWorkWealthEvents,
  ...dailyHealthAgingEvents,
  ...dailyEraTextureEvents,
  ...dailyContextMicroevents,
];
