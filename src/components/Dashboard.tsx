import type { GlobalSettings, Scenario, StressSettings } from '../types'
import { computeMetrics, projectSeries } from '../calculations'
import { MetricsSummary } from './MetricsSummary'
import { LifeSummary } from './LifeSummary'
import { NetWorthChart } from './charts/NetWorthChart'
import { DebtEquityChart } from './charts/DebtEquityChart'
import { CashflowChart } from './charts/CashflowChart'
import { RunwayChart } from './charts/RunwayChart'

export function Dashboard({ scenario, settings, stress }: { scenario: Scenario; settings: GlobalSettings; stress: StressSettings }) {
  const metrics = computeMetrics(scenario, settings, stress)
  const points = projectSeries(scenario, settings, stress)
  const rows = [{ scenario, metrics }]
  const series = [{ scenario, points }]

  return (
    <div className="flex flex-col gap-5">
      <MetricsSummary metrics={metrics} />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <NetWorthChart series={series} title="Net worth projection" currency={metrics.displayCurrency} />
        <DebtEquityChart rows={rows} currency={metrics.displayCurrency} />
        <CashflowChart rows={rows} currency={metrics.displayCurrency} />
        <RunwayChart rows={rows} />
      </div>
      <LifeSummary scenario={scenario} />
    </div>
  )
}
