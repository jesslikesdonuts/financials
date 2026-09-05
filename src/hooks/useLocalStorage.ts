import { useEffect, useState } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key)
      if (raw != null) return JSON.parse(raw) as T
    } catch {
      // ignore corrupt storage, fall through to default
    }
    return typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // storage full or unavailable; changes simply won't persist
    }
  }, [key, value])

  return [value, setValue] as const
}
