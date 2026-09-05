import Dexie, { type Table } from 'dexie'
import type { Game } from '../../types/game'
import type { Player } from '../../types/player'
import type { Squad } from '../../types/squad'

/**
 * The durable local store. Everything here lives in the browser's
 * IndexedDB — there's no server, so this is the app's actual database.
 */
export class AppDatabase extends Dexie {
  players!: Table<Player, string>
  games!: Table<Game, string>
  squads!: Table<Squad, string>

  constructor() {
    super('handball-team-app')
    this.version(1).stores({
      // Primary key 'id'; indexed on the fields we filter/match by.
      players: 'id, externalKey, jerseyNumber, position',
    })
    this.version(2).stores({
      players: 'id, externalKey, jerseyNumber, position',
      games: 'id, externalKey, team, league, date',
    })
    this.version(3).stores({
      players: 'id, externalKey, jerseyNumber, position',
      games: 'id, externalKey, team, league, date',
      squads: 'id, gameId',
    })
  }
}

export const db = new AppDatabase()
