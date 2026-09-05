import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { Scenario, ScenarioMetrics } from '../../types'
import { formatCurrency } from '../../calculations'
import { axisTickStyle, chartTheme, tooltipContentStyle, truncateLabel } from './chartTheme'

export function CashflowChart({ rows }: { rows: { scenario: Scenario; metrics: ScenarioMetrics }[] }) {
  const data = rows.map(({ scenario, metrics }) => ({
    name: scenario.name,
    value: metrics.monthlyPropertyCashflow,
    color: scenario.color,
  }))

  return (
    <div className="rounded-lg border border-ink-700 bg-ink-900 p-4">
      <h3 className="mb-3 text-sm font-semibold text-slate-100">Monthly property cashflow</h3>
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
          <YAxis tick={axisTickStyle} tickFormatter={(v) => formatCurrency(v)} axisLine={false} tickLine={false} width={80} />
          <ReferenceLine y={0} stroke={chartTheme.axis} />
          <Tooltip contentStyle={tooltipContentStyle} formatter={(value: number) => formatCurrency(value)} />
          <Bar dataKey="value" radius={[4, 4, 4, 4]}>
            {data.map((d) => (
              <Cell key={d.name} fill={d.value >= 0 ? '#5cb88a' : '#e0654f'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
