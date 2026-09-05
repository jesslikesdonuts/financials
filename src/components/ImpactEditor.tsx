import { IMPACT_AREAS, IMPACT_AREA_LABELS } from '../types'
import type { ImpactAreaId, ImpactNote, Rating } from '../types'

const RATING_STYLES: Record<Rating, string> = {
  positive: 'border-emerald-500 bg-emerald-600 text-white',
  neutral: 'border-slate-400 bg-slate-500 text-white',
  negative: 'border-rose-500 bg-rose-600 text-white',
}

const RATING_LABELS: Record<Rating, string> = { positive: '+', neutral: '~', negative: '−' }

export function ImpactEditor({
  impacts,
  onChange,
}: {
  impacts: Record<ImpactAreaId, ImpactNote>
  onChange: (area: ImpactAreaId, note: ImpactNote) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      {IMPACT_AREAS.map((area) => {
        const impact = impacts[area]
        return (
          <div key={area} className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-2">
              <label className="text-xs font-medium text-slate-600">{IMPACT_AREA_LABELS[area]}</label>
              <div className="flex gap-1">
                {(['negative', 'neutral', 'positive'] as Rating[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => onChange(area, { ...impact, rating: r })}
                    className={`h-6 w-6 rounded-full border text-xs font-bold transition-colors ${
                      impact.rating === r ? RATING_STYLES[r] : 'border-slate-300 bg-white text-slate-400 hover:border-slate-400'
                    }`}
                  >
                    {RATING_LABELS[r]}
                  </button>
                ))}
              </div>
            </div>
            <input
              value={impact.note}
              onChange={(e) => onChange(area, { ...impact, note: e.target.value })}
              placeholder="Brief note…"
              className="w-full rounded border border-slate-300 bg-slate-50 px-2 py-1 text-sm text-slate-900 focus:border-blue-400 focus:outline-none"
            />
          </div>
        )
      })}
    </div>
  )
}
