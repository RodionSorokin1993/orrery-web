import type { StructureResolver } from 'sanity/structure'

/** Desk structure: content first, settings last. Translation metadata stays out of the way. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('page').title('Pages'),
      S.documentTypeListItem('post').title('Posts'),
      S.divider(),
      S.documentTypeListItem('siteSettings').title('Site settings'),
    ])
