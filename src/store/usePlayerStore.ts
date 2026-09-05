import { create } from 'zustand'
import { samplePlayers } from '../data/samplePlayers'
import { db } from '../lib/db/database'
import type { NormalizedPlayerInput } from '../lib/normalize/normalizeRow'
import { upsertPlayers } from '../lib/normalize/upsertPlayers'
import type { ImportSummary } from '../types/import'
import type { Player } from '../types/player'

interface PlayerStore {
  players: Player[]
  /** True once the initial load from IndexedDB has completed. */
  isHydrated: boolean
  /** Merge normalized import rows into the store; returns a summary for the confirmation UI. */
  importPlayers: (inputs: NormalizedPlayerInput[]) => Promise<ImportSummary>
}

// IndexedDB is the durable store; this is a hydrated in-memory cache over
// it. Components read/write only through the store — actions write through
// to Dexie so the two never drift apart.
export const usePlayerStore = create<PlayerStore>((set, get) => ({
  players: [],
  isHydrated: false,
  importPlayers: async (inputs) => {
    const result = upsertPlayers(get().players, inputs)
    set({ players: result.players })
    await db.players.bulkPut(result.players)
    return {
      created: result.created,
      updated: result.updated,
      unchanged: result.unchanged,
      missingExternalKeys: result.missingExternalKeys,
    }
  },
}))

/**
 * Load players from IndexedDB into the store. On a genuinely first run
 * (empty database) it seeds the built-in sample players so the app isn't
 * blank; after that, whatever's in IndexedDB is the source of truth.
 * Call once on app startup.
 */
export async function hydratePlayerStore() {
  const stored = await db.players.toArray()
  if (stored.length === 0) {
    await db.players.bulkPut(samplePlayers)
    usePlayerStore.setState({ players: samplePlayers, isHydrated: true })
  } else {
    usePlayerStore.setState({ players: stored, isHydrated: true })
  }
}
