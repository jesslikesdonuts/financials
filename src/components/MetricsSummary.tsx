import type { ScenarioMetrics } from '../types'
import { formatCurrency, formatMonths } from '../calculations'

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
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      <Metric label="Monthly mortgage payment" value={formatCurrency(metrics.totalMonthlyMortgagePayment)} />
      <Metric
        label="Monthly property cashflow"
        value={formatCurrency(metrics.monthlyPropertyCashflow)}
        tone={metrics.monthlyPropertyCashflow >= 0 ? 'good' : 'bad'}
      />
      <Metric
        label="Annual property cashflow"
        value={formatCurrency(metrics.annualPropertyCashflow)}
        tone={metrics.annualPropertyCashflow >= 0 ? 'good' : 'bad'}
      />
      <Metric label="Total debt" value={formatCurrency(metrics.totalDebt)} />
      <Metric label="Total equity" value={formatCurrency(metrics.totalEquity)} tone={metrics.totalEquity >= 0 ? 'good' : 'bad'} />
      <Metric
        label="Cash remaining after purchases"
        value={formatCurrency(metrics.cashRemainingAfterPurchases)}
        tone={metrics.cashRemainingAfterPurchases >= 0 ? 'good' : 'bad'}
      />
      <Metric
        label="Household cashflow / mo"
        value={formatCurrency(metrics.monthlyHouseholdCashflow)}
        tone={metrics.monthlyHouseholdCashflow >= 0 ? 'good' : 'bad'}
        hint="Income + property cashflow"
      />
      <Metric
        label="Financial runway"
        value={formatMonths(metrics.runwayMonths)}
        tone={!isFinite(metrics.runwayMonths) || metrics.runwayMonths > 12 ? 'good' : metrics.runwayMonths > 3 ? 'neutral' : 'bad'}
      />
    </div>
  )
}
