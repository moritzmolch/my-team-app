import type { HandballPosition } from '../../types/player'
import type { SquadPhase } from '../../types/squad'

/** Two-letter formation-board codes (German handball convention), matching the reference diagram. */
export const POSITION_CODE: Record<HandballPosition, string> = {
  GK: 'TH',
  LW: 'LA',
  RW: 'RA',
  LB: 'RL',
  CB: 'RM',
  RB: 'RR',
  PV: 'KL',
}

/** Attack formation: 6 outfield positions — the goalkeeper stays back and isn't placed. */
export const ATTACK_POSITIONS: HandballPosition[] = ['LW', 'LB', 'CB', 'PV', 'RB', 'RW']
/** Defense formation: all 7, including the goalkeeper. */
export const DEFENSE_POSITIONS: HandballPosition[] = ['GK', 'LW', 'LB', 'CB', 'PV', 'RB', 'RW']

export function positionsFor(phase: SquadPhase): HandballPosition[] {
  return phase === 'attack' ? ATTACK_POSITIONS : DEFENSE_POSITIONS
}

interface SlotCoord {
  top: string
  left: string
}

/** Formation-board coordinates (% of the court panel), matching the reference layout. */
export const SLOT_LAYOUT: Record<SquadPhase, Partial<Record<HandballPosition, SlotCoord>>> = {
  attack: {
    LW: { top: '13%', left: '10%' },
    RW: { top: '13%', left: '90%' },
    LB: { top: '40%', left: '23%' },
    PV: { top: '35%', left: '50%' },
    RB: { top: '40%', left: '77%' },
    CB: { top: '56%', left: '50%' },
  },
  defense: {
    LB: { top: '34%', left: '23%' },
    CB: { top: '30%', left: '41%' },
    PV: { top: '30%', left: '59%' },
    RB: { top: '34%', left: '77%' },
    LW: { top: '58%', left: '10%' },
    RW: { top: '58%', left: '90%' },
    GK: { top: '80%', left: '50%' },
  },
}
