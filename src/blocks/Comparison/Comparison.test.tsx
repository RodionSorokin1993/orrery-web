import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { fixtureContent } from '@/content/fixtures'
import type { ComparisonBlock } from '@/content/types'
import { getDictionary } from '@/lib/i18n'
import { Comparison, groupRows } from './Comparison'

function fixtureBlock(locale: 'en' | 'es') {
  const models = fixtureContent[locale].pages.find(
    (page) => page.slug !== 'home' && page.blocks.some((b) => b._type === 'comparison'),
  )!
  return models.blocks.find((block): block is ComparisonBlock => block._type === 'comparison')!
}

describe('Comparison (spec 007)', () => {
  it('exposes column, group and row headers with the right scopes (AC1)', () => {
    const block = fixtureBlock('en')
    render(<Comparison block={block} labels={getDictionary('en').comparison} />)

    const table = screen.getByRole('table', { name: 'Compare the models' })
    const columnHeaders = within(table).getAllByRole('columnheader')
    expect(columnHeaders.map((th) => th.getAttribute('scope'))).toEqual(['col', 'col', 'col'])
    expect(columnHeaders[1]).toHaveTextContent('Meridian')
    expect(columnHeaders[1]).toHaveAttribute('data-highlighted', 'true')

    const groups = within(table)
      .getAllByRole('rowheader')
      .filter((th) => th.getAttribute('scope') === 'rowgroup')
    expect(groups.map((th) => th.textContent)).toEqual(['Performance', 'Features', 'Pricing'])

    const latency = within(table).getByRole('rowheader', { name: /Median latency/ })
    expect(latency).toHaveAttribute('scope', 'row')
    expect(latency).toHaveTextContent('For a 2K-token prompt')
  })

  it('gives icons and dots accessible text in the page language (AC2)', () => {
    const { rerender } = render(
      <Comparison block={fixtureBlock('en')} labels={getDictionary('en').comparison} />,
    )
    const citations = screen
      .getByRole('rowheader', { name: 'Passage-level citations' })
      .closest('tr')!
    expect(
      within(citations)
        .getAllByRole('cell')
        .map((td) => td.textContent),
    ).toEqual(['Not included', 'Included', 'Included'])
    const depth = screen.getByRole('rowheader', { name: 'Reasoning depth' }).closest('tr')!
    expect(within(depth).getAllByRole('cell')[2]).toHaveTextContent('3 of 3')

    rerender(<Comparison block={fixtureBlock('es')} labels={getDictionary('es').comparison} />)
    const citas = screen.getByRole('rowheader', { name: 'Citas por pasaje' }).closest('tr')!
    expect(within(citas).getAllByRole('cell')[0]).toHaveTextContent('No incluido')
  })

  it('makes the scrollable region reachable by keyboard', () => {
    render(<Comparison block={fixtureBlock('en')} labels={getDictionary('en').comparison} />)
    const region = screen.getByRole('region', { name: 'Compare the models' })
    expect(region).toHaveAttribute('tabindex', '0')
  })
})

describe('groupRows', () => {
  it('groups consecutive rows only', () => {
    const rows = ['A', 'A', 'B', 'A'].map((group, i) => ({
      _key: String(i),
      label: `Row ${i}`,
      group,
      cells: [],
    }))
    expect(groupRows(rows).map((g) => [g.name, g.rows.length])).toEqual([
      ['A', 2],
      ['B', 1],
      ['A', 1],
    ])
  })

  it('keeps ungrouped rows in one body', () => {
    const rows = [0, 1].map((i) => ({ _key: String(i), label: `Row ${i}`, cells: [] }))
    expect(groupRows(rows)).toHaveLength(1)
  })
})
