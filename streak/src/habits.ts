// The rules of Streak (chapters 04 to 08). Pure functions: data in, new data out, nothing changed
// in place. That makes them easy to reason about and easy to test.

import { addDays } from './days.js'
import { err, ok, type Result } from './result.js'
import type { CheckInError, Day, Frequency, Habit, NewHabit } from './types.js'

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/** Generic: works for any list of things that have an id (chapter 06). */
export function findById<T extends { readonly id: string }>(
  items: readonly T[],
  id: string,
): T | undefined {
  return items.find((item) => item.id === id)
}

export function addHabit(
  habits: readonly Habit[],
  input: NewHabit,
  today: Day,
): Result<Habit[], string> {
  const name = input.name.trim()
  const id = slugify(name)
  if (id === '') return err('A habit needs a name with at least one letter or number.')
  if (findById(habits, id)) return err(`You already track "${name}".`)

  const frequency: Frequency = input.frequency ?? { kind: 'daily' }
  if (
    frequency.kind === 'weekly' &&
    !(
      Number.isInteger(frequency.timesPerWeek) &&
      frequency.timesPerWeek >= 1 &&
      frequency.timesPerWeek <= 7
    )
  ) {
    return err('A weekly habit happens 1 to 7 times a week.')
  }

  const habit: Habit = {
    id,
    name,
    emoji: input.emoji ?? '✅',
    frequency,
    createdOn: today,
    checkIns: [],
  }
  return ok([...habits, habit])
}

export function checkIn(habit: Habit, day: Day, today: Day): Result<Habit, CheckInError> {
  if (day > today) return err({ kind: 'future', day })
  if (day < habit.createdOn) return err({ kind: 'before-start', day, createdOn: habit.createdOn })
  if (habit.checkIns.includes(day)) return err({ kind: 'duplicate', day })
  return ok({ ...habit, checkIns: [...habit.checkIns, day].sort() })
}

/** Every error kind needs a message. Add a kind and forget it here, and this stops compiling. */
export function explain(error: CheckInError): string {
  switch (error.kind) {
    case 'future':
      return `${error.day} has not happened yet.`
    case 'before-start':
      return `${error.day} is before you started this habit on ${error.createdOn}.`
    case 'duplicate':
      return `You already checked in on ${error.day}.`
    default: {
      const unreachable: never = error
      return unreachable
    }
  }
}

/**
 * Daily: days in a row, ending today (or yesterday, so the streak survives until tonight).
 * Weekly: rolling 7-day windows in a row that reached the target.
 */
export function currentStreak(habit: Habit, today: Day): number {
  const frequency = habit.frequency
  if (frequency.kind === 'daily') {
    const days = new Set(habit.checkIns)
    let cursor = days.has(today) ? today : addDays(today, -1)
    let streak = 0
    while (days.has(cursor)) {
      streak += 1
      cursor = addDays(cursor, -1)
    }
    return streak
  }

  // Here TypeScript knows frequency is the weekly shape, so timesPerWeek exists.
  const inWindow = (end: Day) =>
    habit.checkIns.filter((day) => day <= end && day > addDays(end, -7)).length
  let end = inWindow(today) >= frequency.timesPerWeek ? today : addDays(today, -7)
  let streak = 0
  while (inWindow(end) >= frequency.timesPerWeek) {
    streak += 1
    end = addDays(end, -7)
  }
  return streak
}

export function describe(habit: Habit, today: Day): string {
  const streak = currentStreak(habit, today)
  const how = habit.frequency.kind === 'daily' ? 'daily' : `${habit.frequency.timesPerWeek}x a week`
  const unit = habit.frequency.kind === 'daily' ? 'day' : 'week'
  return `${habit.emoji} ${habit.name} (${how}): ${streak} ${unit}${streak === 1 ? '' : 's'} in a row`
}
