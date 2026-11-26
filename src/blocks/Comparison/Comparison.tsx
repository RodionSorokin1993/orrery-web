import type { ComparisonBlock, ComparisonCell, ComparisonRow } from '@/content/types'
import type { Dictionary } from '@/lib/i18n'
import section from '../Section.module.css'
import styles from './Comparison.module.css'

interface Props {
  block: ComparisonBlock
  labels: Dictionary['comparison']
}

interface RowGroup {
  key: string
  name?: string
  rows: ComparisonRow[]
}

/** Consecutive rows with the same group name share one <tbody>. */
export function groupRows(rows: ComparisonRow[]): RowGroup[] {
  const groups: RowGroup[] = []
  for (const row of rows) {
    const last = groups.at(-1)
    if (last && last.name === row.group) last.rows.push(row)
    else groups.push({ key: row._key, name: row.group, rows: [row] })
  }
  return groups
}

function Cell({ cell, labels }: { cell: ComparisonCell; labels: Dictionary['comparison'] }) {
  switch (cell.kind) {
    case 'yes':
      return (
        <>
          <svg className={styles.icon} viewBox="0 0 20 20" aria-hidden="true" focusable="false">
            <path d="M5 10.5l3.2 3.2L15 7" />
          </svg>
          <span className="visually-hidden">{labels.included}</span>
        </>
      )
    case 'no':
      return (
        <>
          <svg
            className={styles.iconMuted}
            viewBox="0 0 20 20"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M6 10h8" />
          </svg>
          <span className="visually-hidden">{labels.notIncluded}</span>
        </>
      )
    case 'level':
      return (
        <>
          <span className={styles.level} aria-hidden="true">
            {[1, 2, 3].map((dot) => (
              <span key={dot} className={dot <= cell.level ? styles.dotOn : styles.dot} />
            ))}
          </span>
          <span className="visually-hidden">
            {labels.level.replace('{level}', String(cell.level))}
          </span>
        </>
      )
    default:
      return <>{cell.value}</>
  }
}

/**
 * Static comparison table. Desktop pins the header row while the page scrolls; narrow screens
 * scroll the table sideways and pin the row labels instead. No client JavaScript.
 */
export function Comparison({ block, labels }: Props) {
  const headingId = `${block._key}-heading`
  const columnCount = block.columns.length

  return (
    // The scroll container below is the labelled region, so the section itself stays unnamed
    // and the page does not get two landmarks with the same name.
    <section className={`container ${section.section}`}>
      <div className={`${section.header} reveal`}>
        <h2 id={headingId} className={section.heading}>
          {block.heading}
        </h2>
        {block.intro ? <p className={section.intro}>{block.intro}</p> : null}
      </div>

      {/* Focusable so keyboard users can scroll it sideways on small screens. */}
      <div className={styles.scroller} role="region" aria-labelledby={headingId} tabIndex={0}>
        <table className={styles.table} data-columns={columnCount}>
          <caption className="visually-hidden">{block.heading}</caption>
          <colgroup>
            <col />
            {block.columns.map((column) => (
              <col
                key={column._key}
                className={column.highlighted ? styles.highlightedColumn : undefined}
              />
            ))}
          </colgroup>
          <thead>
            <tr>
              <td className={styles.corner} />
              {block.columns.map((column) => (
                <th
                  key={column._key}
                  scope="col"
                  className={styles.columnHeader}
                  data-highlighted={column.highlighted || undefined}
                >
                  <span className={styles.columnLabel}>{column.label}</span>
                  {column.tagline ? (
                    <span className={column.highlighted ? styles.badge : styles.tagline}>
                      {column.tagline}
                    </span>
                  ) : null}
                </th>
              ))}
            </tr>
          </thead>

          {groupRows(block.rows).map((group) => (
            <tbody key={group.key}>
              {group.name ? (
                <tr>
                  <th scope="rowgroup" className={styles.groupHeading}>
                    {group.name}
                  </th>
                  <td colSpan={columnCount} />
                </tr>
              ) : null}
              {group.rows.map((row) => (
                <tr key={row._key}>
                  <th scope="row" className={styles.rowHeader}>
                    {row.label}
                    {row.hint ? <span className={styles.hint}>{row.hint}</span> : null}
                  </th>
                  {row.cells.map((cell) => (
                    <td key={cell._key} className={styles.cell}>
                      <Cell cell={cell} labels={labels} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>

      {block.footnote ? <p className={styles.footnote}>{block.footnote}</p> : null}
    </section>
  )
}
