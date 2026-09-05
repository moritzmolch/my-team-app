import { useState } from 'react'
import { SquadBuilder } from '../components/dashboard/SquadBuilder'
import { useGameStore } from '../store/useGameStore'

export function DashboardPage() {
  const games = useGameStore((s) => s.games)
  const sortedGames = [...games].sort((a, b) => a.date.localeCompare(b.date))
  // null until the user picks explicitly; the fallback below defaults to the soonest game.
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null)

  if (games.length === 0) {
    return (
      <section className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Dashboard</h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          No games yet — import a schedule on the Schedule page first.
        </p>
      </section>
    )
  }

  const selectedGame = games.find((g) => g.id === selectedGameId) ?? sortedGames[0]

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Dashboard</h1>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-neutral-500 dark:text-neutral-400">Game</span>
          <select
            value={selectedGame.id}
            onChange={(e) => setSelectedGameId(e.target.value)}
            className="rounded border border-neutral-300 bg-white px-2 py-1 text-sm dark:border-neutral-700 dark:bg-neutral-950"
          >
            {sortedGames.map((g) => (
              <option key={g.id} value={g.id}>
                {g.date} vs {g.opponent} ({g.team})
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        Drag players from the pool into the squad — or click ✕ to remove one.
      </p>
      <SquadBuilder key={selectedGame.id} gameId={selectedGame.id} />
    </section>
  )
}
