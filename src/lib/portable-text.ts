import type { PortableTextBlock } from 'next-sanity'

interface SpanLike {
  _type?: string
  text?: string
}

/** Concatenates the text of all spans, one block per line. */
export function toPlainText(blocks: PortableTextBlock[] | undefined): string {
  if (!blocks) return ''
  return blocks
    .map((block) =>
      Array.isArray(block.children)
        ? (block.children as SpanLike[]).map((child) => child.text ?? '').join('')
        : '',
    )
    .filter(Boolean)
    .join('\n')
}

export function countWords(text: string): number {
  const words = text.trim().split(/\s+/)
  return words[0] === '' ? 0 : words.length
}

/** Rounded up, never less than one minute. 220 words per minute is a common reading speed. */
export function readingMinutes(text: string, wordsPerMinute = 220): number {
  return Math.max(1, Math.ceil(countWords(text) / wordsPerMinute))
}

/** Stable, URL-safe id for headings, so long posts can be linked section by section. */
export function slugify(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
