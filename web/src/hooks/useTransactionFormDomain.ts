import { useMemo } from 'react'
import { useAtomValue } from 'jotai'
import { categoryExpansionsAtom, transactionsAtom, transactionsAggregationsAtom } from '@/state'
import { TransactionFormDomain } from '@/domain'
import { TransactionDTO, ColoredAccountDetailsDTO } from '@/types'
import { useColoredAccounts } from './useColoredAccounts'

interface UseTransactionFormDomainReturn {
  categoryOptions: { value: string; label: string }[]
  coloredAccounts: ColoredAccountDetailsDTO[]
  transactions: TransactionDTO[]
  allCurrencies: string[]
  allPayees: string[]
  allComments: string[]
  domain: TransactionFormDomain
}

export function useTransactionFormDomain(): UseTransactionFormDomainReturn {
  const categoryExpansions = useAtomValue(categoryExpansionsAtom)
  const transactions = useAtomValue(transactionsAtom)
  const aggregations = useAtomValue(transactionsAggregationsAtom)
  const coloredAccounts = useColoredAccounts()

  const domain = useMemo(() => new TransactionFormDomain(), [])

  const categoryExtensionsMap = useMemo(
    () => domain.buildCategoryExtensionsMap(categoryExpansions),
    [domain, categoryExpansions],
  )

  const categoryOptions = useMemo(
    () => domain.buildCategoryOptions(aggregations.categories, categoryExtensionsMap),
    [domain, aggregations.categories, categoryExtensionsMap],
  )

  return {
    categoryOptions,
    coloredAccounts,
    transactions,
    allCurrencies: aggregations.currencies,
    allPayees: aggregations.payees,
    allComments: aggregations.comments,
    domain,
  }
}
