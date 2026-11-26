import type { ReactNode } from 'react'
import type { FeatureIcon as IconName } from '@/content/types'

const paths: Record<IconName, ReactNode> = {
  orbit: (
    <>
      <circle cx="12" cy="12" r="2.5" />
      <ellipse cx="12" cy="12" rx="9" ry="4.2" transform="rotate(-25 12 12)" />
      <circle cx="19.2" cy="8.1" r="1.3" className="fill" />
    </>
  ),
  gauge: (
    <>
      <path d="M4 16a8 8 0 1 1 16 0" />
      <path d="M12 16l4.2-5.2" />
      <circle cx="12" cy="16" r="1.2" className="fill" />
      <path d="M7 16h-1M18 16h-1" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.5l7 2.6v5.4c0 4.4-3 7.7-7 9-4-1.3-7-4.6-7-9V6.1l7-2.6Z" />
      <path d="M9 12.2l2.1 2.1 4-4.3" />
    </>
  ),
  layers: (
    <>
      <path d="M12 4l8.5 4.5L12 13 3.5 8.5 12 4Z" />
      <path d="M3.5 12.5L12 17l8.5-4.5" />
      <path d="M3.5 16.2L12 20.7l8.5-4.5" />
    </>
  ),
  spark: (
    <>
      <path d="M12 3.5l1.9 6.6 6.6 1.9-6.6 1.9-1.9 6.6-1.9-6.6-6.6-1.9 6.6-1.9L12 3.5Z" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M14.8 9.2l-1.6 4-4 1.6 1.6-4 4-1.6Z" />
    </>
  ),
}

export function FeatureIcon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      {paths[name] ?? paths.orbit}
    </svg>
  )
}
