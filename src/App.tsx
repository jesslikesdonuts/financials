import { useMemo, useState } from 'react'
import { v4 as uuid } from 'uuid'
import { useLocalStorage } from './hooks/useLocalStorage'
import { seedScenarios, SCENARIO_COLORS, blankScenario } from './defaultScenarios'
import type { Scenario, StressSettings } from './types'
import { DEFAULT_STRESS } from './types'
import { computeMetrics } from './calculations'
import { Sidebar } from './components/Sidebar'
import { ScenarioEditor } from './components/ScenarioEditor'
import { Dashboard } from './components/Dashboard'
import { ComparisonView } from './components/ComparisonView'
import { StressTestPanel } from './components/StressTestPanel'

type Tab = 'dashboard' | 'editor' | 'compare'

export default function App() {
  const [scenarios, setScenarios] = useLocalStorage<Scenario[]>('fsm.scenarios', seedScenarios)
  const [activeId, setActiveId] = useLocalStorage<string>('fsm.activeId', () => scenarios[0]?.id ?? '')
  const [selectedIds, setSelectedIdsRaw] = useLocalStorage<string[]>('fsm.selectedIds', () =>
    scenarios.map((s) => s.id),
  )
  const [stress, setStress] = useLocalStorage<StressSettings>('fsm.stress', DEFAULT_STRESS)
  const [tab, setTab] = useState<Tab>('dashboard')

  const selectedIds_ = useMemo(() => new Set(selectedIds), [selectedIds])
  const setSelectedIds = (updater: (s: Set<string>) => Set<string>) => {
    setSelectedIdsRaw((prev) => Array.from(updater(new Set(prev))))
  }

  const activeScenario = scenarios.find((s) => s.id === activeId) ?? scenarios[0]

  const metricsById = useMemo(() => {
    const map: Record<string, ReturnType<typeof computeMetrics>> = {}
    scenarios.forEach((s) => {
      map[s.id] = computeMetrics(s, stress)
    })
    return map
  }, [scenarios, stress])

  function updateScenario(id: string, updater: (s: Scenario) => Scenario) {
    setScenarios((prev) => prev.map((s) => (s.id === id ? updater(s) : s)))
  }

  function addScenario() {
    const color = SCENARIO_COLORS[scenarios.length % SCENARIO_COLORS.length]
    const s = blankScenario(`Scenario ${scenarios.length + 1}`, color)
    setScenarios((prev) => [...prev, s])
    setActiveId(s.id)
    setSelectedIds((set) => {
      set.add(s.id)
      return set
    })
    setTab('editor')
  }

  function duplicateScenario(id: string) {
    const source = scenarios.find((s) => s.id === id)
    if (!source) return
    const color = SCENARIO_COLORS[scenarios.length % SCENARIO_COLORS.length]
    const copy: Scenario = { ...source, id: uuid(), name: `${source.name} (copy)`, color }
    setScenarios((prev) => [...prev, copy])
    setActiveId(copy.id)
  }

  function deleteScenario(id: string) {
    if (scenarios.length <= 1) return
    setScenarios((prev) => prev.filter((s) => s.id !== id))
    setSelectedIds((set) => {
      set.delete(id)
      return set
    })
    if (activeId === id) {
      const remaining = scenarios.filter((s) => s.id !== id)
      setActiveId(remaining[0]?.id ?? '')
    }
  }

  function renameScenario(id: string, name: string) {
    updateScenario(id, (s) => ({ ...s, name }))
  }

  const selectedScenarios = scenarios.filter((s) => selectedIds_.has(s.id))

  return (
    <div className="flex h-screen flex-col lg:flex-row">
      <Sidebar
        scenarios={scenarios}
        metricsById={metricsById}
        activeId={activeScenario?.id ?? ''}
        selectedIds={selectedIds_}
        onSelectActive={(id) => {
          setActiveId(id)
          setTab('dashboard')
        }}
        onToggleSelected={(id) =>
          setSelectedIds((set) => {
            if (set.has(id)) set.delete(id)
            else set.add(id)
            return set
          })
        }
        onAdd={addScenario}
        onDuplicate={duplicateScenario}
        onDelete={deleteScenario}
        onRename={renameScenario}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-ink-700 bg-ink-900 px-5 py-3">
          <div>
            <h1 className="text-base font-semibold text-slate-100">Financial Scenario Modeller</h1>
            <p className="text-xs text-slate-500">Property, mortgages, rentals & career breaks — modelled side by side</p>
          </div>
          <nav className="flex gap-1 rounded-lg border border-ink-700 bg-ink-800 p-1">
            {(['dashboard', 'editor', 'compare'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                  tab === t ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t === 'compare' ? `Compare (${selectedScenarios.length})` : t}
              </button>
            ))}
          </nav>
        </header>

        <main className="flex flex-1 flex-col gap-5 overflow-y-auto p-5 scrollbar-thin xl:flex-row">
          <div className="min-w-0 flex-1">
            {tab === 'dashboard' && activeScenario && <Dashboard scenario={activeScenario} stress={stress} />}
            {tab === 'editor' && activeScenario && (
              <ScenarioEditor scenario={activeScenario} onChange={(updater) => updateScenario(activeScenario.id, updater)} />
            )}
            {tab === 'compare' && <ComparisonView scenarios={selectedScenarios} stress={stress} />}
          </div>
          <div className="w-full shrink-0 xl:w-72">
            <StressTestPanel stress={stress} onChange={setStress} />
          </div>
        </main>
      </div>
    </div>
  )
}
