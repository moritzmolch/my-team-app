import type { Game } from '../../types/game'
import { GameCard } from './GameCard'

export function GameList({ games }: { games: Game[] }) {
  if (games.length === 0) {
    return <p className="text-neutral-500 dark:text-neutral-400">No games match these filters.</p>
  }

  const sorted = [...games].sort((a, b) => a.date.localeCompare(b.date))

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {sorted.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  )
}
