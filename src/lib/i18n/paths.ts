import { isLocale, type Locale } from './config'

const EXTERNAL = /^(?:[a-z][a-z\d+.-]*:|\/\/)/i

export function isExternalHref(href: string): boolean {
  return EXTERNAL.test(href)
}

/**
 * Prefixes an internal path with the locale. External URLs, anchors and paths that already
 * carry a locale are returned unchanged.
 */
export function localizeHref(href: string, locale: Locale): string {
  if (isExternalHref(href) || href.startsWith('#')) return href

  const path = href.startsWith('/') ? href : `/${href}`
  const firstSegment = path.split('/')[1]
  if (isLocale(firstSegment)) return path

  return path === '/' ? `/${locale}` : `/${locale}${path}`
}

/** Removes the locale prefix: `/es/blog/x` becomes `/blog/x`, `/es` becomes `/`. */
export function stripLocale(pathname: string): string {
  const segments = pathname.split('/')
  if (!isLocale(segments[1])) return pathname || '/'
  const rest = segments.slice(2).join('/')
  return rest ? `/${rest}` : '/'
}

export function pagePath(slug: string): string {
  return slug === 'home' ? '/' : `/${slug}`
}

export function postPath(slug: string): string {
  return `/blog/${slug}`
}
