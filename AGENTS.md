<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Working in this repository

This project uses spec-driven development. Read `docs/specs/README.md` first.

## Workflow for any change

1. Find the spec in `docs/specs/` that covers the change. If none does, write one from
   `docs/specs/_template.md` and stop for review before writing code.
2. Propose a short plan: the files you will touch and the tests that will prove each
   acceptance criterion.
3. Implement in small steps. After each step run the narrowest useful check
   (`pnpm test <file>`, `pnpm typecheck`).
4. Before finishing, run `pnpm verify` (lint, typecheck, content QA, unit tests).
5. Update the spec in the same change when behaviour changes.

## Rules

- Respect every "Do not touch" section in the specs.
- Content comes through `src/content/source.ts`. Never import fixtures or the Sanity client
  directly from components.
- Styles use CSS Modules and tokens from `src/styles/tokens.css`. No inline colors.
- Files used by Sanity Studio (`src/sanity/**`, `src/content-qa/**`) use relative imports,
  because the Studio CLI does not read the `@/` alias.
- Client components are the exception. Add `'use client'` only for real interactivity.

## Commands

| Command              | What it does                                  |
| -------------------- | --------------------------------------------- |
| `pnpm dev`           | Start the site and Studio on localhost:3000   |
| `pnpm verify`        | Lint, typecheck, content QA, unit tests       |
| `pnpm test:e2e`      | Playwright end-to-end and accessibility tests |
| `pnpm content:check` | Run Content QA rules from the command line    |
| `pnpm lhci`          | Lighthouse CI against a production build      |
