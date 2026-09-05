import type { ColumnMapping, PlayerFieldTarget } from '../../types/import'

const TARGET_OPTIONS: { value: PlayerFieldTarget | 'attribute' | 'ignore'; label: string }[] = [
  { value: 'name', label: 'Name' },
  { value: 'jerseyNumber', label: 'Jersey number' },
  { value: 'position', label: 'Position' },
  { value: 'photoUrl', label: 'Photo URL' },
  { value: 'attribute', label: 'Custom attribute' },
  { value: 'ignore', label: 'Ignore this column' },
]

interface ColumnMappingEditorProps {
  mappings: ColumnMapping[]
  sampleRow?: Record<string, unknown>
  onChange: (mappings: ColumnMapping[]) => void
}

export function ColumnMappingEditor({ mappings, sampleRow, onChange }: ColumnMappingEditorProps) {
  function updateMapping(index: number, patch: Partial<ColumnMapping>) {
    onChange(mappings.map((m, i) => (i === index ? { ...m, ...patch } : m)))
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800">
      <table className="w-full text-left text-sm">
        <thead className="bg-neutral-50 text-xs uppercase text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
          <tr>
            <th className="px-3 py-2">Source column</th>
            {sampleRow && <th className="px-3 py-2">Example</th>}
            <th className="px-3 py-2">Maps to</th>
            <th className="px-3 py-2">Attribute key</th>
          </tr>
        </thead>
        <tbody>
          {mappings.map((mapping, index) => (
            <tr key={mapping.sourceKey} className="border-t border-neutral-200 dark:border-neutral-800">
              <td className="px-3 py-2 font-medium text-neutral-800 dark:text-neutral-200">{mapping.sourceKey}</td>
              {sampleRow && (
                <td className="px-3 py-2 text-neutral-500 dark:text-neutral-400">
                  {String(sampleRow[mapping.sourceKey] ?? '')}
                </td>
              )}
              <td className="px-3 py-2">
                <select
                  value={mapping.target}
                  onChange={(e) =>
                    updateMapping(index, { target: e.target.value as ColumnMapping['target'] })
                  }
                  className="rounded border border-neutral-300 bg-white px-2 py-1 text-sm dark:border-neutral-700 dark:bg-neutral-950"
                >
                  {TARGET_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-3 py-2">
                {mapping.target === 'attribute' ? (
                  <input
                    value={mapping.attributeKey}
                    onChange={(e) => updateMapping(index, { attributeKey: e.target.value })}
                    className="w-full rounded border border-neutral-300 bg-white px-2 py-1 text-sm dark:border-neutral-700 dark:bg-neutral-950"
                  />
                ) : (
                  <span className="text-neutral-400 dark:text-neutral-600">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
