import { PortableText, type PortableTextBlock, type PortableTextComponents } from 'next-sanity'
import { type Locale } from '@/lib/i18n/config'
import { slugify, toPlainText } from '@/lib/portable-text'
import styles from './Prose.module.css'
import { SmartLink } from './SmartLink'

function components(locale: Locale): PortableTextComponents {
  return {
    block: {
      normal: ({ children }) => <p>{children}</p>,
      h2: ({ children, value }) => (
        <h2 id={slugify(toPlainText([value as PortableTextBlock]))}>{children}</h2>
      ),
      h3: ({ children }) => <h3>{children}</h3>,
      blockquote: ({ children }) => <blockquote>{children}</blockquote>,
    },
    list: {
      bullet: ({ children }) => <ul>{children}</ul>,
      number: ({ children }) => <ol>{children}</ol>,
    },
    marks: {
      link: ({ children, value }) => {
        const href = (value as { href?: string } | undefined)?.href
        if (!href) return <>{children}</>
        return (
          <SmartLink href={href} locale={locale}>
            {children}
          </SmartLink>
        )
      },
    },
  }
}

export function Prose({
  value,
  locale,
  size = 'body',
}: {
  value: PortableTextBlock[]
  locale: Locale
  size?: 'body' | 'large'
}) {
  return (
    <div className={`${styles.prose} ${size === 'large' ? styles.large : ''}`}>
      <PortableText value={value} components={components(locale)} />
    </div>
  )
}
