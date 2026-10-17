'use client'

import { useSyncExternalStore } from 'react'

// A small button that appears once you scroll down and takes you back to the top.

function subscribe(onChange: () => void) {
  window.addEventListener('scroll', onChange, { passive: true })
  return () => window.removeEventListener('scroll', onChange)
}

const isScrolled = () => window.scrollY > 600
const onServer = () => false

export function BackToTop() {
  const visible = useSyncExternalStore(subscribe, isScrolled, onServer)
  return (
    <button
      type="button"
      aria-label="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={() => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
      }}
      className={`card fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 grid size-11 place-items-center rounded-full transition-all duration-300 hover:bg-sun ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 19V5M5 12l7-7 7 7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}
