# 0004: CSS Modules and design tokens instead of Tailwind

- **Status:** Accepted
- **Code:** [`src/styles/tokens.css`](../../src/styles/tokens.css),
  [`src/lib/theme.ts`](../../src/lib/theme.ts)

## Context

The design is editorial: fluid type, generous spacing, light and dark themes. Most components are
Server Components, and the styling approach must not force them onto the client.

## Options

1. **Tailwind.** Fast to write and consistent, but the design language lives in class strings, and
   long-form editorial layouts read worse as utilities.
2. **CSS-in-JS** (styled-components). Co-located and dynamic, but runtime styling needs client
   components. It is in the dependency tree only because Sanity Studio requires it.
3. **CSS Modules plus CSS custom properties** for tokens: colors, a fluid type scale, a fluid
   space scale and radii.

## Decision

Option 3. Components read tokens and never hard-code values. Themes switch on `data-theme`, set by
a tiny inline script before first paint, so a dark-mode reader never sees a light flash. Modern
CSS does the rest: `color-mix()`, logical properties, `clamp()` scales and scroll-driven
animations.

## Consequences

- Zero runtime styling cost, and Server Components stay on the server.
- One place to change a color in both themes, with contrast checked against the tokens.
- Naming takes discipline, and there are no utility shortcuts for one-off layouts.

## Revisit when

The project joins a team that already works in Tailwind. Consistency with the team beats this
preference, and the tokens map cleanly onto a Tailwind theme.
