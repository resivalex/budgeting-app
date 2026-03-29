import { useState, useMemo } from 'react'
import { useAtomValue } from 'jotai'
import {
  bucketsAtom,
  transactionsAtom,
  accountPropertiesAtom,
  currencyConfigsAtom,
  transactionsAggregationsAtom,
} from '@/state'
import { CurrencyConfigsDTO } from '@/types'
import Buckets from './Buckets'

interface AccountBalance {
  account: string
  currency: string
  balance: number
}

interface BucketWithBalances {
  id: string
  name: string
  color: string
  totalInMainCurrency: number | null
  balances: AccountBalance[]
}

interface LatestRate {
  currency: string
  rate: number
  date: string
}

function buildLatestRates(currencyConfigs: CurrencyConfigsDTO, mainCurrency: string): LatestRate[] {
  const latestMentionDate = new Map<string, string>()
  for (const { date, config } of currencyConfigs.monthCurrencyConfigs) {
    const currencies = [config.mainCurrency, ...config.conversionRates.map((r) => r.currency)]
    for (const c of currencies) {
      if (!latestMentionDate.has(c) || date > latestMentionDate.get(c)!) {
        latestMentionDate.set(c, date)
      }
    }
  }

  // Build a currency-independent value map (intrinsic value v[C]).
  // crossRate[A][B] = v[A] / v[B] = "how many B per 1 A".
  // Process configs newest-first; once a currency is added, its value never changes.
  const knownValues = new Map<string, number>()

  const sortedConfigs = [...currencyConfigs.monthCurrencyConfigs].sort((a, b) =>
    b.date.localeCompare(a.date),
  )

  for (const { config } of sortedConfigs) {
    // rateToMain(C) = config rate of C relative to mainCurrency of this config (1 for mainCurrency itself)
    // v[C] = v[configMain] / rateToMain(C)
    const allInConfig: Array<{ currency: string; rateToMain: number }> = [
      { currency: config.mainCurrency, rateToMain: 1 },
      ...config.conversionRates.map((cr) => ({ currency: cr.currency, rateToMain: cr.rate })),
    ]

    if (knownValues.size === 0) {
      // Bootstrap from the newest config: set configMain value to 1
      for (const { currency, rateToMain } of allInConfig) {
        knownValues.set(currency, 1 / rateToMain)
      }
      continue
    }

    const knownInConfig = allInConfig.filter(({ currency }) => knownValues.has(currency))
    const newInConfig = allInConfig.filter(({ currency }) => !knownValues.has(currency))

    if (newInConfig.length === 0 || knownInConfig.length === 0) continue

    // Each known bridge K_i implies: v[configMain] = v[K_i] * rateToMain(K_i).
    // Take the geometric mean of all bridge estimates for v[configMain].
    let logSum = 0
    for (const { currency, rateToMain } of knownInConfig) {
      logSum += Math.log(knownValues.get(currency)!) + Math.log(rateToMain)
    }
    const logImpliedConfigMain = logSum / knownInConfig.length

    for (const { currency, rateToMain } of newInConfig) {
      knownValues.set(currency, Math.exp(logImpliedConfigMain) / rateToMain)
    }
  }

  const mainValue = knownValues.get(mainCurrency)
  if (!mainValue) return []

  const result: LatestRate[] = []
  knownValues.forEach((value, currency) => {
    if (currency === mainCurrency) return
    result.push({
      currency,
      rate: mainValue / value, // crossRate[main][currency] = how many currency per 1 main
      date: latestMentionDate.get(currency) ?? '',
    })
  })
  result.sort((a, b) => a.currency.localeCompare(b.currency))
  return result
}

function calculateBucketBalances(
  buckets: { id: string; name: string; color: string }[],
  transactions: {
    bucket_from: string
    bucket_to: string
    account_from: string
    account_to: string
    amount: string
    currency: string
  }[],
  mainCurrency: string,
  latestRates: LatestRate[],
): BucketWithBalances[] {
  const balanceMap = new Map<string, Map<string, number>>()

  for (const bucket of buckets) {
    balanceMap.set(bucket.id, new Map())
  }

  for (const tx of transactions) {
    const amount = parseFloat(tx.amount) || 0
    const fromKey = `${tx.account_from}\0${tx.currency}`
    const toKey = `${tx.account_to}\0${tx.currency}`

    if (tx.bucket_from && balanceMap.has(tx.bucket_from)) {
      const accountMap = balanceMap.get(tx.bucket_from)!
      accountMap.set(fromKey, (accountMap.get(fromKey) || 0) - amount)
    }

    if (tx.bucket_to && balanceMap.has(tx.bucket_to)) {
      const accountMap = balanceMap.get(tx.bucket_to)!
      accountMap.set(toKey, (accountMap.get(toKey) || 0) + amount)
    }
  }

  const rateForCurrency = new Map<string, number>()
  for (const lr of latestRates) {
    rateForCurrency.set(lr.currency, lr.rate)
  }

  return buckets.map((bucket) => {
    const accountMap = balanceMap.get(bucket.id) || new Map()
    const balances: AccountBalance[] = []
    let totalInMainCurrency: number | null = 0

    accountMap.forEach((balance, key) => {
      if (balance !== 0) {
        const [account, currency] = key.split('\0')
        balances.push({ account, currency, balance })

        if (currency === mainCurrency) {
          totalInMainCurrency = (totalInMainCurrency ?? 0) + balance
        } else {
          const rate = rateForCurrency.get(currency)
          if (rate != null) {
            totalInMainCurrency = (totalInMainCurrency ?? 0) + balance / rate
          } else {
            totalInMainCurrency = null
          }
        }
      }
    })
    balances.sort((a, b) => a.account.localeCompare(b.account))

    return {
      id: bucket.id,
      name: bucket.name,
      color: bucket.color,
      totalInMainCurrency: balances.length > 0 ? totalInMainCurrency : null,
      balances,
    }
  })
}

export default function BucketsContainer() {
  const buckets = useAtomValue(bucketsAtom)
  const transactions = useAtomValue(transactionsAtom)
  const accountProperties = useAtomValue(accountPropertiesAtom)
  const currencyConfigs = useAtomValue(currencyConfigsAtom)
  const aggregations = useAtomValue(transactionsAggregationsAtom)

  const availableCurrencies = aggregations.currencies
  const [mainCurrency, setMainCurrency] = useState('')

  const selectedCurrency = mainCurrency || availableCurrencies[0] || ''

  const accountInfoMap = useMemo(() => {
    const map = new Map<string, { name: string; color: string }>()
    accountProperties?.accounts.forEach((a) => {
      map.set(a.id, { name: a.name, color: a.color })
    })
    return map
  }, [accountProperties])

  const latestRates = useMemo(
    () => (selectedCurrency ? buildLatestRates(currencyConfigs, selectedCurrency) : []),
    [currencyConfigs, selectedCurrency],
  )

  const bucketBalances = useMemo(
    () => calculateBucketBalances(buckets.buckets, transactions, selectedCurrency, latestRates),
    [buckets, transactions, selectedCurrency, latestRates],
  )

  return (
    <Buckets
      buckets={bucketBalances}
      accountInfoMap={accountInfoMap}
      availableCurrencies={availableCurrencies}
      mainCurrency={selectedCurrency}
      onMainCurrencyChange={setMainCurrency}
      latestRates={latestRates}
    />
  )
}
