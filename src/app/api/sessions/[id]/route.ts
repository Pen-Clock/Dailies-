import { db } from '@/db'
import { sessions } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { NextRequest } from 'next/server'

// Helper: safely serialize BigInt from better-sqlite3
function safeJson(data: unknown) {
  return new Response(
    JSON.stringify(data, (_, v) => (typeof v === 'bigint' ? Number(v) : v)),
    { headers: { 'Content-Type': 'application/json' } }
  )
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ← Next.js 15: params is a Promise
) {
  const { id } = await params
  const body = await req.json()
  const [updated] = await db
    .update(sessions)
    .set(body)
    .where(eq(sessions.id, +id))
    .returning()
  return safeJson(updated)
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  await db.delete(sessions).where(eq(sessions.id, +id))
  return safeJson({ success: true })
}
