import _ from 'lodash'
import { TransactionDTO, AccountDetailsDTO } from '@/types'
import { isExternalAccount, deriveTransactionType } from '@/utils'

export default class TransactionAggregator {
  transactions: TransactionDTO[]

  constructor(transactions: any[]) {
    this.transactions = transactions
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
      .filter((account) => !isExternalAccount(account))
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
    const payeesSet: { [name: string]: boolean } = {}
    const result: string[] = []
    const sortedTransactions = _.sortBy(this.transactions, (t) => -new Date(t.datetime).getTime())
    for (const transaction of sortedTransactions) {
      if (transaction.counterparty && !payeesSet[transaction.counterparty]) {
        payeesSet[transaction.counterparty] = true
        result.push(transaction.counterparty)
      }
    }

    return result
  }

  getRecentPayeesByCategory(category: string) {
    const payeesSet: { [name: string]: boolean } = {}
    const result: string[] = []
    const sortedTransactions = _.sortBy(this.transactions, (t) => -new Date(t.datetime).getTime())
    const orderedTransactions = [
      ...sortedTransactions.filter((t) => t.category === category),
      ...sortedTransactions.filter((t) => t.category !== category),
    ]

    for (const transaction of orderedTransactions) {
      if (transaction.counterparty && !payeesSet[transaction.counterparty]) {
        payeesSet[transaction.counterparty] = true
        result.push(transaction.counterparty)
      }
    }

    return result
  }

  getRecentComments() {
    const commentsSet: { [name: string]: boolean } = {}
    const result: string[] = []
    const sortedTransactions = _.sortBy(this.transactions, (t) => -new Date(t.datetime).getTime())
    for (const transaction of sortedTransactions) {
      if (transaction.comment && !commentsSet[transaction.comment]) {
        commentsSet[transaction.comment] = true
        result.push(transaction.comment)
      }
    }

    return result
  }

  getRecentCommentsByCategory(category: string) {
    const commentsSet: { [name: string]: boolean } = {}
    const result: string[] = []
    const sortedTransactions = _.sortBy(this.transactions, (t) => -new Date(t.datetime).getTime())
    const orderedTransactions = [
      ...sortedTransactions.filter((t) => t.category === category),
      ...sortedTransactions.filter((t) => t.category !== category),
    ]

    for (const transaction of orderedTransactions) {
      if (transaction.comment && !commentsSet[transaction.comment]) {
        commentsSet[transaction.comment] = true
        result.push(transaction.comment)
      }
    }

    return result
  }
}
