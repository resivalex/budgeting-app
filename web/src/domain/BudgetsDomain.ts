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
import { BucketPosting, DEFAULT_BUCKET_ID, getBucketPostings } from './BucketPostings'

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

    const bucketMap = new Map<string, BucketDTO>(buckets.buckets.map((b) => [b.id, b]))

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

    const realBudgets = monthSpendingLimits.map((spendingLimit) =>
      this.calculateBudget(
        monthTransactions,
        spendingLimit,
        currencyWeights,
        (posting) => posting.bucketId === spendingLimit.bucketId,
      ),
    )

    const assignedTransactionIds = new Set(
      realBudgets.flatMap((b) => b.transactions.map((t) => t._id)),
    )
    const unassignedTransactions = monthTransactions.filter(
      (t) => !assignedTransactionIds.has(t._id),
    )
    const restBudget = this.calculateBudget(
      unassignedTransactions,
      {
        bucketId: '',
        name: 'Другое',
        color: '#b6b6b6',
        currency: currencyConfig.mainCurrency,
        amount: 0,
        categories: [],
        isEditable: false,
      },
      currencyWeights,
      (posting) => posting.bucketId !== DEFAULT_BUCKET_ID,
    )

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
      if (
        !getBucketPostings(transaction).some((posting) => posting.bucketId !== DEFAULT_BUCKET_ID)
      ) {
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

  private calculateBudget(
    transactions: TransactionDTO[],
    spendingLimit: MonthSpendingLimit,
    currencyWeights: CurrencyWeightsType,
    includePosting: (posting: BucketPosting) => boolean,
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
      const postings = getBucketPostings(transaction).filter(includePosting)

      if (postings.length === 0) return

      budget.transactions.push(transaction)
      if (currencyWeights[transaction.currency] !== undefined) {
        budget.spentAmount += postings.reduce(
          (sum, posting) =>
            sum +
            this.convertCurrency(
              posting.amount,
              posting.currency,
              budget.currency,
              currencyWeights,
            ),
          0,
        )
      }
    })

    return budget
  }
}

export default BudgetsDomain
