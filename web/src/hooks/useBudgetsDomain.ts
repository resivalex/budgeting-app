import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import { spendingLimitsAtom, transactionsAtom, transactionsAggregationsAtom } from '@/state'
import { BudgetsDomain, BudgetResult } from '@/domain'
import { BackendService, StorageService } from '@/services'

interface UseBudgetsDomainReturn {
  budgets: BudgetResult[]
  availableMonths: string[]
  selectedMonth: string
  expectationRatio: number | null
  setSelectedMonth: (month: string) => void
  updateBudgetItem: (name: string, currency: string, amount: number) => Promise<void>
  refreshSpendingLimits: () => Promise<void>
}

export function useBudgetsDomain(backendService: BackendService): UseBudgetsDomainReturn {
  const [spendingLimits, setSpendingLimits] = useAtom(spendingLimitsAtom)
  const transactions = useAtomValue(transactionsAtom)
  const aggregations = useAtomValue(transactionsAggregationsAtom)
  const [selectedMonth, setSelectedMonth] = useState<string>('')

  const storageService = useMemo(() => new StorageService(), [])

  const budgetsDomain = useMemo(
    () => new BudgetsDomain(backendService, storageService),
    [backendService, storageService],
  )

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
      aggregations.categories,
      spendingLimits,
      selectedMonth,
    )
  }, [budgetsDomain, transactions, aggregations.categories, spendingLimits, selectedMonth])

  const expectationRatio = useMemo(
    () => budgetsDomain.calculateExpectationRatio(selectedMonth),
    [budgetsDomain, selectedMonth],
  )

  const refreshSpendingLimits = useCallback(async () => {
    const limits = await budgetsDomain.loadSpendingLimits()
    setSpendingLimits(limits)
  }, [budgetsDomain, setSpendingLimits])

  const updateBudgetItem = useCallback(
    async (name: string, currency: string, amount: number) => {
      await budgetsDomain.updateBudgetItem(selectedMonth, name, currency, amount)
      await refreshSpendingLimits()
    },
    [budgetsDomain, selectedMonth, refreshSpendingLimits],
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
