import type { ComparisonBlock } from '../content/types'

/**
 * Shape checks for the comparison table, shared by the Studio validation and Content QA.
 * Returns human-readable problems; an empty list means the table can be rendered.
 */
export function validateComparison(block: Partial<ComparisonBlock> | undefined): string[] {
  const problems: string[] = []
  const columns = block?.columns ?? []
  const rows = block?.rows ?? []

  if (columns.length < 2 || columns.length > 4) {
    problems.push('Use two to four columns.')
  }

  const keys = new Set<string>()
  for (const column of columns) {
    if (!column.key) problems.push(`Column "${column.label ?? '?'}" needs a key.`)
    else if (keys.has(column.key)) problems.push(`Column key "${column.key}" is used twice.`)
    else keys.add(column.key)
  }

  if (columns.filter((column) => column.highlighted).length > 1) {
    problems.push('Highlight at most one column.')
  }

  if (rows.length === 0) problems.push('Add at least one row.')

  rows.forEach((row, index) => {
    const name = row.label || `Row ${index + 1}`
    const cells = row.cells ?? []
    if (cells.length !== columns.length) {
      problems.push(
        `${name} has ${cells.length} cells but the table has ${columns.length} columns.`,
      )
    }
    cells.forEach((cell, i) => {
      if (cell.kind === 'level' && ![1, 2, 3].includes(cell.level)) {
        problems.push(`${name}, cell ${i + 1}: level must be 1, 2 or 3.`)
      }
      if (cell.kind === 'text' && !cell.value?.trim()) {
        problems.push(`${name}, cell ${i + 1}: text cells need a value.`)
      }
    })
  })

  return problems
}
