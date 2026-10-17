// The command line (chapter 10). `run` does the work and returns text, so it is easy to test;
// the bottom of the file connects it to the real terminal and a real file.

import { pathToFileURL } from 'node:url'
import { parseArgs } from 'node:util'

import { isDay, toDay } from './days.js'
import { addHabit, checkIn, describe, explain, findById } from './habits.js'
import { fileStore, type Store } from './store.js'
import type { Day, Frequency } from './types.js'

export interface Outcome {
  code: number
  output: string
}

const HELP = `Streak: keep your habits going.

  streak add <name> [--emoji 📚] [--weekly 3]
  streak check <id> [--day YYYY-MM-DD]
  streak list`

const fail = (output: string): Outcome => ({ code: 1, output })

export async function run(args: readonly string[], store: Store, today: Day): Promise<Outcome> {
  let parsed
  try {
    parsed = parseArgs({
      args: [...args],
      allowPositionals: true,
      options: { emoji: { type: 'string' }, weekly: { type: 'string' }, day: { type: 'string' } },
    })
  } catch (error: unknown) {
    return fail(error instanceof Error ? error.message : 'Could not read the arguments.')
  }
  const [command, ...rest] = parsed.positionals
  const { emoji, weekly, day } = parsed.values

  const loaded = await store.load()
  if (!loaded.ok) return fail(loaded.error)
  const habits = loaded.value

  switch (command) {
    case 'add': {
      const frequency: Frequency | undefined =
        weekly === undefined ? undefined : { kind: 'weekly', timesPerWeek: Number(weekly) }
      const added = addHabit(
        habits,
        { name: rest.join(' '), ...(emoji ? { emoji } : {}), ...(frequency ? { frequency } : {}) },
        today,
      )
      if (!added.ok) return fail(added.error)
      await store.save(added.value)
      const habit = added.value.at(-1)
      return { code: 0, output: `Added ${habit?.emoji} ${habit?.name} (id: ${habit?.id})` }
    }
    case 'check': {
      const habit = findById(habits, rest[0] ?? '')
      if (!habit) return fail(`No habit with id "${rest[0] ?? ''}". Run "streak list".`)
      const when = day ?? today
      if (!isDay(when)) return fail(`"${when}" is not a day like 2026-10-17.`)
      const checked = checkIn(habit, when, today)
      if (!checked.ok) return fail(explain(checked.error))
      await store.save(habits.map((h) => (h.id === habit.id ? checked.value : h)))
      return { code: 0, output: describe(checked.value, today) }
    }
    case 'list':
      return {
        code: 0,
        output: habits.length
          ? habits.map((habit) => `${habit.id.padEnd(14)} ${describe(habit, today)}`).join('\n')
          : 'No habits yet. Try: streak add Read --emoji 📚',
      }
    default:
      return { code: command === undefined ? 0 : 1, output: HELP }
  }
}

// Only runs when this file is started directly (node streak/dist/cli.js), not when imported.
const entry = process.argv[1]
if (entry && import.meta.url === pathToFileURL(entry).href) {
  const store = fileStore(process.env.STREAK_FILE ?? 'habits.json')
  const outcome = await run(process.argv.slice(2), store, toDay(new Date()))
  console.log(outcome.output)
  process.exitCode = outcome.code
}
