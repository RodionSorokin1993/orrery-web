import { describe, expect, it } from 'vitest'
import {
  extent,
  linePath,
  linearScale,
  logScale,
  nearestIndex,
  niceDomain,
  niceTicks,
} from './scales'

describe('linearScale (spec 003, AC1)', () => {
  const scale = linearScale([0, 100], [0, 500])

  it('maps domain to range and back', () => {
    expect(scale(50)).toBe(250)
    expect(scale.invert(250)).toBe(50)
  })

  it('supports inverted ranges, like SVG y axes', () => {
    const y = linearScale([0, 1], [300, 0])
    expect(y(0)).toBe(300)
    expect(y(1)).toBe(0)
  })
})

describe('logScale', () => {
  const scale = logScale([1000, 64000], [0, 600])

  it('spaces doublings evenly', () => {
    const step = scale(2000) - scale(1000)
    expect(scale(4000) - scale(2000)).toBeCloseTo(step)
    expect(scale(64000)).toBeCloseTo(600)
  })

  it('ticks at powers of two inside the domain', () => {
    expect(scale.ticks(10)).toEqual([1024, 2048, 4096, 8192, 16384, 32768])
  })

  it('rejects non-positive domains', () => {
    expect(() => logScale([0, 10], [0, 1])).toThrow(RangeError)
  })
})

describe('nice ticks', () => {
  it('uses 1, 2 or 5 times a power of ten', () => {
    expect(niceTicks(0, 10, 5)).toEqual([0, 2, 4, 6, 8, 10])
    expect(niceTicks(0.44, 0.875, 5)).toEqual([0.5, 0.6, 0.7, 0.8])
  })

  it('expands a domain outward to round numbers', () => {
    expect(niceDomain(0.44, 0.875, 5)).toEqual({
      domain: [0.4, 0.9],
      ticks: [0.4, 0.5, 0.6, 0.7, 0.8, 0.9],
    })
  })

  it('pads a flat domain so a line can still be drawn', () => {
    const { domain } = niceDomain(5, 5)
    expect(domain[0]).toBeLessThan(5)
    expect(domain[1]).toBeGreaterThan(5)
  })
})

describe('helpers', () => {
  it('finds the extent of values', () => {
    expect(extent([3, -1, 8])).toEqual([-1, 8])
  })

  it('finds the nearest index in a sorted list', () => {
    const positions = [0, 100, 200, 300]
    expect(nearestIndex(positions, 140)).toBe(1)
    expect(nearestIndex(positions, 160)).toBe(2)
    expect(nearestIndex(positions, -50)).toBe(0)
    expect(nearestIndex(positions, 999)).toBe(3)
    expect(nearestIndex([], 1)).toBe(-1)
  })

  it('builds an SVG path', () => {
    expect(
      linePath([
        [0, 0],
        [10.04, 20.06],
      ]),
    ).toBe('M0,0L10,20.1')
  })
})
