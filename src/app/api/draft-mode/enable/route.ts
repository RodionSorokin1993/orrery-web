import { defineEnableDraftMode } from 'next-sanity/draft-mode'
import { client } from '@/sanity/client'

const token = process.env.SANITY_API_READ_TOKEN

/**
 * Called by the Presentation tool in Sanity Studio. `defineEnableDraftMode` validates a
 * short-lived secret that the Studio stores in the dataset, so this route cannot be abused.
 */
export const GET =
  client && token
    ? defineEnableDraftMode({ client: client.withConfig({ token }) }).GET
    : async () =>
        new Response('Draft Mode needs NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_READ_TOKEN.', {
          status: 501,
        })
