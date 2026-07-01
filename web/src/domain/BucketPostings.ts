import { TransactionDTO } from '@/types'

export const DEFAULT_BUCKET_ID = 'default'

export interface BucketPosting {
  bucketId: string
  account: string
  currency: string
  amount: number
}

export function getBucketPostings(transaction: TransactionDTO): BucketPosting[] {
  const amount = parseFloat(transaction.amount)

  return [
    {
      bucketId: transaction.bucket_from,
      account: transaction.account_from,
      currency: transaction.currency,
      amount: -amount,
    },
    {
      bucketId: transaction.bucket_to,
      account: transaction.account_to,
      currency: transaction.currency,
      amount,
    },
  ]
}
