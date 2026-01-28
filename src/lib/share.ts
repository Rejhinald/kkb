import type { BillSummary } from "@/types/bill"
import { formatPeso } from "./formatters"

export function generateShareText(summary: BillSummary): string {
  const lines: string[] = []

  // Header
  lines.push(`KKB - ${summary.title}`)
  lines.push("=".repeat(30))

  // Totals
  lines.push(`Subtotal: ${formatPeso(summary.subtotal)}`)
  if (summary.totalFees > 0) {
    lines.push(`Extra Fees: ${formatPeso(summary.totalFees)}`)
  }
  lines.push("-".repeat(30))
  lines.push(`TOTAL: ${formatPeso(summary.grandTotal)}`)
  if (summary.shares.length > 0) {
    const perPerson = summary.grandTotal / summary.shares.length
    lines.push(`Split: ${summary.shares.length} people @ ${formatPeso(perPerson)} each`)
  }
  lines.push("")

  // Individual shares
  summary.shares.forEach((share) => {
    const status = share.paymentStatus === "paid" ? "[PAID]" : "[UNPAID]"
    let line = `${share.name}: ${formatPeso(share.totalAmount)} ${status}`

    // Add payment info if they gave money
    if (share.amountGiven > 0) {
      line += ` (gave ${formatPeso(share.amountGiven)})`
    }

    lines.push(line)
  })

  lines.push("")

  // Summary
  const remaining = summary.shares
    .filter((s) => s.paymentStatus === "unpaid")
    .reduce((sum, s) => sum + s.totalAmount, 0)

  lines.push(
    `Paid: ${summary.paidCount}/${summary.shares.length} | Remaining: ${formatPeso(remaining)}`
  )

  // Bill payers
  const billPayers = summary.shares.filter((s) => s.amountGiven > 0)
  if (billPayers.length > 0) {
    const totalPaid = billPayers.reduce((sum, s) => sum + s.amountGiven, 0)
    lines.push("")
    lines.push("BILL PAID BY:")
    billPayers.forEach((payer) => {
      lines.push(`• ${payer.name}: ${formatPeso(payer.amountGiven)}`)
    })
    lines.push(`Total collected: ${formatPeso(totalPaid)}`)
  }

  // Change summary
  const peopleWithChange = summary.shares.filter(
    (s) => s.amountGiven > 0 && s.change > 0
  )
  const peopleWhoOwe = summary.shares.filter(
    (s) => s.amountGiven > 0 && s.change < 0
  )

  if (peopleWithChange.length > 0 || peopleWhoOwe.length > 0) {
    const totalChange = peopleWithChange.reduce((sum, s) => sum + s.change, 0)

    lines.push("")
    lines.push("CHANGE SUMMARY:")

    peopleWithChange.forEach((person) => {
      lines.push(`→ Give ${person.name}: ${formatPeso(person.change)}`)
    })

    peopleWhoOwe.forEach((person) => {
      lines.push(`→ ${person.name} owes: ${formatPeso(Math.abs(person.change))}`)
    })

    if (totalChange > 0) {
      lines.push(`Total Change: ${formatPeso(totalChange)}`)
    }
  }

  return lines.join("\n")
}
