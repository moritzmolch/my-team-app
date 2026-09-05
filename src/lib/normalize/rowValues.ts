import type { AttributeValue } from '../../types/attributes'

/** Coerce a raw parsed cell value into something storable in an attributes bag. */
export function toAttributeValue(value: unknown): AttributeValue {
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value
  }
  return String(value)
}

export function isEmpty(value: unknown): boolean {
  return value === undefined || value === null || value === ''
}
