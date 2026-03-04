// src/app/api/tasks/route.ts
import { db } from '@/db'
import { tasks } from '@/db/schema'
import { eq, isNull } from 'drizzle-orm'
import { NextRequest } from 'next/server'

function safeJson(data: unknown) {
  return new Response(
    JSON.stringify(data, (_, v) => (typeof v === 'bigint' ? Number(v) : v)),
    { headers: { 'Content-Type': 'application/json' } }
  )
}

// GET /api/tasks?filter=active|completed|all
export async function GET(req: NextRequest) {
  const filter = req.nextUrl.searchParams.get('filter') ?? 'active'

  const all = await db.select().from(tasks).where(eq(tasks.isArchived, false))

  const result = filter === 'completed'
    ? all.filter((t) => t.completedAt !== null)
    : filter === 'all'
    ? all
    : all.filter((t) => t.completedAt === null)  // active (default)

  return safeJson(result)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const [task] = await db.insert(tasks).values({
    title: body.title,
    color: body.color ?? '#6366f1',
    icon:  body.icon  ?? '📌',
  }).returning()
  return safeJson(task)
}
