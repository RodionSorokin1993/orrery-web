import styles from './Logo.module.css'

/** Brand mark: a sun, one orbit and a planet. The wordmark stays real text for accessibility. */
export function Logo({ siteName }: { siteName: string }) {
  return (
    <span className={styles.logo}>
      <svg className={styles.mark} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <circle cx="16" cy="16" r="11" className={styles.orbit} />
        <circle cx="16" cy="16" r="4.5" className={styles.sun} />
        <circle cx="24.5" cy="9" r="2.6" className={styles.planet} />
      </svg>
      <span className={styles.wordmark}>{siteName}</span>
    </span>
  )
}
