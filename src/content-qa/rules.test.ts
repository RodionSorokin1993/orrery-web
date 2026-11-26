import { describe, expect, it } from 'vitest'
import { fixtureContent } from '../content/fixtures'
import type { ChartBlock, ContentSnapshot, Page } from '../content/types'
import { runContentQa, type RuleId } from './rules'

/** Deep copy of the fixtures, so each test can break exactly one thing. */
function snapshot(): ContentSnapshot {
  return structuredClone(fixtureContent)
}

function page(content: ContentSnapshot, slug: string, locale: 'en' | 'es' = 'en'): Page {
  const found = content[locale].pages.find((p) => p.slug === slug)
  if (!found) throw new Error(`No fixture page ${slug}`)
  return found
}

function idsOf(content: ContentSnapshot): RuleId[] {
  return runContentQa(content).map((issue) => issue.ruleId)
}

describe('Content QA rules (spec 005)', () => {
  it('passes the fixtures with zero issues (AC2)', () => {
    expect(runContentQa(snapshot())).toEqual([])
  })

  it('reports a broken internal link with its location', () => {
    const content = snapshot()
    const hero = page(content, 'home').blocks[0]
    if (hero?._type !== 'hero' || !hero.primaryCta) throw new Error('fixture changed')
    hero.primaryCta.href = '/pricing'

    const [issue] = runContentQa(content)
    expect(issue).toMatchObject({
      ruleId: 'broken-internal-link',
      severity: 'error',
      locale: 'en',
      path: 'blocks[home-hero].primaryCta',
    })
  })

  it('accepts links with a query string or trailing slash, and external links', () => {
    const content = snapshot()
    const hero = page(content, 'home').blocks[0]
    if (hero?._type !== 'hero' || !hero.primaryCta || !hero.secondaryCta) throw new Error()
    hero.primaryCta.href = '/models/?ref=hero'
    hero.secondaryCta.href = 'https://example.com/anything'
    expect(runContentQa(content)).toEqual([])
  })

  it('checks links inside site settings and rich text', () => {
    const content = snapshot()
    content.es.settings.navigation[0]!.href = '/models' // English slug on the Spanish site
    expect(idsOf(content)).toContain('broken-internal-link')
  })

  it('reports duplicate slugs per type and locale', () => {
    const content = snapshot()
    page(content, 'about').slug = 'models'
    expect(idsOf(content)).toContain('duplicate-slug')
  })

  it('reports chart series that do not line up', () => {
    const content = snapshot()
    const chart = page(content, 'home').blocks.find(
      (block): block is ChartBlock => block._type === 'chartBlock',
    )
    chart!.chart.series[1]!.points.pop()
    const issues = runContentQa(content).filter((issue) => issue.ruleId === 'chart-data')
    expect(issues[0]?.message).toMatch(/same x values/)
  })

  it('reports empty pages', () => {
    const content = snapshot()
    page(content, 'about').blocks = []
    expect(idsOf(content)).toContain('empty-page')
  })

  it('warns about missing translations', () => {
    const content = snapshot()
    delete page(content, 'about').translations.es
    const issue = runContentQa(content).find((i) => i.ruleId === 'missing-translation')
    expect(issue).toMatchObject({ severity: 'warning', message: 'No ES translation.' })
  })

  it('warns about SEO descriptions outside 50 to 160 characters', () => {
    const content = snapshot()
    page(content, 'models').seo = { description: 'Too short.' }
    expect(idsOf(content)).toEqual(['seo-description'])
  })

  it('warns about long titles', () => {
    const content = snapshot()
    page(content, 'models').seo!.title =
      'A title that is far too long for any search result to show in full'
    expect(idsOf(content)).toEqual(['title-length'])
  })

  it('sorts errors before warnings', () => {
    const content = snapshot()
    page(content, 'models').seo = { description: 'Too short.' }
    page(content, 'about').blocks = []
    expect(runContentQa(content).map((issue) => issue.severity)).toEqual(['error', 'warning'])
  })
})
