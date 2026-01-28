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
    <header className="space-y-4 sm:space-y-5">
      <div className="flex items-center justify-between">
        <div className="w-8" /> {/* Spacer for centering */}
        <div className="text-center flex flex-col items-center pb-5">
          {/* Light mode logo */}
          <Image
            src="/logo_light.svg"
            alt="KKB Logo"
            width={320}
            height={160}
            className="w-[260px] sm:w-[300px] md:w-[340px] h-auto dark:hidden"
            priority
          />
          {/* Dark mode logo */}
          <Image
            src="/logo_dark.svg"
            alt="KKB Logo"
            width={320}
            height={160}
            className="w-[260px] sm:w-[300px] md:w-[340px] h-auto hidden dark:block"
            priority
          />
          <p className="text-sm sm:text-base font-heading text-foreground/80 mt-2 sm:mt-3"></p>
        </div>
        <ThemeToggle />
      </div>
      <Input
        type="text"
        placeholder="Bill name (e.g., Lunch at Jollibee)"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="text-center font-heading text-sm sm:text-base"
      />
    </header>
  )
}
