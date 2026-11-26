import { NextResponse, type NextRequest } from 'next/server'
import { isLocale, localeCookie } from '@/lib/i18n/config'
import { negotiateLocale } from '@/lib/i18n/negotiate'

/**
 * Sends locale-less URLs (`/`, `/blog`) to the best locale for the reader.
 * Priority: the reader's explicit choice (cookie), then the browser's Accept-Language.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (isLocale(pathname.split('/')[1])) return NextResponse.next()

  const locale = negotiateLocale({
    cookie: request.cookies.get(localeCookie)?.value,
    acceptLanguage: request.headers.get('accept-language'),
  })

  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`

  const response = NextResponse.redirect(url)
  response.headers.set('Vary', 'Accept-Language, Cookie')
  return response
}

export const config = {
  // Skip API routes, the Studio, Next.js internals and anything that looks like a file.
  matcher: ['/((?!api|studio|_next|_vercel|.*\\..*).*)'],
}
