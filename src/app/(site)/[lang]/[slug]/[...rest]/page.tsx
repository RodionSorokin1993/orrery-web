import { notFound } from 'next/navigation'

/** Deeper paths under a page (`/en/models/x`) do not exist; show the localized 404 in the layout. */
export default function UnknownNestedPage() {
  notFound()
}
