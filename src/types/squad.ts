/** One position slot in "positions" mode (added in a later milestone). */
export interface SquadSlot {
  slotId: string
  playerId: string | null
}

/** The squad selected for one game. One Squad per gameId. */
export interface Squad {
  id: string
  gameId: string
  mode: 'positions' | 'roster'
  /** Used when mode === 'positions'. */
  slots: SquadSlot[]
  /** Used when mode === 'roster': an ordered list of player ids. */
  rosterPlayerIds: string[]
  updatedAt: string
}
