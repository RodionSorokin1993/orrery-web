import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { JsonLd } from '@/components/JsonLd'
import { PageView } from '@/components/PageView'
import { getPage, getSettings } from '@/content'
import { isLocale } from '@/lib/i18n/config'
import { buildMetadata } from '@/lib/seo'
import { getSiteUrl, siteConfig } from '@/lib/site'

const HOME = 'home'

export async function generateMetadata({ params }: PageProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const page = await getPage(lang, HOME)
  if (!page) return {}

  return buildMetadata({
    locale: lang,
    title: page.seo?.title ?? page.title,
    description: page.seo?.description,
    path: '/',
    translations: page.translations,
    noIndex: page.seo?.noIndex,
    absoluteTitle: true,
  })
}

export default async function HomePage({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()

  const [page, settings] = await Promise.all([getPage(lang, HOME), getSettings(lang)])
  if (!page) notFound()

  return (
    <>
      <PageView page={page} locale={lang} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: settings.siteName,
          description: settings.description,
          url: `${getSiteUrl()}/${lang}`,
          sameAs: [siteConfig.repositoryUrl],
        }}
      />
    </>
  )
}
