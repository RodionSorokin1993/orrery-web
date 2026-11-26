import { locales, type Locale } from '../../lib/i18n/config'
import { pagePath, postPath } from '../../lib/i18n/paths'
import { readingMinutes, toPlainText } from '../../lib/portable-text'
import type { ContentSnapshot, LocaleContent, Translations } from '../types'
import * as en from './en'
import * as es from './es'

const sources = { en, es } satisfies Record<Locale, typeof en>

/** Documents that are translations of each other share a group. Slugs may differ per locale. */
const pageGroups: Record<string, Record<Locale, string>> = {
  home: { en: 'home', es: 'home' },
  models: { en: 'models', es: 'modelos' },
  about: { en: 'about', es: 'nosotros' },
}

const postGroups: Record<string, Record<Locale, string>> = {
  traces: { en: 'rendering-reasoning-traces', es: 'como-renderizamos-trazas-de-razonamiento' },
  launch: { en: 'introducing-apogee', es: 'presentamos-apogee' },
  calibration: { en: 'calibration-over-accuracy', es: 'calibracion-antes-que-precision' },
}

function findGroup(groups: Record<string, Record<Locale, string>>, locale: Locale, slug: string) {
  return Object.entries(groups).find(([, slugs]) => slugs[locale] === slug)
}

function translationsFor(
  groups: Record<string, Record<Locale, string>>,
  toPath: (slug: string) => string,
  locale: Locale,
  slug: string,
): { group: string; translations: Translations } {
  const match = findGroup(groups, locale, slug)
  if (!match) return { group: slug, translations: { [locale]: toPath(slug) } }

  const [group, slugs] = match
  const translations: Translations = {}
  for (const target of locales) {
    const targetSlug = slugs[target]
    const exists =
      sources[target].pages.some((p) => p.slug === targetSlug) ||
      sources[target].posts.some((p) => p.slug === targetSlug)
    if (exists) translations[target] = toPath(targetSlug)
  }
  return { group, translations }
}

function buildLocale(locale: Locale): LocaleContent {
  const source = sources[locale]

  return {
    settings: {
      _id: `siteSettings.${locale}`,
      _type: 'siteSettings',
      language: locale,
      ...source.settings,
    },
    pages: source.pages.map((page) => {
      const { group, translations } = translationsFor(pageGroups, pagePath, locale, page.slug)
      return {
        _id: `page.${group}.${locale}`,
        _type: 'page',
        language: locale,
        translations,
        ...page,
      }
    }),
    posts: source.posts.map((post) => {
      const { group, translations } = translationsFor(postGroups, postPath, locale, post.slug)
      return {
        _id: `post.${group}.${locale}`,
        _type: 'post',
        language: locale,
        translations,
        readingMinutes: readingMinutes(toPlainText(post.body)),
        ...post,
      }
    }),
  }
}

export const fixtureContent: ContentSnapshot = {
  en: buildLocale('en'),
  es: buildLocale('es'),
}

/** Translation groups are exported for the Sanity seed script. */
export const translationGroups = { page: pageGroups, post: postGroups }
