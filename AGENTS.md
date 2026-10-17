# AGENTS.md

Guidance for AI coding agents and developers. Humans: start with [README.md](README.md).

## What this is

A hands-on TypeScript workshop. Learners build **Streak** (`streak/`), a typed habit tracker and
CLI, guided by ten chapters (`workshop/`). A Next.js 16 site at the root renders the chapters.
**Streak and the chapters are the product**; the site presents them.

## Map

```text
streak/src/types.ts      Day, Frequency, Habit, NewHabit, CheckInError
streak/src/days.ts       toDay, addDays, isDay (type guard)
streak/src/result.ts     Result<T, E>, ok, err
streak/src/habits.ts     addHabit, checkIn, explain, currentStreak, describe, findById
streak/src/parse.ts      parseHabits: unknown JSON to trusted habits
streak/src/store.ts      Store interface, fileStore, memoryStore
streak/src/cli.ts        run(args, store, today); entry point at the bottom
streak/tsconfig.json     strict nodenext build to streak/dist
src/lib/workshop.ts      chapter loader; src/lib/site.ts hero examples and terminal session
src/components/          Shell, TypeToy (with Tee), BackToTop, MarkdownPre, CopyButton
tests/unit/, tests/e2e/  site tests; Playwright runs desktop and phone (390px)
```

## Commands

```bash
npm ci
npm test                     # all Vitest tests (Streak and site)
npx tsc -p streak --noEmit
npm run streak:build && npm run streak -- list
npm run dev
npm run verify               # run before every push
npm run test:e2e
```

## Rules

1. **Docs follow code.** Chapters quote real code and real `tsc` messages. Change one, update the
   other. A unit test fails if a chapter names a missing `streak/` file.
2. **No fabrication.** Error messages on the site are exact `tsc` output; the terminal session is
   real CLI output.
3. **Streak stays dependency-free** at runtime: Node built-ins only. Rules are pure functions that
   take `today` as a parameter.
4. **Mobile first.** Every page works at 390px with no sideways scroll (an e2e test checks), and
   the back-to-top button stays.
5. **Writing style.** Plain English, short sentences, no em dashes in code, docs or commits.
6. **Git.** Conventional Commits, one logical change per commit, no AI attribution trailers.

## Skills

Follows the [JARS Skills](https://github.com/jars-demo/jars-skills) playbooks, including
`tokenjars`, `write-tests`, `code-review` and `commit-style`.
