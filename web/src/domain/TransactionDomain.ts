import { TransactionDTO } from '@/types'
import { DbService } from '@/services'
import _ from 'lodash'

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

  private sortTransactions(transactions: TransactionDTO[]): TransactionDTO[] {
    return _.sortBy(transactions, (transaction: TransactionDTO) => transaction.datetime).reverse()
  }
}

export default TransactionDomain
