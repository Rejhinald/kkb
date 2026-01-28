"use client"

import Image from "next/image"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "./ThemeToggle"

interface BillHeaderProps {
  title: string
  onTitleChange: (title: string) => void
}

export function BillHeader({ title, onTitleChange }: BillHeaderProps) {
  return (
    <header className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="w-8" /> {/* Spacer for centering */}
        <div className="text-center flex flex-col items-center">
          {/* Light mode logo */}
          <Image
            src="/logo_light.svg"
            alt="KKB Logo"
            width={280}
            height={140}
            className="w-[180px] sm:w-[220px] h-auto dark:hidden"
            priority
          />
          {/* Dark mode logo */}
          <Image
            src="/logo_dark.svg"
            alt="KKB Logo"
            width={280}
            height={140}
            className="w-[180px] sm:w-[220px] h-auto hidden dark:block"
            priority
          />
        </div>
        <ThemeToggle />
      </div>
      <Input
        type="text"
        placeholder="Bill name (e.g., Lunch at Jollibee)"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="text-center font-heading text-sm"
      />
    </header>
  )
}
