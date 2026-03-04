// src/components/dashboard/SessionModal.tsx
'use client'
import { useSessionStore } from '@/lib/store'
import { useState } from 'react'

type Task = { id: number; title: string; color: string; icon: string }

export function SessionModal({ task, onClose }: { task?: Task; onClose: () => void }) {
  const { setActiveSession } = useSessionStore()
  const [customLabel, setCustomLabel] = useState('')

  const handleStart = async () => {
    const label = task ? task.title : customLabel.trim()
    if (!task && !label) return

    const res = await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taskId:      task?.id      ?? null,
        customLabel: task ? null : label,
      }),
    })
    const session = await res.json()

    setActiveSession({
      id:        session.id,
      label,
      color:     task?.color ?? '#6366f1',
      icon:      task?.icon  ?? '✏️',
      startedAt: session.startedAt,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        {task ? (
          <div className="flex items-center gap-3 mb-5">
            <span className="text-3xl">{task.icon}</span>
            <div>
              <p className="text-xs text-zinc-400">Starting session</p>
              <h2 className="text-lg font-semibold text-white">{task.title}</h2>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-white mb-4">What are you doing?</h2>
            <input
              autoFocus
              type="text"
              value={customLabel}
              onChange={(e) => setCustomLabel(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleStart()}
              placeholder="e.g. Watching a lecture..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-zinc-500 mb-4"
            />
          </>
        )}

        <div className="flex gap-2 mt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white text-sm transition"
          >
            Cancel
          </button>
          <button
            onClick={handleStart}
            className="flex-1 py-2 rounded-lg text-sm font-medium text-white transition"
            style={{ backgroundColor: task?.color ?? '#6366f1' }}
          >
            Start
          </button>
        </div>
      </div>
    </div>
  )
}
