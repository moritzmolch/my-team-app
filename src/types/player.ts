import type { AttributeValue } from './attributes'

/** Handball outfield/goalkeeper positions. */
export type HandballPosition = 'GK' | 'LW' | 'RW' | 'LB' | 'CB' | 'RB' | 'PV'

/**
 * A player profile.
 *
 * A handful of fields the UI needs typed access to (name, jerseyNumber,
 * position, photoUrl) are promoted to real fields; everything else the user
 * adds — via import or manual edit — lives in `attributes`, so new columns
 * never require a schema change.
 */
export interface Player {
  /** Stable internal id, generated once and never re-derived from file data. */
  id: string
  /** Value used to match this player across re-imports (e.g. jersey number). */
  externalKey: string
  name: string
  jerseyNumber?: number
  position?: HandballPosition
  photoUrl?: string
  attributes: Record<string, AttributeValue>
  createdAt: string
  updatedAt: string
  source: 'import' | 'manual'
}
