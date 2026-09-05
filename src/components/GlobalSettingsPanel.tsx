import { LIFE_AXES, LIFE_AXIS_LABELS } from '../types'
import type { Currency, GlobalSettings } from '../types'
import { SliderInput } from './SliderInput'

export function GlobalSettingsPanel({
  settings,
  onChange,
}: {
  settings: GlobalSettings
  onChange: (updater: (s: GlobalSettings) => GlobalSettings) => void
}) {
  const set = <K extends keyof GlobalSettings>(key: K, value: GlobalSettings[K]) => onChange((s) => ({ ...s, [key]: value }))

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="mb-3 text-sm font-semibold text-slate-900">Currency</h3>
        <div className="flex flex-col gap-3">
          <div>
            <p className="mb-1.5 text-xs font-medium text-slate-600">Global default display currency</p>
            <div className="flex gap-1.5">
              {(['GBP', 'NZD'] as Currency[]).map((c) => (
                <button
                  key={c}
                  onClick={() => set('displayCurrency', c)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    settings.displayCurrency === c ? 'border-blue-500 bg-blue-600 text-white' : 'border-slate-300 bg-white text-slate-600 hover:border-blue-300'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <SliderInput
            label="Exchange rate (1 GBP = ? NZD)"
            value={settings.gbpToNzdRate}
            onChange={(v) => set('gbpToNzdRate', v)}
            min={1}
            max={4}
            step={0.01}
            hint="Editable assumption — no live rate is fetched"
          />
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="mb-1 text-sm font-semibold text-slate-900">What matters to you</h3>
        <p className="mb-3 text-[11px] text-slate-500">Importance weighting used for the weighted life score in Compare</p>
        <div className="flex flex-col gap-3">
          {LIFE_AXES.map((axis) => (
            <SliderInput
              key={axis}
              label={LIFE_AXIS_LABELS[axis]}
              value={settings.axisWeights[axis]}
              onChange={(v) => set('axisWeights', { ...settings.axisWeights, [axis]: v })}
              min={0}
              max={10}
              step={1}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
