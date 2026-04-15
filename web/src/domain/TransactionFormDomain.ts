import {
  TransactionDTO,
  CategoryExpansionsDTO,
  ColoredAccountDetailsDTO,
  SpendingLimitsDTO,
} from '@/types'
import { TransactionAggregator } from '@/services'

interface CategoryOption {
  value: string
  label: string
}

interface AvailableCurrenciesAndAccounts {
  availableCurrencies: string[]
  availableColoredAccounts: ColoredAccountDetailsDTO[]
}

class TransactionFormDomain {
  buildCategoryExtensionsMap(
    categoryExpansions: CategoryExpansionsDTO | null,
  ): Record<string, string> {
    if (!categoryExpansions) {
      return {}
    }

    const map: Record<string, string> = {}
    categoryExpansions.expansions.forEach((e) => {
      map[e.name] = e.expandedName
    })
    return map
  }

  buildCategoryOptions(
    categories: string[],
    categoryExtensions: Record<string, string>,
  ): CategoryOption[] {
    return categories.map((c) => ({
      value: c,
      label: categoryExtensions[c] || c,
    }))
  }

  getAvailableCurrenciesAndAccounts(
    type: string,
    currency: string,
    allCurrencies: string[],
    coloredAccounts: ColoredAccountDetailsDTO[],
  ): AvailableCurrenciesAndAccounts {
    const needsMultipleAccounts = type === 'transfer' || type === 'custom'
    const availableCurrencies = needsMultipleAccounts
      ? allCurrencies.filter((c) => coloredAccounts.filter((a) => a.currency === c).length > 1)
      : allCurrencies

    const availableColoredAccounts = coloredAccounts.filter((a) => a.currency === currency)

    return {
      availableCurrencies,
      availableColoredAccounts,
    }
  }

  getPayeesByCategory(
    category: string,
    transactions: TransactionDTO[],
    defaultPayees: string[],
    externalAccountIds: Set<string>,
  ): string[] {
    if (!category) {
      return defaultPayees
    }
    const aggregator = new TransactionAggregator(transactions, externalAccountIds)
    return aggregator.getRecentPayeesByCategory(category)
  }

  getCommentsByCategory(
    category: string,
    transactions: TransactionDTO[],
    defaultComments: string[],
    externalAccountIds: Set<string>,
  ): string[] {
    if (!category) {
      return defaultComments
    }
    const aggregator = new TransactionAggregator(transactions, externalAccountIds)
    return aggregator.getRecentCommentsByCategory(category)
  }

  validateTransaction(params: {
    datetime: string
    amount: string
    account: string
    category: string
    type: string
    currency: string
    accountFrom: string
    accountTo: string
  }): boolean {
    const {
      datetime,
      amount,
      account,
      category,
      type,
      currency,
      accountFrom,
      accountTo,
    } = params

    if (!datetime || !amount || !type || !currency) return false

    if (type === 'custom') {
      return !!(accountFrom && accountTo)
    }

    return !!(
      account &&
      (type === 'transfer' || category) &&
      (type !== 'transfer' || accountTo)
    )
  }

  getBucketIdsForCategory(category: string, spendingLimits: SpendingLimitsDTO): string[] {
    return spendingLimits.limits
      .filter((limit) => limit.categories.includes(category))
      .map((limit) => limit.bucketId)
  }

  buildTransactionDTO(params: {
    id: string
    datetime: string
    account: string
    category: string
    type: 'income' | 'expense' | 'transfer' | 'custom'
    amount: string
    currency: string
    payee: string
    comment: string
    bucket_id: string
    accountFrom: string
    accountTo: string
    bucketFrom: string
    bucketTo: string
  }): TransactionDTO {
    const { type } = params
    const externalAccount = `external_${params.currency.toLowerCase()}`
    const bucketId = params.bucket_id || 'default'

    if (type === 'custom') {
      return {
        _id: params.id,
        datetime: params.datetime,
        account_from: params.accountFrom,
        account_to: params.accountTo,
        category: params.category,
        amount: (parseFloat(params.amount) || 0).toFixed(2),
        currency: params.currency,
        counterparty: params.payee,
        comment: params.comment,
        bucket_from: params.bucketFrom || 'default',
        bucket_to: params.bucketTo || 'default',
        kind: 'transaction',
      }
    }

    return {
      _id: params.id,
      datetime: params.datetime,
      account_from: type === 'income' ? externalAccount : params.account,
      account_to:
        type === 'expense'
          ? externalAccount
          : type === 'transfer'
            ? params.accountTo
            : params.account,
      category: type === 'transfer' ? '' : params.category,
      amount: (parseFloat(params.amount) || 0).toFixed(2),
      currency: params.currency,
      counterparty: type === 'transfer' ? '' : params.payee,
      comment: params.comment,
      bucket_from: type === 'income' ? bucketId : 'default',
      bucket_to: type === 'expense' ? bucketId : 'default',
      kind: 'transaction',
    }
  }

  shouldResetCurrency(
    type: string,
    currency: string,
    allCurrencies: string[],
    coloredAccounts: ColoredAccountDetailsDTO[],
  ): boolean {
    const { availableCurrencies } = this.getAvailableCurrenciesAndAccounts(
      type,
      currency,
      allCurrencies,
      coloredAccounts,
    )
    return !availableCurrencies.includes(currency)
  }

  shouldResetAccount(
    account: string,
    currency: string,
    coloredAccounts: ColoredAccountDetailsDTO[],
  ): boolean {
    const availableAccountNames = coloredAccounts
      .filter((a) => a.currency === currency)
      .map((a) => a.account)
    return !availableAccountNames.includes(account)
  }
}

export default TransactionFormDomain
