import type { ColumnMapping, PlayerFieldTarget } from '../../types/import'
import { slugify } from './slugify'

const FIELD_SYNONYMS: Record<PlayerFieldTarget, string[]> = {
  name: ['name', 'player', 'playername', 'fullname'],
  jerseyNumber: ['jerseynumber', 'jersey', 'number', 'no', 'num'],
  position: ['position', 'pos'],
  photoUrl: ['photo', 'photourl', 'image', 'imageurl', 'picture'],
}

function normalizeHeader(header: string): string {
  return header.toLowerCase().replace(/[^a-z0-9]/g, '')
}

/**
 * Best-effort auto-suggestion of a mapping for each detected source column:
 * known field synonyms map to their Player field, everything else defaults
 * to a custom attribute keyed by a slugified version of the header. The
 * user can adjust this in the ColumnMappingEditor before committing.
 */
export function suggestColumnMappings(headers: string[]): ColumnMapping[] {
  return headers.map((sourceKey) => {
    const normalized = normalizeHeader(sourceKey)
    const match = (Object.entries(FIELD_SYNONYMS) as [PlayerFieldTarget, string[]][]).find(
      ([, synonyms]) => synonyms.includes(normalized),
    )
    return {
      sourceKey,
      target: match ? match[0] : 'attribute',
      attributeKey: slugify(sourceKey),
    }
  })
}
