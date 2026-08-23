export const formatCurrency = (value: number | string, isRTL: boolean = false): string => {
 const numericValue = typeof value === 'string' ? parseFloat(value) : value

 if (isNaN(numericValue)) return '0.00'

 // Using a standard formatter. You can customize the currency code (e.g. SAR) later if provided by a config
 const formatter = new Intl.NumberFormat(isRTL ? 'ar-SA' : 'en-US', {
 style: 'currency',
 currency: 'SAR', // Saudi Riyal as a realistic default for Arabic contexts
 minimumFractionDigits: 2,
 maximumFractionDigits: 2
 })

 return formatter.format(numericValue)
}
