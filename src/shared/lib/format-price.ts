export const formatPrice = (
  value: number,
  currency = 'USD',
  locale = 'en-US',
  minimumFractionDigits = 2
) => {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits: minimumFractionDigits
  })

  return formatter.format(value)
}
