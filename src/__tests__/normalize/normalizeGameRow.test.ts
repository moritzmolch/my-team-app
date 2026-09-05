import { describe, expect, it } from 'vitest'
import { normalizeGameRow } from '../../lib/normalize/normalizeGameRow'
import type { ColumnMapping, GameFieldTarget } from '../../types/import'

const mappings: ColumnMapping<GameFieldTarget>[] = [
  { sourceKey: 'Date', target: 'date', attributeKey: 'date' },
  { sourceKey: 'Opponent', target: 'opponent', attributeKey: 'opponent' },
  { sourceKey: 'Team', target: 'team', attributeKey: 'team' },
  { sourceKey: 'League', target: 'league', attributeKey: 'league' },
  { sourceKey: 'Home/Away', target: 'homeAway', attributeKey: 'homeAway' },
  { sourceKey: 'Referee', target: 'attribute', attributeKey: 'referee' },
]

describe('normalizeGameRow', () => {
  it('promotes known fields and buckets the rest into attributes', () => {
    const result = normalizeGameRow(
      {
        Date: '2026-09-12',
        Opponent: 'TSV Rot-Weiß',
        Team: 'Damen 1',
        League: 'Landesliga',
        'Home/Away': 'Home',
        Referee: 'M. Keller',
      },
      mappings,
    )
    expect(result).toEqual({
      externalKey: '2026-09-12::tsv rot-weiß',
      date: '2026-09-12',
      opponent: 'TSV Rot-Weiß',
      team: 'Damen 1',
      league: 'Landesliga',
      homeAway: 'home',
      venue: undefined,
      attributes: { referee: 'M. Keller' },
    })
  })

  it('keeps an already-ISO date as-is', () => {
    const result = normalizeGameRow({ Date: '2026-09-12' }, mappings)
    expect(result.date).toBe('2026-09-12')
  })

  it('parses a non-ISO date string to ISO', () => {
    const result = normalizeGameRow({ Date: '09/12/2026' }, mappings)
    expect(result.date).toBe('2026-09-12')
  })

  it('normalizes home/away from short forms', () => {
    expect(normalizeGameRow({ 'Home/Away': 'H' }, mappings).homeAway).toBe('home')
    expect(normalizeGameRow({ 'Home/Away': 'a' }, mappings).homeAway).toBe('away')
  })

  it('derives externalKey from date + lowercased opponent', () => {
    const result = normalizeGameRow({ Date: '2026-09-12', Opponent: 'HSG Bergstadt' }, mappings)
    expect(result.externalKey).toBe('2026-09-12::hsg bergstadt')
  })
})
