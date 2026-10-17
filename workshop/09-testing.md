# Test it with Vitest

> Types prove the shapes fit. Tests prove the behaviour is right. You want both.

**Time:** 20 minutes

## Goal

Run, read and write tests, and know what types do and do not catch.

## Run the tests

```bash
npx vitest run streak     # once
npx vitest streak         # watch mode: re-runs as you save
```

Vitest runs TypeScript directly; no build step needed.

## Types are not tests

The checker knows `currentStreak` returns a `number`. It cannot know that the number is **right**.
That is what tests are for. From `streak/test/habits.test.ts`:

```ts
it('counts days in a row, ending today or yesterday', () => {
  const days: Day[] = ['2026-10-14', '2026-10-15', '2026-10-16']
  expect(currentStreak(habit({ checkIns: days }), TODAY)).toBe(3)
  expect(currentStreak(habit({ checkIns: [...days, TODAY] }), TODAY)).toBe(4)
  expect(currentStreak(habit({ checkIns: ['2026-10-15'] }), TODAY)).toBe(0)
})
```

## Design that makes testing easy

Three choices from earlier chapters pay off here:

1. **Pure functions.** `addHabit`, `checkIn` and `currentStreak` take data and return data.
2. **Today is a parameter.** Tests pass a fixed `TODAY`, so they never break at midnight.
3. **The CLI takes a Store.** Tests give it `memoryStore()`, no files involved. From
   `streak/test/cli.test.ts`:

```ts
const store = memoryStore()

expect(await run(['add', 'Read', '--emoji', '📚'], store, TODAY)).toEqual({
  code: 0,
  output: 'Added 📚 Read (id: read)',
})
```

## Typed test helpers

A small factory keeps tests short and still type-checked:

```ts
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
```

`Partial<Habit>` is a built-in generic: every field of `Habit`, all optional.

## Check it works

Break `currentStreak` on purpose (start `streak` at 1). Run the tests and read the failure. Undo
it.

## Exercise

Write a test for a weekly habit that missed last week entirely: its streak should be 0 unless
this week already reached the target.
