import type { Issue } from './rules'

export interface Summary {
  errors: number
  warnings: number
}

export function summarize(issues: Issue[]): Summary {
  return {
    errors: issues.filter((issue) => issue.severity === 'error').length,
    warnings: issues.filter((issue) => issue.severity === 'warning').length,
  }
}

/** Errors fail CI. Warnings are reported but never block a deploy. */
export function exitCodeFor(issues: Issue[]): 0 | 1 {
  return summarize(issues).errors > 0 ? 1 : 0
}

/** Plain-text report for the terminal and CI logs, grouped by document. */
export function formatReport(issues: Issue[], sourceName: string): string {
  const { errors, warnings } = summarize(issues)
  const lines = [`Content QA (${sourceName}): ${errors} error(s), ${warnings} warning(s)`]

  const byDocument = new Map<string, Issue[]>()
  for (const issue of issues) {
    const key = `${issue.locale.toUpperCase()}  ${issue.documentTitle} (${issue.documentId})`
    byDocument.set(key, [...(byDocument.get(key) ?? []), issue])
  }

  for (const [document, documentIssues] of byDocument) {
    lines.push('', document)
    for (const issue of documentIssues) {
      const marker = issue.severity === 'error' ? 'ERROR' : 'warn '
      const where = issue.path ? ` [${issue.path}]` : ''
      lines.push(`  ${marker}  ${issue.ruleId}${where}: ${issue.message}`)
    }
  }

  if (issues.length === 0) lines.push('', 'All content checks passed.')
  return lines.join('\n')
}
