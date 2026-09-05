import { describe, expect, it } from 'vitest'
import {
  assignedPlayerIds,
  assignSlot,
  clearPlayer,
  clearSlot,
  getPlayerPositions,
  isPlayerComplete,
  moveSlot,
} from '../../lib/squad/slots'
import type { Squad } from '../../types/squad'

function emptySquad(): Squad {
  return { id: 's1', gameId: 'g1', attackSlots: {}, defenseSlots: {}, updatedAt: '' }
}

describe('assignSlot', () => {
  it('places a player into an empty slot', () => {
    const squad = assignSlot(emptySquad(), 'attack', 'CB', 'p1')
    expect(squad.attackSlots.CB).toBe('p1')
  })

  it('moves a player within the same phase rather than duplicating them', () => {
    let squad = assignSlot(emptySquad(), 'attack', 'CB', 'p1')
    squad = assignSlot(squad, 'attack', 'LB', 'p1')
    expect(squad.attackSlots.CB).toBeUndefined()
    expect(squad.attackSlots.LB).toBe('p1')
  })

  it('leaves the other phase untouched — a player can hold different positions in each', () => {
    let squad = assignSlot(emptySquad(), 'attack', 'CB', 'p1')
    squad = assignSlot(squad, 'defense', 'LB', 'p1')
    expect(squad.attackSlots.CB).toBe('p1')
    expect(squad.defenseSlots.LB).toBe('p1')
  })

  it('displaces whoever previously held the destination slot', () => {
    let squad = assignSlot(emptySquad(), 'attack', 'CB', 'p1')
    squad = assignSlot(squad, 'attack', 'CB', 'p2')
    expect(squad.attackSlots.CB).toBe('p2')
    expect(assignedPlayerIds(squad).has('p1')).toBe(false)
  })
})

describe('clearSlot / clearPlayer', () => {
  it('clearSlot empties one slot', () => {
    const squad = clearSlot(assignSlot(emptySquad(), 'attack', 'CB', 'p1'), 'attack', 'CB')
    expect(squad.attackSlots.CB).toBeUndefined()
  })

  it('clearPlayer removes a player from both phases at once', () => {
    let squad = assignSlot(emptySquad(), 'attack', 'CB', 'p1')
    squad = assignSlot(squad, 'defense', 'LB', 'p1')
    squad = clearPlayer(squad, 'p1')
    expect(squad.attackSlots.CB).toBeUndefined()
    expect(squad.defenseSlots.LB).toBeUndefined()
  })
})

describe('moveSlot', () => {
  it('swaps two players within the same phase', () => {
    let squad = assignSlot(emptySquad(), 'attack', 'CB', 'p1')
    squad = assignSlot(squad, 'attack', 'LB', 'p2')
    squad = moveSlot(squad, { phase: 'attack', position: 'CB' }, { phase: 'attack', position: 'LB' })
    expect(squad.attackSlots.LB).toBe('p1')
    expect(squad.attackSlots.CB).toBe('p2')
  })

  it('moving across phases assigns the destination without touching the source', () => {
    let squad = assignSlot(emptySquad(), 'attack', 'CB', 'p1')
    squad = moveSlot(squad, { phase: 'attack', position: 'CB' }, { phase: 'defense', position: 'LB' })
    expect(squad.attackSlots.CB).toBe('p1')
    expect(squad.defenseSlots.LB).toBe('p1')
  })

  it('is a no-op when dropped on its own slot', () => {
    const squad = assignSlot(emptySquad(), 'attack', 'CB', 'p1')
    const result = moveSlot(squad, { phase: 'attack', position: 'CB' }, { phase: 'attack', position: 'CB' })
    expect(result).toBe(squad)
  })

  it('is a no-op when the source slot is empty', () => {
    const squad = emptySquad()
    const result = moveSlot(squad, { phase: 'attack', position: 'CB' }, { phase: 'attack', position: 'LB' })
    expect(result).toBe(squad)
  })
})

describe('completeness', () => {
  it('a player with only an attack position is incomplete', () => {
    const squad = assignSlot(emptySquad(), 'attack', 'CB', 'p1')
    expect(isPlayerComplete(squad, 'p1')).toBe(false)
    expect(getPlayerPositions(squad, 'p1')).toEqual({ attack: 'CB', defense: undefined })
  })

  it('a player with both an attack and defense position is complete, even if different', () => {
    let squad = assignSlot(emptySquad(), 'attack', 'CB', 'p1')
    squad = assignSlot(squad, 'defense', 'LB', 'p1')
    expect(isPlayerComplete(squad, 'p1')).toBe(true)
    expect(getPlayerPositions(squad, 'p1')).toEqual({ attack: 'CB', defense: 'LB' })
  })
})

describe('assignedPlayerIds', () => {
  it('includes players from both phases without duplicates', () => {
    let squad = assignSlot(emptySquad(), 'attack', 'CB', 'p1')
    squad = assignSlot(squad, 'defense', 'CB', 'p1')
    squad = assignSlot(squad, 'defense', 'LB', 'p2')
    expect(assignedPlayerIds(squad)).toEqual(new Set(['p1', 'p2']))
  })
})
