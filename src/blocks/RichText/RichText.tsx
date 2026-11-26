import { Prose } from '@/components/Prose'
import type { RichTextBlock } from '@/content/types'
import { type Locale } from '@/lib/i18n/config'
import section from '../Section.module.css'

export function RichText({ block, locale }: { block: RichTextBlock; locale: Locale }) {
  return (
    <section className={`container ${section.section}`}>
      <Prose value={block.content} locale={locale} size="large" />
    </section>
  )
}
