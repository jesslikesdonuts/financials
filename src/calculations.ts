import type { ProjectionPoint, Scenario, ScenarioMetrics, StressSettings } from './types'

/** Standard amortizing loan payment. Returns 0 for a non-positive principal. */
export function mortgagePayment(principal: number, annualRatePct: number, termYears: number): number {
  if (principal <= 0 || termYears <= 0) return 0
  const r = annualRatePct / 100 / 12
  const n = termYears * 12
  if (r === 0) return principal / n
  return (principal * r) / (1 - Math.pow(1 + r, -n))
}

/** Remaining balance of an amortizing loan after `monthsElapsed` payments. */
export function remainingBalance(
  principal: number,
  annualRatePct: number,
  termYears: number,
  monthsElapsed: number,
): number {
  if (principal <= 0) return 0
  const r = annualRatePct / 100 / 12
  const n = termYears * 12
  const m = Math.min(monthsElapsed, n)
  if (r === 0) return Math.max(0, principal * (1 - m / n))
  const payment = mortgagePayment(principal, annualRatePct, termYears)
  const balance = principal * Math.pow(1 + r, m) - (payment * (Math.pow(1 + r, m) - 1)) / r
  return Math.max(0, balance)
}

export function sumOneOffCosts(scenario: Scenario, upToMonth?: number): number {
  return scenario.oneOffCosts
    .filter((c) => (upToMonth === undefined ? true : c.monthOffset <= upToMonth))
    .reduce((sum, c) => sum + c.amount, 0)
}

export function computeMetrics(scenario: Scenario, stress: StressSettings): ScenarioMetrics {
  const rateShock = stress.enabled ? stress.rateShockPct : 0
  const vacancy = stress.enabled ? stress.vacancyPct / 100 : 0
  const priceShock = stress.enabled ? stress.propertyPriceChangePct / 100 : 0
  const incomeLoss = stress.enabled ? stress.incomeLossPct / 100 : 0

  const primaryMortgageBalance =
    scenario.refinanceAmount > 0 ? scenario.refinanceAmount : scenario.existingMortgageBalance
  const primaryMonthlyPayment = mortgagePayment(
    primaryMortgageBalance,
    scenario.mortgageRate + rateShock,
    scenario.mortgageTermYears,
  )

  const secondMortgageBalance = scenario.secondPropertyEnabled ? scenario.secondMortgageAmount : 0
  const secondMonthlyPayment = scenario.secondPropertyEnabled
    ? mortgagePayment(secondMortgageBalance, scenario.secondMortgageRate + rateShock, scenario.secondMortgageTermYears)
    : 0

  const totalMonthlyMortgagePayment = primaryMonthlyPayment + secondMonthlyPayment

  const effectiveRentalIncome = scenario.rentalIncome * (1 - vacancy)
  const serviceCharges = scenario.secondPropertyEnabled ? scenario.serviceChargesMonthly : 0
  const monthlyPropertyCashflow =
    effectiveRentalIncome -
    scenario.managementFeesMonthly -
    scenario.maintenanceAllowanceMonthly -
    serviceCharges -
    totalMonthlyMortgagePayment
  const annualPropertyCashflow = monthlyPropertyCashflow * 12

  const totalDebt = primaryMortgageBalance + secondMortgageBalance
  const primaryValue = scenario.propertyValue * (1 + priceShock)
  const secondValue = scenario.secondPropertyEnabled ? scenario.secondPropertyPrice * (1 + priceShock) : 0
  const totalPropertyValue = primaryValue + secondValue
  const totalEquity = totalPropertyValue - totalDebt

  const purchaseUpfront = scenario.secondPropertyEnabled ? scenario.deposit + scenario.purchaseTaxesFees : 0
  const upfrontCosts = purchaseUpfront + sumOneOffCosts(scenario)
  const cashRemainingAfterPurchases = scenario.currentSavings - upfrontCosts

  const onCareerBreak = scenario.careerBreakMonths > 0
  const effectiveMonthlyIncome = onCareerBreak ? 0 : scenario.monthlyIncome * (1 - incomeLoss)

  const monthlyHouseholdCashflow = effectiveMonthlyIncome + monthlyPropertyCashflow
  const monthlyBurn = -monthlyHouseholdCashflow
  const runwayMonths =
    monthlyBurn <= 0 ? Infinity : cashRemainingAfterPurchases <= 0 ? 0 : cashRemainingAfterPurchases / monthlyBurn

  return {
    primaryMortgageBalance,
    primaryMonthlyPayment,
    secondMortgageBalance,
    secondMonthlyPayment,
    totalMonthlyMortgagePayment,
    effectiveRentalIncome,
    monthlyPropertyCashflow,
    annualPropertyCashflow,
    totalDebt,
    totalPropertyValue,
    totalEquity,
    upfrontCosts,
    cashRemainingAfterPurchases,
    effectiveMonthlyIncome,
    monthlyHouseholdCashflow,
    monthlyBurn,
    runwayMonths,
  }
}

/** Month-by-month projection used to drive the dashboard charts. */
export function projectSeries(scenario: Scenario, stress: StressSettings): ProjectionPoint[] {
  const metrics = computeMetrics(scenario, stress)
  const rateShock = stress.enabled ? stress.rateShockPct : 0
  const vacancy = stress.enabled ? stress.vacancyPct / 100 : 0
  const priceShock = stress.enabled ? stress.propertyPriceChangePct / 100 : 0
  const incomeLoss = stress.enabled ? stress.incomeLossPct / 100 : 0

  const primaryRate = scenario.mortgageRate + rateShock
  const secondRate = scenario.secondMortgageRate + rateShock
  const months = Math.max(1, Math.round(scenario.projectionYears * 12))

  const appreciationMonthly = Math.pow(1 + scenario.propertyAppreciationPct / 100, 1 / 12)
  const rentGrowthMonthly = Math.pow(1 + scenario.rentGrowthPct / 100, 1 / 12)

  let propertyValue = metrics.totalPropertyValue > 0 ? scenario.propertyValue * (1 + priceShock) : 0
  let secondPropertyValue = scenario.secondPropertyEnabled ? scenario.secondPropertyPrice * (1 + priceShock) : 0
  let rent = scenario.rentalIncome
  let savings = metrics.cashRemainingAfterPurchases

  const points: ProjectionPoint[] = []

  for (let m = 0; m <= months; m++) {
    const primaryBalance = remainingBalance(metrics.primaryMortgageBalance, primaryRate, scenario.mortgageTermYears, m)
    const secondBalance = scenario.secondPropertyEnabled
      ? remainingBalance(metrics.secondMortgageBalance, secondRate, scenario.secondMortgageTermYears, m)
      : 0
    const totalDebt = primaryBalance + secondBalance
    const totalValue = propertyValue + secondPropertyValue
    const equity = totalValue - totalDebt

    const onBreak = m < scenario.careerBreakMonths
    const income = onBreak ? 0 : scenario.monthlyIncome * (1 - incomeLoss)
    const savingsContribution = income * (scenario.annualSavingsRatePct / 100)

    const effectiveRent = rent * (1 - vacancy)
    const serviceCharges = scenario.secondPropertyEnabled ? scenario.serviceChargesMonthly : 0
    const primaryPayment = mortgagePayment(metrics.primaryMortgageBalance, primaryRate, scenario.mortgageTermYears)
    const secondPayment = scenario.secondPropertyEnabled
      ? mortgagePayment(metrics.secondMortgageBalance, secondRate, scenario.secondMortgageTermYears)
      : 0
    const propertyCashflow =
      effectiveRent - scenario.managementFeesMonthly - scenario.maintenanceAllowanceMonthly - serviceCharges - primaryPayment - secondPayment

    const oneOffThisMonth = scenario.oneOffCosts
      .filter((c) => c.monthOffset === m)
      .reduce((sum, c) => sum + c.amount, 0)

    if (m > 0) {
      savings += savingsContribution + propertyCashflow - oneOffThisMonth
      propertyValue *= appreciationMonthly
      secondPropertyValue *= appreciationMonthly
      rent *= rentGrowthMonthly
    }

    points.push({
      month: m,
      year: m / 12,
      primaryBalance,
      secondBalance,
      totalDebt,
      propertyValue: totalValue,
      equity,
      savings,
      netWorth: equity + savings,
      cashflow: propertyCashflow + income,
    })
  }

  return points
}

export function formatCurrency(value: number, currency = 'GBP'): string {
  if (!isFinite(value)) return value > 0 ? '∞' : '−∞'
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatMonths(months: number): string {
  if (!isFinite(months)) return 'Surplus (no burn)'
  if (months <= 0) return '0 months'
  if (months >= 1200) return '100+ years'
  const years = Math.floor(months / 12)
  const rem = Math.round(months % 12)
  if (years === 0) return `${rem} mo`
  if (rem === 0) return `${years} yr`
  return `${years} yr ${rem} mo`
}
