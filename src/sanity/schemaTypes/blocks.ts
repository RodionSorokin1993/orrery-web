import { BarChartIcon } from '@sanity/icons/BarChart'
import { BlockContentIcon } from '@sanity/icons/BlockContent'
import { DashboardIcon } from '@sanity/icons/Dashboard'
import { LaunchIcon } from '@sanity/icons/Launch'
import { NumberIcon } from '@sanity/icons/Number'
import { StarIcon } from '@sanity/icons/Star'
import { defineArrayMember, defineField, defineType } from 'sanity'
import { validateChartSpec } from '../../content-qa/chart'
import type { ChartSpec } from '../../content/types'

const VALUE_FORMATS = [
  { title: 'Number', value: 'number' },
  { title: 'Percent (0.5 = 50%)', value: 'percent' },
  { title: 'Tokens (compact, 8K)', value: 'tokens' },
  { title: 'Milliseconds', value: 'ms' },
  { title: 'US dollars', value: 'usd' },
]

export const hero = defineType({
  name: 'hero',
  title: 'Hero',
  type: 'object',
  icon: StarIcon,
  description: 'Page opener. Renders the only h1 on the page, so use it once, at the top.',
  fields: [
    defineField({ name: 'eyebrow', type: 'string', validation: (rule) => rule.max(40) }),
    defineField({
      name: 'heading',
      type: 'string',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({ name: 'subheading', type: 'text', rows: 3, validation: (rule) => rule.max(220) }),
    defineField({ name: 'primaryCta', title: 'Primary button', type: 'link' }),
    defineField({ name: 'secondaryCta', title: 'Secondary button', type: 'link' }),
    defineField({
      name: 'patternSeed',
      title: 'Artwork seed',
      type: 'string',
      description:
        'Any word. The orrery artwork is generated from it, so the same seed always gives the same picture.',
    }),
  ],
  preview: {
    select: { title: 'heading', subtitle: 'eyebrow' },
    prepare: ({ title, subtitle }) => ({
      title,
      subtitle: subtitle ? `Hero · ${subtitle}` : 'Hero',
    }),
  },
})

export const featureGrid = defineType({
  name: 'featureGrid',
  title: 'Feature grid',
  type: 'object',
  icon: DashboardIcon,
  fields: [
    defineField({ name: 'heading', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'intro', type: 'text', rows: 2 }),
    defineField({
      name: 'features',
      type: 'array',
      validation: (rule) => rule.required().min(2).max(6),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'feature',
          fields: [
            defineField({ name: 'title', type: 'string', validation: (rule) => rule.required() }),
            defineField({
              name: 'body',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required().max(180),
            }),
            defineField({
              name: 'icon',
              type: 'string',
              initialValue: 'orbit',
              options: {
                list: ['orbit', 'gauge', 'shield', 'layers', 'spark', 'compass'],
                layout: 'radio',
                direction: 'horizontal',
              },
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: 'title', subtitle: 'icon' } },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'heading', count: 'features.length' },
    prepare: ({ title, count }) => ({ title, subtitle: `Feature grid · ${count ?? 0} features` }),
  },
})

export const chartBlock = defineType({
  name: 'chartBlock',
  title: 'Interactive chart',
  type: 'object',
  icon: BarChartIcon,
  fields: [
    defineField({ name: 'heading', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'intro', type: 'text', rows: 2 }),
    defineField({
      name: 'chart',
      type: 'object',
      validation: (rule) =>
        rule.custom((value) => {
          const problems = validateChartSpec(value as Partial<ChartSpec> | undefined)
          return problems.length === 0 ? true : problems.join(' ')
        }),
      fields: [
        defineField({
          name: 'xLabel',
          title: 'X axis label',
          type: 'string',
          validation: (r) => r.required(),
        }),
        defineField({
          name: 'yLabel',
          title: 'Y axis label',
          type: 'string',
          validation: (r) => r.required(),
        }),
        defineField({
          name: 'xScale',
          title: 'X scale',
          type: 'string',
          initialValue: 'linear',
          options: { list: ['linear', 'log'], layout: 'radio', direction: 'horizontal' },
        }),
        defineField({
          name: 'xFormat',
          title: 'X value format',
          type: 'string',
          initialValue: 'number',
          options: { list: VALUE_FORMATS },
        }),
        defineField({
          name: 'yFormat',
          title: 'Y value format',
          type: 'string',
          initialValue: 'number',
          options: { list: VALUE_FORMATS },
        }),
        defineField({
          name: 'series',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'series',
              fields: [
                defineField({ name: 'label', type: 'string', validation: (r) => r.required() }),
                defineField({
                  name: 'key',
                  type: 'string',
                  description: 'Short id, unique within this chart. Used for colors and toggles.',
                  validation: (r) => r.required(),
                }),
                defineField({
                  name: 'points',
                  type: 'array',
                  of: [
                    defineArrayMember({
                      type: 'object',
                      name: 'point',
                      fields: [
                        defineField({ name: 'x', type: 'number', validation: (r) => r.required() }),
                        defineField({ name: 'y', type: 'number', validation: (r) => r.required() }),
                      ],
                      preview: {
                        select: { x: 'x', y: 'y' },
                        prepare: ({ x, y }) => ({ title: `x: ${x}  ·  y: ${y}` }),
                      },
                    }),
                  ],
                }),
              ],
              preview: {
                select: { title: 'label', count: 'points.length' },
                prepare: ({ title, count }) => ({ title, subtitle: `${count ?? 0} points` }),
              },
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'takeaway',
      type: 'text',
      rows: 2,
      description: 'The one sentence a reader should remember.',
    }),
    defineField({
      name: 'note',
      type: 'string',
      description: 'Source or disclaimer, for example "Illustrative data".',
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title, subtitle: 'Interactive chart' }),
  },
})

export const stats = defineType({
  name: 'stats',
  title: 'Stats',
  type: 'object',
  icon: NumberIcon,
  fields: [
    defineField({ name: 'heading', type: 'string' }),
    defineField({
      name: 'items',
      type: 'array',
      validation: (rule) => rule.required().min(1).max(4),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'stat',
          fields: [
            defineField({ name: 'value', type: 'string', validation: (r) => r.required().max(8) }),
            defineField({ name: 'label', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'detail', type: 'string' }),
          ],
          preview: { select: { title: 'value', subtitle: 'label' } },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'heading', count: 'items.length' },
    prepare: ({ title, count }) => ({ title: title || 'Stats', subtitle: `${count ?? 0} figures` }),
  },
})

export const richText = defineType({
  name: 'richText',
  title: 'Rich text',
  type: 'object',
  icon: BlockContentIcon,
  fields: [defineField({ name: 'content', type: 'portableText', validation: (r) => r.required() })],
  preview: { prepare: () => ({ title: 'Rich text' }) },
})

export const cta = defineType({
  name: 'cta',
  title: 'Call to action',
  type: 'object',
  icon: LaunchIcon,
  fields: [
    defineField({ name: 'heading', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'body', type: 'text', rows: 2 }),
    defineField({ name: 'link', type: 'link', validation: (r) => r.required() }),
  ],
  preview: {
    select: { title: 'heading', subtitle: 'link.href' },
    prepare: ({ title, subtitle }) => ({ title, subtitle: `Call to action → ${subtitle ?? ''}` }),
  },
})

export const blockTypes = [hero, featureGrid, chartBlock, stats, richText, cta]
