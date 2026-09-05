import { useDraggable, useDroppable } from '@dnd-kit/core'
import type { Player } from '../../types/player'

function PoolPlayerCard({ player }: { player: Player }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `pool:${player.id}`,
    data: { type: 'pool-player', playerId: player.id },
  })

  return (
    <div
      ref={setNodeRef}
      style={transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined}
      {...listeners}
      {...attributes}
      className={`flex cursor-grab items-center justify-between gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm shadow-sm active:cursor-grabbing dark:border-neutral-800 dark:bg-neutral-900 ${
        isDragging ? 'opacity-40' : ''
      }`}
    >
      <span className="font-medium text-neutral-900 dark:text-neutral-100">
        {player.name}
        {player.position && <span className="ml-2 text-xs font-normal text-neutral-500 dark:text-neutral-400">{player.position}</span>}
      </span>
      {player.jerseyNumber != null && (
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs text-white dark:bg-neutral-100 dark:text-neutral-900">
          {player.jerseyNumber}
        </span>
      )}
    </div>
  )
}

export function PlayerPool({ players }: { players: Player[] }) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'pool-container',
    data: { type: 'pool-container' },
  })

  return (
    <div
      ref={setNodeRef}
      data-testid="pool-dropzone"
      className={`flex min-h-[200px] flex-col gap-2 rounded-lg border-2 border-dashed p-3 transition-colors ${
        isOver ? 'border-purple-400 bg-purple-50 dark:bg-purple-950/20' : 'border-neutral-200 dark:border-neutral-800'
      }`}
    >
      <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        Available players
      </h3>
      {players.length === 0 && (
        <p className="text-sm text-neutral-400 dark:text-neutral-600">All players are in the squad.</p>
      )}
      {players.map((player) => (
        <PoolPlayerCard key={player.id} player={player} />
      ))}
    </div>
  )
}
