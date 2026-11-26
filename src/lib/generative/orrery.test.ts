import { describe, expect, it } from 'vitest'
import { generateOrrery, polar } from './orrery'
import { createRng, hashString } from './random'
import { orreryToSvg } from './svg'

describe('createRng (spec 004, AC1)', () => {
  it('is deterministic for a seed', () => {
    const a = createRng('orbit')
    const b = createRng('orbit')
    expect(Array.from({ length: 5 }, a.next)).toEqual(Array.from({ length: 5 }, b.next))
  })

  it('stays inside its ranges', () => {
    const rng = createRng(42)
    for (let i = 0; i < 1000; i++) {
      const value = rng.int(2, 5)
      expect(value).toBeGreaterThanOrEqual(2)
      expect(value).toBeLessThanOrEqual(5)
    }
  })

  it('hashes strings to unsigned 32-bit integers', () => {
    expect(hashString('a')).not.toBe(hashString('b'))
    expect(hashString('anything')).toBeGreaterThanOrEqual(0)
  })
})

describe('generateOrrery', () => {
  it('returns the same orrery for the same seed and a different one otherwise', () => {
    expect(generateOrrery('home')).toEqual(generateOrrery('home'))
    expect(generateOrrery('home')).not.toEqual(generateOrrery('models'))
  })

  it('keeps every body and moon inside the canvas (spec 004, AC2)', () => {
    for (const seed of ['home', 'models', 'about', 'a', 'zzz', '', 'introducing-apogee']) {
      const { size, center, rings } = generateOrrery(seed)
      for (const ring of rings) {
        for (const body of ring.bodies) {
          const [x, y] = polar(center, center, ring.radius, body.angle)
          expect(x - body.size).toBeGreaterThanOrEqual(0)
          expect(y - body.size).toBeGreaterThanOrEqual(0)
          expect(x + body.size).toBeLessThanOrEqual(size)
          expect(y + body.size).toBeLessThanOrEqual(size)
          if (body.moon) {
            const [mx, my] = polar(x, y, body.moon.distance, body.moon.angle)
            expect(Math.hypot(mx - center, my - center) + body.moon.size).toBeLessThanOrEqual(
              center,
            )
          }
        }
      }
    }
  })

  it('orders rings from the inside out with inner rings turning faster', () => {
    const { rings } = generateOrrery('models')
    for (let i = 1; i < rings.length; i++) {
      expect(rings[i]!.radius).toBeGreaterThan(rings[i - 1]!.radius)
      expect(rings[i]!.period).toBeGreaterThan(rings[i - 1]!.period)
    }
  })
})

describe('orreryToSvg', () => {
  it('renders a standalone SVG document', () => {
    const svg = orreryToSvg('home', {
      ring: '#999',
      sun: '#fc0',
      star: '#ccc',
      tones: { accent: '#00f', brass: '#fc0', ink: '#000' },
    })
    expect(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg"')).toBe(true)
    expect(svg).toContain('fill="#fc0"')
  })
})
