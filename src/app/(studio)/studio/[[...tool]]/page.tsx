import { NextStudio } from 'next-sanity/studio'
import config from '../../../../../sanity.config'
import { isSanityConfigured } from '@/sanity/env'

export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  if (!isSanityConfigured) return <StudioSetup />
  return <NextStudio config={config} />
}

/** Shown until a Sanity project is connected, instead of a broken Studio. */
function StudioSetup() {
  return (
    <main
      style={{
        maxWidth: 640,
        margin: '10vh auto',
        padding: 24,
        fontFamily: 'system-ui, sans-serif',
        lineHeight: 1.6,
      }}
    >
      <h1 style={{ fontSize: 28 }}>Connect a Sanity project</h1>
      <p>
        The site is running on built-in demo content. To edit it in the Studio, create a free Sanity
        project and add its id to <code>.env.local</code>:
      </p>
      <pre style={{ padding: 16, background: '#f4f4f5', borderRadius: 8, overflowX: 'auto' }}>
        {`NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production`}
      </pre>
      <p>
        Then run <code>pnpm sanity:seed</code> to copy the demo content into your dataset. The
        README has the full steps.
      </p>
    </main>
  )
}
