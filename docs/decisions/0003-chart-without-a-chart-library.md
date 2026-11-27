# 0003: Build the chart on small pure functions, not a library

- **Status:** Accepted
- **Code:** [`src/lib/chart/scales.ts`](../../src/lib/chart/scales.ts),
  [`src/blocks/ChartBlock/LineChart.tsx`](../../src/blocks/ChartBlock/LineChart.tsx)
- **Spec:** [003](../specs/003-interactive-chart.md)

## Context

The site needs one kind of chart: a few lines over time, editable in the CMS. It has to work with
a mouse, a keyboard and a screen reader, and it should not be the heaviest thing on the page.

## Options

1. **A chart library** (Recharts, Chart.js). Fast to start, but the keyboard model and screen
   reader output are whatever the library provides, and it adds weight for a single line chart.
2. **D3 modules plus custom SVG.** Good scales, but D3 brings its own idioms for a problem this
   small.
3. **Own scales and SVG.** Nice ticks, linear and log scales and nearest-point lookup as pure
   functions, and one client component that renders SVG.

## Decision

Option 3. The math is a set of small pure functions with unit tests. The component owns the
interaction: arrow keys, Home and End move between points, a polite live region reads the values,
series toggles are real buttons with `aria-pressed`, and the same data is available as a table.

## Consequences

- Full control over focus, announcements and the reduced-motion behavior.
- No chart dependency in the client bundle.
- More code to own, and every new chart type costs real work.

## Revisit when

A page needs a second or third chart type, or a dashboard. At that point a library such as visx
pays for itself, and these scale functions can stay for the simple cases.
