export const chartTheme = {
  grid: '#e2e8f0',
  axis: '#64748b',
  tooltipBg: '#ffffff',
  tooltipBorder: '#e2e8f0',
  legendText: '#334155',
}

export const tooltipContentStyle = {
  backgroundColor: chartTheme.tooltipBg,
  border: `1px solid ${chartTheme.tooltipBorder}`,
  borderRadius: 8,
  fontSize: 12,
  color: '#1e293b',
  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
}

export const axisTickStyle = { fill: chartTheme.axis, fontSize: 11 }

export function truncateLabel(value: string, max = 18): string {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value
}
