import type { Player } from '../../types/player'
import { PlayerCard } from './PlayerCard'

export function PlayerList({ players }: { players: Player[] }) {
  if (players.length === 0) {
    return <p className="text-neutral-500 dark:text-neutral-400">No players yet.</p>
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {players.map((player) => (
        <PlayerCard key={player.id} player={player} />
      ))}
    </div>
  )
}
