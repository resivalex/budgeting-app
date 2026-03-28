import { useMemo } from 'react'
import { useAtomValue } from 'jotai'
import { bucketsAtom, transactionsAtom, accountPropertiesAtom } from '@/state'
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
  balances: AccountBalance[]
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

  return buckets.map((bucket) => {
    const accountMap = balanceMap.get(bucket.id) || new Map()
    const balances: AccountBalance[] = []
    accountMap.forEach((balance, key) => {
      if (balance !== 0) {
        const [account, currency] = key.split('\0')
        balances.push({ account, currency, balance })
      }
    })
    balances.sort((a, b) => a.account.localeCompare(b.account))

    return {
      id: bucket.id,
      name: bucket.name,
      color: bucket.color,
      balances,
    }
  })
}

export default function BucketsContainer() {
  const buckets = useAtomValue(bucketsAtom)
  const transactions = useAtomValue(transactionsAtom)
  const accountProperties = useAtomValue(accountPropertiesAtom)

  const accountInfoMap = useMemo(() => {
    const map = new Map<string, { name: string; color: string }>()
    accountProperties?.accounts.forEach((a) => {
      map.set(a.id, { name: a.name, color: a.color })
    })
    return map
  }, [accountProperties])

  const bucketBalances = useMemo(
    () => calculateBucketBalances(buckets.buckets, transactions),
    [buckets, transactions],
  )

  return <Buckets buckets={bucketBalances} accountInfoMap={accountInfoMap} />
}
