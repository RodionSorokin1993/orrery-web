import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import localFont from 'next/font/local'

/** Self-hosted, so builds never depend on a network call to a font CDN. */
export const newsreader = localFont({
  src: [
    { path: '../fonts/Newsreader-Variable.woff2', style: 'normal', weight: '200 800' },
    { path: '../fonts/Newsreader-Variable-Italic.woff2', style: 'italic', weight: '200 800' },
  ],
  variable: '--font-newsreader',
  display: 'swap',
  fallback: ['Iowan Old Style', 'Georgia', 'serif'],
})

export const fontVariables = [newsreader.variable, GeistSans.variable, GeistMono.variable].join(' ')
