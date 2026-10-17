import { mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { run } from '../src/cli.js'
import { parseHabits } from '../src/parse.js'
import { fileStore, memoryStore } from '../src/store.js'
import type { Day } from '../src/types.js'

const TODAY: Day = '2026-10-17'

describe('the streak command', () => {
  it('adds, checks in and lists habits', async () => {
    const store = memoryStore()

    expect(await run(['add', 'Read', '--emoji', '📚'], store, TODAY)).toEqual({
      code: 0,
      output: 'Added 📚 Read (id: read)',
    })
    expect((await run(['check', 'read'], store, TODAY)).output).toBe(
      '📚 Read (daily): 1 day in a row',
    )
    expect((await run(['list'], store, TODAY)).output).toContain('read')
  })

  it('fails with a helpful message', async () => {
    const store = memoryStore()

    expect(await run(['check', 'nope'], store, TODAY)).toEqual({
      code: 1,
      output: 'No habit with id "nope". Run "streak list".',
    })
    expect((await run(['add', 'Run', '--weekly', 'lots'], store, TODAY)).code).toBe(1)
    expect((await run(['add', 'Run', '--colour', 'red'], store, TODAY)).code).toBe(1)
    expect((await run(['dance'], store, TODAY)).code).toBe(1)
  })

  it('refuses bad days', async () => {
    const store = memoryStore()
    await run(['add', 'Read'], store, TODAY)

    expect((await run(['check', 'read', '--day', '2026-13-01'], store, TODAY)).code).toBe(1)
    expect((await run(['check', 'read', '--day', '2026-10-18'], store, TODAY)).output).toBe(
      '2026-10-18 has not happened yet.',
    )
  })
})

describe('the file store', () => {
  it('starts empty, then round-trips through JSON', async () => {
    const path = join(await mkdtemp(join(tmpdir(), 'streak-')), 'habits.json')
    const store = fileStore(path)

    expect(await store.load()).toEqual({ ok: true, value: [] })
    await run(['add', 'Read'], store, TODAY)
    const saved: unknown = JSON.parse(await readFile(path, 'utf8'))
    expect(parseHabits(saved).ok).toBe(true)
  })

  it('reports a broken file instead of crashing', async () => {
    const path = join(await mkdtemp(join(tmpdir(), 'streak-')), 'habits.json')
    await writeFile(path, '{ not json')

    const loaded = await fileStore(path).load()
    expect(loaded.ok).toBe(false)
  })
})

describe('parseHabits', () => {
  it('names the first problem it finds', () => {
    expect(parseHabits({})).toEqual({ ok: false, error: 'the file should hold a list of habits' })
    expect(
      parseHabits([
        {
          id: 'read',
          name: 'Read',
          emoji: '📚',
          frequency: { kind: 'hourly' },
          createdOn: TODAY,
          checkIns: [],
        },
      ]),
    ).toEqual({ ok: false, error: 'habit 1 has an unknown frequency' })
  })
})
