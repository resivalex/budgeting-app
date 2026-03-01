import { useMemo } from 'react'
import { useAtomValue } from 'jotai'
import {
  categoryExpansionsAtom,
  transactionsAtom,
  transactionsAggregationsAtom,
  spendingLimitsAtom,
} from '@/state'
import { TransactionFormDomain } from '@/domain'
import { TransactionDTO, ColoredAccountDetailsDTO, SpendingLimitsDTO } from '@/types'
import { useColoredAccounts } from './useColoredAccounts'

interface UseTransactionFormDomainReturn {
  categoryOptions: { value: string; label: string }[]
  budgetNameOptions: { value: string; label: string }[]
  coloredAccounts: ColoredAccountDetailsDTO[]
  transactions: TransactionDTO[]
  allCurrencies: string[]
  allPayees: string[]
  allComments: string[]
  spendingLimits: SpendingLimitsDTO
  domain: TransactionFormDomain
}

export function useTransactionFormDomain(): UseTransactionFormDomainReturn {
  const categoryExpansions = useAtomValue(categoryExpansionsAtom)
  const transactions = useAtomValue(transactionsAtom)
  const aggregations = useAtomValue(transactionsAggregationsAtom)
  const spendingLimits = useAtomValue(spendingLimitsAtom)
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

  const budgetNameOptions = useMemo(
    () => spendingLimits.limits.map((l) => ({ value: l.name, label: l.name })),
    [spendingLimits.limits],
  )

  return {
    categoryOptions,
    budgetNameOptions,
    coloredAccounts,
    transactions,
    allCurrencies: aggregations.currencies,
    allPayees: aggregations.payees,
    allComments: aggregations.comments,
    spendingLimits,
    domain,
  }
}
