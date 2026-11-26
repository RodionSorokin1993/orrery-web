import { getSettings } from '@/content'
import { getDictionary } from '@/lib/i18n'
import { defaultLocale, isLocale } from '@/lib/i18n/config'
import { ogContentType, ogSize, renderOgImage } from '@/lib/og'

export const alt = 'Orrery Labs research'
export const size = ogSize
export const contentType = ogContentType

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale = isLocale(lang) ? lang : defaultLocale
  const settings = await getSettings(locale)
  const { blog } = getDictionary(locale)

  return renderOgImage({
    title: blog.description,
    eyebrow: blog.title,
    siteName: settings.siteName,
    seed: 'research',
  })
}
