import { useMemo, useState } from 'react'
import { ALL_FILTER_VALUE, GameFilters, type ScheduleFilters } from '../components/schedule/GameFilters'
import { GameList } from '../components/schedule/GameList'
import { ImportGamesDialog } from '../components/schedule/ImportGamesDialog'
import { useGameStore } from '../store/useGameStore'

export function SchedulePage() {
  const games = useGameStore((s) => s.games)
  const [isImporting, setIsImporting] = useState(false)
  const [filters, setFilters] = useState<ScheduleFilters>({ team: ALL_FILTER_VALUE, league: ALL_FILTER_VALUE })

  const filteredGames = useMemo(
    () =>
      games.filter(
        (g) =>
          (filters.team === ALL_FILTER_VALUE || g.team === filters.team) &&
          (filters.league === ALL_FILTER_VALUE || g.league === filters.league),
      ),
    [games, filters],
  )

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Schedule</h1>
        <button
          onClick={() => setIsImporting(true)}
          className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          Import games
        </button>
      </div>
      <GameFilters games={games} filters={filters} onChange={setFilters} />
      <GameList games={filteredGames} />
      {isImporting && <ImportGamesDialog onClose={() => setIsImporting(false)} />}
    </section>
  )
}
