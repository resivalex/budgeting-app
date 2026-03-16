interface MonthSpendingLimit {
  date: string
  currency: string
  amount: number
}

interface SpendingLimit {
  name: string
  color: string
  categories: string[]
  monthLimits: MonthSpendingLimit[]
}

export interface SpendingLimitsDTO {
  limits: SpendingLimit[]
}
