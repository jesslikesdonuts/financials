# Financial Scenario Modeller

A client-side web app for comparing life scenarios involving property, mortgages,
rental income, refinancing, savings, and career breaks — side by side. Everything
runs in the browser; there is no backend and no authentication. Data is stored in
`localStorage` only.

## Running it

```bash
npm install
npm run dev      # local dev server
npm run build    # production build to dist/
```

## What it models

Each **scenario** is an independent set of assumptions:

- Household take-home income and savings rate
- A primary property, its mortgage (with an optional refinance), rate and term
- Rental income and running costs (management fees, maintenance)
- An optional second-property purchase (price, deposit, purchase taxes/fees,
  its own mortgage, service charges)
- Current savings and a career-break duration (income drops to £0 for that many
  months)
- Arbitrary one-off costs at a chosen number of months from today
- Editable projection assumptions: property appreciation, rent growth, horizon

### Calculations (`src/calculations.ts`)

- **Monthly mortgage payment** — standard amortizing-loan formula, applied
  separately to the primary and second mortgages and summed.
- **Monthly / annual property cashflow** — rental income (after any vacancy
  stress) minus management fees, maintenance, service charges, and mortgage
  payments.
- **Total debt / total equity** — outstanding mortgage balances vs. property
  values (after any price-shock stress).
- **Cash remaining after purchases** — current savings minus the second
  property's deposit + purchase taxes/fees minus any one-off costs.
- **Financial runway** — months your remaining cash covers if outgoings
  (mortgages, fees, maintenance) exceed all incoming money (rent + take-home
  income) under the scenario's career break and any active stress settings.
  Shown as "Surplus (no burn)" when the household cashflow is non-negative.
- Chart projections amortize both mortgages month-by-month, compound property
  values and rent at the assumption rates, and accumulate a savings balance
  from the discretionary savings rate plus property cashflow.

### Stress testing

A single global panel (right-hand side) applies four shocks to every visible
scenario at once: a mortgage rate shock (± percentage points), a rental
vacancy rate, a one-off property price change, and an employment income loss
(0–100%, where 100% is a full job loss). Toggle it on/off to compare baseline
vs. stressed outcomes.

## Structure

```
src/
  types.ts               scenario / stress / metrics types
  calculations.ts         pure calculation + projection functions
  defaultScenarios.ts     seed data shown on first load
  hooks/useLocalStorage.ts
  components/
    Sidebar.tsx            scenario list: select, tick to compare, duplicate/delete
    ScenarioEditor.tsx      sliders + numeric inputs, grouped by section
    Dashboard.tsx           single-scenario metrics + charts
    ComparisonView.tsx      side-by-side table + overlaid charts
    StressTestPanel.tsx     global stress sliders
    charts/                 recharts-based chart components
```

No data ever leaves the browser.
