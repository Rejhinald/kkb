"use client"

import { useState } from "react"
import { useBillState } from "@/hooks/useBillState"
import { useBillCalculations } from "@/hooks/useBillCalculations"
import { useBillHistory } from "@/hooks/useBillHistory"
import { useSavedGroups } from "@/hooks/useSavedGroups"
import { BillHeader } from "@/components/kkb/BillHeader"
import { SplitModeToggle } from "@/components/kkb/SplitModeToggle"
import { PersonList } from "@/components/kkb/PersonList"
import { ExtraFeesSection } from "@/components/kkb/ExtraFeesSection"
import { SummaryCard } from "@/components/kkb/SummaryCard"
import { ShareActions } from "@/components/kkb/ShareActions"
import { BillHistory } from "@/components/kkb/BillHistory"
import { SavedGroups } from "@/components/kkb/SavedGroups"
import { QuickCalculator } from "@/components/kkb/QuickCalculator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { formatPeso, parsePesoInput } from "@/lib/formatters"
import { getActualSubtotal } from "@/lib/calculations"

const QUICK_AMOUNTS = [500, 1000, 1500, 2000]

type TabView = "current" | "history"

export default function Home() {
  const [showCalculator, setShowCalculator] = useState(false)
  const [activeTab, setActiveTab] = useState<TabView>("current")

  const {
    state,
    isLoaded,
    setTitle,
    setSplitMode,
    setFeeDistributionMode,
    setSubtotal,
    addPerson,
    removePerson,
    togglePaymentStatus,
    setPersonalAmount,
    setAmountGiven,
    addItemToPerson,
    removeItemFromPerson,
    addExtraFee,
    removeExtraFee,
    updateExtraFee,
    resetBill,
    loadState,
  } = useBillState()

  const { shares, summary } = useBillCalculations(state)
  const { history, saveBill, deleteBill, clearHistory } = useBillHistory()
  const { groups, saveGroup, deleteGroup } = useSavedGroups()

  // Save current bill to history before resetting
  const handleReset = () => {
    saveBill(state, summary.grandTotal)
    resetBill()
  }

  // Load a bill from history
  const handleRestore = (entry: { state: typeof state }) => {
    loadState(entry.state)
  }

  // Load people from a saved group
  const handleLoadGroup = (members: string[]) => {
    members.forEach((name) => {
      // Only add if not already in the list
      if (!state.people.some((p) => p.name === name)) {
        addPerson(name)
      }
    })
  }

  // Save current bill without resetting
  const handleSave = () => {
    saveBill(state, summary.grandTotal)
  }

  // Show loading skeleton while hydrating from localStorage
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background px-3 py-4 sm:px-4 sm:py-5">
        <div className="mx-auto max-w-md space-y-4 sm:space-y-5">
          <div className="h-28 sm:h-32 animate-pulse rounded-base border-2 border-border bg-secondary-background" />
          <div className="h-10 sm:h-12 animate-pulse rounded-base border-2 border-border bg-secondary-background" />
          <div className="h-40 sm:h-48 animate-pulse rounded-base border-2 border-border bg-secondary-background" />
        </div>
      </div>
    )
  }

  const actualSubtotal = getActualSubtotal(state)

  return (
    <div className="min-h-screen bg-background px-4 py-6 pb-24 sm:px-6 sm:py-8 sm:pb-28">
      <div className="mx-auto max-w-md space-y-5 sm:space-y-6">
        {/* Header */}
        <BillHeader title={state.title} onTitleChange={setTitle} />

        {/* Split Mode Toggle */}
        <SplitModeToggle mode={state.splitMode} onModeChange={setSplitMode} />

        {/* Equal Split: Total Amount Input */}
        {state.splitMode === "equal" && (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-base">Total Bill Amount</label>
                <button
                  type="button"
                  onClick={() => setShowCalculator(!showCalculator)}
                  className="text-xs text-main font-heading flex items-center gap-1"
                >
                  <svg
                    className="size-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  {showCalculator ? "Hide" : "Calculator"}
                </button>
              </div>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-heading">
                  ₱
                </span>
                <Input
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={state.subtotal > 0 ? state.subtotal.toString() : ""}
                  onChange={(e) => setSubtotal(parsePesoInput(e.target.value))}
                  className="pl-8 text-2xl font-heading"
                />
              </div>

              {/* Quick amount buttons */}
              <div className="flex flex-wrap gap-2">
                {QUICK_AMOUNTS.map((amount, index) => {
                  const colors = ["yellow", "pink", "green", "orange"] as const
                  return (
                    <Button
                      key={amount}
                      type="button"
                      variant={colors[index % colors.length]}
                      size="sm"
                      onClick={() => setSubtotal(state.subtotal + amount)}
                      className="text-xs"
                    >
                      +₱{amount.toLocaleString()}
                    </Button>
                  )
                })}
              </div>

              {/* Calculator toggle */}
              {showCalculator && (
                <QuickCalculator
                  onCalculate={setSubtotal}
                  currentTotal={state.subtotal}
                />
              )}

              {state.people.length > 0 && state.subtotal > 0 && (
                <p className="text-sm text-foreground/70">
                  {formatPeso(state.subtotal / state.people.length)} per person
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Individual Split: Show subtotal from items */}
        {state.splitMode === "individual" && actualSubtotal > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <span className="text-sm font-base">Subtotal from items</span>
                <span className="text-xl font-heading">
                  {formatPeso(actualSubtotal)}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Person List */}
        <PersonList
          people={state.people}
          shares={shares}
          splitMode={state.splitMode}
          onAddPerson={addPerson}
          onRemovePerson={removePerson}
          onTogglePayment={togglePaymentStatus}
          onAddItem={addItemToPerson}
          onRemoveItem={removeItemFromPerson}
          onSetPersonalAmount={setPersonalAmount}
          onSetAmountGiven={setAmountGiven}
        />

        {/* Saved Groups */}
        <SavedGroups
          groups={groups}
          currentPeopleNames={state.people.map((p) => p.name)}
          onLoadGroup={handleLoadGroup}
          onSaveGroup={saveGroup}
          onDeleteGroup={deleteGroup}
        />

        {/* Extra Fees */}
        <ExtraFeesSection
          fees={state.extraFees}
          feeDistributionMode={state.feeDistributionMode}
          onAddFee={addExtraFee}
          onRemoveFee={removeExtraFee}
          onUpdateFee={updateExtraFee}
          onFeeDistributionModeChange={setFeeDistributionMode}
          subtotal={actualSubtotal}
        />

        {/* Summary */}
        {(state.people.length > 0 || actualSubtotal > 0) && (
          <SummaryCard summary={summary} />
        )}

        {/* Share Actions */}
        <ShareActions summary={summary} onReset={handleReset} onSave={handleSave} />

        {/* Tab Navigation */}
        <div className="flex gap-2">
          <Button
            variant={activeTab === "current" ? "green" : "neutral"}
            onClick={() => setActiveTab("current")}
            className="flex-1"
          >
            Current Bill
          </Button>
          <Button
            variant={activeTab === "history" ? "purple" : "neutral"}
            onClick={() => setActiveTab("history")}
            className="flex-1"
          >
            Past Bills ({history.length})
          </Button>
        </div>

        {/* Tab Content */}
        {activeTab === "history" && (
          <BillHistory
            history={history}
            onRestore={(entry) => {
              handleRestore(entry)
              setActiveTab("current")
            }}
            onDelete={deleteBill}
            onClearHistory={clearHistory}
          />
        )}

        {/* Footer */}
        <footer className="text-center pt-4">
          <p className="text-xs text-foreground/40">
            KKB - Kanya-Kanyang Bayad | Arwin Miclat © 2026
          </p>
        </footer>
      </div>
    </div>
  )
}
