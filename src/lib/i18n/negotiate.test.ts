import { describe, expect, it } from 'vitest'
import { negotiateLocale, parseAcceptLanguage } from './negotiate'

describe('parseAcceptLanguage', () => {
  it('sorts by quality and keeps header order on ties', () => {
    expect(parseAcceptLanguage('fr;q=0.5, es-MX, es;q=0.9, en')).toEqual([
      'es-mx',
      'en',
      'es',
      'fr',
    ])
  })

  it('ignores wildcards, zero quality and garbage', () => {
    expect(parseAcceptLanguage('*, de;q=0, ;q=1, en;q=abc')).toEqual([])
  })

  it('handles an empty header', () => {
    expect(parseAcceptLanguage(null)).toEqual([])
    expect(parseAcceptLanguage('')).toEqual([])
  })
})

describe('negotiateLocale (spec 002, AC1)', () => {
  it('matches a regional tag to its base language', () => {
    expect(negotiateLocale({ acceptLanguage: 'es-MX,es;q=0.9' })).toBe('es')
  })

  it('prefers the cookie over the browser language', () => {
    expect(negotiateLocale({ cookie: 'en', acceptLanguage: 'es-ES' })).toBe('en')
  })

  it('ignores an unsupported cookie value', () => {
    expect(negotiateLocale({ cookie: 'fr', acceptLanguage: 'es' })).toBe('es')
  })

  it('falls back to the default locale', () => {
    expect(negotiateLocale({ acceptLanguage: 'de-DE,fr;q=0.8' })).toBe('en')
    expect(negotiateLocale({})).toBe('en')
  })
})
