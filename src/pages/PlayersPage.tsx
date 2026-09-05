import { PlayerList } from '../components/players/PlayerList'
import { samplePlayers } from '../data/samplePlayers'

export function PlayersPage() {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Players</h1>
      <PlayerList players={samplePlayers} />
    </section>
  )
}
