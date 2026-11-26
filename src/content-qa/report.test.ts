import { describe, expect, it } from 'vitest'
import { exitCodeFor, formatReport, summarize } from './report'
import type { Issue } from './rules'

const base: Omit<Issue, 'ruleId' | 'severity' | 'message'> = {
  locale: 'en',
  documentId: 'page.models.en',
  documentType: 'page',
  documentTitle: 'Models',
}

const error: Issue = {
  ...base,
  ruleId: 'broken-internal-link',
  severity: 'error',
  message: 'Bad link',
}
const warning: Issue = {
  ...base,
  ruleId: 'title-length',
  severity: 'warning',
  message: 'Long title',
}

describe('Content QA report (spec 005, AC3)', () => {
  it('exits with 1 only when there is an error', () => {
    expect(exitCodeFor([])).toBe(0)
    expect(exitCodeFor([warning])).toBe(0)
    expect(exitCodeFor([warning, error])).toBe(1)
  })

  it('counts errors and warnings', () => {
    expect(summarize([error, warning, warning])).toEqual({ errors: 1, warnings: 2 })
  })

  it('groups issues by document', () => {
    const report = formatReport([error, warning], 'fixtures')
    expect(report).toContain('Content QA (fixtures): 1 error(s), 1 warning(s)')
    expect(report).toContain('EN  Models (page.models.en)')
    expect(report).toContain('ERROR  broken-internal-link: Bad link')
    expect(report.match(/Models \(page\.models\.en\)/g)).toHaveLength(1)
  })

  it('says so when everything passes', () => {
    expect(formatReport([], 'sanity')).toContain('All content checks passed.')
  })
})
