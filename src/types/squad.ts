import type { HandballPosition } from './player'

export type SquadPhase = 'attack' | 'defense'

/**
 * The squad selected for one game, as a formation board: one player per
 * named position, tracked separately for attack and defense. A player can
 * hold a different position in each phase (or only one, while you're still
 * arranging things) — attack and defense are independent slot maps, not a
 * single "position" per player.
 */
export interface Squad {
  id: string
  gameId: string
  attackSlots: Partial<Record<HandballPosition, string>>
  defenseSlots: Partial<Record<HandballPosition, string>>
  updatedAt: string
}
