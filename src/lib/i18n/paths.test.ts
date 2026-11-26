import { describe, expect, it } from 'vitest'
import { interpolate } from '.'
import { isExternalHref, localizeHref, pagePath, postPath, stripLocale } from './paths'

describe('localizeHref', () => {
  it('prefixes internal paths with the locale', () => {
    expect(localizeHref('/models', 'es')).toBe('/es/models')
    expect(localizeHref('models', 'en')).toBe('/en/models')
    expect(localizeHref('/', 'es')).toBe('/es')
  })

  it('leaves external links, anchors and localized paths alone', () => {
    expect(localizeHref('https://example.com', 'es')).toBe('https://example.com')
    expect(localizeHref('mailto:hi@example.com', 'es')).toBe('mailto:hi@example.com')
    expect(localizeHref('#section', 'es')).toBe('#section')
    expect(localizeHref('/en/blog', 'es')).toBe('/en/blog')
  })
})

describe('stripLocale', () => {
  it('removes the locale prefix', () => {
    expect(stripLocale('/es/blog/x')).toBe('/blog/x')
    expect(stripLocale('/en')).toBe('/')
    expect(stripLocale('/blog')).toBe('/blog')
  })
})

describe('paths', () => {
  it('maps the home slug to the root path', () => {
    expect(pagePath('home')).toBe('/')
    expect(pagePath('models')).toBe('/models')
    expect(postPath('hello')).toBe('/blog/hello')
  })

  it('detects external hrefs', () => {
    expect(isExternalHref('//cdn.example.com')).toBe(true)
    expect(isExternalHref('/about')).toBe(false)
  })
})

describe('interpolate', () => {
  it('replaces known placeholders and keeps unknown ones', () => {
    expect(interpolate('{minutes} min read, {unknown}', { minutes: 3 })).toBe(
      '3 min read, {unknown}',
    )
  })
})
