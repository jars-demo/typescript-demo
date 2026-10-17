# Why TypeScript

> JavaScript with a friend who reads your code before it runs, and what we build together.

**Time:** 10 minutes

## Goal

Know what TypeScript does for you, and meet Streak, the project we build.

## What TypeScript is

TypeScript is JavaScript plus **types**: notes about what kind of value goes where. A tool
called the **type checker** (`tsc`) reads those notes and points out mistakes while you type:

- passing a number where a string belongs;
- a typo in a property name;
- using something that might be `undefined`.

The types are removed before the code runs, so the result is plain JavaScript. Nothing is slower,
and every JavaScript library still works.

## Why people love it

- **Fewer bugs reach users.** Whole kinds of mistakes are caught at your desk.
- **Your editor gets smarter.** Autocomplete, jump to definition and safe renames all come from
  the types.
- **Code explains itself.** A function's signature tells you what it needs and what it returns.

## What we build: Streak

Streak is a small habit tracker you use from the terminal:

```bash
npm run streak -- add Read --emoji 📚
npm run streak -- check read
npm run streak -- list
```

It is small, but it has everything real code has: data shapes, rules, input from outside that
cannot be trusted, errors, a file on disk, tests and a build.

```text
streak/src/types.ts    the shapes: Day, Frequency, Habit
streak/src/days.ts     date helpers and a type guard
streak/src/result.ts   errors as values
streak/src/habits.ts   the rules: add, check in, count the streak
streak/src/parse.ts    turn unknown JSON into trusted habits
streak/src/store.ts    load and save a JSON file
streak/src/cli.ts      the command line
streak/test/           Vitest tests
```

## Check it works

Nothing to run yet. Open the [workshop site](/) and press **Fix it** on each example in the hero.
Each red message is a real `tsc` error.

## Exercise

Think of one bug you shipped (or saw shipped) that a type checker might have caught. Keep it in
mind; you will probably meet its cure in the next chapters.
