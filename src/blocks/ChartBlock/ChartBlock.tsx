import type { ChartBlock as ChartBlockType } from '@/content/types'
import type { Dictionary } from '@/lib/i18n'
import { type Locale } from '@/lib/i18n/config'
import section from '../Section.module.css'
import styles from './ChartBlock.module.css'
import { LineChart } from './LineChart'

interface Props {
  block: ChartBlockType
  locale: Locale
  labels: Dictionary['chart']
}

export function ChartBlock({ block, locale, labels }: Props) {
  const headingId = `${block._key}-heading`

  return (
    <section className={`container ${section.section}`} aria-labelledby={headingId}>
      <div className={`${section.header} reveal`}>
        <h2 id={headingId} className={section.heading}>
          {block.heading}
        </h2>
        {block.intro ? <p className={section.intro}>{block.intro}</p> : null}
      </div>

      <figure className={styles.figure}>
        <LineChart spec={block.chart} locale={locale} title={block.heading} labels={labels} />
        {block.takeaway || block.note ? (
          <figcaption className={styles.caption}>
            {block.takeaway ? <p className={styles.takeaway}>{block.takeaway}</p> : null}
            {block.note ? <p className={styles.note}>{block.note}</p> : null}
          </figcaption>
        ) : null}
      </figure>
    </section>
  )
}
