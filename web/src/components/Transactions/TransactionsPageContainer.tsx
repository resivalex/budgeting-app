import { FC } from 'react'
import { TransactionDTO, AccountDetailsDTO } from '@/types'
import TransactionsPage from './TransactionsPage'
import { matchesCrossLanguage } from '@/utils/en-ru-matching'

export default function TransactionsPageContainer({
  AccountSelect,
  transactions,
  accountDetails,
  filterAccountName,
  filterPayee,
  filterComment,
  onFilterAccountNameChange,
  onFilterPayeeChange,
  onFilterCommentChange,
  onRemove,
}: {
  AccountSelect: FC<{
    value: string
    onChange: (value: string) => void
  }>
  transactions: TransactionDTO[]
  accountDetails: AccountDetailsDTO[]
  filterAccountName: string
  filterPayee: string
  filterComment: string
  onFilterAccountNameChange: (accountName: string) => void
  onFilterPayeeChange: (payee: string) => void
  onFilterCommentChange: (comment: string) => void
  onRemove: (id: string) => Promise<void>
}) {
  const filteredTransactions = transactions.filter((transaction) => {
    // Filter by payee (exclude transfers and check for payee match if filterPayee is set)
    if (filterPayee) {
      if (
        transaction.type === 'transfer' ||
        !matchesCrossLanguage(transaction.payee, filterPayee)
      ) {
        return false
      }
    }

    // Filter by account name
    if (filterAccountName) {
      if (transaction.type === 'transfer') {
        if (![transaction.account, transaction.payee].includes(filterAccountName)) {
          return false
        }
      } else {
        if (transaction.account !== filterAccountName) {
          return false
        }
      }
    }

    // Filter by comment using cross-language matching
    if (filterComment && !matchesCrossLanguage(transaction.comment, filterComment)) {
      return false
    }

    return true
  })

  return (
    <TransactionsPage
      AccountSelect={AccountSelect}
      filterAccountName={filterAccountName}
      filterPayee={filterPayee}
      filterComment={filterComment}
      transactions={filteredTransactions}
      accountDetails={accountDetails}
      onFilterAccountNameChange={onFilterAccountNameChange}
      onFilterPayeeChange={onFilterPayeeChange}
      onFilterCommentChange={onFilterCommentChange}
      onRemove={onRemove}
    />
  )
}
