export type Domain = readonly [number, number]
export type Range = readonly [number, number]

export interface Scale {
  (value: number): number
  invert(position: number): number
  ticks(count?: number): number[]
  domain: Domain
  range: Range
}

/** The smallest step of 1, 2 or 5 times a power of ten that splits the range into at most `count` parts. */
export function niceStep(min: number, max: number, count = 5): number {
  const rawStep = Math.abs(max - min) / Math.max(1, count)
  if (rawStep === 0 || !Number.isFinite(rawStep)) return 0
  const magnitude = 10 ** Math.floor(Math.log10(rawStep))
  const residual = rawStep / magnitude
  const nice = residual <= 1 ? 1 : residual <= 2 ? 2 : residual <= 5 ? 5 : 10
  return nice * magnitude
}

const clean = (value: number) => Number(value.toPrecision(12))

function ticksForStep(lo: number, hi: number, step: number): number[] {
  const ticks: number[] = []
  const first = Math.ceil(lo / step - 1e-9)
  const last = Math.floor(hi / step + 1e-9)
  for (let i = first; i <= last; i++) ticks.push(clean(i * step))
  return ticks
}

/** Ticks at 1, 2 or 5 times a power of ten, the steps people read most easily. */
export function niceTicks(min: number, max: number, count = 5): number[] {
  if (!Number.isFinite(min) || !Number.isFinite(max)) return []
  if (min === max) return [min]
  const [lo, hi] = min < max ? [min, max] : [max, min]
  return ticksForStep(lo, hi, niceStep(lo, hi, count))
}

/** Expands [min, max] outward to round numbers and returns the ticks for that domain. */
export function niceDomain(
  min: number,
  max: number,
  count = 5,
): { domain: Domain; ticks: number[] } {
  if (min === max) {
    const pad = Math.abs(min) || 1
    return niceDomain(min - pad, max + pad, count)
  }
  const [lo, hi] = min < max ? [min, max] : [max, min]
  const step = niceStep(lo, hi, count)
  const niceLo = clean(Math.floor(lo / step + 1e-9) * step)
  const niceHi = clean(Math.ceil(hi / step - 1e-9) * step)
  return { domain: [niceLo, niceHi], ticks: ticksForStep(niceLo, niceHi, step) }
}

export function linearScale(domain: Domain, range: Range): Scale {
  const [d0, d1] = domain
  const [r0, r1] = range
  const span = d1 - d0 || 1

  const scale = ((value: number) => r0 + ((value - d0) / span) * (r1 - r0)) as Scale
  scale.invert = (position) => d0 + ((position - r0) / (r1 - r0 || 1)) * span
  scale.ticks = (count = 5) => niceTicks(d0, d1, count)
  scale.domain = domain
  scale.range = range
  return scale
}

/** Log scale for values that grow by multiples, like token budgets. Ticks are powers of `base`. */
export function logScale(domain: Domain, range: Range, base = 2): Scale {
  const [d0, d1] = domain
  if (d0 <= 0 || d1 <= 0) throw new RangeError('Log scale domain must be positive')

  const log = (v: number) => Math.log(v) / Math.log(base)
  const inner = linearScale([log(d0), log(d1)], range)

  const scale = ((value: number) => inner(log(value))) as Scale
  scale.invert = (position) => base ** inner.invert(position)
  scale.ticks = (count = 6) => {
    const first = Math.ceil(log(d0))
    const last = Math.floor(log(d1))
    const all: number[] = []
    for (let exponent = first; exponent <= last; exponent++) all.push(base ** exponent)
    // Thin out evenly when there are more powers than room.
    const stride = Math.max(1, Math.ceil(all.length / count))
    return all.filter((_, i) => i % stride === 0)
  }
  scale.domain = domain
  scale.range = range
  return scale
}

export function extent(values: readonly number[]): Domain {
  let min = Infinity
  let max = -Infinity
  for (const value of values) {
    if (value < min) min = value
    if (value > max) max = value
  }
  return [min, max]
}

/** Index of the value closest to `target` in a sorted array (binary search). */
export function nearestIndex(sorted: readonly number[], target: number): number {
  if (sorted.length === 0) return -1
  let lo = 0
  let hi = sorted.length - 1
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1
    if ((sorted[mid] ?? 0) < target) lo = mid
    else hi = mid
  }
  const low = sorted[lo] ?? 0
  const high = sorted[hi] ?? 0
  return Math.abs(target - low) <= Math.abs(high - target) ? lo : hi
}

/** SVG path for a polyline through the given points. */
export function linePath(points: readonly (readonly [number, number])[]): string {
  return points
    .map(
      ([x, y], i) => `${i === 0 ? 'M' : 'L'}${Math.round(x * 10) / 10},${Math.round(y * 10) / 10}`,
    )
    .join('')
}
