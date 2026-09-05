import { useRef, useState } from 'react'
import type { DragEvent } from 'react'

interface FileDropZoneProps {
  onFile: (file: File) => void
  accept?: string
  label?: string
}

export function FileDropZone({ onFile, accept = '.csv,.yaml,.yml,.json', label }: FileDropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDragOver(false)
    const file = event.dataTransfer.files[0]
    if (file) onFile(file)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragOver(true)
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
        isDragOver
          ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/30'
          : 'border-neutral-300 hover:border-neutral-400 dark:border-neutral-700 dark:hover:border-neutral-600'
      }`}
    >
      <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {label ?? 'Drop a CSV, YAML, or JSON file here, or click to browse'}
      </p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onFile(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}
