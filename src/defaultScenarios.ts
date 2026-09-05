import { v4 as uuid } from 'uuid'
import { defaultDecisions } from './decisionCategories'
import { money } from './types'
import type { ImpactAreaId, ImpactNote, Money, Scenario } from './types'

export const SCENARIO_COLORS = ['#2563eb', '#c2410c', '#15803d', '#9333ea', '#a16207', '#0e7490']

function blankImpacts(): Record<ImpactAreaId, ImpactNote> {
  return {
    friendsFamily: { rating: 'neutral', note: '' },
    acting: { rating: 'neutral', note: '' },
    workSatisfaction: { rating: 'neutral', note: '' },
    beans: { rating: 'neutral', note: '' },
    geographicFlexibility: { rating: 'neutral', note: '' },
  }
}

function blankProperty(currency: 'GBP' | 'NZD' = 'GBP') {
  return {
    value: money(0, currency),
    mortgageBalance: money(0, currency),
    mortgageRate: 5,
    mortgageTermYears: 25,
    rentalIncomeMonthly: money(0, currency),
    maintenanceMonthly: money(0, currency),
    managementFeesMonthly: money(0, currency),
    serviceChargesMonthly: money(0, currency),
  }
}

export function blankScenario(name: string, color: string): Scenario {
  return {
    id: uuid(),
    name,
    color,
    decisions: defaultDecisions(),
    finance: {
      incomeMonthlyGross: money(5500, 'NZD'),
      taxRatePct: 30,
      monthlyLivingCosts: money(3000, 'NZD'),
      savings: money(40000, 'NZD'),

      cedarCottage: {
        ...blankProperty('GBP'),
        value: money(350000, 'GBP'),
        mortgageBalance: money(180000, 'GBP'),
        mortgageRate: 4.5,
        mortgageTermYears: 20,
        rentalIncomeMonthly: money(1400, 'GBP'),
        maintenanceMonthly: money(80, 'GBP'),
        managementFeesMonthly: money(120, 'GBP'),
        equityReleased: money(0, 'GBP'),
        sellingCostsPct: 2.5,
      },

      secondProperty: {
        ...blankProperty('GBP'),
        purchasePrice: money(0, 'GBP'),
        deposit: money(0, 'GBP'),
        purchaseCosts: money(0, 'GBP'),
      },

      careerBreakMonths: 0,
      dramaSchoolCostAnnual: money(0, 'GBP'),
      dramaSchoolYears: 0,

      travelCostPerTrip: money(1800, 'NZD'),
      tripsPerYear: 1,

      oneOffCosts: [],

      propertyAppreciationPct: 3,
      rentGrowthPct: 2,
      projectionYears: 20,

      displayCurrency: 'default',
    },
    qualitative: {
      axisScoreOverrides: {},
      pros: [],
      cons: [],
      tradeoffs: [],
      impacts: blankImpacts(),
    },
  }
}

function oneOff(label: string, amount: Money, monthOffset = 0) {
  return { id: uuid(), label, amount, monthOffset }
}

export function seedScenarios(): Scenario[] {
  const statusQuo: Scenario = {
    ...blankScenario('Status quo — Auckland, salaried', SCENARIO_COLORS[0]),
    decisions: {
      location: 'auckland',
      work: 'salariedUX',
      cedarCottage: 'keepRenting',
      secondProperty: 'none',
      acting: 'community',
      travel: 'once',
    },
    qualitative: {
      axisScoreOverrides: {},
      pros: ['Stable income and predictable routine', 'Close to established friends in Auckland', 'Cedar Cottage rent covers its own mortgage'],
      cons: ['Least creatively engaged of the options', 'Salaried role caps upside and flexibility'],
      tradeoffs: ['Security now vs. creative growth later'],
      impacts: {
        friendsFamily: { rating: 'positive', note: 'Settled near most NZ friends' },
        acting: { rating: 'neutral', note: 'Community theatre only, low time commitment' },
        workSatisfaction: { rating: 'neutral', note: 'Comfortable but not exciting' },
        beans: { rating: 'positive', note: 'No relocation, no disruption' },
        geographicFlexibility: { rating: 'negative', note: 'Salaried role ties me to Auckland' },
      },
    },
  }

  const jerseyDramaSchool: Scenario = {
    ...blankScenario('Jersey — move into Cedar Cottage, drama school', SCENARIO_COLORS[1]),
    decisions: {
      location: 'jersey',
      work: 'partTimeUX',
      cedarCottage: 'moveIn',
      secondProperty: 'none',
      acting: 'dramaSchool',
      travel: 'twice',
    },
    finance: {
      ...blankScenario('', '').finance,
      incomeMonthlyGross: money(1800, 'GBP'),
      taxRatePct: 22,
      monthlyLivingCosts: money(1600, 'GBP'),
      savings: money(55000, 'GBP'),
      cedarCottage: {
        ...blankProperty('GBP'),
        value: money(350000, 'GBP'),
        mortgageBalance: money(180000, 'GBP'),
        mortgageRate: 4.5,
        mortgageTermYears: 20,
        rentalIncomeMonthly: money(0, 'GBP'),
        maintenanceMonthly: money(80, 'GBP'),
        managementFeesMonthly: money(0, 'GBP'),
        equityReleased: money(0, 'GBP'),
        sellingCostsPct: 2.5,
      },
      dramaSchoolCostAnnual: money(15000, 'GBP'),
      dramaSchoolYears: 3,
      travelCostPerTrip: money(900, 'GBP'),
      tripsPerYear: 2,
      oneOffCosts: [oneOff('Relocation costs', money(4000, 'GBP'), 0)],
    },
    qualitative: {
      axisScoreOverrides: { security: 4 },
      pros: ['Living rent-free in an owned home', 'Full creative pursuit of acting', 'No more UK rent being paid to someone else'],
      cons: ['Much lower and less certain income', 'Far from NZ friends and family', 'Savings draining steadily for 3 years'],
      tradeoffs: ['Creative growth and freedom now vs. income security and NZ connection'],
      impacts: {
        friendsFamily: { rating: 'negative', note: 'Far from NZ-based friends; new Jersey network needed' },
        acting: { rating: 'positive', note: 'Drama school is the whole point of this life' },
        workSatisfaction: { rating: 'positive', note: 'Part-time UX pays the bills without dominating time' },
        beans: { rating: 'neutral', note: 'One big relocation, then settled' },
        geographicFlexibility: { rating: 'negative', note: 'Committed to Jersey for the drama school term' },
      },
    },
  }

  const londonContracting: Scenario = {
    ...blankScenario('London contracting + Auckland investment property', SCENARIO_COLORS[2]),
    decisions: {
      location: 'london',
      work: 'contractingUX',
      cedarCottage: 'keepRenting',
      secondProperty: 'auckland',
      acting: 'professional',
      travel: 'often',
    },
    finance: {
      ...blankScenario('', '').finance,
      incomeMonthlyGross: money(7500, 'GBP'),
      taxRatePct: 28,
      monthlyLivingCosts: money(2600, 'GBP'),
      savings: money(70000, 'GBP'),
      cedarCottage: {
        ...blankProperty('GBP'),
        value: money(350000, 'GBP'),
        mortgageBalance: money(180000, 'GBP'),
        mortgageRate: 4.5,
        mortgageTermYears: 20,
        rentalIncomeMonthly: money(1400, 'GBP'),
        maintenanceMonthly: money(80, 'GBP'),
        managementFeesMonthly: money(120, 'GBP'),
        equityReleased: money(0, 'GBP'),
        sellingCostsPct: 2.5,
      },
      secondProperty: {
        ...blankProperty('NZD'),
        purchasePrice: money(650000, 'NZD'),
        value: money(650000, 'NZD'),
        deposit: money(130000, 'NZD'),
        purchaseCosts: money(15000, 'NZD'),
        mortgageBalance: money(520000, 'NZD'),
        mortgageRate: 6.2,
        mortgageTermYears: 25,
        rentalIncomeMonthly: money(2400, 'NZD'),
        maintenanceMonthly: money(150, 'NZD'),
        managementFeesMonthly: money(200, 'NZD'),
      },
      travelCostPerTrip: money(1600, 'GBP'),
      tripsPerYear: 4,
    },
    qualitative: {
      axisScoreOverrides: {},
      pros: ['Highest income and fastest net worth growth', 'A foothold back in Auckland via the investment property', 'Professional acting pursuit in a major market'],
      cons: ['Contracting income is less certain than salaried', 'Two mortgages and two sets of running costs', 'Heavy travel schedule is tiring and costly'],
      tradeoffs: ['Growth and optionality vs. the stress of managing two properties and irregular income'],
      impacts: {
        friendsFamily: { rating: 'neutral', note: 'Frequent trips keep NZ ties alive' },
        acting: { rating: 'positive', note: 'London has the professional opportunities' },
        workSatisfaction: { rating: 'positive', note: 'Contracting variety plus better day rate' },
        beans: { rating: 'negative', note: 'Quarterly long-haul travel is disruptive' },
        geographicFlexibility: { rating: 'positive', note: 'Income and property in both countries keeps options open' },
      },
    },
  }

  return [statusQuo, jerseyDramaSchool, londonContracting]
}
