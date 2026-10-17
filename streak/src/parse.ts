// Trust nothing from outside (chapter 07). A file, an API or a user can hand us anything, so it
// arrives as `unknown` and earns its type by passing these checks.

import { isDay } from './days.js'
import { err, ok, type Result } from './result.js'
import type { Frequency, Habit } from './types.js'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseFrequency(value: unknown): Frequency | undefined {
  if (!isRecord(value)) return undefined
  if (value.kind === 'daily') return { kind: 'daily' }
  if (value.kind === 'weekly' && typeof value.timesPerWeek === 'number') {
    return { kind: 'weekly', timesPerWeek: value.timesPerWeek }
  }
  return undefined
}

function parseHabit(value: unknown, index: number): Result<Habit, string> {
  const where = `habit ${index + 1}`
  if (!isRecord(value)) return err(`${where} is not an object`)
  const { id, name, emoji, frequency, createdOn, checkIns } = value
  if (typeof id !== 'string' || id === '') return err(`${where} needs an id`)
  if (typeof name !== 'string') return err(`${where} needs a name`)
  if (typeof emoji !== 'string') return err(`${where} needs an emoji`)
  const parsedFrequency = parseFrequency(frequency)
  if (!parsedFrequency) return err(`${where} has an unknown frequency`)
  if (!isDay(createdOn)) return err(`${where} has a bad createdOn day`)
  if (!Array.isArray(checkIns) || !checkIns.every(isDay)) {
    return err(`${where} has a bad check-in day`)
  }
  return ok({ id, name, emoji, frequency: parsedFrequency, createdOn, checkIns })
}

export function parseHabits(value: unknown): Result<Habit[], string> {
  if (!Array.isArray(value)) return err('the file should hold a list of habits')
  const habits: Habit[] = []
  for (const [index, item] of value.entries()) {
    const parsed = parseHabit(item, index)
    if (!parsed.ok) return parsed
    habits.push(parsed.value)
  }
  return ok(habits)
}
