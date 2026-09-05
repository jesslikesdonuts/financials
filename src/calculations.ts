import { suggestedAxisScores } from './decisionCategories'
import { convert, resolveDisplayCurrency } from './currency'
import type {
  Currency,
  GlobalSettings,
  LifeAxis,
  Money,
  ProjectionPoint,
  Scenario,
  ScenarioMetrics,
  StressSettings,
} from './types'
import { LIFE_AXES } from './types'

export function mortgagePayment(principal: number, annualRatePct: number, termYears: number): number {
  if (principal <= 0 || termYears <= 0) return 0
  const r = annualRatePct / 100 / 12
  const n = termYears * 12
  if (r === 0) return principal / n
  return (principal * r) / (1 - Math.pow(1 + r, -n))
}

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

export function computeMetrics(
  scenario: Scenario,
  settings: GlobalSettings,
  stress: StressSettings,
  forceCurrency?: Currency,
): ScenarioMetrics {
  const display = forceCurrency ?? resolveDisplayCurrency(scenario.finance.displayCurrency, settings)
  const toDisplay = (m: Money) => convert(m, display, settings)

  const rateShock = stress.enabled ? stress.rateShockPct : 0
  const vacancy = stress.enabled ? stress.vacancyPct / 100 : 0
  const priceShock = stress.enabled ? stress.propertyPriceChangePct / 100 : 0
  const incomeLoss = stress.enabled ? stress.incomeLossPct / 100 : 0

  const { finance, decisions } = scenario
  const cedar = finance.cedarCottage
  const second = finance.secondProperty

  const cedarSold = decisions.cedarCottage === 'sell'
  const cedarRentedOut = decisions.cedarCottage === 'keepRenting' || decisions.cedarCottage === 'refinance'
  const secondEnabled = decisions.secondProperty !== 'none'

  const cedarBalanceBase = toDisplay(cedar.mortgageBalance) + (decisions.cedarCottage === 'refinance' ? toDisplay(cedar.equityReleased) : 0)
  const cedarValue = toDisplay(cedar.value) * (1 + priceShock)
  const cedarBalance = cedarSold ? 0 : cedarBalanceBase
  const cedarMortgagePayment = cedarSold ? 0 : mortgagePayment(cedarBalance, cedar.mortgageRate + rateShock, cedar.mortgageTermYears)
  const cedarRent = cedarSold || !cedarRentedOut ? 0 : toDisplay(cedar.rentalIncomeMonthly) * (1 - vacancy)
  const cedarRunningCosts = cedarSold
    ? 0
    : toDisplay(cedar.maintenanceMonthly) + toDisplay(cedar.serviceChargesMonthly) + (cedarRentedOut ? toDisplay(cedar.managementFeesMonthly) : 0)
  const cedarEquity = cedarSold ? 0 : cedarValue - cedarBalance
  const cedarSaleProceeds = cedarSold ? cedarValue - toDisplay(cedar.mortgageBalance) - (cedarValue * cedar.sellingCostsPct) / 100 : 0

  const secondBalance = secondEnabled ? toDisplay(second.mortgageBalance) : 0
  const secondValue = secondEnabled ? toDisplay(second.value) * (1 + priceShock) : 0
  const secondMortgagePayment = secondEnabled ? mortgagePayment(secondBalance, second.mortgageRate + rateShock, second.mortgageTermYears) : 0
  const secondRent = secondEnabled ? toDisplay(second.rentalIncomeMonthly) * (1 - vacancy) : 0
  const secondRunningCosts = secondEnabled
    ? toDisplay(second.maintenanceMonthly) + toDisplay(second.serviceChargesMonthly) + toDisplay(second.managementFeesMonthly)
    : 0
  const secondEquity = secondEnabled ? secondValue - secondBalance : 0
  const secondUpfront = secondEnabled ? toDisplay(second.deposit) + toDisplay(second.purchaseCosts) : 0

  const totalMonthlyMortgagePayment = cedarMortgagePayment + secondMortgagePayment
  const totalRentalIncome = cedarRent + secondRent
  const totalRunningCosts = cedarRunningCosts + secondRunningCosts

  const travelMonthly = (finance.tripsPerYear * toDisplay(finance.travelCostPerTrip)) / 12
  const dramaSchoolMonthly = decisions.acting === 'dramaSchool' ? toDisplay(finance.dramaSchoolCostAnnual) / 12 : 0

  const monthlyOutgoings = totalMonthlyMortgagePayment + totalRunningCosts + toDisplay(finance.monthlyLivingCosts) + travelMonthly + dramaSchoolMonthly

  const onCareerBreak = finance.careerBreakMonths > 0
  const effectiveIncomeGross = onCareerBreak ? 0 : toDisplay(finance.incomeMonthlyGross) * (1 - incomeLoss)
  const effectiveIncomeNet = effectiveIncomeGross * (1 - finance.taxRatePct / 100)

  const monthlySurplus = effectiveIncomeNet + totalRentalIncome - monthlyOutgoings

  const requiredIncomeNet = monthlyOutgoings - totalRentalIncome
  const requiredIncomeMonthlyGross = requiredIncomeNet <= 0 ? 0 : requiredIncomeNet / (1 - finance.taxRatePct / 100)

  const totalDebt = cedarBalance + secondBalance
  const totalPropertyEquity = cedarEquity + secondEquity

  const upfrontOneOff = finance.oneOffCosts.reduce((sum, c) => sum + toDisplay(c.amount), 0)
  const cashAvailable = toDisplay(finance.savings) + cedarSaleProceeds - secondUpfront - upfrontOneOff

  const netWorth = totalPropertyEquity + cashAvailable

  const monthlyBurn = -monthlySurplus
  const cashRunwayMonths = monthlyBurn <= 0 ? Infinity : cashAvailable <= 0 ? 0 : cashAvailable / monthlyBurn

  return {
    displayCurrency: display,
    cedarMortgagePayment,
    secondMortgagePayment,
    totalMonthlyMortgagePayment,
    netWorth,
    totalPropertyEquity,
    totalDebt,
    monthlySurplus,
    requiredIncomeMonthlyGross,
    cashRunwayMonths,
    cashAvailable,
  }
}

export function projectSeries(
  scenario: Scenario,
  settings: GlobalSettings,
  stress: StressSettings,
  forceCurrency?: Currency,
): ProjectionPoint[] {
  const metrics = computeMetrics(scenario, settings, stress, forceCurrency)
  const display = metrics.displayCurrency
  const toDisplay = (m: Money) => convert(m, display, settings)

  const rateShock = stress.enabled ? stress.rateShockPct : 0
  const vacancy = stress.enabled ? stress.vacancyPct / 100 : 0
  const priceShock = stress.enabled ? stress.propertyPriceChangePct / 100 : 0
  const incomeLoss = stress.enabled ? stress.incomeLossPct / 100 : 0

  const { finance, decisions } = scenario
  const cedar = finance.cedarCottage
  const second = finance.secondProperty

  const cedarSold = decisions.cedarCottage === 'sell'
  const cedarRentedOut = decisions.cedarCottage === 'keepRenting' || decisions.cedarCottage === 'refinance'
  const secondEnabled = decisions.secondProperty !== 'none'

  const cedarPrincipal = cedarSold ? 0 : toDisplay(cedar.mortgageBalance) + (decisions.cedarCottage === 'refinance' ? toDisplay(cedar.equityReleased) : 0)
  const cedarRate = cedar.mortgageRate + rateShock
  const secondPrincipal = secondEnabled ? toDisplay(second.mortgageBalance) : 0
  const secondRate = second.mortgageRate + rateShock

  const months = Math.max(1, Math.round(finance.projectionYears * 12))
  const appreciationMonthly = Math.pow(1 + finance.propertyAppreciationPct / 100, 1 / 12)
  const rentGrowthMonthly = Math.pow(1 + finance.rentGrowthPct / 100, 1 / 12)

  let cedarValue = cedarSold ? 0 : toDisplay(cedar.value) * (1 + priceShock)
  let secondValue = secondEnabled ? toDisplay(second.value) * (1 + priceShock) : 0
  let cedarRent = cedarSold || !cedarRentedOut ? 0 : toDisplay(cedar.rentalIncomeMonthly)
  let secondRent = secondEnabled ? toDisplay(second.rentalIncomeMonthly) : 0
  let savings = metrics.cashAvailable

  const dramaSchoolMonths = decisions.acting === 'dramaSchool' ? Math.round(finance.dramaSchoolYears * 12) : 0
  const dramaSchoolMonthlyCost = toDisplay(finance.dramaSchoolCostAnnual) / 12
  const travelMonthly = (finance.tripsPerYear * toDisplay(finance.travelCostPerTrip)) / 12
  const livingCosts = toDisplay(finance.monthlyLivingCosts)

  const cedarRunningCosts = cedarSold
    ? 0
    : toDisplay(cedar.maintenanceMonthly) + toDisplay(cedar.serviceChargesMonthly) + (cedarRentedOut ? toDisplay(cedar.managementFeesMonthly) : 0)
  const secondRunningCosts = secondEnabled
    ? toDisplay(second.maintenanceMonthly) + toDisplay(second.serviceChargesMonthly) + toDisplay(second.managementFeesMonthly)
    : 0

  const points: ProjectionPoint[] = []

  for (let m = 0; m <= months; m++) {
    const cedarBalance = cedarSold ? 0 : remainingBalance(cedarPrincipal, cedarRate, cedar.mortgageTermYears, m)
    const secondBalance = secondEnabled ? remainingBalance(secondPrincipal, secondRate, second.mortgageTermYears, m) : 0
    const totalDebt = cedarBalance + secondBalance
    const totalValue = cedarValue + secondValue
    const equity = totalValue - totalDebt

    const onBreak = m < finance.careerBreakMonths
    const income = onBreak ? 0 : toDisplay(finance.incomeMonthlyGross) * (1 - incomeLoss)
    const incomeNet = income * (1 - finance.taxRatePct / 100)

    const onDramaSchool = dramaSchoolMonths > 0 && m < dramaSchoolMonths
    const dramaSchoolCostThisMonth = onDramaSchool ? dramaSchoolMonthlyCost : 0

    const cedarPayment = cedarSold ? 0 : mortgagePayment(cedarPrincipal, cedarRate, cedar.mortgageTermYears)
    const secondPayment = secondEnabled ? mortgagePayment(secondPrincipal, secondRate, second.mortgageTermYears) : 0
    const effectiveCedarRent = cedarSold || !cedarRentedOut ? 0 : cedarRent * (1 - vacancy)
    const effectiveSecondRent = secondEnabled ? secondRent * (1 - vacancy) : 0

    const monthlyOutgoings =
      cedarPayment + secondPayment + cedarRunningCosts + secondRunningCosts + livingCosts + travelMonthly + dramaSchoolCostThisMonth
    const monthlySurplus = incomeNet + effectiveCedarRent + effectiveSecondRent - monthlyOutgoings

    const oneOffThisMonth = finance.oneOffCosts
      .filter((c) => c.monthOffset === m)
      .reduce((sum, c) => sum + toDisplay(c.amount), 0)

    if (m > 0) {
      savings += monthlySurplus - oneOffThisMonth
      cedarValue *= appreciationMonthly
      secondValue *= appreciationMonthly
      cedarRent *= rentGrowthMonthly
      secondRent *= rentGrowthMonthly
    }

    points.push({
      month: m,
      year: m / 12,
      totalDebt,
      propertyValue: totalValue,
      equity,
      savings,
      netWorth: equity + savings,
    })
  }

  return points
}

/** Weighted 0-10 life score from axis scores (override or suggested) and global importance weights. */
export function computeLifeScore(scenario: Scenario, settings: GlobalSettings): number {
  const suggested = suggestedAxisScores(scenario.decisions)
  let weightedSum = 0
  let weightTotal = 0
  LIFE_AXES.forEach((axis) => {
    const score = scenario.qualitative.axisScoreOverrides[axis] ?? suggested[axis]
    const weight = settings.axisWeights[axis]
    weightedSum += score * weight
    weightTotal += weight
  })
  return weightTotal === 0 ? 0 : weightedSum / weightTotal
}

export function getAxisScore(scenario: Scenario, axis: LifeAxis): number {
  const suggested = suggestedAxisScores(scenario.decisions)
  return scenario.qualitative.axisScoreOverrides[axis] ?? suggested[axis]
}

export function isAxisOverridden(scenario: Scenario, axis: LifeAxis): boolean {
  return scenario.qualitative.axisScoreOverrides[axis] !== undefined
}

export function formatCurrencyGeneric(value: number, currency: Currency): string {
  if (!isFinite(value)) return value > 0 ? '∞' : '−∞'
  return new Intl.NumberFormat(currency === 'GBP' ? 'en-GB' : 'en-NZ', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}
