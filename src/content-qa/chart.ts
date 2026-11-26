import type { ChartSpec } from '../content/types'

/**
 * Shape checks for chart data, shared by the Studio field validation and the Content QA rules.
 * Returns human-readable problems; an empty list means the chart can be drawn.
 */
export function validateChartSpec(spec: Partial<ChartSpec> | undefined): string[] {
  const problems: string[] = []
  const series = spec?.series ?? []

  if (series.length === 0) return ['Add at least one series.']
  if (series.length > 4) problems.push('Use at most four series; more lines are hard to read.')

  const keys = new Set<string>()
  series.forEach((item, index) => {
    const name = item.label || `Series ${index + 1}`
    if (!item.key) problems.push(`${name} needs a key.`)
    else if (keys.has(item.key)) problems.push(`Series key "${item.key}" is used twice.`)
    else keys.add(item.key)

    const points = item.points ?? []
    if (points.length < 2) problems.push(`${name} needs at least two points.`)

    points.forEach((point, i) => {
      if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) {
        problems.push(`${name}, point ${i + 1}: x and y must be numbers.`)
      }
      const previous = points[i - 1]
      if (previous && !(point.x > previous.x)) {
        problems.push(`${name}, point ${i + 1}: x values must increase.`)
      }
      if (spec?.xScale === 'log' && point.x <= 0) {
        problems.push(`${name}, point ${i + 1}: a log scale needs x greater than 0.`)
      }
    })
  })

  const [first, ...rest] = series
  const reference = (first?.points ?? []).map((point) => point.x).join(',')
  for (const item of rest) {
    if ((item.points ?? []).map((point) => point.x).join(',') !== reference) {
      problems.push(`${item.label || item.key} must use the same x values as ${first?.label}.`)
    }
  }

  return problems
}
