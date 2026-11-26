import { generateOrrery, polar, type BodyTone } from './orrery'

export interface OrreryPalette {
  ring: string
  sun: string
  star: string
  tones: Record<BodyTone, string>
}

const round = (n: number) => Math.round(n * 100) / 100

/**
 * Renders an orrery to a standalone SVG string. Used where React SVG is not available,
 * such as `next/og` image generation, which only supports a subset of SVG through <img>.
 */
export function orreryToSvg(seed: string, palette: OrreryPalette, size = 600): string {
  const { center, sunRadius, rings, stars } = generateOrrery(seed, { size })
  const parts: string[] = []

  for (const [x, y, r] of stars) {
    parts.push(`<circle cx="${round(x)}" cy="${round(y)}" r="${round(r)}" fill="${palette.star}"/>`)
  }

  for (const ring of rings) {
    const dash = ring.dashed ? ' stroke-dasharray="2 6"' : ''
    parts.push(
      `<circle cx="${center}" cy="${center}" r="${round(ring.radius)}" fill="none" stroke="${palette.ring}" stroke-width="1.2"${dash}/>`,
    )
    for (const body of ring.bodies) {
      const [x, y] = polar(center, center, ring.radius, body.angle)
      const fill = palette.tones[body.tone]
      parts.push(
        `<circle cx="${round(x)}" cy="${round(y)}" r="${round(body.size)}" fill="${fill}"/>`,
      )
      if (body.hasRing) {
        parts.push(
          `<ellipse cx="${round(x)}" cy="${round(y)}" rx="${round(body.size * 1.9)}" ry="${round(body.size * 0.6)}" fill="none" stroke="${fill}" stroke-width="1.2"/>`,
        )
      }
      if (body.moon) {
        const [mx, my] = polar(x, y, body.moon.distance, body.moon.angle)
        parts.push(
          `<circle cx="${round(mx)}" cy="${round(my)}" r="${round(body.moon.size)}" fill="${fill}"/>`,
        )
      }
    }
  }

  parts.push(
    `<circle cx="${center}" cy="${center}" r="${round(sunRadius)}" fill="${palette.sun}"/>`,
  )

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">${parts.join('')}</svg>`
}

export function svgToDataUri(svg: string): string {
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}
