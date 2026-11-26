import { CogIcon } from '@sanity/icons/Cog'
import { DocumentTextIcon } from '@sanity/icons/DocumentText'
import { EditIcon } from '@sanity/icons/Edit'
import { defineArrayMember, defineField, defineType } from 'sanity'
import { blockTypes } from './blocks'

/** Managed by @sanity/document-internationalization. Hidden from editors. */
const languageField = defineField({
  name: 'language',
  type: 'string',
  readOnly: true,
  hidden: true,
})

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    languageField,
    defineField({
      name: 'title',
      type: 'string',
      group: 'content',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'content',
      description: 'Use "home" for the home page.',
      options: { source: 'title', maxLength: 64 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'blocks',
      title: 'Page blocks',
      type: 'array',
      group: 'content',
      of: blockTypes.map((block) => defineArrayMember({ type: block.name })),
      options: {
        insertMenu: {
          views: [{ name: 'list' }],
        },
      },
      validation: (r) => r.required().min(1),
    }),
    defineField({ name: 'seo', type: 'seo', group: 'seo' }),
  ],
  preview: {
    select: { title: 'title', slug: 'slug.current', language: 'language' },
    prepare: ({ title, slug, language }) => ({
      title,
      subtitle: `${(language ?? '').toUpperCase()} · /${slug === 'home' ? '' : (slug ?? '')}`,
    }),
  },
})

export const post = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: EditIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    languageField,
    defineField({
      name: 'title',
      type: 'string',
      group: 'content',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'content',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'excerpt',
      type: 'text',
      rows: 3,
      group: 'content',
      validation: (r) => r.required().max(200),
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      group: 'content',
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'author',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'role', type: 'string' }),
      ],
    }),
    defineField({
      name: 'tags',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
    }),
    defineField({ name: 'body', type: 'portableText', group: 'content' }),
    defineField({ name: 'seo', type: 'seo', group: 'seo' }),
  ],
  orderings: [
    {
      title: 'Newest first',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'title', date: 'publishedAt', language: 'language' },
    prepare: ({ title, date, language }) => ({
      title,
      subtitle: `${(language ?? '').toUpperCase()} · ${date ? String(date).slice(0, 10) : 'Draft'}`,
    }),
  },
})

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    languageField,
    defineField({ name: 'siteName', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'tagline', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 3,
      description: 'Default description for search engines.',
      validation: (r) => r.required().max(160),
    }),
    defineField({
      name: 'navigation',
      title: 'Main navigation',
      type: 'array',
      of: [defineArrayMember({ type: 'link' })],
      validation: (r) => r.max(6),
    }),
    defineField({
      name: 'footerColumns',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'column',
          fields: [
            defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
            defineField({
              name: 'links',
              type: 'array',
              of: [defineArrayMember({ type: 'link' })],
            }),
          ],
          preview: { select: { title: 'title' } },
        }),
      ],
    }),
  ],
  preview: {
    select: { language: 'language' },
    prepare: ({ language }) => ({
      title: 'Site settings',
      subtitle: (language ?? '').toUpperCase(),
    }),
  },
})
