import type { DecisionCategory, Decisions, LifeAxis } from './types'
import { LIFE_AXES } from './types'

export const DECISION_CATEGORIES: DecisionCategory[] = [
  {
    id: 'location',
    question: 'Where do I live?',
    options: [
      { id: 'auckland', label: 'Auckland', axisNudge: { connection: 2, creativity: -1, security: 1 } },
      { id: 'jersey', label: 'Jersey', axisNudge: { security: 2, freedom: -1, growth: -1 } },
      { id: 'london', label: 'London', axisNudge: { growth: 2, creativity: 1, connection: -1, security: -1 } },
      { id: 'manchester', label: 'Manchester', axisNudge: { creativity: 1, growth: 1 } },
      { id: 'liverpool', label: 'Liverpool', axisNudge: { creativity: 1, connection: 1 } },
    ],
  },
  {
    id: 'work',
    question: 'What do I do for work?',
    options: [
      { id: 'salariedUX', label: 'Stay in salaried UX', axisNudge: { security: 2, freedom: -1, optionality: -1 } },
      { id: 'contractingUX', label: 'UX contracting', axisNudge: { freedom: 1, optionality: 1, security: -1 } },
      { id: 'partTimeUX', label: 'Part-time UX', axisNudge: { freedom: 1, creativity: 1, security: -1 } },
      { id: 'careerBreak', label: 'Career break', axisNudge: { freedom: 2, growth: 1, security: -2 } },
      { id: 'creativeWork', label: 'Creative work', axisNudge: { creativity: 2, growth: 1, security: -2 } },
    ],
  },
  {
    id: 'cedarCottage',
    question: 'What do I do with Cedar Cottage?',
    options: [
      { id: 'keepRenting', label: 'Keep renting it out', axisNudge: { security: 1, optionality: 1 } },
      { id: 'moveIn', label: 'Move into it', axisNudge: { security: 1, freedom: -1, optionality: -1 } },
      { id: 'refinance', label: 'Refinance', axisNudge: { optionality: 1, security: -1 } },
      { id: 'sell', label: 'Sell', axisNudge: { freedom: 1, optionality: 1, security: -1 } },
    ],
  },
  {
    id: 'secondProperty',
    question: 'Do I buy another property?',
    options: [
      { id: 'none', label: 'None', axisNudge: { freedom: 1, optionality: 1 } },
      { id: 'auckland', label: 'Auckland', axisNudge: { security: 1, optionality: -1 } },
      { id: 'jersey', label: 'Jersey', axisNudge: { security: 1, optionality: -1 } },
      { id: 'uk', label: 'UK', axisNudge: { security: 1, optionality: -1 } },
    ],
  },
  {
    id: 'acting',
    question: 'What do I do about acting?',
    options: [
      { id: 'community', label: 'Community theatre', axisNudge: { connection: 1, creativity: 1 } },
      { id: 'dramaSchool', label: 'Drama school', axisNudge: { creativity: 2, growth: 2, security: -1 } },
      { id: 'professional', label: 'Professional pursuit', axisNudge: { creativity: 2, growth: 1, security: -2 } },
      { id: 'pause', label: 'Pause', axisNudge: { creativity: -1 } },
    ],
  },
  {
    id: 'travel',
    question: 'How often do I travel between NZ and UK?',
    options: [
      { id: 'none', label: "Rarely / don't", axisNudge: { security: 1, connection: -1 } },
      { id: 'once', label: 'Once a year', axisNudge: {} },
      { id: 'twice', label: 'Twice a year', axisNudge: { connection: 1 } },
      { id: 'often', label: 'Quarterly or more', axisNudge: { connection: 2, freedom: 1, security: -1 } },
    ],
  },
]

export const TRIPS_PER_YEAR_BY_TRAVEL_OPTION: Record<string, number> = {
  none: 0,
  once: 1,
  twice: 2,
  often: 4,
}

export function defaultDecisions(): Decisions {
  const decisions = {} as Decisions
  DECISION_CATEGORIES.forEach((cat) => {
    decisions[cat.id] = cat.options[0].id
  })
  return decisions
}

export function getOption(categoryId: string, optionId: string) {
  const category = DECISION_CATEGORIES.find((c) => c.id === categoryId)
  return category?.options.find((o) => o.id === optionId)
}

/**
 * Starting-point axis scores (0-10, base 5) suggested by the decisions picked.
 * Purely a suggestion — always overridable per scenario, never treated as fact.
 */
export function suggestedAxisScores(decisions: Decisions): Record<LifeAxis, number> {
  const scores: Record<LifeAxis, number> = {
    freedom: 5,
    security: 5,
    creativity: 5,
    connection: 5,
    growth: 5,
    optionality: 5,
  }
  DECISION_CATEGORIES.forEach((category) => {
    const option = getOption(category.id, decisions[category.id])
    if (!option?.axisNudge) return
    LIFE_AXES.forEach((axis) => {
      const nudge = option.axisNudge?.[axis]
      if (nudge) scores[axis] += nudge
    })
  })
  LIFE_AXES.forEach((axis) => {
    scores[axis] = Math.min(10, Math.max(0, scores[axis]))
  })
  return scores
}

export function decisionSummarySentence(decisions: Decisions): string {
  const parts = DECISION_CATEGORIES.map((category) => getOption(category.id, decisions[category.id])?.label).filter(
    Boolean,
  )
  return parts.join(' · ')
}
