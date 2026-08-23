/**
 * Central safe date formatter utility.
 * Prevents "Invalid Date" errors across the application.
 */
export function formatDate(dateInput: string | Date | null | undefined, formatStyle: 'short' | 'long' = 'short'): string {
  if (!dateInput) return '-'

  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput

    if (isNaN(date.getTime())) {
      return '-'
    }

    if (formatStyle === 'long') {
      return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    }

    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()

    return `${day}/${month}/${year}`
  } catch {
    return '-'
  }
}

/**
 * Currency formatter helper
 */
export function formatCurrency(amount: number | string | null | undefined, symbol: string = 'ر.س'): string {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return `0 ${symbol}`
  }

  const numeric = Number(amount)
  return `${numeric.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${symbol}`
}
