import type { AttributeValue } from './attributes'

/**
 * A scheduled game.
 *
 * Like Player, a handful of fields the UI filters/sorts by are promoted
 * (date, opponent, team, league); everything else lives in `attributes`.
 */
export interface Game {
  id: string
  /** Value used to match this game across re-imports (date + opponent by default). */
  externalKey: string
  /** ISO date (YYYY-MM-DD). */
  date: string
  opponent: string
  /** "Our" team name — lets one file track multiple squads (e.g. "Damen 1", "Damen 2"). */
  team: string
  league: string
  homeAway?: 'home' | 'away'
  venue?: string
  attributes: Record<string, AttributeValue>
  createdAt: string
  updatedAt: string
  source: 'import' | 'manual'
}
