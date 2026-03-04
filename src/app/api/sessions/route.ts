// src/app/api/sessions/route.ts
import { db } from '@/db'
import { sessions } from '@/db/schema'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const [session] = await db.insert(sessions).values({
    taskId:      body.taskId      ?? null,
    customLabel: body.customLabel ?? null,
    startedAt:   new Date().toISOString(),
  }).returning()
  return Response.json(session)
}
