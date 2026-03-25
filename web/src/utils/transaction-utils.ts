import { TransactionDTO } from '@/types'

export type TransactionType = 'income' | 'expense' | 'transfer'

export function isExternalAccount(accountId: string): boolean {
  return accountId.startsWith('external_')
}

export function deriveTransactionType(transaction: TransactionDTO): TransactionType {
  if (isExternalAccount(transaction.account_from)) return 'income'
  if (isExternalAccount(transaction.account_to)) return 'expense'
  return 'transfer'
}

export function deriveAccount(transaction: TransactionDTO): string {
  if (isExternalAccount(transaction.account_from)) return transaction.account_to
  return transaction.account_from
}

export function derivePayee(transaction: TransactionDTO): string {
  const type = deriveTransactionType(transaction)
  if (type === 'transfer') return transaction.account_to
  return transaction.counterparty
}

export function deriveBucketId(transaction: TransactionDTO): string {
  const type = deriveTransactionType(transaction)
  if (type === 'expense') return transaction.bucket_to
  if (type === 'income') return transaction.bucket_from
  return 'default'
}
