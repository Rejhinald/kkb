"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPeso } from "@/lib/formatters"
import type { BillSummary } from "@/types/bill"

interface SummaryCardProps {
  summary: BillSummary
}

export function SummaryCard({ summary }: SummaryCardProps) {
  const remaining = summary.shares
    .filter((s) => s.paymentStatus === "unpaid")
    .reduce((sum, s) => sum + s.totalAmount, 0)

  // People who gave more than their share (get change back)
  const peopleWithChange = summary.shares.filter(
    (s) => s.amountGiven > 0 && s.change > 0
  )

  // People who gave less than their share (still owe)
  const peopleWhoOwe = summary.shares.filter(
    (s) => s.amountGiven > 0 && s.change < 0
  )

  const totalChange = peopleWithChange.reduce((sum, s) => sum + s.change, 0)
  const totalOwed = peopleWhoOwe.reduce((sum, s) => sum + Math.abs(s.change), 0)

  // People who paid at the restaurant (gave any money)
  const billPayers = summary.shares.filter((s) => s.amountGiven > 0)
  const totalPaid = billPayers.reduce((sum, s) => sum + s.amountGiven, 0)

  return (
    <Card className="bg-main">
      <CardHeader className="pb-1">
        <CardTitle className="text-main-foreground text-lg">Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-main-foreground text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-heading">{formatPeso(summary.subtotal)}</span>
        </div>
        {summary.totalFees > 0 && (
          <div className="flex justify-between">
            <span>Extra Fees</span>
            <span className="font-heading">
              {formatPeso(summary.totalFees)}
            </span>
          </div>
        )}
        <div className="flex justify-between border-t-2 border-border pt-2">
          <span className="font-heading">TOTAL</span>
          <span className="font-heading text-xl">
            {formatPeso(summary.grandTotal)}
          </span>
        </div>

        {summary.shares.length > 0 && (
          <div className="border-t-2 border-border pt-2 text-xs space-y-1">
            <div className="flex justify-between">
              <span>
                Paid: {summary.paidCount}/{summary.shares.length}
              </span>
              <span>Remaining: {formatPeso(remaining)}</span>
            </div>
            {totalChange > 0 && (
              <div className="flex justify-between">
                <span>Total Change</span>
                <span className="font-heading">{formatPeso(totalChange)}</span>
              </div>
            )}
          </div>
        )}

        {/* Bill Payers Section */}
        {billPayers.length > 0 && (
          <div className="border-t-2 border-border pt-2 space-y-1.5">
            <p className="font-heading text-xs">
              Paid By ({billPayers.length})
            </p>
            <div className="flex flex-wrap gap-1.5">
              {billPayers.map((payer) => (
                <div
                  key={payer.personId}
                  className="text-[10px] rounded-base bg-secondary-background text-foreground px-1.5 py-0.5 border-2 border-border"
                >
                  {payer.name}: {formatPeso(payer.amountGiven)}
                </div>
              ))}
            </div>
            <p className="text-[10px] text-main-foreground/80">
              Collected: {formatPeso(totalPaid)}
              {totalPaid < summary.grandTotal && (
                <span className="text-red-300">
                  {" "}(₱{(summary.grandTotal - totalPaid).toFixed(2)} short)
                </span>
              )}
              {totalPaid > summary.grandTotal && (
                <span className="text-green-300">
                  {" "}(₱{(totalPaid - summary.grandTotal).toFixed(2)} extra)
                </span>
              )}
            </p>
          </div>
        )}

        {/* Change Summary Section */}
        {(peopleWithChange.length > 0 || peopleWhoOwe.length > 0) && (
          <div className="border-t-2 border-border pt-2 space-y-1.5">
            <p className="font-heading text-xs">Change</p>

            {/* People who should receive change */}
            {peopleWithChange.map((person) => (
              <div
                key={person.personId}
                className="flex justify-between text-xs rounded-base bg-green-400 text-black px-2 py-0.5 border-2 border-border"
              >
                <span>Give {person.name}</span>
                <span className="font-heading">{formatPeso(person.change)}</span>
              </div>
            ))}

            {/* People who still owe */}
            {peopleWhoOwe.map((person) => (
              <div
                key={person.personId}
                className="flex justify-between text-xs rounded-base bg-red-400 text-black px-2 py-0.5 border-2 border-border"
              >
                <span>{person.name} owes</span>
                <span className="font-heading">
                  {formatPeso(Math.abs(person.change))}
                </span>
              </div>
            ))}

            {/* Net summary */}
            {peopleWithChange.length > 0 && peopleWhoOwe.length > 0 && (
              <div className="text-[10px] text-main-foreground/80">
                Give back: {formatPeso(totalChange)} | Collect:{" "}
                {formatPeso(totalOwed)}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
