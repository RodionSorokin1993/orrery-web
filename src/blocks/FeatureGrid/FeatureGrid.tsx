import type { FeatureGridBlock } from '@/content/types'
import section from '../Section.module.css'
import styles from './FeatureGrid.module.css'
import { FeatureIcon } from './FeatureIcon'

export function FeatureGrid({ block }: { block: FeatureGridBlock }) {
  const headingId = `${block._key}-heading`

  return (
    <section className={`container ${section.section}`} aria-labelledby={headingId}>
      <div className={`${section.header} reveal`}>
        <h2 id={headingId} className={section.heading}>
          {block.heading}
        </h2>
        {block.intro ? <p className={section.intro}>{block.intro}</p> : null}
      </div>

      <ol className={styles.grid} data-count={block.features.length}>
        {block.features.map((feature, index) => (
          <li key={feature._key} className={`${styles.card} reveal`}>
            <div className={styles.meta}>
              <span className={styles.index} aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <FeatureIcon name={feature.icon} className={styles.icon} />
            </div>
            <h3 className={styles.title}>{feature.title}</h3>
            <p className={styles.body}>{feature.body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
