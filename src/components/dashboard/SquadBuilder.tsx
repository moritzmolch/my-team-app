import { closestCenter, DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { useMemo } from 'react'
import { assignedPlayerIds, assignSlot, clearPlayer, isPlayerComplete, moveSlot } from '../../lib/squad/slots'
import { usePlayerStore } from '../../store/usePlayerStore'
import { useSquadStore } from '../../store/useSquadStore'
import type { HandballPosition } from '../../types/player'
import type { SquadPhase } from '../../types/squad'
import { PlayerPool } from './PlayerPool'
import { PositionsBoard } from './PositionsBoard'

type DragData =
  | { type: 'pool-player'; playerId: string }
  | { type: 'slot-player'; playerId: string; phase: SquadPhase; position: HandballPosition }

interface DropData {
  type: 'slot' | 'pool-container'
  phase?: SquadPhase
  position?: HandballPosition
}

export function SquadBuilder({ gameId }: { gameId: string }) {
  const players = usePlayerStore((s) => s.players)
  const squad = useSquadStore((s) => s.squadsByGameId[gameId])
  const updateSquad = useSquadStore((s) => s.updateSquad)

  const playersById = useMemo(() => new Map(players.map((p) => [p.id, p])), [players])

  const assignedIds = useMemo(() => (squad ? assignedPlayerIds(squad) : new Set<string>()), [squad])
  const poolPlayers = useMemo(() => players.filter((p) => !assignedIds.has(p.id)), [players, assignedIds])
  const incompletePlayerIds = useMemo(() => {
    if (!squad) return new Set<string>()
    return new Set([...assignedIds].filter((id) => !isPlayerComplete(squad, id)))
  }, [squad, assignedIds])

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) return
    const activeData = active.data.current as DragData | undefined
    const overData = over.data.current as DropData | undefined
    if (!activeData || !overData) return

    if (activeData.type === 'pool-player') {
      if (overData.type !== 'slot' || !overData.phase || !overData.position) return
      updateSquad(gameId, (squad) => assignSlot(squad, overData.phase!, overData.position!, activeData.playerId))
      return
    }

    // activeData.type === 'slot-player'
    if (overData.type === 'pool-container') {
      updateSquad(gameId, (squad) => clearPlayer(squad, activeData.playerId))
      return
    }
    if (overData.type === 'slot' && overData.phase && overData.position) {
      const from = { phase: activeData.phase, position: activeData.position }
      const to = { phase: overData.phase, position: overData.position }
      updateSquad(gameId, (squad) => moveSlot(squad, from, to))
    }
  }

  const boardSquad = squad ?? { id: '', gameId, attackSlots: {}, defenseSlots: {}, updatedAt: '' }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,320px)_1fr]">
        <PlayerPool players={poolPlayers} />
        <PositionsBoard squad={boardSquad} playersById={playersById} incompletePlayerIds={incompletePlayerIds} />
      </div>
    </DndContext>
  )
}
