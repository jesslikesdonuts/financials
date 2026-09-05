import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { computeLifeScore } from '../../calculations'
import type { GlobalSettings, Scenario } from '../../types'
import { axisTickStyle, chartTheme, tooltipContentStyle, truncateLabel } from './chartTheme'

export function LifeScoreChart({ scenarios, settings }: { scenarios: Scenario[]; settings: GlobalSettings }) {
  const data = scenarios.map((scenario) => ({
    name: scenario.name,
    value: Math.round(computeLifeScore(scenario, settings) * 10) / 10,
    color: scenario.color,
  }))

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold text-slate-900">Weighted life score</h3>
      <p className="mb-2 text-[11px] text-slate-500">Your axis scores weighted by the importance you've set — a ranking aid, not a verdict</p>
      <ResponsiveContainer width="100%" height={240}>
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
          <YAxis domain={[0, 10]} tick={axisTickStyle} axisLine={false} tickLine={false} width={30} />
          <Tooltip contentStyle={tooltipContentStyle} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
            <LabelList dataKey="value" position="top" style={{ fill: '#334155', fontSize: 11 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
