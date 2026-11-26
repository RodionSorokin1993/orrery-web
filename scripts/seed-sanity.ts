/**
 * `pnpm sanity:seed`: copies the typed fixtures into your Sanity dataset, including translation
 * metadata, so the Studio starts with the same content as the demo. Safe to run more than once.
 *
 * Needs NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN (an Editor token) in .env.local.
 */
import { existsSync } from 'node:fs'
import { createClient, type SanityDocumentStub } from 'next-sanity'
import { fixtureContent, translationGroups } from '../src/content/fixtures'
import type { Block, Locale, Page, Post, SiteSettings } from '../src/content/types'
import { locales } from '../src/lib/i18n/config'

if (existsSync('.env.local')) process.loadEnvFile('.env.local')

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const token = process.env.SANITY_API_WRITE_TOKEN
if (!projectId || !token) {
  console.error('Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in .env.local first.')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-11-01',
  token,
  useCdn: false,
})

const slug = (current: string) => ({ _type: 'slug', current })

/** Array members of named object types need `_type` in the dataset; the site ignores it. */
function toSanityBlock(block: Block): Record<string, unknown> {
  switch (block._type) {
    case 'featureGrid':
      return { ...block, features: block.features.map((f) => ({ _type: 'feature', ...f })) }
    case 'stats':
      return { ...block, items: block.items.map((item) => ({ _type: 'stat', ...item })) }
    case 'chartBlock':
      return {
        ...block,
        chart: {
          ...block.chart,
          series: block.chart.series.map((series) => ({
            _type: 'series',
            ...series,
            points: series.points.map((point, i) => ({
              _type: 'point',
              _key: point._key ?? `${series.key}-${i}`,
              x: point.x,
              y: point.y,
            })),
          })),
        },
      }
    default:
      return { ...block }
  }
}

function pageDoc({ translations: _t, slug: s, blocks, ...page }: Page): SanityDocumentStub {
  return { ...page, slug: slug(s), blocks: blocks.map(toSanityBlock) }
}

function postDoc({
  translations: _t,
  readingMinutes: _r,
  slug: s,
  ...post
}: Post): SanityDocumentStub {
  return { ...post, slug: slug(s) }
}

function settingsDoc(settings: SiteSettings): SanityDocumentStub {
  return {
    ...settings,
    navigation: settings.navigation.map((link) => ({ _type: 'link', ...link })),
    footerColumns: settings.footerColumns.map((column) => ({
      _type: 'column',
      ...column,
      links: column.links.map((link) => ({ _type: 'link', ...link })),
    })),
  }
}

function metadataDocs(type: 'page' | 'post'): SanityDocumentStub[] {
  return Object.keys(translationGroups[type]).map((group) => ({
    _id: `translation.metadata.${type}.${group}`,
    _type: 'translation.metadata',
    schemaTypes: [type],
    translations: locales.map((locale: Locale) => ({
      _key: locale,
      _type: 'internationalizedArrayReferenceValue',
      language: locale,
      value: { _type: 'reference', _ref: `${type}.${group}.${locale}` },
    })),
  }))
}

async function main() {
  const documents: SanityDocumentStub[] = locales.flatMap((locale) => [
    settingsDoc(fixtureContent[locale].settings),
    ...fixtureContent[locale].pages.map(pageDoc),
    ...fixtureContent[locale].posts.map(postDoc),
  ])

  const transaction = client.transaction()
  for (const doc of [...documents, ...metadataDocs('page'), ...metadataDocs('post')]) {
    transaction.createOrReplace(doc as SanityDocumentStub & { _id: string })
  }
  const result = await transaction.commit()
  console.log(`Seeded ${result.results.length} documents into "${client.config().dataset}".`)
}

main().catch((error: unknown) => {
  console.error(error)
  process.exit(1)
})
