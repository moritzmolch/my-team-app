import { describe, expect, it } from 'vitest'
import type { ColumnMapping } from '../../types/import'
import { normalizeRow } from '../../lib/normalize/normalizeRow'

const mappings: ColumnMapping[] = [
  { sourceKey: 'Name', target: 'name', attributeKey: 'name' },
  { sourceKey: 'Jersey', target: 'jerseyNumber', attributeKey: 'jersey' },
  { sourceKey: 'Position', target: 'position', attributeKey: 'position' },
  { sourceKey: 'Strengths', target: 'attribute', attributeKey: 'strengths' },
]

describe('normalizeRow', () => {
  it('promotes known fields and buckets the rest into attributes', () => {
    const result = normalizeRow(
      { Name: 'Lena Brandt', Jersey: 1, Position: 'gk', Strengths: 'reflexes' },
      mappings,
    )
    expect(result).toEqual({
      externalKey: '1',
      name: 'Lena Brandt',
      jerseyNumber: 1,
      position: 'GK',
      photoUrl: undefined,
      attributes: { strengths: 'reflexes' },
    })
  })

  it('derives externalKey from the name when there is no jersey number', () => {
    const result = normalizeRow({ Name: 'No Number Player' }, mappings)
    expect(result.externalKey).toBe('no number player')
  })

  it('skips empty cells rather than overwriting with blank values', () => {
    const result = normalizeRow({ Name: 'Lena Brandt', Jersey: '', Strengths: '' }, mappings)
    expect(result.jerseyNumber).toBeUndefined()
    expect(result.attributes).toEqual({})
  })

  it('ignores an unrecognized position value rather than storing garbage', () => {
    const result = normalizeRow({ Name: 'X', Position: 'not-a-position' }, mappings)
    expect(result.position).toBeUndefined()
  })
})
