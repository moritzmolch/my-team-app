import { load } from 'js-yaml'
import { extractRows } from './extractRows'

export function parseYaml(text: string): Record<string, unknown>[] {
  return extractRows(load(text))
}
