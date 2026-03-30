import {
  TransactionDTO,
  SpendingLimitsDTO,
  CurrencyConfigsDTO,
  BucketsDTO,
  BucketDTO,
} from '@/types'
import { DbService } from '@/services'
import { convertToLocaleTime, deriveTransactionType, deriveBucketId } from '@/utils'
import _ from 'lodash'

type ConversionMapType = { [sourceCurrency: string]: { [targetCurrency: string]: number } }

interface MonthSpendingLimit {
  bucketId: string
  name: string
  color: string
  categories: string[]
  currency: string
  amount: number
  isEditable: boolean
}

export interface BudgetResult {
  bucketId: string
  name: string
  color: string
  currency: string
  amount: number
  categories: string[]
  transactions: TransactionDTO[]
  spentAmount: number
  isEditable: boolean
}

class BudgetsDomain {
  private readonly dbService: DbService

  constructor(dbService: DbService) {
    this.dbService = dbService
  }

  async loadSpendingLimits(): Promise<SpendingLimitsDTO> {
    return this.dbService.getSpendingLimits()
  }

  async loadBuckets(): Promise<BucketsDTO> {
    return this.dbService.getBuckets()
  }

  async loadCurrencyConfigs(): Promise<CurrencyConfigsDTO> {
    return this.dbService.getCurrencyConfigs()
  }

  async updateBudgetItem(
    monthDate: string,
    bucketId: string,
    currency: string,
    amount: number,
  ): Promise<SpendingLimitsDTO> {
    const spendingLimits = await this.dbService.getSpendingLimits()

    const limit = spendingLimits.limits.find((l) => l.bucketId === bucketId)
    if (!limit) {
      throw new Error(`Unknown limit bucket: ${bucketId}`)
    }

    const existingMonth = limit.monthLimits.find((ml) => ml.date === monthDate)
    if (existingMonth) {
      existingMonth.currency = currency
      existingMonth.amount = amount
    } else {
      limit.monthLimits.push({ date: monthDate, currency, amount })
    }

    await this.dbService.saveSpendingLimits(spendingLimits)
    return spendingLimits
  }

  calculateBudgets(
    transactions: TransactionDTO[],
    spendingLimits: SpendingLimitsDTO,
    currencyConfigs: CurrencyConfigsDTO,
    buckets: BucketsDTO,
    monthDate: string,
    externalAccountIds: Set<string>,
  ): BudgetResult[] {
    const monthCurrencyConfig = currencyConfigs.monthCurrencyConfigs.find(
      (c) => c.date === monthDate,
    )
    if (!monthCurrencyConfig) {
      return []
    }
    const currencyConfig = { ...monthCurrencyConfig.config }

    const bucketMap = new Map<string, BucketDTO>()
    buckets.buckets.forEach((b) => bucketMap.set(b.id, b))

    const conversionMap = this.buildConversionMap(currencyConfig)
    const monthTransactions = this.filterMonthTransactions(
      transactions,
      monthDate,
      conversionMap,
      externalAccountIds,
    )
    const monthSpendingLimits = this.extractMonthSpendingLimits(
      spendingLimits,
      bucketMap,
      monthDate,
    )

    const totalLimit = this.buildTotalLimit(
      monthSpendingLimits,
      currencyConfig.mainCurrency,
      conversionMap,
    )
    const restLimit = this.buildRestLimit(currencyConfig.mainCurrency)

    const realBudgets = monthSpendingLimits.map((spendingLimit) =>
      this.calculateSingleBudget(
        monthTransactions,
        spendingLimit,
        conversionMap,
        externalAccountIds,
      ),
    )

    const assignedTransactionIds = new Set(
      realBudgets.flatMap((b) => b.transactions.map((t) => t._id)),
    )
    const unassignedTransactions = monthTransactions.filter(
      (t) => !assignedTransactionIds.has(t._id),
    )
    const restBudget = this.calculateRestBudget(
      unassignedTransactions,
      restLimit,
      conversionMap,
      externalAccountIds,
    )

    const totalBudget: BudgetResult = {
      bucketId: '',
      name: totalLimit.name,
      color: totalLimit.color,
      currency: totalLimit.currency,
      amount: totalLimit.amount,
      categories: totalLimit.categories,
      transactions: realBudgets.flatMap((b) => b.transactions),
      spentAmount: realBudgets.reduce(
        (sum, b) => sum + b.spentAmount * conversionMap[b.currency][totalLimit.currency],
        0,
      ),
      isEditable: totalLimit.isEditable,
    }

    return [totalBudget, ...realBudgets, restBudget]
  }

  getAvailableMonths(spendingLimits: SpendingLimitsDTO): string[] {
    const availableMonths: string[] = []
    spendingLimits.limits.forEach((spendingLimit) => {
      spendingLimit.monthLimits.forEach((monthLimit) => {
        if (!availableMonths.includes(monthLimit.date)) {
          availableMonths.push(monthLimit.date)
        }
      })
    })
    return _.sortBy(availableMonths, (date) => new Date(date).getTime())
  }

  calculateExpectationRatio(selectedMonth: string): number | null {
    const currentDate = new Date()
    const selectedMonthDate = new Date(selectedMonth)

    if (currentDate.getMonth() !== selectedMonthDate.getMonth()) {
      return null
    }

    const selectedMonthFirstDay = new Date(
      selectedMonthDate.getFullYear(),
      selectedMonthDate.getMonth(),
      1,
    )
    const nextMonthFirstDay = new Date(
      selectedMonthDate.getFullYear(),
      selectedMonthDate.getMonth() + 1,
      1,
    )
    const millisecondsInMonth = nextMonthFirstDay.getTime() - selectedMonthFirstDay.getTime()
    const millisecondsFromSelectedMonth = currentDate.getTime() - selectedMonthFirstDay.getTime()

    return millisecondsFromSelectedMonth / millisecondsInMonth
  }

  private buildConversionMap(currencyConfig: {
    mainCurrency: string
    conversionRates: { currency: string; rate: number }[]
  }): ConversionMapType {
    const conversionMap: ConversionMapType = {
      [currencyConfig.mainCurrency]: { [currencyConfig.mainCurrency]: 1 },
    }

    currencyConfig.conversionRates.forEach((conversionRate) => {
      const invertedRate = 1.0 / conversionRate.rate
      conversionMap[currencyConfig.mainCurrency][conversionRate.currency] = conversionRate.rate
      conversionMap[conversionRate.currency] = {
        [conversionRate.currency]: 1,
        [currencyConfig.mainCurrency]: invertedRate,
      }
    })

    currencyConfig.conversionRates.forEach((conversionRate) => {
      currencyConfig.conversionRates.forEach((anotherConversionRate) => {
        if (anotherConversionRate.currency !== conversionRate.currency) {
          conversionMap[conversionRate.currency][anotherConversionRate.currency] =
            anotherConversionRate.rate / conversionRate.rate
        }
      })
    })

    return conversionMap
  }

  private filterMonthTransactions(
    transactions: TransactionDTO[],
    monthDate: string,
    conversionMap: ConversionMapType,
    externalAccountIds: Set<string>,
  ): TransactionDTO[] {
    const monthDateObject = new Date(monthDate)
    return transactions.filter((transaction) => {
      if (deriveTransactionType(transaction, externalAccountIds) === 'transfer') {
        return false
      }
      if (!conversionMap[transaction.currency]) {
        return false
      }
      const transactionDate = new Date(convertToLocaleTime(transaction.datetime))
      return (
        transactionDate.getMonth() === monthDateObject.getMonth() &&
        transactionDate.getFullYear() === monthDateObject.getFullYear()
      )
    })
  }

  private extractMonthSpendingLimits(
    spendingLimits: SpendingLimitsDTO,
    bucketMap: Map<string, BucketDTO>,
    monthDate: string,
  ): MonthSpendingLimit[] {
    const monthDateObject = new Date(monthDate)
    const monthSpendingLimitsWithNulls = spendingLimits.limits.map((spendingLimit) => {
      const monthLimit = spendingLimit.monthLimits.find((monthLimit) => {
        const monthLimitDateObject = new Date(monthLimit.date)
        return (
          monthLimitDateObject.getMonth() === monthDateObject.getMonth() &&
          monthLimitDateObject.getFullYear() === monthDateObject.getFullYear()
        )
      })
      if (!monthLimit) {
        return null
      }
      const bucket = bucketMap.get(spendingLimit.bucketId)
      return {
        bucketId: spendingLimit.bucketId,
        name: bucket?.name ?? spendingLimit.bucketId,
        color: bucket?.color ?? '#b6b6b6',
        categories: spendingLimit.categories ?? [],
        currency: monthLimit.currency,
        amount: monthLimit.amount,
        isEditable: true,
      }
    })
    return monthSpendingLimitsWithNulls.filter(
      (spendingLimit) => spendingLimit !== null,
    ) as MonthSpendingLimit[]
  }

  private buildTotalLimit(
    monthSpendingLimits: MonthSpendingLimit[],
    mainCurrency: string,
    conversionMap: ConversionMapType,
  ): MonthSpendingLimit {
    const totalLimit: MonthSpendingLimit = {
      bucketId: '',
      name: 'ОБЩИЙ',
      color: '#b6b6b6',
      categories: [],
      currency: mainCurrency,
      amount: 0,
      isEditable: false,
    }
    monthSpendingLimits.forEach((spendingLimit) => {
      totalLimit.amount +=
        spendingLimit.amount * conversionMap[spendingLimit.currency][mainCurrency]
      totalLimit.categories = totalLimit.categories.concat(spendingLimit.categories)
    })
    return totalLimit
  }

  private buildRestLimit(mainCurrency: string): MonthSpendingLimit {
    return {
      bucketId: '',
      name: 'Другое',
      color: '#b6b6b6',
      currency: mainCurrency,
      amount: 0,
      categories: [],
      isEditable: false,
    }
  }

  private calculateSingleBudget(
    transactions: TransactionDTO[],
    spendingLimit: MonthSpendingLimit,
    conversionMap: ConversionMapType,
    externalAccountIds: Set<string>,
  ): BudgetResult {
    const budget: BudgetResult = {
      bucketId: spendingLimit.bucketId,
      name: spendingLimit.name,
      color: spendingLimit.color,
      currency: spendingLimit.currency,
      amount: spendingLimit.amount,
      categories: spendingLimit.categories,
      transactions: [],
      spentAmount: 0,
      isEditable: spendingLimit.isEditable,
    }

    transactions.forEach((transaction) => {
      if (deriveBucketId(transaction, externalAccountIds) === spendingLimit.bucketId) {
        budget.transactions.push(transaction)
        const sign = deriveTransactionType(transaction, externalAccountIds) === 'expense' ? 1 : -1
        budget.spentAmount +=
          sign *
          parseFloat(transaction.amount) *
          conversionMap[transaction.currency][budget.currency]
      }
    })

    return budget
  }

  private calculateRestBudget(
    unassignedTransactions: TransactionDTO[],
    restLimit: MonthSpendingLimit,
    conversionMap: ConversionMapType,
    externalAccountIds: Set<string>,
  ): BudgetResult {
    const budget: BudgetResult = {
      bucketId: '',
      name: restLimit.name,
      color: restLimit.color,
      currency: restLimit.currency,
      amount: restLimit.amount,
      categories: restLimit.categories,
      transactions: [],
      spentAmount: 0,
      isEditable: restLimit.isEditable,
    }

    unassignedTransactions.forEach((transaction) => {
      budget.transactions.push(transaction)
      const sign = deriveTransactionType(transaction, externalAccountIds) === 'expense' ? 1 : -1
      budget.spentAmount +=
        sign * parseFloat(transaction.amount) * conversionMap[transaction.currency][budget.currency]
    })

    return budget
  }
}

export default BudgetsDomain
