"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { parsePesoInput } from "@/lib/formatters"

interface ItemInputProps {
  onAdd: (name: string, amount: number) => void
}

export function ItemInput({ onAdd }: ItemInputProps) {
  const [itemName, setItemName] = useState("")
  const [amount, setAmount] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedName = itemName.trim()
    const parsedAmount = parsePesoInput(amount)

    if (trimmedName && parsedAmount > 0) {
      onAdd(trimmedName, parsedAmount)
      setItemName("")
      setAmount("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        placeholder="Item name"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        className="flex-1"
      />
      <Input
        type="text"
        inputMode="decimal"
        placeholder="₱0.00"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-24"
      />
      <Button
        type="submit"
        size="sm"
        disabled={!itemName.trim() || parsePesoInput(amount) <= 0}
      >
        +
      </Button>
    </form>
  )
}
