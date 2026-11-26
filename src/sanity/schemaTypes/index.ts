import { blockTypes } from './blocks'
import { page, post, siteSettings } from './documents'
import { link, portableText, seo } from './objects'

export const schemaTypes = [page, post, siteSettings, link, seo, portableText, ...blockTypes]

/** Document types that exist once per language. */
export const translatedTypes: string[] = [page.name, post.name, siteSettings.name]
