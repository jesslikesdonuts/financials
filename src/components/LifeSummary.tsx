import { decisionSummarySentence } from '../decisionCategories'
import { IMPACT_AREAS, IMPACT_AREA_LABELS } from '../types'
import type { Rating, Scenario } from '../types'
import { RadarAxisChart } from './charts/RadarAxisChart'

const RATING_DOT: Record<Rating, string> = {
  positive: 'bg-emerald-600',
  neutral: 'bg-slate-400',
  negative: 'bg-rose-600',
}

function BulletCard({ title, items, accent }: { title: string; items: string[]; accent: string }) {
  const filled = items.filter((i) => i.trim().length > 0)
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="mb-2 text-sm font-semibold text-slate-900">{title}</h3>
      {filled.length === 0 ? (
        <p className="text-xs text-slate-400">Nothing noted yet — add some in the Build tab.</p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {filled.map((item, i) => (
            <li key={i} className="flex gap-2 text-sm text-slate-700">
              <span className={accent}>•</span>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function LifeSummary({ scenario }: { scenario: Scenario }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="mb-1 text-sm font-semibold text-slate-900">This life, in short</h3>
        <p className="text-sm text-slate-600">{decisionSummarySentence(scenario.decisions)}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="mb-2 text-sm font-semibold text-slate-900">Life axes</h3>
          <RadarAxisChart scenarios={[scenario]} height={260} />
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">Impact areas</h3>
          <div className="flex flex-col gap-2">
            {IMPACT_AREAS.map((area) => {
              const impact = scenario.qualitative.impacts[area]
              return (
                <div key={area} className="flex items-start gap-2">
                  <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${RATING_DOT[impact.rating]}`} />
                  <div>
                    <p className="text-sm font-medium text-slate-800">{IMPACT_AREA_LABELS[area]}</p>
                    {impact.note && <p className="text-xs text-slate-500">{impact.note}</p>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <BulletCard title="Biggest advantages" items={scenario.qualitative.pros} accent="text-emerald-600" />
        <BulletCard title="Biggest drawbacks" items={scenario.qualitative.cons} accent="text-rose-600" />
      </div>
      <BulletCard title="Trade-offs" items={scenario.qualitative.tradeoffs} accent="text-slate-400" />
    </div>
  )
}
