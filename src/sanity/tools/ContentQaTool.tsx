import { CheckmarkCircleIcon } from '@sanity/icons/CheckmarkCircle'
import { RefreshIcon } from '@sanity/icons/Refresh'
import { WarningOutlineIcon } from '@sanity/icons/WarningOutline'
import { Badge, Box, Button, Card, Flex, Heading, Spinner, Stack, Text } from '@sanity/ui'
import { useCallback, useEffect, useState } from 'react'
import { useClient } from 'sanity'
import { IntentLink } from 'sanity/router'
import { createSanitySource } from '../../content/sanity-source'
import { summarize } from '../../content-qa/report'
import { runContentQa, type Issue } from '../../content-qa/rules'
import { apiVersion } from '../env'

type State =
  | { status: 'loading' }
  | { status: 'ready'; issues: Issue[]; checkedAt: Date }
  | { status: 'error'; message: string }

/**
 * Studio tool that runs the same Content QA rules as `pnpm content:check`, against drafts,
 * so editors see problems before they publish.
 */
export function ContentQaTool() {
  const client = useClient({ apiVersion })
  const [state, setState] = useState<State>({ status: 'loading' })

  const run = useCallback(async () => {
    setState({ status: 'loading' })
    try {
      const source = createSanitySource(client.withConfig({ perspective: 'drafts' }))
      const issues = runContentQa(await source.getSnapshot())
      setState({ status: 'ready', issues, checkedAt: new Date() })
    } catch (error) {
      setState({ status: 'error', message: error instanceof Error ? error.message : String(error) })
    }
  }, [client])

  useEffect(() => {
    // Run once when the tool opens; editors re-run it with the button.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void run()
  }, [run])

  return (
    <Box padding={4} style={{ maxWidth: 960, margin: '0 auto' }}>
      <Stack gap={5}>
        <Flex align="center" justify="space-between" gap={3}>
          <Stack gap={3}>
            <Heading size={3}>Content QA</Heading>
            <Text muted size={1}>
              Checks links, translations, SEO fields and chart data across every language, including
              unpublished drafts.
            </Text>
          </Stack>
          <Button
            icon={RefreshIcon}
            text="Run again"
            mode="ghost"
            onClick={() => void run()}
            disabled={state.status === 'loading'}
          />
        </Flex>

        {state.status === 'loading' ? (
          <Flex align="center" gap={3}>
            <Spinner muted />
            <Text muted>Checking content…</Text>
          </Flex>
        ) : null}

        {state.status === 'error' ? (
          <Card padding={4} radius={2} tone="critical">
            <Text>{state.message}</Text>
          </Card>
        ) : null}

        {state.status === 'ready' ? <Results issues={state.issues} /> : null}
      </Stack>
    </Box>
  )
}

function Results({ issues }: { issues: Issue[] }) {
  const { errors, warnings } = summarize(issues)

  if (issues.length === 0) {
    return (
      <Card padding={4} radius={2} tone="positive">
        <Flex align="center" gap={3}>
          <Text>
            <CheckmarkCircleIcon />
          </Text>
          <Text weight="medium">All checks passed. Nothing to fix.</Text>
        </Flex>
      </Card>
    )
  }

  return (
    <Stack gap={3}>
      <Flex gap={2}>
        <Badge tone="critical">{errors} errors</Badge>
        <Badge tone="caution">{warnings} warnings</Badge>
      </Flex>
      {issues.map((issue, index) => (
        <Card
          key={`${issue.documentId}-${issue.ruleId}-${index}`}
          padding={3}
          radius={2}
          border
          tone={issue.severity === 'error' ? 'critical' : 'caution'}
        >
          <Flex gap={3} align="flex-start">
            <Text size={2}>
              <WarningOutlineIcon />
            </Text>
            <Stack gap={2} flex={1}>
              <Flex gap={2} align="center" wrap="wrap">
                <Badge>{issue.locale.toUpperCase()}</Badge>
                <Text weight="semibold" size={1}>
                  <IntentLink
                    intent="edit"
                    params={{ id: issue.documentId, type: issue.documentType }}
                  >
                    {issue.documentTitle}
                  </IntentLink>
                </Text>
                <Text muted size={1}>
                  {issue.ruleId}
                  {issue.path ? ` · ${issue.path}` : ''}
                </Text>
              </Flex>
              <Text size={1}>{issue.message}</Text>
            </Stack>
          </Flex>
        </Card>
      ))}
    </Stack>
  )
}
