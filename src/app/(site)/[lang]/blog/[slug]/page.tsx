import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Eyebrow } from '@/components/Eyebrow'
import { JsonLd } from '@/components/JsonLd'
import { OrreryArt } from '@/components/OrreryArt'
import { Prose } from '@/components/Prose'
import { getPost, getPostSlugs } from '@/content'
import { getDictionary, interpolate } from '@/lib/i18n'
import { isLocale } from '@/lib/i18n/config'
import { formatDate } from '@/lib/i18n/format'
import { postPath } from '@/lib/i18n/paths'
import { buildMetadata } from '@/lib/seo'
import { getSiteUrl } from '@/lib/site'
import styles from '../blog.module.css'

export async function generateStaticParams({ params }: { params: { lang: string } }) {
  if (!isLocale(params.lang)) return []
  const slugs = await getPostSlugs(params.lang)
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: PageProps<'/[lang]/blog/[slug]'>): Promise<Metadata> {
  const { lang, slug } = await params
  if (!isLocale(lang)) return {}
  const post = await getPost(lang, slug)
  if (!post) return {}

  return buildMetadata({
    locale: lang,
    title: post.seo?.title ?? post.title,
    description: post.seo?.description ?? post.excerpt,
    path: postPath(post.slug),
    translations: post.translations,
    type: 'article',
    publishedTime: post.publishedAt,
    authors: [post.author.name],
    noIndex: post.seo?.noIndex,
  })
}

export default async function PostPage({ params }: PageProps<'/[lang]/blog/[slug]'>) {
  const { lang, slug } = await params
  if (!isLocale(lang)) notFound()

  const post = await getPost(lang, slug)
  if (!post) notFound()

  const { blog } = getDictionary(lang)

  return (
    <article className={`container ${styles.post}`}>
      <header className={styles.postHeader}>
        <Link href={`/${lang}/blog`} className={styles.back}>
          ← {blog.backToIndex}
        </Link>
        {post.tags[0] ? <Eyebrow>{post.tags.join(' · ')}</Eyebrow> : null}
        <h1 className={styles.postTitle}>{post.title}</h1>
        <p className={styles.postExcerpt}>{post.excerpt}</p>
        <p className={styles.byline}>
          <span>
            {interpolate(blog.by, { author: '' })}
            <span className={styles.author}>{post.author.name}</span>
            {post.author.role ? `, ${post.author.role}` : null}
          </span>
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, lang)}</time>
          <span>{interpolate(blog.minutesRead, { minutes: post.readingMinutes })}</span>
        </p>
      </header>

      <div className={styles.postCover}>
        <OrreryArt seed={post.slug} />
      </div>

      <div className={styles.postBody}>
        <Prose value={post.body} locale={lang} />
      </div>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt,
          datePublished: post.publishedAt,
          inLanguage: lang,
          author: { '@type': 'Person', name: post.author.name },
          mainEntityOfPage: `${getSiteUrl()}/${lang}${postPath(post.slug)}`,
        }}
      />
    </article>
  )
}
