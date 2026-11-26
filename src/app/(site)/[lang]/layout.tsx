import '@/styles/globals.css'
import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { DraftModeTools } from '@/components/DraftModeTools'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { getSettings, getSnapshot } from '@/content'
import { fontVariables } from '@/lib/fonts'
import { getDictionary } from '@/lib/i18n'
import { isLocale, locales } from '@/lib/i18n/config'
import { buildRouteMap } from '@/lib/i18n/route-map'
import { getSiteUrl } from '@/lib/site'
import { themeInitScript } from '@/lib/theme'
import styles from './layout.module.css'

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f2ea' },
    { media: '(prefers-color-scheme: dark)', color: '#0e1016' },
  ],
}

export async function generateMetadata({ params }: LayoutProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const settings = await getSettings(lang)

  return {
    metadataBase: new URL(getSiteUrl()),
    title: { default: settings.siteName, template: `%s · ${settings.siteName}` },
    description: settings.description,
    applicationName: settings.siteName,
    formatDetection: { telephone: false },
  }
}

export default async function SiteLayout({ children, params }: LayoutProps<'/[lang]'>) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()

  const [settings, snapshot] = await Promise.all([getSettings(lang), getSnapshot()])
  const dictionary = getDictionary(lang)
  const routeMap = buildRouteMap(snapshot[lang])

  return (
    <html lang={lang} data-theme="light" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <a href="#main" className={styles.skipLink}>
          {dictionary.a11y.skipToContent}
        </a>
        <Header locale={lang} settings={settings} dictionary={dictionary} routeMap={routeMap} />
        <main id="main" tabIndex={-1} className={styles.main}>
          {children}
        </main>
        <Footer locale={lang} settings={settings} dictionary={dictionary} />
        <Suspense fallback={null}>
          <DraftModeTools labels={dictionary.draft} />
        </Suspense>
      </body>
    </html>
  )
}
