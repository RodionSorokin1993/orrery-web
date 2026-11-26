# 003: Interactive chart block

- **Status:** Implemented
- **Related:** [001](./001-content-model.md)

## Context

Marketing pages often need to explain a trade-off that a sentence cannot: how accuracy
grows with a reasoning budget, or how latency changes with model size. The chart block lets
an editor paste structured data in the CMS and get an interactive, accessible line chart.

## Requirements

- **R1.** Data comes from the CMS as structured fields: axis labels, value formats, scale type
  (`linear` or `log`), and one to four series of `{x, y}` points with shared x values.
- **R2.** Rendered as inline SVG with no charting library. Scales, ticks and nearest-point
  lookup are pure functions in `src/lib/chart`.
- **R3.** Pointer: moving over the plot shows a crosshair, a dot per visible series, and a
  readout with formatted values.
- **R4.** Keyboard: the plot is focusable. Left and Right move between x values, Home and End
  jump to the first and last. The readout is an `aria-live="polite"` region.
- **R5.** The legend doubles as series toggles (`aria-pressed`). The last visible series cannot
  be hidden.
- **R6.** A "View data as table" disclosure renders the same data as a real `<table>`.
- **R7.** Lines draw in on first view; with `prefers-reduced-motion: reduce` they appear instantly.
- **R8.** Colors come from chart tokens and keep 3:1 contrast against the background in both themes.
- **R9.** Illustrative data is labelled as such through the block's `note` field.

## Acceptance criteria

| ID  | Criterion                                                              | Verified by                                                     |
| --- | ---------------------------------------------------------------------- | --------------------------------------------------------------- |
| AC1 | Linear and log scales map domain to range, ticks are "nice"            | `src/lib/chart/scales.test.ts`                                  |
| AC2 | Arrow keys move the active point and update the live readout           | `src/blocks/ChartBlock/LineChart.test.tsx`, `e2e/chart.spec.ts` |
| AC3 | Toggling a series hides its line and readout value; the last one stays | `src/blocks/ChartBlock/LineChart.test.tsx`                      |
| AC4 | The data table lists every point of every series                       | `src/blocks/ChartBlock/LineChart.test.tsx`                      |
| AC5 | No axe violations on a page with a chart                               | `e2e/a11y.spec.ts`                                              |

## Edge cases

- Series with mismatched x values are rejected by schema validation and by Content QA.
- A single point cannot form a line: validation requires at least two.
- Narrow screens: tick labels thin out based on the measured width of the plot.

## Do not touch

- The chart must stay dependency-free; adding a charting library needs a new spec.
