import type { Metadata } from 'next'
import type { Translations } from '@/content/types'
import { defaultLocale, localeLabels, type Locale } from './i18n/config'
import { localizeHref } from './i18n/paths'

interface PageMetadataInput {
  locale: Locale
  title: string
  description?: string
  /** Path of this document without locale, for example `/models`. */
  path: string
  translations: Translations
  type?: 'website' | 'article'
  publishedTime?: string
  authors?: string[]
  noIndex?: boolean
  /** Use the title as is, without the site name template. */
  absoluteTitle?: boolean
}

/** Canonical URL, hreflang alternates, Open Graph and Twitter metadata for one document. */
export function buildMetadata(input: PageMetadataInput): Metadata {
  const { locale, title, description, path, translations, noIndex } = input
  const canonical = localizeHref(path, locale)

  const languages: Record<string, string> = {}
  for (const [target, targetPath] of Object.entries(translations)) {
    if (targetPath) languages[target] = localizeHref(targetPath, target as Locale)
  }
  const xDefault = translations[defaultLocale]
  if (xDefault) languages['x-default'] = localizeHref(xDefault, defaultLocale)

  return {
    title: input.absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical, languages },
    robots: noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: input.type ?? 'website',
      title,
      description,
      url: canonical,
      locale: localeLabels[locale].intl.replace('-', '_'),
      siteName: 'Orrery Labs',
      ...(input.type === 'article'
        ? { publishedTime: input.publishedTime, authors: input.authors }
        : {}),
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}
