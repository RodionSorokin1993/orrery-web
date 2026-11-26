'use client'

import {
  useCallback,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'
import type { ChartSpec } from '@/content/types'
import {
  extent,
  linearScale,
  linePath,
  logScale,
  nearestIndex,
  niceDomain,
} from '@/lib/chart/scales'
import { type Locale } from '@/lib/i18n/config'
import { formatValue } from '@/lib/i18n/format'
import styles from './LineChart.module.css'

export interface LineChartLabels {
  series: string
  toggleSeries: string
  viewTable: string
  keyboardHint: string
  readoutAt: string
  chartLabel: string
}

interface Props {
  spec: ChartSpec
  locale: Locale
  title: string
  labels: LineChartLabels
}

const MARGIN = { top: 20, right: 20, bottom: 36, left: 52 }
const MIN_TICK_SPACING = 64
const fill = (template: string, key: string, value: string) => template.replace(`{${key}}`, value)

/** Measures an element's width; falls back to a sensible width during server rendering. */
function useWidth<T extends HTMLElement>(fallback: number) {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState(fallback)

  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return
    const update = () => setWidth(Math.max(280, Math.round(element.clientWidth)))
    update()
    const observer = new ResizeObserver(update)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return [ref, width] as const
}

export function LineChart({ spec, locale, title, labels }: Props) {
  const id = useId()
  const [frameRef, width] = useWidth<HTMLDivElement>(720)
  const [hidden, setHidden] = useState<ReadonlySet<string>>(() => new Set())
  const [active, setActive] = useState<number | null>(null)

  const height = Math.round(Math.min(420, Math.max(260, width * 0.56)))
  const xs = useMemo(() => spec.series[0]?.points.map((point) => point.x) ?? [], [spec])

  const { xScale, yScale, yTicks } = useMemo(() => {
    const xDomain = extent(xs)
    const range = [MARGIN.left, width - MARGIN.right] as const
    const x = spec.xScale === 'log' ? logScale(xDomain, range) : linearScale(xDomain, range)

    // Axes stay fixed when series are toggled, so lines never jump around.
    const ys = spec.series.flatMap((series) => series.points.map((point) => point.y))
    const [yMin, yMax] = extent(ys)
    const { domain, ticks } = niceDomain(yMin, yMax, 5)
    const y = linearScale(domain, [height - MARGIN.bottom, MARGIN.top])
    return { xScale: x, yScale: y, yTicks: ticks }
  }, [spec, xs, width, height])

  const xPositions = useMemo(() => xs.map((x) => xScale(x)), [xs, xScale])

  // Thin out x labels so they never collide on narrow screens.
  const xTickStride = Math.max(
    1,
    Math.ceil(xs.length / Math.max(2, Math.floor((width - MARGIN.left) / MIN_TICK_SPACING))),
  )

  const visibleSeries = spec.series.filter((series) => !hidden.has(series.key))

  const toggle = useCallback(
    (key: string) => {
      setHidden((current) => {
        const next = new Set(current)
        if (next.has(key)) next.delete(key)
        else if (spec.series.length - next.size > 1) next.add(key)
        return next
      })
    },
    [spec.series.length],
  )

  const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    const svg = event.currentTarget
    const bounds = svg.getBoundingClientRect()
    const x = ((event.clientX - bounds.left) / bounds.width) * width
    setActive(nearestIndex(xPositions, x))
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = xs.length - 1
    const current = active ?? -1
    const next =
      event.key === 'ArrowRight'
        ? Math.min(last, current + 1)
        : event.key === 'ArrowLeft'
          ? Math.max(0, current === -1 ? 0 : current - 1)
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? last
              : null
    if (next === null) return
    event.preventDefault()
    setActive(next)
  }

  const formatX = (value: number) => formatValue(value, spec.xFormat, locale)
  const formatY = (value: number) => formatValue(value, spec.yFormat, locale)

  const readout =
    active === null
      ? null
      : {
          x: formatX(xs[active] ?? 0),
          values: visibleSeries.map((series) => ({
            key: series.key,
            label: series.label,
            value: formatY(series.points[active]?.y ?? 0),
            color: spec.series.indexOf(series),
          })),
        }

  const hintId = `${id}-hint`

  return (
    <div className={styles.chart}>
      <div className={styles.toolbar}>
        <ul className={styles.legend} aria-label={labels.series}>
          {spec.series.map((series, index) => {
            const isOn = !hidden.has(series.key)
            return (
              <li key={series.key}>
                <button
                  type="button"
                  className={styles.legendButton}
                  aria-pressed={isOn}
                  aria-label={fill(labels.toggleSeries, 'series', series.label)}
                  onClick={() => toggle(series.key)}
                  data-color={index}
                >
                  <span className={styles.swatch} aria-hidden="true" />
                  {series.label}
                </button>
              </li>
            )
          })}
        </ul>

        <p className={styles.readout} aria-live="polite" aria-atomic="true">
          {readout ? (
            <>
              <span className={styles.readoutX}>{fill(labels.readoutAt, 'x', readout.x)}</span>
              {readout.values.map((item) => (
                <span key={item.key} className={styles.readoutValue} data-color={item.color}>
                  <span className={styles.swatch} aria-hidden="true" />
                  {item.label} <strong>{item.value}</strong>
                </span>
              ))}
            </>
          ) : (
            <span className={styles.readoutHint} aria-hidden="true">
              {labels.keyboardHint}
            </span>
          )}
        </p>
        <p id={hintId} className="visually-hidden">
          {labels.keyboardHint}
        </p>
      </div>

      <div
        ref={frameRef}
        className={styles.frame}
        tabIndex={0}
        role="group"
        aria-label={fill(labels.chartLabel, 'title', title)}
        aria-describedby={hintId}
        onKeyDown={onKeyDown}
        onFocus={() => setActive((current) => current ?? 0)}
      >
        <svg
          className={styles.svg}
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          height={height}
          aria-hidden="true"
          focusable="false"
          onPointerMove={onPointerMove}
          onPointerLeave={() => setActive(null)}
        >
          <text className={styles.axisTitle} x={MARGIN.left} y={12}>
            {spec.yLabel}
          </text>

          {yTicks.map((tick) => (
            <g key={tick} className={styles.gridLine}>
              <line
                x1={MARGIN.left}
                x2={width - MARGIN.right}
                y1={yScale(tick)}
                y2={yScale(tick)}
              />
              <text x={MARGIN.left - 10} y={yScale(tick)} dy="0.32em" textAnchor="end">
                {formatY(tick)}
              </text>
            </g>
          ))}

          {xs.map((x, index) =>
            index % xTickStride === 0 || index === xs.length - 1 ? (
              <text
                key={x}
                className={styles.tickLabel}
                x={xScale(x)}
                y={height - MARGIN.bottom + 20}
                textAnchor={index === 0 ? 'start' : index === xs.length - 1 ? 'end' : 'middle'}
              >
                {formatX(x)}
              </text>
            ) : null,
          )}

          {active !== null ? (
            <line
              className={styles.crosshair}
              x1={xPositions[active]}
              x2={xPositions[active]}
              y1={MARGIN.top}
              y2={height - MARGIN.bottom}
            />
          ) : null}

          {spec.series.map((series, index) => {
            if (hidden.has(series.key)) return null
            const points = series.points.map((point) => [xScale(point.x), yScale(point.y)] as const)
            return (
              <g key={series.key} data-color={index} className={styles.series}>
                <path className={styles.line} d={linePath(points)} pathLength={1} />
                {points.map(([cx, cy], pointIndex) => (
                  <circle
                    key={pointIndex}
                    className={pointIndex === active ? styles.dotActive : styles.dot}
                    cx={cx}
                    cy={cy}
                    r={pointIndex === active ? 5 : 3}
                  />
                ))}
              </g>
            )
          })}
        </svg>
        <p className={styles.axisCaption}>{spec.xLabel}</p>
      </div>

      <details className={styles.tableToggle}>
        <summary>{labels.viewTable}</summary>
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <caption className="visually-hidden">{title}</caption>
            <thead>
              <tr>
                <th scope="col">{spec.xLabel}</th>
                {spec.series.map((series) => (
                  <th key={series.key} scope="col">
                    {series.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {xs.map((x, row) => (
                <tr key={x}>
                  <th scope="row">{formatX(x)}</th>
                  {spec.series.map((series) => (
                    <td key={series.key}>{formatY(series.points[row]?.y ?? 0)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  )
}
