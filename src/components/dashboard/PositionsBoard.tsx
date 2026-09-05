import type { Player } from '../../types/player'
import type { Squad } from '../../types/squad'
import { CourtHalf } from './CourtHalf'

interface PositionsBoardProps {
  squad: Squad
  playersById: Map<string, Player>
  incompletePlayerIds: Set<string>
}

export function PositionsBoard({ squad, playersById, incompletePlayerIds }: PositionsBoardProps) {
  return (
    <div className="mx-auto w-full max-w-sm overflow-hidden rounded-2xl bg-[#122349] ring-1 ring-white/10">
      <CourtHalf
        phase="attack"
        label="Angriff"
        slots={squad.attackSlots}
        playersById={playersById}
        incompletePlayerIds={incompletePlayerIds}
      />
      <div className="h-px bg-white/25" />
      <CourtHalf
        phase="defense"
        label="Verteidigung"
        slots={squad.defenseSlots}
        playersById={playersById}
        incompletePlayerIds={incompletePlayerIds}
      />
    </div>
  )
}
