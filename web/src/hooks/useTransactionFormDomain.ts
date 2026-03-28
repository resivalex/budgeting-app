import { useMemo } from 'react'
import { useAtomValue } from 'jotai'
import {
  categoryExpansionsAtom,
  transactionsAtom,
  transactionsAggregationsAtom,
  bucketsAtom,
  spendingLimitsAtom,
} from '@/state'
import { TransactionFormDomain } from '@/domain'
import { TransactionDTO, ColoredAccountDetailsDTO, BucketsDTO, SpendingLimitsDTO } from '@/types'
import { useColoredAccounts } from './useColoredAccounts'

interface UseTransactionFormDomainReturn {
  categoryOptions: { value: string; label: string }[]
  bucketOptions: { value: string; label: string }[]
  coloredAccounts: ColoredAccountDetailsDTO[]
  transactions: TransactionDTO[]
  allCurrencies: string[]
  allPayees: string[]
  allComments: string[]
  buckets: BucketsDTO
  spendingLimits: SpendingLimitsDTO
  domain: TransactionFormDomain
}

export function useTransactionFormDomain(): UseTransactionFormDomainReturn {
  const categoryExpansions = useAtomValue(categoryExpansionsAtom)
  const transactions = useAtomValue(transactionsAtom)
  const aggregations = useAtomValue(transactionsAggregationsAtom)
  const buckets = useAtomValue(bucketsAtom)
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

  const bucketOptions = useMemo(
    () => buckets.buckets.map((b) => ({ value: b.id, label: b.name })),
    [buckets.buckets],
  )

  return {
    categoryOptions,
    bucketOptions,
    coloredAccounts,
    transactions,
    allCurrencies: aggregations.currencies,
    allPayees: aggregations.payees,
    allComments: aggregations.comments,
    buckets,
    spendingLimits,
    domain,
  }
}
