import type { Scenario, StressSettings } from '../types'
import { computeMetrics, formatCurrency, formatMonths, projectSeries } from '../calculations'
import { CashflowChart } from './charts/CashflowChart'
import { DebtEquityChart } from './charts/DebtEquityChart'
import { NetWorthChart } from './charts/NetWorthChart'
import { RunwayChart } from './charts/RunwayChart'

const ROWS: { label: string; key: string; format: (v: number) => string; tone?: boolean }[] = [
  { label: 'Monthly mortgage payment', key: 'totalMonthlyMortgagePayment', format: formatCurrency },
  { label: 'Monthly property cashflow', key: 'monthlyPropertyCashflow', format: formatCurrency, tone: true },
  { label: 'Annual property cashflow', key: 'annualPropertyCashflow', format: formatCurrency, tone: true },
  { label: 'Total debt', key: 'totalDebt', format: formatCurrency },
  { label: 'Total equity', key: 'totalEquity', format: formatCurrency, tone: true },
  { label: 'Cash remaining after purchases', key: 'cashRemainingAfterPurchases', format: formatCurrency, tone: true },
  { label: 'Household cashflow / mo', key: 'monthlyHouseholdCashflow', format: formatCurrency, tone: true },
  { label: 'Financial runway', key: 'runwayMonths', format: formatMonths, tone: true },
]

export function ComparisonView({ scenarios, stress }: { scenarios: Scenario[]; stress: StressSettings }) {
  if (scenarios.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
        Select two or more scenarios in the sidebar to compare them side by side.
      </div>
    )
  }

  const rows = scenarios.map((scenario) => ({ scenario, metrics: computeMetrics(scenario, stress) }))
  const series = scenarios.map((scenario) => ({ scenario, points: projectSeries(scenario, stress) }))

  return (
    <div className="flex flex-col gap-5">
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
                  const tone = row.tone ? (value >= 0 ? 'text-emerald-600' : 'text-rose-600') : 'text-slate-900'
                  return (
                    <td key={scenario.id} className={`px-4 py-2.5 text-right font-medium ${tone}`}>
                      {row.format(value)}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <CashflowChart rows={rows} />
        <RunwayChart rows={rows} />
        <DebtEquityChart rows={rows} />
        <NetWorthChart series={series} title="Net worth projection" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <NetWorthChart series={series} dataKey="totalDebt" title="Debt balance over time" />
        <NetWorthChart series={series} dataKey="equity" title="Equity over time" />
      </div>
    </div>
  )
}
