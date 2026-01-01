import { TransactionDTO, TransactionsAggregations } from '@/types'
import { DbService, TransactionAggregator } from '@/services'
import _ from 'lodash'

const emptyAggregations: TransactionsAggregations = {
  accountDetails: [],
  categories: [],
  currencies: [],
  payees: [],
  comments: [],
}

class TransactionDomain {
  private dbService: DbService

  constructor(dbService: DbService) {
    this.dbService = dbService
  }

  async loadTransactions(): Promise<TransactionDTO[]> {
    const transactions = await this.dbService.readAllDocs()
    return this.sortTransactions(transactions)
  }

  async createTransaction(transaction: TransactionDTO): Promise<void> {
    await this.dbService.addTransaction(transaction)
  }

  async updateTransaction(transaction: TransactionDTO): Promise<void> {
    await this.dbService.replaceTransaction(transaction)
  }

  async deleteTransaction(transactionId: string): Promise<void> {
    await this.dbService.removeTransaction(transactionId)
  }

  static getAggregations(transactions: TransactionDTO[]): TransactionsAggregations {
    if (transactions.length === 0) {
      return emptyAggregations
    }
    const aggregator = new TransactionAggregator(transactions)
    return {
      accountDetails: aggregator.getAccountDetails(),
      categories: aggregator.getSortedCategories(),
      currencies: aggregator.getSortedCurrencies(),
      payees: aggregator.getRecentPayees(),
      comments: aggregator.getRecentComments(),
    }
  }

  private sortTransactions(transactions: TransactionDTO[]): TransactionDTO[] {
    return _.sortBy(transactions, (transaction: TransactionDTO) => transaction.datetime).reverse()
  }
}

export default TransactionDomain
