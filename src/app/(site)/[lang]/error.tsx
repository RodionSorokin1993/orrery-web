'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import styles from './not-found.module.css'

const copy = {
  en: {
    title: 'Something went wrong',
    body: 'The page could not be loaded. Please try again.',
    retry: 'Try again',
  },
  es: {
    title: 'Algo salió mal',
    body: 'No se pudo cargar la página. Inténtalo de nuevo.',
    retry: 'Reintentar',
  },
}

/** Last-resort boundary. Errors are logged and the reader gets a way to retry. */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const pathname = usePathname()
  const text = pathname.startsWith('/es') ? copy.es : copy.en

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <section className={`container ${styles.notFound}`}>
      <div className={styles.copy}>
        <h1 className={styles.title}>{text.title}</h1>
        <p className={styles.body}>{text.body}</p>
        <button type="button" onClick={reset}>
          {text.retry}
        </button>
      </div>
    </section>
  )
}
