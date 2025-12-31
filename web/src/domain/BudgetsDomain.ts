import { TransactionDTO, SpendingLimitsDTO } from '@/types'
import { BackendService, StorageService } from '@/services'
import { convertToLocaleTime } from '@/utils'
import _ from 'lodash'

type ConversionMapType = { [sourceCurrency: string]: { [targetCurrency: string]: number } }

interface MonthSpendingLimit {
  name: string
  color: string
  categories: string[]
  currency: string
  amount: number
  isEditable: boolean
}

export interface BudgetResult {
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
  private backendService: BackendService
  private storageService: StorageService

  constructor(backendService: BackendService, storageService: StorageService) {
    this.backendService = backendService
    this.storageService = storageService
  }

  async loadSpendingLimits(): Promise<SpendingLimitsDTO> {
    try {
      const spendingLimits = await this.backendService.getSpendingLimits()
      this.storageService.set('spendingLimits', spendingLimits)
      return spendingLimits
    } catch (error) {
      const cached = this.storageService.get('spendingLimits')
      if (cached) {
        return cached
      }
      return { limits: [], monthCurrencyConfigs: [] }
    }
  }

  async updateBudgetItem(
    monthDate: string,
    name: string,
    currency: string,
    amount: number,
  ): Promise<void> {
    await this.backendService.setMonthSpendingItemLimit(monthDate, name, currency, amount)
  }

  calculateBudgets(
    transactions: TransactionDTO[],
    categories: string[],
    spendingLimits: SpendingLimitsDTO,
    monthDate: string,
  ): BudgetResult[] {
    const monthCurrencyConfig = spendingLimits.monthCurrencyConfigs.find(
      (c) => c.date === monthDate,
    )
    if (!monthCurrencyConfig) {
      return []
    }
    const currencyConfig = { ...monthCurrencyConfig.config }

    const conversionMap = this.buildConversionMap(currencyConfig)
    const monthTransactions = this.filterMonthTransactions(transactions, monthDate, conversionMap)
    const monthSpendingLimits = this.extractMonthSpendingLimits(spendingLimits, monthDate)

    const totalLimit = this.buildTotalLimit(
      monthSpendingLimits,
      currencyConfig.mainCurrency,
      conversionMap,
    )
    const restLimit = this.buildRestLimit(
      categories,
      totalLimit.categories,
      currencyConfig.mainCurrency,
    )

    return [totalLimit, ...monthSpendingLimits, restLimit].map((spendingLimit) =>
      this.calculateSingleBudget(monthTransactions, spendingLimit, conversionMap),
    )
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
          const invertedRate = 1.0 / conversionRate.rate
          const anotherInvertedRate = 1.0 / anotherConversionRate.rate
          conversionMap[conversionRate.currency][anotherConversionRate.currency] =
            invertedRate / anotherInvertedRate
        }
      })
    })

    return conversionMap
  }

  private filterMonthTransactions(
    transactions: TransactionDTO[],
    monthDate: string,
    conversionMap: ConversionMapType,
  ): TransactionDTO[] {
    const monthDateObject = new Date(monthDate)
    return transactions.filter((transaction) => {
      if (transaction.type === 'transfer') {
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
    monthDate: string,
  ): MonthSpendingLimit[] {
    const monthDateObject = new Date(monthDate)
    const monthSpendingLimitsWithNulls = spendingLimits.limits.map((spendingLimit) => {
      const spendingLimitMonthLimits = spendingLimit.monthLimits.filter((monthLimit) => {
        const monthLimitDateObject = new Date(monthLimit.date)
        return (
          monthLimitDateObject.getMonth() === monthDateObject.getMonth() &&
          monthLimitDateObject.getFullYear() === monthDateObject.getFullYear()
        )
      })
      if (spendingLimitMonthLimits.length === 0) {
        return null
      }
      const spendingLimitMonthLimit = spendingLimitMonthLimits[0]
      return {
        name: spendingLimit.name,
        color: spendingLimit.color,
        categories: spendingLimit.categories,
        currency: spendingLimitMonthLimit.currency,
        amount: spendingLimitMonthLimit.amount,
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

  private buildRestLimit(
    allCategories: string[],
    usedCategories: string[],
    mainCurrency: string,
  ): MonthSpendingLimit {
    return {
      name: 'Другое',
      color: '#b6b6b6',
      currency: mainCurrency,
      amount: 0,
      categories: allCategories.filter((category) => !usedCategories.includes(category)),
      isEditable: false,
    }
  }

  private calculateSingleBudget(
    transactions: TransactionDTO[],
    spendingLimit: MonthSpendingLimit,
    conversionMap: ConversionMapType,
  ): BudgetResult {
    const budget: BudgetResult = {
      name: spendingLimit.name,
      color: spendingLimit.color,
      currency: spendingLimit.currency,
      amount: spendingLimit.amount,
      categories: spendingLimit.categories,
      transactions: [],
      spentAmount: 0,
      isEditable: spendingLimit.isEditable,
    }

    const categoriesMap: { [category: string]: boolean } = {}
    spendingLimit.categories.forEach((category) => {
      categoriesMap[category] = true
    })

    transactions.forEach((transaction) => {
      if (categoriesMap[transaction.category]) {
        budget.transactions.push(transaction)
        const sign = transaction.type === 'expense' ? 1 : -1
        budget.spentAmount +=
          sign *
          parseFloat(transaction.amount) *
          conversionMap[transaction.currency][budget.currency]
      }
    })

    return budget
  }
}

export default BudgetsDomain
