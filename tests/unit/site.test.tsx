import fs from 'node:fs'
import path from 'node:path'

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { TypeToy } from '@/components/TypeToy'
import { EXAMPLES } from '@/lib/site'
import { CHAPTERS, findChapter } from '@/lib/workshop'

describe('workshop chapters', () => {
  it('has ten chapters numbered in order', () => {
    expect(CHAPTERS.map((chapter) => chapter.number)).toEqual(
      Array.from({ length: 10 }, (_, i) => String(i + 1).padStart(2, '0')),
    )
  })

  it.each(CHAPTERS.map((chapter) => [chapter.slug, chapter] as const))(
    '%s has a title, summary, time and the standard sections',
    (_slug, chapter) => {
      expect(chapter.summary.length).toBeGreaterThan(10)
      expect(chapter.minutes).toBeGreaterThan(0)
      expect(chapter.body).toMatch(/^## Goal$/m)
      expect(chapter.body).toMatch(/^## Check it works$/m)
      expect(chapter.body).toMatch(/^## Exercise$/m)
    },
  )

  it('finds chapters by slug', () => {
    expect(findChapter('05-unions')?.title).toBe('Unions and narrowing')
    expect(findChapter('nope')).toBeUndefined()
  })

  it('every file a chapter mentions exists', () => {
    const mentioned = new Set<string>()
    for (const chapter of CHAPTERS) {
      for (const match of chapter.body.matchAll(/\bstreak\/(?:src|test)\/[\w.-]+\.ts\b/g)) {
        mentioned.add(match[0])
      }
    }
    expect(mentioned.size).toBeGreaterThan(6)
    mentioned.delete('streak/src/play.ts') // chapter 03 asks you to create it
    for (const file of mentioned) {
      expect(fs.existsSync(path.join(process.cwd(), file)), `${file} is missing`).toBe(true)
    }
  })
})

describe('TypeToy', () => {
  afterEach(cleanup)

  it('shows the error, then fixes it on request', () => {
    render(<TypeToy examples={EXAMPLES} />)
    expect(screen.getByText('✕ 1 error')).toBeDefined()
    expect(screen.getByTestId('squiggle').textContent).toBe('42')
    expect(screen.getByRole('img', { name: /worried/ })).toBeDefined()

    fireEvent.click(screen.getByRole('button', { name: 'Fix it' }))

    expect(screen.getByText('✓ 0 errors')).toBeDefined()
    expect(screen.queryByTestId('squiggle')).toBeNull()
    expect(screen.getByRole('img', { name: /happy/ })).toBeDefined()
  })

  it('switches examples and starts them broken', () => {
    render(<TypeToy examples={EXAMPLES} />)
    fireEvent.click(screen.getByRole('button', { name: 'Fix it' }))
    fireEvent.click(screen.getByRole('tab', { name: 'Typo' }))

    expect(screen.getByText("Property 'nmae' does not exist on type 'User'.")).toBeDefined()
    expect(screen.getByTestId('squiggle').textContent).toBe('nmae')
  })
})
