import { type Locale } from './config'
import { en, type Dictionary } from './dictionaries/en'
import { es } from './dictionaries/es'

export * from './config'
export type { Dictionary }

const dictionaries: Record<Locale, Dictionary> = { en, es }

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale]
}

/** Replaces `{name}` placeholders. Unknown placeholders are left untouched. */
export function interpolate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  )
}
