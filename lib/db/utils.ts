import { db } from './index'

/**
 * Database utility functions for common operations
 */

/**
 * Test database connection
 */
export async function testConnection(): Promise<boolean> {
  try {
    await db.execute('SELECT 1')
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}

/**
 * Initialize database with default data
 */
export async function initializeDatabase() {
  try {
    // Create default campaign for the rehabilitation center
    const { campaignRepository } = await import('./index')

    const existingCampaign = await campaignRepository.getMainCampaign()

    if (!existingCampaign) {
      await campaignRepository.create({
        name: 'Centro de Tratamento e Reabilitação',
        description:
          'Construção do primeiro centro especializado em tratamento e reabilitação para pessoas em situação de dependência química na Guiné-Bissau.',
        targetAmount: 50000000, // €500,000 in cents
        currentAmount: 0,
        isActive: true,
      })

      console.log('Default campaign created successfully')
    }

    // Initialize project progress
    const progress = await campaignRepository.getCurrentProgress()

    if (!progress) {
      await campaignRepository.updateProjectProgress({
        title: 'Centro de Tratamento e Reabilitação',
        description:
          'Construção do primeiro centro especializado em tratamento e reabilitação para pessoas em situação de dependência química na Guiné-Bissau.',
        targetAmount: 50000000, // €500,000 in cents
        currentAmount: 0,
        percentageComplete: 10, // Current progress as mentioned in the site
        isActive: true,
      })

      console.log('Project progress initialized successfully')
    }

    return true
  } catch (error) {
    console.error('Database initialization failed:', error)
    return false
  }
}

/**
 * Format currency amount from cents to display format
 */
export function formatCurrency(amountInCents: number, currency = 'EUR'): string {
  const amount = amountInCents / 100

  const formatters: Record<string, Intl.NumberFormat> = {
    EUR: new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }),
    USD: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
    GBP: new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }),
  }

  const formatter = formatters[currency] || formatters.EUR
  return formatter.format(amount)
}

/**
 * Convert currency amount to cents
 */
export function toCents(amount: number): number {
  return Math.round(amount * 100)
}

/**
 * Convert cents to currency amount
 */
export function fromCents(amountInCents: number): number {
  return amountInCents / 100
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Generate a secure random string for tokens
 */
export function generateSecureToken(length = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return result
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and > characters
    .trim()
    .substring(0, 1000) // Limit length
}

/**
 * Calculate donation impact message
 */
export function getDonationImpact(amountInCents: number): string {
  const amount = fromCents(amountInCents)

  if (amount >= 500) {
    return `Sua doação de ${formatCurrency(amountInCents)} pode financiar 1 semana de construção!`
  }
  if (amount >= 250) {
    return `Sua doação de ${formatCurrency(amountInCents)} pode comprar materiais de construção por 3 dias!`
  }
  if (amount >= 100) {
    return `Sua doação de ${formatCurrency(amountInCents)} pode financiar 1 dia de trabalho de construção!`
  }
  if (amount >= 50) {
    return `Sua doação de ${formatCurrency(amountInCents)} pode comprar materiais básicos de construção!`
  }
  return `Sua doação de ${formatCurrency(amountInCents)} contribui para a construção do centro!`
}

/**
 * Get supported currencies with their symbols and names
 */
export function getSupportedCurrencies() {
  return [
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
  ]
}

/**
 * Get exchange rates (placeholder - in production, use a real API)
 */
export function getExchangeRates(baseCurrency = 'EUR'): Record<string, number> {
  // In production, integrate with a real exchange rate API like exchangerate-api.com
  // For now, return static rates
  const rates: Record<string, Record<string, number>> = {
    EUR: { EUR: 1, USD: 1.08, GBP: 0.85 },
    USD: { EUR: 0.93, USD: 1, GBP: 0.79 },
    GBP: { EUR: 1.18, USD: 1.27, GBP: 1 },
  }

  return rates[baseCurrency] || rates.EUR
}

/**
 * Convert amount between currencies
 */
export function convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
  if (fromCurrency === toCurrency) {
    return amount
  }

  const rates = getExchangeRates(fromCurrency)
  const rate = rates[toCurrency]

  if (!rate) {
    throw new Error(`Exchange rate not available for ${fromCurrency} to ${toCurrency}`)
  }

  return Math.round(amount * rate)
}
