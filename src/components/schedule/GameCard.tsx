import { attributeLabel } from '../../lib/normalize/slugify'
import type { Game } from '../../types/game'

function formatDate(isoDate: string): string {
  const parsed = new Date(`${isoDate}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return isoDate
  return parsed.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}

export function GameCard({ game }: { game: Game }) {
  const attributeEntries = Object.entries(game.attributes).filter(
    ([, value]) => value !== null && value !== '',
  )

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">vs {game.opponent}</h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{formatDate(game.date)}</p>
        </div>
        {game.homeAway && (
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
              game.homeAway === 'home'
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                : 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300'
            }`}
          >
            {game.homeAway === 'home' ? 'Home' : 'Away'}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
          {game.team}
        </span>
        <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
          {game.league}
        </span>
      </div>
      {game.venue && <p className="text-sm text-neutral-500 dark:text-neutral-400">{game.venue}</p>}
      {attributeEntries.length > 0 && (
        <dl className="mt-1 flex flex-col gap-1 text-sm">
          {attributeEntries.map(([key, value]) => (
            <div key={key} className="flex gap-1">
              <dt className="text-neutral-500 dark:text-neutral-400">{attributeLabel(key)}:</dt>
              <dd className="text-neutral-700 dark:text-neutral-300">{String(value)}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  )
}
