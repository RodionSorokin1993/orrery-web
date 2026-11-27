# 0005: One document per language, with localized slugs

- **Status:** Accepted
- **Code:** [`src/lib/i18n/route-map.ts`](../../src/lib/i18n/route-map.ts),
  [`src/components/LocaleSwitcher.tsx`](../../src/components/LocaleSwitcher.tsx),
  [`sanity.config.ts`](../../sanity.config.ts)
- **Spec:** [002](../specs/002-i18n.md)

## Context

The site ships in English and Spanish. Spanish readers should get Spanish URLs (`/es/modelos`,
not `/es/models`), and a translation should be able to go live on its own schedule.

## Options

1. **Field-level translation:** one document with a value per language in every field. Easy to
   keep in sync, but one slug for all languages and one publish for all of them.
2. **Document-level translation:** one document per language, linked as a translation group.

## Decision

Option 2, using Sanity's document internationalization plugin. Each language has its own slug and
publish state. A route map built from the translation groups lets the locale switcher send the
reader to the translated version of the page they are on, not to the home page.

## Consequences

- Localized URLs, `hreflang` alternates and independent publishing work naturally.
- Translations can be missing. The `missing-translation` Content QA rule reports them, and the
  switcher falls back to the locale home.
- Shared, non-text data such as chart numbers is duplicated per language and can drift.

## Revisit when

Most content becomes data rather than text. Then field-level translation for those types would
remove the duplication.
