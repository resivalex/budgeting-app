import {
  AccountPropertiesDTO,
  BucketDTO,
  BucketsDTO,
  CurrencyConfigsDTO,
  TransactionDTO,
} from '@/types'
import { getBucketPostings } from './BucketPostings'

export interface AccountBalance {
  account: string
  currency: string
  balance: number
  owner: string
}

export interface BucketWithBalances {
  id: string
  name: string
  color: string
  ownerTotals: Record<string, number | null>
  balances: AccountBalance[]
}

export interface LatestRate {
  currency: string
  rate: number
  date: string
}

export interface AccountInfo {
  name: string
  color: string
  owner: string
}

export interface BucketBalanceView {
  buckets: BucketWithBalances[]
  accountInfoMap: Map<string, AccountInfo>
  latestRates: LatestRate[]
}

interface BucketBalanceViewParams {
  buckets: BucketsDTO
  transactions: TransactionDTO[]
  accountProperties: AccountPropertiesDTO | null
  currencyConfigs: CurrencyConfigsDTO
  mainCurrency: string
}

class BucketsDomain {
  static buildBucketBalanceView({
    buckets,
    transactions,
    accountProperties,
    currencyConfigs,
    mainCurrency,
  }: BucketBalanceViewParams): BucketBalanceView {
    const accountInfoMap = this.buildAccountInfoMap(accountProperties)
    const accountOwnerMap = this.buildAccountOwnerMap(accountInfoMap)
    const latestRates = mainCurrency ? this.buildLatestRates(currencyConfigs, mainCurrency) : []

    return {
      buckets: this.calculateBucketBalances(
        buckets.buckets,
        transactions,
        mainCurrency,
        latestRates,
        accountOwnerMap,
      ),
      accountInfoMap,
      latestRates,
    }
  }

  private static buildAccountInfoMap(
    accountProperties: AccountPropertiesDTO | null,
  ): Map<string, AccountInfo> {
    const map = new Map<string, AccountInfo>()
    accountProperties?.accounts.forEach((account) => {
      map.set(account.id, {
        name: account.name,
        color: account.color,
        owner: account.owner,
      })
    })
    return map
  }

  private static buildAccountOwnerMap(
    accountInfoMap: Map<string, AccountInfo>,
  ): Map<string, string> {
    const map = new Map<string, string>()
    accountInfoMap.forEach((info, account) => {
      map.set(account, info.owner)
    })
    return map
  }

  private static buildLatestRates(
    currencyConfigs: CurrencyConfigsDTO,
    mainCurrency: string,
  ): LatestRate[] {
    const latestMentionDate = new Map<string, string>()
    for (const { date, config } of currencyConfigs.monthCurrencyConfigs) {
      const currencies = [config.mainCurrency, ...config.conversionRates.map((r) => r.currency)]
      for (const currency of currencies) {
        if (!latestMentionDate.has(currency) || date > latestMentionDate.get(currency)!) {
          latestMentionDate.set(currency, date)
        }
      }
    }

    const knownValues = new Map<string, number>()
    // Bridge older configs through currencies already seen in newer configs.
    const sortedConfigs = [...currencyConfigs.monthCurrencyConfigs].sort((a, b) =>
      b.date.localeCompare(a.date),
    )

    for (const { config } of sortedConfigs) {
      const ratesToMain = [
        { currency: config.mainCurrency, rateToMain: 1 },
        ...config.conversionRates.map((cr) => ({
          currency: cr.currency,
          rateToMain: cr.rate,
        })),
      ]

      if (knownValues.size === 0) {
        ratesToMain.forEach(({ currency, rateToMain }) => {
          knownValues.set(currency, 1 / rateToMain)
        })
        continue
      }

      const knownRates = ratesToMain.filter(({ currency }) => knownValues.has(currency))
      const newRates = ratesToMain.filter(({ currency }) => !knownValues.has(currency))

      if (newRates.length === 0 || knownRates.length === 0) continue

      const logImpliedMain =
        knownRates.reduce(
          (sum, { currency, rateToMain }) =>
            sum + Math.log(knownValues.get(currency)!) + Math.log(rateToMain),
          0,
        ) / knownRates.length

      newRates.forEach(({ currency, rateToMain }) => {
        knownValues.set(currency, Math.exp(logImpliedMain) / rateToMain)
      })
    }

    const mainValue = knownValues.get(mainCurrency)
    if (!mainValue) return []

    const result: LatestRate[] = []
    knownValues.forEach((value, currency) => {
      if (currency === mainCurrency) return
      result.push({
        currency,
        rate: mainValue / value,
        date: latestMentionDate.get(currency) ?? '',
      })
    })
    result.sort((a, b) => a.currency.localeCompare(b.currency))
    return result
  }

  private static calculateBucketBalances(
    buckets: BucketDTO[],
    transactions: TransactionDTO[],
    mainCurrency: string,
    latestRates: LatestRate[],
    accountOwnerMap: Map<string, string>,
  ): BucketWithBalances[] {
    const balanceMap = new Map<string, Map<string, number>>()

    buckets.forEach((bucket) => {
      balanceMap.set(bucket.id, new Map())
    })

    transactions.forEach((transaction) => {
      getBucketPostings(transaction).forEach((posting) => {
        if (!posting.bucketId || !balanceMap.has(posting.bucketId)) return

        const accountMap = balanceMap.get(posting.bucketId)!
        const key = `${posting.account}\0${posting.currency}`
        accountMap.set(key, (accountMap.get(key) || 0) + (posting.amount || 0))
      })
    })

    const rateForCurrency = new Map<string, number>()
    latestRates.forEach((latestRate) => {
      rateForCurrency.set(latestRate.currency, latestRate.rate)
    })

    const toMainCurrency = (amount: number, currency: string): number | null => {
      if (currency === mainCurrency) return amount
      const rate = rateForCurrency.get(currency)
      return rate != null ? amount / rate : null
    }

    return buckets.map((bucket) => {
      const accountMap = balanceMap.get(bucket.id) || new Map()
      const balances: AccountBalance[] = []
      const ownerTotals: Record<string, number | null> = {}

      accountMap.forEach((balance, key) => {
        if (Math.abs(balance) < 1e-6) return

        const [account, currency] = key.split('\0')
        const owner = accountOwnerMap.get(account) ?? 'unknown'
        const converted = toMainCurrency(balance, currency)
        balances.push({ account, currency, balance, owner })

        if (!(owner in ownerTotals)) ownerTotals[owner] = 0
        if (converted == null || ownerTotals[owner] == null) {
          ownerTotals[owner] = null
        } else {
          ownerTotals[owner] += converted
        }
      })
      balances.sort((a, b) => a.account.localeCompare(b.account))

      return {
        id: bucket.id,
        name: bucket.name,
        color: bucket.color,
        ownerTotals,
        balances,
      }
    })
  }
}

export default BucketsDomain
