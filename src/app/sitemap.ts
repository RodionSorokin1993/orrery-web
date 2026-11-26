import type { MetadataRoute } from 'next'
import { getSnapshot } from '@/content'
import { locales, type Locale } from '@/lib/i18n/config'
import { localizeHref, pagePath, postPath } from '@/lib/i18n/paths'
import { getSiteUrl } from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const snapshot = await getSnapshot()
  const base = getSiteUrl()
  const url = (path: string, locale: Locale) => `${base}${localizeHref(path, locale)}`

  const entries: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    const { pages, posts } = snapshot[locale]

    for (const page of pages) {
      if (page.seo?.noIndex) continue
      entries.push({
        url: url(pagePath(page.slug), locale),
        changeFrequency: 'monthly',
        priority: page.slug === 'home' ? 1 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            Object.entries(page.translations).map(([target, path]) => [
              target,
              url(path ?? '/', target as Locale),
            ]),
          ),
        },
      })
    }

    entries.push({
      url: url('/blog', locale),
      changeFrequency: 'weekly',
      priority: 0.7,
      alternates: {
        languages: Object.fromEntries(locales.map((target) => [target, url('/blog', target)])),
      },
    })

    for (const post of posts) {
      if (post.seo?.noIndex) continue
      entries.push({
        url: url(postPath(post.slug), locale),
        lastModified: post.publishedAt,
        changeFrequency: 'yearly',
        priority: 0.6,
        alternates: {
          languages: Object.fromEntries(
            Object.entries(post.translations).map(([target, path]) => [
              target,
              url(path ?? '/', target as Locale),
            ]),
          ),
        },
      })
    }
  }

  return entries
}
