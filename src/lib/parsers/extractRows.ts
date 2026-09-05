/**
 * Given a parsed YAML/JSON document, find the array of row-like records in
 * it. Supports a bare top-level array, or an object with a single top-level
 * array property (e.g. `{ players: [...] }`).
 */
export function extractRows(doc: unknown): Record<string, unknown>[] {
  if (Array.isArray(doc)) {
    return doc as Record<string, unknown>[]
  }
  if (doc && typeof doc === 'object') {
    for (const value of Object.values(doc as Record<string, unknown>)) {
      if (Array.isArray(value)) {
        return value as Record<string, unknown>[]
      }
    }
  }
  throw new Error('Could not find a list of records in the file (expected a top-level array).')
}
