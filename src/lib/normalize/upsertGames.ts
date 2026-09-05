import type { ImportSummary } from '../../types/import'
import type { Game } from '../../types/game'
import type { NormalizedGameInput } from './normalizeGameRow'

export interface UpsertGamesResult extends ImportSummary {
  games: Game[]
}

/**
 * Merge freshly-imported rows into the existing game list, matched by
 * `externalKey` (date + opponent by default). Same merge semantics as
 * upsertPlayers: promoted fields update from the import, attributes merge
 * key-by-key preserving locally-set keys the import doesn't mention, and
 * games missing from the import are kept (never auto-deleted) and flagged.
 */
export function upsertGames(existing: Game[], incoming: NormalizedGameInput[]): UpsertGamesResult {
  const now = new Date().toISOString()
  const byExternalKey = new Map(existing.map((g) => [g.externalKey, g]))
  const incomingKeys = new Set(incoming.map((i) => i.externalKey))

  let created = 0
  let updated = 0
  let unchanged = 0

  const merged = incoming.map((input): Game => {
    const current = byExternalKey.get(input.externalKey)

    if (!current) {
      created++
      return {
        id: crypto.randomUUID(),
        externalKey: input.externalKey,
        date: input.date,
        opponent: input.opponent,
        team: input.team,
        league: input.league,
        homeAway: input.homeAway,
        venue: input.venue,
        attributes: input.attributes,
        createdAt: now,
        updatedAt: now,
        source: 'import',
      }
    }

    const mergedAttributes = { ...current.attributes, ...input.attributes }
    const nextDate = input.date || current.date
    const nextOpponent = input.opponent || current.opponent
    const nextTeam = input.team || current.team
    const nextLeague = input.league || current.league
    const nextHomeAway = input.homeAway ?? current.homeAway
    const nextVenue = input.venue ?? current.venue

    const changed =
      current.date !== nextDate ||
      current.opponent !== nextOpponent ||
      current.team !== nextTeam ||
      current.league !== nextLeague ||
      current.homeAway !== nextHomeAway ||
      current.venue !== nextVenue ||
      JSON.stringify(current.attributes) !== JSON.stringify(mergedAttributes)

    if (changed) updated++
    else unchanged++

    return {
      ...current,
      date: nextDate,
      opponent: nextOpponent,
      team: nextTeam,
      league: nextLeague,
      homeAway: nextHomeAway,
      venue: nextVenue,
      attributes: mergedAttributes,
      updatedAt: changed ? now : current.updatedAt,
      source: 'import',
    }
  })

  const missing = existing.filter((g) => !incomingKeys.has(g.externalKey))

  return {
    games: [...merged, ...missing],
    created,
    updated,
    unchanged,
    missingExternalKeys: missing.map((g) => g.externalKey),
  }
}
