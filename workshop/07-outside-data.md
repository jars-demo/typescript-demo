# Trust nothing from outside

> Data from files, APIs and users arrives as unknown. Type guards turn it into data you can trust.

**Time:** 20 minutes

## Goal

Load JSON safely: check it, then type it, with useful messages when it is wrong.

## Types vanish at runtime

Types are erased before the code runs. So this compiles, and is a lie:

```ts
const habits = JSON.parse(text) as Habit[] // `as` is a promise you cannot keep
```

If the file was edited by hand or written by an old version, the program fails later, somewhere
confusing. The fix: treat outside data as `unknown` and **check** it.

## Type guards

A type guard is a function that returns `value is SomeType`. From `streak/src/days.ts`:

```ts
export function isDay(value: unknown): value is Day {
  if (typeof value !== 'string' || !DAY_PATTERN.test(value)) return false
  const date = new Date(`${value}T00:00:00Z`)
  // Month 13 is an invalid date; 2026-02-30 quietly rolls over to March, so compare both ways.
  return !Number.isNaN(date.getTime()) && toDay(date) === value
}
```

After `if (isDay(x))`, TypeScript treats `x` as a `Day`. The guard also does what the type
cannot: it rejects `2026-13-01` and `2026-02-30`.

## Parse, do not validate

`streak/src/parse.ts` checks a value step by step and builds a trusted `Habit`:

```ts
function parseHabit(value: unknown, index: number): Result<Habit, string> {
  const where = `habit ${index + 1}`
  if (!isRecord(value)) return err(`${where} is not an object`)
  const { id, name, emoji, frequency, createdOn, checkIns } = value
  if (typeof id !== 'string' || id === '') return err(`${where} needs an id`)
  ...
}
```

Each check narrows the type, so by the end TypeScript agrees it is a `Habit`. No `as` anywhere.

For bigger projects, libraries like Zod or Valibot write these checks for you from a schema.

## Errors are unknown too

In `streak/src/store.ts`, a missing file is fine (no habits yet), anything else is not:

```ts
function isMissingFile(error: unknown): boolean {
  return error instanceof Error && 'code' in error && error.code === 'ENOENT'
}
```

`catch (error: unknown)` is the honest type: anything can be thrown.

## Check it works

```bash
echo '[{"id":"read"}]' > broken.json
STREAK_FILE=broken.json npm run streak -- list
```

You get `broken.json: habit 1 needs a name`, not a crash. Delete `broken.json`.

## Exercise

Make `parseHabit` also reject a weekly frequency whose `timesPerWeek` is not 1 to 7, and add a
test for it in `streak/test/cli.test.ts`.
