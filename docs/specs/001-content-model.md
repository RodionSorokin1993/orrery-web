# 001: Content model

- **Status:** Implemented
- **Related:** [000](./000-overview.md), [005](./005-content-qa.md)

## Context

Editors build pages from blocks. The content model must be expressive enough for a marketing
team and strict enough that the front end never has to guess.

## Requirements

- **R1.** Document types: `page`, `post`, `siteSettings`. Each has a `language` field managed by
  `@sanity/document-internationalization` (document-level translations).
- **R2.** `page.blocks` accepts exactly these block types: `hero`, `featureGrid`, `chartBlock`,
  `stats`, `richText`, `cta`.
- **R3.** The front end consumes a **normalized domain model** (`src/content/types.ts`), not raw
  Sanity documents. GROQ projections map Sanity shapes into it (`slug.current` → `slug`,
  translation metadata → `translations`).
- **R4.** Fixtures implement the same domain model and are type-checked against it.
- **R5.** Validation rules in the schema catch problems while editing (required fields, length
  limits, chart data shape). The Content QA tool ([005](./005-content-qa.md)) catches
  cross-document problems the schema cannot see.
- **R6.** Unknown block types are skipped in production and reported in development, so adding a
  block in the CMS before the front end ships never breaks a page.

## Block reference

| Block         | Purpose                        | Key fields                                                                      |
| ------------- | ------------------------------ | ------------------------------------------------------------------------------- |
| `hero`        | Page opener with the only `h1` | `eyebrow`, `heading`, `subheading`, `primaryCta`, `secondaryCta`, `patternSeed` |
| `featureGrid` | 2 to 6 features with icons     | `heading`, `intro`, `features[]{title, body, icon}`                             |
| `chartBlock`  | Interactive line chart         | `heading`, `intro`, `chart{...}`, `takeaway`, `note`                            |
| `stats`       | Headline numbers               | `heading`, `items[]{value, label, detail}`                                      |
| `richText`    | Long-form Portable Text        | `content`                                                                       |
| `cta`         | Closing call to action         | `heading`, `body`, `link`                                                       |

## Acceptance criteria

| ID  | Criterion                                          | Verified by                         |
| --- | -------------------------------------------------- | ----------------------------------- |
| AC1 | Fixtures compile against the domain model          | `pnpm typecheck`                    |
| AC2 | Every block type renders without errors            | `src/blocks/BlockRenderer.test.tsx` |
| AC3 | Unknown block types render nothing                 | `src/blocks/BlockRenderer.test.tsx` |
| AC4 | Fixture content passes Content QA with zero errors | `pnpm content:check` in CI          |

## Edge cases

- A page with no `hero` still gets an `h1` (the page title, visually hidden).
- A `link.href` may be internal (`/models`) or external (`https://...`). Internal links are
  localized at render time; external links open in the same tab and get `rel="noopener"`.

## Do not touch

- Field names of existing blocks. Renaming a field is a content migration, not a refactor.
