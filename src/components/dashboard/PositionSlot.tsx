import { useDraggable, useDroppable } from '@dnd-kit/core'
import { POSITION_CODE } from '../../lib/squad/positions'
import type { HandballPosition, Player } from '../../types/player'
import type { SquadPhase } from '../../types/squad'

interface PositionSlotProps {
  phase: SquadPhase
  position: HandballPosition
  player: Player | undefined
  top: string
  left: string
  /** True if this player is missing their position in the other phase. */
  incomplete: boolean
}

export function PositionSlot({ phase, position, player, top, left, incomplete }: PositionSlotProps) {
  const slotId = `slot:${phase}:${position}`
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: slotId,
    data: { type: 'slot', phase, position },
  })
  const { attributes, listeners, setNodeRef: setDragRef, transform, isDragging } = useDraggable({
    id: `${slotId}:player`,
    data: player ? { type: 'slot-player', playerId: player.id, phase, position } : undefined,
    disabled: !player,
  })

  return (
    <div
      ref={setDropRef}
      data-testid={`slot-${phase}-${position}`}
      style={{ top, left }}
      className="absolute -translate-x-1/2 -translate-y-1/2"
    >
      <div
        ref={player ? setDragRef : undefined}
        {...(player ? listeners : {})}
        {...(player ? attributes : {})}
        style={transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined}
        title={player ? `${player.name} — ${POSITION_CODE[position]}` : POSITION_CODE[position]}
        className={`flex h-14 w-14 flex-col items-center justify-center rounded-full text-[11px] font-bold ring-2 transition-colors ${
          player ? 'cursor-grab bg-[#4DD9EA] text-[#0b1626] active:cursor-grabbing' : 'bg-[#4DD9EA]/20 text-[#8fe6f0]'
        } ${isOver ? 'ring-white' : incomplete ? 'ring-amber-400' : 'ring-transparent'} ${
          isDragging ? 'opacity-40' : ''
        }`}
      >
        {player ? (
          <>
            <span className="text-sm leading-none">{player.jerseyNumber ?? POSITION_CODE[position]}</span>
            <span className="text-[9px] font-medium leading-tight opacity-70">{POSITION_CODE[position]}</span>
          </>
        ) : (
          <span>{POSITION_CODE[position]}</span>
        )}
      </div>
    </div>
  )
}
