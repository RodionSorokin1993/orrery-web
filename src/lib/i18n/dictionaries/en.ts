export const en = {
  a11y: {
    skipToContent: 'Skip to content',
    mainNavigation: 'Main navigation',
    footerNavigation: 'Footer navigation',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    home: 'Orrery Labs home',
  },
  locale: {
    label: 'Language',
    switchTo: 'Read this page in {language}',
  },
  theme: {
    label: 'Color theme',
    system: 'System theme',
    light: 'Light theme',
    dark: 'Dark theme',
  },
  blog: {
    title: 'Research',
    description:
      'Notes from the Orrery Labs team on models, evaluation and the interfaces around them.',
    readMore: 'Read the post',
    minutesRead: '{minutes} min read',
    by: 'By {author}',
    tags: 'Tags',
    backToIndex: 'All research',
    empty: 'No posts yet.',
  },
  chart: {
    series: 'Series',
    toggleSeries: 'Show or hide {series}',
    viewTable: 'View data as table',
    keyboardHint: 'Use the left and right arrow keys to move between data points.',
    readoutAt: 'At {x}',
    chartLabel: 'Interactive line chart: {title}',
  },
  notFound: {
    eyebrow: 'Error 404',
    title: 'This orbit is empty',
    body: 'The page you are looking for has moved or never existed.',
    cta: 'Back to home',
  },
  draft: {
    banner: 'You are previewing unpublished content.',
    exit: 'Exit preview',
  },
  footer: {
    fictionalNote:
      'Orrery Labs is a fictional company. This site is an open-source portfolio project; all numbers are illustrative.',
    builtBy: 'Designed and built by {author}.',
    sourceCode: 'Source code',
  },
} as const

type DeepString<T> = { [K in keyof T]: T[K] extends string ? string : DeepString<T[K]> }

export type Dictionary = DeepString<typeof en>
