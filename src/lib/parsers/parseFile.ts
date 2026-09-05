import type { SourceFormat } from '../../types/import'
import { parseCsv } from './csv'
import { parseJson } from './json'
import { parseYaml } from './yaml'

export function detectFormat(fileName: string): SourceFormat | null {
  const ext = fileName.split('.').pop()?.toLowerCase()
  if (ext === 'csv') return 'csv'
  if (ext === 'yaml' || ext === 'yml') return 'yaml'
  if (ext === 'json') return 'json'
  return null
}

export async function parseFile(file: File): Promise<Record<string, unknown>[]> {
  const format = detectFormat(file.name)
  if (!format) {
    throw new Error(`Unrecognized file type for "${file.name}" — expected .csv, .yaml/.yml, or .json`)
  }
  const text = await file.text()
  switch (format) {
    case 'csv':
      return parseCsv(text)
    case 'yaml':
      return parseYaml(text)
    case 'json':
      return parseJson(text)
  }
}
