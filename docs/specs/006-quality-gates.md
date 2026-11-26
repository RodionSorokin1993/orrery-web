# 006: Quality gates

- **Status:** Implemented
- **Related:** all specs

## Context

A marketing site is judged in the first second it loads. Performance and accessibility are
features, so they are enforced on every pull request instead of audited once before launch.

## Requirements

- **R1.** CI runs on every push and pull request: lint, typecheck, Content QA, unit tests with
  coverage, production build, Playwright end-to-end tests, and Lighthouse CI.
- **R2.** Lighthouse budgets on `/en`, `/en/models` and `/en/blog` (mobile emulation):

| Category       | Minimum |
| -------------- | ------- |
| Performance    | 0.90    |
| Accessibility  | 1.00    |
| Best practices | 0.95    |
| SEO            | 1.00    |

- **R3.** End-to-end tests run axe on key pages and fail on any violation.
- **R4.** The production build must not ship the Studio bundle to site routes.
- **R5.** Pull requests reference the spec they implement (see the PR template).

## Acceptance criteria

| ID  | Criterion                                                   | Verified by                |
| --- | ----------------------------------------------------------- | -------------------------- |
| AC1 | CI fails when any gate fails                                | `.github/workflows/ci.yml` |
| AC2 | Lighthouse assertions are versioned with the code           | `lighthouserc.json`        |
| AC3 | axe runs on home, a content page, the blog index and a post | `e2e/a11y.spec.ts`         |
