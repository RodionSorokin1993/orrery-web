'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export interface NavItem {
  key: string
  label: string
  /** Already localized, for example `/es/modelos`. */
  href: string
}

interface Props {
  items: NavItem[]
  className?: string
  linkClassName?: string
  onNavigate?: () => void
}

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

/** Navigation links that mark the current section with `aria-current`. */
export function NavLinks({ items, className, linkClassName, onNavigate }: Props) {
  const pathname = usePathname()

  return (
    <ul className={className}>
      {items.map((item) => (
        <li key={item.key}>
          <Link
            href={item.href}
            className={linkClassName}
            aria-current={isActive(pathname, item.href) ? 'page' : undefined}
            onClick={onNavigate}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  )
}
