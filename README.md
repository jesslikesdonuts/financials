# Life Scenario Modeller

A client-side web app for building and comparing possible lives — combinations of
where you live, what you do for work, what happens to a property, whether you
buy another one, what you do about acting, and how often you travel — and
seeing what each combination looks like both financially and personally.
Everything runs in the browser; there is no backend and no authentication.
Data is stored in `localStorage` only.

The core question this app answers: **if I choose this combination of
decisions, what does that life look like?**

## Running it

```bash
npm install
npm run dev      # local dev server
npm run build    # production build to dist/
```

## How it's organised

Each **scenario** ("life") is a combination of:

1. **Decisions** — one choice per category: where you live, work, what happens
   to Cedar Cottage, whether you buy a second property, what you do about
   acting, and how often you travel between NZ and the UK. Configured in
   `src/decisionCategories.ts` — easy to extend with more options later.
2. **Finance** — every quantitative assumption (income, savings, both
   properties' mortgages/rent/running costs, career-break length, drama
   school costs, travel costs, one-off costs, tax rate, growth assumptions).
   Decisions only control which fields are *relevant* (e.g. rental income is
   hidden once you've sold Cedar Cottage) — they never silently drive the
   numbers. Every number is directly editable.
3. **Qualitative read** — six life-axis scores (Freedom, Security, Creativity,
   Connection, Growth, Optionality), editable pros/cons/trade-off lists, and a
   rating + note for five impact areas (friends & family, acting, work
   satisfaction, Beans/relocation, geographic flexibility). Axis scores get a
   *suggested* starting point from the decisions you picked, but that's only
   ever a suggestion — override any of them, and the app never presents these
   as objective facts.

### Multi-currency (GBP/NZD)

Every financial field stores its own amount **and** currency — e.g. a Chorus
salary in NZD sits alongside a Cedar Cottage mortgage in GBP within the same
scenario. A single editable exchange rate assumption (no live API) converts
between them. You can view totals in GBP or NZD:

- globally, via the settings panel, or
- per scenario, via a "Global default / GBP / NZD" override in that
  scenario's Assumptions section, or
- just for the Compare tab, via a currency toggle at the top of the financial
  comparison table (this always applies to *every* scenario shown, since
  comparing raw numbers in different currencies side by side would be
  misleading otherwise).

### Calculations (`src/calculations.ts`)

- **Monthly mortgage payments** — standard amortizing-loan formula, applied
  to Cedar Cottage and any second property.
- **Net worth** — total property equity + cash available.
- **Total property equity / total debt** — property values vs. mortgage
  balances, both zeroed out for Cedar Cottage if you've sold it.
- **Monthly surplus/deficit** — take-home income (after tax and any career
  break) + rental income − all outgoings (mortgages, running costs, living
  costs, travel, drama school).
- **Required income (gross)** — the pre-tax income you'd need to break even
  each month, given everything else in the scenario.
- **Cash runway** — months your available cash covers if outgoings exceed
  all incoming money, under the scenario's career break and any active
  stress settings.
- Selling Cedar Cottage adds net sale proceeds to cash and removes it from
  equity/debt; refinancing lets you release equity as cash while it's added
  to the mortgage balance.

### Stress testing

A global panel applies a mortgage-rate shock, rental vacancy, a one-off
property price change, and an employment income loss (0–100%) to every
scenario shown at once, so you can compare baseline vs. stressed outcomes
directly.

## Structure

```
src/
  types.ts                data model: Money, Decisions, Scenario, GlobalSettings
  decisionCategories.ts    the 6 decision categories/options + axis-nudge suggestions
  currency.ts              Money conversion & formatting
  calculations.ts          pure calculation + projection functions
  defaultScenarios.ts      seed "lives" shown on first load
  hooks/useLocalStorage.ts
  components/
    Sidebar.tsx             scenario list: select, tick to compare, duplicate/delete
    ScenarioEditor.tsx       "Build" tab — decisions, finance, qualitative editing
    DecisionPicker.tsx       segmented buttons per decision category
    MoneyInput.tsx           amount + currency toggle input
    AxisScoreEditor.tsx      life-axis sliders with suggested-vs-override
    BulletListEditor.tsx     editable pros/cons/trade-off lists
    ImpactEditor.tsx         rating + note per impact area
    Dashboard.tsx            "This Life" tab — financial metrics/charts + LifeSummary
    LifeSummary.tsx          decision recap, radar chart, pros/cons, impact badges
    ComparisonView.tsx       "Compare Lives" tab — financial + life comparison
    GlobalSettingsPanel.tsx  currency, exchange rate, importance weighting
    StressTestPanel.tsx      global stress sliders
    charts/                  recharts-based chart components (incl. radar + life score)
```

No data ever leaves the browser.
