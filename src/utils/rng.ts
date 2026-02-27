import seedrandom from 'seedrandom';

type PRNG = seedrandom.PRNG;

// IMPORTANT: seedrandom() without a seed will try to use Node's `crypto.randomBytes`,
// which is not available in the browser build (Vite externalizes `crypto`).
// Always provide a seed string to keep it browser-safe.
let defaultRng: PRNG = seedrandom(String(Date.now()));

export const setSeed = (seed: string) => {
  defaultRng = seedrandom(seed);
};

export const uniform = (rng: PRNG = defaultRng) => rng.quick();

export const uniformInt = (maxExclusive: number, rng: PRNG = defaultRng) =>
  Math.floor(rng.quick() * maxExclusive);

export const choice = <T>(items: T[], rng: PRNG = defaultRng): T => {
  if (!items.length) {
    throw new Error('Cannot choose from an empty array');
  }
  return items[uniformInt(items.length, rng)];
};

export const choiceWeighted = <T>(items: T[], weights: number[], rng: PRNG = defaultRng): T => {
  if (!items.length) {
    throw new Error('Cannot choose from an empty array');
  }
  if (items.length !== weights.length) {
    throw new Error('items and weights must have the same length');
  }
  const normalized = weights.map((w) => (Number.isFinite(w) ? Math.max(0, w) : 0));
  const total = normalized.reduce((sum, w) => sum + w, 0);
  if (total <= 0) {
    // fallback to uniform
    return choice(items, rng);
  }
  const pick = uniform(rng) * total;
  let acc = 0;
  for (let i = 0; i < items.length; i += 1) {
    acc += normalized[i];
    if (pick <= acc) {
      return items[i];
    }
  }
  return items[items.length - 1];
};

export const getDefaultRng = () => defaultRng;
