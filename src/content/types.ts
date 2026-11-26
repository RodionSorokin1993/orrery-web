import type { PortableTextBlock } from 'next-sanity'
import type { Locale } from '../lib/i18n/config'
import type { ValueFormat } from '../lib/i18n/format'

export type { Locale, PortableTextBlock }

export interface Link {
  label: string
  /** Internal path without locale (`/models`) or an absolute URL. */
  href: string
}

export interface Seo {
  title?: string
  description?: string
  noIndex?: boolean
}

/** Locale to path (without locale prefix) of every available translation. */
export type Translations = Partial<Record<Locale, string>>

interface BlockBase<T extends string> {
  _key: string
  _type: T
}

export interface HeroBlock extends BlockBase<'hero'> {
  eyebrow?: string
  heading: string
  subheading?: string
  primaryCta?: Link
  secondaryCta?: Link
  patternSeed?: string
}

export type FeatureIcon = 'orbit' | 'gauge' | 'shield' | 'layers' | 'spark' | 'compass'

export interface Feature {
  _key: string
  title: string
  body: string
  icon: FeatureIcon
}

export interface FeatureGridBlock extends BlockBase<'featureGrid'> {
  heading: string
  intro?: string
  features: Feature[]
}

export interface ChartPoint {
  _key?: string
  x: number
  y: number
}

export interface ChartSeries {
  _key: string
  key: string
  label: string
  points: ChartPoint[]
}

export interface ChartSpec {
  xLabel: string
  yLabel: string
  xScale: 'linear' | 'log'
  xFormat: ValueFormat
  yFormat: ValueFormat
  series: ChartSeries[]
}

export interface ChartBlock extends BlockBase<'chartBlock'> {
  heading: string
  intro?: string
  chart: ChartSpec
  takeaway?: string
  note?: string
}

export interface StatItem {
  _key: string
  value: string
  label: string
  detail?: string
}

export interface StatsBlock extends BlockBase<'stats'> {
  heading?: string
  items: StatItem[]
}

export interface RichTextBlock extends BlockBase<'richText'> {
  content: PortableTextBlock[]
}

export interface CtaBlock extends BlockBase<'cta'> {
  heading: string
  body?: string
  link: Link
}

export type Block =
  HeroBlock | FeatureGridBlock | ChartBlock | StatsBlock | RichTextBlock | CtaBlock

export type BlockType = Block['_type']

export interface Page {
  _id: string
  _type: 'page'
  language: Locale
  title: string
  slug: string
  seo?: Seo
  blocks: Block[]
  translations: Translations
}

export interface Author {
  name: string
  role?: string
}

export interface PostSummary {
  _id: string
  _type: 'post'
  language: Locale
  title: string
  slug: string
  excerpt: string
  publishedAt: string
  author: Author
  tags: string[]
  readingMinutes: number
}

export interface Post extends PostSummary {
  body: PortableTextBlock[]
  seo?: Seo
  translations: Translations
}

export interface NavigationColumn {
  _key: string
  title: string
  links: (Link & { _key: string })[]
}

export interface SiteSettings {
  _id: string
  _type: 'siteSettings'
  language: Locale
  siteName: string
  tagline: string
  description: string
  navigation: (Link & { _key: string })[]
  footerColumns: NavigationColumn[]
}

/** Everything the site knows for one locale. Used by Content QA, sitemap and the seed script. */
export interface LocaleContent {
  settings: SiteSettings
  pages: Page[]
  posts: Post[]
}

export type ContentSnapshot = Record<Locale, LocaleContent>
