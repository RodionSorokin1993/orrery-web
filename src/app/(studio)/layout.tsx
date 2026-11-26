import type { ReactNode } from 'react'

/** The Studio is a separate app with its own root layout: none of the site CSS or chrome. */
export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  )
}
