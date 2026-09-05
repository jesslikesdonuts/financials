import { v4 as uuid } from 'uuid'
import type { Scenario } from './types'

export const SCENARIO_COLORS = ['#5b8def', '#e8845c', '#5cb88a', '#c77dd1', '#d9c25c', '#6fc2d9']

export function blankScenario(name: string, color: string): Scenario {
  return {
    id: uuid(),
    name,
    color,
    monthlyIncome: 4200,

    propertyValue: 420000,
    existingMortgageBalance: 240000,
    refinanceAmount: 0,
    mortgageRate: 4.5,
    mortgageTermYears: 25,

    rentalIncome: 0,
    managementFeesMonthly: 0,
    maintenanceAllowanceMonthly: 100,

    secondPropertyEnabled: false,
    secondPropertyPrice: 260000,
    deposit: 52000,
    purchaseTaxesFees: 10000,
    secondMortgageAmount: 208000,
    secondMortgageRate: 4.8,
    secondMortgageTermYears: 25,
    serviceChargesMonthly: 150,

    currentSavings: 80000,
    annualSavingsRatePct: 15,

    careerBreakMonths: 0,

    oneOffCosts: [],

    propertyAppreciationPct: 3,
    rentGrowthPct: 2,
    projectionYears: 20,
  }
}

export function seedScenarios(): Scenario[] {
  const stayPut = blankScenario('Stay put', SCENARIO_COLORS[0])

  const buyRental: Scenario = {
    ...blankScenario('Buy a rental property', SCENARIO_COLORS[1]),
    secondPropertyEnabled: true,
    rentalIncome: 1450,
    managementFeesMonthly: 145,
    maintenanceAllowanceMonthly: 120,
    currentSavings: 90000,
  }

  const careerBreak: Scenario = {
    ...blankScenario('Refinance + 12-month career break', SCENARIO_COLORS[2]),
    refinanceAmount: 260000,
    mortgageRate: 4.2,
    careerBreakMonths: 12,
    currentSavings: 60000,
    annualSavingsRatePct: 10,
    oneOffCosts: [{ id: uuid(), label: 'Refinance arrangement fee', amount: 1500, monthOffset: 0 }],
  }

  return [stayPut, buyRental, careerBreak]
}
