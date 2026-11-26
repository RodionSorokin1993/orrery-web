'use client'

import { useCallback, useEffect, useLayoutEffect, useSyncExternalStore } from 'react'
import {
  THEME_EVENT,
  THEME_STORAGE_KEY,
  isThemePreference,
  nextPreference,
  resolveTheme,
  type ThemePreference,
} from '@/lib/theme'
import styles from './ThemeToggle.module.css'

interface Labels {
  label: string
  system: string
  light: string
  dark: string
}

const DARK_QUERY = '(prefers-color-scheme: dark)'

function readPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    return isThemePreference(stored) ? stored : 'system'
  } catch {
    return 'system'
  }
}

function subscribe(onChange: () => void) {
  const media = window.matchMedia(DARK_QUERY)
  window.addEventListener(THEME_EVENT, onChange)
  window.addEventListener('storage', onChange)
  media.addEventListener('change', onChange)
  return () => {
    window.removeEventListener(THEME_EVENT, onChange)
    window.removeEventListener('storage', onChange)
    media.removeEventListener('change', onChange)
  }
}

function applyTheme(preference: ThemePreference) {
  const prefersDark = window.matchMedia(DARK_QUERY).matches
  document.documentElement.setAttribute('data-theme', resolveTheme(preference, prefersDark))
}

export function ThemeToggle({ labels }: { labels: Labels }) {
  // Server snapshot is "system", so hydration never mismatches; the client value follows.
  const preference = useSyncExternalStore(subscribe, readPreference, () => 'system' as const)

  const cycle = useCallback(() => {
    const next = nextPreference(readPreference())
    try {
      if (next === 'system') localStorage.removeItem(THEME_STORAGE_KEY)
      else localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // Storage can be unavailable (private mode). The theme still applies for this page view.
    }
    applyTheme(next)
    window.dispatchEvent(new Event(THEME_EVENT))
  }, [])

  // A language switch re-renders the root layout, which resets the attributes on <html>, and the
  // inline theme script does not run again on client navigation. Re-apply before paint.
  useLayoutEffect(() => {
    applyTheme(readPreference())
  }, [])

  // Keep following the OS setting while the preference is "system".
  useEffect(() => {
    if (preference !== 'system') return
    const media = window.matchMedia(DARK_QUERY)
    const update = () => applyTheme('system')
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [preference])

  const current = labels[preference]

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={cycle}
      aria-label={`${labels.label}: ${current}`}
      title={current}
      data-preference={preference}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={styles.icon}>
        {preference === 'light' ? (
          <>
            <circle cx="12" cy="12" r="4.5" />
            <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" />
          </>
        ) : preference === 'dark' ? (
          <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
        ) : (
          <>
            <circle cx="12" cy="12" r="8.5" />
            <path d="M12 3.5v17" />
            <path d="M12 3.5a8.5 8.5 0 0 1 0 17Z" className={styles.filled} />
          </>
        )}
      </svg>
    </button>
  )
}
