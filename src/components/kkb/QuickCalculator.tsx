"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatPeso, parsePesoInput } from "@/lib/formatters"

interface QuickCalculatorProps {
  onCalculate: (total: number) => void
  currentTotal: number
}

interface CalcItem {
  id: string
  amount: number
}

export function QuickCalculator({ onCalculate, currentTotal }: QuickCalculatorProps) {
  const [items, setItems] = useState<CalcItem[]>([])
  const [currentInput, setCurrentInput] = useState("")

  const addItem = () => {
    const amount = parsePesoInput(currentInput)
    if (amount > 0) {
      setItems([...items, { id: Date.now().toString(), amount }])
      setCurrentInput("")
    }
  }

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addItem()
    }
  }

  const total = items.reduce((sum, item) => sum + item.amount, 0)

  const applyTotal = () => {
    onCalculate(total)
  }

  return (
    <div className="space-y-3 rounded-base border-2 border-border bg-secondary-background p-3">
      <p className="text-sm font-heading">Quick Calculator</p>

      {/* Item list */}
      {items.length > 0 && (
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center justify-between text-sm bg-background rounded-base px-2 py-1 border border-border"
            >
              <span className="text-foreground/70">Item {index + 1}</span>
              <div className="flex items-center gap-2">
                <span className="font-heading">{formatPeso(item.amount)}</span>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <svg
                    className="size-3"
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

      {/* Add item input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm">₱</span>
          <Input
            type="text"
            inputMode="decimal"
            placeholder="Enter price"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-6 text-sm"
          />
        </div>
        <Button type="button" size="sm" onClick={addItem} disabled={!currentInput}>
          +
        </Button>
      </div>

      {/* Running total and apply */}
      {items.length > 0 && (
        <div className="flex items-center justify-between border-t border-border pt-2">
          <div>
            <span className="text-sm">Running total: </span>
            <span className="font-heading text-lg">{formatPeso(total)}</span>
          </div>
          <Button size="sm" onClick={applyTotal}>
            Use Total
          </Button>
        </div>
      )}

      {items.length === 0 && (
        <p className="text-xs text-foreground/60">
          Add item prices one by one, then apply the total
        </p>
      )}
    </div>
  )
}
