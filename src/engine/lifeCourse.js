const ACTIVE_CAREER_STATUSES = new Set(["employed", "self_employed", "gig_worker", "family_labor", "entrepreneur"]);
const EDUCATION_LEVEL_ORDER = ["none", "primary", "middle", "middle_school", "high", "high_school", "vocational", "college", "university", "higher_education", "postgraduate"];

export function matchLifeCourse(event, state) {
  const transition = event.continuity?.education;
  if (transition?.action === "enroll") {
    if (state.education.status === "enrolled" && !transition.allowTransfer) return false;
    if (transition.mode === "full_time" && hasActiveCareer(state) && !transition.allowWhileEmployed) return false;
    if (!transition.allowLowerLevel && educationRank(transition.level) < educationRank(state.education.completedLevel)) return false;
  }

  if (startsActiveCareer(event, state) && isFullTimeStudent(state) && !event.continuity?.educationOnCareerStart) {
    return false;
  }

  const allowedActivities = event.continuity?.requiresPrimaryActivity;
  if (allowedActivities?.length && !allowedActivities.includes(state.lifeCourse.primaryActivity)) return false;
  return true;
}

export function applyEventLifeCourse(event, outcome, before, state) {
  const source = `${event.id}${outcome?.id ? `:${outcome.id}` : ""}`;
  const declaredEducation = outcome?.continuity?.education ?? event.continuity?.education;
  if (declaredEducation) applyEducationTransition(state, declaredEducation, source);

  const careerStarted = !hasActiveCareer(before) && hasActiveCareer(state);
  if (careerStarted && isFullTimeStudent(state)) {
    const resolution = outcome?.continuity?.educationOnCareerStart ?? event.continuity?.educationOnCareerStart;
    if (resolution) closeEducation(state, resolution, source);
  }

  updateCareerMetadata(before, state, source);
  updatePrimaryActivity(state);
}

export function applyNaturalLifeCourse(state) {
  if (state.education.status !== "enrolled") {
    updatePrimaryActivity(state);
    return;
  }

  const { age, currentYear } = state.meta;
  const current = state.education.currentLevel;
  if (current === "primary" && educationPeriodEnded(state, age >= 12)) {
    completeLevel(state, "primary");
    if (state.education.score >= 18) enroll(state, {
      level: "middle",
      track: "general",
      mode: "full_time",
      expectedEndYear: currentYear + 3,
    }, "natural:primary_to_middle");
    else closeEducation(state, "interrupted", "natural:left_after_primary");
  } else if (["middle", "middle_school"].includes(current) && educationPeriodEnded(state, age >= 15)) {
    completeLevel(state, "middle");
    if (state.education.score >= 32) enroll(state, {
      level: "high",
      track: "general",
      mode: "full_time",
      expectedEndYear: currentYear + 3,
    }, "natural:middle_to_high");
    else closeEducation(state, "completed", "natural:left_after_middle");
  } else if (["high", "high_school"].includes(current) && educationPeriodEnded(state, age >= 19)) {
    completeLevel(state, "high");
    closeEducation(state, "completed", "natural:finished_high_school");
  } else if (["college", "university", "higher_education"].includes(current)
    && state.education.expectedEndYear !== null
    && currentYear >= state.education.expectedEndYear) {
    completeLevel(state, current);
    closeEducation(state, "completed", "natural:graduated_higher_education");
  } else if (current === "vocational"
    && state.education.expectedEndYear !== null
    && currentYear >= state.education.expectedEndYear) {
    completeLevel(state, "vocational");
    closeEducation(state, "completed", "natural:graduated_vocational");
  }
  updatePrimaryActivity(state);
}

function educationPeriodEnded(state, fallback) {
  return state.education.expectedEndYear === null
    ? fallback
    : state.meta.currentYear >= state.education.expectedEndYear;
}

export function normalizeLifeCourse(state) {
  state.education.status ??= state.education.level === "none" ? "not_started" : "completed";
  state.education.currentLevel ??= "none";
  state.education.completedLevel ??= "none";
  state.education.track ??= "none";
  state.education.mode ??= "none";
  state.education.startedYear ??= null;
  state.education.expectedEndYear ??= null;
  state.education.endedYear ??= null;
  state.education.interruptions ??= 0;
  state.education.concurrentCareer ??= false;
  state.career.startedYear ??= null;
  state.career.statusSinceYear ??= null;
  state.career.jobsHeld ??= 0;
  state.lifeCourse ??= { primaryActivity: "dependent", transitions: [] };
  state.lifeCourse.transitions ??= [];
  syncStudentTag(state);
  updatePrimaryActivity(state);
}

export function hasActiveCareer(state) {
  return ACTIVE_CAREER_STATUSES.has(state.career.status);
}

export function isFullTimeStudent(state) {
  return state.education.status === "enrolled" && state.education.mode === "full_time";
}

export function educationRank(level) {
  const rank = EDUCATION_LEVEL_ORDER.indexOf(level ?? "none");
  return rank < 0 ? 0 : rank;
}

function applyEducationTransition(state, transition, source) {
  if (transition.action === "enroll") {
    enroll(state, transition, source);
    return;
  }
  if (transition.action === "complete") {
    completeLevel(state, transition.level ?? state.education.currentLevel);
    closeEducation(state, "completed", source);
    return;
  }
  if (transition.action === "interrupt") closeEducation(state, "interrupted", source);
}

function enroll(state, transition, source) {
  const before = educationDescriptor(state);
  if (transition.completeCurrentOnEnroll && state.education.status === "enrolled") {
    completeLevel(state, state.education.currentLevel);
  }
  const expectedEndYear = transition.expectedEndYear
    ?? (transition.durationYears ? state.meta.currentYear + transition.durationYears : null);
  state.education.status = "enrolled";
  state.education.currentLevel = transition.level;
  state.education.level = transition.level;
  state.education.track = transition.track ?? "general";
  state.education.mode = transition.mode ?? "full_time";
  state.education.startedYear = state.meta.currentYear;
  state.education.expectedEndYear = expectedEndYear;
  state.education.endedYear = null;
  state.education.concurrentCareer = Boolean(transition.allowWhileEmployed);
  recordTransition(state, "education", before, educationDescriptor(state), source);
  syncStudentTag(state);
}

function closeEducation(state, status, source) {
  if (state.education.status !== "enrolled") return;
  const before = educationDescriptor(state);
  if (status === "interrupted") state.education.interruptions += 1;
  state.education.status = status;
  state.education.currentLevel = "none";
  state.education.mode = "none";
  state.education.endedYear = state.meta.currentYear;
  state.education.expectedEndYear = null;
  state.education.concurrentCareer = false;
  recordTransition(state, "education", before, educationDescriptor(state), source);
  syncStudentTag(state);
}

function completeLevel(state, level) {
  if (educationRank(level) >= educationRank(state.education.completedLevel)) state.education.completedLevel = level;
}

function updateCareerMetadata(before, state, source) {
  const changed = before.career.status !== state.career.status || before.career.field !== state.career.field;
  if (!changed) return;
  if (!hasActiveCareer(before) && hasActiveCareer(state)) {
    state.career.startedYear ??= state.meta.currentYear;
    state.career.jobsHeld += 1;
  } else if (hasActiveCareer(before) && hasActiveCareer(state) && before.career.field !== state.career.field) {
    state.career.jobsHeld += 1;
  }
  if (before.career.status !== state.career.status) state.career.statusSinceYear = state.meta.currentYear;
  recordTransition(state, "career", careerDescriptor(before), careerDescriptor(state), source);
}

function startsActiveCareer(event, state) {
  if (hasActiveCareer(state)) return false;
  const effects = [
    ...(event.effects ?? []),
    ...(event.outcomes ?? []).flatMap((outcome) => outcome.effects ?? []),
  ];
  return effects.some((effect) => effect.path === "career.status" && Object.hasOwn(effect, "set") && ACTIVE_CAREER_STATUSES.has(effect.set));
}

function updatePrimaryActivity(state) {
  if (!state.meta.isAlive) state.lifeCourse.primaryActivity = "deceased";
  else if (isFullTimeStudent(state)) state.lifeCourse.primaryActivity = "student";
  else if (hasActiveCareer(state)) state.lifeCourse.primaryActivity = state.career.status;
  else if (state.career.status === "retired") state.lifeCourse.primaryActivity = "retired";
  else if (["unemployed", "laid_off"].includes(state.career.status)) state.lifeCourse.primaryActivity = "unemployed";
  else if (state.meta.age < 6) state.lifeCourse.primaryActivity = "dependent";
  else state.lifeCourse.primaryActivity = "non_employed";
}

function syncStudentTag(state) {
  if (state.education.status === "enrolled") {
    if (!state.tags.includes("student")) state.tags.push("student");
  } else {
    state.tags = state.tags.filter((tag) => tag !== "student");
  }
}

function recordTransition(state, domain, from, to, source) {
  if (JSON.stringify(from) === JSON.stringify(to)) return;
  state.lifeCourse.transitions.push({
    year: state.meta.currentYear,
    age: state.meta.age,
    domain,
    from,
    to,
    source,
  });
}

function educationDescriptor(state) {
  return {
    status: state.education.status,
    level: state.education.currentLevel,
    completedLevel: state.education.completedLevel,
    track: state.education.track,
    mode: state.education.mode,
  };
}

function careerDescriptor(state) {
  return { status: state.career.status, field: state.career.field };
}
