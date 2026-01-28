"use client"

import { useState, useEffect, useCallback } from "react"

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error)
    }
    setIsLoaded(true)
  }, [key])

  // Save to localStorage when value changes
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const newValue = value instanceof Function ? value(prev) : value
        try {
          window.localStorage.setItem(key, JSON.stringify(newValue))
        } catch (error) {
          console.error("Error writing to localStorage:", error)
        }
        return newValue
      })
    },
    [key]
  )

  return [storedValue, setValue, isLoaded] as const
}
