# Changelog

Notable changes to this project. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow
[Semantic Versioning](https://semver.org/).

## [1.0.0] - 2026-11-26

First public release. Live at https://orrery-web-topaz.vercel.app.

### Site

- Marketing site for Orrery Labs, a fictional AI company: home, models, about and a research blog.
- English and Spanish with localized slugs, `hreflang` alternates and a locale switcher that keeps
  the reader on the translated page.
- Seven content blocks: hero, feature grid, interactive line chart, comparison table, stats, rich
  text and call to action.
- An accessible line chart without a chart library: keyboard navigation, live announcements and a
  data table.
- A comparison table with no client JavaScript: sticky header on desktop, pinned labels on phones.
- Generative orrery artwork for every page and its Open Graph image.
- Light and dark themes without a flash of the wrong theme.

### Content

- Sanity schema, desk structure and an embedded Studio at `/studio`. Without credentials the site
  runs on typed fixtures.
- Cache Components with tag-based expiry from a signed Sanity webhook, and Draft Mode previews.
- Content QA rules shared by a Studio tool and the `pnpm content:check` command.

### Quality

- CI on every push and pull request: lint, types, formatting, Content QA, unit tests with
  coverage, a production build, Playwright with axe, a check that no page scrolls sideways, and
  Lighthouse budgets.
- Specs for every feature, architecture decision records and a postmortem in `docs/`.

[1.0.0]: https://github.com/RodionSorokin1993/orrery-web/releases/tag/v1.0.0
