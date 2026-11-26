import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Eyebrow } from '@/components/Eyebrow'
import { PostCard } from '@/components/PostCard'
import { getPosts, getSettings } from '@/content'
import { getDictionary } from '@/lib/i18n'
import { isLocale, locales } from '@/lib/i18n/config'
import { buildMetadata } from '@/lib/seo'
import styles from './blog.module.css'

export async function generateMetadata({ params }: PageProps<'/[lang]/blog'>): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const dictionary = getDictionary(lang)

  return buildMetadata({
    locale: lang,
    title: dictionary.blog.title,
    description: dictionary.blog.description,
    path: '/blog',
    translations: Object.fromEntries(locales.map((locale) => [locale, '/blog'])),
  })
}

export default async function BlogIndexPage({ params }: PageProps<'/[lang]/blog'>) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()

  const [posts, settings] = await Promise.all([getPosts(lang), getSettings(lang)])
  const { blog } = getDictionary(lang)
  const [featured, ...rest] = posts

  return (
    <div className="container">
      <header className={styles.intro}>
        <Eyebrow>{settings.siteName}</Eyebrow>
        <h1 className={styles.title}>{blog.title}</h1>
        <p className={styles.lede}>{blog.description}</p>
      </header>

      {featured ? (
        <div className={styles.list}>
          <PostCard post={featured} locale={lang} labels={blog} featured />
          {rest.map((post) => (
            <PostCard key={post._id} post={post} locale={lang} labels={blog} />
          ))}
        </div>
      ) : (
        <p>{blog.empty}</p>
      )}
    </div>
  )
}
