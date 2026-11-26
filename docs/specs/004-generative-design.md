# 004: Generative design

- **Status:** Implemented
- **Related:** [000](./000-overview.md)

## Context

An orrery is a mechanical model of a solar system. The brand uses that idea literally: every
page gets its own orrery, generated from a seed. Editors never upload hero images, social
cards never go stale, and the art is a few kilobytes of SVG instead of a photo.

## Requirements

- **R1.** `createRng(seed)` is a deterministic PRNG: the same seed always yields the same sequence.
- **R2.** `generateOrrery(seed, options)` returns a plain description of rings and bodies
  (radius, angle, size, speed, tone). Rendering is separate from generation.
- **R3.** `<OrreryArt seed>` renders the description as SVG for heroes and post covers. Rings
  rotate slowly with CSS; rotation stops with `prefers-reduced-motion: reduce`.
- **R4.** Open Graph images are generated per route with `next/og` from the same seed and the
  page title, so a link preview always matches the page.
- **R5.** The art is decorative: `aria-hidden="true"`, no text inside.
- **R6.** Colors come from tokens so the art follows the light and dark themes.

## Acceptance criteria

| ID  | Criterion                                                    | Verified by                         |
| --- | ------------------------------------------------------------ | ----------------------------------- |
| AC1 | Same seed, same output; different seeds, different output    | `src/lib/generative/orrery.test.ts` |
| AC2 | Bodies always sit inside the viewBox                         | `src/lib/generative/orrery.test.ts` |
| AC3 | `/en/opengraph-image` and a post OG image return `image/png` | `e2e/site.spec.ts`                  |

## Edge cases

- Empty seed falls back to the document slug.
- Very long titles in OG images are clamped to three lines.
