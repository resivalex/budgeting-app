import { TransactionDTO } from '@/types'

export type BudgetDTO = {
  bucketId: string
  name: string
  color: string
  currency: string
  amount: number
  categories: string[]
  transactions: TransactionDTO[]
  spentAmount: number
  isEditable: boolean
}
