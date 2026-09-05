import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { Currency, Scenario, ScenarioMetrics } from '../../types'
import { formatAmount } from '../../currency'
import { axisTickStyle, chartTheme, tooltipContentStyle, truncateLabel } from './chartTheme'

export function DebtEquityChart({ rows, currency }: { rows: { scenario: Scenario; metrics: ScenarioMetrics }[]; currency: Currency }) {
  const data = rows.map(({ scenario, metrics }) => ({
    name: scenario.name,
    Debt: metrics.totalDebt,
    Equity: metrics.totalPropertyEquity,
  }))

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold text-slate-900">Debt vs. property equity</h3>
      <ResponsiveContainer width="100%" height={310}>
        <BarChart data={data} margin={{ top: 4, right: 12, left: 4, bottom: 24 }}>
          <CartesianGrid stroke={chartTheme.grid} strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            tick={axisTickStyle}
            axisLine={{ stroke: chartTheme.grid }}
            tickLine={false}
            interval={0}
            angle={-20}
            textAnchor="end"
            height={50}
            tickFormatter={(v: string) => truncateLabel(v)}
          />
          <YAxis tick={axisTickStyle} tickFormatter={(v) => formatAmount(v, currency)} axisLine={false} tickLine={false} width={80} />
          <Tooltip contentStyle={tooltipContentStyle} formatter={(value: number) => formatAmount(value, currency)} />
          <Legend wrapperStyle={{ fontSize: 12, color: chartTheme.legendText }} />
          <Bar dataKey="Debt" stackId="a" fill="#ea580c" radius={[0, 0, 4, 4]} />
          <Bar dataKey="Equity" stackId="a" fill="#16a34a" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
