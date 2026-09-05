import { describe, expect, it } from 'vitest'
import { GAME_FIELD_SYNONYMS, PLAYER_FIELD_SYNONYMS, suggestColumnMappings } from '../../lib/normalize/mapColumns'

describe('suggestColumnMappings', () => {
  it('maps known Player headers to their field regardless of case/spacing', () => {
    const mappings = suggestColumnMappings(
      ['Name', 'Jersey Number', 'Position', 'Photo URL'],
      PLAYER_FIELD_SYNONYMS,
    )
    expect(mappings.map((m) => m.target)).toEqual(['name', 'jerseyNumber', 'position', 'photoUrl'])
  })

  it('maps known Game headers to their field regardless of case/spacing', () => {
    const mappings = suggestColumnMappings(
      ['Date', 'Opponent', 'Team', 'League', 'Home/Away', 'Venue'],
      GAME_FIELD_SYNONYMS,
    )
    expect(mappings.map((m) => m.target)).toEqual([
      'date',
      'opponent',
      'team',
      'league',
      'homeAway',
      'venue',
    ])
  })

  it('defaults unrecognized headers to a custom attribute with a slugified key', () => {
    const [mapping] = suggestColumnMappings(['Preferred Foot'], PLAYER_FIELD_SYNONYMS)
    expect(mapping.target).toBe('attribute')
    expect(mapping.attributeKey).toBe('preferredFoot')
  })

  it('preserves the original header as sourceKey', () => {
    const [mapping] = suggestColumnMappings(['Jersey Number'], PLAYER_FIELD_SYNONYMS)
    expect(mapping.sourceKey).toBe('Jersey Number')
  })
})
