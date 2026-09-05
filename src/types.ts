export type Currency = 'GBP' | 'NZD'

export interface Money {
  amount: number
  currency: Currency
}

export function money(amount: number, currency: Currency): Money {
  return { amount, currency }
}

// --- Life axes ---------------------------------------------------------

export type LifeAxis = 'freedom' | 'security' | 'creativity' | 'connection' | 'growth' | 'optionality'

export const LIFE_AXES: LifeAxis[] = ['freedom', 'security', 'creativity', 'connection', 'growth', 'optionality']

export const LIFE_AXIS_LABELS: Record<LifeAxis, string> = {
  freedom: 'Freedom',
  security: 'Security',
  creativity: 'Creativity',
  connection: 'Connection',
  growth: 'Growth',
  optionality: 'Optionality',
}

// --- Decisions -----------------------------------------------------------

export type DecisionCategoryId = 'location' | 'work' | 'cedarCottage' | 'secondProperty' | 'acting' | 'travel'

export interface DecisionOption {
  id: string
  label: string
  description?: string
  /** suggested nudge to each life axis if this option is picked, -3..+3, purely a starting suggestion */
  axisNudge?: Partial<Record<LifeAxis, number>>
}

export interface DecisionCategory {
  id: DecisionCategoryId
  question: string
  options: DecisionOption[]
}

export type Decisions = Record<DecisionCategoryId, string>

export type Rating = 'positive' | 'neutral' | 'negative'

export interface ImpactNote {
  rating: Rating
  note: string
}

export type ImpactAreaId =
  | 'friendsFamily'
  | 'acting'
  | 'workSatisfaction'
  | 'beans'
  | 'geographicFlexibility'

export const IMPACT_AREA_LABELS: Record<ImpactAreaId, string> = {
  friendsFamily: 'Friends & family proximity',
  acting: 'Acting opportunities',
  workSatisfaction: 'Work satisfaction',
  beans: 'Beans / relocation',
  geographicFlexibility: 'Geographic flexibility',
}

export const IMPACT_AREAS: ImpactAreaId[] = [
  'friendsFamily',
  'acting',
  'workSatisfaction',
  'beans',
  'geographicFlexibility',
]

// --- One-off costs ---------------------------------------------------------

export interface OneOffCost {
  id: string
  label: string
  amount: Money
  /** months from now when the cost lands; 0 = immediate */
  monthOffset: number
}

// --- Property block (shared shape for Cedar Cottage & second property) ----

export interface PropertyFinance {
  value: Money
  mortgageBalance: Money
  mortgageRate: number
  mortgageTermYears: number
  rentalIncomeMonthly: Money
  maintenanceMonthly: Money
  managementFeesMonthly: Money
  serviceChargesMonthly: Money
}

export interface SecondPropertyFinance extends PropertyFinance {
  purchasePrice: Money
  deposit: Money
  purchaseCosts: Money
}

export type DisplayCurrencyChoice = 'default' | Currency

export interface ScenarioFinance {
  incomeMonthlyGross: Money
  taxRatePct: number
  monthlyLivingCosts: Money
  savings: Money

  cedarCottage: PropertyFinance & {
    equityReleased: Money
    sellingCostsPct: number
  }

  secondProperty: SecondPropertyFinance

  careerBreakMonths: number

  dramaSchoolCostAnnual: Money
  dramaSchoolYears: number

  travelCostPerTrip: Money
  tripsPerYear: number

  oneOffCosts: OneOffCost[]

  propertyAppreciationPct: number
  rentGrowthPct: number
  projectionYears: number

  displayCurrency: DisplayCurrencyChoice
}

export interface ScenarioQualitative {
  /** explicit user overrides; axes not present here fall back to the suggested value from decisions */
  axisScoreOverrides: Partial<Record<LifeAxis, number>>
  pros: string[]
  cons: string[]
  tradeoffs: string[]
  impacts: Record<ImpactAreaId, ImpactNote>
}

export interface Scenario {
  id: string
  name: string
  color: string
  decisions: Decisions
  finance: ScenarioFinance
  qualitative: ScenarioQualitative
}

// --- Global settings --------------------------------------------------------

export interface GlobalSettings {
  /** how many NZD to 1 GBP, editable assumption, no live API */
  gbpToNzdRate: number
  displayCurrency: Currency
  axisWeights: Record<LifeAxis, number>
}

export const DEFAULT_GLOBAL_SETTINGS: GlobalSettings = {
  gbpToNzdRate: 2.15,
  displayCurrency: 'GBP',
  axisWeights: {
    freedom: 5,
    security: 5,
    creativity: 5,
    connection: 5,
    growth: 5,
    optionality: 5,
  },
}

export interface StressSettings {
  enabled: boolean
  rateShockPct: number
  vacancyPct: number
  propertyPriceChangePct: number
  incomeLossPct: number
}

export const DEFAULT_STRESS: StressSettings = {
  enabled: false,
  rateShockPct: 2,
  vacancyPct: 10,
  propertyPriceChangePct: -10,
  incomeLossPct: 100,
}

// --- Computed metrics --------------------------------------------------------

export interface ScenarioMetrics {
  displayCurrency: Currency
  cedarMortgagePayment: number
  secondMortgagePayment: number
  totalMonthlyMortgagePayment: number
  netWorth: number
  totalPropertyEquity: number
  totalDebt: number
  monthlySurplus: number
  requiredIncomeMonthlyGross: number
  cashRunwayMonths: number
  cashAvailable: number
}

export interface ProjectionPoint {
  month: number
  year: number
  totalDebt: number
  propertyValue: number
  equity: number
  savings: number
  netWorth: number
}
