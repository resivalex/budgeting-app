import _ from 'lodash'
import { TransactionDTO, AccountDetailsDTO } from '@/types'
import { isExternalAccount } from '@/utils'

export default class TransactionAggregator {
  transactions: TransactionDTO[]
  externalAccountIds: Set<string>

  constructor(transactions: any[], externalAccountIds: Set<string>) {
    this.transactions = transactions
    this.externalAccountIds = externalAccountIds
  }

  getAccountDetails(): AccountDetailsDTO[] {
    const accountsStat: Record<string, { currency: string; balance: number }> = {}

    this.transactions.forEach((transaction) => {
      const { account_from, account_to, currency } = transaction
      const amount = parseFloat(transaction.amount)

      if (!accountsStat[account_from]) {
        accountsStat[account_from] = { currency, balance: 0 }
      }
      if (!accountsStat[account_to]) {
        accountsStat[account_to] = { currency, balance: 0 }
      }

      accountsStat[account_from].balance -= amount
      accountsStat[account_to].balance += amount
    })

    const accountDetails = Object.keys(accountsStat)
      .filter((account) => !isExternalAccount(account, this.externalAccountIds))
      .map((account) => ({
        account,
        currency: accountsStat[account].currency,
        balance: accountsStat[account].balance,
      }))

    accountDetails.sort((a, b) => (a.balance > b.balance ? -1 : 1))
    return accountDetails
  }

  getSortedCategories() {
    const categoriesCounts = this.transactions.reduce((categories: any, transaction: any) => {
      if (!categories[transaction.category]) {
        categories[transaction.category] = 0
      }
      categories[transaction.category]++

      return categories
    }, {})

    const sortedCategories = Object.keys(categoriesCounts).sort((a, b) => {
      return categoriesCounts[b] - categoriesCounts[a]
    })

    return sortedCategories.filter(_.identity)
  }

  getSortedCurrencies() {
    return _(this.transactions)
      .map((t) => t.currency)
      .uniq()
      .sortBy()
      .value()
  }

  getRecentPayees() {
    return this._getRecentValues('counterparty', this._sortedByDate())
  }

  getRecentPayeesByCategory(category: string) {
    return this._getRecentValues('counterparty', this._sortedByDateWithCategoryFirst(category))
  }

  getRecentComments() {
    return this._getRecentValues('comment', this._sortedByDate())
  }

  getRecentCommentsByCategory(category: string) {
    return this._getRecentValues('comment', this._sortedByDateWithCategoryFirst(category))
  }

  private _sortedByDate() {
    return _.sortBy(this.transactions, (t) => -new Date(t.datetime).getTime())
  }

  private _sortedByDateWithCategoryFirst(category: string) {
    const sorted = this._sortedByDate()
    return [
      ...sorted.filter((t) => t.category === category),
      ...sorted.filter((t) => t.category !== category),
    ]
  }

  private _getRecentValues(field: 'counterparty' | 'comment', transactions: TransactionDTO[]) {
    const seen: { [name: string]: boolean } = {}
    const result: string[] = []
    for (const transaction of transactions) {
      const value = transaction[field]
      if (value && !seen[value]) {
        seen[value] = true
        result.push(value)
      }
    }
    return result
  }
}
