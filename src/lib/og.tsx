import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { orreryToSvg, svgToDataUri, type OrreryPalette } from './generative/svg'

export const ogSize = { width: 1200, height: 630 }
export const ogContentType = 'image/png'

/** Dark palette: social cards are shown on both light and dark feeds, so contrast wins. */
const palette: OrreryPalette = {
  ring: 'rgba(236, 232, 223, 0.22)',
  sun: '#d8b25a',
  star: 'rgba(236, 232, 223, 0.45)',
  tones: { accent: '#a9b6ff', brass: '#d8b25a', ink: '#f4efe2' },
}

// Static TTF instances: the OG renderer does not read WOFF2 or variable fonts.
const fontsPromise = Promise.all([
  readFile(join(process.cwd(), 'src/fonts/og/Newsreader-Medium.ttf')),
  readFile(join(process.cwd(), 'src/fonts/og/Geist-Medium.ttf')),
])

function clamp(text: string, max: number) {
  if (text.length <= max) return text
  return `${text.slice(0, max).replace(/\s+\S*$/, '')}…`
}

interface OgInput {
  title: string
  eyebrow: string
  siteName: string
  seed: string
}

export async function renderOgImage({ title, eyebrow, siteName, seed }: OgInput) {
  const [serif, sans] = await fontsPromise
  const art = svgToDataUri(orreryToSvg(seed, palette, 600))
  const text = clamp(title, 96)

  return new ImageResponse(
    <div
      style={{
        position: 'relative',
        display: 'flex',
        width: '100%',
        height: '100%',
        padding: 72,
        background: '#0e1016',
        color: '#ece8df',
        fontFamily: 'Geist',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- next/og renders <img>, not next/image */}
      <img
        src={art}
        width={620}
        height={620}
        alt=""
        style={{ position: 'absolute', right: -60, top: 5 }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: 700,
          height: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 22,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: '#a5a9b6',
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            display: 'flex',
            fontFamily: 'Newsreader',
            fontSize: text.length > 56 ? 64 : 80,
            lineHeight: 1.05,
            letterSpacing: -1.5,
          }}
        >
          {text}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 28 }}>
          <div
            style={{
              display: 'flex',
              width: 18,
              height: 18,
              marginRight: 14,
              borderRadius: 999,
              background: '#d8b25a',
            }}
          />
          {siteName}
        </div>
      </div>
    </div>,
    {
      ...ogSize,
      fonts: [
        { name: 'Newsreader', data: serif, weight: 500, style: 'normal' },
        { name: 'Geist', data: sans, weight: 500, style: 'normal' },
      ],
    },
  )
}
