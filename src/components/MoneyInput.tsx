import type { Currency, Money } from '../types'

interface MoneyInputProps {
  label: string
  value: Money
  onChange: (value: Money) => void
  min?: number
  max?: number
  step?: number
  hint?: string
  suffix?: string
  hideSlider?: boolean
}

const SYMBOL: Record<Currency, string> = { GBP: '£', NZD: 'NZ$' }

export function MoneyInput({
  label,
  value,
  onChange,
  min = 0,
  max = 500000,
  step = 500,
  hint,
  suffix,
  hideSlider = false,
}: MoneyInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2">
        {label && <label className="text-xs font-medium text-slate-600">{label}</label>}
        <div className="flex flex-1 items-center justify-end gap-1">
          <span className="text-xs text-slate-500">{SYMBOL[value.currency]}</span>
          <input
            type="number"
            value={Number.isFinite(value.amount) ? value.amount : 0}
            onChange={(e) => onChange({ ...value, amount: Number(e.target.value) })}
            className="w-24 rounded border border-slate-300 bg-slate-50 px-1.5 py-0.5 text-right text-sm text-slate-900 focus:border-blue-400 focus:outline-none"
          />
          {suffix && <span className="text-xs text-slate-500">{suffix}</span>}
          <div className="flex overflow-hidden rounded border border-slate-300">
            {(['GBP', 'NZD'] as Currency[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onChange({ ...value, currency: c })}
                className={`px-1.5 py-0.5 text-[10px] font-semibold transition-colors ${
                  value.currency === c ? 'bg-blue-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-100'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>
      {!hideSlider && (
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={Math.min(Math.max(value.amount, min), max)}
          onChange={(e) => onChange({ ...value, amount: Number(e.target.value) })}
        />
      )}
      {hint && <p className="text-[11px] leading-tight text-slate-500">{hint}</p>}
    </div>
  )
}
