"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PaymentStatusBadge } from "./PaymentStatusBadge"
import { ItemInput } from "./ItemInput"
import { formatPeso, parsePesoInput } from "@/lib/formatters"
import type { Person, PersonShare, SplitMode } from "@/types/bill"

interface PersonCardProps {
  person: Person
  share: PersonShare | undefined
  splitMode: SplitMode
  onTogglePayment: () => void
  onRemove: () => void
  onAddItem: (name: string, amount: number) => void
  onRemoveItem: (itemId: string) => void
  onSetPersonalAmount: (amount: number) => void
  onSetAmountGiven: (amount: number) => void
}

export function PersonCard({
  person,
  share,
  splitMode,
  onTogglePayment,
  onRemove,
  onAddItem,
  onRemoveItem,
  onSetPersonalAmount,
  onSetAmountGiven,
}: PersonCardProps) {
  const totalAmount = share?.totalAmount ?? 0
  const baseAmount = share?.baseAmount ?? 0
  const feeAmount = share?.feeAmount ?? 0
  const personalAmount = share?.personalAmount ?? 0
  const amountGiven = share?.amountGiven ?? 0
  const change = share?.change ?? 0

  // Calculate the shared portion (base - personal)
  const sharedPortion = baseAmount - personalAmount

  return (
    <Card>
      <CardHeader className="pb-2 sm:pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg sm:text-xl">{person.name}</CardTitle>
          <div className="flex items-center gap-2 sm:gap-3">
            <PaymentStatusBadge status={person.paymentStatus} />
            <Button
              variant="neutral"
              size="sm"
              onClick={onRemove}
              className="h-6 w-6 sm:h-7 sm:w-7 p-0 text-red-600"
            >
              <svg
                className="size-3.5 sm:size-4"
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
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-5">
        {/* Amount Given Input - First */}
        <div className="space-y-2">
          <label className="text-sm text-foreground/70">Amount given</label>
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm">
              ₱
            </span>
            <Input
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              value={person.amountGiven > 0 ? person.amountGiven.toString() : ""}
              onChange={(e) => onSetAmountGiven(parsePesoInput(e.target.value))}
              className="pl-6 text-sm"
            />
          </div>
          {amountGiven > 0 && (
            <div
              className={`flex justify-between rounded-base border-2 px-2 py-1 text-sm font-heading ${
                change >= 0
                  ? "border-green-600 bg-green-100 text-green-700"
                  : "border-red-600 bg-red-100 text-red-700"
              }`}
            >
              <span>{change >= 0 ? "Change" : "Still owes"}</span>
              <span>{formatPeso(Math.abs(change))}</span>
            </div>
          )}
        </div>

        {/* Equal mode: Personal order input - Second */}
        {splitMode === "equal" && (
          <div className="space-y-2">
            <label className="text-sm text-foreground/70">
              Personal order (not split)
            </label>
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm">
                ₱
              </span>
              <Input
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={person.personalAmount > 0 ? person.personalAmount.toString() : ""}
                onChange={(e) => onSetPersonalAmount(parsePesoInput(e.target.value))}
                className="pl-6 text-sm"
              />
            </div>
          </div>
        )}

        {/* Individual mode: show items */}
        {splitMode === "individual" && (
          <div className="space-y-2">
            {person.items.length > 0 && (
              <div className="space-y-1">
                {person.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-base border border-border bg-secondary-background px-2 py-1 text-sm"
                  >
                    <span>{item.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-heading">
                        {formatPeso(item.amount)}
                      </span>
                      <button
                        onClick={() => onRemoveItem(item.id)}
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
            <ItemInput onAdd={onAddItem} />
          </div>
        )}

        {/* Amount breakdown */}
        <div className="space-y-2 border-t-2 border-border pt-3">
          {splitMode === "equal" && personalAmount > 0 && (
            <>
              <div className="flex justify-between text-sm">
                <span>Shared portion</span>
                <span>{formatPeso(sharedPortion)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Personal order</span>
                <span>{formatPeso(personalAmount)}</span>
              </div>
            </>
          )}
          {splitMode === "equal" && personalAmount === 0 && (
            <div className="flex justify-between text-sm">
              <span>Share</span>
              <span>{formatPeso(baseAmount)}</span>
            </div>
          )}
          {splitMode === "individual" && (
            <div className="flex justify-between text-sm">
              <span>Items</span>
              <span>{formatPeso(baseAmount)}</span>
            </div>
          )}
          {feeAmount > 0 && (
            <div className="flex justify-between text-sm text-foreground/70">
              <span>+ Fees</span>
              <span>{formatPeso(feeAmount)}</span>
            </div>
          )}
          <div className="flex justify-between font-heading">
            <span>Total</span>
            <span className="text-lg">{formatPeso(totalAmount)}</span>
          </div>
        </div>

        {/* Payment toggle */}
        <Button
          variant={person.paymentStatus === "paid" ? "green" : "yellow"}
          className="w-full"
          onClick={onTogglePayment}
        >
          {person.paymentStatus === "paid" ? "Mark as Unpaid" : "Mark as Paid"}
        </Button>
      </CardContent>
    </Card>
  )
}
