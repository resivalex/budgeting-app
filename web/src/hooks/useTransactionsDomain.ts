import { useCallback } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import { transactionsAtom, transactionsAggregationsAtom } from '@/state'
import { TransactionDTO } from '@/types'

export function useTransactionsDomain() {
  const [transactions, setTransactions] = useAtom(transactionsAtom)
  const transactionsAggregations = useAtomValue(transactionsAggregationsAtom)

  const addTransaction = useCallback(
    async (transaction: TransactionDTO) => {
      setTransactions([...transactions, transaction])
    },
    [transactions, setTransactions],
  )

  const updateTransaction = useCallback(
    async (transaction: TransactionDTO) => {
      const updatedTransactions = transactions.map((t) =>
        t._id === transaction._id ? transaction : t,
      )
      setTransactions(updatedTransactions)
    },
    [transactions, setTransactions],
  )

  const deleteTransaction = useCallback(
    async (transactionId: string) => {
      const filteredTransactions = transactions.filter((t) => t._id !== transactionId)
      setTransactions(filteredTransactions)
    },
    [transactions, setTransactions],
  )

  return {
    transactions,
    transactionsAggregations,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setTransactions,
  }
}
