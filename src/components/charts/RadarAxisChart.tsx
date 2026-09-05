import { Legend, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts'
import { getAxisScore } from '../../calculations'
import { LIFE_AXES, LIFE_AXIS_LABELS } from '../../types'
import type { Scenario } from '../../types'
import { axisTickStyle, chartTheme, tooltipContentStyle } from './chartTheme'

export function RadarAxisChart({ scenarios, height = 300 }: { scenarios: Scenario[]; height?: number }) {
  const data = LIFE_AXES.map((axis) => {
    const row: Record<string, any> = { axis: LIFE_AXIS_LABELS[axis] }
    scenarios.forEach((scenario) => {
      row[scenario.id] = getAxisScore(scenario, axis)
    })
    return row
  })

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data} outerRadius="70%">
        <PolarGrid stroke={chartTheme.grid} />
        <PolarAngleAxis dataKey="axis" tick={axisTickStyle} />
        <PolarRadiusAxis angle={90} domain={[0, 10]} tick={axisTickStyle} tickCount={6} />
        <Tooltip contentStyle={tooltipContentStyle} />
        <Legend
          formatter={(value) => scenarios.find((s) => s.id === value)?.name ?? value}
          wrapperStyle={{ fontSize: 12, color: chartTheme.legendText }}
        />
        {scenarios.map((scenario) => (
          <Radar
            key={scenario.id}
            name={scenario.id}
            dataKey={scenario.id}
            stroke={scenario.color}
            fill={scenario.color}
            fillOpacity={0.15}
          />
        ))}
      </RadarChart>
    </ResponsiveContainer>
  )
}
