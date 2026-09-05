import { create } from 'zustand'
import { samplePlayers } from '../data/samplePlayers'
import type { ImportSummary } from '../types/import'
import type { NormalizedPlayerInput } from '../lib/normalize/normalizeRow'
import { upsertPlayers } from '../lib/normalize/upsertPlayers'
import type { Player } from '../types/player'

interface PlayerStore {
  players: Player[]
  /** Merge normalized import rows into the store; returns a summary for the confirmation UI. */
  importPlayers: (inputs: NormalizedPlayerInput[]) => ImportSummary
}

// NOTE: in-memory only for now — persistence to IndexedDB lands in M3.
export const usePlayerStore = create<PlayerStore>((set, get) => ({
  players: samplePlayers,
  importPlayers: (inputs) => {
    const result = upsertPlayers(get().players, inputs)
    set({ players: result.players })
    return {
      created: result.created,
      updated: result.updated,
      unchanged: result.unchanged,
      missingExternalKeys: result.missingExternalKeys,
    }
  },
}))
