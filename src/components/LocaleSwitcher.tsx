'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { localeCookie, localeLabels, locales, type Locale } from '@/lib/i18n/config'
import { localizeHref, stripLocale } from '@/lib/i18n/paths'
import type { RouteMap } from '@/lib/i18n/route-map'
import styles from './LocaleSwitcher.module.css'

interface Props {
  locale: Locale
  routeMap: RouteMap
  labels: { label: string; switchTo: string }
}

function rememberLocale(locale: Locale) {
  document.cookie = `${localeCookie}=${locale}; path=/; max-age=31536000; samesite=lax`
}

export function LocaleSwitcher({ locale, routeMap, labels }: Props) {
  const pathname = usePathname()
  const translations = routeMap[stripLocale(pathname)]

  return (
    <nav aria-label={labels.label} className={styles.switcher}>
      <ul className={styles.list}>
        {locales.map((target) => {
          const isCurrent = target === locale
          // Missing translation: land on that locale's home page instead of a 404.
          const href = localizeHref(translations?.[target] ?? '/', target)
          const { native, short } = localeLabels[target]

          return (
            <li key={target}>
              <Link
                href={href}
                hrefLang={target}
                lang={target}
                className={styles.link}
                aria-current={isCurrent ? 'true' : undefined}
                // The visible code starts the accessible name (WCAG 2.5.3, label in name).
                aria-label={`${short}, ${native}`}
                title={isCurrent ? undefined : labels.switchTo.replace('{language}', native)}
                onClick={() => rememberLocale(target)}
                prefetch={false}
              >
                {short}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
