import { TransactionDTO } from '@/types'

export type TransactionType = 'income' | 'expense' | 'transfer' | 'custom'

export function isExternalAccount(accountId: string, externalAccountIds: Set<string>): boolean {
  return externalAccountIds.has(accountId)
}

export function deriveTransactionType(
  transaction: TransactionDTO,
  externalAccountIds: Set<string>,
): TransactionType {
  const fromExternal = isExternalAccount(transaction.account_from, externalAccountIds)
  const toExternal = isExternalAccount(transaction.account_to, externalAccountIds)

  if (fromExternal && !toExternal && transaction.bucket_to === 'default') return 'income'
  if (!fromExternal && toExternal && transaction.bucket_from === 'default') return 'expense'
  if (
    !fromExternal &&
    !toExternal &&
    transaction.bucket_from === 'default' &&
    transaction.bucket_to === 'default'
  )
    return 'transfer'
  return 'custom'
}

export function deriveAccount(
  transaction: TransactionDTO,
  externalAccountIds: Set<string>,
): string {
  if (isExternalAccount(transaction.account_from, externalAccountIds)) return transaction.account_to
  return transaction.account_from
}

export function derivePayee(transaction: TransactionDTO, externalAccountIds: Set<string>): string {
  const type = deriveTransactionType(transaction, externalAccountIds)
  if (type === 'transfer') return transaction.account_to
  return transaction.counterparty
}

export function deriveBucketId(
  transaction: TransactionDTO,
  externalAccountIds: Set<string>,
): string {
  const type = deriveTransactionType(transaction, externalAccountIds)
  if (type === 'expense') return transaction.bucket_to
  if (type === 'income') return transaction.bucket_from
  return 'default'
}
