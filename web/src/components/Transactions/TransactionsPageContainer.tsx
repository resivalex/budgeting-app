import { FC, useMemo } from 'react'
import { useAtomValue } from 'jotai'
import { TransactionDTO, AccountDetailsDTO } from '@/types'
import TransactionsPage from './TransactionsPage'
import { TransactionFilterDomain } from '@/domain'
import { spendingLimitsAtom } from '@/state'

const filterDomain = new TransactionFilterDomain()

export default function TransactionsPageContainer({
  AccountSelect,
  transactions,
  accountDetails,
  categories,
  filterAccountName,
  filterPayee,
  filterComment,
  filterCategory,
  filterBudgetName,
  onFilterAccountNameChange,
  onFilterPayeeChange,
  onFilterCommentChange,
  onFilterCategoryChange,
  onFilterBudgetNameChange,
  onRemove,
}: {
  AccountSelect: FC<{
    value: string
    onChange: (value: string) => void
  }>
  transactions: TransactionDTO[]
  accountDetails: AccountDetailsDTO[]
  categories: string[]
  filterAccountName: string
  filterPayee: string
  filterComment: string
  filterCategory: string
  filterBudgetName: string
  onFilterAccountNameChange: (accountName: string) => void
  onFilterPayeeChange: (payee: string) => void
  onFilterCommentChange: (comment: string) => void
  onFilterCategoryChange: (category: string) => void
  onFilterBudgetNameChange: (budgetName: string) => void
  onRemove: (id: string) => Promise<void>
}) {
  const spendingLimits = useAtomValue(spendingLimitsAtom)
  const budgetNames = spendingLimits.limits.map((l) => l.name)

  const filteredTransactions = useMemo(
    () =>
      filterDomain.filterTransactions(transactions, {
        accountName: filterAccountName,
        payee: filterPayee,
        comment: filterComment,
        category: filterCategory,
        budgetName: filterBudgetName,
      }),
    [transactions, filterAccountName, filterPayee, filterComment, filterCategory, filterBudgetName],
  )

  return (
    <TransactionsPage
      AccountSelect={AccountSelect}
      filterAccountName={filterAccountName}
      filterPayee={filterPayee}
      filterComment={filterComment}
      filterCategory={filterCategory}
      filterBudgetName={filterBudgetName}
      categories={categories}
      budgetNames={budgetNames}
      transactions={filteredTransactions}
      accountDetails={accountDetails}
      onFilterAccountNameChange={onFilterAccountNameChange}
      onFilterPayeeChange={onFilterPayeeChange}
      onFilterCommentChange={onFilterCommentChange}
      onFilterCategoryChange={onFilterCategoryChange}
      onFilterBudgetNameChange={onFilterBudgetNameChange}
      onRemove={onRemove}
    />
  )
}
