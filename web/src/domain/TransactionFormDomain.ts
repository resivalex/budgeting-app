import { TransactionDTO, CategoryExpansionsDTO, ColoredAccountDetailsDTO } from '@/types'
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
    const availableCurrencies =
      type === 'transfer'
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
  ): string[] {
    if (!category) {
      return defaultPayees
    }
    const aggregator = new TransactionAggregator(transactions)
    return aggregator.getRecentPayeesByCategory(category)
  }

  getCommentsByCategory(
    category: string,
    transactions: TransactionDTO[],
    defaultComments: string[],
  ): string[] {
    if (!category) {
      return defaultComments
    }
    const aggregator = new TransactionAggregator(transactions)
    return aggregator.getRecentCommentsByCategory(category)
  }

  validateTransaction(params: {
    datetime: string
    amount: string
    account: string
    category: string
    type: string
    currency: string
    payeeTransferAccount: string
  }): boolean {
    const { datetime, amount, account, category, type, currency, payeeTransferAccount } = params

    return !!(
      datetime &&
      amount &&
      account &&
      (type === 'transfer' || category) &&
      type &&
      currency &&
      (type !== 'transfer' || payeeTransferAccount)
    )
  }

  buildTransactionDTO(params: {
    id: string
    datetime: string
    account: string
    category: string
    type: 'income' | 'expense' | 'transfer'
    amount: string
    currency: string
    payee: string
    payeeTransferAccount: string
    comment: string
  }): TransactionDTO {
    return {
      _id: params.id,
      datetime: params.datetime,
      account: params.account,
      category: params.type === 'transfer' ? '' : params.category,
      type: params.type,
      amount: (parseFloat(params.amount) || 0).toFixed(2),
      currency: params.currency,
      payee: params.type === 'transfer' ? params.payeeTransferAccount : params.payee,
      comment: params.comment,
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
