import { useDroppable } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Player } from '../../types/player'

interface RosterItemProps {
  player: Player
  index: number
  onRemove: (playerId: string) => void
}

function RosterItem({ player, index, onRemove }: RosterItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `roster:${player.id}`,
    data: { type: 'roster-player', playerId: player.id },
  })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm shadow-sm dark:border-neutral-800 dark:bg-neutral-900 ${
        isDragging ? 'opacity-40' : ''
      }`}
    >
      <span className="w-5 shrink-0 text-xs text-neutral-400 dark:text-neutral-600">{index + 1}</span>
      <span {...listeners} {...attributes} className="flex-1 cursor-grab font-medium text-neutral-900 active:cursor-grabbing dark:text-neutral-100">
        {player.name}
        {player.jerseyNumber != null && (
          <span className="ml-2 text-xs font-normal text-neutral-500 dark:text-neutral-400">#{player.jerseyNumber}</span>
        )}
      </span>
      <button
        onClick={() => onRemove(player.id)}
        aria-label={`Remove ${player.name} from squad`}
        className="rounded px-1.5 py-0.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
      >
        ✕
      </button>
    </div>
  )
}

interface RosterListProps {
  players: Player[]
  cap: number
  onRemove: (playerId: string) => void
}

export function RosterList({ players, cap, onRemove }: RosterListProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'roster-container',
    data: { type: 'roster-container' },
  })

  return (
    <div
      ref={setNodeRef}
      data-testid="roster-dropzone"
      className={`flex min-h-[200px] flex-col gap-2 rounded-lg border-2 border-dashed p-3 transition-colors ${
        isOver ? 'border-purple-400 bg-purple-50 dark:bg-purple-950/20' : 'border-neutral-200 dark:border-neutral-800'
      }`}
    >
      <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        Squad ({players.length}/{cap})
      </h3>
      {players.length === 0 && (
        <p className="text-sm text-neutral-400 dark:text-neutral-600">Drag players here to build the squad.</p>
      )}
      <SortableContext items={players.map((p) => `roster:${p.id}`)} strategy={verticalListSortingStrategy}>
        {players.map((player, index) => (
          <RosterItem key={player.id} player={player} index={index} onRemove={onRemove} />
        ))}
      </SortableContext>
    </div>
  )
}
