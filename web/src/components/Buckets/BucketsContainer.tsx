import { useState, useMemo } from 'react'
import { useAtomValue } from 'jotai'
import {
  bucketsAtom,
  transactionsAtom,
  accountPropertiesAtom,
  currencyConfigsAtom,
  transactionsAggregationsAtom,
} from '@/state'
import { BucketsDomain } from '@/domain'
import Buckets from './Buckets'

export default function BucketsContainer() {
  const buckets = useAtomValue(bucketsAtom)
  const transactions = useAtomValue(transactionsAtom)
  const accountProperties = useAtomValue(accountPropertiesAtom)
  const currencyConfigs = useAtomValue(currencyConfigsAtom)
  const aggregations = useAtomValue(transactionsAggregationsAtom)

  const availableCurrencies = aggregations.currencies
  const [mainCurrency, setMainCurrency] = useState('')

  const selectedCurrency = mainCurrency || availableCurrencies[0] || ''

  const bucketBalanceView = useMemo(
    () =>
      BucketsDomain.buildBucketBalanceView({
        buckets,
        transactions,
        accountProperties,
        currencyConfigs,
        mainCurrency: selectedCurrency,
      }),
    [buckets, transactions, accountProperties, currencyConfigs, selectedCurrency],
  )

  return (
    <Buckets
      buckets={bucketBalanceView.buckets}
      accountInfoMap={bucketBalanceView.accountInfoMap}
      availableCurrencies={availableCurrencies}
      mainCurrency={selectedCurrency}
      onMainCurrencyChange={setMainCurrency}
      latestRates={bucketBalanceView.latestRates}
    />
  )
}
