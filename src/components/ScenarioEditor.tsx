import { v4 as uuid } from 'uuid'
import type { Scenario } from '../types'
import { Section } from './Section'
import { CheckboxInput, SliderInput } from './SliderInput'

export function ScenarioEditor({
  scenario,
  onChange,
}: {
  scenario: Scenario
  onChange: (updater: (s: Scenario) => Scenario) => void
}) {
  const set = <K extends keyof Scenario>(key: K, value: Scenario[K]) =>
    onChange((s) => ({ ...s, [key]: value }))

  return (
    <div className="flex flex-col gap-4 pb-10">
      <div className="rounded-lg border border-ink-700 bg-ink-900 p-4">
        <label className="text-xs font-medium text-slate-400">Scenario name</label>
        <input
          value={scenario.name}
          onChange={(e) => set('name', e.target.value)}
          className="mt-1 w-full rounded border border-ink-600 bg-ink-800 px-3 py-2 text-sm text-slate-100 focus:border-blue-400 focus:outline-none"
        />
      </div>

      <Section title="Household income & savings" subtitle="Baseline cash position before any purchases">
        <SliderInput
          label="Monthly take-home income"
          value={scenario.monthlyIncome}
          onChange={(v) => set('monthlyIncome', v)}
          min={0}
          max={15000}
          step={50}
          prefix="£"
        />
        <SliderInput
          label="Current savings"
          value={scenario.currentSavings}
          onChange={(v) => set('currentSavings', v)}
          min={0}
          max={500000}
          step={1000}
          prefix="£"
        />
        <SliderInput
          label="Annual savings rate"
          value={scenario.annualSavingsRatePct}
          onChange={(v) => set('annualSavingsRatePct', v)}
          min={0}
          max={100}
          step={1}
          suffix="%"
          hint="Share of take-home income saved each month, on top of property cashflow"
        />
        <SliderInput
          label="Career break duration"
          value={scenario.careerBreakMonths}
          onChange={(v) => set('careerBreakMonths', v)}
          min={0}
          max={36}
          step={1}
          suffix="mo"
          hint="Income drops to £0 for this many months from today"
        />
      </Section>

      <Section title="Primary property & mortgage">
        <SliderInput
          label="Property value"
          value={scenario.propertyValue}
          onChange={(v) => set('propertyValue', v)}
          min={0}
          max={2000000}
          step={5000}
          prefix="£"
        />
        <SliderInput
          label="Existing mortgage balance"
          value={scenario.existingMortgageBalance}
          onChange={(v) => set('existingMortgageBalance', v)}
          min={0}
          max={2000000}
          step={2500}
          prefix="£"
        />
        <SliderInput
          label="Refinance amount"
          value={scenario.refinanceAmount}
          onChange={(v) => set('refinanceAmount', v)}
          min={0}
          max={2000000}
          step={2500}
          prefix="£"
          hint="0 = keep existing mortgage as-is; otherwise replaces the balance above"
        />
        <SliderInput
          label="Mortgage rate"
          value={scenario.mortgageRate}
          onChange={(v) => set('mortgageRate', v)}
          min={0}
          max={12}
          step={0.05}
          suffix="%"
        />
        <SliderInput
          label="Mortgage term"
          value={scenario.mortgageTermYears}
          onChange={(v) => set('mortgageTermYears', v)}
          min={1}
          max={40}
          step={1}
          suffix="yrs"
        />
      </Section>

      <Section title="Rental income & running costs" subtitle="Applies to the rented property in this scenario">
        <SliderInput
          label="Rental income"
          value={scenario.rentalIncome}
          onChange={(v) => set('rentalIncome', v)}
          min={0}
          max={10000}
          step={25}
          prefix="£"
          suffix="/mo"
        />
        <SliderInput
          label="Management fees"
          value={scenario.managementFeesMonthly}
          onChange={(v) => set('managementFeesMonthly', v)}
          min={0}
          max={2000}
          step={10}
          prefix="£"
          suffix="/mo"
        />
        <SliderInput
          label="Maintenance allowance"
          value={scenario.maintenanceAllowanceMonthly}
          onChange={(v) => set('maintenanceAllowanceMonthly', v)}
          min={0}
          max={2000}
          step={10}
          prefix="£"
          suffix="/mo"
        />
      </Section>

      <Section
        title="Second property purchase"
        accessory={
          <span
            onClick={(e) => e.stopPropagation()}
            className="flex items-center"
          >
            <input
              type="checkbox"
              checked={scenario.secondPropertyEnabled}
              onChange={(e) => set('secondPropertyEnabled', e.target.checked)}
              className="h-4 w-4 rounded border-ink-500 bg-ink-800 text-blue-500 focus:ring-blue-400"
            />
          </span>
        }
        defaultOpen={scenario.secondPropertyEnabled}
      >
        <div className="sm:col-span-2">
          <CheckboxInput
            label="Model a second property purchase"
            checked={scenario.secondPropertyEnabled}
            onChange={(v) => set('secondPropertyEnabled', v)}
            hint="Untick to compare this scenario without buying a second property"
          />
        </div>
        <SliderInput
          label="Purchase price"
          value={scenario.secondPropertyPrice}
          onChange={(v) => set('secondPropertyPrice', v)}
          min={0}
          max={2000000}
          step={5000}
          prefix="£"
        />
        <SliderInput
          label="Deposit"
          value={scenario.deposit}
          onChange={(v) => set('deposit', v)}
          min={0}
          max={1000000}
          step={1000}
          prefix="£"
        />
        <SliderInput
          label="Purchase taxes & fees"
          value={scenario.purchaseTaxesFees}
          onChange={(v) => set('purchaseTaxesFees', v)}
          min={0}
          max={200000}
          step={500}
          prefix="£"
          hint="Stamp duty, legal fees, survey costs etc."
        />
        <SliderInput
          label="Second mortgage amount"
          value={scenario.secondMortgageAmount}
          onChange={(v) => set('secondMortgageAmount', v)}
          min={0}
          max={2000000}
          step={2500}
          prefix="£"
        />
        <SliderInput
          label="Second mortgage rate"
          value={scenario.secondMortgageRate}
          onChange={(v) => set('secondMortgageRate', v)}
          min={0}
          max={12}
          step={0.05}
          suffix="%"
        />
        <SliderInput
          label="Second mortgage term"
          value={scenario.secondMortgageTermYears}
          onChange={(v) => set('secondMortgageTermYears', v)}
          min={1}
          max={40}
          step={1}
          suffix="yrs"
        />
        <SliderInput
          label="Service charges"
          value={scenario.serviceChargesMonthly}
          onChange={(v) => set('serviceChargesMonthly', v)}
          min={0}
          max={2000}
          step={10}
          prefix="£"
          suffix="/mo"
        />
      </Section>

      <Section title="One-off costs" defaultOpen={scenario.oneOffCosts.length > 0}>
        <div className="sm:col-span-2 flex flex-col gap-3">
          {scenario.oneOffCosts.length === 0 && (
            <p className="text-xs text-slate-500">No one-off costs added yet.</p>
          )}
          {scenario.oneOffCosts.map((cost) => (
            <div key={cost.id} className="flex flex-wrap items-center gap-2 rounded border border-ink-700 bg-ink-800 p-2">
              <input
                value={cost.label}
                onChange={(e) =>
                  set(
                    'oneOffCosts',
                    scenario.oneOffCosts.map((c) => (c.id === cost.id ? { ...c, label: e.target.value } : c)),
                  )
                }
                placeholder="Label"
                className="min-w-0 flex-1 rounded border border-ink-600 bg-ink-900 px-2 py-1 text-sm text-slate-100 focus:border-blue-400 focus:outline-none"
              />
              <span className="text-xs text-slate-500">£</span>
              <input
                type="number"
                value={cost.amount}
                onChange={(e) =>
                  set(
                    'oneOffCosts',
                    scenario.oneOffCosts.map((c) =>
                      c.id === cost.id ? { ...c, amount: Number(e.target.value) } : c,
                    ),
                  )
                }
                className="w-24 rounded border border-ink-600 bg-ink-900 px-2 py-1 text-right text-sm text-slate-100 focus:border-blue-400 focus:outline-none"
              />
              <input
                type="number"
                value={cost.monthOffset}
                onChange={(e) =>
                  set(
                    'oneOffCosts',
                    scenario.oneOffCosts.map((c) =>
                      c.id === cost.id ? { ...c, monthOffset: Number(e.target.value) } : c,
                    ),
                  )
                }
                title="Months from now"
                className="w-16 rounded border border-ink-600 bg-ink-900 px-2 py-1 text-right text-sm text-slate-100 focus:border-blue-400 focus:outline-none"
              />
              <span className="text-xs text-slate-500">mo</span>
              <button
                onClick={() => set('oneOffCosts', scenario.oneOffCosts.filter((c) => c.id !== cost.id))}
                className="rounded px-2 py-1 text-xs text-red-400 hover:bg-red-950"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={() =>
              set('oneOffCosts', [...scenario.oneOffCosts, { id: uuid(), label: 'New cost', amount: 1000, monthOffset: 0 }])
            }
            className="self-start rounded border border-ink-600 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-blue-400 hover:text-blue-300"
          >
            + Add one-off cost
          </button>
        </div>
      </Section>

      <Section title="Assumptions" subtitle="Editable projection assumptions" defaultOpen={false}>
        <SliderInput
          label="Property appreciation"
          value={scenario.propertyAppreciationPct}
          onChange={(v) => set('propertyAppreciationPct', v)}
          min={-10}
          max={15}
          step={0.5}
          suffix="%/yr"
        />
        <SliderInput
          label="Rent growth"
          value={scenario.rentGrowthPct}
          onChange={(v) => set('rentGrowthPct', v)}
          min={-10}
          max={15}
          step={0.5}
          suffix="%/yr"
        />
        <SliderInput
          label="Projection horizon"
          value={scenario.projectionYears}
          onChange={(v) => set('projectionYears', v)}
          min={1}
          max={40}
          step={1}
          suffix="yrs"
        />
      </Section>
    </div>
  )
}
