import { useState, type ReactNode } from 'react'

export function Section({
  title,
  subtitle,
  children,
  defaultOpen = true,
  accessory,
}: {
  title: string
  subtitle?: string
  children: ReactNode
  defaultOpen?: boolean
  accessory?: ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-lg border border-ink-700 bg-ink-900">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <div>
          <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3">
          {accessory}
          <span className={`text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`}>⌄</span>
        </div>
      </button>
      {open && <div className="grid grid-cols-1 gap-4 border-t border-ink-700 px-4 py-4 sm:grid-cols-2">{children}</div>}
    </div>
  )
}
