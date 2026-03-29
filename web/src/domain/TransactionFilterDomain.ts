import { TransactionDTO } from '@/types'
import { matchesCrossLanguage } from '@/utils/en-ru-matching'
import { deriveBucketId } from '@/utils'

interface TransactionFilters {
  accountName: string
  payee: string
  comment: string
  category: string
  bucketId: string
}

class TransactionFilterDomain {
  filterTransactions(
    transactions: TransactionDTO[],
    filters: TransactionFilters,
    externalAccountIds: Set<string>,
  ): TransactionDTO[] {
    const { accountName, payee, comment, category, bucketId } = filters

    return transactions.filter((transaction) => {
      if (!this.matchesPayeeFilter(transaction, payee)) {
        return false
      }

      if (!this.matchesAccountFilter(transaction, accountName)) {
        return false
      }

      if (!this.matchesCommentFilter(transaction, comment)) {
        return false
      }

      if (!this.matchesCategoryFilter(transaction, category)) {
        return false
      }

      if (!this.matchesBucketIdFilter(transaction, bucketId, externalAccountIds)) {
        return false
      }

      return true
    })
  }

  private matchesPayeeFilter(transaction: TransactionDTO, filterPayee: string): boolean {
    if (!filterPayee) {
      return true
    }

    if (!transaction.counterparty) {
      return false
    }

    return matchesCrossLanguage(transaction.counterparty, filterPayee)
  }

  private matchesAccountFilter(transaction: TransactionDTO, filterAccountName: string): boolean {
    if (!filterAccountName) {
      return true
    }

    return (
      transaction.account_from === filterAccountName || transaction.account_to === filterAccountName
    )
  }

  private matchesCategoryFilter(transaction: TransactionDTO, filterCategory: string): boolean {
    if (!filterCategory) {
      return true
    }

    return transaction.category === filterCategory
  }

  private matchesBucketIdFilter(
    transaction: TransactionDTO,
    filterBucketId: string,
    externalAccountIds: Set<string>,
  ): boolean {
    if (!filterBucketId) {
      return true
    }

    return deriveBucketId(transaction, externalAccountIds) === filterBucketId
  }

  private matchesCommentFilter(transaction: TransactionDTO, filterComment: string): boolean {
    if (!filterComment) {
      return true
    }

    return matchesCrossLanguage(transaction.comment, filterComment)
  }
}

export default TransactionFilterDomain
