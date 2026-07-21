import { coreLifecycleEvents } from "./events/core/lifecycle.js?v=future-history-3";
import { earlyMortalityEvents } from "./events/core/early-mortality.js?v=continuity-1";
import { adultMortalityEvents } from "./events/core/adult-mortality.js?v=continuity-1";
import { narrativeArcEvents } from "./events/core/narrative-arcs.js?v=future-history-3";
import { structuralAgeArcEvents } from "./events/core/structural-age-arcs.js?v=future-history-3";
import { structuralChildhoodArcEvents } from "./events/core/structural-childhood-arcs.js?v=content-cycle-1";
import { structuralMidlifeArcEvents } from "./events/core/structural-midlife-arcs.js?v=future-history-3";
import { shadowPublicArcEvents } from "./events/core/shadow-public-arcs.js?v=future-history-3";
import { shadowPrivateArcEvents } from "./events/core/shadow-private-arcs.js?v=future-history-3";
import { shadowSurvivalArcEvents } from "./events/core/shadow-survival-arcs.js?v=future-history-3";
import { dramaticLifeArcEvents } from "./events/core/dramatic-life-arcs.js?v=future-history-3";
import { historyPre1949Events } from "./events/history/pre1949.js?v=future-history-3";
import { historyLateQingEvents } from "./events/history/late-qing.js?v=future-history-3";
import { expansionPre1949Events } from "./events/history/expansion-pre1949.js?v=future-history-3";
import { expansion1840DenseEvents } from "./events/history/expansion-1840-dense.js?v=future-history-3";
import { structuralPre1949ArcEvents } from "./events/history/structural-pre1949-arcs.js?v=content-cycle-1";
import { structuralPre1949DarkArcEvents } from "./events/history/structural-pre1949-dark-arcs.js?v=future-history-3";
import { historyEarlyPrcEvents } from "./events/history/early-prc.js?v=future-history-3";
import { historyReformEraEvents } from "./events/history/reform-era.js?v=future-history-3";
import { historyContemporaryEvents } from "./events/history/contemporary.js?v=future-history-3";
import { historyFutureEvents } from "./events/history/future.js?v=content-cycle-1";
import { historyExpansionFuture2036Events } from "./events/history/expansion-future-2036.js?v=content-cycle-1";
import { speculativeHistoryEvents } from "./events/history/speculative-history.js?v=future-history-3";
import { structuralPost1978ArcEvents } from "./events/history/structural-post1978-arcs.js?v=future-history-3";
import { systemicShadowPost1978ArcEvents } from "./events/history/systemic-shadow-post1978-arcs.js?v=future-history-3";
import { midcenturyShadowArcEvents } from "./events/history/midcentury-shadow-arcs.js?v=future-history-3";
import { republicanElderStructuralEvents } from "./events/history/republican-elder-structural.js?v=future-history-3";
import { historyExpansionPost1949Events } from "./events/history/expansion-post1949.js?v=future-history-3";
import { dailyChildhoodEvents } from "./events/daily/childhood.js?v=future-history-3";
import { dailySchoolEvents } from "./events/daily/school.js?v=future-history-3";
import { dailyFamilyRelationshipsEvents } from "./events/daily/family-relationships.js?v=future-history-3";
import { dailyWorkWealthEvents } from "./events/daily/work-wealth.js?v=future-history-3";
import { dailyHealthAgingEvents } from "./events/daily/health-aging.js?v=future-history-3";
import { dailyEraTextureEvents } from "./events/daily/era-textures.js?v=future-history-3";
import { dailyContextMicroevents } from "./events/daily/context-microevents.js?v=future-history-3";

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
  ...dramaticLifeArcEvents,
  ...historyLateQingEvents,
  ...historyPre1949Events,
  ...expansionPre1949Events,
  ...expansion1840DenseEvents,
  ...structuralPre1949ArcEvents,
  ...structuralPre1949DarkArcEvents,
  ...historyEarlyPrcEvents,
  ...historyReformEraEvents,
  ...historyContemporaryEvents,
  ...historyFutureEvents,
  ...historyExpansionFuture2036Events,
  ...speculativeHistoryEvents,
  ...structuralPost1978ArcEvents,
  ...systemicShadowPost1978ArcEvents,
  ...midcenturyShadowArcEvents,
  ...republicanElderStructuralEvents,
  ...historyExpansionPost1949Events,
  ...dailyChildhoodEvents,
  ...dailySchoolEvents,
  ...dailyFamilyRelationshipsEvents,
  ...dailyWorkWealthEvents,
  ...dailyHealthAgingEvents,
  ...dailyEraTextureEvents,
  ...dailyContextMicroevents,
];
