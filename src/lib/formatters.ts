/**
 * Format amount as Philippine Peso with peso sign
 */
export function formatPeso(amount: number): string {
  return `₱${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
}

/**
 * Parse peso input (handles comma-separated values)
 */
export function parsePesoInput(value: string): number {
  const cleaned = value.replace(/[₱,\s]/g, "")
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}

/**
 * Format percentage
 */
export function formatPercentage(value: number): string {
  return `${value}%`
}
