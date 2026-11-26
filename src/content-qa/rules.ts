import { locales, type Locale } from '../lib/i18n/config'
import { isExternalHref, pagePath, postPath } from '../lib/i18n/paths'
import type {
  ContentSnapshot,
  Link,
  Page,
  Post,
  PortableTextBlock,
  SiteSettings,
} from '../content/types'
import { validateChartSpec } from './chart'

export type Severity = 'error' | 'warning'

export type RuleId =
  | 'broken-internal-link'
  | 'duplicate-slug'
  | 'chart-data'
  | 'empty-page'
  | 'missing-translation'
  | 'seo-description'
  | 'title-length'

export interface Issue {
  ruleId: RuleId
  severity: Severity
  locale: Locale
  documentId: string
  documentType: 'page' | 'post' | 'siteSettings'
  documentTitle: string
  message: string
  /** Where in the document, for example `blocks[home-hero].primaryCta`. */
  path?: string
}

interface Context {
  snapshot: ContentSnapshot
  /** Every path that resolves to a page, per locale. */
  validPaths: Record<Locale, Set<string>>
}

interface Rule {
  id: RuleId
  severity: Severity
  description: string
  check(context: Context): Omit<Issue, 'ruleId' | 'severity'>[]
}

type Doc = Page | Post | SiteSettings

const SEO_DESCRIPTION = { min: 50, max: 160 }
const TITLE_MAX = 60

function docInfo(doc: Doc) {
  return {
    documentId: doc._id,
    documentType: doc._type,
    documentTitle: doc._type === 'siteSettings' ? 'Site settings' : doc.title,
    locale: doc.language,
  }
}

function normalizePath(href: string): string {
  const path = href.split(/[?#]/)[0] ?? '/'
  return path.length > 1 ? path.replace(/\/+$/, '') : '/'
}

function portableTextLinks(blocks: PortableTextBlock[] | undefined, prefix: string) {
  const links: { href: string; path: string }[] = []
  for (const block of blocks ?? []) {
    const markDefs = (block as { markDefs?: { _type?: string; href?: string }[] }).markDefs ?? []
    for (const mark of markDefs) {
      if (mark._type === 'link' && mark.href) {
        links.push({ href: mark.href, path: `${prefix}[${block._key ?? '?'}]` })
      }
    }
  }
  return links
}

/** Collects every link a document renders, with a readable path for the report. */
export function collectLinks(doc: Doc): { href: string; path: string }[] {
  const links: { href: string; path: string }[] = []
  const add = (link: Link | undefined, path: string) => {
    if (link?.href) links.push({ href: link.href, path })
  }

  if (doc._type === 'siteSettings') {
    doc.navigation.forEach((link) => add(link, `navigation[${link._key}]`))
    doc.footerColumns.forEach((column) =>
      column.links.forEach((link) =>
        add(link, `footerColumns[${column._key}].links[${link._key}]`),
      ),
    )
    return links
  }

  if (doc._type === 'post') return portableTextLinks(doc.body, 'body')

  for (const block of doc.blocks) {
    const at = `blocks[${block._key}]`
    if (block._type === 'hero') {
      add(block.primaryCta, `${at}.primaryCta`)
      add(block.secondaryCta, `${at}.secondaryCta`)
    } else if (block._type === 'cta') {
      add(block.link, `${at}.link`)
    } else if (block._type === 'richText') {
      links.push(...portableTextLinks(block.content, `${at}.content`))
    }
  }
  return links
}

export const rules: Rule[] = [
  {
    id: 'broken-internal-link',
    severity: 'error',
    description: 'Internal links must point to an existing page or post in the same language.',
    check: ({ snapshot, validPaths }) =>
      locales.flatMap((locale) => {
        const { settings, pages, posts } = snapshot[locale]
        return [settings, ...pages, ...posts].flatMap((doc) =>
          collectLinks(doc)
            .filter(({ href }) => !isExternalHref(href) && !href.startsWith('#'))
            .filter(({ href }) => !validPaths[locale].has(normalizePath(href)))
            .map(({ href, path }) => ({
              ...docInfo(doc),
              path,
              message: `Link to "${href}" does not match any ${locale.toUpperCase()} page or post.`,
            })),
        )
      }),
  },
  {
    id: 'duplicate-slug',
    severity: 'error',
    description: 'Slugs must be unique per document type and language.',
    check: ({ snapshot }) =>
      locales.flatMap((locale) => {
        const { pages, posts } = snapshot[locale]
        return [pages, posts].flatMap((docs: (Page | Post)[]) => {
          const seen = new Map<string, string>()
          return docs.flatMap((doc) => {
            const first = seen.get(doc.slug)
            if (!first) {
              seen.set(doc.slug, doc._id)
              return []
            }
            return [
              {
                ...docInfo(doc),
                path: 'slug',
                message: `Slug "${doc.slug}" is already used by ${first}.`,
              },
            ]
          })
        })
      }),
  },
  {
    id: 'chart-data',
    severity: 'error',
    description: 'Chart series need shared, increasing x values and at least two points.',
    check: ({ snapshot }) =>
      locales.flatMap((locale) =>
        snapshot[locale].pages.flatMap((page) =>
          page.blocks.flatMap((block) =>
            block._type === 'chartBlock'
              ? validateChartSpec(block.chart).map((problem) => ({
                  ...docInfo(page),
                  path: `blocks[${block._key}].chart`,
                  message: problem,
                }))
              : [],
          ),
        ),
      ),
  },
  {
    id: 'empty-page',
    severity: 'error',
    description: 'Pages need at least one block.',
    check: ({ snapshot }) =>
      locales.flatMap((locale) =>
        snapshot[locale].pages
          .filter((page) => page.blocks.length === 0)
          .map((page) => ({
            ...docInfo(page),
            path: 'blocks',
            message: 'This page has no blocks.',
          })),
      ),
  },
  {
    id: 'missing-translation',
    severity: 'warning',
    description: 'Every page and post should exist in every language.',
    check: ({ snapshot }) =>
      locales.flatMap((locale) => {
        const { pages, posts } = snapshot[locale]
        return [...pages, ...posts].flatMap((doc) =>
          locales
            .filter((target) => target !== locale && !doc.translations[target])
            .map((target) => ({
              ...docInfo(doc),
              message: `No ${target.toUpperCase()} translation.`,
            })),
        )
      }),
  },
  {
    id: 'seo-description',
    severity: 'warning',
    description: `Descriptions should be ${SEO_DESCRIPTION.min} to ${SEO_DESCRIPTION.max} characters.`,
    check: ({ snapshot }) =>
      locales.flatMap((locale) => {
        const { pages, posts } = snapshot[locale]
        return [...pages, ...posts].flatMap((doc) => {
          const description =
            doc.seo?.description ?? (doc._type === 'post' ? doc.excerpt : undefined)
          if (!description) {
            return [
              { ...docInfo(doc), path: 'seo.description', message: 'Missing SEO description.' },
            ]
          }
          const { length } = description.trim()
          if (length < SEO_DESCRIPTION.min || length > SEO_DESCRIPTION.max) {
            return [
              {
                ...docInfo(doc),
                path: 'seo.description',
                message: `SEO description is ${length} characters; aim for ${SEO_DESCRIPTION.min} to ${SEO_DESCRIPTION.max}.`,
              },
            ]
          }
          return []
        })
      }),
  },
  {
    id: 'title-length',
    severity: 'warning',
    description: `Titles should be at most ${TITLE_MAX} characters.`,
    check: ({ snapshot }) =>
      locales.flatMap((locale) => {
        const { pages, posts } = snapshot[locale]
        return [...pages, ...posts].flatMap((doc) => {
          const title = doc.seo?.title ?? doc.title
          return title.length > TITLE_MAX
            ? [
                {
                  ...docInfo(doc),
                  path: 'seo.title',
                  message: `Title is ${title.length} characters; search results cut it after ${TITLE_MAX}.`,
                },
              ]
            : []
        })
      }),
  },
]

function buildValidPaths(snapshot: ContentSnapshot): Record<Locale, Set<string>> {
  const result = {} as Record<Locale, Set<string>>
  for (const locale of locales) {
    const { pages, posts } = snapshot[locale]
    result[locale] = new Set([
      '/blog',
      ...pages.map((page) => pagePath(page.slug)),
      ...posts.map((post) => postPath(post.slug)),
    ])
  }
  return result
}

/** Runs every rule and returns issues sorted with errors first. */
export function runContentQa(snapshot: ContentSnapshot): Issue[] {
  const context: Context = { snapshot, validPaths: buildValidPaths(snapshot) }
  return rules
    .flatMap((rule) =>
      rule.check(context).map((issue) => ({ ...issue, ruleId: rule.id, severity: rule.severity })),
    )
    .sort((a, b) =>
      a.severity === b.severity
        ? a.documentId.localeCompare(b.documentId)
        : a.severity === 'error'
          ? -1
          : 1,
    )
}
