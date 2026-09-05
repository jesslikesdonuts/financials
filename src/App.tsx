import { useMemo, useState } from 'react'
import { v4 as uuid } from 'uuid'
import { useLocalStorage } from './hooks/useLocalStorage'
import { seedScenarios, SCENARIO_COLORS, blankScenario } from './defaultScenarios'
import type { GlobalSettings, Scenario, StressSettings } from './types'
import { DEFAULT_GLOBAL_SETTINGS, DEFAULT_STRESS } from './types'
import { computeMetrics } from './calculations'
import { Sidebar } from './components/Sidebar'
import { ScenarioEditor } from './components/ScenarioEditor'
import { Dashboard } from './components/Dashboard'
import { ComparisonView } from './components/ComparisonView'
import { StressTestPanel } from './components/StressTestPanel'
import { GlobalSettingsPanel } from './components/GlobalSettingsPanel'

type Tab = 'thisLife' | 'build' | 'compare'

const TAB_LABELS: Record<Tab, string> = { thisLife: 'This Life', build: 'Build', compare: 'Compare Lives' }

export default function App() {
  const [scenarios, setScenarios] = useLocalStorage<Scenario[]>('lsm.scenarios', seedScenarios)
  const [activeId, setActiveId] = useLocalStorage<string>('lsm.activeId', () => scenarios[0]?.id ?? '')
  const [selectedIds, setSelectedIdsRaw] = useLocalStorage<string[]>('lsm.selectedIds', () =>
    scenarios.map((s) => s.id),
  )
  const [settings, setSettings] = useLocalStorage<GlobalSettings>('lsm.settings', DEFAULT_GLOBAL_SETTINGS)
  const [stress, setStress] = useLocalStorage<StressSettings>('lsm.stress', DEFAULT_STRESS)
  const [tab, setTab] = useState<Tab>('thisLife')

  const selectedIds_ = useMemo(() => new Set(selectedIds), [selectedIds])
  const setSelectedIds = (updater: (s: Set<string>) => Set<string>) => {
    setSelectedIdsRaw((prev) => Array.from(updater(new Set(prev))))
  }

  const activeScenario = scenarios.find((s) => s.id === activeId) ?? scenarios[0]

  const metricsById = useMemo(() => {
    const map: Record<string, ReturnType<typeof computeMetrics>> = {}
    scenarios.forEach((s) => {
      map[s.id] = computeMetrics(s, settings, stress)
    })
    return map
  }, [scenarios, settings, stress])

  function updateScenario(id: string, updater: (s: Scenario) => Scenario) {
    setScenarios((prev) => prev.map((s) => (s.id === id ? updater(s) : s)))
  }

  function addScenario() {
    const color = SCENARIO_COLORS[scenarios.length % SCENARIO_COLORS.length]
    const s = blankScenario(`Life ${scenarios.length + 1}`, color)
    setScenarios((prev) => [...prev, s])
    setActiveId(s.id)
    setSelectedIds((set) => {
      set.add(s.id)
      return set
    })
    setTab('build')
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
          setTab('thisLife')
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
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3">
          <div>
            <h1 className="text-base font-semibold text-slate-900">Life Scenario Modeller</h1>
            <p className="text-xs text-slate-500">If I choose this combination of decisions, what does that life look like?</p>
          </div>
          <nav className="flex gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1">
            {(['thisLife', 'build', 'compare'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  tab === t ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {t === 'compare' ? `${TAB_LABELS[t]} (${selectedScenarios.length})` : TAB_LABELS[t]}
              </button>
            ))}
          </nav>
        </header>

        <main className="flex flex-1 flex-col gap-5 overflow-y-auto p-5 scrollbar-thin xl:flex-row">
          <div className="min-w-0 flex-1">
            {tab === 'thisLife' && activeScenario && <Dashboard scenario={activeScenario} settings={settings} stress={stress} />}
            {tab === 'build' && activeScenario && (
              <ScenarioEditor scenario={activeScenario} onChange={(updater) => updateScenario(activeScenario.id, updater)} />
            )}
            {tab === 'compare' && <ComparisonView scenarios={selectedScenarios} settings={settings} stress={stress} />}
          </div>
          <div className="flex w-full shrink-0 flex-col gap-4 xl:w-72">
            <GlobalSettingsPanel settings={settings} onChange={setSettings} />
            <StressTestPanel stress={stress} onChange={setStress} />
          </div>
        </main>
      </div>
    </div>
  )
}
