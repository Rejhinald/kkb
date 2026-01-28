"use client"

import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"

interface QRCodeModalProps {
  isOpen: boolean
  onClose: () => void
  text: string
  title: string
}

export function QRCodeModal({ isOpen, onClose, text, title }: QRCodeModalProps) {
  if (!isOpen) return null

  // Truncate text if too long for QR code (max ~2000 chars for reliable scanning)
  const qrText = text.length > 1500
    ? text.slice(0, 1500) + "\n...(truncated)"
    : text

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay"
      onClick={onClose}
    >
      <div
        className="bg-background rounded-base border-2 border-border shadow-shadow p-6 max-w-sm w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-lg">Scan to View Bill</h3>
          <button
            onClick={onClose}
            className="text-foreground/60 hover:text-foreground"
          >
            <svg
              className="size-6"
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

        <div className="bg-white p-4 rounded-base border-2 border-border flex items-center justify-center">
          <QRCodeSVG
            value={qrText}
            size={240}
            level="M"
            includeMargin={false}
          />
        </div>

        <p className="text-center text-sm text-foreground/60 mt-4">
          {title}
        </p>
        <p className="text-center text-xs text-foreground/40 mt-1">
          Scan this QR code to view the bill details
        </p>

        <Button
          variant="neutral"
          className="w-full mt-4"
          onClick={onClose}
        >
          Close
        </Button>
      </div>
    </div>
  )
}
