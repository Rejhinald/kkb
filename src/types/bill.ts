/** Split mode for the bill */
export type SplitMode = "equal" | "individual"

/** How extra fees are distributed */
export type FeeDistributionMode = "proportional" | "equal"

/** Payment status for a person */
export type PaymentStatus = "paid" | "unpaid"

/** Individual item assigned to a person */
export interface BillItem {
  id: string
  name: string
  amount: number
}

/** Person participating in the bill split */
export interface Person {
  id: string
  name: string
  items: BillItem[]
  paymentStatus: PaymentStatus
  /** Personal order amount (not split with others) - used in equal split mode */
  personalAmount: number
  /** Amount actually given/paid by this person */
  amountGiven: number
}

/** Extra fees (service charge, tax, tips) */
export interface ExtraFee {
  id: string
  label: string
  amount: number
  isPercentage: boolean
}

/** Main bill state */
export interface BillState {
  id: string
  title: string
  splitMode: SplitMode
  feeDistributionMode: FeeDistributionMode
  subtotal: number
  people: Person[]
  extraFees: ExtraFee[]
  createdAt: string
  updatedAt: string
}

/** Calculated share for display */
export interface PersonShare {
  personId: string
  name: string
  baseAmount: number
  personalAmount: number
  feeAmount: number
  totalAmount: number
  paymentStatus: PaymentStatus
  amountGiven: number
  change: number
}

/** Summary for sharing */
export interface BillSummary {
  title: string
  subtotal: number
  totalFees: number
  grandTotal: number
  splitMode: SplitMode
  shares: PersonShare[]
  paidCount: number
  unpaidCount: number
}
