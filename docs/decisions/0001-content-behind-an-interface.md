# 0001: Content comes through one interface

- **Status:** Accepted
- **Code:** [`src/content/source-types.ts`](../../src/content/source-types.ts),
  [`fixture-source.ts`](../../src/content/fixture-source.ts),
  [`sanity-source.ts`](../../src/content/sanity-source.ts)

## Context

The site has two audiences. Reviewers clone the repository and expect `pnpm dev` to work with no
accounts and no secrets. Editors expect a real CMS with drafts, previews and publishing. The
components should not care which one is running.

## Options

1. **Sanity only.** The real thing, but every clone and every preview deploy needs a project id
   and a dataset with content in it.
2. **Markdown or MDX in the repository.** Zero setup, but no editor experience, and the page
   builder (typed blocks in any order) becomes a custom file format.
3. **One `ContentSource` interface with two implementations:** typed fixtures by default, Sanity
   when credentials are present.

## Decision

Option 3. Components and routes import cached readers from `src/content/index.ts`, which pick the
source per request. Both implementations return the same domain types from
`src/content/types.ts`; the Sanity source maps GROQ results into them, so no Sanity shape leaks
into a component.

## Consequences

- A fresh clone runs, builds and passes CI with zero configuration, and so does the Vercel deploy.
- Unit and end-to-end tests run against fixtures, which makes them fast and deterministic.
- Two implementations can drift. Shared types catch shape drift at compile time, and the Content
  QA rules run on whatever the active source returns.
- Fixtures do not exercise CMS-only behavior such as drafts and references. That path is covered
  only when a Sanity project is connected.

## Revisit when

The CMS changes. Only a new `ContentSource` should be needed; if components have to change, this
boundary has leaked.
