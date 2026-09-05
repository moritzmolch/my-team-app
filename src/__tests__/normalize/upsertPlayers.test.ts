import { describe, expect, it } from 'vitest'
import type { Player } from '../../types/player'
import type { NormalizedPlayerInput } from '../../lib/normalize/normalizeRow'
import { upsertPlayers } from '../../lib/normalize/upsertPlayers'

function makePlayer(overrides: Partial<Player> = {}): Player {
  return {
    id: 'p1',
    externalKey: '1',
    name: 'Lena Brandt',
    jerseyNumber: 1,
    position: 'GK',
    attributes: { strengths: 'reflexes' },
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    source: 'manual',
    ...overrides,
  }
}

function makeInput(overrides: Partial<NormalizedPlayerInput> = {}): NormalizedPlayerInput {
  return {
    externalKey: '1',
    name: 'Lena Brandt',
    jerseyNumber: 1,
    position: 'GK',
    attributes: {},
    ...overrides,
  }
}

describe('upsertPlayers', () => {
  it('creates a new player when externalKey has no existing match', () => {
    const result = upsertPlayers([], [makeInput({ externalKey: '9', name: 'New Player', jerseyNumber: 9 })])
    expect(result.created).toBe(1)
    expect(result.updated).toBe(0)
    expect(result.players).toHaveLength(1)
    expect(result.players[0].name).toBe('New Player')
    expect(result.players[0].source).toBe('import')
  })

  it('updates promoted fields on a matching externalKey', () => {
    const existing = [makePlayer()]
    const result = upsertPlayers(existing, [makeInput({ name: 'Lena B.' })])
    expect(result.updated).toBe(1)
    expect(result.players[0].name).toBe('Lena B.')
    expect(result.players[0].id).toBe('p1') // id is preserved, not regenerated
  })

  it('merges attributes, letting the import overwrite matching keys', () => {
    const existing = [makePlayer({ attributes: { strengths: 'reflexes', weaknesses: 'distribution' } })]
    const result = upsertPlayers(existing, [makeInput({ attributes: { strengths: 'positioning' } })])
    expect(result.players[0].attributes).toEqual({
      strengths: 'positioning',
      weaknesses: 'distribution',
    })
  })

  it('preserves a locally-set attribute key that is absent from the re-import', () => {
    const existing = [makePlayer({ attributes: { weaknesses: 'left hand' } })]
    const result = upsertPlayers(existing, [makeInput({ attributes: {} })])
    expect(result.players[0].attributes).toEqual({ weaknesses: 'left hand' })
  })

  it('marks unchanged when nothing actually differs', () => {
    const existing = [makePlayer()]
    const result = upsertPlayers(existing, [makeInput({ attributes: { strengths: 'reflexes' } })])
    expect(result.unchanged).toBe(1)
    expect(result.updated).toBe(0)
  })

  it('keeps players missing from the import instead of deleting them, and flags them', () => {
    const existing = [makePlayer(), makePlayer({ id: 'p2', externalKey: '2', name: 'Other Player' })]
    const result = upsertPlayers(existing, [makeInput()])
    expect(result.players).toHaveLength(2)
    expect(result.players.some((p) => p.id === 'p2')).toBe(true)
    expect(result.missingExternalKeys).toEqual(['2'])
  })
})
