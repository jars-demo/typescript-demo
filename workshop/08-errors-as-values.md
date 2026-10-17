# Errors as values

> Make failure part of the signature, so nobody can forget to handle it.

**Time:** 15 minutes

## Goal

Return expected failures as values with a `Result` type, and keep `throw` for the truly
unexpected.

## The problem with throw

`function checkIn(...): Habit` says nothing about failing. If it throws, every caller must
remember a `try`, and the checker cannot remind them.

## Result

From `streak/src/result.ts`:

```ts
export type Result<T, E> =
  { readonly ok: true; readonly value: T } | { readonly ok: false; readonly error: E }

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value }
}

export function err<E>(error: E): Result<never, E> {
  return { ok: false, error }
}
```

It is just a discriminated union (chapter 05) with generics (chapter 06).

## Using it

`checkIn` in `streak/src/habits.ts` says in its type that it can fail, and how:

```ts
export function checkIn(habit: Habit, day: Day, today: Day): Result<Habit, CheckInError> {
  if (day > today) return err({ kind: 'future', day })
  if (day < habit.createdOn) return err({ kind: 'before-start', day, createdOn: habit.createdOn })
  if (habit.checkIns.includes(day)) return err({ kind: 'duplicate', day })
  return ok({ ...habit, checkIns: [...habit.checkIns, day].sort() })
}
```

The caller cannot reach `value` without checking `ok` first. From `streak/src/cli.ts`:

```ts
const checked = checkIn(habit, when, today)
if (!checked.ok) return fail(explain(checked.error))
await store.save(habits.map((h) => (h.id === habit.id ? checked.value : h)))
```

Try deleting the `if` line: `checked.value` turns red.

## When to throw anyway

Use `Result` for **expected** failures a user can cause (bad input, a duplicate). Keep `throw`
for bugs and broken environments (a disk you cannot read). `fileStore` does exactly that: a
missing file is fine, invalid JSON is a `Result` error, and any other read error is thrown.

## Check it works

```bash
npm run streak -- check read --day 2099-01-01
```

You get `2099-01-01 has not happened yet.` and exit code 1.

## Exercise

Change `addHabit` to return a union of error kinds instead of a plain string, like
`CheckInError`, with an `explain` for it.
