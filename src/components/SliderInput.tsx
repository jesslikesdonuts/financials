interface SliderInputProps {
  label: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step?: number
  suffix?: string
  prefix?: string
  hint?: string
}

export function SliderInput({ label, value, onChange, min, max, step = 1, suffix, prefix, hint }: SliderInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <label className="text-xs font-medium text-slate-600">{label}</label>
        <div className="flex items-center gap-1">
          {prefix && <span className="text-xs text-slate-500">{prefix}</span>}
          <input
            type="number"
            value={Number.isFinite(value) ? value : 0}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-24 rounded border border-slate-300 bg-slate-50 px-1.5 py-0.5 text-right text-sm text-slate-900 focus:border-blue-400 focus:outline-none"
          />
          {suffix && <span className="text-xs text-slate-500">{suffix}</span>}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={Math.min(Math.max(value, min), max)}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {hint && <p className="text-[11px] leading-tight text-slate-500">{hint}</p>}
    </div>
  )
}

export function CheckboxInput({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
  hint?: string
}) {
  return (
    <label className="flex cursor-pointer items-start gap-2 py-1">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-400"
      />
      <span>
        <span className="text-sm font-medium text-slate-800">{label}</span>
        {hint && <p className="text-[11px] leading-tight text-slate-500">{hint}</p>}
      </span>
    </label>
  )
}
