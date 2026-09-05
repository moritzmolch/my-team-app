import type { ColumnMapping, GameFieldTarget, PlayerFieldTarget } from '../../types/import'
import { slugify } from './slugify'

export const PLAYER_FIELD_SYNONYMS: Record<PlayerFieldTarget, string[]> = {
  name: ['name', 'player', 'playername', 'fullname'],
  jerseyNumber: ['jerseynumber', 'jersey', 'number', 'no', 'num'],
  position: ['position', 'pos'],
  photoUrl: ['photo', 'photourl', 'image', 'imageurl', 'picture'],
}

export const GAME_FIELD_SYNONYMS: Record<GameFieldTarget, string[]> = {
  date: ['date', 'gamedate', 'matchdate', 'kickoff'],
  opponent: ['opponent', 'opponentteam', 'vs', 'against'],
  team: ['team', 'ourteam', 'club', 'squad'],
  league: ['league', 'division', 'competition'],
  homeAway: ['homeaway', 'homeoraway', 'venuetype'],
  venue: ['venue', 'location', 'hall', 'stadium'],
}

interface TargetOption<TField extends string> {
  value: TField | 'attribute' | 'ignore'
  label: string
}

export const PLAYER_TARGET_OPTIONS: TargetOption<PlayerFieldTarget>[] = [
  { value: 'name', label: 'Name' },
  { value: 'jerseyNumber', label: 'Jersey number' },
  { value: 'position', label: 'Position' },
  { value: 'photoUrl', label: 'Photo URL' },
  { value: 'attribute', label: 'Custom attribute' },
  { value: 'ignore', label: 'Ignore this column' },
]

export const GAME_TARGET_OPTIONS: TargetOption<GameFieldTarget>[] = [
  { value: 'date', label: 'Date' },
  { value: 'opponent', label: 'Opponent' },
  { value: 'team', label: 'Team' },
  { value: 'league', label: 'League' },
  { value: 'homeAway', label: 'Home / away' },
  { value: 'venue', label: 'Venue' },
  { value: 'attribute', label: 'Custom attribute' },
  { value: 'ignore', label: 'Ignore this column' },
]

function normalizeHeader(header: string): string {
  return header.toLowerCase().replace(/[^a-z0-9]/g, '')
}

/**
 * Best-effort auto-suggestion of a mapping for each detected source column:
 * known field synonyms map to their entity field, everything else defaults
 * to a custom attribute keyed by a slugified version of the header. The
 * user can adjust this in the ColumnMappingEditor before committing.
 *
 * Generic over the entity's field set so the same suggestion logic serves
 * every importable entity (Player, Game, ...) — just pass its synonym map.
 */
export function suggestColumnMappings<TField extends string>(
  headers: string[],
  fieldSynonyms: Record<TField, string[]>,
): ColumnMapping<TField>[] {
  const entries = Object.entries(fieldSynonyms) as [TField, string[]][]
  return headers.map((sourceKey) => {
    const normalized = normalizeHeader(sourceKey)
    const match = entries.find(([, synonyms]) => synonyms.includes(normalized))
    return {
      sourceKey,
      target: match ? match[0] : 'attribute',
      attributeKey: slugify(sourceKey),
    }
  })
}
