"use client"

import { useState, useEffect, useCallback } from "react"

export interface SavedGroup {
  id: string
  name: string
  members: string[]
  createdAt: string
}

const STORAGE_KEY = "kkb-saved-groups"
const MAX_GROUPS = 10

export function useSavedGroups() {
  const [groups, setGroups] = useState<SavedGroup[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load groups from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setGroups(JSON.parse(stored))
      } catch {
        setGroups([])
      }
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage whenever groups change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(groups))
    }
  }, [groups, isLoaded])

  const saveGroup = useCallback((name: string, members: string[]) => {
    if (members.length === 0) return

    const group: SavedGroup = {
      id: Date.now().toString(),
      name: name || `Group ${groups.length + 1}`,
      members,
      createdAt: new Date().toISOString(),
    }

    setGroups((prev) => {
      const newGroups = [group, ...prev].slice(0, MAX_GROUPS)
      return newGroups
    })
  }, [groups.length])

  const deleteGroup = useCallback((id: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== id))
  }, [])

  const clearGroups = useCallback(() => {
    setGroups([])
  }, [])

  return {
    groups,
    isLoaded,
    saveGroup,
    deleteGroup,
    clearGroups,
  }
}
