import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { Scenario, ScenarioMetrics } from '../../types'
import { formatMonths } from '../../currency'
import { axisTickStyle, chartTheme, tooltipContentStyle, truncateLabel } from './chartTheme'

export function RunwayChart({ rows }: { rows: { scenario: Scenario; metrics: ScenarioMetrics }[] }) {
  const finiteValues = rows.map((r) => r.metrics.cashRunwayMonths).filter((v) => isFinite(v))
  const cap = Math.max(24, ...finiteValues, 0) * 1.15 || 24

  const data = rows.map(({ scenario, metrics }) => ({
    name: scenario.name,
    value: isFinite(metrics.cashRunwayMonths) ? metrics.cashRunwayMonths : cap,
    label: formatMonths(metrics.cashRunwayMonths),
    isInfinite: !isFinite(metrics.cashRunwayMonths),
    color: scenario.color,
  }))

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold text-slate-900">Cash runway</h3>
      <p className="mb-2 text-[11px] text-slate-500">
        Months your remaining cash lasts if outgoings exceed all incoming money under current stress settings
      </p>
      <ResponsiveContainer width="100%" height={270}>
        <BarChart data={data} margin={{ top: 16, right: 12, left: 4, bottom: 24 }}>
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
          <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} width={40} tickFormatter={(v) => `${Math.round(v)}`} />
          <Tooltip contentStyle={tooltipContentStyle} formatter={(_: number, __: string, item: any) => item.payload.label} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((d) => (
              <Cell key={d.name} fill={d.isInfinite ? '#16a34a' : '#2563eb'} />
            ))}
            <LabelList dataKey="label" position="top" style={{ fill: '#334155', fontSize: 11 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
