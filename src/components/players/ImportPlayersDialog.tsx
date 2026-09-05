import { useMemo, useState } from 'react'
import { ColumnMappingEditor } from '../shared/ColumnMappingEditor'
import { FileDropZone } from '../shared/FileDropZone'
import type { ColumnMapping, ImportSummary } from '../../types/import'
import { suggestColumnMappings } from '../../lib/normalize/mapColumns'
import { normalizeRow } from '../../lib/normalize/normalizeRow'
import { upsertPlayers } from '../../lib/normalize/upsertPlayers'
import { parseFile } from '../../lib/parsers/parseFile'
import { usePlayerStore } from '../../store/usePlayerStore'

type Step = 'pick' | 'map' | 'confirm' | 'done'

interface ImportPlayersDialogProps {
  onClose: () => void
}

export function ImportPlayersDialog({ onClose }: ImportPlayersDialogProps) {
  const [step, setStep] = useState<Step>('pick')
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string>('')
  const [rows, setRows] = useState<Record<string, unknown>[]>([])
  const [mappings, setMappings] = useState<ColumnMapping[]>([])
  const [summary, setSummary] = useState<ImportSummary | null>(null)

  const existingPlayers = usePlayerStore((s) => s.players)
  const importPlayers = usePlayerStore((s) => s.importPlayers)

  async function handleFile(file: File) {
    setError(null)
    try {
      const parsedRows = await parseFile(file)
      if (parsedRows.length === 0) {
        throw new Error('The file has no rows to import.')
      }
      setFileName(file.name)
      setRows(parsedRows)
      setMappings(suggestColumnMappings(Object.keys(parsedRows[0])))
      setStep('map')
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  const normalizedInputs = useMemo(
    () => rows.map((row) => normalizeRow(row, mappings)),
    [rows, mappings],
  )

  function handleReviewImport() {
    const preview = upsertPlayers(existingPlayers, normalizedInputs)
    setSummary(preview)
    setStep('confirm')
  }

  function handleConfirmImport() {
    importPlayers(normalizedInputs)
    setStep('done')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[85vh] w-full max-w-2xl flex-col gap-4 overflow-y-auto rounded-xl bg-white p-6 shadow-xl dark:bg-neutral-900">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Import players</h2>
          <button
            onClick={onClose}
            className="rounded px-2 py-1 text-sm text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            Close
          </button>
        </div>

        {error && (
          <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </p>
        )}

        {step === 'pick' && <FileDropZone onFile={handleFile} />}

        {step === 'map' && (
          <>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {fileName} — {rows.length} row{rows.length === 1 ? '' : 's'}. Review how each column maps
              before importing; unmapped columns become custom attributes.
            </p>
            <ColumnMappingEditor mappings={mappings} sampleRow={rows[0]} onChange={setMappings} />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setStep('pick')}
                className="rounded-md px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Back
              </button>
              <button
                onClick={handleReviewImport}
                className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
              >
                Review import
              </button>
            </div>
          </>
        )}

        {step === 'confirm' && summary && (
          <>
            <ul className="flex flex-col gap-1 text-sm text-neutral-700 dark:text-neutral-300">
              <li>{summary.created} new player{summary.created === 1 ? '' : 's'}</li>
              <li>{summary.updated} updated</li>
              <li>{summary.unchanged} unchanged</li>
              {summary.missingExternalKeys.length > 0 && (
                <li className="text-amber-700 dark:text-amber-400">
                  {summary.missingExternalKeys.length} existing player
                  {summary.missingExternalKeys.length === 1 ? '' : 's'} not in this file (kept, not
                  deleted): {summary.missingExternalKeys.join(', ')}
                </li>
              )}
            </ul>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setStep('map')}
                className="rounded-md px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Back
              </button>
              <button
                onClick={handleConfirmImport}
                className="rounded-md bg-purple-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-purple-700"
              >
                Confirm import
              </button>
            </div>
          </>
        )}

        {step === 'done' && (
          <>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">Import complete.</p>
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
              >
                Done
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
