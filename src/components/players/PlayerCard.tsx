import type { Player } from '../../types/player'

const POSITION_LABELS: Record<string, string> = {
  GK: 'Goalkeeper',
  LW: 'Left Wing',
  RW: 'Right Wing',
  LB: 'Left Back',
  CB: 'Center Back',
  RB: 'Right Back',
  PV: 'Pivot',
}

export function PlayerCard({ player }: { player: Player }) {
  const attributeEntries = Object.entries(player.attributes).filter(
    ([, value]) => value !== null && value !== '',
  )

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">{player.name}</h3>
        {player.jerseyNumber != null && (
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-sm font-medium text-white dark:bg-neutral-100 dark:text-neutral-900">
            {player.jerseyNumber}
          </span>
        )}
      </div>
      {player.position && (
        <span className="w-fit rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
          {POSITION_LABELS[player.position] ?? player.position}
        </span>
      )}
      {attributeEntries.length > 0 && (
        <dl className="mt-1 flex flex-col gap-1 text-sm">
          {attributeEntries.map(([key, value]) => (
            <div key={key} className="flex gap-1">
              <dt className="capitalize text-neutral-500 dark:text-neutral-400">{key}:</dt>
              <dd className="text-neutral-700 dark:text-neutral-300">{String(value)}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  )
}
