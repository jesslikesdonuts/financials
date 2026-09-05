import type { Currency, DisplayCurrencyChoice, GlobalSettings, Money } from './types'

const LOCALE: Record<Currency, string> = { GBP: 'en-GB', NZD: 'en-NZ' }

export function formatMoney(m: Money): string {
  return new Intl.NumberFormat(LOCALE[m.currency], {
    style: 'currency',
    currency: m.currency,
    maximumFractionDigits: 0,
  }).format(m.amount)
}

export function formatAmount(amount: number, currency: Currency): string {
  if (!isFinite(amount)) return amount > 0 ? '∞' : '−∞'
  return new Intl.NumberFormat(LOCALE[currency], {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

/** Converts a Money value into `to`, using settings.gbpToNzdRate as "1 GBP = N NZD". */
export function convert(m: Money, to: Currency, settings: GlobalSettings): number {
  if (m.currency === to) return m.amount
  if (m.currency === 'GBP' && to === 'NZD') return m.amount * settings.gbpToNzdRate
  if (m.currency === 'NZD' && to === 'GBP') return m.amount / settings.gbpToNzdRate
  return m.amount
}

export function resolveDisplayCurrency(choice: DisplayCurrencyChoice, settings: GlobalSettings): Currency {
  return choice === 'default' ? settings.displayCurrency : choice
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
