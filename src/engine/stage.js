export function getLifeStage(age) {
  if (age <= 3) return "baby";
  if (age <= 6) return "child";
  if (age <= 18) return "student";
  if (age <= 35) return "young_adult";
  if (age <= 59) return "middle_age";
  return "old_age";
}

export function getEventCount() {
  return 1;
}
