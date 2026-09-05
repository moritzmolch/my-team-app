import type { Player } from '../types/player'

/**
 * Static sample data for M1, before file import (M2) and persistence (M3)
 * exist. Replace with imported/persisted data in later milestones.
 */
export const samplePlayers: Player[] = [
  {
    id: 'p1',
    externalKey: '1',
    name: 'Lena Brandt',
    jerseyNumber: 1,
    position: 'GK',
    attributes: { strengths: 'reflexes, 1-on-1 saves', weaknesses: 'distribution under pressure' },
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    source: 'manual',
  },
  {
    id: 'p2',
    externalKey: '7',
    name: 'Mara Fischer',
    jerseyNumber: 7,
    position: 'LW',
    attributes: { strengths: 'fast break speed', weaknesses: 'left-hand shot' },
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    source: 'manual',
  },
  {
    id: 'p3',
    externalKey: '4',
    name: 'Sofia Weber',
    jerseyNumber: 4,
    position: 'CB',
    attributes: { strengths: 'game vision, 9m shot' },
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    source: 'manual',
  },
  {
    id: 'p4',
    externalKey: '11',
    name: 'Nora Klein',
    jerseyNumber: 11,
    position: 'RB',
    attributes: {},
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    source: 'manual',
  },
  {
    id: 'p5',
    externalKey: '9',
    name: 'Ida Schulz',
    jerseyNumber: 9,
    position: 'PV',
    attributes: { weaknesses: 'foul discipline' },
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    source: 'manual',
  },
  {
    id: 'p6',
    externalKey: '3',
    name: 'Emilia Wolf',
    jerseyNumber: 3,
    position: 'RW',
    attributes: {},
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    source: 'manual',
  },
]
