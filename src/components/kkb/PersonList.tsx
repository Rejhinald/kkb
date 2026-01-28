"use client"

import { PersonCard } from "./PersonCard"
import { AddPersonForm } from "./AddPersonForm"
import type { Person, PersonShare, SplitMode } from "@/types/bill"

interface PersonListProps {
  people: Person[]
  shares: PersonShare[]
  splitMode: SplitMode
  onAddPerson: (name: string) => void
  onRemovePerson: (personId: string) => void
  onTogglePayment: (personId: string) => void
  onAddItem: (personId: string, name: string, amount: number) => void
  onRemoveItem: (personId: string, itemId: string) => void
  onSetPersonalAmount: (personId: string, amount: number) => void
  onSetAmountGiven: (personId: string, amount: number) => void
}

export function PersonList({
  people,
  shares,
  splitMode,
  onAddPerson,
  onRemovePerson,
  onTogglePayment,
  onAddItem,
  onRemoveItem,
  onSetPersonalAmount,
  onSetAmountGiven,
}: PersonListProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg sm:text-xl font-heading">People</h2>

      {people.length === 0 ? (
        <p className="text-foreground/60 text-sm">
          Add people to split the bill with
        </p>
      ) : (
        <div className="space-y-2.5">
          {people.map((person) => {
            const share = shares.find((s) => s.personId === person.id)
            return (
              <PersonCard
                key={person.id}
                person={person}
                share={share}
                splitMode={splitMode}
                onTogglePayment={() => onTogglePayment(person.id)}
                onRemove={() => onRemovePerson(person.id)}
                onAddItem={(name, amount) => onAddItem(person.id, name, amount)}
                onRemoveItem={(itemId) => onRemoveItem(person.id, itemId)}
                onSetPersonalAmount={(amount) => onSetPersonalAmount(person.id, amount)}
                onSetAmountGiven={(amount) => onSetAmountGiven(person.id, amount)}
              />
            )
          })}
        </div>
      )}

      <AddPersonForm onAdd={onAddPerson} />
    </div>
  )
}
