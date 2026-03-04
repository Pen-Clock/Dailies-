// src/app/api/tasks/[id]/route.ts
import { db } from '@/db'
import { tasks } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { NextRequest } from 'next/server'

function safeJson(data: unknown) {
  return new Response(
    JSON.stringify(data, (_, v) => (typeof v === 'bigint' ? Number(v) : v)),
    { headers: { 'Content-Type': 'application/json' } }
  )
}

// Mark as deleted
export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  await db.update(tasks).set({ isArchived: true }).where(eq(tasks.id, +id))
  return safeJson({ success: true })
}

// Generic patch (used for complete + restore)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()
  const [updated] = await db.update(tasks).set(body).where(eq(tasks.id, +id)).returning()
  return safeJson(updated)
}
