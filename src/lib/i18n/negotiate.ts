import { defaultLocale, isLocale, locales, type Locale } from './config'

interface WeightedLanguage {
  tag: string
  quality: number
  order: number
}

/** Parses an Accept-Language header into tags sorted by quality, keeping header order on ties. */
export function parseAcceptLanguage(header: string | null | undefined): string[] {
  if (!header) return []

  return header
    .split(',')
    .map((part, order): WeightedLanguage | null => {
      const [rawTag, ...params] = part.trim().split(';')
      const tag = rawTag?.trim().toLowerCase()
      if (!tag || tag === '*') return null

      const qParam = params.map((p) => p.trim()).find((p) => p.startsWith('q='))
      const quality = qParam ? Number.parseFloat(qParam.slice(2)) : 1
      if (!Number.isFinite(quality) || quality <= 0) return null

      return { tag, quality, order }
    })
    .filter((entry): entry is WeightedLanguage => entry !== null)
    .sort((a, b) => b.quality - a.quality || a.order - b.order)
    .map((entry) => entry.tag)
}

/**
 * Picks the best supported locale.
 * Priority: an explicit cookie value, then Accept-Language (exact tag, then base language),
 * then the default locale.
 */
export function negotiateLocale({
  cookie,
  acceptLanguage,
}: {
  cookie?: string | null
  acceptLanguage?: string | null
}): Locale {
  if (isLocale(cookie)) return cookie

  for (const tag of parseAcceptLanguage(acceptLanguage)) {
    if (isLocale(tag)) return tag
    const base = tag.split('-')[0]
    const match = locales.find((locale) => locale === base)
    if (match) return match
  }

  return defaultLocale
}
