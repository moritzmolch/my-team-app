import { extractRows } from './extractRows'

export function parseJson(text: string): Record<string, unknown>[] {
  return extractRows(JSON.parse(text))
}
