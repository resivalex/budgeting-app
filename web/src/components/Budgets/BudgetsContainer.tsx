import { useState } from 'react'
import { BackendService } from '@/services'
import { useBudgetsDomain } from '@/hooks'
import Budgets from './Budgets'
import { TransactionsAggregations } from '@/types'

interface BudgetsContainerProps {
  backendService: BackendService
  transactionAggregations: TransactionsAggregations
  onTransactionRemove: (id: string) => Promise<void>
}

export default function BudgetsContainer({
  backendService,
  transactionAggregations,
  onTransactionRemove,
}: BudgetsContainerProps) {
  const [focusedBudgetName, setFocusedBudgetName] = useState('')

  const {
    budgets,
    availableMonths,
    selectedMonth,
    expectationRatio,
    setSelectedMonth,
    updateBudgetItem,
  } = useBudgetsDomain(backendService)

  const focusedBudget = budgets.find((budget) => budget.name === focusedBudgetName) || null

  const availableCurrencies = transactionAggregations.currencies.map((currency: string) => ({
    value: currency,
    label: currency,
  }))

  return (
    <Budgets
      budgets={budgets}
      selectedMonth={selectedMonth}
      availableMonths={availableMonths}
      onMonthSelect={setSelectedMonth}
      onBudgetItemChange={updateBudgetItem}
      onFocus={setFocusedBudgetName}
      focusedBudget={focusedBudget}
      commonBudgetsExpectationRatio={expectationRatio}
      onTransactionRemove={onTransactionRemove}
      availableCurrencies={availableCurrencies}
    />
  )
}
