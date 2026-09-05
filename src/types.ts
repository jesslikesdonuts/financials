export interface OneOffCost {
  id: string
  label: string
  amount: number
  /** months from now when the cost lands; 0 = immediate */
  monthOffset: number
}

export interface Scenario {
  id: string
  name: string
  color: string

  /** household take-home pay per month while working normally */
  monthlyIncome: number

  // --- Primary property & mortgage ---
  propertyValue: number
  existingMortgageBalance: number
  /** 0 = not refinancing; >0 replaces the existing balance with this new loan amount */
  refinanceAmount: number
  mortgageRate: number
  mortgageTermYears: number

  // --- Rental & running costs ---
  rentalIncome: number
  managementFeesMonthly: number
  maintenanceAllowanceMonthly: number

  // --- Second property ---
  secondPropertyEnabled: boolean
  secondPropertyPrice: number
  deposit: number
  purchaseTaxesFees: number
  secondMortgageAmount: number
  secondMortgageRate: number
  secondMortgageTermYears: number
  serviceChargesMonthly: number

  // --- Savings ---
  currentSavings: number
  annualSavingsRatePct: number

  // --- Career break ---
  careerBreakMonths: number

  // --- One-off costs ---
  oneOffCosts: OneOffCost[]

  // --- Editable assumptions ---
  propertyAppreciationPct: number
  rentGrowthPct: number
  projectionYears: number
}

export interface StressSettings {
  enabled: boolean
  /** added to all mortgage rates, percentage points, e.g. +2 */
  rateShockPct: number
  /** % of the year the rental sits vacant, 0-100 */
  vacancyPct: number
  /** one-off shock applied to current property values, e.g. -10 */
  propertyPriceChangePct: number
  /** % reduction in monthly income, 0-100 (100 = full job loss) */
  incomeLossPct: number
}

export interface ScenarioMetrics {
  primaryMortgageBalance: number
  primaryMonthlyPayment: number
  secondMortgageBalance: number
  secondMonthlyPayment: number
  totalMonthlyMortgagePayment: number

  effectiveRentalIncome: number
  monthlyPropertyCashflow: number
  annualPropertyCashflow: number

  totalDebt: number
  totalPropertyValue: number
  totalEquity: number

  upfrontCosts: number
  cashRemainingAfterPurchases: number

  effectiveMonthlyIncome: number
  monthlyHouseholdCashflow: number
  monthlyBurn: number
  runwayMonths: number
}

export interface ProjectionPoint {
  month: number
  year: number
  primaryBalance: number
  secondBalance: number
  totalDebt: number
  propertyValue: number
  equity: number
  savings: number
  netWorth: number
  cashflow: number
}

export const DEFAULT_STRESS: StressSettings = {
  enabled: false,
  rateShockPct: 2,
  vacancyPct: 10,
  propertyPriceChangePct: -10,
  incomeLossPct: 100,
}
