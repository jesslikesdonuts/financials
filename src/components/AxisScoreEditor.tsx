import { getAxisScore, isAxisOverridden } from '../calculations'
import { LIFE_AXES, LIFE_AXIS_LABELS } from '../types'
import type { Scenario } from '../types'

export function AxisScoreEditor({
  scenario,
  onChange,
}: {
  scenario: Scenario
  onChange: (axis: (typeof LIFE_AXES)[number], value: number | undefined) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      {LIFE_AXES.map((axis) => {
        const score = getAxisScore(scenario, axis)
        const overridden = isAxisOverridden(scenario, axis)
        return (
          <div key={axis} className="flex flex-col gap-1">
            <div className="flex items-baseline justify-between gap-2">
              <label className="text-xs font-medium text-slate-600">{LIFE_AXIS_LABELS[axis]}</label>
              <div className="flex items-center gap-2">
                <span className="w-6 text-right text-sm font-semibold text-slate-900">{score}</span>
                {overridden ? (
                  <button
                    type="button"
                    onClick={() => onChange(axis, undefined)}
                    className="text-[10px] font-medium text-blue-600 hover:underline"
                  >
                    Reset to suggested
                  </button>
                ) : (
                  <span className="text-[10px] text-slate-400">suggested</span>
                )}
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={score}
              onChange={(e) => onChange(axis, Number(e.target.value))}
            />
          </div>
        )
      })}
      <p className="text-[11px] leading-tight text-slate-500">
        Scores are your own judgement, not a formula — decisions only suggest a starting point. Edit freely.
      </p>
    </div>
  )
}
