import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { fixtureContent } from '@/content/fixtures'
import type { ChartBlock } from '@/content/types'
import { en } from '@/lib/i18n/dictionaries/en'
import { LineChart } from './LineChart'

const block = fixtureContent.en.pages
  .find((page) => page.slug === 'home')!
  .blocks.find((b): b is ChartBlock => b._type === 'chartBlock')!

function renderChart() {
  const user = userEvent.setup()
  render(<LineChart spec={block.chart} locale="en" title={block.heading} labels={en.chart} />)
  const plot = screen.getByRole('group', { name: `Interactive line chart: ${block.heading}` })
  const readout = document.querySelector('[aria-live="polite"]') as HTMLElement
  return { user, plot, readout }
}

describe('LineChart (spec 003)', () => {
  it('moves between points with the keyboard and announces values (AC2)', async () => {
    const { user, plot, readout } = renderChart()

    // Three legend buttons, then the plot: the same path a keyboard user takes.
    await user.tab()
    await user.tab()
    await user.tab()
    await user.tab()
    expect(plot).toHaveFocus()
    expect(readout).toHaveTextContent('At 1K')
    expect(readout).toHaveTextContent('Apogee 62%')

    await user.keyboard('{ArrowRight}')
    expect(readout).toHaveTextContent('At 2K')

    await user.keyboard('{End}')
    expect(readout).toHaveTextContent('At 64K')
    expect(readout).toHaveTextContent('Perigee 57.2%')

    await user.keyboard('{Home}')
    expect(readout).toHaveTextContent('At 1K')
  })

  it('toggles series from the legend but keeps the last one visible (AC3)', async () => {
    const { user, plot, readout } = renderChart()
    const perigee = screen.getByRole('button', { name: 'Show or hide Perigee' })
    const meridian = screen.getByRole('button', { name: 'Show or hide Meridian' })
    const apogee = screen.getByRole('button', { name: 'Show or hide Apogee' })

    await user.click(perigee)
    expect(perigee).toHaveAttribute('aria-pressed', 'false')

    await user.tab() // from the last legend button to the plot
    expect(plot).toHaveFocus()
    expect(readout).toHaveTextContent('Apogee')
    expect(readout).not.toHaveTextContent('Perigee')

    await user.click(meridian)
    await user.click(apogee)
    expect(apogee).toHaveAttribute('aria-pressed', 'true')
    expect(document.querySelectorAll('path')).toHaveLength(1)
  })

  it('offers the same data as an accessible table (AC4)', () => {
    renderChart()
    const table = screen.getByRole('table', { name: block.heading })
    const rows = within(table).getAllByRole('row')
    expect(rows).toHaveLength(block.chart.series[0]!.points.length + 1)
    expect(
      within(rows[0]!)
        .getAllByRole('columnheader')
        .map((th) => th.textContent),
    ).toEqual(['Reasoning budget (tokens)', 'Apogee', 'Meridian', 'Perigee'])
    expect(within(rows[1]!).getByRole('rowheader')).toHaveTextContent('1K')
  })

  it('formats values for the locale', () => {
    render(<LineChart spec={block.chart} locale="es" title={block.heading} labels={en.chart} />)
    const table = screen.getByRole('table')
    expect(within(table).getAllByRole('cell')[0]).toHaveTextContent('62 %')
  })
})
