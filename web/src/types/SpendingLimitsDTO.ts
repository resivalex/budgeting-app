interface MonthSpendingLimit {
  date: string
  currency: string
  amount: number
}

interface SpendingLimit {
  bucketId: string
  monthLimits: MonthSpendingLimit[]
}

export interface SpendingLimitsDTO {
  limits: SpendingLimit[]
}
