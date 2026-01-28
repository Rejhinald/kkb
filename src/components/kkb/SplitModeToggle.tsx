"use client"

import { Button } from "@/components/ui/button"
import type { SplitMode } from "@/types/bill"

interface SplitModeToggleProps {
  mode: SplitMode
  onModeChange: (mode: SplitMode) => void
}

export function SplitModeToggle({ mode, onModeChange }: SplitModeToggleProps) {
  return (
    <div className="flex gap-3">
      <Button
        variant={mode === "equal" ? "yellow" : "neutral"}
        onClick={() => onModeChange("equal")}
        className="flex-1"
      >
        Equal Split
      </Button>
      <Button
        variant={mode === "individual" ? "pink" : "neutral"}
        onClick={() => onModeChange("individual")}
        className="flex-1"
      >
        Individual
      </Button>
    </div>
  )
}
