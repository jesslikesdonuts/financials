import { DECISION_CATEGORIES } from '../decisionCategories'
import type { Decisions } from '../types'

export function DecisionPicker({
  decisions,
  onChange,
}: {
  decisions: Decisions
  onChange: (categoryId: string, optionId: string) => void
}) {
  return (
    <div className="flex flex-col gap-4">
      {DECISION_CATEGORIES.map((category) => (
        <div key={category.id}>
          <p className="mb-1.5 text-xs font-medium text-slate-600">{category.question}</p>
          <div className="flex flex-wrap gap-1.5">
            {category.options.map((option) => {
              const selected = decisions[category.id] === option.id
              return (
                <button
                  key={option.id}
                  type="button"
                  title={option.description}
                  onClick={() => onChange(category.id, option.id)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    selected
                      ? 'border-blue-500 bg-blue-600 text-white'
                      : 'border-slate-300 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-600'
                  }`}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
