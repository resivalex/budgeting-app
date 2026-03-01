import { TransactionDTO } from '@/types'
import { matchesCrossLanguage } from '@/utils/en-ru-matching'

interface TransactionFilters {
  accountName: string
  payee: string
  comment: string
  category: string
  budgetName: string
}

class TransactionFilterDomain {
  filterTransactions(
    transactions: TransactionDTO[],
    filters: TransactionFilters,
  ): TransactionDTO[] {
    const { accountName, payee, comment, category, budgetName } = filters

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

      if (!this.matchesBudgetNameFilter(transaction, budgetName)) {
        return false
      }

      return true
    })
  }

  private matchesPayeeFilter(transaction: TransactionDTO, filterPayee: string): boolean {
    if (!filterPayee) {
      return true
    }

    if (transaction.type === 'transfer') {
      return false
    }

    return matchesCrossLanguage(transaction.payee, filterPayee)
  }

  private matchesAccountFilter(transaction: TransactionDTO, filterAccountName: string): boolean {
    if (!filterAccountName) {
      return true
    }

    if (transaction.type === 'transfer') {
      return [transaction.account, transaction.payee].includes(filterAccountName)
    }

    return transaction.account === filterAccountName
  }

  private matchesCategoryFilter(transaction: TransactionDTO, filterCategory: string): boolean {
    if (!filterCategory) {
      return true
    }

    if (transaction.type === 'transfer') {
      return false
    }

    return transaction.category === filterCategory
  }

  private matchesBudgetNameFilter(transaction: TransactionDTO, filterBudgetName: string): boolean {
    if (!filterBudgetName) {
      return true
    }

    return transaction.budget_name === filterBudgetName
  }

  private matchesCommentFilter(transaction: TransactionDTO, filterComment: string): boolean {
    if (!filterComment) {
      return true
    }

    return matchesCrossLanguage(transaction.comment, filterComment)
  }
}

export default TransactionFilterDomain
