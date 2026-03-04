// src/components/Navbar.tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ActiveSessionBanner } from './ActiveSessionBanner'

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/timeline',  label: 'Timeline'  },
  { href: '/tasks',     label: 'Tasks'     },
]

export function Navbar() {
  const pathname = usePathname()
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <ActiveSessionBanner />
      <nav className="flex items-center justify-between px-6 py-4 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
        <Link href="/dashboard" className="text-lg font-bold tracking-tight text-white">
          DayDrift
        </Link>
        <div className="flex gap-6">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm transition-colors ${
                pathname === href ? 'text-white font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}
