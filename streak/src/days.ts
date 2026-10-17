// Day helpers (chapter 06). Everything is UTC, so a streak never breaks because of a time zone.

import type { Day } from './types.js'

export function toDay(date: Date): Day {
  return date.toISOString().slice(0, 10) as Day
}

export function addDays(day: Day, amount: number): Day {
  const date = new Date(`${day}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + amount)
  return toDay(date)
}

const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/

/** A type guard: when it returns true, TypeScript treats `value` as a Day. */
export function isDay(value: unknown): value is Day {
  if (typeof value !== 'string' || !DAY_PATTERN.test(value)) return false
  const date = new Date(`${value}T00:00:00Z`)
  // Month 13 is an invalid date; 2026-02-30 quietly rolls over to March, so compare both ways.
  return !Number.isNaN(date.getTime()) && toDay(date) === value
}
