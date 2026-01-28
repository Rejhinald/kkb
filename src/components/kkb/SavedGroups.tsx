"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SavedGroup } from "@/hooks/useSavedGroups"

interface SavedGroupsProps {
  groups: SavedGroup[]
  currentPeopleNames: string[]
  onLoadGroup: (members: string[]) => void
  onSaveGroup: (name: string, members: string[]) => void
  onDeleteGroup: (id: string) => void
}

export function SavedGroups({
  groups,
  currentPeopleNames,
  onLoadGroup,
  onSaveGroup,
  onDeleteGroup,
}: SavedGroupsProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")
  const [showSaveForm, setShowSaveForm] = useState(false)

  const handleSaveGroup = () => {
    if (currentPeopleNames.length > 0) {
      onSaveGroup(newGroupName.trim(), currentPeopleNames)
      setNewGroupName("")
      setShowSaveForm(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full items-center justify-between"
        >
          <CardTitle className="text-lg">Saved Groups</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-foreground/70">
              {groups.length} saved
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
          {/* Save current people as group */}
          {currentPeopleNames.length > 0 && (
            <div className="space-y-2">
              {!showSaveForm ? (
                <Button
                  variant="neutral"
                  size="sm"
                  onClick={() => setShowSaveForm(true)}
                  className="w-full text-xs"
                >
                  + Save Current People as Group
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Group name (e.g., Barkada)"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    className="flex-1 text-sm"
                    onKeyDown={(e) => e.key === "Enter" && handleSaveGroup()}
                  />
                  <Button size="sm" onClick={handleSaveGroup}>
                    Save
                  </Button>
                  <Button
                    variant="neutral"
                    size="sm"
                    onClick={() => {
                      setShowSaveForm(false)
                      setNewGroupName("")
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Saved groups list */}
          {groups.length > 0 ? (
            <div className="space-y-2">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="rounded-base border-2 border-border bg-secondary-background p-3"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-heading">{group.name}</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="neutral"
                        size="sm"
                        onClick={() => onLoadGroup(group.members)}
                        className="text-xs"
                      >
                        Add All
                      </Button>
                      <button
                        onClick={() => onDeleteGroup(group.id)}
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
                  <p className="text-xs text-foreground/60">
                    {group.members.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-foreground/60 text-center py-2">
              No saved groups yet. Add people to the bill, then save them as a
              group for quick access later.
            </p>
          )}
        </CardContent>
      )}
    </Card>
  )
}
