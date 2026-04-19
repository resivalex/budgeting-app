import Budget from './Budget'
import BudgetInfoModal from './BudgetInfoModal'
import Select from 'react-select'
import dayjs from 'dayjs'
import { BudgetDTO } from './BudgetDTO'
import { CurrencyWeight } from '@/hooks/useBudgetsDomain'

interface Props {
  budgets: BudgetDTO[]
  selectedMonth: string
  availableMonths: string[]
  commonBucketIds: string[]
  currencyWeights: CurrencyWeight[]
  onMonthSelect: (month: string) => void
  onBudgetItemChange: (bucketId: string, currency: string, amount: number) => void
  onFocus: (name: string) => void
  focusedBudget: BudgetDTO | null
  commonBudgetsExpectationRatio: number | null
  onTransactionRemove: (id: string) => Promise<void>
  availableCurrencies: { value: string; label: string }[]
}

export default function Budgets({
  budgets,
  selectedMonth,
  availableMonths,
  commonBucketIds,
  currencyWeights,
  onMonthSelect,
  onBudgetItemChange,
  onFocus,
  focusedBudget,
  commonBudgetsExpectationRatio,
  onTransactionRemove,
  availableCurrencies,
}: Props) {
  const monthOptions = availableMonths.map((month) => ({
    value: month,
    label: dayjs(month).format('MMMM YYYY'),
  }))
  monthOptions.reverse()

  const commonBucketIdSet = new Set(commonBucketIds)
  const [totalBudget, ...rest] = budgets
  const restBudget = rest[rest.length - 1]
  const realBudgets = rest.slice(0, -1)
  const commonBudgets = realBudgets.filter((b) => commonBucketIdSet.has(b.bucketId))
  const nonCommonBudgets = realBudgets.filter((b) => !commonBucketIdSet.has(b.bucketId))

  function renderBudget(budget: BudgetDTO, index: number) {
    return (
      <Budget
        key={index}
        totalAmount={budget.amount}
        spentAmount={budget.spentAmount}
        currency={budget.currency}
        name={budget.name}
        color={budget.color}
        commonBudgetsExpectationRatio={commonBudgetsExpectationRatio}
        onLongPress={() => onFocus(budget.name)}
      />
    )
  }

  return (
    <>
      <div className="px-2 pb-1">
        {/* @ts-ignore */}
        <Select
          className="basic-single"
          classNamePrefix="select"
          value={monthOptions.find((option) => option.value === selectedMonth)}
          // @ts-ignore
          onChange={(selectedOption) => {
            if (!selectedOption) return
            onMonthSelect(selectedOption.value)
          }}
          options={monthOptions}
          isSearchable={false}
        />
      </div>
      <div className="box py-0 px-2" style={{ flex: 1, overflow: 'scroll' }}>
        {totalBudget && renderBudget(totalBudget, 0)}
        {commonBudgets.length > 0 && <div className="mt-6" />}
        {commonBudgets.map((budget, index) => renderBudget(budget, index + 1))}
        {nonCommonBudgets.length > 0 && <div className="mt-6" />}
        {nonCommonBudgets.map((budget, index) =>
          renderBudget(budget, commonBudgets.length + 1 + index),
        )}
        {restBudget && <div className="mt-6" />}
        {restBudget && renderBudget(restBudget, realBudgets.length + 1)}
        {currencyWeights.length > 0 && (
          <div className="mt-6 mb-2" style={{ fontSize: '0.85rem', color: '#888' }}>
            {currencyWeights.map(({ currency, weight }) => (
              <div key={currency}>
                {currency}: {weight.toFixed(8)}
              </div>
            ))}
          </div>
        )}
      </div>{' '}
      {focusedBudget && (
        <BudgetInfoModal
          budget={focusedBudget}
          onClose={() => onFocus('')}
          onTransactionRemove={onTransactionRemove}
          onBudgetChange={(amount: number, currency: string) =>
            onBudgetItemChange(focusedBudget.bucketId, currency, amount)
          }
          availableCurrencies={availableCurrencies}
        />
      )}
    </>
  )
}
