import { defineQuery } from 'next-sanity'

/** Translation metadata written by @sanity/document-internationalization. */
const translations = /* groq */ `
  "translations": *[_type == "translation.metadata" && references(^._id)][0].translations[]{
    "language": coalesce(language, _key),
    "slug": value->slug.current
  }
`

const pageFields = /* groq */ `
  _id,
  _type,
  language,
  title,
  "slug": slug.current,
  seo,
  "blocks": coalesce(blocks, []),
  ${translations}
`

const postSummaryFields = /* groq */ `
  _id,
  _type,
  language,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  author,
  "tags": coalesce(tags, []),
  "plainText": pt::text(body)
`

const postFields = /* groq */ `
  ${postSummaryFields},
  body,
  seo,
  ${translations}
`

const settingsFields = /* groq */ `
  _id,
  _type,
  language,
  siteName,
  tagline,
  description,
  "navigation": coalesce(navigation, []),
  "footerColumns": coalesce(footerColumns, [])
`

export const SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings" && language == $locale][0]{ ${settingsFields} }
`)

export const PAGE_QUERY = defineQuery(`
  *[_type == "page" && language == $locale && slug.current == $slug][0]{ ${pageFields} }
`)

export const PAGE_SLUGS_QUERY = defineQuery(`
  *[_type == "page" && language == $locale && defined(slug.current)].slug.current
`)

export const POSTS_QUERY = defineQuery(`
  *[_type == "post" && language == $locale && defined(slug.current)]
    | order(publishedAt desc){ ${postSummaryFields} }
`)

export const POST_QUERY = defineQuery(`
  *[_type == "post" && language == $locale && slug.current == $slug][0]{ ${postFields} }
`)

export const POST_SLUGS_QUERY = defineQuery(`
  *[_type == "post" && language == $locale && defined(slug.current)].slug.current
`)

export const SNAPSHOT_QUERY = defineQuery(`{
  "settings": *[_type == "siteSettings" && language == $locale][0]{ ${settingsFields} },
  "pages": *[_type == "page" && language == $locale && defined(slug.current)]{ ${pageFields} },
  "posts": *[_type == "post" && language == $locale && defined(slug.current)]{ ${postFields} }
}`)
