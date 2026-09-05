import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { Currency, Scenario, ScenarioMetrics } from '../../types'
import { formatAmount } from '../../currency'
import { axisTickStyle, chartTheme, tooltipContentStyle, truncateLabel } from './chartTheme'

export function CashflowChart({ rows, currency }: { rows: { scenario: Scenario; metrics: ScenarioMetrics }[]; currency: Currency }) {
  const data = rows.map(({ scenario, metrics }) => ({
    name: scenario.name,
    value: metrics.monthlySurplus,
    color: scenario.color,
  }))

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold text-slate-900">Monthly surplus / deficit</h3>
      <ResponsiveContainer width="100%" height={270}>
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
          <ReferenceLine y={0} stroke={chartTheme.axis} />
          <Tooltip contentStyle={tooltipContentStyle} formatter={(value: number) => formatAmount(value, currency)} />
          <Bar dataKey="value" radius={[4, 4, 4, 4]}>
            {data.map((d) => (
              <Cell key={d.name} fill={d.value >= 0 ? '#16a34a' : '#dc2626'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
