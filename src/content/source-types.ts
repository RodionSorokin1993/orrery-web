import type { ContentSnapshot, Locale, Page, Post, PostSummary, SiteSettings } from './types'

/**
 * The only way the site reads content. Two implementations exist:
 * typed fixtures (default, no accounts needed) and Sanity (when credentials are set).
 */
export interface ContentSource {
  readonly name: 'fixtures' | 'sanity'
  getSettings(locale: Locale): Promise<SiteSettings>
  getPage(locale: Locale, slug: string): Promise<Page | null>
  getPageSlugs(locale: Locale): Promise<string[]>
  getPosts(locale: Locale): Promise<PostSummary[]>
  getPost(locale: Locale, slug: string): Promise<Post | null>
  getPostSlugs(locale: Locale): Promise<string[]>
  getSnapshot(): Promise<ContentSnapshot>
}
