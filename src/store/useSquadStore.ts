import { create } from 'zustand'
import { db } from '../lib/db/database'
import type { Squad } from '../types/squad'

/** Typical handball matchday squad size (competitions commonly allow up to 16). */
export const ROSTER_CAP = 16

interface SquadStore {
  /** Keyed by gameId — one squad per game. */
  squadsByGameId: Record<string, Squad>
  isHydrated: boolean
  setRoster: (gameId: string, rosterPlayerIds: string[]) => Promise<void>
}

function emptySquad(gameId: string): Squad {
  return {
    id: crypto.randomUUID(),
    gameId,
    mode: 'roster',
    slots: [],
    rosterPlayerIds: [],
    updatedAt: new Date().toISOString(),
  }
}

export const useSquadStore = create<SquadStore>((set, get) => ({
  squadsByGameId: {},
  isHydrated: false,
  setRoster: async (gameId, rosterPlayerIds) => {
    const existing = get().squadsByGameId[gameId] ?? emptySquad(gameId)
    const squad: Squad = {
      ...existing,
      rosterPlayerIds: rosterPlayerIds.slice(0, ROSTER_CAP),
      updatedAt: new Date().toISOString(),
    }
    set((state) => ({ squadsByGameId: { ...state.squadsByGameId, [gameId]: squad } }))
    await db.squads.put(squad)
  },
}))

/** Load squads from IndexedDB. Call once on app startup. */
export async function hydrateSquadStore() {
  const stored = await db.squads.toArray()
  const squadsByGameId = Object.fromEntries(stored.map((s) => [s.gameId, s]))
  useSquadStore.setState({ squadsByGameId, isHydrated: true })
}
