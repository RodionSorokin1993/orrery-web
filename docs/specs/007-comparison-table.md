# 007: Comparison table block

- **Status:** Implemented
- **Related:** [001](./001-content-model.md), [005](./005-content-qa.md)

## Context

Visitors on the models page want one answer: which model fits my task? A comparison table is
the fastest way to give it, if it stays readable on a phone and accessible to screen readers.
Editors need to change rows and prices without a developer.

## Goals

- Compare two to four products side by side, grouped by topic.
- Point most visitors to a default choice with a highlighted column.

## Non-goals

- Sorting, filtering or interactive pricing. This block is static content.

## Requirements

- **R1.** New block type `comparison` with `heading`, `intro`, `columns`, `rows` and `footnote`.
- **R2.** Columns have a `key`, `label`, optional `tagline` and an optional `highlighted` flag
  (at most one highlighted column).
- **R3.** Rows have a `label`, an optional `hint` and an optional `group`. Consecutive rows with the
  same group render under one group heading.
- **R4.** Each row has exactly one cell per column, in column order. A cell is one of:
  `text` (free text), `yes`, `no` or `level` (1 to 3, shown as filled dots).
- **R5.** Semantic table: a caption, `th scope="col"` for columns, `th scope="row"` for row labels,
  `th scope="rowgroup"` for group headings. Icons and dots carry visually hidden text
  ("Included", "2 of 3").
- **R6.** Wide screens pin the header row below the site header while the page scrolls. Narrow
  screens scroll the table sideways inside the block instead: row and group labels stay pinned,
  and scroll shadows show that more content exists.
- **R7.** The highlighted column is tinted as one continuous band, group rows included, and its
  tagline renders as a badge in the header.
- **R8.** Server component only: no client JavaScript.
- **R9.** Shape problems (wrong number of cells, duplicate column keys, two highlighted columns)
  fail schema validation and the `comparison-shape` Content QA rule.

## Acceptance criteria

| ID  | Criterion                                                         | Verified by                                 |
| --- | ----------------------------------------------------------------- | ------------------------------------------- |
| AC1 | Table exposes column, row and group headers with the right scopes | `src/blocks/Comparison/Comparison.test.tsx` |
| AC2 | Yes, no and level cells have accessible text in the page language | `src/blocks/Comparison/Comparison.test.tsx` |
| AC3 | A row with a missing cell is reported as an error                 | `src/content-qa/rules.test.ts`              |
| AC4 | No axe violations on the models page in both locales              | `e2e/a11y.spec.ts`                          |
| AC5 | On a phone the models page does not scroll sideways               | `e2e/layout.spec.ts`                        |

## Edge cases

- A table without groups renders as a single body.
- Long text cells wrap; the table has a minimum width so columns never collapse to a word.
- The scroll container is the containing block for the visually hidden cell labels, so they are
  clipped with the table and never make the page itself scroll sideways.

## Do not touch

- Other blocks. This spec only adds a block type.
