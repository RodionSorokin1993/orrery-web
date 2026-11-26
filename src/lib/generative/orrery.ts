import { createRng } from './random'

export type BodyTone = 'accent' | 'brass' | 'ink'

export interface OrreryRing {
  radius: number
  /** Seconds per full turn. Inner rings are faster, like real orbits. */
  period: number
  /** Turn direction: 1 clockwise, -1 counter-clockwise. */
  direction: 1 | -1
  dashed: boolean
  bodies: OrreryBody[]
}

export interface OrreryBody {
  /** Angle on the ring, in degrees. */
  angle: number
  size: number
  tone: BodyTone
  /** A thin ring around the body, like Saturn. */
  hasRing: boolean
  moon?: { distance: number; size: number; angle: number }
}

export interface Orrery {
  size: number
  center: number
  sunRadius: number
  rings: OrreryRing[]
  /** Small background stars, as [x, y, radius]. */
  stars: [number, number, number][]
}

export interface OrreryOptions {
  size?: number
  minRings?: number
  maxRings?: number
  stars?: number
}

const TONES: readonly BodyTone[] = ['accent', 'brass', 'ink']

/**
 * Builds a deterministic orrery description from a seed. Pure data: rendering lives in
 * `OrreryArt` (SVG for the page) and `orreryToSvg` (string for Open Graph images).
 */
export function generateOrrery(seed: string, options: OrreryOptions = {}): Orrery {
  const { size = 600, minRings = 4, maxRings = 6, stars = 36 } = options
  const rng = createRng(seed || 'orrery')
  const center = size / 2
  const sunRadius = size * rng.range(0.035, 0.05)
  const ringCount = rng.int(minRings, maxRings)
  const innerRadius = sunRadius * 2.4
  const outerRadius = size * 0.46
  const gap = (outerRadius - innerRadius) / Math.max(1, ringCount - 1)

  const rings: OrreryRing[] = []
  for (let i = 0; i < ringCount; i++) {
    const radius = Math.min(outerRadius, innerRadius + gap * i + rng.range(-gap * 0.12, gap * 0.12))
    const bodyCount = i === 0 ? 1 : rng.int(1, i > 3 ? 2 : 1)
    const bodies: OrreryBody[] = []

    for (let b = 0; b < bodyCount; b++) {
      const bodySize = size * rng.range(0.01, 0.015 + i * 0.004)
      // Keep the whole body, its ring and its moon inside the canvas.
      const maxMoonDistance = Math.max(0, center - radius - bodySize * 2)
      const hasMoon = i > 1 && rng.next() > 0.6 && maxMoonDistance > bodySize * 2
      bodies.push({
        angle: rng.range(0, 360),
        size: bodySize,
        tone: rng.pick(TONES),
        hasRing: i > 2 && rng.next() > 0.7,
        moon: hasMoon
          ? {
              distance: Math.min(bodySize * rng.range(2, 3), maxMoonDistance),
              size: bodySize * rng.range(0.25, 0.4),
              angle: rng.range(0, 360),
            }
          : undefined,
      })
    }

    rings.push({
      radius,
      period: Math.round(60 + i * 35 + rng.range(0, 30)),
      direction: rng.next() > 0.25 ? 1 : -1,
      dashed: rng.next() > 0.65,
      bodies,
    })
  }

  const starList: [number, number, number][] = Array.from({ length: stars }, () => [
    rng.range(0, size),
    rng.range(0, size),
    rng.range(0.4, 1.3),
  ])

  return { size, center, sunRadius, rings, stars: starList }
}

/** Cartesian position of a point on a circle around (cx, cy), with 0 degrees at 12 o'clock. */
export function polar(cx: number, cy: number, radius: number, angleDeg: number): [number, number] {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return [cx + radius * Math.cos(rad), cy + radius * Math.sin(rad)]
}
