# Architecture decisions

Specs in [`docs/specs`](../specs) describe what the site does. These records explain why it is
built this way: the options I considered, what I chose and what the choice costs. Each one ends
with the signal that would make me revisit it.

| #                                                 | Decision                                               |
| ------------------------------------------------- | ------------------------------------------------------ |
| [0001](./0001-content-behind-an-interface.md)     | Content comes through one interface, fixtures or CMS   |
| [0002](./0002-cache-components-and-tags.md)       | Cache everything, expire by tag from a signed webhook  |
| [0003](./0003-chart-without-a-chart-library.md)   | Build the chart on small pure functions, not a library |
| [0004](./0004-css-modules-and-tokens.md)          | CSS Modules and design tokens instead of Tailwind      |
| [0005](./0005-document-level-translations.md)     | One document per language, with localized slugs        |
| [0006](./0006-spec-driven-development-with-ai.md) | Specs first, AI drafts, a human reviews                |

## Format

Context, options, decision, consequences, and when to revisit. Records are short on purpose: if
a decision needs more than a page, it is probably two decisions.
