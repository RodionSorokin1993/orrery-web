import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { PageView } from '@/components/PageView'
import { getPage, getPageSlugs } from '@/content'
import { isLocale } from '@/lib/i18n/config'
import { pagePath } from '@/lib/i18n/paths'
import { buildMetadata } from '@/lib/seo'

/** CMS pages live one level deep, for example `/en/models`. */
export async function generateStaticParams({ params }: { params: { lang: string } }) {
  if (!isLocale(params.lang)) return []
  const slugs = await getPageSlugs(params.lang)
  return slugs.filter((slug) => slug !== 'home').map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps<'/[lang]/[slug]'>): Promise<Metadata> {
  const { lang, slug } = await params
  if (!isLocale(lang)) return {}
  const page = await getPage(lang, slug)
  if (!page) return {}

  return buildMetadata({
    locale: lang,
    title: page.seo?.title ?? page.title,
    description: page.seo?.description,
    path: pagePath(page.slug),
    translations: page.translations,
    noIndex: page.seo?.noIndex,
  })
}

export default async function ContentPage({ params }: PageProps<'/[lang]/[slug]'>) {
  const { lang, slug } = await params
  if (!isLocale(lang)) notFound()
  if (slug === 'home') permanentRedirect(`/${lang}`)

  const page = await getPage(lang, slug)
  if (!page) notFound()

  return <PageView page={page} locale={lang} />
}
