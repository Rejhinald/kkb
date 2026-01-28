"use client"

import { useCallback, useState } from "react"
import type { BillSummary } from "@/types/bill"
import { generateShareText } from "@/lib/share"

export function useShare(summary: BillSummary) {
  const [copied, setCopied] = useState(false)

  const shareText = generateShareText(summary)

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      return true
    } catch (error) {
      console.error("Failed to copy:", error)
      return false
    }
  }, [shareText])

  const webShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `KKB - ${summary.title}`,
          text: shareText,
        })
        return true
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Share failed:", error)
        }
        return false
      }
    } else {
      // Fallback to clipboard
      return copyToClipboard()
    }
  }, [summary.title, shareText, copyToClipboard])

  const canWebShare = typeof navigator !== "undefined" && !!navigator.share

  return { shareText, copyToClipboard, webShare, copied, canWebShare }
}
