import type { ReactNode } from 'react'
import type { Locale } from '@/lib/i18n/config'
import styles from './Button.module.css'
import { SmartLink } from './SmartLink'

type Variant = 'primary' | 'secondary' | 'ghost'

interface ButtonLinkProps {
  href: string
  locale: Locale
  variant?: Variant
  arrow?: boolean
  children: ReactNode
}

export function ButtonLink({
  href,
  locale,
  variant = 'secondary',
  arrow = false,
  children,
}: ButtonLinkProps) {
  const className = [styles.button, variant !== 'secondary' && styles[variant]]
    .filter(Boolean)
    .join(' ')

  return (
    <SmartLink href={href} locale={locale} className={className}>
      {children}
      {arrow ? (
        <span className={styles.arrow} aria-hidden="true">
          →
        </span>
      ) : null}
    </SmartLink>
  )
}
