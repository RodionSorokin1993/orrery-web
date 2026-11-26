import { VisualEditing } from 'next-sanity/visual-editing'
import { draftMode } from 'next/headers'
import type { Dictionary } from '@/lib/i18n'
import styles from './DraftModeTools.module.css'

/**
 * Rendered inside <Suspense> in the layout: reading Draft Mode is request-time data, and the
 * banner must never hold back the static shell of the page.
 */
export async function DraftModeTools({ labels }: { labels: Dictionary['draft'] }) {
  const { isEnabled } = await draftMode()
  if (!isEnabled) return null

  return (
    <>
      <div className={styles.banner} role="status">
        <span>{labels.banner}</span>
        {/* A route handler, not a page: a full navigation is intended here. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/api/draft-mode/disable" className={styles.exit}>
          {labels.exit}
        </a>
      </div>
      <VisualEditing />
    </>
  )
}
