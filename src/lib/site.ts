/** Site-wide constants that are not content. Content lives in the CMS. */
export const siteConfig = {
  name: 'Orrery Labs',
  author: {
    name: 'Rodion Sorokin',
    url: 'https://www.linkedin.com/in/rodion-sorokin-1a4bb2178/',
  },
  repositoryUrl:
    process.env.NEXT_PUBLIC_REPOSITORY_URL ?? 'https://github.com/rodion-sorokin/orrery-web',
}

/** Absolute origin used for canonical URLs, the sitemap and Open Graph. */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return explicit.replace(/\/$/, '')

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (vercel) return `https://${vercel}`

  return 'http://localhost:3000'
}
