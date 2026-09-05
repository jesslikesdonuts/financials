import type { StressSettings } from '../types'
import { SliderInput } from './SliderInput'

export function StressTestPanel({
  stress,
  onChange,
}: {
  stress: StressSettings
  onChange: (updater: (s: StressSettings) => StressSettings) => void
}) {
  const set = <K extends keyof StressSettings>(key: K, value: StressSettings[K]) =>
    onChange((s) => ({ ...s, [key]: value }))

  return (
    <div className="rounded-lg border border-ink-700 bg-ink-900 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">Stress test</h3>
          <p className="text-[11px] text-slate-500">Applies to every scenario shown</p>
        </div>
        <button
          onClick={() => set('enabled', !stress.enabled)}
          className={`relative h-6 w-11 rounded-full transition-colors ${stress.enabled ? 'bg-blue-500' : 'bg-ink-600'}`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
              stress.enabled ? 'translate-x-5' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>

      <div className={`mt-4 flex flex-col gap-4 ${stress.enabled ? '' : 'pointer-events-none opacity-40'}`}>
        <SliderInput
          label="Mortgage rate shock"
          value={stress.rateShockPct}
          onChange={(v) => set('rateShockPct', v)}
          min={-2}
          max={8}
          step={0.25}
          suffix="pp"
        />
        <SliderInput
          label="Rental vacancy"
          value={stress.vacancyPct}
          onChange={(v) => set('vacancyPct', v)}
          min={0}
          max={100}
          step={5}
          suffix="%"
        />
        <SliderInput
          label="Property price change"
          value={stress.propertyPriceChangePct}
          onChange={(v) => set('propertyPriceChangePct', v)}
          min={-40}
          max={40}
          step={1}
          suffix="%"
        />
        <SliderInput
          label="Employment income loss"
          value={stress.incomeLossPct}
          onChange={(v) => set('incomeLossPct', v)}
          min={0}
          max={100}
          step={5}
          suffix="%"
          hint="100% = full job loss"
        />
      </div>
    </div>
  )
}
