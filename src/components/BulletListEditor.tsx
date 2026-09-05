interface BulletListEditorProps {
  label: string
  items: string[]
  onChange: (items: string[]) => void
  placeholder?: string
  accent?: string
}

export function BulletListEditor({ label, items, onChange, placeholder, accent = 'text-slate-400' }: BulletListEditorProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-xs font-medium text-slate-600">{label}</p>
      <div className="flex flex-col gap-1.5">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className={accent}>•</span>
            <input
              value={item}
              onChange={(e) => onChange(items.map((it, idx) => (idx === i ? e.target.value : it)))}
              placeholder={placeholder}
              className="min-w-0 flex-1 rounded border border-slate-300 bg-slate-50 px-2 py-1 text-sm text-slate-900 focus:border-blue-400 focus:outline-none"
            />
            <button
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              className="rounded px-1.5 py-1 text-xs text-rose-600 hover:bg-rose-50"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={() => onChange([...items, ''])}
        className="self-start rounded border border-slate-300 px-3 py-1 text-xs font-medium text-slate-600 hover:border-blue-400 hover:text-blue-600"
      >
        + Add
      </button>
    </div>
  )
}
