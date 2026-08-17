// ============================================================
// cn — Class name utility
// Merges conditional class strings cleanly
// ============================================================

type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ClassValue[]
  | Record<string, boolean | null | undefined>

/**
 * Merges class names conditionally — lightweight clsx-style utility.
 * Avoids the need for an external dependency for basic merging.
 */
export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = []

  for (const input of inputs) {
    if (!input) continue

    if (typeof input === 'string' || typeof input === 'number') {
      classes.push(String(input))
      continue
    }

    if (Array.isArray(input)) {
      const merged = cn(...input)
      if (merged) classes.push(merged)
      continue
    }

    if (typeof input === 'object') {
      for (const [key, value] of Object.entries(input)) {
        if (value) classes.push(key)
      }
    }
  }

  return classes.join(' ')
}
