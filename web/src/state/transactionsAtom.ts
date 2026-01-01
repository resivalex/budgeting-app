import { atom } from 'jotai'
import { TransactionDTO, TransactionsAggregations } from '@/types'
import { TransactionDomain } from '@/domain'
import _ from 'lodash'

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
  return TransactionDomain.getAggregations(transactions)
})
