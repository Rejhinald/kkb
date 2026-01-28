"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useShare } from "@/hooks/useShare"
import { QRCodeModal } from "./QRCodeModal"
import { generateShareText } from "@/lib/share"
import type { BillSummary } from "@/types/bill"

interface ShareActionsProps {
  summary: BillSummary
  onReset: () => void
  onSave: () => void
}

export function ShareActions({ summary, onReset, onSave }: ShareActionsProps) {
  const { copyToClipboard, webShare, copied, canWebShare } = useShare(summary)
  const [showQR, setShowQR] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    onSave()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const shareText = generateShareText(summary)

  return (
    <>
    <QRCodeModal
      isOpen={showQR}
      onClose={() => setShowQR(false)}
      text={shareText}
      title={summary.title || "KKB Bill"}
    />
    <div className="flex gap-2 justify-center">
      <Button
        variant="yellow"
        onClick={copyToClipboard}
        disabled={summary.shares.length === 0}
        title={copied ? "Copied!" : "Copy to clipboard"}
      >
        <svg
          className="size-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          {copied ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          )}
        </svg>
      </Button>

      {canWebShare && (
        <Button
          variant="green"
          onClick={webShare}
          disabled={summary.shares.length === 0}
          title="Share"
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
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
        </Button>
      )}

      <Button
        variant="purple"
        onClick={() => setShowQR(true)}
        disabled={summary.shares.length === 0}
        title="Show QR Code"
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
            d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h2M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
          />
        </svg>
      </Button>

      <Button
        variant={saved ? "green" : "orange"}
        onClick={handleSave}
        disabled={summary.shares.length === 0}
        title="Save to History"
      >
        <svg
          className="size-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          {saved ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
            />
          )}
        </svg>
      </Button>

      <Button
        variant="danger"
        onClick={onReset}
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
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </Button>
    </div>
    </>
  )
}
