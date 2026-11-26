import Link from 'next/link'
import type { PostSummary } from '@/content/types'
import { interpolate, type Dictionary } from '@/lib/i18n'
import { type Locale } from '@/lib/i18n/config'
import { formatDate } from '@/lib/i18n/format'
import { localizeHref, postPath } from '@/lib/i18n/paths'
import { OrreryArt } from './OrreryArt'
import styles from './PostCard.module.css'

interface Props {
  post: PostSummary
  locale: Locale
  labels: Dictionary['blog']
  featured?: boolean
}

export function PostCard({ post, locale, labels, featured = false }: Props) {
  const href = localizeHref(postPath(post.slug), locale)

  return (
    <article className={`${styles.card} ${featured ? styles.featured : ''} reveal`}>
      <div className={styles.cover}>
        <OrreryArt seed={post.slug} animated={false} />
      </div>
      <div className={styles.body}>
        <p className={styles.meta}>
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time>
          <span aria-hidden="true">·</span>
          <span>{interpolate(labels.minutesRead, { minutes: post.readingMinutes })}</span>
        </p>
        <h2 className={styles.title}>
          {/* The whole card is clickable through this one link (see ::after in CSS). */}
          <Link href={href} className={styles.link}>
            {post.title}
          </Link>
        </h2>
        <p className={styles.excerpt}>{post.excerpt}</p>
        <ul className={styles.tags} aria-label={labels.tags}>
          {post.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </div>
    </article>
  )
}
