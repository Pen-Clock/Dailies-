// src/lib/store.ts
'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ActiveSession = {
  id: number
  label: string
  color: string
  icon: string
  startedAt: string
}

type SessionStore = {
  activeSession: ActiveSession | null
  setActiveSession: (s: ActiveSession | null) => void
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set) => ({
      activeSession: null,
      setActiveSession: (s) => set({ activeSession: s }),
    }),
    { name: 'daydrift-active-session' }
  )
)
