import { create } from 'zustand'
import { db } from '../lib/db/database'
import type { Squad } from '../types/squad'

interface SquadStore {
  /** Keyed by gameId — one squad per game. */
  squadsByGameId: Record<string, Squad>
  isHydrated: boolean
  /** Apply a pure transformation (see lib/squad/slots.ts) to a game's squad and persist the result. */
  updateSquad: (gameId: string, updater: (squad: Squad) => Squad) => Promise<void>
}

function emptySquad(gameId: string): Squad {
  return {
    id: crypto.randomUUID(),
    gameId,
    attackSlots: {},
    defenseSlots: {},
    updatedAt: new Date().toISOString(),
  }
}

export const useSquadStore = create<SquadStore>((set, get) => ({
  squadsByGameId: {},
  isHydrated: false,
  updateSquad: async (gameId, updater) => {
    const current = get().squadsByGameId[gameId] ?? emptySquad(gameId)
    const next = { ...updater(current), updatedAt: new Date().toISOString() }
    set((state) => ({ squadsByGameId: { ...state.squadsByGameId, [gameId]: next } }))
    await db.squads.put(next)
  },
}))

/** Load squads from IndexedDB. Call once on app startup. */
export async function hydrateSquadStore() {
  const stored = await db.squads.toArray()
  useSquadStore.setState({
    squadsByGameId: Object.fromEntries(stored.map((s) => [s.gameId, s])),
    isHydrated: true,
  })
}
