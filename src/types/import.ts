/** File formats the import flow accepts. */
export type SourceFormat = 'csv' | 'yaml' | 'json'

/** Known Player fields a source column can be mapped onto. */
export type PlayerFieldTarget = 'name' | 'jerseyNumber' | 'position' | 'photoUrl'

/**
 * How one column/key from an imported file maps onto a Player.
 *
 * `target: 'attribute'` is the default for anything not recognized as a
 * known field — it lands in `Player.attributes[attributeKey]`, which is what
 * makes adding new columns later work without a schema change.
 * `target: 'ignore'` lets the user explicitly drop a column (e.g. an id
 * column from a spreadsheet export that isn't useful here).
 */
export interface ColumnMapping {
  sourceKey: string
  target: PlayerFieldTarget | 'attribute' | 'ignore'
  /** Only used when target === 'attribute'. Defaults to a slugified sourceKey. */
  attributeKey: string
}

/** Outcome of an import's upsert pass, shown to the user before/after committing. */
export interface ImportSummary {
  created: number
  updated: number
  unchanged: number
  /** externalKeys of existing players not present in this import (not deleted, just flagged). */
  missingExternalKeys: string[]
}
