import type { SiteSettings } from '@/content/types'
import type { Dictionary } from '@/lib/i18n'
import { type Locale } from '@/lib/i18n/config'
import { siteConfig } from '@/lib/site'
import styles from './Footer.module.css'
import { Logo } from './Logo'
import { SmartLink } from './SmartLink'

interface Props {
  locale: Locale
  settings: SiteSettings
  dictionary: Dictionary
}

export function Footer({ locale, settings, dictionary }: Props) {
  const [before, after = ''] = dictionary.footer.builtBy.split('{author}')

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <Logo siteName={settings.siteName} />
          <p className={styles.tagline}>{settings.tagline}</p>
        </div>

        <nav aria-label={dictionary.a11y.footerNavigation} className={styles.columns}>
          {settings.footerColumns.map((column) => (
            <div key={column._key}>
              <h2 className={styles.columnTitle}>{column.title}</h2>
              <ul className={styles.list}>
                {column.links.map((link) => (
                  <li key={link._key}>
                    <SmartLink href={link.href} locale={locale} className={styles.link}>
                      {link.label}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className={`container ${styles.bottom}`}>
        <p className={styles.note}>{dictionary.footer.fictionalNote}</p>
        <p className={styles.credit}>
          {before}
          <a href={siteConfig.author.url} rel="noopener noreferrer" className={styles.link}>
            {siteConfig.author.name}
          </a>
          {after}{' '}
          <a href={siteConfig.repositoryUrl} rel="noopener noreferrer" className={styles.link}>
            {dictionary.footer.sourceCode}
          </a>
        </p>
      </div>
    </footer>
  )
}
