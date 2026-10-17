# TypeScript Workshop

**Learn TypeScript by building Streak, a small typed habit tracker you run from your terminal.**
Types, unions, generics, safe parsing, errors as values, tests and a real build, one short
chapter at a time.

[![CI](https://github.com/jars-demo/typescript-demo/actions/workflows/ci.yml/badge.svg)](https://github.com/jars-demo/typescript-demo/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-3178c6.svg)](LICENSE)

Workshop site: **[typescript.jishanahmed.in](https://typescript.jishanahmed.in)**

## Start in a minute

You need Node.js 22 and git.

```bash
git clone https://github.com/jars-demo/typescript-demo.git
cd typescript-demo
npm ci
npm test                       # Streak and site tests
npm run streak:build
npm run streak -- add Read --emoji 📚
npm run streak -- check read
npm run streak -- list
```

Habits are saved to `habits.json` (set `STREAK_FILE` to change it).

## The workshop

| #   | Chapter                                                         | Minutes |
| --- | --------------------------------------------------------------- | ------- |
| 01  | [Why TypeScript](workshop/01-why-typescript.md)                 | 10      |
| 02  | [Set up and run it](workshop/02-set-up.md)                      | 10      |
| 03  | [Everyday types](workshop/03-everyday-types.md)                 | 15      |
| 04  | [Objects, interfaces and readonly](workshop/04-objects.md)      | 15      |
| 05  | [Unions and narrowing](workshop/05-unions.md)                   | 20      |
| 06  | [Functions and generics](workshop/06-functions-and-generics.md) | 15      |
| 07  | [Trust nothing from outside](workshop/07-outside-data.md)       | 20      |
| 08  | [Errors as values](workshop/08-errors-as-values.md)             | 15      |
| 09  | [Test it with Vitest](workshop/09-testing.md)                   | 20      |
| 10  | [Ship it](workshop/10-ship-it.md)                               | 15      |

Teaching it? See the [facilitator guide](docs/running-the-workshop.md).

## Layout

```text
streak/src/     the project learners build (types, days, result, habits, parse, store, cli)
streak/test/    Vitest tests for Streak
workshop/       the chapters, in Markdown
src/            the workshop site (Next.js), which renders workshop/
tests/          site tests (Vitest and Playwright, desktop and phone)
```

## Checks

```bash
npx tsc -p streak --noEmit   # Streak types
npm run verify               # lint, types, format, all unit tests, production build
npm run test:e2e             # site, desktop and phone
```

## Licence

[MIT](LICENSE).
