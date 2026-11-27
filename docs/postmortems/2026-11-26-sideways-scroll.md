# Postmortem: the models page scrolled sideways on phones

- **Date:** 2026-11-26
- **Severity:** Minor. A layout defect on two pages, no data or functionality lost.
- **Status:** Fixed in production about 15 minutes after the report, with a regression test.

## Summary

The comparison table shipped to production at 14:36 ET. At 14:40 a check on an iPhone showed that
`/en/models` could be dragged sideways: the whole page, header and footer included, slid left and
revealed an empty strip on the right. On a 390 px wide screen the document was 573 px wide.

## Impact

Phone visitors to `/en/models` and `/es/modelos`. Desktop was not affected, because the table fits
the viewport there. No other page was affected.

## Root cause

The table gives screen readers real text for its icons ("Included", "2 of 3") with the usual
visually hidden pattern: `position: absolute`, a 1 px box and `clip`.

On phones the table is wider than the screen, so it scrolls inside a container with
`overflow-x: auto`. That container clips its overflow, but only for descendants whose containing
block is inside it. An absolutely positioned element's containing block is its nearest
positioned ancestor, and nothing between the table cells and the page root was positioned.

So the hidden labels were positioned against the page itself. They stayed at their natural place
inside the 640 px table, outside the clipping container, and stretched the page's scrollable
area to the right edge of the table.

## Why the checks missed it

- **axe** checks semantics and contrast, not geometry.
- **Screenshots** were taken at the left edge of the page, where everything looked right.
- **No test** asserted that the page is no wider than the viewport.

## Fix

One line: `position: relative` on the scroll container, so it becomes the containing block for
everything inside it, including the hidden labels.
([`Comparison.module.css`](../../src/blocks/Comparison/Comparison.module.css))

## Prevention

- A new end-to-end test, [`e2e/layout.spec.ts`](../../e2e/layout.spec.ts), fails if any of six key
  pages is wider than the viewport. It runs on a desktop and on a phone in CI.
- The rule is now part of the quality gates spec
  ([006, R6](../specs/006-quality-gates.md)), and the table spec records the edge case
  ([007](../specs/007-comparison-table.md)).

## Lessons

- Visually hidden text and scroll containers need a positioned ancestor between them. This will
  come up again with every horizontally scrolling component.
- Geometry needs its own tests. "Looks right in a screenshot" is not the same as "works on a
  phone".
- Checking the production build on a real device right after a deploy caught this within minutes.
