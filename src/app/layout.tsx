import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, Geist, JetBrains_Mono } from 'next/font/google'

import { Shell } from '@/components/Shell'

import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const mono = JetBrains_Mono({ variable: '--font-jetbrains-mono', subsets: ['latin'] })
const bricolage = Bricolage_Grotesque({ variable: '--font-bricolage', subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'TypeScript Workshop · Types that catch bugs early',
    template: '%s · TypeScript Workshop',
  },
  description:
    'A hands-on TypeScript workshop. Build Streak, a small typed habit tracker and CLI, and learn types, unions, generics, safe parsing, errors as values and testing.',
}

export const viewport: Viewport = { themeColor: '#f6f8fc' }

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${mono.variable} ${bricolage.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only rounded-full bg-ink px-4 py-2 text-canvas focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50"
        >
          Skip to content
        </a>
        <Shell>{children}</Shell>
      </body>
    </html>
  )
}
