import 'server-only'
import { cacheLife, cacheTag } from 'next/cache'
import { draftMode } from 'next/headers'
import { client, getPreviewClient } from '@/sanity/client'
import { fixtureSource } from './fixture-source'
import { createSanitySource } from './sanity-source'
import type { ContentSource } from './source-types'
import { tags } from './tags'
import type { Locale } from './types'

export type * from './types'

/**
 * Picks the content source for this request. Reading Draft Mode inside `'use cache'` is allowed;
 * when it is enabled, Next.js re-runs these functions on every request and never stores the result.
 */
async function resolveSource(): Promise<ContentSource> {
  if (!client) return fixtureSource

  const { isEnabled } = await draftMode()
  const preview = isEnabled ? getPreviewClient() : null
  return createSanitySource(preview ?? client)
}

export async function getSettings(locale: Locale) {
  'use cache'
  cacheLife('max')
  cacheTag(tags.all, tags.settings(locale))
  return (await resolveSource()).getSettings(locale)
}

export async function getPage(locale: Locale, slug: string) {
  'use cache'
  cacheLife('max')
  cacheTag(tags.all, tags.page(locale, slug))
  return (await resolveSource()).getPage(locale, slug)
}

export async function getPageSlugs(locale: Locale) {
  'use cache'
  cacheLife('max')
  cacheTag(tags.all, tags.pages(locale))
  return (await resolveSource()).getPageSlugs(locale)
}

export async function getPosts(locale: Locale) {
  'use cache'
  cacheLife('max')
  cacheTag(tags.all, tags.posts(locale))
  return (await resolveSource()).getPosts(locale)
}

export async function getPost(locale: Locale, slug: string) {
  'use cache'
  cacheLife('max')
  cacheTag(tags.all, tags.post(locale, slug))
  return (await resolveSource()).getPost(locale, slug)
}

export async function getPostSlugs(locale: Locale) {
  'use cache'
  cacheLife('max')
  cacheTag(tags.all, tags.posts(locale))
  return (await resolveSource()).getPostSlugs(locale)
}

export async function getSnapshot() {
  'use cache'
  cacheLife('max')
  cacheTag(tags.all)
  return (await resolveSource()).getSnapshot()
}
