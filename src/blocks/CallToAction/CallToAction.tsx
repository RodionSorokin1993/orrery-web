import { ButtonLink } from '@/components/Button'
import { OrreryArt } from '@/components/OrreryArt'
import type { CtaBlock } from '@/content/types'
import { type Locale } from '@/lib/i18n/config'
import styles from './CallToAction.module.css'

export function CallToAction({ block, locale }: { block: CtaBlock; locale: Locale }) {
  const headingId = `${block._key}-heading`

  return (
    <section className="container" aria-labelledby={headingId}>
      <div className={`${styles.panel} reveal`}>
        <div className={styles.copy}>
          <h2 id={headingId} className={styles.heading}>
            {block.heading}
          </h2>
          {block.body ? <p className={styles.body}>{block.body}</p> : null}
          <ButtonLink href={block.link.href} locale={locale} variant="primary" arrow>
            {block.link.label}
          </ButtonLink>
        </div>
        <div className={styles.art}>
          <OrreryArt seed={`${block._key}-cta`} animated={false} />
        </div>
      </div>
    </section>
  )
}
