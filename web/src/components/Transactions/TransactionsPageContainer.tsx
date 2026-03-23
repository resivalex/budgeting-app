import { FC, useMemo } from 'react'
import { useAtomValue } from 'jotai'
import { TransactionDTO, AccountDetailsDTO } from '@/types'
import TransactionsPage from './TransactionsPage'
import { TransactionFilterDomain } from '@/domain'
import { bucketsAtom } from '@/state'

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
  filterBucketId,
  onFilterAccountNameChange,
  onFilterPayeeChange,
  onFilterCommentChange,
  onFilterCategoryChange,
  onFilterBucketIdChange,
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
  filterBucketId: string
  onFilterAccountNameChange: (accountName: string) => void
  onFilterPayeeChange: (payee: string) => void
  onFilterCommentChange: (comment: string) => void
  onFilterCategoryChange: (category: string) => void
  onFilterBucketIdChange: (bucketId: string) => void
  onRemove: (id: string) => Promise<void>
}) {
  const buckets = useAtomValue(bucketsAtom)
  const bucketOptions = buckets.buckets.map((b) => ({ id: b.id, name: b.name }))

  const filteredTransactions = useMemo(
    () =>
      filterDomain.filterTransactions(transactions, {
        accountName: filterAccountName,
        payee: filterPayee,
        comment: filterComment,
        category: filterCategory,
        bucketId: filterBucketId,
      }),
    [transactions, filterAccountName, filterPayee, filterComment, filterCategory, filterBucketId],
  )

  return (
    <TransactionsPage
      AccountSelect={AccountSelect}
      filterAccountName={filterAccountName}
      filterPayee={filterPayee}
      filterComment={filterComment}
      filterCategory={filterCategory}
      filterBucketId={filterBucketId}
      categories={categories}
      bucketOptions={bucketOptions}
      transactions={filteredTransactions}
      accountDetails={accountDetails}
      onFilterAccountNameChange={onFilterAccountNameChange}
      onFilterPayeeChange={onFilterPayeeChange}
      onFilterCommentChange={onFilterCommentChange}
      onFilterCategoryChange={onFilterCategoryChange}
      onFilterBucketIdChange={onFilterBucketIdChange}
      onRemove={onRemove}
    />
  )
}
