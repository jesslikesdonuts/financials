import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { ProjectionPoint, Scenario } from '../../types'
import { formatCurrency } from '../../calculations'
import { axisTickStyle, chartTheme, tooltipContentStyle } from './chartTheme'

interface Series {
  scenario: Scenario
  points: ProjectionPoint[]
}

export function NetWorthChart({ series, dataKey = 'netWorth', title }: { series: Series[]; dataKey?: keyof ProjectionPoint; title: string }) {
  const maxYears = Math.max(...series.map((s) => s.points[s.points.length - 1]?.year ?? 0))
  const merged: Record<number, any>[] = []
  const yearBuckets = Math.round(maxYears) + 1
  for (let y = 0; y <= yearBuckets; y++) {
    const row: Record<string, any> = { year: y }
    series.forEach(({ scenario, points }) => {
      const point = points.find((p) => Math.round(p.year) === y)
      if (point) row[scenario.id] = point[dataKey]
    })
    merged.push(row)
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold text-slate-900">{title}</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={merged} margin={{ top: 4, right: 12, left: 4, bottom: 0 }}>
          <CartesianGrid stroke={chartTheme.grid} strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="year"
            tick={axisTickStyle}
            tickFormatter={(v) => `Yr ${v}`}
            axisLine={{ stroke: chartTheme.grid }}
            tickLine={false}
          />
          <YAxis
            tick={axisTickStyle}
            tickFormatter={(v) => formatCurrency(v)}
            axisLine={false}
            tickLine={false}
            width={80}
          />
          <Tooltip
            contentStyle={tooltipContentStyle}
            formatter={(value: number, name: string) => [formatCurrency(value), series.find((s) => s.scenario.id === name)?.scenario.name ?? name]}
            labelFormatter={(v) => `Year ${v}`}
          />
          <Legend
            formatter={(value) => series.find((s) => s.scenario.id === value)?.scenario.name ?? value}
            wrapperStyle={{ fontSize: 12, color: '#334155' }}
          />
          {series.map(({ scenario }) => (
            <Line
              key={scenario.id}
              type="monotone"
              dataKey={scenario.id}
              name={scenario.id}
              stroke={scenario.color}
              strokeWidth={2}
              dot={false}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
