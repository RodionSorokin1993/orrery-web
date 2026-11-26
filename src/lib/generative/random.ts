/** FNV-1a: turns any string into a 32-bit seed. */
export function hashString(input: string): number {
  let hash = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

export interface Rng {
  /** Float in [0, 1). */
  next(): number
  /** Float in [min, max). */
  range(min: number, max: number): number
  /** Integer in [min, max], inclusive. */
  int(min: number, max: number): number
  pick<T>(items: readonly T[]): T
}

/** Mulberry32: tiny, fast and good enough for art. Same seed, same sequence. */
export function createRng(seed: string | number): Rng {
  let state = typeof seed === 'number' ? seed >>> 0 : hashString(seed)

  const next = () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }

  return {
    next,
    range: (min, max) => min + next() * (max - min),
    int: (min, max) => Math.floor(min + next() * (max - min + 1)),
    pick: (items) => {
      const item = items[Math.floor(next() * items.length)]
      if (item === undefined) throw new Error('Cannot pick from an empty list')
      return item
    },
  }
}
