import { closestCenter, DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useMemo } from 'react'
import { usePlayerStore } from '../../store/usePlayerStore'
import { ROSTER_CAP, useSquadStore } from '../../store/useSquadStore'
import { PlayerPool } from './PlayerPool'
import { RosterList } from './RosterList'

interface DragData {
  type: 'pool-player' | 'roster-player'
  playerId: string
}

// Stable reference so useMemo below doesn't see a "new" array every render
// when there's no squad yet.
const EMPTY_ROSTER: string[] = []

export function SquadBuilder({ gameId }: { gameId: string }) {
  const players = usePlayerStore((s) => s.players)
  const squad = useSquadStore((s) => s.squadsByGameId[gameId])
  const setRoster = useSquadStore((s) => s.setRoster)

  const rosterPlayerIds = squad?.rosterPlayerIds ?? EMPTY_ROSTER

  const rosterPlayers = useMemo(() => {
    const byId = new Map(players.map((p) => [p.id, p]))
    return rosterPlayerIds.map((id) => byId.get(id)).filter((p): p is NonNullable<typeof p> => p != null)
  }, [rosterPlayerIds, players])

  const poolPlayers = useMemo(
    () => players.filter((p) => !rosterPlayerIds.includes(p.id)),
    [players, rosterPlayerIds],
  )

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))

  function handleRemove(playerId: string) {
    setRoster(gameId, rosterPlayerIds.filter((id) => id !== playerId))
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) return
    const activeData = active.data.current as DragData | undefined
    if (!activeData) return
    const overId = String(over.id)

    if (activeData.type === 'pool-player') {
      const overIsRoster = overId === 'roster-container' || overId.startsWith('roster:')
      if (!overIsRoster) return
      if (rosterPlayerIds.includes(activeData.playerId) || rosterPlayerIds.length >= ROSTER_CAP) return
      setRoster(gameId, [...rosterPlayerIds, activeData.playerId])
      return
    }

    // roster-player: drag back onto the pool to remove, or onto another roster item to reorder.
    if (overId === 'pool-container' || overId.startsWith('pool:')) {
      setRoster(gameId, rosterPlayerIds.filter((id) => id !== activeData.playerId))
      return
    }
    if (overId.startsWith('roster:')) {
      const overPlayerId = overId.slice('roster:'.length)
      const oldIndex = rosterPlayerIds.indexOf(activeData.playerId)
      const newIndex = rosterPlayerIds.indexOf(overPlayerId)
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        setRoster(gameId, arrayMove(rosterPlayerIds, oldIndex, newIndex))
      }
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <PlayerPool players={poolPlayers} />
        <RosterList players={rosterPlayers} cap={ROSTER_CAP} onRemove={handleRemove} />
      </div>
    </DndContext>
  )
}
