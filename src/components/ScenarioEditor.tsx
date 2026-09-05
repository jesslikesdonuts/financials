import { v4 as uuid } from 'uuid'
import type { ImpactAreaId, ImpactNote, LifeAxis, Money, Scenario } from '../types'
import { Section } from './Section'
import { SliderInput } from './SliderInput'
import { MoneyInput } from './MoneyInput'
import { DecisionPicker } from './DecisionPicker'
import { AxisScoreEditor } from './AxisScoreEditor'
import { BulletListEditor } from './BulletListEditor'
import { ImpactEditor } from './ImpactEditor'

export function ScenarioEditor({
  scenario,
  onChange,
}: {
  scenario: Scenario
  onChange: (updater: (s: Scenario) => Scenario) => void
}) {
  const setTop = <K extends keyof Scenario>(key: K, value: Scenario[K]) => onChange((s) => ({ ...s, [key]: value }))

  const setFinance = <K extends keyof Scenario['finance']>(key: K, value: Scenario['finance'][K]) =>
    onChange((s) => ({ ...s, finance: { ...s.finance, [key]: value } }))

  const setCedar = <K extends keyof Scenario['finance']['cedarCottage']>(
    key: K,
    value: Scenario['finance']['cedarCottage'][K],
  ) => onChange((s) => ({ ...s, finance: { ...s.finance, cedarCottage: { ...s.finance.cedarCottage, [key]: value } } }))

  const setSecond = <K extends keyof Scenario['finance']['secondProperty']>(
    key: K,
    value: Scenario['finance']['secondProperty'][K],
  ) => onChange((s) => ({ ...s, finance: { ...s.finance, secondProperty: { ...s.finance.secondProperty, [key]: value } } }))

  const setQualitative = <K extends keyof Scenario['qualitative']>(key: K, value: Scenario['qualitative'][K]) =>
    onChange((s) => ({ ...s, qualitative: { ...s.qualitative, [key]: value } }))

  const setDecision = (categoryId: string, optionId: string) =>
    onChange((s) => ({ ...s, decisions: { ...s.decisions, [categoryId]: optionId } }))

  const setAxis = (axis: LifeAxis, value: number | undefined) =>
    onChange((s) => {
      const overrides = { ...s.qualitative.axisScoreOverrides }
      if (value === undefined) delete overrides[axis]
      else overrides[axis] = value
      return { ...s, qualitative: { ...s.qualitative, axisScoreOverrides: overrides } }
    })

  const setImpact = (area: ImpactAreaId, note: ImpactNote) =>
    onChange((s) => ({ ...s, qualitative: { ...s.qualitative, impacts: { ...s.qualitative.impacts, [area]: note } } }))

  const cedarDecision = scenario.decisions.cedarCottage
  const secondDecision = scenario.decisions.secondProperty
  const secondEnabled = secondDecision !== 'none'
  const actingDecision = scenario.decisions.acting

  return (
    <div className="flex flex-col gap-4 pb-10">
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <label className="text-xs font-medium text-slate-600">Scenario name</label>
        <input
          value={scenario.name}
          onChange={(e) => setTop('name', e.target.value)}
          className="mt-1 w-full rounded border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-blue-400 focus:outline-none"
        />
      </div>

      <Section title="The decisions" subtitle="What combination of choices defines this life?">
        <div className="sm:col-span-2">
          <DecisionPicker decisions={scenario.decisions} onChange={setDecision} />
        </div>
      </Section>

      <Section title="Income, savings & tax">
        <MoneyInput
          label="Salary / contract income (gross)"
          value={scenario.finance.incomeMonthlyGross}
          onChange={(v) => setFinance('incomeMonthlyGross', v)}
          max={15000}
          step={50}
          suffix="/mo"
        />
        <MoneyInput
          label="Current savings"
          value={scenario.finance.savings}
          onChange={(v) => setFinance('savings', v)}
          max={500000}
          step={1000}
        />
        <SliderInput
          label="Effective tax rate"
          value={scenario.finance.taxRatePct}
          onChange={(v) => setFinance('taxRatePct', v)}
          min={0}
          max={55}
          step={1}
          suffix="%"
          hint="Blended rate applied to gross income to get take-home pay"
        />
        <MoneyInput
          label="Monthly living costs"
          value={scenario.finance.monthlyLivingCosts}
          onChange={(v) => setFinance('monthlyLivingCosts', v)}
          max={10000}
          step={50}
          suffix="/mo"
          hint="Rent/cost of living wherever you're based, food, general spending"
        />
      </Section>

      <Section title="Cedar Cottage" subtitle="Applies whatever you choose above — sold or moved-into fields are ignored in the maths">
        <MoneyInput label="Current value" value={scenario.finance.cedarCottage.value} onChange={(v) => setCedar('value', v)} max={1500000} step={5000} />
        <MoneyInput
          label="Mortgage balance"
          value={scenario.finance.cedarCottage.mortgageBalance}
          onChange={(v) => setCedar('mortgageBalance', v)}
          max={1500000}
          step={2500}
        />
        <SliderInput
          label="Mortgage rate"
          value={scenario.finance.cedarCottage.mortgageRate}
          onChange={(v) => setCedar('mortgageRate', v)}
          min={0}
          max={12}
          step={0.05}
          suffix="%"
        />
        <SliderInput
          label="Mortgage term"
          value={scenario.finance.cedarCottage.mortgageTermYears}
          onChange={(v) => setCedar('mortgageTermYears', v)}
          min={1}
          max={40}
          step={1}
          suffix="yrs"
        />
        {cedarDecision !== 'sell' && cedarDecision !== 'moveIn' && (
          <MoneyInput
            label="Rental income"
            value={scenario.finance.cedarCottage.rentalIncomeMonthly}
            onChange={(v) => setCedar('rentalIncomeMonthly', v)}
            max={5000}
            step={25}
            suffix="/mo"
          />
        )}
        {cedarDecision !== 'sell' && (
          <>
            <MoneyInput
              label="Maintenance"
              value={scenario.finance.cedarCottage.maintenanceMonthly}
              onChange={(v) => setCedar('maintenanceMonthly', v)}
              max={2000}
              step={10}
              suffix="/mo"
            />
            {cedarDecision !== 'moveIn' && (
              <MoneyInput
                label="Management fees"
                value={scenario.finance.cedarCottage.managementFeesMonthly}
                onChange={(v) => setCedar('managementFeesMonthly', v)}
                max={2000}
                step={10}
                suffix="/mo"
              />
            )}
            <MoneyInput
              label="Service charges"
              value={scenario.finance.cedarCottage.serviceChargesMonthly}
              onChange={(v) => setCedar('serviceChargesMonthly', v)}
              max={2000}
              step={10}
              suffix="/mo"
            />
          </>
        )}
        {cedarDecision === 'refinance' && (
          <MoneyInput
            label="Equity released"
            value={scenario.finance.cedarCottage.equityReleased}
            onChange={(v) => setCedar('equityReleased', v)}
            max={500000}
            step={1000}
            hint="Cash drawn out — added to savings and added to the mortgage balance"
          />
        )}
        {cedarDecision === 'sell' && (
          <SliderInput
            label="Selling costs"
            value={scenario.finance.cedarCottage.sellingCostsPct}
            onChange={(v) => setCedar('sellingCostsPct', v)}
            min={0}
            max={10}
            step={0.5}
            suffix="%"
            hint="Agent fees, legal fees etc, as a % of sale value"
          />
        )}
      </Section>

      <Section
        title="Second property"
        subtitle={secondEnabled ? undefined : "Set “Do I buy another property?” above to Auckland, Jersey or UK to enable"}
        defaultOpen={secondEnabled}
      >
        <MoneyInput
          label="Purchase price"
          value={scenario.finance.secondProperty.purchasePrice}
          onChange={(v) => setSecond('purchasePrice', v)}
          max={1500000}
          step={5000}
        />
        <MoneyInput
          label="Current / expected value"
          value={scenario.finance.secondProperty.value}
          onChange={(v) => setSecond('value', v)}
          max={1500000}
          step={5000}
        />
        <MoneyInput label="Deposit" value={scenario.finance.secondProperty.deposit} onChange={(v) => setSecond('deposit', v)} max={1000000} step={1000} />
        <MoneyInput
          label="Purchase taxes & fees"
          value={scenario.finance.secondProperty.purchaseCosts}
          onChange={(v) => setSecond('purchaseCosts', v)}
          max={200000}
          step={500}
        />
        <MoneyInput
          label="Mortgage amount"
          value={scenario.finance.secondProperty.mortgageBalance}
          onChange={(v) => setSecond('mortgageBalance', v)}
          max={1500000}
          step={2500}
        />
        <SliderInput
          label="Mortgage rate"
          value={scenario.finance.secondProperty.mortgageRate}
          onChange={(v) => setSecond('mortgageRate', v)}
          min={0}
          max={12}
          step={0.05}
          suffix="%"
        />
        <SliderInput
          label="Mortgage term"
          value={scenario.finance.secondProperty.mortgageTermYears}
          onChange={(v) => setSecond('mortgageTermYears', v)}
          min={1}
          max={40}
          step={1}
          suffix="yrs"
        />
        <MoneyInput
          label="Rental income"
          value={scenario.finance.secondProperty.rentalIncomeMonthly}
          onChange={(v) => setSecond('rentalIncomeMonthly', v)}
          max={5000}
          step={25}
          suffix="/mo"
        />
        <MoneyInput
          label="Maintenance"
          value={scenario.finance.secondProperty.maintenanceMonthly}
          onChange={(v) => setSecond('maintenanceMonthly', v)}
          max={2000}
          step={10}
          suffix="/mo"
        />
        <MoneyInput
          label="Management fees"
          value={scenario.finance.secondProperty.managementFeesMonthly}
          onChange={(v) => setSecond('managementFeesMonthly', v)}
          max={2000}
          step={10}
          suffix="/mo"
        />
        <MoneyInput
          label="Service charges"
          value={scenario.finance.secondProperty.serviceChargesMonthly}
          onChange={(v) => setSecond('serviceChargesMonthly', v)}
          max={2000}
          step={10}
          suffix="/mo"
        />
      </Section>

      <Section title="Career break, drama school & travel">
        <SliderInput
          label="Career break duration"
          value={scenario.finance.careerBreakMonths}
          onChange={(v) => setFinance('careerBreakMonths', v)}
          min={0}
          max={36}
          step={1}
          suffix="mo"
          hint="Income drops to £0 for this many months from today"
        />
        <SliderInput
          label="Trips per year (NZ ⇄ UK)"
          value={scenario.finance.tripsPerYear}
          onChange={(v) => setFinance('tripsPerYear', v)}
          min={0}
          max={12}
          step={1}
        />
        <MoneyInput
          label="Cost per trip"
          value={scenario.finance.travelCostPerTrip}
          onChange={(v) => setFinance('travelCostPerTrip', v)}
          max={5000}
          step={50}
        />
        {actingDecision === 'dramaSchool' && (
          <>
            <MoneyInput
              label="Drama school cost"
              value={scenario.finance.dramaSchoolCostAnnual}
              onChange={(v) => setFinance('dramaSchoolCostAnnual', v)}
              max={50000}
              step={500}
              suffix="/yr"
            />
            <SliderInput
              label="Drama school duration"
              value={scenario.finance.dramaSchoolYears}
              onChange={(v) => setFinance('dramaSchoolYears', v)}
              min={0}
              max={5}
              step={0.5}
              suffix="yrs"
            />
          </>
        )}
      </Section>

      <Section title="One-off costs" defaultOpen={scenario.finance.oneOffCosts.length > 0}>
        <div className="sm:col-span-2 flex flex-col gap-3">
          {scenario.finance.oneOffCosts.length === 0 && <p className="text-xs text-slate-500">No one-off costs added yet.</p>}
          {scenario.finance.oneOffCosts.map((cost) => (
            <div key={cost.id} className="flex flex-wrap items-center gap-2 rounded border border-slate-200 bg-slate-50 p-2">
              <input
                value={cost.label}
                onChange={(e) =>
                  setFinance(
                    'oneOffCosts',
                    scenario.finance.oneOffCosts.map((c) => (c.id === cost.id ? { ...c, label: e.target.value } : c)),
                  )
                }
                placeholder="Label"
                className="min-w-0 flex-1 rounded border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900 focus:border-blue-400 focus:outline-none"
              />
              <div className="w-40">
                <MoneyInput
                  label=""
                  value={cost.amount}
                  onChange={(v: Money) =>
                    setFinance('oneOffCosts', scenario.finance.oneOffCosts.map((c) => (c.id === cost.id ? { ...c, amount: v } : c)))
                  }
                  hideSlider
                />
              </div>
              <input
                type="number"
                value={cost.monthOffset}
                onChange={(e) =>
                  setFinance(
                    'oneOffCosts',
                    scenario.finance.oneOffCosts.map((c) => (c.id === cost.id ? { ...c, monthOffset: Number(e.target.value) } : c)),
                  )
                }
                title="Months from now"
                className="w-16 rounded border border-slate-300 bg-white px-2 py-1 text-right text-sm text-slate-900 focus:border-blue-400 focus:outline-none"
              />
              <span className="text-xs text-slate-500">mo</span>
              <button
                onClick={() => setFinance('oneOffCosts', scenario.finance.oneOffCosts.filter((c) => c.id !== cost.id))}
                className="rounded px-2 py-1 text-xs text-rose-600 hover:bg-rose-50"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={() =>
              setFinance('oneOffCosts', [
                ...scenario.finance.oneOffCosts,
                { id: uuid(), label: 'New cost', amount: { amount: 1000, currency: 'GBP' }, monthOffset: 0 },
              ])
            }
            className="self-start rounded border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-blue-400 hover:text-blue-600"
          >
            + Add one-off cost
          </button>
        </div>
      </Section>

      <Section title="Assumptions & display currency" defaultOpen={false}>
        <SliderInput
          label="Property appreciation"
          value={scenario.finance.propertyAppreciationPct}
          onChange={(v) => setFinance('propertyAppreciationPct', v)}
          min={-10}
          max={15}
          step={0.5}
          suffix="%/yr"
        />
        <SliderInput
          label="Rent growth"
          value={scenario.finance.rentGrowthPct}
          onChange={(v) => setFinance('rentGrowthPct', v)}
          min={-10}
          max={15}
          step={0.5}
          suffix="%/yr"
        />
        <SliderInput
          label="Projection horizon"
          value={scenario.finance.projectionYears}
          onChange={(v) => setFinance('projectionYears', v)}
          min={1}
          max={40}
          step={1}
          suffix="yrs"
        />
        <div>
          <p className="mb-1.5 text-xs font-medium text-slate-600">Show totals for this scenario in</p>
          <div className="flex gap-1.5">
            {(['default', 'GBP', 'NZD'] as const).map((choice) => (
              <button
                key={choice}
                type="button"
                onClick={() => setFinance('displayCurrency', choice)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  scenario.finance.displayCurrency === choice
                    ? 'border-blue-500 bg-blue-600 text-white'
                    : 'border-slate-300 bg-white text-slate-600 hover:border-blue-300'
                }`}
              >
                {choice === 'default' ? 'Global default' : choice}
              </button>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Life & story" subtitle="Qualitative read on this life — entirely your own judgement">
        <div className="sm:col-span-2">
          <AxisScoreEditor scenario={scenario} onChange={setAxis} />
        </div>
        <BulletListEditor label="Biggest advantages" items={scenario.qualitative.pros} onChange={(v) => setQualitative('pros', v)} accent="text-emerald-600" />
        <BulletListEditor label="Biggest drawbacks" items={scenario.qualitative.cons} onChange={(v) => setQualitative('cons', v)} accent="text-rose-600" />
        <div className="sm:col-span-2">
          <BulletListEditor label="Trade-offs" items={scenario.qualitative.tradeoffs} onChange={(v) => setQualitative('tradeoffs', v)} />
        </div>
        <div className="sm:col-span-2">
          <ImpactEditor impacts={scenario.qualitative.impacts} onChange={setImpact} />
        </div>
      </Section>
    </div>
  )
}
