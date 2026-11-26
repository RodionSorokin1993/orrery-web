'use client'

/**
 * Sanity Studio, embedded in the site at /studio.
 * Marked as a client module so the server page can pass this config to <NextStudio>.
 */
import { CheckmarkCircleIcon } from '@sanity/icons/CheckmarkCircle'
import { documentInternationalization } from '@sanity/document-internationalization'
import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { defineLocations, presentationTool } from 'sanity/presentation'
import { structureTool } from 'sanity/structure'
import { locales, localeLabels } from './src/lib/i18n/config'
import { apiVersion, dataset, projectId, studioBasePath } from './src/sanity/env'
import { schemaTypes, translatedTypes } from './src/sanity/schemaTypes'
import { structure } from './src/sanity/structure'
import { ContentQaTool } from './src/sanity/tools/ContentQaTool'

const pageHref = (language?: string, slug?: string) =>
  `/${language ?? 'en'}${!slug || slug === 'home' ? '' : `/${slug}`}`

export default defineConfig({
  name: 'orrery',
  title: 'Orrery Labs',
  basePath: studioBasePath,
  projectId: projectId || 'not-configured',
  dataset,

  schema: {
    types: schemaTypes,
    // New translated documents are created through the language menu, so they always get a language.
    templates: (templates) =>
      templates.filter((template) => !translatedTypes.includes(template.id)),
  },

  plugins: [
    structureTool({ structure }),
    presentationTool({
      previewUrl: { previewMode: { enable: '/api/draft-mode/enable' } },
      resolve: {
        locations: {
          page: defineLocations({
            select: { title: 'title', slug: 'slug.current', language: 'language' },
            resolve: (doc) => ({
              locations: [
                { title: doc?.title ?? 'Untitled', href: pageHref(doc?.language, doc?.slug) },
              ],
            }),
          }),
          post: defineLocations({
            select: { title: 'title', slug: 'slug.current', language: 'language' },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title ?? 'Untitled',
                  href: `/${doc?.language ?? 'en'}/blog/${doc?.slug}`,
                },
              ],
            }),
          }),
        },
      },
    }),
    documentInternationalization({
      supportedLanguages: locales.map((id) => ({ id, title: localeLabels[id].native })),
      schemaTypes: translatedTypes,
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],

  tools: (tools) => [
    ...tools,
    {
      name: 'content-qa',
      title: 'Content QA',
      icon: CheckmarkCircleIcon,
      component: ContentQaTool,
    },
  ],
})
