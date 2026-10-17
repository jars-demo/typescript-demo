# Set up and run it

> Install, run the tests, try the CLI, and see the type checker in your editor.

**Time:** 10 minutes

## Goal

Streak installed, its tests green, and your first type error on screen.

## Steps

1. **Install Node.js 22** from [nodejs.org](https://nodejs.org), and a code editor (VS Code
   understands TypeScript out of the box).

2. **Get the code and install.** `npm ci` installs the exact versions in `package-lock.json`.

   ```bash
   git clone https://github.com/jars-demo/typescript-demo.git
   cd typescript-demo
   npm ci
   ```

3. **Run the tests.**

   ```bash
   npx vitest run streak
   ```

4. **Build and use the CLI.** `tsc` turns `streak/src/*.ts` into JavaScript in `streak/dist/`,
   and Node runs that.

   ```bash
   npm run streak:build
   npm run streak -- add Read --emoji 📚
   npm run streak -- list
   ```

   Your habits are saved in `habits.json`. Set `STREAK_FILE` to keep them somewhere else.

## Meet the type checker

Open `streak/src/habits.ts`, find `describe`, and change `habit.name` to `habit.nmae`. A red
squiggle appears at once. Hover it:

```text
Property 'nmae' does not exist on type 'Habit'.
```

Now run the checker yourself:

```bash
npx tsc -p streak --noEmit
```

Same error, in the terminal. That is the check CI runs on every push. Undo the typo.

## The settings that matter

`streak/tsconfig.json` turns on the strict checks. The most important ones:

```json
"strict": true,
"noUncheckedIndexedAccess": true,
"exactOptionalPropertyTypes": true
```

`strict` is the one to never turn off. The other two catch the bugs strict mode still lets
through; you will meet both soon.

## Check it works

`npx vitest run streak` prints all tests passed, and `npm run streak -- list` shows your habit.

## Exercise

Run `npm run streak -- check read` twice. Read the second message. Where does it come from? Use
your editor's "find in files" to locate it.
