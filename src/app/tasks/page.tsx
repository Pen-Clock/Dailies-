// src/app/tasks/page.tsx
import { db } from '@/db'
import { tasks } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { TasksClient } from '@/components/tasks/TasksClient'

export const dynamic = 'force-dynamic'

export default async function TasksPage() {
  const allTasks = await db.select().from(tasks).where(eq(tasks.isArchived, false))
  return <TasksClient initialTasks={allTasks} />
}
