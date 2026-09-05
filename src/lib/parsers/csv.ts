import Papa from 'papaparse'

export function parseCsv(text: string): Record<string, unknown>[] {
  const result = Papa.parse<Record<string, unknown>>(text, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  })
  if (result.errors.length > 0) {
    throw new Error(`CSV parse error: ${result.errors[0].message} (row ${result.errors[0].row})`)
  }
  return result.data
}
