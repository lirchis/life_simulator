import { coreLifecycleEvents } from "./events/core/lifecycle.js?v=content-cycle-1";
import { earlyMortalityEvents } from "./events/core/early-mortality.js?v=continuity-1";
import { adultMortalityEvents } from "./events/core/adult-mortality.js?v=continuity-1";
import { narrativeArcEvents } from "./events/core/narrative-arcs.js?v=content-cycle-1";
import { structuralAgeArcEvents } from "./events/core/structural-age-arcs.js?v=content-cycle-1";
import { structuralChildhoodArcEvents } from "./events/core/structural-childhood-arcs.js?v=content-cycle-1";
import { structuralMidlifeArcEvents } from "./events/core/structural-midlife-arcs.js?v=content-cycle-1";
import { shadowPublicArcEvents } from "./events/core/shadow-public-arcs.js?v=shadow-1";
import { shadowPrivateArcEvents } from "./events/core/shadow-private-arcs.js?v=content-cycle-1";
import { shadowSurvivalArcEvents } from "./events/core/shadow-survival-arcs.js?v=shadow-1";
import { historyPre1949Events } from "./events/history/pre1949.js?v=content-cycle-1";
import { historyLateQingEvents } from "./events/history/late-qing.js?v=continuity-1";
import { expansionPre1949Events } from "./events/history/expansion-pre1949.js?v=continuity-1";
import { expansion1840DenseEvents } from "./events/history/expansion-1840-dense.js?v=continuity-1";
import { structuralPre1949ArcEvents } from "./events/history/structural-pre1949-arcs.js?v=content-cycle-1";
import { historyEarlyPrcEvents } from "./events/history/early-prc.js?v=content-cycle-1";
import { historyReformEraEvents } from "./events/history/reform-era.js?v=continuity-1";
import { historyContemporaryEvents } from "./events/history/contemporary.js?v=content-cycle-1";
import { historyFutureEvents } from "./events/history/future.js?v=content-cycle-1";
import { historyExpansionFuture2036Events } from "./events/history/expansion-future-2036.js?v=content-cycle-1";
import { speculativeHistoryEvents } from "./events/history/speculative-history.js?v=future-history-1";
import { structuralPost1978ArcEvents } from "./events/history/structural-post1978-arcs.js?v=content-cycle-1";
import { historyExpansionPost1949Events } from "./events/history/expansion-post1949.js?v=content-cycle-1";
import { dailyChildhoodEvents } from "./events/daily/childhood.js?v=content-cycle-1";
import { dailySchoolEvents } from "./events/daily/school.js?v=content-cycle-1";
import { dailyFamilyRelationshipsEvents } from "./events/daily/family-relationships.js?v=content-cycle-1";
import { dailyWorkWealthEvents } from "./events/daily/work-wealth.js?v=content-cycle-1";
import { dailyHealthAgingEvents } from "./events/daily/health-aging.js?v=content-cycle-1";
import { dailyEraTextureEvents } from "./events/daily/era-textures.js?v=content-cycle-1";
import { dailyContextMicroevents } from "./events/daily/context-microevents.js?v=content-cycle-1";

export const events = [
  ...coreLifecycleEvents,
  ...earlyMortalityEvents,
  ...adultMortalityEvents,
  ...narrativeArcEvents,
  ...structuralAgeArcEvents,
  ...structuralChildhoodArcEvents,
  ...structuralMidlifeArcEvents,
  ...shadowPublicArcEvents,
  ...shadowPrivateArcEvents,
  ...shadowSurvivalArcEvents,
  ...historyLateQingEvents,
  ...historyPre1949Events,
  ...expansionPre1949Events,
  ...expansion1840DenseEvents,
  ...structuralPre1949ArcEvents,
  ...historyEarlyPrcEvents,
  ...historyReformEraEvents,
  ...historyContemporaryEvents,
  ...historyFutureEvents,
  ...historyExpansionFuture2036Events,
  ...speculativeHistoryEvents,
  ...structuralPost1978ArcEvents,
  ...historyExpansionPost1949Events,
  ...dailyChildhoodEvents,
  ...dailySchoolEvents,
  ...dailyFamilyRelationshipsEvents,
  ...dailyWorkWealthEvents,
  ...dailyHealthAgingEvents,
  ...dailyEraTextureEvents,
  ...dailyContextMicroevents,
];
