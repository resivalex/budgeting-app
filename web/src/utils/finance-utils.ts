export function convertCurrencyCodeToSymbol(currencyCode: string): string {
  switch (currencyCode) {
    case 'USD':
      return '$'
    case 'EUR':
      return '€'
    case 'RUB':
      return '₽'
    case 'KZT':
      return '₸'
    case 'TRY':
      return '₺'
    default:
      return currencyCode
  }
}

export function formatFinancialAmount(amount: number, maxDecimals = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDecimals,
    useGrouping: true,
  })
    .format(amount)
    .replace(/,/g, ' ')
}
