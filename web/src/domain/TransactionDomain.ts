import { TransactionDTO, TransactionsAggregations } from '@/types'
import { TransactionAggregator } from '@/services'

const emptyAggregations: TransactionsAggregations = {
  accountDetails: [],
  categories: [],
  currencies: [],
  payees: [],
  comments: [],
}

class TransactionDomain {
  static getAggregations(
    transactions: TransactionDTO[],
    externalAccountIds: Set<string>,
  ): TransactionsAggregations {
    if (transactions.length === 0) {
      return emptyAggregations
    }
    const aggregator = new TransactionAggregator(transactions, externalAccountIds)
    return {
      accountDetails: aggregator.getAccountDetails(),
      categories: aggregator.getSortedCategories(),
      currencies: aggregator.getSortedCurrencies(),
      payees: aggregator.getRecentPayees(),
      comments: aggregator.getRecentComments(),
    }
  }
}

export default TransactionDomain
