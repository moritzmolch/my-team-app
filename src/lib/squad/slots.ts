import type { HandballPosition } from '../../types/player'
import type { Squad, SquadPhase } from '../../types/squad'

type SlotMap = Partial<Record<HandballPosition, string>>

function slotsFor(squad: Squad, phase: SquadPhase): SlotMap {
  return phase === 'attack' ? squad.attackSlots : squad.defenseSlots
}

function withSlots(squad: Squad, phase: SquadPhase, slots: SlotMap): Squad {
  return phase === 'attack' ? { ...squad, attackSlots: slots } : { ...squad, defenseSlots: slots }
}

function stripPlayer(slots: SlotMap, playerId: string): SlotMap {
  const next = { ...slots }
  for (const position of Object.keys(next) as HandballPosition[]) {
    if (next[position] === playerId) delete next[position]
  }
  return next
}

/** Remove a player from every slot in both phases — used when dragging back to the pool. */
export function clearPlayer(squad: Squad, playerId: string): Squad {
  return {
    ...squad,
    attackSlots: stripPlayer(squad.attackSlots, playerId),
    defenseSlots: stripPlayer(squad.defenseSlots, playerId),
  }
}

/**
 * Place a player into a slot. Only clears that player's other slot in the
 * *same* phase (a player holds at most one attack slot and one defense
 * slot at a time) — their assignment in the other phase, if any, is left
 * alone, since attack and defense positions can differ. Whoever previously
 * held the destination slot is displaced (they return to the pool).
 */
export function assignSlot(squad: Squad, phase: SquadPhase, position: HandballPosition, playerId: string): Squad {
  const nextSlots = { ...stripPlayer(slotsFor(squad, phase), playerId), [position]: playerId }
  return withSlots(squad, phase, nextSlots)
}

export function clearSlot(squad: Squad, phase: SquadPhase, position: HandballPosition): Squad {
  const nextSlots = { ...slotsFor(squad, phase) }
  delete nextSlots[position]
  return withSlots(squad, phase, nextSlots)
}

/**
 * Move a player already occupying a slot to another slot. Within the same
 * phase this swaps with whoever's there, if anyone (typical formation-board
 * behavior). Across phases it behaves like assignSlot — the player's
 * other-phase slot is untouched, since that's how a player ends up with
 * two different positions.
 */
export function moveSlot(
  squad: Squad,
  from: { phase: SquadPhase; position: HandballPosition },
  to: { phase: SquadPhase; position: HandballPosition },
): Squad {
  if (from.phase === to.phase && from.position === to.position) return squad
  const playerId = slotsFor(squad, from.phase)[from.position]
  if (!playerId) return squad

  if (from.phase !== to.phase) {
    return assignSlot(squad, to.phase, to.position, playerId)
  }

  const destPlayerId = slotsFor(squad, to.phase)[to.position]
  const nextSlots = { ...slotsFor(squad, from.phase) }
  delete nextSlots[from.position]
  nextSlots[to.position] = playerId
  if (destPlayerId) nextSlots[from.position] = destPlayerId
  return withSlots(squad, from.phase, nextSlots)
}

/** Which position (if any) a player holds in each phase. */
export function getPlayerPositions(
  squad: Squad,
  playerId: string,
): { attack?: HandballPosition; defense?: HandballPosition } {
  const attack = (Object.keys(squad.attackSlots) as HandballPosition[]).find(
    (position) => squad.attackSlots[position] === playerId,
  )
  const defense = (Object.keys(squad.defenseSlots) as HandballPosition[]).find(
    (position) => squad.defenseSlots[position] === playerId,
  )
  return { attack, defense }
}

/** A player is "fully placed" once they have both an attack and a defense position. */
export function isPlayerComplete(squad: Squad, playerId: string): boolean {
  const { attack, defense } = getPlayerPositions(squad, playerId)
  return attack != null && defense != null
}

/** Every player id that occupies at least one slot, in either phase. */
export function assignedPlayerIds(squad: Squad): Set<string> {
  return new Set([...Object.values(squad.attackSlots), ...Object.values(squad.defenseSlots)].filter(
    (id): id is string => id != null,
  ))
}
