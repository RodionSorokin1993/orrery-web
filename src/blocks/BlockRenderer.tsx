import type { Block } from '@/content/types'
import type { Dictionary } from '@/lib/i18n'
import { type Locale } from '@/lib/i18n/config'
import { CallToAction } from './CallToAction/CallToAction'
import { ChartBlock } from './ChartBlock/ChartBlock'
import { FeatureGrid } from './FeatureGrid/FeatureGrid'
import { Hero } from './Hero/Hero'
import { RichText } from './RichText/RichText'
import { Stats } from './Stats/Stats'

interface Props {
  blocks: Block[]
  locale: Locale
  dictionary: Dictionary
  /** Seed for generated art when a hero has no seed of its own. */
  seed: string
}

/**
 * Maps CMS blocks to components. Unknown types render nothing, so the CMS can ship a new block
 * before the front end does without breaking published pages.
 */
export function BlockRenderer({ blocks, locale, dictionary, seed }: Props) {
  return (
    <>
      {blocks.map((block) => {
        switch (block._type) {
          case 'hero':
            return <Hero key={block._key} block={block} locale={locale} fallbackSeed={seed} />
          case 'featureGrid':
            return <FeatureGrid key={block._key} block={block} />
          case 'chartBlock':
            return (
              <ChartBlock
                key={block._key}
                block={block}
                locale={locale}
                labels={dictionary.chart}
              />
            )
          case 'stats':
            return <Stats key={block._key} block={block} />
          case 'richText':
            return <RichText key={block._key} block={block} locale={locale} />
          case 'cta':
            return <CallToAction key={block._key} block={block} locale={locale} />
          default: {
            const unknown = block as { _type?: string }
            if (process.env.NODE_ENV !== 'production') {
              console.warn(`BlockRenderer: no component for block type "${unknown._type}"`)
            }
            return null
          }
        }
      })}
    </>
  )
}
