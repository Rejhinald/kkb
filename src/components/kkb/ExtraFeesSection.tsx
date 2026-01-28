"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPeso, parsePesoInput } from "@/lib/formatters"
import type { ExtraFee, FeeDistributionMode } from "@/types/bill"

const FEE_PRESETS = [
  { label: "Service Charge", amount: 10, isPercentage: true },
  { label: "VAT", amount: 12, isPercentage: true },
  { label: "Tip", amount: 5, isPercentage: true },
]

interface ExtraFeesSectionProps {
  fees: ExtraFee[]
  feeDistributionMode: FeeDistributionMode
  onAddFee: (label: string, amount: number, isPercentage: boolean) => void
  onRemoveFee: (feeId: string) => void
  onUpdateFee: (feeId: string, updates: Partial<ExtraFee>) => void
  onFeeDistributionModeChange: (mode: FeeDistributionMode) => void
  subtotal: number
}

export function ExtraFeesSection({
  fees,
  feeDistributionMode,
  onAddFee,
  onRemoveFee,
  onFeeDistributionModeChange,
  subtotal,
}: ExtraFeesSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [newFeeLabel, setNewFeeLabel] = useState("")
  const [newFeeAmount, setNewFeeAmount] = useState("")
  const [newFeeIsPercentage, setNewFeeIsPercentage] = useState(true)

  const handleAddFee = (e: React.FormEvent) => {
    e.preventDefault()
    const label = newFeeLabel.trim()
    const amount = parsePesoInput(newFeeAmount)

    if (label && amount > 0) {
      onAddFee(label, amount, newFeeIsPercentage)
      setNewFeeLabel("")
      setNewFeeAmount("")
    }
  }

  const calculateFeeValue = (fee: ExtraFee): number => {
    if (fee.isPercentage) {
      return (subtotal * fee.amount) / 100
    }
    return fee.amount
  }

  const totalFees = fees.reduce((sum, fee) => sum + calculateFeeValue(fee), 0)

  return (
    <Card>
      <CardHeader className="pb-2">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full items-center justify-between"
        >
          <CardTitle className="text-lg">Extra Fees</CardTitle>
          <div className="flex items-center gap-2">
            {!isExpanded && fees.length > 0 && (
              <span className="text-sm font-heading text-foreground/70">
                {formatPeso(totalFees)}
              </span>
            )}
            <svg
              className={`size-5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </button>
      </CardHeader>
      {isExpanded && (
      <CardContent className="space-y-4">
        {/* Existing fees */}
        {fees.length > 0 && (
          <div className="space-y-2">
            {fees.map((fee) => (
              <div
                key={fee.id}
                className="flex items-center justify-between rounded-base border border-border bg-secondary-background px-3 py-2"
              >
                <div>
                  <span className="font-base">{fee.label}</span>
                  <span className="ml-2 text-foreground/70">
                    ({fee.amount}
                    {fee.isPercentage ? "%" : ""})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-heading">
                    {formatPeso(calculateFeeValue(fee))}
                  </span>
                  <button
                    onClick={() => onRemoveFee(fee.id)}
                    className="text-red-600 hover:text-red-800"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Fee presets */}
        {(() => {
          const availablePresets = FEE_PRESETS.filter(
            (preset) => !fees.some((f) => f.label === preset.label)
          )
          if (availablePresets.length === 0) return null
          return (
            <div className="space-y-2">
              <p className="text-xs text-foreground/60">Quick add:</p>
              <div className="flex flex-wrap gap-2">
                {availablePresets.map((preset, index) => {
                  const colors = ["orange", "pink", "purple"] as const
                  return (
                    <Button
                      key={preset.label}
                      type="button"
                      variant={colors[index % colors.length]}
                      size="sm"
                      onClick={() =>
                        onAddFee(preset.label, preset.amount, preset.isPercentage)
                      }
                      className="text-xs"
                    >
                      +{preset.label} ({preset.amount}%)
                    </Button>
                  )
                })}
              </div>
            </div>
          )
        })()}

        {/* Add new fee form */}
        <form onSubmit={handleAddFee} className="space-y-2">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Fee name (e.g., Service Charge)"
              value={newFeeLabel}
              onChange={(e) => setNewFeeLabel(e.target.value)}
              className="flex-1"
            />
          </div>
          <div className="flex gap-2">
            <Input
              type="text"
              inputMode="decimal"
              placeholder={newFeeIsPercentage ? "10" : "100"}
              value={newFeeAmount}
              onChange={(e) => setNewFeeAmount(e.target.value)}
              className="flex-1"
            />
            <div className="flex">
              <button
                type="button"
                onClick={() => setNewFeeIsPercentage(true)}
                className={`rounded-l-base border-2 border-r-0 border-border px-3 py-2 text-sm font-base ${
                  newFeeIsPercentage
                    ? "bg-main text-main-foreground"
                    : "bg-secondary-background"
                }`}
              >
                %
              </button>
              <button
                type="button"
                onClick={() => setNewFeeIsPercentage(false)}
                className={`rounded-r-base border-2 border-border px-3 py-2 text-sm font-base ${
                  !newFeeIsPercentage
                    ? "bg-main text-main-foreground"
                    : "bg-secondary-background"
                }`}
              >
                ₱
              </button>
            </div>
            <Button type="submit" variant="green" disabled={!newFeeLabel.trim()}>
              Add
            </Button>
          </div>
        </form>

        {/* Fee distribution mode toggle */}
        {fees.length > 0 && (
          <div className="space-y-2 border-t-2 border-border pt-4">
            <p className="text-sm font-base">Distribute fees:</p>
            <div className="flex gap-2">
              <Button
                variant={
                  feeDistributionMode === "proportional" ? "pink" : "neutral"
                }
                size="sm"
                onClick={() => onFeeDistributionModeChange("proportional")}
                className="flex-1"
              >
                Proportional
              </Button>
              <Button
                variant={
                  feeDistributionMode === "equal" ? "yellow" : "neutral"
                }
                size="sm"
                onClick={() => onFeeDistributionModeChange("equal")}
                className="flex-1"
              >
                Equal
              </Button>
            </div>
            <p className="text-xs text-foreground/60">
              {feeDistributionMode === "proportional"
                ? "Fees split based on each person's share"
                : "Fees split equally among all people"}
            </p>
          </div>
        )}
      </CardContent>
      )}
    </Card>
  )
}
