/** File formats the import flow accepts. */
export type SourceFormat = 'csv' | 'yaml' | 'json'

/** Known Player fields a source column can be mapped onto. */
export type PlayerFieldTarget = 'name' | 'jerseyNumber' | 'position' | 'photoUrl'

/** Known Game fields a source column can be mapped onto. */
export type GameFieldTarget = 'date' | 'opponent' | 'team' | 'league' | 'homeAway' | 'venue'

/**
 * How one column/key from an imported file maps onto an entity (Player,
 * Game, ...). Generic over the entity's known field names so the same
 * mapping machinery (suggestion, editor UI, normalization shape) works for
 * every importable entity.
 *
 * `target: 'attribute'` is the default for anything not recognized as a
 * known field — it lands in the entity's `attributes[attributeKey]`, which
 * is what makes adding new columns later work without a schema change.
 * `target: 'ignore'` lets the user explicitly drop a column (e.g. an id
 * column from a spreadsheet export that isn't useful here).
 */
export interface ColumnMapping<TField extends string = string> {
  sourceKey: string
  target: TField | 'attribute' | 'ignore'
  /** Only used when target === 'attribute'. Defaults to a slugified sourceKey. */
  attributeKey: string
}

/** Outcome of an import's upsert pass, shown to the user before/after committing. */
export interface ImportSummary {
  created: number
  updated: number
  unchanged: number
  /** externalKeys of existing records not present in this import (not deleted, just flagged). */
  missingExternalKeys: string[]
}
