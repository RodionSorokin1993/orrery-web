import { getPost, getSettings } from '@/content'
import { getDictionary } from '@/lib/i18n'
import { defaultLocale, isLocale } from '@/lib/i18n/config'
import { formatDate } from '@/lib/i18n/format'
import { ogContentType, ogSize, renderOgImage } from '@/lib/og'

export const alt = 'Orrery Labs research post'
export const size = ogSize
export const contentType = ogContentType

export default async function Image({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  const locale = isLocale(lang) ? lang : defaultLocale
  const [post, settings] = await Promise.all([getPost(locale, slug), getSettings(locale)])
  const { blog } = getDictionary(locale)

  return renderOgImage({
    title: post?.title ?? blog.title,
    eyebrow: post ? `${blog.title} · ${formatDate(post.publishedAt, locale)}` : blog.title,
    siteName: settings.siteName,
    seed: slug,
  })
}
