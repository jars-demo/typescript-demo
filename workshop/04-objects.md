# Objects, interfaces and readonly

> Describe the shape of your data once, and keep it from changing behind your back.

**Time:** 15 minutes

## Goal

Model Streak's data with interfaces, optional fields and `readonly`.

## An interface is a shape

From `streak/src/types.ts`:

```ts
export interface Habit {
  readonly id: string
  readonly name: string
  readonly emoji: string
  readonly frequency: Frequency
  readonly createdOn: Day
  readonly checkIns: readonly Day[]
}
```

Any object with those fields **is** a `Habit`. TypeScript checks shapes, not class names.

## Optional fields

What someone gives us to create a habit has fewer fields, and some are optional:

```ts
export interface NewHabit {
  name: string
  emoji?: string
  frequency?: Frequency
}
```

`emoji?: string` means "a string, or not there at all". When you read it you get
`string | undefined`, so you must handle the missing case. `addHabit` does it with `??`:

```ts
emoji: input.emoji ?? '✅',
```

With `exactOptionalPropertyTypes`, "not there" and "there but `undefined`" are different, which
is why the CLI spreads optional fields in only when they exist:

```ts
{ name: rest.join(' '), ...(emoji ? { emoji } : {}), ...(frequency ? { frequency } : {}) }
```

## readonly: change by copying

`readonly` stops code from changing a value in place. To "change" a habit, Streak makes a new
one. From `checkIn` in `streak/src/habits.ts`:

```ts
return ok({ ...habit, checkIns: [...habit.checkIns, day].sort() })
```

The old habit is untouched. Nothing else that holds it is surprised, and tests stay simple.

## type or interface?

Both describe object shapes. A common, simple rule: `interface` for object shapes, `type` for
everything else (unions, literal sets, functions). Streak follows it.

## Check it works

In `checkIn`, add `habit.checkIns.push(day)`. The checker refuses with
``Property 'push' does not exist on type 'readonly `${number}-${number}-${number}`[]'``. Undo it.

## Exercise

Add an optional `note?: string` to `NewHabit` and `Habit`, and make `addHabit` copy it across
only when it is given. Run `npx tsc -p streak --noEmit` until it is clean.
