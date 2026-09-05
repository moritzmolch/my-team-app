import { create } from 'zustand'
import { sampleGames } from '../data/sampleGames'
import { db } from '../lib/db/database'
import type { NormalizedGameInput } from '../lib/normalize/normalizeGameRow'
import { upsertGames } from '../lib/normalize/upsertGames'
import type { Game } from '../types/game'
import type { ImportSummary } from '../types/import'

interface GameStore {
  games: Game[]
  isHydrated: boolean
  /** Merge normalized import rows into the store; returns a summary for the confirmation UI. */
  importGames: (inputs: NormalizedGameInput[]) => Promise<ImportSummary>
}

// Same pattern as usePlayerStore: IndexedDB is the durable store, this is a
// hydrated cache over it, and actions write through to Dexie.
export const useGameStore = create<GameStore>((set, get) => ({
  games: [],
  isHydrated: false,
  importGames: async (inputs) => {
    const result = upsertGames(get().games, inputs)
    set({ games: result.games })
    await db.games.bulkPut(result.games)
    return {
      created: result.created,
      updated: result.updated,
      unchanged: result.unchanged,
      missingExternalKeys: result.missingExternalKeys,
    }
  },
}))

/** Load games from IndexedDB, seeding sample games only on a genuinely first run. Call once on app startup. */
export async function hydrateGameStore() {
  const stored = await db.games.toArray()
  if (stored.length === 0) {
    await db.games.bulkPut(sampleGames)
    useGameStore.setState({ games: sampleGames, isHydrated: true })
  } else {
    useGameStore.setState({ games: stored, isHydrated: true })
  }
}
