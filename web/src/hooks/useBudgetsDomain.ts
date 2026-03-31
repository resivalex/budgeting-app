import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import { spendingLimitsAtom, currencyConfigsAtom, transactionsAtom, bucketsAtom } from '@/state'
import { BudgetsDomain, BudgetResult } from '@/domain'
import { DbService } from '@/services'

interface UseBudgetsDomainReturn {
  budgets: BudgetResult[]
  availableMonths: string[]
  selectedMonth: string
  expectationRatio: number | null
  setSelectedMonth: (month: string) => void
  updateBudgetItem: (bucketId: string, currency: string, amount: number) => Promise<void>
  refreshSpendingLimits: () => Promise<void>
}

export function useBudgetsDomain(dbService: DbService): UseBudgetsDomainReturn {
  const [spendingLimits, setSpendingLimits] = useAtom(spendingLimitsAtom)
  const [currencyConfigs, setCurrencyConfigs] = useAtom(currencyConfigsAtom)
  const transactions = useAtomValue(transactionsAtom)
  const buckets = useAtomValue(bucketsAtom)
  const [selectedMonth, setSelectedMonth] = useState<string>('')

  const budgetsDomain = useMemo(() => new BudgetsDomain(dbService), [dbService])

  const availableMonths = useMemo(
    () => budgetsDomain.getAvailableMonths(spendingLimits),
    [budgetsDomain, spendingLimits],
  )

  // Auto-select the latest month when available months change
  useEffect(() => {
    if (availableMonths.length > 0 && !selectedMonth) {
      setSelectedMonth(availableMonths[availableMonths.length - 1])
    }
  }, [availableMonths, selectedMonth])

  const budgets = useMemo(() => {
    if (!selectedMonth) return []
    return budgetsDomain.calculateBudgets(
      transactions,
      spendingLimits,
      currencyConfigs,
      buckets,
      selectedMonth,
    )
  }, [budgetsDomain, transactions, spendingLimits, currencyConfigs, buckets, selectedMonth])

  const expectationRatio = useMemo(
    () => budgetsDomain.calculateExpectationRatio(selectedMonth),
    [budgetsDomain, selectedMonth],
  )

  const refreshSpendingLimits = useCallback(async () => {
    const [limits, currencyConfigsData] = await Promise.all([
      budgetsDomain.loadSpendingLimits(),
      budgetsDomain.loadCurrencyConfigs(),
    ])
    setSpendingLimits(limits)
    setCurrencyConfigs(currencyConfigsData)
  }, [budgetsDomain, setSpendingLimits, setCurrencyConfigs])

  const updateBudgetItem = useCallback(
    async (bucketId: string, currency: string, amount: number) => {
      const updated = await budgetsDomain.updateBudgetItem(
        selectedMonth,
        bucketId,
        currency,
        amount,
      )
      setSpendingLimits(updated)
    },
    [budgetsDomain, selectedMonth, setSpendingLimits],
  )

  useEffect(() => {
    void refreshSpendingLimits()
  }, [refreshSpendingLimits])

  return {
    budgets,
    availableMonths,
    selectedMonth,
    expectationRatio,
    setSelectedMonth,
    updateBudgetItem,
    refreshSpendingLimits,
  }
}
