// src/app/timeline/page.tsx
import { db } from '@/db'
import { sessions, tasks } from '@/db/schema'
import { desc, eq, sql } from 'drizzle-orm'
import { formatDuration, formatTime, formatDate } from '@/lib/duration'

export const dynamic = 'force-dynamic'

export default async function TimelinePage() {
  const rows = await db
    .select({
      id:          sessions.id,
      taskTitle:   tasks.title,
      taskColor:   tasks.color,
      taskIcon:    tasks.icon,
      customLabel: sessions.customLabel,
      startedAt:   sessions.startedAt,
      endedAt:     sessions.endedAt,
      date:        sql<string>`strftime('%Y-%m-%d', ${sessions.startedAt})`,
    })
    .from(sessions)
    .leftJoin(tasks, eq(sessions.taskId, tasks.id))
    .orderBy(desc(sessions.startedAt))

  const grouped: Record<string, typeof rows> = {}
  for (const row of rows) {
    if (!grouped[row.date]) grouped[row.date] = []
    grouped[row.date].push(row)
  }
  const dates = Object.keys(grouped)

  return (
    <main className="max-w-2xl mx-auto px-4 pt-28 pb-16">
      <h1 className="text-2xl font-bold mb-8">My Timeline</h1>

      {dates.length === 0 && (
        <p className="text-zinc-500 text-sm">No sessions yet — start one from the dashboard!</p>
      )}

      <div className="flex flex-col gap-12">
        {dates.map((date) => {
          const daySessions = grouped[date]
          const totalMins = daySessions.reduce((acc, s) => {
            if (!s.endedAt) return acc
            return acc + Math.floor(
              (new Date(s.endedAt).getTime() - new Date(s.startedAt).getTime()) / 60000
            )
          }, 0)

          return (
            <div key={date}>
              {/* Day header */}
              <div className="flex items-center gap-3 mb-5">
                <span className="text-sm font-semibold text-zinc-300 whitespace-nowrap">
                  {formatDate(date)}
                </span>
                <div className="flex-1 h-px bg-zinc-800" />
                <span className="text-xs text-zinc-500 whitespace-nowrap">
                  {totalMins >= 60
                    ? `${Math.floor(totalMins / 60)}h ${totalMins % 60}m`
                    : `${totalMins}m`} total
                </span>
              </div>

              {/* Sessions */}
              <div className="relative ml-3">
                <div className="absolute left-0 top-2 bottom-2 w-px bg-zinc-800" />
                <div className="flex flex-col gap-3">
                  {daySessions.map((s) => {
                    const label = s.taskTitle ?? s.customLabel ?? 'Unknown'
                    const color = s.taskColor ?? '#71717a'
                    const icon  = s.taskIcon  ?? '🔹'
                    const isLive = !s.endedAt

                    return (
                      <div key={s.id} className="relative pl-6">
                        <span
                          className={`absolute -left-[-5px] top-4 w-2.5 h-2.5 rounded-full border-2 border-zinc-950 ${isLive ? 'animate-pulse' : ''}`}
                          style={{ backgroundColor: color }}
                        />
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 flex items-center justify-between gap-4 hover:border-zinc-700 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{icon}</span>
                            <div>
                              <p className="text-sm font-medium text-white">{label}</p>
                              <p className="text-xs text-zinc-500">
                                {formatTime(s.startedAt)}
                                {s.endedAt && ` → ${formatTime(s.endedAt)}`}
                              </p>
                            </div>
                          </div>
                          <span
                            className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
                            style={{ backgroundColor: `${color}22`, color }}
                          >
                            {formatDuration(s.startedAt, s.endedAt)}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}
