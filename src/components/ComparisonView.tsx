import { useState } from 'react'
import type { Currency, GlobalSettings, Scenario, StressSettings } from '../types'
import { IMPACT_AREAS, IMPACT_AREA_LABELS } from '../types'
import { computeMetrics, projectSeries } from '../calculations'
import { formatAmount, formatMonths } from '../currency'
import { CashflowChart } from './charts/CashflowChart'
import { DebtEquityChart } from './charts/DebtEquityChart'
import { NetWorthChart } from './charts/NetWorthChart'
import { RunwayChart } from './charts/RunwayChart'
import { RadarAxisChart } from './charts/RadarAxisChart'
import { LifeScoreChart } from './charts/LifeScoreChart'

const ROWS: { label: string; key: string; format: 'money' | 'months'; tone?: boolean }[] = [
  { label: 'Net worth', key: 'netWorth', format: 'money', tone: true },
  { label: 'Total property equity', key: 'totalPropertyEquity', format: 'money', tone: true },
  { label: 'Total debt', key: 'totalDebt', format: 'money' },
  { label: 'Monthly mortgage payments', key: 'totalMonthlyMortgagePayment', format: 'money' },
  { label: 'Monthly surplus / deficit', key: 'monthlySurplus', format: 'money', tone: true },
  { label: 'Required income (gross)', key: 'requiredIncomeMonthlyGross', format: 'money' },
  { label: 'Cash runway', key: 'cashRunwayMonths', format: 'months', tone: true },
]

const RATING_DOT: Record<string, string> = {
  positive: 'bg-emerald-600',
  neutral: 'bg-slate-400',
  negative: 'bg-rose-600',
}

export function ComparisonView({
  scenarios,
  settings,
  stress,
}: {
  scenarios: Scenario[]
  settings: GlobalSettings
  stress: StressSettings
}) {
  const [compareCurrency, setCompareCurrency] = useState<Currency>(settings.displayCurrency)

  if (scenarios.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
        Select two or more scenarios in the sidebar to compare them side by side.
      </div>
    )
  }

  const rows = scenarios.map((scenario) => ({ scenario, metrics: computeMetrics(scenario, settings, stress, compareCurrency) }))
  const series = scenarios.map((scenario) => ({ scenario, points: projectSeries(scenario, settings, stress, compareCurrency) }))

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Financial comparison</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Show totals in</span>
            <div className="flex overflow-hidden rounded border border-slate-300">
              {(['GBP', 'NZD'] as Currency[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setCompareCurrency(c)}
                  className={`px-2.5 py-1 text-xs font-semibold transition-colors ${
                    compareCurrency === c ? 'bg-blue-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">Metric</th>
                {rows.map(({ scenario }) => (
                  <th key={scenario.id} className="px-4 py-3 text-right text-xs font-semibold" style={{ color: scenario.color }}>
                    {scenario.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.key} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-2.5 text-slate-500">{row.label}</td>
                  {rows.map(({ scenario, metrics }) => {
                    const value = (metrics as any)[row.key] as number
                    const formatted = row.format === 'money' ? formatAmount(value, compareCurrency) : formatMonths(value)
                    const tone = row.tone ? (value >= 0 ? 'text-emerald-600' : 'text-rose-600') : 'text-slate-900'
                    return (
                      <td key={scenario.id} className={`px-4 py-2.5 text-right font-medium ${tone}`}>
                        {formatted}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
          <CashflowChart rows={rows} currency={compareCurrency} />
          <RunwayChart rows={rows} />
          <DebtEquityChart rows={rows} currency={compareCurrency} />
          <NetWorthChart series={series} title="Net worth projection" currency={compareCurrency} />
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-slate-900">Life comparison</h2>
        <p className="mb-3 text-xs text-slate-500">
          Pros, cons and impact areas are your own judgement, not objective facts — edit them freely in the Build tab.
        </p>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <h3 className="mb-2 text-sm font-semibold text-slate-900">Life axes</h3>
            <RadarAxisChart scenarios={scenarios} />
          </div>
          <LifeScoreChart scenarios={scenarios} settings={settings} />
        </div>

        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">Impact area</th>
                {scenarios.map((scenario) => (
                  <th key={scenario.id} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: scenario.color }}>
                    {scenario.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {IMPACT_AREAS.map((area) => (
                <tr key={area} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-2.5 text-slate-500">{IMPACT_AREA_LABELS[area]}</td>
                  {scenarios.map((scenario) => {
                    const impact = scenario.qualitative.impacts[area]
                    return (
                      <td key={scenario.id} className="px-4 py-2.5">
                        <div className="flex items-start gap-1.5">
                          <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${RATING_DOT[impact.rating]}`} />
                          <span className="text-slate-700">{impact.note || '—'}</span>
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {scenarios.map((scenario) => (
            <div key={scenario.id} className="rounded-lg border border-slate-200 bg-white p-4">
              <h3 className="mb-2 text-sm font-semibold" style={{ color: scenario.color }}>
                {scenario.name}
              </h3>
              <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-emerald-600">Advantages</p>
              <ul className="mb-2 flex flex-col gap-1">
                {scenario.qualitative.pros.filter(Boolean).length === 0 && <li className="text-xs text-slate-400">None noted</li>}
                {scenario.qualitative.pros.filter(Boolean).map((p, i) => (
                  <li key={i} className="text-xs text-slate-700">
                    • {p}
                  </li>
                ))}
              </ul>
              <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-rose-600">Drawbacks</p>
              <ul className="flex flex-col gap-1">
                {scenario.qualitative.cons.filter(Boolean).length === 0 && <li className="text-xs text-slate-400">None noted</li>}
                {scenario.qualitative.cons.filter(Boolean).map((c, i) => (
                  <li key={i} className="text-xs text-slate-700">
                    • {c}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
