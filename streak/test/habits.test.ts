import { describe as group, expect, it } from 'vitest'

import { addDays, isDay } from '../src/days.js'
import { addHabit, checkIn, currentStreak, describe, explain, slugify } from '../src/habits.js'
import type { Day, Habit } from '../src/types.js'

const TODAY: Day = '2026-10-17'

function habit(overrides: Partial<Habit> = {}): Habit {
  return {
    id: 'read',
    name: 'Read',
    emoji: '📚',
    frequency: { kind: 'daily' },
    createdOn: '2026-10-01',
    checkIns: [],
    ...overrides,
  }
}

group('days', () => {
  it('adds days across months and years', () => {
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01')
    expect(addDays('2027-01-01', -1)).toBe('2026-12-31')
  })

  it('only accepts real calendar days', () => {
    expect(isDay('2026-02-28')).toBe(true)
    expect(isDay('2026-02-30')).toBe(false)
    expect(isDay('17/10/2026')).toBe(false)
    expect(isDay(20261017)).toBe(false)
  })
})

group('addHabit', () => {
  it('adds a daily habit with a slug id', () => {
    const result = addHabit([], { name: '  Drink Water! ' }, TODAY)

    expect(result).toEqual({
      ok: true,
      value: [
        {
          id: 'drink-water',
          name: 'Drink Water!',
          emoji: '✅',
          frequency: { kind: 'daily' },
          createdOn: TODAY,
          checkIns: [],
        },
      ],
    })
  })

  it('refuses empty names, duplicates and impossible weekly targets', () => {
    expect(addHabit([], { name: '!!!' }, TODAY).ok).toBe(false)
    expect(addHabit([habit()], { name: 'read' }, TODAY).ok).toBe(false)
    expect(
      addHabit([], { name: 'Run', frequency: { kind: 'weekly', timesPerWeek: 8 } }, TODAY).ok,
    ).toBe(false)
    expect(
      addHabit([], { name: 'Run', frequency: { kind: 'weekly', timesPerWeek: 2.5 } }, TODAY).ok,
    ).toBe(false)
  })

  it('never changes the list it was given', () => {
    const habits = [habit()]
    addHabit(habits, { name: 'Run' }, TODAY)
    expect(habits).toHaveLength(1)
  })

  it('makes readable ids', () => {
    expect(slugify('Café Time')).toBe('cafe-time')
  })
})

group('checkIn', () => {
  it('records a day, sorted', () => {
    const first = checkIn(habit({ checkIns: ['2026-10-16'] }), '2026-10-15', TODAY)
    expect(first.ok && first.value.checkIns).toEqual(['2026-10-15', '2026-10-16'])
  })

  it('explains every way it can fail', () => {
    const cases = [
      checkIn(habit(), '2026-10-18', TODAY),
      checkIn(habit(), '2026-09-30', TODAY),
      checkIn(habit({ checkIns: [TODAY] }), TODAY, TODAY),
    ]
    expect(cases.map((r) => (r.ok ? 'ok' : explain(r.error)))).toEqual([
      '2026-10-18 has not happened yet.',
      '2026-09-30 is before you started this habit on 2026-10-01.',
      'You already checked in on 2026-10-17.',
    ])
  })
})

group('currentStreak', () => {
  it('counts days in a row, ending today or yesterday', () => {
    const days: Day[] = ['2026-10-14', '2026-10-15', '2026-10-16']
    expect(currentStreak(habit({ checkIns: days }), TODAY)).toBe(3)
    expect(currentStreak(habit({ checkIns: [...days, TODAY] }), TODAY)).toBe(4)
    expect(currentStreak(habit({ checkIns: ['2026-10-15'] }), TODAY)).toBe(0)
  })

  it('counts weeks that reached the target', () => {
    const weekly = habit({
      frequency: { kind: 'weekly', timesPerWeek: 2 },
      checkIns: ['2026-10-02', '2026-10-04', '2026-10-05', '2026-10-12', '2026-10-15'],
    })
    expect(currentStreak(weekly, TODAY)).toBe(2)
  })

  it('describes a habit in one line', () => {
    expect(describe(habit({ checkIns: [TODAY] }), TODAY)).toBe('📚 Read (daily): 1 day in a row')
  })
})
