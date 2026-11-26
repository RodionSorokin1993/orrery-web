import { defineCliConfig } from 'sanity/cli'

/** Used by `npx sanity` commands, for example `npx sanity cors add` or `npx sanity dataset export`. */
export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  },
})
