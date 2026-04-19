import {
  TransactionDTO,
  SpendingLimitsDTO,
  CurrencyConfigsDTO,
  BucketsDTO,
  BucketDTO,
} from '@/types'
import { DbService } from '@/services'
import { convertToLocaleTime } from '@/utils'
import _ from 'lodash'

type CurrencyWeightsType = Record<string, number>

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

    const currencyWeights = this.buildCurrencyWeights(currencyConfig)
    const monthTransactions = this.filterMonthTransactions(transactions, monthDate)
    const monthSpendingLimits = this.extractMonthSpendingLimits(
      spendingLimits,
      bucketMap,
      monthDate,
    )

    const commonBucketIds = new Set(spendingLimits.commonBucketIds)
    const totalLimit = this.buildTotalLimit(
      monthSpendingLimits,
      currencyConfig.mainCurrency,
      currencyWeights,
      commonBucketIds,
    )
    const restLimit = this.buildRestLimit(currencyConfig.mainCurrency)

    const realBudgets = monthSpendingLimits.map((spendingLimit) =>
      this.calculateSingleBudget(monthTransactions, spendingLimit, currencyWeights),
    )

    const assignedTransactionIds = new Set(
      realBudgets.flatMap((b) => b.transactions.map((t) => t._id)),
    )
    const unassignedTransactions = monthTransactions.filter(
      (t) => !assignedTransactionIds.has(t._id),
    )
    const restBudget = this.calculateRestBudget(unassignedTransactions, restLimit, currencyWeights)

    const commonBudgets = realBudgets.filter((b) => commonBucketIds.has(b.bucketId))
    const nonCommonBudgets = realBudgets.filter((b) => !commonBucketIds.has(b.bucketId))

    const totalBudget: BudgetResult = {
      bucketId: '',
      name: totalLimit.name,
      color: totalLimit.color,
      currency: totalLimit.currency,
      amount: totalLimit.amount,
      categories: totalLimit.categories,
      transactions: commonBudgets.flatMap((b) => b.transactions),
      spentAmount: commonBudgets.reduce(
        (sum, b) =>
          sum +
          this.convertCurrency(b.spentAmount, b.currency, totalLimit.currency, currencyWeights),
        0,
      ),
      isEditable: totalLimit.isEditable,
    }

    return [totalBudget, ...commonBudgets, ...nonCommonBudgets, restBudget]
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

  private buildCurrencyWeights(currencyConfig: {
    mainCurrency: string
    conversionRates: { currency: string; rate: number }[]
  }): CurrencyWeightsType {
    const currencyWeights: CurrencyWeightsType = { [currencyConfig.mainCurrency]: 1 }
    currencyConfig.conversionRates.forEach(({ currency, rate }) => {
      currencyWeights[currency] = 1 / rate
    })
    return currencyWeights
  }

  private convertCurrency(
    amount: number,
    from: string,
    to: string,
    currencyWeights: CurrencyWeightsType,
  ): number {
    return amount * (currencyWeights[from] / currencyWeights[to])
  }

  private filterMonthTransactions(
    transactions: TransactionDTO[],
    monthDate: string,
  ): TransactionDTO[] {
    const monthDateObject = new Date(monthDate)
    return transactions.filter((transaction) => {
      if (transaction.bucket_from === 'default' && transaction.bucket_to === 'default') {
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
    currencyWeights: CurrencyWeightsType,
    commonBucketIds: Set<string>,
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
    monthSpendingLimits
      .filter((sl) => commonBucketIds.has(sl.bucketId))
      .forEach((spendingLimit) => {
        totalLimit.amount += this.convertCurrency(
          spendingLimit.amount,
          spendingLimit.currency,
          mainCurrency,
          currencyWeights,
        )
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
    currencyWeights: CurrencyWeightsType,
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
      const matchesBucket =
        transaction.bucket_from === spendingLimit.bucketId ||
        transaction.bucket_to === spendingLimit.bucketId

      if (matchesBucket) {
        budget.transactions.push(transaction)
        if (currencyWeights[transaction.currency] !== undefined) {
          const convertedAmount = this.convertCurrency(
            parseFloat(transaction.amount),
            transaction.currency,
            budget.currency,
            currencyWeights,
          )
          let delta = 0
          if (transaction.bucket_to === spendingLimit.bucketId) delta += convertedAmount
          if (transaction.bucket_from === spendingLimit.bucketId) delta -= convertedAmount
          budget.spentAmount += delta
        }
      }
    })

    return budget
  }

  private calculateRestBudget(
    unassignedTransactions: TransactionDTO[],
    restLimit: MonthSpendingLimit,
    currencyWeights: CurrencyWeightsType,
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
      if (currencyWeights[transaction.currency] !== undefined) {
        const convertedAmount = this.convertCurrency(
          parseFloat(transaction.amount),
          transaction.currency,
          budget.currency,
          currencyWeights,
        )
        if (transaction.bucket_to !== 'default') budget.spentAmount += convertedAmount
        if (transaction.bucket_from !== 'default') budget.spentAmount -= convertedAmount
      }
    })

    return budget
  }
}

export default BudgetsDomain
