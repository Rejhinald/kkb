"use client"

import { useCallback } from "react"
import type {
  BillState,
  Person,
  ExtraFee,
  SplitMode,
  FeeDistributionMode,
} from "@/types/bill"
import { useLocalStorage } from "./useLocalStorage"
import { generateId } from "@/lib/utils"

const STORAGE_KEY = "kkb-bill-state"

const initialState: BillState = {
  id: "",
  title: "New Bill",
  splitMode: "equal",
  feeDistributionMode: "proportional",
  subtotal: 0,
  people: [],
  extraFees: [],
  createdAt: "",
  updatedAt: "",
}

function createInitialState(): BillState {
  const now = new Date().toISOString()
  return {
    ...initialState,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  }
}

export function useBillState() {
  const [state, setState, isLoaded] = useLocalStorage<BillState>(
    STORAGE_KEY,
    createInitialState()
  )

  // Update timestamp on any change
  const updateState = useCallback(
    (updater: (prev: BillState) => BillState) => {
      setState((prev) => ({
        ...updater(prev),
        updatedAt: new Date().toISOString(),
      }))
    },
    [setState]
  )

  // Bill operations
  const setTitle = useCallback(
    (title: string) => {
      updateState((prev) => ({ ...prev, title }))
    },
    [updateState]
  )

  const setSplitMode = useCallback(
    (splitMode: SplitMode) => {
      updateState((prev) => ({ ...prev, splitMode }))
    },
    [updateState]
  )

  const setFeeDistributionMode = useCallback(
    (feeDistributionMode: FeeDistributionMode) => {
      updateState((prev) => ({ ...prev, feeDistributionMode }))
    },
    [updateState]
  )

  const setSubtotal = useCallback(
    (subtotal: number) => {
      updateState((prev) => ({ ...prev, subtotal }))
    },
    [updateState]
  )

  // Person operations
  const addPerson = useCallback(
    (name: string) => {
      const newPerson: Person = {
        id: generateId(),
        name,
        items: [],
        paymentStatus: "unpaid",
        personalAmount: 0,
        amountGiven: 0,
      }
      updateState((prev) => ({ ...prev, people: [...prev.people, newPerson] }))
    },
    [updateState]
  )

  const removePerson = useCallback(
    (personId: string) => {
      updateState((prev) => ({
        ...prev,
        people: prev.people.filter((p) => p.id !== personId),
      }))
    },
    [updateState]
  )

  const updatePersonName = useCallback(
    (personId: string, name: string) => {
      updateState((prev) => ({
        ...prev,
        people: prev.people.map((p) =>
          p.id === personId ? { ...p, name } : p
        ),
      }))
    },
    [updateState]
  )

  const togglePaymentStatus = useCallback(
    (personId: string) => {
      updateState((prev) => ({
        ...prev,
        people: prev.people.map((p) =>
          p.id === personId
            ? { ...p, paymentStatus: p.paymentStatus === "paid" ? "unpaid" : "paid" }
            : p
        ),
      }))
    },
    [updateState]
  )

  const setPersonalAmount = useCallback(
    (personId: string, amount: number) => {
      updateState((prev) => ({
        ...prev,
        people: prev.people.map((p) =>
          p.id === personId ? { ...p, personalAmount: amount } : p
        ),
      }))
    },
    [updateState]
  )

  const setAmountGiven = useCallback(
    (personId: string, amount: number) => {
      updateState((prev) => ({
        ...prev,
        people: prev.people.map((p) =>
          p.id === personId ? { ...p, amountGiven: amount } : p
        ),
      }))
    },
    [updateState]
  )

  // Item operations (for individual mode)
  const addItemToPerson = useCallback(
    (personId: string, name: string, amount: number) => {
      const newItem = { id: generateId(), name, amount }
      updateState((prev) => ({
        ...prev,
        people: prev.people.map((p) =>
          p.id === personId ? { ...p, items: [...p.items, newItem] } : p
        ),
      }))
    },
    [updateState]
  )

  const removeItemFromPerson = useCallback(
    (personId: string, itemId: string) => {
      updateState((prev) => ({
        ...prev,
        people: prev.people.map((p) =>
          p.id === personId
            ? { ...p, items: p.items.filter((i) => i.id !== itemId) }
            : p
        ),
      }))
    },
    [updateState]
  )

  // Extra fee operations
  const addExtraFee = useCallback(
    (label: string, amount: number, isPercentage: boolean) => {
      const newFee: ExtraFee = { id: generateId(), label, amount, isPercentage }
      updateState((prev) => ({
        ...prev,
        extraFees: [...prev.extraFees, newFee],
      }))
    },
    [updateState]
  )

  const removeExtraFee = useCallback(
    (feeId: string) => {
      updateState((prev) => ({
        ...prev,
        extraFees: prev.extraFees.filter((f) => f.id !== feeId),
      }))
    },
    [updateState]
  )

  const updateExtraFee = useCallback(
    (feeId: string, updates: Partial<ExtraFee>) => {
      updateState((prev) => ({
        ...prev,
        extraFees: prev.extraFees.map((f) =>
          f.id === feeId ? { ...f, ...updates } : f
        ),
      }))
    },
    [updateState]
  )

  // Reset bill
  const resetBill = useCallback(() => {
    setState(createInitialState())
  }, [setState])

  // Load a saved bill state
  const loadState = useCallback(
    (savedState: BillState) => {
      setState({
        ...savedState,
        updatedAt: new Date().toISOString(),
      })
    },
    [setState]
  )

  return {
    state,
    isLoaded,
    // Bill operations
    setTitle,
    setSplitMode,
    setFeeDistributionMode,
    setSubtotal,
    // Person operations
    addPerson,
    removePerson,
    updatePersonName,
    togglePaymentStatus,
    setPersonalAmount,
    setAmountGiven,
    // Item operations
    addItemToPerson,
    removeItemFromPerson,
    // Fee operations
    addExtraFee,
    removeExtraFee,
    updateExtraFee,
    // Reset & Load
    resetBill,
    loadState,
  }
}
