# Unions and narrowing

> Model "this or that" exactly, and let the checker follow your if statements.

**Time:** 20 minutes

## Goal

Use discriminated unions, narrow them safely, and make the checker find the case you forgot.

## A union of shapes

A habit is either daily, or weekly with a target. From `streak/src/types.ts`:

```ts
export type Frequency =
  { readonly kind: 'daily' } | { readonly kind: 'weekly'; readonly timesPerWeek: number }
```

The shared `kind` field is the **discriminant**. It tells the two shapes apart.

Compare a "bag of optional fields" design: `{ kind: string; timesPerWeek?: number }`. It allows
a daily habit with a target, or a weekly one without. The union makes those impossible.

## Narrowing

Before you check `kind`, you can only use what both shapes share. After the check, TypeScript
knows which one you have. From `currentStreak` in `streak/src/habits.ts`:

```ts
const frequency = habit.frequency
if (frequency.kind === 'daily') {
  // ... daily logic, then return
}

// Here TypeScript knows frequency is the weekly shape, so timesPerWeek exists.
```

`typeof`, `in`, `Array.isArray` and `instanceof` narrow too.

## Exhaustive checks with never

Errors are a union too:

```ts
export type CheckInError =
  | { readonly kind: 'future'; readonly day: Day }
  | { readonly kind: 'before-start'; readonly day: Day; readonly createdOn: Day }
  | { readonly kind: 'duplicate'; readonly day: Day }
```

`explain` turns each into a message, and ends with a trick:

```ts
default: {
  const unreachable: never = error
  return unreachable
}
```

`never` is the type with no values. If every kind is handled, `error` is `never` there and this
compiles. Add a new kind and forget it, and this line turns red.

## Check it works

Add `| { readonly kind: 'too-late'; readonly day: Day }` to `CheckInError`. Run
`npx tsc -p streak --noEmit`: `explain` fails until you add a `case 'too-late'`. Then remove it.

## Exercise

Add a third frequency, `{ kind: 'monthly'; timesPerMonth: number }`. Let the checker lead you to
every place that needs an update.
