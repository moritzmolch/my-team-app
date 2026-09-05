import { positionsFor, SLOT_LAYOUT } from '../../lib/squad/positions'
import type { Player } from '../../types/player'
import type { Squad, SquadPhase } from '../../types/squad'
import { PositionSlot } from './PositionSlot'

function CourtLines({ goalAtTop }: { goalAtTop: boolean }) {
  const goalY = goalAtTop ? 4 : 96
  const areaCrestY = goalAtTop ? 34 : 66
  const arcCrestY = goalAtTop ? 12 : 88
  const arcSideY = goalAtTop ? 56 : 44
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
      <line x1="25" y1={goalY} x2="75" y2={goalY} stroke="white" strokeWidth="1.2" />
      <path d={`M25,${goalY} Q50,${areaCrestY} 75,${goalY}`} fill="none" stroke="white" strokeWidth="1" />
      <path
        d={`M4,${arcSideY} Q50,${arcCrestY} 96,${arcSideY}`}
        fill="none"
        stroke="white"
        strokeOpacity="0.75"
        strokeWidth="1"
        strokeDasharray="3 2.5"
      />
    </svg>
  )
}

interface CourtHalfProps {
  phase: SquadPhase
  label: string
  slots: Squad['attackSlots'] | Squad['defenseSlots']
  playersById: Map<string, Player>
  incompletePlayerIds: Set<string>
}

export function CourtHalf({ phase, label, slots, playersById, incompletePlayerIds }: CourtHalfProps) {
  const goalAtTop = phase === 'attack'
  return (
    <div className="relative" style={{ aspectRatio: '10 / 9.5' }}>
      <CourtLines goalAtTop={goalAtTop} />
      {positionsFor(phase).map((position) => {
        const coord = SLOT_LAYOUT[phase][position]
        if (!coord) return null
        const playerId = slots[position]
        const player = playerId ? playersById.get(playerId) : undefined
        return (
          <PositionSlot
            key={position}
            phase={phase}
            position={position}
            player={player}
            top={coord.top}
            left={coord.left}
            incomplete={player != null && incompletePlayerIds.has(player.id)}
          />
        )
      })}
      <p
        className="absolute left-1/2 -translate-x-1/2 text-sm font-medium tracking-wide text-white/50"
        style={{ top: goalAtTop ? '78%' : '17%' }}
      >
        {label}
      </p>
    </div>
  )
}
