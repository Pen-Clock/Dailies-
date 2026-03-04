// src/components/ActiveSessionBanner.tsx
'use client'
import { useSessionStore } from '@/lib/store'
import { useEffect, useState } from 'react'

export function ActiveSessionBanner() {
  const { activeSession, setActiveSession } = useSessionStore()
  const [elapsed, setElapsed] = useState('')

  useEffect(() => {
    if (!activeSession) return
    const tick = () => {
      const ms   = Date.now() - new Date(activeSession.startedAt).getTime()
      const mins = Math.floor(ms / 60000)
      const secs = Math.floor((ms % 60000) / 1000)
      setElapsed(`${mins}m ${secs}s`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [activeSession])

  if (!activeSession) return null

  const handleStop = async () => {
    await fetch(`/api/sessions/${activeSession.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endedAt: new Date().toISOString() }),
    })
    setActiveSession(null)
  }

  return (
    <div
      className="w-full py-2 px-6 flex items-center justify-between text-sm"
      style={{ backgroundColor: `${activeSession.color}22`, borderBottom: `1px solid ${activeSession.color}44` }}
    >
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: activeSession.color }} />
        <span className="text-white font-medium">{activeSession.icon} {activeSession.label}</span>
        <span className="text-zinc-400">· {elapsed}</span>
      </div>
      <button
        onClick={handleStop}
        className="text-xs px-3 py-1 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white transition"
      >
        Stop
      </button>
    </div>
  )
}
