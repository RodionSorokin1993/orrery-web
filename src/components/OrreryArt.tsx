import type { CSSProperties } from 'react'
import { generateOrrery, polar } from '@/lib/generative/orrery'
import styles from './OrreryArt.module.css'

interface Props {
  seed: string
  animated?: boolean
  className?: string
}

const SIZE = 600

/**
 * Decorative, seed-driven orrery. Same seed, same picture, on the server and in OG images.
 * Each ring renders as a separate SVG layer so CSS can rotate it cheaply.
 */
export function OrreryArt({ seed, animated = true, className }: Props) {
  const orrery = generateOrrery(seed, { size: SIZE })
  const { center, sunRadius, rings, stars } = orrery
  const viewBox = `0 0 ${SIZE} ${SIZE}`

  return (
    <div
      className={[styles.orrery, animated && styles.animated, className].filter(Boolean).join(' ')}
      aria-hidden="true"
      data-seed={seed}
    >
      <svg className={styles.layer} viewBox={viewBox} focusable="false">
        {stars.map(([x, y, r], i) => (
          <circle key={i} className={styles.star} cx={x} cy={y} r={r} />
        ))}
        {rings.map((ring, i) => (
          <circle
            key={i}
            className={[styles.ringPath, ring.dashed && styles.ringDashed]
              .filter(Boolean)
              .join(' ')}
            cx={center}
            cy={center}
            r={ring.radius}
          />
        ))}
        <circle className={styles.sunHalo} cx={center} cy={center} r={sunRadius * 1.7} />
        <circle className={styles.sun} cx={center} cy={center} r={sunRadius} />
      </svg>

      {rings.map((ring, i) => (
        <svg
          key={i}
          className={`${styles.layer} ${styles.ring}`}
          viewBox={viewBox}
          focusable="false"
          style={
            {
              '--period': `${ring.period}s`,
              '--direction': ring.direction === 1 ? 'normal' : 'reverse',
            } as CSSProperties
          }
        >
          {ring.bodies.map((body, j) => {
            const [x, y] = polar(center, center, ring.radius, body.angle)
            const tone = styles[body.tone]
            return (
              <g key={j} className={tone}>
                <circle cx={x} cy={y} r={body.size} />
                {body.hasRing ? (
                  <ellipse
                    className={styles.planetRing}
                    cx={x}
                    cy={y}
                    rx={body.size * 1.9}
                    ry={body.size * 0.6}
                    transform={`rotate(-18 ${x} ${y})`}
                  />
                ) : null}
                {body.moon
                  ? (() => {
                      const [mx, my] = polar(x, y, body.moon.distance, body.moon.angle)
                      return <circle cx={mx} cy={my} r={body.moon.size} />
                    })()
                  : null}
              </g>
            )
          })}
        </svg>
      ))}
    </div>
  )
}
