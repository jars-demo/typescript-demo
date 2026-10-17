'use client'

import { useState } from 'react'

import type { Example } from '@/lib/site'

// The hero toy: broken code with a red squiggle and the real tsc error. Press "Fix it" and Tee
// cheers. Every change is driven by a click; nothing moves on its own.

function Code({ source }: { source: string }) {
  const parts = source.split(/\[\[(.*?)\]\]/)
  return (
    <code>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="squiggle" data-testid="squiggle">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </code>
  )
}

export function Tee({ happy }: { happy: boolean }) {
  return (
    <svg
      viewBox="0 0 120 120"
      role="img"
      aria-label={happy ? 'Tee is happy: no type errors' : 'Tee is worried: one type error'}
      className={`tee h-24 w-24 shrink-0 sm:h-28 sm:w-28 ${happy ? 'happy' : ''}`}
      key={happy ? 'happy' : 'worried'}
    >
      <ellipse cx="60" cy="112" rx="30" ry="5" fill="rgb(15 23 42 / 0.12)" />
      <rect
        x="22"
        y="22"
        width="76"
        height="80"
        rx="24"
        fill="#3178c6"
        stroke="#0f172a"
        strokeWidth="3"
      />
      <path
        d="M14 46q-6 0-6 8v4q0 5-5 5q5 0 5 5v4q0 8 6 8M106 46q6 0 6 8v4q0 5 5 5q-5 0-5 5v4q0 8-6 8"
        fill="none"
        stroke="#0f172a"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g className="eyes">
        <circle cx="47" cy="56" r="8" fill="#fff" stroke="#0f172a" strokeWidth="2" />
        <circle cx="73" cy="56" r="8" fill="#fff" stroke="#0f172a" strokeWidth="2" />
        <circle cx={happy ? 48 : 46} cy={happy ? 55 : 58} r="3.6" fill="#0f172a" />
        <circle cx={happy ? 74 : 72} cy={happy ? 55 : 58} r="3.6" fill="#0f172a" />
      </g>
      {happy ? (
        <path
          d="M48 74q12 12 24 0"
          fill="#fff"
          stroke="#0f172a"
          strokeWidth="3"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M49 80q11-7 22 0"
          fill="none"
          stroke="#0f172a"
          strokeWidth="3"
          strokeLinecap="round"
        />
      )}
      <circle cx="36" cy="72" r="4" fill="#ff9fb8" opacity="0.8" />
      <circle cx="84" cy="72" r="4" fill="#ff9fb8" opacity="0.8" />
    </svg>
  )
}

export function TypeToy({ examples }: { examples: Example[] }) {
  const [index, setIndex] = useState(0)
  const [fixed, setFixed] = useState(false)
  const example = examples[index] ?? examples[0]
  if (!example) return null

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div role="tablist" aria-label="Examples" className="flex flex-wrap gap-2">
        {examples.map((item, i) => (
          <button
            key={item.label}
            type="button"
            role="tab"
            aria-selected={i === index}
            onClick={() => {
              setIndex(i)
              setFixed(false)
            }}
            className={`h-9 rounded-full border-2 border-ink px-3.5 text-[13px] font-semibold transition-colors ${
              i === index ? 'bg-sun text-ink' : 'bg-surface text-ink-2 hover:bg-surface-2'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="card min-w-0 overflow-hidden rounded-panel" role="tabpanel">
        <div className="flex items-center justify-between gap-2 border-b-2 border-ink bg-surface-2 px-4 py-2">
          <span className="font-mono text-[12px] text-ink-2">example.ts</span>
          <span
            className={`rounded-full px-2.5 py-0.5 font-mono text-[12px] font-semibold ${
              fixed ? 'bg-[#dcf5e8] text-good' : 'bg-[#fde2e2] text-bad'
            }`}
          >
            {fixed ? '✓ 0 errors' : '✕ 1 error'}
          </span>
        </div>
        <pre
          key={`${index}-${fixed}`}
          className="pop overflow-x-auto bg-[#0f172a] px-4 py-4 font-mono text-[13.5px] leading-relaxed text-[#e2e8f0]"
        >
          <Code source={fixed ? example.fixed : example.broken} />
        </pre>
        <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p aria-live="polite" className="min-w-0 font-mono text-[12.5px] leading-snug">
            {fixed ? (
              <span className="text-good">Type-checks. Ship it.</span>
            ) : (
              <span className="text-bad">{example.error}</span>
            )}
          </p>
          <button
            type="button"
            onClick={() => setFixed((value) => !value)}
            className="lift h-10 shrink-0 rounded-full border-2 border-ink bg-accent px-5 text-sm font-semibold text-white shadow-[3px_3px_0_var(--ink)]"
          >
            {fixed ? 'Break it again' : 'Fix it'}
          </button>
        </div>
      </div>
      <div className="flex items-end gap-3">
        <Tee happy={fixed} />
        <p className="card relative mb-6 rounded-2xl rounded-bl-sm px-4 py-2.5 text-[14px] font-medium">
          {fixed
            ? 'Yay! Caught before it ever ran.'
            : 'Psst. TypeScript spotted this before you pressed run.'}
        </p>
      </div>
    </div>
  )
}
