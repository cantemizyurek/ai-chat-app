import { useEffect, useState } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : initialValue
  })

  useEffect(() => {
    const item = localStorage.getItem(key)
    if (item) {
      setValue(JSON.parse(item))
    }
  }, [key])

  function handleSetValue(value: T) {
    localStorage.setItem(key, JSON.stringify(value))
    setValue(value)
  }

  return [value, handleSetValue] as const
}
