# Running the workshop

## Who it is for

People who write some JavaScript (functions, arrays, objects) and want to use TypeScript with
confidence. No TypeScript experience needed.

## Formats

| Format    | Chapters                              | Time       |
| --------- | ------------------------------------- | ---------- |
| Lightning | 01, 05, 08 live, plus the hero toy    | 45 minutes |
| Half day  | All ten, exercises for fast finishers | 3 hours    |
| Full day  | All ten, every exercise, then a build | 5 hours    |

## Before the day

Ask everyone to run `git clone`, `npm ci` and `npm test` at home. Green tests mean they are
ready. Use VS Code or any editor with TypeScript support, so squiggles show live.

## The moments that land

- **Chapter 02:** a one-letter typo turns red before anything runs.
- **Chapter 05:** add an error kind and watch `explain` fail until it is handled.
- **Chapter 07:** a hand-broken `habits.json` gives a clear message, not a crash.
- **Chapter 08:** delete the `if (!checked.ok)` line and `checked.value` turns red.

## Common snags

| Symptom                              | Fix                                              |
| ------------------------------------ | ------------------------------------------------ |
| `npm run streak` says file not found | Run `npm run streak:build` first.                |
| Editor shows no errors               | Open the repository folder itself, not a parent. |
| Old habits in the way                | Delete `habits.json`.                            |
| Windows: `STREAK_FILE=... node`      | In PowerShell use `$env:STREAK_FILE="x.json"`.   |
