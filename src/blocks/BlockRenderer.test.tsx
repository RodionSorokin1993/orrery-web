import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { fixtureContent } from '@/content/fixtures'
import type { Block } from '@/content/types'
import { getDictionary } from '@/lib/i18n'
import { BlockRenderer } from './BlockRenderer'

const home = fixtureContent.en.pages.find((page) => page.slug === 'home')!
const about = fixtureContent.en.pages.find((page) => page.slug === 'about')!

function renderBlocks(blocks: Block[]) {
  return render(
    <BlockRenderer blocks={blocks} locale="en" dictionary={getDictionary('en')} seed="test" />,
  )
}

describe('BlockRenderer (spec 001)', () => {
  it('renders every block type of the home page (AC2)', () => {
    renderBlocks(home.blocks)

    expect(screen.getByRole('heading', { level: 1, name: 'AI that shows its work.' })).toBeVisible()
    expect(screen.getByRole('heading', { level: 2, name: /Built to be checked/ })).toBeVisible()
    expect(screen.getByRole('group', { name: /Interactive line chart/ })).toBeVisible()
    expect(screen.getByText('calibration error')).toBeVisible()
    expect(screen.getByRole('link', { name: /Compare models/ })).toHaveAttribute(
      'href',
      '/en/models',
    )
  })

  it('renders rich text with localized links', () => {
    renderBlocks(about.blocks)
    expect(screen.getByRole('link', { name: 'research notes' })).toHaveAttribute('href', '/en/blog')
    expect(screen.getByRole('heading', { level: 2, name: 'What we believe' })).toHaveAttribute(
      'id',
      'what-we-believe',
    )
  })

  it('skips unknown block types instead of breaking the page (AC3)', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const unknown = { _key: 'x', _type: 'carousel' } as unknown as Block
    const { container } = renderBlocks([unknown])
    expect(container).toBeEmptyDOMElement()
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('carousel'))
    warn.mockRestore()
  })
})
