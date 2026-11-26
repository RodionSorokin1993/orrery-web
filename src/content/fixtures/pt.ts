import type { PortableTextBlock } from 'next-sanity'

/**
 * Tiny builders that keep fixture content readable. Inline syntax supported in text:
 * `[label](/path)` for links, `**bold**` for strong emphasis and `*italic*` for emphasis.
 */

type Style = 'normal' | 'h2' | 'h3' | 'blockquote'

interface MarkDef {
  _type: 'link'
  _key: string
  href: string
}

interface Span {
  _type: 'span'
  _key: string
  text: string
  marks: string[]
}

const INLINE = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g

export function createPortableText(prefix: string) {
  let counter = 0
  const key = () => `${prefix}-${(counter++).toString(36)}`

  function parseInline(text: string): { children: Span[]; markDefs: MarkDef[] } {
    const children: Span[] = []
    const markDefs: MarkDef[] = []
    let last = 0

    for (const match of text.matchAll(INLINE)) {
      const index = match.index ?? 0
      if (index > last) {
        children.push({ _type: 'span', _key: key(), text: text.slice(last, index), marks: [] })
      }

      const [, linkText, href, bold, italic] = match
      if (linkText !== undefined && href !== undefined) {
        const markKey = key()
        markDefs.push({ _type: 'link', _key: markKey, href })
        children.push({ _type: 'span', _key: key(), text: linkText, marks: [markKey] })
      } else if (bold !== undefined) {
        children.push({ _type: 'span', _key: key(), text: bold, marks: ['strong'] })
      } else if (italic !== undefined) {
        children.push({ _type: 'span', _key: key(), text: italic, marks: ['em'] })
      }
      last = index + match[0].length
    }

    if (last < text.length || children.length === 0) {
      children.push({ _type: 'span', _key: key(), text: text.slice(last), marks: [] })
    }
    return { children, markDefs }
  }

  function textBlock(text: string, style: Style): PortableTextBlock {
    return {
      _type: 'block',
      _key: key(),
      style,
      ...parseInline(text),
    } as unknown as PortableTextBlock
  }

  function listBlocks(items: string[], listItem: 'bullet' | 'number'): PortableTextBlock[] {
    return items.map(
      (item) =>
        ({
          _type: 'block',
          _key: key(),
          style: 'normal',
          listItem,
          level: 1,
          ...parseInline(item),
        }) as unknown as PortableTextBlock,
    )
  }

  return {
    p: (text: string) => textBlock(text, 'normal'),
    h2: (text: string) => textBlock(text, 'h2'),
    h3: (text: string) => textBlock(text, 'h3'),
    quote: (text: string) => textBlock(text, 'blockquote'),
    bullets: (...items: string[]) => listBlocks(items, 'bullet'),
    numbers: (...items: string[]) => listBlocks(items, 'number'),
  }
}
