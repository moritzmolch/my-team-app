import { describe, expect, it } from 'vitest'
import { suggestColumnMappings } from '../../lib/normalize/mapColumns'

describe('suggestColumnMappings', () => {
  it('maps known headers to their Player field regardless of case/spacing', () => {
    const mappings = suggestColumnMappings(['Name', 'Jersey Number', 'Position', 'Photo URL'])
    expect(mappings.map((m) => m.target)).toEqual(['name', 'jerseyNumber', 'position', 'photoUrl'])
  })

  it('defaults unrecognized headers to a custom attribute with a slugified key', () => {
    const [mapping] = suggestColumnMappings(['Preferred Foot'])
    expect(mapping.target).toBe('attribute')
    expect(mapping.attributeKey).toBe('preferredFoot')
  })

  it('preserves the original header as sourceKey', () => {
    const [mapping] = suggestColumnMappings(['Jersey Number'])
    expect(mapping.sourceKey).toBe('Jersey Number')
  })
})
