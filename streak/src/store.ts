// Saving habits to a JSON file (chapter 07). The CLI only knows the Store interface, so tests can
// hand it an in-memory store instead.

import { readFile, writeFile } from 'node:fs/promises'

import { parseHabits } from './parse.js'
import { err, ok, type Result } from './result.js'
import type { Habit } from './types.js'

export interface Store {
  load(): Promise<Result<Habit[], string>>
  save(habits: readonly Habit[]): Promise<void>
}

function isMissingFile(error: unknown): boolean {
  return error instanceof Error && 'code' in error && error.code === 'ENOENT'
}

export function fileStore(path: string): Store {
  return {
    async load() {
      let text: string
      try {
        text = await readFile(path, 'utf8')
      } catch (error: unknown) {
        if (isMissingFile(error)) return ok([]) // no file yet: an empty list
        throw error
      }
      let data: unknown
      try {
        data = JSON.parse(text)
      } catch {
        return err(`${path} is not valid JSON`)
      }
      const parsed = parseHabits(data)
      return parsed.ok ? parsed : err(`${path}: ${parsed.error}`)
    },
    async save(habits) {
      await writeFile(path, `${JSON.stringify(habits, null, 2)}\n`)
    },
  }
}

export function memoryStore(initial: readonly Habit[] = []): Store & { habits: readonly Habit[] } {
  const store = {
    habits: initial,
    async load() {
      return ok([...store.habits])
    },
    async save(habits: readonly Habit[]) {
      store.habits = habits
    },
  }
  return store
}
