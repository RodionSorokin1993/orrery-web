import { describe, expect, it } from 'vitest'
import { createPortableText } from '@/content/fixtures/pt'
import { countWords, readingMinutes, slugify, toPlainText } from './portable-text'

describe('portable text helpers', () => {
  const pt = createPortableText('t')

  it('parses links, bold and italic inline syntax', () => {
    const block = pt.p('Read the [models page](/models) for **all** the *details*.') as unknown as {
      children: { text: string; marks: string[] }[]
      markDefs: { href: string; _key: string }[]
    }
    expect(block.children.map((child) => child.text)).toEqual([
      'Read the ',
      'models page',
      ' for ',
      'all',
      ' the ',
      'details',
      '.',
    ])
    expect(block.markDefs[0]?.href).toBe('/models')
    expect(block.children[1]?.marks).toEqual([block.markDefs[0]?._key])
    expect(block.children[3]?.marks).toEqual(['strong'])
    expect(block.children[5]?.marks).toEqual(['em'])
  })

  it('extracts plain text and estimates reading time', () => {
    const text = toPlainText([pt.h2('Title'), pt.p('one two three')])
    expect(text).toBe('Title\none two three')
    expect(countWords(text)).toBe(4)
    expect(readingMinutes(text)).toBe(1)
    expect(readingMinutes('word '.repeat(660))).toBe(3)
  })

  it('slugifies headings, including accented characters', () => {
    expect(slugify('Qué hay de nuevo?')).toBe('que-hay-de-nuevo')
  })
})
