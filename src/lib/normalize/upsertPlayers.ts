import type { ImportSummary } from '../../types/import'
import type { Player } from '../../types/player'
import type { NormalizedPlayerInput } from './normalizeRow'

export interface UpsertPlayersResult extends ImportSummary {
  players: Player[]
}

/**
 * Merge freshly-imported rows into the existing player list, matched by
 * `externalKey`.
 *
 * - No existing match → a new Player is created.
 * - A match → promoted fields are updated from the import, and `attributes`
 *   are merged key-by-key: the import's keys win, but any locally-set key
 *   absent from this import is preserved rather than deleted — so a
 *   re-import with fewer columns can't silently wipe out data you entered
 *   by hand.
 * - An existing player whose externalKey isn't present in this import is
 *   kept (never auto-deleted) and reported in `missingExternalKeys` so the
 *   caller can surface it for a manual decision.
 */
export function upsertPlayers(
  existing: Player[],
  incoming: NormalizedPlayerInput[],
): UpsertPlayersResult {
  const now = new Date().toISOString()
  const byExternalKey = new Map(existing.map((p) => [p.externalKey, p]))
  const incomingKeys = new Set(incoming.map((i) => i.externalKey))

  let created = 0
  let updated = 0
  let unchanged = 0

  const merged = incoming.map((input): Player => {
    const current = byExternalKey.get(input.externalKey)

    if (!current) {
      created++
      return {
        id: crypto.randomUUID(),
        externalKey: input.externalKey,
        name: input.name,
        jerseyNumber: input.jerseyNumber,
        position: input.position,
        photoUrl: input.photoUrl,
        attributes: input.attributes,
        createdAt: now,
        updatedAt: now,
        source: 'import',
      }
    }

    const mergedAttributes = { ...current.attributes, ...input.attributes }
    const nextName = input.name || current.name
    const nextJerseyNumber = input.jerseyNumber ?? current.jerseyNumber
    const nextPosition = input.position ?? current.position
    const nextPhotoUrl = input.photoUrl ?? current.photoUrl

    const changed =
      current.name !== nextName ||
      current.jerseyNumber !== nextJerseyNumber ||
      current.position !== nextPosition ||
      current.photoUrl !== nextPhotoUrl ||
      JSON.stringify(current.attributes) !== JSON.stringify(mergedAttributes)

    if (changed) updated++
    else unchanged++

    return {
      ...current,
      name: nextName,
      jerseyNumber: nextJerseyNumber,
      position: nextPosition,
      photoUrl: nextPhotoUrl,
      attributes: mergedAttributes,
      updatedAt: changed ? now : current.updatedAt,
      source: 'import',
    }
  })

  const missing = existing.filter((p) => !incomingKeys.has(p.externalKey))

  return {
    players: [...merged, ...missing],
    created,
    updated,
    unchanged,
    missingExternalKeys: missing.map((p) => p.externalKey),
  }
}
