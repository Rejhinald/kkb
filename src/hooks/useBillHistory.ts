"use client"

import { useState, useEffect, useCallback } from "react"
import type { BillState } from "@/types/bill"

export interface HistoryEntry {
  id: string
  title: string
  grandTotal: number
  peopleCount: number
  savedAt: string
  state: BillState
}

const STORAGE_KEY = "kkb-bill-history"
const MAX_HISTORY = 10

export function useBillHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load history from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setHistory(JSON.parse(stored))
      } catch {
        setHistory([])
      }
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage whenever history changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
    }
  }, [history, isLoaded])

  const saveBill = useCallback((state: BillState, grandTotal: number) => {
    // Don't save empty bills
    if (state.people.length === 0 && grandTotal === 0) {
      return
    }

    const entry: HistoryEntry = {
      id: Date.now().toString(),
      title: state.title || "Untitled Bill",
      grandTotal,
      peopleCount: state.people.length,
      savedAt: new Date().toISOString(),
      state,
    }

    setHistory((prev) => {
      const newHistory = [entry, ...prev].slice(0, MAX_HISTORY)
      return newHistory
    })
  }, [])

  const deleteBill = useCallback((id: string) => {
    setHistory((prev) => prev.filter((entry) => entry.id !== id))
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
  }, [])

  return {
    history,
    isLoaded,
    saveBill,
    deleteBill,
    clearHistory,
  }
}
