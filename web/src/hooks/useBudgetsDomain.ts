import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import { spendingLimitsAtom, currencyConfigsAtom, transactionsAtom, bucketsAtom } from '@/state'
import { BudgetsDomain, BudgetResult } from '@/domain'
import { DbService } from '@/services'

export interface CurrencyWeight {
  currency: string
  weight: number
}

interface UseBudgetsDomainReturn {
  budgets: BudgetResult[]
  availableMonths: string[]
  selectedMonth: string
  expectationRatio: number | null
  commonBucketIds: string[]
  currencyWeights: CurrencyWeight[]
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

  const currencyWeights = useMemo(() => {
    if (!selectedMonth) return []
    const monthConfig = currencyConfigs.monthCurrencyConfigs.find((c) => c.date === selectedMonth)
    if (!monthConfig) return []

    const { mainCurrency, conversionRates } = monthConfig.config
    const valueInMain: Record<string, number> = { [mainCurrency]: 1 }
    conversionRates.forEach(({ currency, rate }) => {
      valueInMain[currency] = 1 / rate
    })

    let baseCurrency = 'USD'
    if (!(baseCurrency in valueInMain)) {
      baseCurrency = Object.entries(valueInMain).reduce((a, b) => (b[1] > a[1] ? b : a))[0]
    }
    const baseValue = valueInMain[baseCurrency]

    return Object.entries(valueInMain)
      .map(([currency, value]) => ({ currency, weight: value / baseValue }))
      .sort((a, b) => b.weight - a.weight)
  }, [currencyConfigs, selectedMonth])

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
    commonBucketIds: spendingLimits.commonBucketIds,
    currencyWeights,
    setSelectedMonth,
    updateBudgetItem,
    refreshSpendingLimits,
  }
}
