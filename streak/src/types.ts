// The shapes everything else is built from (chapters 03 to 05).

/** A calendar day in UTC, written as YYYY-MM-DD. Days sort correctly as plain strings. */
export type Day = `${number}-${number}-${number}`

/** How often a habit should happen. The `kind` field tells the two shapes apart. */
export type Frequency =
  { readonly kind: 'daily' } | { readonly kind: 'weekly'; readonly timesPerWeek: number }

export interface Habit {
  readonly id: string
  readonly name: string
  readonly emoji: string
  readonly frequency: Frequency
  readonly createdOn: Day
  readonly checkIns: readonly Day[]
}

/** What someone gives us to make a habit. The `?` fields are optional. */
export interface NewHabit {
  name: string
  emoji?: string
  frequency?: Frequency
}

export type CheckInError =
  | { readonly kind: 'future'; readonly day: Day }
  | { readonly kind: 'before-start'; readonly day: Day; readonly createdOn: Day }
  | { readonly kind: 'duplicate'; readonly day: Day }
