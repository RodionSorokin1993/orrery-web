import type { StatsBlock } from '@/content/types'
import section from '../Section.module.css'
import styles from './Stats.module.css'

export function Stats({ block }: { block: StatsBlock }) {
  const headingId = block.heading ? `${block._key}-heading` : undefined

  return (
    <section className={`container ${section.section}`} aria-labelledby={headingId}>
      {block.heading ? (
        <h2 id={headingId} className={`${styles.heading} reveal`}>
          {block.heading}
        </h2>
      ) : null}
      <dl className={styles.grid}>
        {block.items.map((item) => (
          <div key={item._key} className={`${styles.item} reveal`}>
            <dt className={styles.label}>{item.label}</dt>
            <dd className={styles.value}>{item.value}</dd>
            {item.detail ? <dd className={styles.detail}>{item.detail}</dd> : null}
          </div>
        ))}
      </dl>
    </section>
  )
}
