import type { Scenario, StressSettings } from '../types'
import { computeMetrics, projectSeries } from '../calculations'
import { MetricsSummary } from './MetricsSummary'
import { NetWorthChart } from './charts/NetWorthChart'
import { DebtEquityChart } from './charts/DebtEquityChart'
import { CashflowChart } from './charts/CashflowChart'
import { RunwayChart } from './charts/RunwayChart'

export function Dashboard({ scenario, stress }: { scenario: Scenario; stress: StressSettings }) {
  const metrics = computeMetrics(scenario, stress)
  const points = projectSeries(scenario, stress)
  const rows = [{ scenario, metrics }]
  const series = [{ scenario, points }]

  return (
    <div className="flex flex-col gap-5">
      <MetricsSummary metrics={metrics} />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <NetWorthChart series={series} title="Net worth projection" />
        <DebtEquityChart rows={rows} />
        <CashflowChart rows={rows} />
        <RunwayChart rows={rows} />
      </div>
    </div>
  )
}
