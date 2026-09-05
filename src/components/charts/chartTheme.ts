export const chartTheme = {
  grid: '#2a3644',
  axis: '#7c8ba1',
  tooltipBg: '#161d26',
  tooltipBorder: '#2a3644',
}

export const tooltipContentStyle = {
  backgroundColor: chartTheme.tooltipBg,
  border: `1px solid ${chartTheme.tooltipBorder}`,
  borderRadius: 8,
  fontSize: 12,
  color: '#e2e8f0',
}

export const axisTickStyle = { fill: chartTheme.axis, fontSize: 11 }

export function truncateLabel(value: string, max = 18): string {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value
}
