import type { ScenarioMetrics } from '../types'
import { formatAmount, formatMonths } from '../currency'

function Metric({ label, value, tone = 'neutral', hint }: { label: string; value: string; tone?: 'good' | 'bad' | 'neutral'; hint?: string }) {
  const color = tone === 'good' ? 'text-emerald-600' : tone === 'bad' ? 'text-rose-600' : 'text-slate-900'
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <p className="text-[11px] uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-1 text-lg font-semibold ${color}`}>{value}</p>
      {hint && <p className="mt-0.5 text-[11px] text-slate-500">{hint}</p>}
    </div>
  )
}

export function MetricsSummary({ metrics }: { metrics: ScenarioMetrics }) {
  const cur = metrics.displayCurrency
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      <Metric label="Net worth" value={formatAmount(metrics.netWorth, cur)} tone={metrics.netWorth >= 0 ? 'good' : 'bad'} />
      <Metric label="Total property equity" value={formatAmount(metrics.totalPropertyEquity, cur)} tone={metrics.totalPropertyEquity >= 0 ? 'good' : 'bad'} />
      <Metric label="Total debt" value={formatAmount(metrics.totalDebt, cur)} />
      <Metric label="Monthly mortgage payments" value={formatAmount(metrics.totalMonthlyMortgagePayment, cur)} />
      <Metric
        label="Monthly surplus / deficit"
        value={formatAmount(metrics.monthlySurplus, cur)}
        tone={metrics.monthlySurplus >= 0 ? 'good' : 'bad'}
      />
      <Metric
        label="Required income (gross)"
        value={formatAmount(metrics.requiredIncomeMonthlyGross, cur)}
        hint="Income needed to break even each month"
      />
      <Metric label="Cash available" value={formatAmount(metrics.cashAvailable, cur)} tone={metrics.cashAvailable >= 0 ? 'good' : 'bad'} />
      <Metric
        label="Cash runway"
        value={formatMonths(metrics.cashRunwayMonths)}
        tone={!isFinite(metrics.cashRunwayMonths) || metrics.cashRunwayMonths > 12 ? 'good' : metrics.cashRunwayMonths > 3 ? 'neutral' : 'bad'}
      />
    </div>
  )
}
