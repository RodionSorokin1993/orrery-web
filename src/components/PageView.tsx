import { BlockRenderer } from '@/blocks/BlockRenderer'
import type { Page } from '@/content/types'
import { getDictionary } from '@/lib/i18n'
import { type Locale } from '@/lib/i18n/config'

/** Renders a CMS page. Guarantees exactly one h1, even when the editor removed the hero. */
export function PageView({ page, locale }: { page: Page; locale: Locale }) {
  const startsWithHero = page.blocks[0]?._type === 'hero'

  return (
    <article>
      {startsWithHero ? null : <h1 className="visually-hidden">{page.title}</h1>}
      <BlockRenderer
        blocks={page.blocks}
        locale={locale}
        dictionary={getDictionary(locale)}
        seed={page.slug}
      />
    </article>
  )
}
