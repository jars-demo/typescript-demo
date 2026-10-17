# Everyday types

> Strings, numbers, arrays and literal types, and why you rarely need to write them.

**Time:** 15 minutes

## Goal

Read and write the basic types, and know when to let TypeScript work them out.

## The basics

```ts
let name: string = 'Read'
let times: number = 3
let done: boolean = false
let days: string[] = ['2026-10-16', '2026-10-17']
```

## Inference does most of the work

You can leave most of those annotations out. TypeScript **infers** the type from the value:

```ts
let name = 'Read' // string
const days = ['2026-10-16'] // string[]
```

Write types where they help a reader: function parameters, return types of exported functions,
and data shapes. Let inference handle the rest.

## Literal types

A `const` can never change, so TypeScript gives it the exact value as its type:

```ts
const kind = 'daily' // type: 'daily', not just string
```

That is the seed of something powerful. A type can be a **set of exact values**:

```ts
type Kind = 'daily' | 'weekly'
```

## Template literal types

Streak describes a day as a pattern, in `streak/src/types.ts`:

```ts
/** A calendar day in UTC, written as YYYY-MM-DD. Days sort correctly as plain strings. */
export type Day = `${number}-${number}-${number}`
```

`'2026-10-17'` fits. `'yesterday'` does not, and the checker says so. (It cannot know that
month 13 does not exist; that is a job for the type guard in chapter 07.)

## any and unknown

- `any` switches the checker off for that value. Avoid it: it spreads silently.
- `unknown` means "could be anything, so prove what it is before you use it". You will use it for
  outside data in chapter 07.

## Check it works

In a new file `streak/src/play.ts`, write:

```ts
import type { Day } from './types.js'

const ok: Day = '2026-10-17'
const nope: Day = 'yesterday'
```

Run `npx tsc -p streak --noEmit` and read the error for `nope`. Then delete the file.

## Exercise

Hover over different variables in `streak/src/habits.ts` and read the inferred types. Find one
that you would not have guessed.
