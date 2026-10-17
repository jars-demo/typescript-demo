import Link from 'next/link'

import { CodeBlock } from '@/components/CopyButton'
import { TypeToy } from '@/components/TypeToy'
import { EXAMPLES, LEARN, QUICKSTART, REPO_URL, SESSION } from '@/lib/site'
import { CHAPTERS } from '@/lib/workshop'

const STICKERS = ['bg-sun', 'bg-mint', 'bg-pink', 'bg-accent-wash']

export default function Home() {
  const minutes = CHAPTERS.reduce((sum, chapter) => sum + chapter.minutes, 0)
  const hours = Math.round((minutes / 60) * 2) / 2

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-24 px-4 pt-12 pb-24 sm:pt-16">
      <section className="grid items-start gap-12 lg:grid-cols-[1fr_1.05fr]">
        <div className="flex min-w-0 flex-col gap-6 lg:pt-6">
          <span className="rise w-fit -rotate-2 rounded-full border-2 border-ink bg-mint px-3 py-1 text-[13px] font-semibold">
            Free workshop · {CHAPTERS.length} chapters · about {hours} hours
          </span>
          <h1
            className="rise font-display text-[3.1rem] leading-[0.98] font-extrabold tracking-[-0.04em] text-balance sm:text-[4.3rem]"
            style={{ '--delay': '80ms' } as React.CSSProperties}
          >
            Types that <em className="mark">catch bugs</em> before your users do.
          </h1>
          <p
            className="rise max-w-lg text-[18px] leading-relaxed text-ink-2"
            style={{ '--delay': '160ms' } as React.CSSProperties}
          >
            Learn TypeScript by building <strong className="text-ink">Streak</strong>, a small habit
            tracker you run from your terminal. Real code, short chapters, and a test suite that has
            your back.
          </p>
          <div
            className="rise flex flex-wrap gap-3"
            style={{ '--delay': '240ms' } as React.CSSProperties}
          >
            <Link
              href="/workshop/01-why-typescript"
              className="card lift inline-flex h-12 items-center rounded-full bg-accent! px-6 text-[15px] font-semibold text-white"
            >
              Start the workshop
            </Link>
            <a
              href={REPO_URL}
              className="card lift inline-flex h-12 items-center rounded-full px-6 text-[15px] font-semibold"
            >
              View the code
            </a>
          </div>
        </div>
        <div className="rise min-w-0" style={{ '--delay': '200ms' } as React.CSSProperties}>
          <TypeToy examples={EXAMPLES} />
        </div>
      </section>

      <section className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div className="flex min-w-0 flex-col gap-4">
          <h2 className="font-display text-5xl leading-none font-extrabold tracking-[-0.03em]">
            Meet <em className="mark">Streak.</em>
          </h2>
          <p className="text-[17px] leading-relaxed text-ink-2">
            Add a habit, check in each day, keep the streak alive. Small enough to build in an
            afternoon, real enough to use tomorrow morning: it saves to a file, refuses bad input
            with a clear message, and is covered by tests.
          </p>
        </div>
        <div className="card min-w-0 overflow-hidden rounded-panel">
          <div className="flex items-center gap-1.5 border-b-2 border-ink bg-surface-2 px-4 py-2.5">
            <span className="size-3 rounded-full border-2 border-ink bg-pink" />
            <span className="size-3 rounded-full border-2 border-ink bg-sun" />
            <span className="size-3 rounded-full border-2 border-ink bg-mint" />
            <span className="ml-2 font-mono text-[12px] text-ink-2">terminal</span>
          </div>
          <pre className="overflow-x-auto bg-[#0f172a] px-4 py-4 font-mono text-[13px] leading-relaxed text-[#e2e8f0]">
            <code>{SESSION}</code>
          </pre>
        </div>
      </section>

      <section className="flex flex-col gap-8">
        <h2 className="max-w-2xl font-display text-5xl leading-none font-extrabold tracking-[-0.03em]">
          What you will <em className="mark">learn.</em>
        </h2>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {LEARN.map((item, i) => (
            <li
              key={item.title}
              className={`card flex flex-col gap-2 rounded-panel p-6 ${i % 2 ? 'rotate-[0.6deg]' : '-rotate-[0.6deg]'}`}
            >
              <span
                className={`grid size-9 place-items-center rounded-full border-2 border-ink font-display font-bold ${STICKERS[i % STICKERS.length]}`}
              >
                {i + 1}
              </span>
              <span className="text-[17px] font-semibold tracking-tight">{item.title}</span>
              <span className="text-[15px] leading-relaxed text-ink-2">{item.body}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-5xl leading-none font-extrabold tracking-[-0.03em]">
            {CHAPTERS.length} short <em className="mark">chapters.</em>
          </h2>
          <Link href="/workshop" className="text-[15px] font-semibold text-accent-text underline">
            See them all
          </Link>
        </div>
        <ol className="grid gap-4 sm:grid-cols-2">
          {CHAPTERS.map((chapter) => (
            <li key={chapter.slug}>
              <Link
                href={`/workshop/${chapter.slug}`}
                className="card lift flex h-full items-center gap-4 rounded-card p-4"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl border-2 border-ink bg-accent font-display text-lg font-bold text-white">
                  {chapter.number}
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="text-[15px] font-semibold tracking-tight">{chapter.title}</span>
                  <span className="text-[13px] text-muted">{chapter.minutes} minutes</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="card grid gap-8 rounded-panel bg-sun! p-6 sm:p-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <div className="flex min-w-0 flex-col gap-4">
          <h2 className="font-display text-5xl leading-none font-extrabold tracking-[-0.03em]">
            Running in a minute.
          </h2>
          <p className="text-[16px] leading-relaxed text-ink">
            You need Node.js 22 and git. Clone, install, and watch the tests go green. Chapter 02
            has the full setup.
          </p>
        </div>
        <div className="min-w-0">
          <CodeBlock code={QUICKSTART} />
        </div>
      </section>
    </div>
  )
}
