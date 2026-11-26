export const locales = ['en', 'es'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'
export const localeCookie = 'NEXT_LOCALE'

export const localeLabels: Record<Locale, { native: string; short: string; intl: string }> = {
  en: { native: 'English', short: 'EN', intl: 'en-US' },
  es: { native: 'Español', short: 'ES', intl: 'es-ES' },
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value)
}
