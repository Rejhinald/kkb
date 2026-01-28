"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPeso } from "@/lib/formatters"
import type { HistoryEntry } from "@/hooks/useBillHistory"

interface BillHistoryProps {
  history: HistoryEntry[]
  onRestore: (entry: HistoryEntry) => void
  onDelete: (id: string) => void
  onClearHistory: () => void
}

export function BillHistory({
  history,
  onRestore,
  onDelete,
  onClearHistory,
}: BillHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (history.length === 0) {
    return null
  }

  const formatDate = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full items-center justify-between"
        >
          <CardTitle className="text-lg">Bill History</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-foreground/70">
              {history.length} saved
            </span>
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
        <CardContent className="space-y-3">
          {history.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between rounded-base border-2 border-border bg-secondary-background p-3"
            >
              <div className="flex-1 min-w-0">
                <p className="font-heading truncate">{entry.title}</p>
                <p className="text-xs text-foreground/60">
                  {entry.peopleCount} people · {formatDate(entry.savedAt)}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-2">
                <span className="font-heading text-sm">
                  {formatPeso(entry.grandTotal)}
                </span>
                <Button
                  variant="neutral"
                  size="sm"
                  onClick={() => onRestore(entry)}
                  className="text-xs"
                >
                  Load
                </Button>
                <button
                  onClick={() => onDelete(entry.id)}
                  className="text-red-600 hover:text-red-800 p-1"
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

          <Button
            variant="neutral"
            size="sm"
            onClick={onClearHistory}
            className="w-full text-xs text-red-600"
          >
            Clear All History
          </Button>
        </CardContent>
      )}
    </Card>
  )
}
