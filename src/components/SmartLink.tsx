import Link from 'next/link'
import type { ComponentProps } from 'react'
import { type Locale } from '@/lib/i18n/config'
import { isExternalHref, localizeHref } from '@/lib/i18n/paths'

type Props = Omit<ComponentProps<'a'>, 'href'> & {
  href: string
  locale: Locale
}

/**
 * One link component for CMS content: internal paths get the locale prefix and client-side
 * navigation, external URLs get a plain anchor with safe `rel` attributes.
 */
export function SmartLink({ href, locale, children, ...rest }: Props) {
  if (isExternalHref(href)) {
    return (
      <a href={href} rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    )
  }

  return (
    <Link href={localizeHref(href, locale)} {...rest}>
      {children}
    </Link>
  )
}
