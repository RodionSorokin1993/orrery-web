import { LinkIcon } from '@sanity/icons/Link'
import { SearchIcon } from '@sanity/icons/Search'
import { defineField, defineType } from 'sanity'

const HREF = /^(\/[\w\-./]*|https:\/\/\S+|mailto:\S+)$/

export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'label',
      type: 'string',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'href',
      title: 'URL or path',
      type: 'string',
      description: 'Internal path without the language, like /models, or a full https:// URL.',
      validation: (rule) =>
        rule
          .required()
          .custom((value) =>
            typeof value === 'string' && HREF.test(value)
              ? true
              : 'Use a path that starts with / or a full https:// URL',
          ),
    }),
  ],
  preview: { select: { title: 'label', subtitle: 'href' } },
})

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  icon: SearchIcon,
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      description: 'Shown in search results and browser tabs. Up to 60 characters.',
      validation: (rule) => rule.max(60).warning('Search engines cut titles after ~60 characters'),
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 3,
      description: '50 to 160 characters. Shown under the title in search results.',
      validation: (rule) => [
        rule.min(50).warning('Short descriptions are often replaced by search engines'),
        rule.max(160).warning('Long descriptions get cut off in search results'),
      ],
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})

/** Rich text used by posts and the Rich text block. */
export const portableText = defineType({
  name: 'portableText',
  title: 'Rich text',
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [
        { title: 'Paragraph', value: 'normal' },
        { title: 'Heading 2', value: 'h2' },
        { title: 'Heading 3', value: 'h3' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              {
                name: 'href',
                type: 'string',
                title: 'URL or path',
                validation: (rule) => rule.required(),
              },
            ],
          },
        ],
      },
    },
  ],
})
