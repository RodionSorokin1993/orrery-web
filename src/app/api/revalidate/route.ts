import { revalidateTag } from 'next/cache'
import { parseBody } from 'next-sanity/webhook'
import { NextResponse, type NextRequest } from 'next/server'
import { tagsForDocument } from '@/content/tags'
import { isLocale } from '@/lib/i18n/config'

interface WebhookPayload {
  _type?: string
  language?: string
  slug?: string | null
}

/**
 * Sanity webhook target. Configure the webhook projection as
 * `{_type, language, "slug": slug.current}` and sign it with SANITY_REVALIDATE_SECRET.
 * Only the tags of the changed document are expired, not the whole site.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!secret) {
    return NextResponse.json({ message: 'Missing SANITY_REVALIDATE_SECRET' }, { status: 500 })
  }

  const { isValidSignature, body } = await parseBody<WebhookPayload>(request, secret, true)
  if (!isValidSignature) {
    return NextResponse.json({ message: 'Invalid signature' }, { status: 401 })
  }
  if (!body?._type) {
    return NextResponse.json({ message: 'Bad request' }, { status: 400 })
  }

  const tags = tagsForDocument({
    _type: body._type,
    language: isLocale(body.language) ? body.language : undefined,
    slug: body.slug,
  })
  for (const tag of tags) revalidateTag(tag, 'max')

  return NextResponse.json({ revalidated: tags, now: Date.now() })
}
