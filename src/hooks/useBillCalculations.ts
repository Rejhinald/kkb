"use client"

import { useMemo } from "react"
import type { BillState, PersonShare, BillSummary } from "@/types/bill"
import { calculateShares, calculateSummary } from "@/lib/calculations"

export function useBillCalculations(state: BillState) {
  const shares = useMemo<PersonShare[]>(() => {
    return calculateShares(state)
  }, [state])

  const summary = useMemo<BillSummary>(() => {
    return calculateSummary(state, shares)
  }, [state, shares])

  return { shares, summary }
}
