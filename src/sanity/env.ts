/**
 * Sanity configuration shared by the site, the embedded Studio and scripts.
 * Uses relative imports only, because the Studio CLI does not resolve the `@/` alias.
 */
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ''
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = '2026-11-01'
export const studioBasePath = '/studio'

export const isSanityConfigured = projectId.length > 0
