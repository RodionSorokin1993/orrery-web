import type { ComparisonCell, ComparisonRow } from '../types'

/** Compact cell notation for fixtures: a string is text, a number is a level, or 'yes' / 'no'. */
type CellInput = string | 1 | 2 | 3 | { yes: true } | { no: true }

export const yes = { yes: true } as const
export const no = { no: true } as const

function toCell(input: CellInput, key: string): ComparisonCell {
  if (typeof input === 'number') return { _key: key, kind: 'level', level: input }
  if (typeof input === 'string') return { _key: key, kind: 'text', value: input }
  return { _key: key, kind: 'yes' in input ? 'yes' : 'no' }
}

export function row(
  key: string,
  label: string,
  group: string,
  cells: CellInput[],
  hint?: string,
): ComparisonRow {
  return {
    _key: key,
    label,
    group,
    hint,
    cells: cells.map((cell, index) => toCell(cell, `${key}-${index}`)),
  }
}
