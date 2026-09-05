import { describe, expect, it } from 'vitest'
import type { NormalizedGameInput } from '../../lib/normalize/normalizeGameRow'
import { upsertGames } from '../../lib/normalize/upsertGames'
import type { Game } from '../../types/game'

function makeGame(overrides: Partial<Game> = {}): Game {
  return {
    id: 'g1',
    externalKey: '2026-09-12::tsv rot-weiß',
    date: '2026-09-12',
    opponent: 'TSV Rot-Weiß',
    team: 'Damen 1',
    league: 'Landesliga',
    homeAway: 'home',
    attributes: { referee: 'M. Keller' },
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    source: 'manual',
    ...overrides,
  }
}

function makeInput(overrides: Partial<NormalizedGameInput> = {}): NormalizedGameInput {
  return {
    externalKey: '2026-09-12::tsv rot-weiß',
    date: '2026-09-12',
    opponent: 'TSV Rot-Weiß',
    team: 'Damen 1',
    league: 'Landesliga',
    homeAway: 'home',
    attributes: {},
    ...overrides,
  }
}

describe('upsertGames', () => {
  it('creates a new game when externalKey has no existing match', () => {
    const result = upsertGames(
      [],
      [makeInput({ externalKey: '2026-10-03::sg talheim', opponent: 'SG Talheim' })],
    )
    expect(result.created).toBe(1)
    expect(result.games[0].opponent).toBe('SG Talheim')
    expect(result.games[0].source).toBe('import')
  })

  it('updates promoted fields on a matching externalKey', () => {
    const result = upsertGames([makeGame()], [makeInput({ venue: 'Sporthalle Ost' })])
    expect(result.updated).toBe(1)
    expect(result.games[0].venue).toBe('Sporthalle Ost')
    expect(result.games[0].id).toBe('g1')
  })

  it('preserves a locally-set attribute absent from the re-import', () => {
    const result = upsertGames([makeGame()], [makeInput({ attributes: {} })])
    expect(result.games[0].attributes).toEqual({ referee: 'M. Keller' })
  })

  it('keeps games missing from the import instead of deleting them, and flags them', () => {
    const existing = [makeGame(), makeGame({ id: 'g2', externalKey: 'x', opponent: 'Other' })]
    const result = upsertGames(existing, [makeInput()])
    expect(result.games).toHaveLength(2)
    expect(result.missingExternalKeys).toEqual(['x'])
  })
})
