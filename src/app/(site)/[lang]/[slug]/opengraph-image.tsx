import { getPage, getSettings } from '@/content'
import { defaultLocale, isLocale } from '@/lib/i18n/config'
import { ogContentType, ogSize, renderOgImage } from '@/lib/og'

export const alt = 'Orrery Labs'
export const size = ogSize
export const contentType = ogContentType

export default async function Image({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  const locale = isLocale(lang) ? lang : defaultLocale
  const [page, settings] = await Promise.all([getPage(locale, slug), getSettings(locale)])
  const hero = page?.blocks.find((block) => block._type === 'hero')

  return renderOgImage({
    title: hero?.heading ?? page?.title ?? settings.siteName,
    eyebrow: page?.title ?? settings.siteName,
    siteName: settings.siteName,
    seed: hero?.patternSeed || slug,
  })
}
