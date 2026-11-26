import type { Locale } from '../lib/i18n/config'

/**
 * Cache tags shared by the cached readers and the revalidation webhook.
 * Fine-grained tags let one publish refresh one document instead of the whole site.
 */
export const tags = {
  all: 'content',
  settings: (locale: Locale) => `settings:${locale}`,
  page: (locale: Locale, slug: string) => `page:${locale}:${slug}`,
  pages: (locale: Locale) => `pages:${locale}`,
  post: (locale: Locale, slug: string) => `post:${locale}:${slug}`,
  posts: (locale: Locale) => `posts:${locale}`,
}

/** Tags to expire when a document changes, based on its type, language and slug. */
export function tagsForDocument(doc: {
  _type?: string
  language?: Locale
  slug?: string | null
}): string[] {
  const { _type, language, slug } = doc
  if (!language) return [tags.all]

  switch (_type) {
    case 'siteSettings':
      return [tags.settings(language)]
    case 'page':
      return slug ? [tags.page(language, slug), tags.pages(language)] : [tags.pages(language)]
    case 'post':
      return slug ? [tags.post(language, slug), tags.posts(language)] : [tags.posts(language)]
    default:
      return [tags.all]
  }
}
