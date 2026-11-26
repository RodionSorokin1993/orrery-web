import type { Block, Page, Post, SiteSettings } from '../types'
import { createPortableText } from './pt'

type PageInput = Omit<Page, '_id' | '_type' | 'language' | 'translations'>
type PostInput = Omit<Post, '_id' | '_type' | 'language' | 'translations' | 'readingMinutes'>

const apogee = { key: 'apogee', label: 'Apogee' }
const meridian = { key: 'meridian', label: 'Meridian' }
const perigee = { key: 'perigee', label: 'Perigee' }

const budget = [1000, 2000, 4000, 8000, 16000, 32000, 64000]
const promptLength = [500, 2000, 8000, 32000, 128000]

function series(id: string, model: { key: string; label: string }, xs: number[], ys: number[]) {
  return {
    _key: `${id}-${model.key}`,
    key: model.key,
    label: model.label,
    points: xs.map((x, i) => ({ _key: `${id}-${model.key}-${i}`, x, y: ys[i] ?? 0 })),
  }
}

export const settings: Omit<SiteSettings, '_id' | '_type' | 'language'> = {
  siteName: 'Orrery Labs',
  tagline: 'AI that shows its work.',
  description:
    'Orrery Labs builds language models that expose their reasoning as inspectable traces, so teams can verify an answer before they ship it.',
  navigation: [
    { _key: 'nav-models', label: 'Models', href: '/models' },
    { _key: 'nav-research', label: 'Research', href: '/blog' },
    { _key: 'nav-about', label: 'About', href: '/about' },
  ],
  footerColumns: [
    {
      _key: 'col-product',
      title: 'Product',
      links: [
        { _key: 'f-models', label: 'Models', href: '/models' },
        { _key: 'f-research', label: 'Research', href: '/blog' },
      ],
    },
    {
      _key: 'col-company',
      title: 'Company',
      links: [
        { _key: 'f-about', label: 'About', href: '/about' },
        { _key: 'f-launch', label: 'Introducing Apogee', href: '/blog/introducing-apogee' },
      ],
    },
  ],
}

const homeBlocks: Block[] = [
  {
    _key: 'home-hero',
    _type: 'hero',
    eyebrow: 'Orrery Labs',
    heading: 'AI that shows its work.',
    subheading:
      'Orrery models expose their reasoning as inspectable traces, so your team can check an answer before it reaches a customer.',
    primaryCta: { label: 'Explore the models', href: '/models' },
    secondaryCta: { label: 'Read the research', href: '/blog' },
    patternSeed: 'home',
  },
  {
    _key: 'home-features',
    _type: 'featureGrid',
    heading: 'Built to be checked, not just trusted',
    intro:
      'Every Orrery model is designed around one idea: an answer is only useful if you can verify it.',
    features: [
      {
        _key: 'f1',
        icon: 'orbit',
        title: 'Inspectable reasoning',
        body: 'Each answer comes with a structured trace of the steps behind it. Reviewers follow the logic instead of guessing at it.',
      },
      {
        _key: 'f2',
        icon: 'gauge',
        title: 'Calibrated confidence',
        body: 'When an Orrery model says it is 80% sure, it is right about 80% of the time. Route the rest to a person.',
      },
      {
        _key: 'f3',
        icon: 'shield',
        title: 'Private by default',
        body: 'Run in your own cloud account. Prompts and outputs never leave it, and we never train on your data.',
      },
      {
        _key: 'f4',
        icon: 'layers',
        title: 'Long context, kept tidy',
        body: 'Up to a million tokens of context, with citations that point to the exact passage an answer relied on.',
      },
    ],
  },
  {
    _key: 'home-chart',
    _type: 'chartBlock',
    heading: 'More reasoning, better answers, up to a point',
    intro:
      'Accuracy on a multi-step reasoning benchmark as each model gets a larger reasoning budget. Hover or use the arrow keys to compare.',
    chart: {
      xLabel: 'Reasoning budget (tokens)',
      yLabel: 'Accuracy',
      xScale: 'log',
      xFormat: 'tokens',
      yFormat: 'percent',
      series: [
        series('budget', apogee, budget, [0.62, 0.69, 0.75, 0.8, 0.84, 0.865, 0.875]),
        series('budget', meridian, budget, [0.55, 0.61, 0.67, 0.71, 0.735, 0.75, 0.755]),
        series('budget', perigee, budget, [0.44, 0.49, 0.53, 0.555, 0.565, 0.57, 0.572]),
      ],
    },
    takeaway:
      'Apogee keeps improving as the budget grows. Perigee levels off early, which makes it the right choice for quick, simple tasks.',
    note: 'Illustrative data for a fictional product.',
  },
  {
    _key: 'home-stats',
    _type: 'stats',
    heading: 'Orrery in numbers',
    items: [
      {
        _key: 's1',
        value: '3',
        label: 'model sizes',
        detail: 'From Perigee for instant replies to Apogee for deep analysis.',
      },
      {
        _key: 's2',
        value: '1M',
        label: 'tokens of context',
        detail: 'With citations down to the passage.',
      },
      {
        _key: 's3',
        value: '<3%',
        label: 'calibration error',
        detail: 'Expected calibration error on held-out evaluations.',
      },
    ],
  },
  {
    _key: 'home-cta',
    _type: 'cta',
    heading: 'See how the models compare',
    body: 'Pick the right model for each task, from instant replies to careful, multi-step analysis.',
    link: { label: 'Compare models', href: '/models' },
  },
]

const about = createPortableText('about')

export const pages: PageInput[] = [
  {
    title: 'Home',
    slug: 'home',
    seo: {
      title: 'Orrery Labs: AI that shows its work',
      description:
        'Language models that expose their reasoning as inspectable traces, so teams can verify an answer before they ship it.',
    },
    blocks: homeBlocks,
  },
  {
    title: 'Models',
    slug: 'models',
    seo: {
      title: 'Models',
      description:
        'Perigee, Meridian and Apogee: three Orrery models with the same inspectable traces. Choose by speed and depth.',
    },
    blocks: [
      {
        _key: 'models-hero',
        _type: 'hero',
        eyebrow: 'The Orrery family',
        heading: 'Three models, one way of thinking',
        subheading:
          'Every Orrery model produces the same inspectable traces. Choose by speed and depth, not by how much you trust it.',
        primaryCta: { label: 'Read the launch post', href: '/blog/introducing-apogee' },
        patternSeed: 'models',
      },
      {
        _key: 'models-grid',
        _type: 'featureGrid',
        heading: 'Choose by the job',
        intro: 'Same API, same traces, same safety controls. The only thing that changes is depth.',
        features: [
          {
            _key: 'm1',
            icon: 'spark',
            title: 'Perigee',
            body: 'Our fastest model. Classification, extraction and short replies in a few hundred milliseconds.',
          },
          {
            _key: 'm2',
            icon: 'compass',
            title: 'Meridian',
            body: 'The balanced default. Strong reasoning at a fraction of the cost of Apogee.',
          },
          {
            _key: 'm3',
            icon: 'orbit',
            title: 'Apogee',
            body: 'Our most capable model, for research, analysis and long, multi-step work.',
          },
        ],
      },
      {
        _key: 'models-chart',
        _type: 'chartBlock',
        heading: 'Latency grows with the work you ask for',
        intro: 'Median time to a complete answer as the prompt grows. Lower is better.',
        chart: {
          xLabel: 'Prompt length (tokens)',
          yLabel: 'Median latency',
          xScale: 'log',
          xFormat: 'tokens',
          yFormat: 'ms',
          series: [
            series('latency', perigee, promptLength, [180, 240, 390, 820, 2100]),
            series('latency', meridian, promptLength, [420, 560, 900, 1800, 4200]),
            series('latency', apogee, promptLength, [950, 1300, 2100, 4100, 9300]),
          ],
        },
        takeaway:
          'Perigee stays under a second for most prompts. Apogee is worth the wait when the answer needs real analysis.',
        note: 'Illustrative data for a fictional product.',
      },
      {
        _key: 'models-cta',
        _type: 'cta',
        heading: 'Not sure where to start?',
        body: 'Most teams begin with Meridian, then move individual tasks up or down once they have read the traces.',
        link: { label: 'Why calibration matters', href: '/blog/calibration-over-accuracy' },
      },
    ],
  },
  {
    title: 'About',
    slug: 'about',
    seo: {
      title: 'About',
      description:
        'Orrery Labs is a small research company building models that show their evidence instead of asking for trust.',
    },
    blocks: [
      {
        _key: 'about-hero',
        _type: 'hero',
        eyebrow: 'About',
        heading: 'We build models you can argue with',
        subheading:
          'Orrery Labs is a small research company. We think the next step for AI is not more confidence, but better evidence.',
        patternSeed: 'about',
      },
      {
        _key: 'about-text',
        _type: 'richText',
        content: [
          about.p(
            'An orrery is a mechanical model of the solar system. You can turn the crank and watch every planet move, because nothing is hidden inside a black box. We named the company after it because that is the kind of model we want to build.',
          ),
          about.h2('What we believe'),
          ...about.bullets(
            'An answer without evidence is a guess with good grammar.',
            'Uncertainty is information. Hiding it is a bug.',
            'The best interface for a model is one that makes checking easy.',
          ),
          about.h2('How we work'),
          about.p(
            'Researchers, engineers and designers work in the same small teams. Every model change ships with an evaluation report, and every interface change ships with a usability test. You can read what we are learning in our [research notes](/blog).',
          ),
        ],
      },
      {
        _key: 'about-stats',
        _type: 'stats',
        items: [
          { _key: 'a1', value: '24', label: 'researchers and engineers' },
          { _key: 'a2', value: '3', label: 'continents' },
          { _key: 'a3', value: '1', label: 'question we ask every model: how do you know?' },
        ],
      },
      {
        _key: 'about-cta',
        _type: 'cta',
        heading: 'Read what we are working on',
        body: 'Launches, evaluation notes and the engineering behind our interfaces.',
        link: { label: 'Visit research', href: '/blog' },
      },
    ],
  },
]

const launch = createPortableText('launch')
const calibration = createPortableText('calibration')
const traces = createPortableText('traces')

export const posts: PostInput[] = [
  {
    title: 'How we render reasoning traces in the browser',
    slug: 'rendering-reasoning-traces',
    excerpt:
      'A trace can run to thousands of steps. Here is how we keep the viewer fast, accessible and readable on a phone.',
    publishedAt: '2026-11-05T09:00:00.000Z',
    author: { name: 'Lena Park', role: 'Design engineering' },
    tags: ['Engineering', 'Interfaces'],
    body: [
      traces.p(
        'A reasoning trace is a tree of steps: claims, the evidence behind them, and the checks a model ran along the way. Long research tasks produce traces with several thousand nodes. Rendering all of them at once froze mid-range phones for seconds, so we rebuilt the viewer around three ideas.',
      ),
      traces.h2('Render what is on screen'),
      traces.p(
        'Collapsed branches cost nothing, and expanded ones are windowed: only the rows near the viewport exist in the DOM. For sections below the fold we lean on the browser with **content-visibility: auto**, which skips layout and paint until a section is about to scroll into view.',
      ),
      traces.h2('Stream the tree, not the page'),
      traces.p(
        'Traces arrive as a stream. Instead of waiting for the full tree, the viewer appends steps as they arrive and keeps the reader’s scroll position stable. A step that is still running is announced once to screen readers, not on every token.',
      ),
      traces.h2('Keyboard first'),
      ...traces.bullets(
        'Arrow keys move through steps with a roving tab index, so the tree is one tab stop, not thousands.',
        'Left and Right collapse and expand branches, the same way a file tree does.',
        'Every step has a stable URL, so a reviewer can share the exact claim they disagree with.',
      ),
      traces.quote(
        'If a reviewer cannot get to the step that matters in a few keystrokes, the trace might as well not exist.',
      ),
      traces.h2('What we measure'),
      traces.p(
        'We track Interaction to Next Paint on real devices for expanding a branch and jumping between steps. Both now stay under 100 ms at the 75th percentile, including traces with ten thousand steps.',
      ),
    ],
  },
  {
    title: 'Introducing Orrery Apogee',
    slug: 'introducing-apogee',
    excerpt:
      'Our most capable model yet, with reasoning traces you can audit step by step and a context window of a million tokens.',
    publishedAt: '2026-10-14T09:00:00.000Z',
    author: { name: 'Mara Ellison', role: 'Research lead' },
    tags: ['Models', 'Launch'],
    body: [
      launch.p(
        'Today we are releasing Apogee, the largest model in the Orrery family. It is built for the work where being wrong is expensive: research, analysis, and decisions that someone will have to defend later.',
      ),
      launch.h2('What is new'),
      ...launch.bullets(
        '**Deeper reasoning.** Apogee keeps improving as you give it a larger reasoning budget, long after smaller models level off.',
        '**Traces you can audit.** Every answer links each claim to the evidence and checks behind it.',
        '**A million tokens of context.** Citations point to the exact passage, not just the document.',
      ),
      launch.h2('Traces, not transcripts'),
      launch.p(
        'A raw chain of thought is long and hard to review. Apogee produces a structured trace instead: a tree of claims with the evidence for each one. Reviewers can jump straight to the step they doubt, and the interface marks the claims the model itself was least sure about.',
      ),
      launch.h2('Availability'),
      launch.p(
        'Apogee is available today in every plan. Compare it with Perigee and Meridian on the [models page](/models).',
      ),
    ],
  },
  {
    title: 'Why calibration matters more than accuracy',
    slug: 'calibration-over-accuracy',
    excerpt:
      'A model that knows when it might be wrong is more useful than one that is slightly more accurate but always certain.',
    publishedAt: '2026-09-02T09:00:00.000Z',
    author: { name: 'Daniel Okafor', role: 'Evaluation' },
    tags: ['Evaluation'],
    body: [
      calibration.p(
        'Imagine two models. The first is right 90% of the time and always sounds sure. The second is right 88% of the time, but tells you how sure it is, and that number is honest. For most real workflows, the second model is the better product.',
      ),
      calibration.h2('What calibration means'),
      calibration.p(
        'A model is calibrated when its confidence matches its accuracy. Of all the answers it gives with 70% confidence, about 70% should be correct. We measure the gap with **expected calibration error**, and we treat a regression in it as seriously as a drop in accuracy.',
      ),
      calibration.h2('Why it changes the product'),
      ...calibration.numbers(
        'Low-confidence answers can go to a person automatically, instead of every answer going to review.',
        'Teams can set their own threshold per task, from strict for legal text to relaxed for drafts.',
        'Users learn when to double-check, which builds the right kind of trust.',
      ),
      calibration.h2('How we evaluate it'),
      calibration.p(
        'Every Orrery release ships with a reliability report across held-out tasks. You can see how confidence and accuracy line up for each model on the [models page](/models).',
      ),
    ],
  },
]
