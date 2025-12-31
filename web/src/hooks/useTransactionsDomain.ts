import { useCallback, useMemo } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import { transactionsAtom, transactionsAggregationsAtom } from '@/state'
import { TransactionDomain } from '@/domain'
import { TransactionDTO } from '@/types'
import { DbService } from '@/services'

export function useTransactionsDomain(dbService: DbService) {
  const [transactions, setTransactions] = useAtom(transactionsAtom)
  const transactionsAggregations = useAtomValue(transactionsAggregationsAtom)

  const transactionDomain = useMemo(() => new TransactionDomain(dbService), [dbService])

  const loadTransactions = useCallback(async () => {
    const loadedTransactions = await transactionDomain.loadTransactions()
    setTransactions(loadedTransactions)
  }, [transactionDomain, setTransactions])

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
    loadTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setTransactions,
  }
}
