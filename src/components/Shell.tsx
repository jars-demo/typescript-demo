import Link from 'next/link'

import { REPO_URL } from '@/lib/site'

import { BackToTop } from './BackToTop'

// Navigation and footer, shared by every page.

export function LogoMark({ size = 30 }: { size?: number }) {
  // Curly braces around a dot: a tiny Tee.
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect
        x="1"
        y="1"
        width="30"
        height="30"
        rx="9"
        fill="#3178c6"
        stroke="#0f172a"
        strokeWidth="2"
      />
      <path
        d="M12 9q-3 0-3 3v2q0 2-2 2q2 0 2 2v2q0 3 3 3M20 9q3 0 3 3v2q0 2 2 2q-2 0-2 2v2q0 3-3 3"
        fill="none"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="16" r="2.4" fill="#ffd84d" />
    </svg>
  )
}

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="px-3 pt-4 sm:px-4">
        <nav
          aria-label="Main"
          className="card mx-auto flex h-14 max-w-5xl items-center justify-between gap-2 rounded-full pr-2 pl-3"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 rounded-full font-display text-[18px] font-bold tracking-[-0.02em]"
          >
            <LogoMark />
            <span className="hidden sm:inline">TypeScript Workshop</span>
          </Link>
          <ul className="flex items-center gap-1">
            <li>
              <Link
                href="/workshop"
                className="inline-flex h-9 items-center rounded-full px-3 text-sm font-semibold text-ink-2 hover:bg-surface-2 hover:text-ink"
              >
                Workshop
              </Link>
            </li>
            <li>
              <a
                href={REPO_URL}
                className="inline-flex h-9 items-center rounded-full bg-ink px-4 text-sm font-semibold text-canvas hover:bg-accent"
              >
                GitHub
              </a>
            </li>
          </ul>
        </nav>
      </header>
      <main id="main" className="flex-1">
        {children}
      </main>
      <footer className="border-t-2 border-ink bg-surface">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex items-center gap-2">
            <LogoMark size={22} />
            TypeScript Workshop, a JARS Demo workshop
          </span>
          <span>
            MIT licensed ·{' '}
            <a className="hover:text-ink" href={REPO_URL}>
              GitHub
            </a>
          </span>
        </div>
      </footer>
      <BackToTop />
    </>
  )
}
