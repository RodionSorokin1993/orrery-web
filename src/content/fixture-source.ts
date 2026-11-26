import { fixtureContent } from './fixtures'
import type { ContentSource } from './source-types'
import type { Post, PostSummary } from './types'

function byNewest(a: { publishedAt: string }, b: { publishedAt: string }) {
  return b.publishedAt.localeCompare(a.publishedAt)
}

function toSummary(post: Post): PostSummary {
  const { body: _body, seo: _seo, translations: _translations, ...summary } = post
  return summary
}

export const fixtureSource: ContentSource = {
  name: 'fixtures',
  async getSettings(locale) {
    return fixtureContent[locale].settings
  },
  async getPage(locale, slug) {
    return fixtureContent[locale].pages.find((page) => page.slug === slug) ?? null
  },
  async getPageSlugs(locale) {
    return fixtureContent[locale].pages.map((page) => page.slug)
  },
  async getPosts(locale) {
    return [...fixtureContent[locale].posts].sort(byNewest).map(toSummary)
  },
  async getPost(locale, slug) {
    return fixtureContent[locale].posts.find((post) => post.slug === slug) ?? null
  },
  async getPostSlugs(locale) {
    return fixtureContent[locale].posts.map((post) => post.slug)
  },
  async getSnapshot() {
    return fixtureContent
  },
}
