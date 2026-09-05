/** Turn a camelCase attribute key like "preferredFoot" back into a readable label "Preferred Foot". */
export function attributeLabel(key: string): string {
  const spaced = key.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}

/** Turn a source header like "Preferred Foot" into a camelCase attribute key "preferredFoot". */
export function slugify(header: string): string {
  const words = header
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
  if (words.length === 0) return 'field'
  return words
    .map((word, i) =>
      i === 0 ? word.toLowerCase() : word[0].toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join('')
}
