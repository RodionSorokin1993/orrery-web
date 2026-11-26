import Link from 'next/link'
import type { SiteSettings } from '@/content/types'
import type { Dictionary } from '@/lib/i18n'
import { type Locale } from '@/lib/i18n/config'
import { localizeHref } from '@/lib/i18n/paths'
import type { RouteMap } from '@/lib/i18n/route-map'
import styles from './Header.module.css'
import { LocaleSwitcher } from './LocaleSwitcher'
import { Logo } from './Logo'
import { MobileNav } from './MobileNav'
import { NavLinks, type NavItem } from './NavLinks'
import { ThemeToggle } from './ThemeToggle'

interface Props {
  locale: Locale
  settings: SiteSettings
  dictionary: Dictionary
  routeMap: RouteMap
}

export function Header({ locale, settings, dictionary, routeMap }: Props) {
  const items: NavItem[] = settings.navigation.map((link) => ({
    key: link._key,
    label: link.label,
    href: localizeHref(link.href, locale),
  }))

  const tools = (
    <>
      <LocaleSwitcher locale={locale} routeMap={routeMap} labels={dictionary.locale} />
      <ThemeToggle labels={dictionary.theme} />
    </>
  )

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href={`/${locale}`} className={styles.brand} aria-label={dictionary.a11y.home}>
          <Logo siteName={settings.siteName} />
        </Link>

        <nav aria-label={dictionary.a11y.mainNavigation} className={styles.desktopNav}>
          <NavLinks items={items} className={styles.navList} linkClassName={styles.navLink} />
        </nav>

        <div className={styles.desktopTools}>{tools}</div>

        <MobileNav
          items={items}
          labels={{
            open: dictionary.a11y.openMenu,
            close: dictionary.a11y.closeMenu,
            navigation: dictionary.a11y.mainNavigation,
          }}
        >
          {tools}
        </MobileNav>
      </div>
    </header>
  )
}
