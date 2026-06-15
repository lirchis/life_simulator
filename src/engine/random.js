export function createRng(seed) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return function next() {
    h += h << 13;
    h ^= h >>> 7;
    h += h << 3;
    h ^= h >>> 17;
    h += h << 5;
    return ((h >>> 0) % 1000000) / 1000000;
  };
}

export function randomSeed() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export function pick(items, rng) {
  return items[Math.floor(rng() * items.length)];
}

export function weightedPick(items, getWeight, rng) {
  const weighted = items
    .map((item) => ({ item, weight: Math.max(0, getWeight(item)) }))
    .filter(({ weight }) => weight > 0);
  if (!weighted.length) return null;

  const total = weighted.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = rng() * total;
  for (const entry of weighted) {
    roll -= entry.weight;
    if (roll <= 0) return entry.item;
  }
  return weighted[weighted.length - 1].item;
}
