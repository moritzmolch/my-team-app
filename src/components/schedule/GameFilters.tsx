import type { Game } from '../../types/game'

export interface ScheduleFilters {
  team: string
  league: string
}

export const ALL_FILTER_VALUE = 'all'

interface GameFiltersProps {
  games: Game[]
  filters: ScheduleFilters
  onChange: (filters: ScheduleFilters) => void
}

function distinctSorted(values: string[]): string[] {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b))
}

export function GameFilters({ games, filters, onChange }: GameFiltersProps) {
  const teams = distinctSorted(games.map((g) => g.team))
  const leagues = distinctSorted(games.map((g) => g.league))

  return (
    <div className="flex flex-wrap gap-3">
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-neutral-500 dark:text-neutral-400">Team</span>
        <select
          value={filters.team}
          onChange={(e) => onChange({ ...filters, team: e.target.value })}
          className="rounded border border-neutral-300 bg-white px-2 py-1 text-sm dark:border-neutral-700 dark:bg-neutral-950"
        >
          <option value={ALL_FILTER_VALUE}>All teams</option>
          {teams.map((team) => (
            <option key={team} value={team}>
              {team}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-neutral-500 dark:text-neutral-400">League</span>
        <select
          value={filters.league}
          onChange={(e) => onChange({ ...filters, league: e.target.value })}
          className="rounded border border-neutral-300 bg-white px-2 py-1 text-sm dark:border-neutral-700 dark:bg-neutral-950"
        >
          <option value={ALL_FILTER_VALUE}>All leagues</option>
          {leagues.map((league) => (
            <option key={league} value={league}>
              {league}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
