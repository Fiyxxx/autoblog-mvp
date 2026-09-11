'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export interface ToastItem {
  id: string
  message: string
}

export function useToasts() {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>())

  useEffect(
    () => () => {
      for (const timer of timers.current) clearTimeout(timer)
      timers.current.clear()
    },
    []
  )

  const push = useCallback((message: string) => {
    const id = crypto.randomUUID()
    setToasts((t) => [...t, { id, message }])
    const timer = setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
      timers.current.delete(timer)
    }, 4000)
    timers.current.add(timer)
  }, [])

  return { toasts, push }
}

export function ToastStack({ toasts }: { toasts: ToastItem[] }) {
  if (toasts.length === 0) return null

  return (
    <div aria-live="polite" className="fixed right-4 bottom-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="rounded-md bg-foreground px-4 py-2.5 text-sm text-background shadow-lg"
        >
          {t.message}
        </div>
      ))}
    </div>
  )
}
