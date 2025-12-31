import { atom } from 'jotai'
import { TransactionDTO, TransactionsAggregations } from '@/types'
import { TransactionAggregator } from '@/services'
import _ from 'lodash'

const emptyAggregations: TransactionsAggregations = {
  accountDetails: [],
  categories: [],
  currencies: [],
  payees: [],
  comments: [],
}

export const rawTransactionsAtom = atom<TransactionDTO[]>([])

export const transactionsAtom = atom(
  (get) => get(rawTransactionsAtom),
  (_get, set, transactions: TransactionDTO[]) => {
    const sortedTransactions = _.sortBy(
      transactions,
      (transaction: TransactionDTO) => transaction.datetime,
    ).reverse()
    set(rawTransactionsAtom, sortedTransactions)
  },
)

export const transactionsAggregationsAtom = atom<TransactionsAggregations>((get) => {
  const transactions = get(rawTransactionsAtom)
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
})
