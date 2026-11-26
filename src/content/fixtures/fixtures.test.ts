import { describe, expect, it } from 'vitest'
import { locales } from '@/lib/i18n/config'
import { localizeHref, pagePath, postPath } from '@/lib/i18n/paths'
import { fixtureContent } from '.'

describe('fixtures', () => {
  it('ship every document in every locale', () => {
    const [first, ...rest] = locales.map((locale) => fixtureContent[locale])
    for (const other of rest) {
      expect(other.pages).toHaveLength(first!.pages.length)
      expect(other.posts).toHaveLength(first!.posts.length)
    }
  })

  it('link each translation to a document that exists', () => {
    for (const locale of locales) {
      const { pages, posts } = fixtureContent[locale]
      for (const doc of [...pages, ...posts]) {
        for (const target of locales) {
          const path = doc.translations[target]
          expect(path, `${doc._id} → ${target}`).toBeDefined()
          const exists =
            fixtureContent[target].pages.some((p) => pagePath(p.slug) === path) ||
            fixtureContent[target].posts.some((p) => postPath(p.slug) === path)
          expect(exists, localizeHref(path!, target)).toBe(true)
        }
      }
    }
  })

  it('have unique document ids', () => {
    const ids = locales.flatMap((locale) => [
      fixtureContent[locale].settings._id,
      ...fixtureContent[locale].pages.map((p) => p._id),
      ...fixtureContent[locale].posts.map((p) => p._id),
    ])
    expect(new Set(ids).size).toBe(ids.length)
  })
})
