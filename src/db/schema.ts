// src/db/schema.ts
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core'

export const tasks = sqliteTable('tasks', {
  id:          integer('id').primaryKey({ autoIncrement: true }),
  title:       text('title').notNull(),
  color:       text('color').notNull().default('#6366f1'),
  icon:        text('icon').notNull().default('📌'),
  isArchived:  integer('is_archived', { mode: 'boolean' }).default(false),
  completedAt: text('completed_at'),   // ← new: null = active, set = done
  createdAt:   text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
})

export const sessions = sqliteTable('sessions', {
  id:          integer('id').primaryKey({ autoIncrement: true }),
  taskId:      integer('task_id').references(() => tasks.id),
  customLabel: text('custom_label'),
  startedAt:   text('started_at').notNull(),
  endedAt:     text('ended_at'),
})
