import type { Scenario } from '../types'
import { decisionSummarySentence } from '../decisionCategories'
import { formatAmount } from '../currency'
import type { ScenarioMetrics } from '../types'

export function Sidebar({
  scenarios,
  metricsById,
  activeId,
  selectedIds,
  onSelectActive,
  onToggleSelected,
  onAdd,
  onDuplicate,
  onDelete,
  onRename,
}: {
  scenarios: Scenario[]
  metricsById: Record<string, ScenarioMetrics>
  activeId: string
  selectedIds: Set<string>
  onSelectActive: (id: string) => void
  onToggleSelected: (id: string) => void
  onAdd: () => void
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
  onRename: (id: string, name: string) => void
}) {
  return (
    <aside className="flex w-full flex-col gap-2 border-b border-slate-200 bg-white p-3 lg:h-full lg:w-72 lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Scenarios</h2>
        <button
          onClick={onAdd}
          className="rounded bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700"
        >
          + New
        </button>
      </div>
      <div className="flex flex-col gap-1.5 overflow-y-auto scrollbar-thin lg:max-h-none">
        {scenarios.map((scenario) => {
          const metrics = metricsById[scenario.id]
          const isActive = scenario.id === activeId
          const isSelected = selectedIds.has(scenario.id)
          return (
            <div
              key={scenario.id}
              className={`group rounded-lg border p-2.5 transition-colors ${
                isActive ? 'border-blue-400 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleSelected(scenario.id)}
                  title="Include in comparison"
                  className="mt-1 h-3.5 w-3.5 rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-400"
                />
                <button className="min-w-0 flex-1 text-left" onClick={() => onSelectActive(scenario.id)}>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: scenario.color }} />
                    <input
                      value={scenario.name}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => onRename(scenario.id, e.target.value)}
                      className="min-w-0 flex-1 truncate bg-transparent text-sm font-medium text-slate-900 focus:outline-none"
                    />
                  </div>
                  <p className="mt-0.5 truncate text-[11px] text-slate-400">{decisionSummarySentence(scenario.decisions)}</p>
                  {metrics && (
                    <p className={`mt-0.5 text-xs ${metrics.monthlySurplus >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {formatAmount(metrics.monthlySurplus, metrics.displayCurrency)}/mo · {formatAmount(metrics.netWorth, metrics.displayCurrency)} net worth
                    </p>
                  )}
                </button>
              </div>
              <div className="mt-1.5 flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => onDuplicate(scenario.id)}
                  className="rounded px-1.5 py-0.5 text-[11px] text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                >
                  Duplicate
                </button>
                <button
                  onClick={() => onDelete(scenario.id)}
                  disabled={scenarios.length <= 1}
                  className="rounded px-1.5 py-0.5 text-[11px] text-rose-600 hover:bg-rose-50 disabled:opacity-30"
                >
                  Delete
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </aside>
  )
}
