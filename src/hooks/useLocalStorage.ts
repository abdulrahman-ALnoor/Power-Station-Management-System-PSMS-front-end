// ============================================================
// useLocalStorage — Persistent state hook
// ============================================================

import { useState, useCallback } from 'react'

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        setStoredValue((prev) => {
          const resolved = typeof value === 'function'
            ? (value as (prev: T) => T)(prev)
            : value
          window.localStorage.setItem(key, JSON.stringify(resolved))
          return resolved
        })
      } catch (error) {
        console.error(`[useLocalStorage] Failed to set "${key}":`, error)
      }
    },
    [key],
  )

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
    } catch (error) {
      console.error(`[useLocalStorage] Failed to remove "${key}":`, error)
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}
