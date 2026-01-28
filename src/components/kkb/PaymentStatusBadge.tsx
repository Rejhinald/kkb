"use client"

import { cn } from "@/lib/utils"
import type { PaymentStatus } from "@/types/bill"

interface PaymentStatusBadgeProps {
  status: PaymentStatus
  className?: string
}

export function PaymentStatusBadge({
  status,
  className,
}: PaymentStatusBadgeProps) {
  const isPaid = status === "paid"

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-base border-2 border-border px-2 py-0.5 text-xs font-base",
        isPaid
          ? "bg-green-400 text-black"
          : "bg-secondary-background text-foreground",
        className
      )}
    >
      {isPaid ? (
        <>
          <svg
            className="size-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
          PAID
        </>
      ) : (
        <>
          <svg
            className="size-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="12" cy="12" r="9" />
          </svg>
          UNPAID
        </>
      )}
    </span>
  )
}
