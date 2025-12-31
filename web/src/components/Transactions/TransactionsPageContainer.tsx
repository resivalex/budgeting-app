import { FC, useMemo } from 'react'
import { TransactionDTO, AccountDetailsDTO } from '@/types'
import TransactionsPage from './TransactionsPage'
import { TransactionFilterDomain } from '@/domain'

const filterDomain = new TransactionFilterDomain()

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
  const filteredTransactions = useMemo(
    () =>
      filterDomain.filterTransactions(transactions, {
        accountName: filterAccountName,
        payee: filterPayee,
        comment: filterComment,
      }),
    [transactions, filterAccountName, filterPayee, filterComment],
  )

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
