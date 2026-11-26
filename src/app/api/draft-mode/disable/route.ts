import { draftMode } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const draft = await draftMode()
  draft.disable()

  // Return to the page the editor was previewing, if it is on this site.
  const referer = request.headers.get('referer')
  const target = referer && new URL(referer).origin === request.nextUrl.origin ? referer : '/'
  return NextResponse.redirect(new URL(target, request.url))
}
