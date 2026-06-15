export function getLifeStage(age) {
  if (age <= 3) return "baby";
  if (age <= 6) return "child";
  if (age <= 18) return "student";
  if (age <= 35) return "young_adult";
  if (age <= 59) return "middle_age";
  return "old_age";
}

export function getEventCount(age, rng) {
  if (age <= 6) return 1;
  if (age <= 18) return rng() < 0.65 ? 1 : 2;
  if (age <= 59) return rng() < 0.5 ? 2 : 3;
  return rng() < 0.75 ? 1 : 2;
}
