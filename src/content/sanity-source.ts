import { type SanityClient } from 'next-sanity'
import { isLocale, locales, type Locale } from '../lib/i18n/config'
import { pagePath, postPath } from '../lib/i18n/paths'
import { readingMinutes } from '../lib/portable-text'
import {
  PAGE_QUERY,
  PAGE_SLUGS_QUERY,
  POST_QUERY,
  POST_SLUGS_QUERY,
  POSTS_QUERY,
  SETTINGS_QUERY,
  SNAPSHOT_QUERY,
} from '../sanity/queries'
import type { ContentSource } from './source-types'
import type {
  ContentSnapshot,
  LocaleContent,
  Page,
  Post,
  PostSummary,
  SiteSettings,
  Translations,
} from './types'

type RawTranslation = { language?: string | null; slug?: string | null }
type RawPage = Omit<Page, 'translations'> & { translations?: RawTranslation[] | null }
type RawPostSummary = Omit<PostSummary, 'readingMinutes'> & { plainText?: string | null }
type RawPost = Omit<Post, 'translations' | 'readingMinutes'> & {
  plainText?: string | null
  translations?: RawTranslation[] | null
}

function mapTranslations(
  raw: RawTranslation[] | null | undefined,
  toPath: (slug: string) => string,
  fallback: { language: Locale; slug: string },
): Translations {
  const result: Translations = { [fallback.language]: toPath(fallback.slug) }
  for (const entry of raw ?? []) {
    if (isLocale(entry.language) && entry.slug) result[entry.language] = toPath(entry.slug)
  }
  return result
}

function mapPage(raw: RawPage): Page {
  return { ...raw, translations: mapTranslations(raw.translations, pagePath, raw) }
}

function mapPostSummary({ plainText, ...raw }: RawPostSummary): PostSummary {
  return { ...raw, readingMinutes: readingMinutes(plainText ?? '') }
}

function mapPost({ plainText, translations, ...raw }: RawPost): Post {
  return {
    ...raw,
    readingMinutes: readingMinutes(plainText ?? ''),
    translations: mapTranslations(translations, postPath, raw),
  }
}

function emptySettings(locale: Locale): SiteSettings {
  return {
    _id: `siteSettings.${locale}`,
    _type: 'siteSettings',
    language: locale,
    siteName: 'Orrery Labs',
    tagline: '',
    description: '',
    navigation: [],
    footerColumns: [],
  }
}

export function createSanitySource(client: SanityClient): ContentSource {
  return {
    name: 'sanity',
    async getSettings(locale) {
      const settings = await client.fetch<SiteSettings | null>(SETTINGS_QUERY, { locale })
      return settings ?? emptySettings(locale)
    },
    async getPage(locale, slug) {
      const page = await client.fetch<RawPage | null>(PAGE_QUERY, { locale, slug })
      return page ? mapPage(page) : null
    },
    async getPageSlugs(locale) {
      return client.fetch<string[]>(PAGE_SLUGS_QUERY, { locale })
    },
    async getPosts(locale) {
      const posts = await client.fetch<RawPostSummary[]>(POSTS_QUERY, { locale })
      return posts.map(mapPostSummary)
    },
    async getPost(locale, slug) {
      const post = await client.fetch<RawPost | null>(POST_QUERY, { locale, slug })
      return post ? mapPost(post) : null
    },
    async getPostSlugs(locale) {
      return client.fetch<string[]>(POST_SLUGS_QUERY, { locale })
    },
    async getSnapshot() {
      const entries = await Promise.all(
        locales.map(async (locale): Promise<[Locale, LocaleContent]> => {
          const raw = await client.fetch<{
            settings: SiteSettings | null
            pages: RawPage[]
            posts: RawPost[]
          }>(SNAPSHOT_QUERY, { locale })
          return [
            locale,
            {
              settings: raw.settings ?? emptySettings(locale),
              pages: raw.pages.map(mapPage),
              posts: raw.posts.map(mapPost),
            },
          ]
        }),
      )
      return Object.fromEntries(entries) as ContentSnapshot
    },
  }
}
