/**
 * `pnpm content:check`: runs the Content QA rules against the current content source and exits
 * with code 1 when any error is found. Used locally and in CI.
 */
import { existsSync } from 'node:fs'
import { createClient } from 'next-sanity'
import { fixtureSource } from '../src/content/fixture-source'
import { createSanitySource } from '../src/content/sanity-source'
import { exitCodeFor, formatReport } from '../src/content-qa/report'
import { runContentQa } from '../src/content-qa/rules'

if (existsSync('.env.local')) process.loadEnvFile('.env.local')

async function main() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const source = projectId
    ? createSanitySource(
        createClient({
          projectId,
          dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
          apiVersion: '2026-11-01',
          useCdn: false,
          perspective: 'published',
        }),
      )
    : fixtureSource

  const issues = runContentQa(await source.getSnapshot())
  console.log(formatReport(issues, source.name))
  process.exitCode = exitCodeFor(issues)
}

main().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})
