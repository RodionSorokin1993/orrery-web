'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import styles from './Header.module.css'
import { NavLinks, type NavItem } from './NavLinks'

interface Props {
  items: NavItem[]
  labels: { open: string; close: string; navigation: string }
  /** Locale switcher and theme toggle, rendered inside the panel on small screens. */
  children?: ReactNode
}

export function MobileNav({ items, labels, children }: Props) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()
  const [lastPathname, setLastPathname] = useState(pathname)

  // Close the panel after navigation (adjusting state during render, as React recommends).
  if (pathname !== lastPathname) {
    setLastPathname(pathname)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <div className={styles.mobile}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.menuButton}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="visually-hidden">{open ? labels.close : labels.open}</span>
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={styles.menuIcon}>
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
        </svg>
      </button>

      <div id={panelId} className={styles.panel} hidden={!open}>
        <nav aria-label={labels.navigation}>
          <NavLinks
            items={items}
            className={styles.panelList}
            linkClassName={styles.panelLink}
            onNavigate={() => setOpen(false)}
          />
        </nav>
        <div className={styles.panelTools}>{children}</div>
      </div>
    </div>
  )
}
