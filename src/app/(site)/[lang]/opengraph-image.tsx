import { getSettings } from '@/content'
import { defaultLocale, isLocale } from '@/lib/i18n/config'
import { ogContentType, ogSize, renderOgImage } from '@/lib/og'

export const alt = 'Orrery Labs: AI that shows its work'
export const size = ogSize
export const contentType = ogContentType

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale = isLocale(lang) ? lang : defaultLocale
  const settings = await getSettings(locale)

  return renderOgImage({
    title: settings.tagline,
    eyebrow: 'Orrery Labs',
    siteName: settings.siteName,
    seed: 'home',
  })
}
