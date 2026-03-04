// src/components/tasks/TasksClient.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Task = {
  id: number
  title: string
  color: string
  icon: string
  completedAt: string | null
}

const COLORS = ['#6366f1','#ec4899','#f59e0b','#10b981','#3b82f6','#8b5cf6','#ef4444','#14b8a6']
const ICONS  = ['📌','💻','📚','🎮','✏️','🏃','🎵','🍽️','💡','🔬','🎨','🧘','🎯','⚽','🛠️']

export function TasksClient({ initialTasks }: { initialTasks: Task[] }) {
  const router = useRouter()
  const [tasks, setTasks]   = useState(initialTasks)
  const [tab, setTab]       = useState<'active' | 'finished'>('active')
  const [title, setTitle]   = useState('')
  const [color, setColor]   = useState('#6366f1')
  const [icon, setIcon]     = useState('📌')
  const [loading, setLoading] = useState(false)

  const active   = tasks.filter((t) => !t.completedAt)
  const finished = tasks.filter((t) =>  t.completedAt)

  const handleAdd = async () => {
    if (!title.trim()) return
    setLoading(true)
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.trim(), color, icon }),
    })
    const task = await res.json()
    setTasks((prev) => [...prev, task])
    setTitle('')
    setLoading(false)
    router.refresh()
  }

  const handleComplete = async (id: number) => {
    await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completedAt: new Date().toISOString() }),
    })
    setTasks((prev) =>
      prev.map((t) => t.id === id ? { ...t, completedAt: new Date().toISOString() } : t)
    )
    router.refresh()
  }

  const handleRestore = async (id: number) => {
    await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completedAt: null }),
    })
    setTasks((prev) =>
      prev.map((t) => t.id === id ? { ...t, completedAt: null } : t)
    )
    router.refresh()
  }

  const handleDelete = async (id: number) => {
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
    setTasks((prev) => prev.filter((t) => t.id !== id))
    router.refresh()
  }

  return (
    <main className="max-w-2xl mx-auto px-4 pt-28 pb-16">
      <h1 className="text-2xl font-bold mb-8">Manage Tasks</h1>

      {/* Add Task Form */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-8">
        <h2 className="text-sm font-semibold text-zinc-400 mb-4">New Task</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Task name..."
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-zinc-500 mb-4"
        />

        <p className="text-xs text-zinc-500 mb-2">Icon</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {ICONS.map((i) => (
            <button key={i} onClick={() => setIcon(i)}
              className={`text-xl p-1.5 rounded-lg transition ${icon === i ? 'bg-zinc-700 ring-1 ring-zinc-500' : 'hover:bg-zinc-800'}`}>
              {i}
            </button>
          ))}
        </div>

        <p className="text-xs text-zinc-500 mb-2">Color</p>
        <div className="flex gap-2 mb-5">
          {COLORS.map((c) => (
            <button key={c} onClick={() => setColor(c)}
              className={`w-7 h-7 rounded-full transition ${color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-zinc-900' : ''}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        <button onClick={handleAdd} disabled={loading || !title.trim()}
          className="w-full py-2 rounded-lg text-white text-sm font-semibold transition disabled:opacity-40"
          style={{ backgroundColor: color }}>
          {loading ? 'Adding...' : '+ Add Task'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-1 mb-6 w-fit">
        {(['active', 'finished'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition capitalize ${
              tab === t ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'
            }`}>
            {t === 'active' ? `Active (${active.length})` : `Finished (${finished.length})`}
          </button>
        ))}
      </div>

      {/* Active Tasks */}
      {tab === 'active' && (
        <div className="flex flex-col gap-3">
          {active.length === 0 && (
            <p className="text-zinc-500 text-sm">No active tasks. Add one above!</p>
          )}
          {active.map((task) => (
            <div key={task.id}
              className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">{task.icon}</span>
                <span className="text-sm text-white">{task.title}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: task.color }} />
                <button onClick={() => handleComplete(task.id)}
                  className="text-xs px-3 py-1 rounded-full bg-emerald-900/40 text-emerald-400 hover:bg-emerald-900/70 transition">
                  ✓ Complete
                </button>
                <button onClick={() => handleDelete(task.id)}
                  className="text-xs text-zinc-500 hover:text-red-400 transition">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Finished Tasks */}
      {tab === 'finished' && (
        <div className="flex flex-col gap-3">
          {finished.length === 0 && (
            <p className="text-zinc-500 text-sm">No completed tasks yet.</p>
          )}
          {finished.map((task) => (
            <div key={task.id}
              className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 opacity-70">
              <div className="flex items-center gap-3">
                <span className="text-xl">{task.icon}</span>
                <div>
                  <p className="text-sm text-zinc-400 line-through">{task.title}</p>
                  <p className="text-xs text-zinc-600">
                    Completed {new Date(task.completedAt!).toLocaleDateString('en-AU', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => handleRestore(task.id)}
                  className="text-xs px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition">
                  ↩ Restore
                </button>
                <button onClick={() => handleDelete(task.id)}
                  className="text-xs text-zinc-500 hover:text-red-400 transition">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
