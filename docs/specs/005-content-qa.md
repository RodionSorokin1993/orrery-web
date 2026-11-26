# 005: Content QA tool

- **Status:** Implemented
- **Related:** [001](./001-content-model.md), [006](./006-quality-gates.md)

## Context

Schema validation sees one field at a time. Many real publishing mistakes span documents:
a link to a page that was unpublished, a post that exists in English but not in Spanish, a
chart whose series no longer line up. Editors need one place that lists these problems
before a reader finds them, and engineers need the same checks in CI.

## Requirements

- **R1.** Rules are pure functions in `src/content-qa/rules.ts` that take the normalized content
  of all locales and return issues `{ ruleId, severity, documentId, locale, message, path }`.
- **R2.** The same rules run in two places:
  - **Studio tool** "Content QA" at `/studio/content-qa`, with a link from each issue to the document.
  - **CLI** `pnpm content:check`, which prints a report and exits with code 1 on any error.
- **R3.** Rules in v1:

| Rule id                | Severity | Checks                                                                     |
| ---------------------- | -------- | -------------------------------------------------------------------------- |
| `broken-internal-link` | error    | Internal links point to an existing page or post in the same locale        |
| `duplicate-slug`       | error    | Slugs are unique per type and locale                                       |
| `chart-data`           | error    | Series share x values, x increases, values are finite, at least two points |
| `empty-page`           | error    | Pages have at least one block                                              |
| `missing-translation`  | warning  | Every document exists in every locale                                      |
| `seo-description`      | warning  | Description exists and is 50 to 160 characters                             |
| `title-length`         | warning  | SEO title is at most 60 characters                                         |

## Acceptance criteria

| ID  | Criterion                                                       | Verified by                     |
| --- | --------------------------------------------------------------- | ------------------------------- |
| AC1 | Each rule reports a crafted bad document and ignores a good one | `src/content-qa/rules.test.ts`  |
| AC2 | Fixtures pass with zero errors                                  | `pnpm content:check` in CI      |
| AC3 | CLI exits 1 when an error exists                                | `src/content-qa/report.test.ts` |

## Do not touch

- Rules never mutate content. Fixing is always the editor's decision.
