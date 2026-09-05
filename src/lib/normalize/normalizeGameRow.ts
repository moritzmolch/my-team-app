import type { AttributeValue } from '../../types/attributes'
import type { ColumnMapping, GameFieldTarget } from '../../types/import'
import { isEmpty, toAttributeValue } from './rowValues'
import { slugify } from './slugify'

/** A Game's data as derived from one imported row, before it's merged into the store. */
export interface NormalizedGameInput {
  /** Match key across re-imports: date + opponent by default. */
  externalKey: string
  date: string
  opponent: string
  team: string
  league: string
  homeAway?: 'home' | 'away'
  venue?: string
  attributes: Record<string, AttributeValue>
}

function formatLocalDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Best-effort normalization of a date cell to ISO YYYY-MM-DD. */
function normalizeDate(raw: unknown): string {
  if (raw instanceof Date) {
    // js-yaml resolves a bare YAML date scalar as UTC midnight, so read it
    // back in UTC — using local getters here would shift it a day in any
    // timezone behind UTC.
    return raw.toISOString().slice(0, 10)
  }
  const str = String(raw).trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str
  const parsed = new Date(str)
  if (Number.isNaN(parsed.getTime())) return str
  // Non-ISO strings (e.g. "09/12/2026") are parsed by `Date` as local time,
  // so read them back with local getters to avoid a UTC-conversion shift.
  return formatLocalDate(parsed)
}

function normalizeHomeAway(raw: unknown): 'home' | 'away' | undefined {
  const s = String(raw).trim().toLowerCase()
  if (s === 'home' || s === 'h') return 'home'
  if (s === 'away' || s === 'a') return 'away'
  return undefined
}

export function normalizeGameRow(
  row: Record<string, unknown>,
  mappings: ColumnMapping<GameFieldTarget>[],
): NormalizedGameInput {
  const attributes: Record<string, AttributeValue> = {}
  let date = ''
  let opponent = ''
  let team = ''
  let league = ''
  let homeAway: 'home' | 'away' | undefined
  let venue: string | undefined

  for (const mapping of mappings) {
    const raw = row[mapping.sourceKey]
    if (isEmpty(raw)) continue

    switch (mapping.target) {
      case 'date':
        date = normalizeDate(raw)
        break
      case 'opponent':
        opponent = String(raw)
        break
      case 'team':
        team = String(raw)
        break
      case 'league':
        league = String(raw)
        break
      case 'homeAway':
        homeAway = normalizeHomeAway(raw)
        break
      case 'venue':
        venue = String(raw)
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

  const externalKey = `${date}::${opponent.trim().toLowerCase()}`

  return { externalKey, date, opponent, team, league, homeAway, venue, attributes }
}
