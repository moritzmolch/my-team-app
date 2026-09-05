import type { AttributeValue, HandballPosition } from '../../types/player'
import type { ColumnMapping } from '../../types/import'
import { slugify } from './slugify'

const VALID_POSITIONS: HandballPosition[] = ['GK', 'LW', 'RW', 'LB', 'CB', 'RB', 'PV']

/** A Player's data as derived from one imported row, before it's merged into the store. */
export interface NormalizedPlayerInput {
  /** Match key across re-imports: jerseyNumber if present, else the lowercased name. */
  externalKey: string
  name: string
  jerseyNumber?: number
  position?: HandballPosition
  photoUrl?: string
  attributes: Record<string, AttributeValue>
}

function toAttributeValue(value: unknown): AttributeValue {
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value
  }
  return String(value)
}

function isEmpty(value: unknown): boolean {
  return value === undefined || value === null || value === ''
}

export function normalizeRow(
  row: Record<string, unknown>,
  mappings: ColumnMapping[],
): NormalizedPlayerInput {
  const attributes: Record<string, AttributeValue> = {}
  let name = ''
  let jerseyNumber: number | undefined
  let position: HandballPosition | undefined
  let photoUrl: string | undefined

  for (const mapping of mappings) {
    const raw = row[mapping.sourceKey]
    if (isEmpty(raw)) continue

    switch (mapping.target) {
      case 'name':
        name = String(raw)
        break
      case 'jerseyNumber': {
        const n = Number(raw)
        if (!Number.isNaN(n)) jerseyNumber = n
        break
      }
      case 'position': {
        const upper = String(raw).toUpperCase() as HandballPosition
        if (VALID_POSITIONS.includes(upper)) position = upper
        break
      }
      case 'photoUrl':
        photoUrl = String(raw)
        break
      case 'attribute': {
        const key = mapping.attributeKey || slugify(mapping.sourceKey)
        attributes[key] = toAttributeValue(raw)
        break
      }
      case 'ignore':
        break
    }
  }

  const externalKey = jerseyNumber != null ? String(jerseyNumber) : name.trim().toLowerCase()

  return { externalKey, name, jerseyNumber, position, photoUrl, attributes }
}
