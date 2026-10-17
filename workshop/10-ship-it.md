# Ship it

> Build to JavaScript, run it with Node, and keep it honest in CI.

**Time:** 15 minutes

## Goal

Understand the build, the CLI entry point, and the checks that guard every change.

## From TypeScript to JavaScript

```bash
npm run streak:build    # tsc -p streak
node streak/dist/cli.js list
```

`tsc` checks the types, then writes plain JavaScript to `streak/dist/`. Node runs that. The types
are gone; the checks already happened.

Key settings in `streak/tsconfig.json`:

- `"module": "nodenext"`: modern ES modules, the way Node loads them. That is why imports end in
  `.js` even in `.ts` files: they name the file that will exist after the build.
- `"verbatimModuleSyntax": true`: `import type` for things that are only types, so they vanish
  cleanly.
- `"target": "ES2023"`: keep modern JavaScript; Node 22 understands it.

## The entry point

`run` in `streak/src/cli.ts` does the work and returns text, so it is easy to test. The end of
the file connects it to the real world, only when the file is started directly:

```ts
const entry = process.argv[1]
if (entry && import.meta.url === pathToFileURL(entry).href) {
  const store = fileStore(process.env.STREAK_FILE ?? 'habits.json')
  const outcome = await run(process.argv.slice(2), store, toDay(new Date()))
  console.log(outcome.output)
  process.exitCode = outcome.code
}
```

Arguments are read with Node's built-in `parseArgs`, which is fully typed: `values.emoji` is
`string | undefined` without any extra work.

## Checks on every push

`.github/workflows/ci.yml` runs, for every change:

```bash
npx tsc -p streak --noEmit   # types
npx vitest run               # behaviour
npm run streak:build         # it builds
node streak/dist/cli.js list # and it runs
```

A red check stops a broken change before anyone else sees it.

## Check it works

```bash
npm run streak:build
STREAK_FILE=/tmp/streak.json node streak/dist/cli.js add Stretch --weekly 3
STREAK_FILE=/tmp/streak.json node streak/dist/cli.js list
```

## Exercise

You made it. Add a `streak remove <id>` command, with a test, a `Result` for "no such habit", and
a line in the help text. Then share your fork with the group.
