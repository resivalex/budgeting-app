interface ConversionRate {
  currency: string
  rate: number
}

interface CurrencyConfig {
  mainCurrency: string
  conversionRates: ConversionRate[]
}

interface MonthCurrencyConfig {
  date: string
  config: CurrencyConfig
}

export interface CurrencyConfigsDTO {
  monthCurrencyConfigs: MonthCurrencyConfig[]
}
