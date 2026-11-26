import { localeLabels, type Locale } from './config'

export function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(localeLabels[locale].intl, {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(new Date(iso))
}

export type ValueFormat = 'number' | 'percent' | 'tokens' | 'ms' | 'usd'

/** Formats chart and stats values with Intl, so separators follow the locale. */
export function formatValue(value: number, format: ValueFormat, locale: Locale): string {
  const intl = localeLabels[locale].intl

  switch (format) {
    case 'percent':
      return new Intl.NumberFormat(intl, { style: 'percent', maximumFractionDigits: 1 }).format(
        value,
      )
    case 'tokens':
      return new Intl.NumberFormat(intl, { notation: 'compact', maximumFractionDigits: 1 }).format(
        value,
      )
    case 'ms':
      return new Intl.NumberFormat(intl, {
        style: 'unit',
        unit: 'millisecond',
        unitDisplay: 'short',
        maximumFractionDigits: 0,
      }).format(value)
    case 'usd':
      return new Intl.NumberFormat(intl, {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2,
      }).format(value)
    default:
      return new Intl.NumberFormat(intl, { maximumFractionDigits: 2 }).format(value)
  }
}
