# 0002: Cache everything, expire by tag from a signed webhook

- **Status:** Accepted
- **Code:** [`src/content/index.ts`](../../src/content/index.ts),
  [`src/content/tags.ts`](../../src/content/tags.ts),
  [`src/app/api/revalidate/route.ts`](../../src/app/api/revalidate/route.ts)

## Context

A marketing site should load like a static site and still show an editor's change within
seconds of publishing. Most pages change rarely, and when one changes, the rest stay valid.

## Options

1. **Time-based revalidation** (rebuild a page every N seconds). Simple, but every page is either
   stale for up to N seconds or rebuilt for nothing.
2. **Fully dynamic rendering.** Always fresh, but every request pays for the CMS round trip.
3. **Cache Components** (`'use cache'` with `cacheLife('max')`) and **tag-based expiry** driven by
   the CMS.

## Decision

Option 3. Every content reader is cached with two kinds of tags: one per document
(`page:en:models`) and one per list (`pages:en`), plus a global `content` tag. Sanity calls
`/api/revalidate` on publish; the route verifies the webhook signature, maps the changed document
to its tags and expires only those. Draft Mode bypasses the cache for previews.

## Consequences

- Pages are served from cache, with no periodic rebuilds and no CMS call per request.
- One publish refreshes one page and the lists that show it, not the whole site.
- Correctness depends on the document-to-tag mapping, so it lives in one small, tested function.
- If the webhook is misconfigured, content goes stale rather than failing loudly. The fallback is
  the global `content` tag, which expires everything.

## Revisit when

Pages start depending on per-request data such as personalization. Those parts would move into
dynamic holes inside otherwise cached pages, not replace the caching.
