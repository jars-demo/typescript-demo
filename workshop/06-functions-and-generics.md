# Functions and generics

> Typed inputs and outputs, and helpers that keep the types of whatever passes through.

**Time:** 15 minutes

## Goal

Write typed functions and your first generic helper.

## Typed functions

From `streak/src/days.ts`:

```ts
export function addDays(day: Day, amount: number): Day {
  const date = new Date(`${day}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + amount)
  return toDay(date)
}
```

Parameters always need types. The return type is optional (it can be inferred), but writing it
on exported functions is a promise to callers, and the checker holds you to it.

Arrow functions work the same: `(end: Day) => number`.

## Generics: a type parameter

Say you want "find the item with this id" for habits, users, anything. Without generics you
would lose the type and get back `unknown`. With them, from `streak/src/habits.ts`:

```ts
export function findById<T extends { readonly id: string }>(
  items: readonly T[],
  id: string,
): T | undefined {
  return items.find((item) => item.id === id)
}
```

- `<T ...>` is a **type parameter**: a placeholder filled in at each call.
- `extends { readonly id: string }` is a **constraint**: T can be anything that has an id.
- Call it with `Habit[]` and you get `Habit | undefined` back. No casts.

`Array<T>`, `Promise<T>` and `Set<T>` are generics you already use.

## Result is generic too

`streak/src/result.ts` has two type parameters, one for success and one for failure:

```ts
export type Result<T, E> =
  { readonly ok: true; readonly value: T } | { readonly ok: false; readonly error: E }
```

You will use it properly in chapter 08.

## Check it works

Hover over `findById(habits, rest[0] ?? '')` in `streak/src/cli.ts`. The return type is
`Habit | undefined`.

## Exercise

Write `groupBy<T, K extends string>(items: readonly T[], key: (item: T) => K): Record<K, T[]>`
and use it to group habits by `frequency.kind`.
