import type {
  BillState,
  PersonShare,
  BillSummary,
  ExtraFee,
} from "@/types/bill"

/**
 * Calculate total extra fees amount based on subtotal
 */
export function calculateTotalFees(subtotal: number, fees: ExtraFee[]): number {
  return fees.reduce((total, fee) => {
    if (fee.isPercentage) {
      return total + (subtotal * fee.amount) / 100
    }
    return total + fee.amount
  }, 0)
}

/**
 * Get total personal amounts across all people (for equal split mode)
 */
function getTotalPersonalAmounts(state: BillState): number {
  return state.people.reduce((sum, person) => sum + (person.personalAmount || 0), 0)
}

/**
 * Get the shared amount (subtotal minus personal orders) for equal split
 */
function getSharedAmount(state: BillState): number {
  if (state.splitMode !== "equal") return 0
  const totalPersonal = getTotalPersonalAmounts(state)
  return Math.max(0, state.subtotal - totalPersonal)
}

/**
 * Get person's base amount (before fees)
 */
function getPersonBaseAmount(state: BillState, personIndex: number): number {
  const { splitMode, people } = state
  const person = people[personIndex]

  if (splitMode === "equal") {
    // Equal split: shared portion + personal amount
    const sharedAmount = getSharedAmount(state)
    const perPersonShared = people.length > 0 ? sharedAmount / people.length : 0
    const personalAmount = person.personalAmount || 0
    return perPersonShared + personalAmount
  }

  // Individual mode: sum of person's items
  return person.items.reduce((sum, item) => sum + item.amount, 0)
}

/**
 * Calculate actual subtotal (depends on mode)
 */
export function getActualSubtotal(state: BillState): number {
  if (state.splitMode === "equal") {
    return state.subtotal
  }
  // Individual mode: sum all items across all people
  return state.people.reduce((total, person) => {
    return total + person.items.reduce((sum, item) => sum + item.amount, 0)
  }, 0)
}

/**
 * Calculate shares for all people
 */
export function calculateShares(state: BillState): PersonShare[] {
  const { people, extraFees, feeDistributionMode, splitMode } = state

  if (people.length === 0) return []

  const actualSubtotal = getActualSubtotal(state)
  const totalFees = calculateTotalFees(actualSubtotal, extraFees)

  return people.map((person, index) => {
    const baseAmount = getPersonBaseAmount(state, index)
    const personalAmount = splitMode === "equal" ? (person.personalAmount || 0) : 0

    let feeAmount: number
    if (feeDistributionMode === "equal") {
      feeAmount = totalFees / people.length
    } else {
      // Proportional: based on percentage of subtotal
      const proportion = actualSubtotal > 0 ? baseAmount / actualSubtotal : 0
      feeAmount = totalFees * proportion
    }

    const totalAmount = baseAmount + feeAmount
    const amountGiven = person.amountGiven || 0
    const change = amountGiven > 0 ? amountGiven - totalAmount : 0

    return {
      personId: person.id,
      name: person.name,
      baseAmount,
      personalAmount,
      feeAmount,
      totalAmount,
      paymentStatus: person.paymentStatus,
      amountGiven,
      change,
    }
  })
}

/**
 * Generate bill summary
 */
export function calculateSummary(
  state: BillState,
  shares: PersonShare[]
): BillSummary {
  const actualSubtotal = getActualSubtotal(state)
  const totalFees = calculateTotalFees(actualSubtotal, state.extraFees)
  const grandTotal = actualSubtotal + totalFees

  const paidCount = shares.filter((s) => s.paymentStatus === "paid").length
  const unpaidCount = shares.length - paidCount

  return {
    title: state.title,
    subtotal: actualSubtotal,
    totalFees,
    grandTotal,
    splitMode: state.splitMode,
    shares,
    paidCount,
    unpaidCount,
  }
}
