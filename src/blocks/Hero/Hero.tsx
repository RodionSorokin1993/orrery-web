import { ButtonLink } from '@/components/Button'
import { Eyebrow } from '@/components/Eyebrow'
import { OrreryArt } from '@/components/OrreryArt'
import type { HeroBlock } from '@/content/types'
import { type Locale } from '@/lib/i18n/config'
import styles from './Hero.module.css'

interface Props {
  block: HeroBlock
  locale: Locale
  /** Used as the art seed when the editor leaves `patternSeed` empty. */
  fallbackSeed: string
}

/** Page opener. Renders the page's only `h1`. */
export function Hero({ block, locale, fallbackSeed }: Props) {
  const hasActions = Boolean(block.primaryCta || block.secondaryCta)

  return (
    <section className={styles.hero}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          {block.eyebrow ? <Eyebrow>{block.eyebrow}</Eyebrow> : null}
          <h1 className={styles.heading}>{block.heading}</h1>
          {block.subheading ? <p className={styles.subheading}>{block.subheading}</p> : null}
          {hasActions ? (
            <div className={styles.actions}>
              {block.primaryCta ? (
                <ButtonLink href={block.primaryCta.href} locale={locale} variant="primary" arrow>
                  {block.primaryCta.label}
                </ButtonLink>
              ) : null}
              {block.secondaryCta ? (
                <ButtonLink href={block.secondaryCta.href} locale={locale}>
                  {block.secondaryCta.label}
                </ButtonLink>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className={styles.art}>
          <OrreryArt seed={block.patternSeed || fallbackSeed} />
        </div>
      </div>
    </section>
  )
}
