import 'server-only'
import { createClient, type SanityClient } from 'next-sanity'
import { apiVersion, dataset, isSanityConfigured, projectId, studioBasePath } from './env'

/** Published content through the CDN. `null` when the project is not configured. */
export const client: SanityClient | null = isSanityConfigured
  ? createClient({ projectId, dataset, apiVersion, useCdn: true, perspective: 'published' })
  : null

/** Drafts for Draft Mode. Needs a viewer token, which never reaches the browser. */
export function getPreviewClient(): SanityClient | null {
  const token = process.env.SANITY_API_READ_TOKEN
  if (!client || !token) return null
  return client.withConfig({
    token,
    useCdn: false,
    perspective: 'drafts',
    stega: { enabled: false, studioUrl: studioBasePath },
  })
}
