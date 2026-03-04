'use client'
import { useState, useEffect } from 'react'
import { DashboardScene } from '../../components/dashboard/DashboardScene'

type Task = { id: number; title: string; color: string; icon: string }

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [ready, setReady] = useState(false)

useEffect(() => {
  fetch('/api/tasks?filter=active')   // ← was /api/tasks
    .then((r) => r.json())
    .then((data) => {
      setTasks(data)
      setReady(true)
    })
}, [])

  if (!ready) return (
    <div className="w-full h-screen flex items-center justify-center bg-zinc-950 text-zinc-500 text-sm">
      Loading...
    </div>
  )

  return <DashboardScene tasks={tasks} />
}
