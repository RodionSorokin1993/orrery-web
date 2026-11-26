import { lang } from 'next/root-params'
import { ButtonLink } from '@/components/Button'
import { Eyebrow } from '@/components/Eyebrow'
import { OrreryArt } from '@/components/OrreryArt'
import { getDictionary } from '@/lib/i18n'
import { defaultLocale, isLocale } from '@/lib/i18n/config'
import styles from './not-found.module.css'

export default async function NotFound() {
  // not-found receives no params; the root param getter still knows the locale.
  const value = await lang()
  const locale = isLocale(value) ? value : defaultLocale
  const { notFound } = getDictionary(locale)

  return (
    <section className={`container ${styles.notFound}`}>
      <div className={styles.copy}>
        <Eyebrow>{notFound.eyebrow}</Eyebrow>
        <h1 className={styles.title}>{notFound.title}</h1>
        <p className={styles.body}>{notFound.body}</p>
        <ButtonLink href="/" locale={locale} variant="primary" arrow>
          {notFound.cta}
        </ButtonLink>
      </div>
      <div className={styles.art}>
        <OrreryArt seed="lost-in-space" />
      </div>
    </section>
  )
}
