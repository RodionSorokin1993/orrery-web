import type { LocaleContent, Translations } from '../../content/types'
import { locales } from './config'
import { pagePath, postPath } from './paths'

/** Path (without locale) to the paths of its translations. Lets the switcher keep the reader in place. */
export type RouteMap = Record<string, Translations>

export function buildRouteMap(content: LocaleContent): RouteMap {
  const map: RouteMap = {
    '/blog': Object.fromEntries(locales.map((locale) => [locale, '/blog'])),
  }
  for (const page of content.pages) map[pagePath(page.slug)] = page.translations
  for (const post of content.posts) map[postPath(post.slug)] = post.translations
  return map
}
