import { useState } from 'react'
import { ImportPlayersDialog } from '../components/players/ImportPlayersDialog'
import { PlayerList } from '../components/players/PlayerList'
import { usePlayerStore } from '../store/usePlayerStore'

export function PlayersPage() {
  const players = usePlayerStore((s) => s.players)
  const [isImporting, setIsImporting] = useState(false)

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Players</h1>
        <button
          onClick={() => setIsImporting(true)}
          className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          Import players
        </button>
      </div>
      <PlayerList players={players} />
      {isImporting && <ImportPlayersDialog onClose={() => setIsImporting(false)} />}
    </section>
  )
}
