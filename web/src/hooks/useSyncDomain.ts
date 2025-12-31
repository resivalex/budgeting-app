import { useEffect, useCallback, useMemo, useRef } from 'react'
import { useAtom } from 'jotai'
import { syncStatusAtom, transactionsAtom, SyncStatus } from '@/state'
import { SyncDomain } from '@/domain'
import { BackendService, DbService, StorageService } from '@/services'
import { TransactionDTO } from '@/types'

const IMMEDIATE_FIRST_PULL = 0
const RETRY_PUSH_DELAY = 3000
const SYNC_INTERVAL_MS = 10000

export function useSyncDomain(
  backendService: BackendService,
  dbService: DbService,
  instanceId: string,
) {
  const [syncStatus, setSyncStatus] = useAtom(syncStatusAtom)
  const [, setTransactions] = useAtom(transactionsAtom)

  const storageService = useMemo(() => new StorageService(), [])

  const onStatusChange = useCallback(
    (status: Partial<SyncStatus>) => {
      setSyncStatus((prev) => ({ ...prev, ...status }))
    },
    [setSyncStatus],
  )

  const onTransactionsLoaded = useCallback(
    (transactions: TransactionDTO[]) => {
      setTransactions(transactions)
    },
    [setTransactions],
  )

  const syncDomain = useMemo(
    () =>
      new SyncDomain(backendService, dbService, storageService, {
        onStatusChange,
        onTransactionsLoaded,
      }),
    [backendService, dbService, storageService, onStatusChange, onTransactionsLoaded],
  )

  const syncDomainRef = useRef(syncDomain)
  syncDomainRef.current = syncDomain

  const hasPushErrorRef = useRef(syncStatus.hasPushError)
  hasPushErrorRef.current = syncStatus.hasPushError

  useEffect(() => {
    let pullIntervalId: ReturnType<typeof setInterval> | null = null
    let retryIntervalId: ReturnType<typeof setInterval> | null = null

    const pullFromRemote = () => {
      void syncDomainRef.current.pullFromRemote()
    }

    const retryFailedPush = () => {
      if (hasPushErrorRef.current) {
        void syncDomainRef.current.pushToRemote()
      }
    }

    const initialPullTimeout = setTimeout(() => {
      pullFromRemote()
      pullIntervalId = setInterval(pullFromRemote, SYNC_INTERVAL_MS)
    }, IMMEDIATE_FIRST_PULL)

    const retryTimeout = setTimeout(() => {
      retryFailedPush()
      retryIntervalId = setInterval(retryFailedPush, SYNC_INTERVAL_MS)
    }, RETRY_PUSH_DELAY)

    return () => {
      clearTimeout(initialPullTimeout)
      clearTimeout(retryTimeout)
      if (pullIntervalId) {
        clearInterval(pullIntervalId)
      }
      if (retryIntervalId) {
        clearInterval(retryIntervalId)
      }
    }
  }, [instanceId])

  const addDbTransaction = useCallback(
    async (transaction: TransactionDTO) => {
      await syncDomain.addTransaction(transaction)
    },
    [syncDomain],
  )

  const replaceDbTransaction = useCallback(
    async (transaction: TransactionDTO) => {
      await syncDomain.updateTransaction(transaction)
    },
    [syncDomain],
  )

  const removeDbTransaction = useCallback(
    async (transactionId: string) => {
      await syncDomain.deleteTransaction(transactionId)
    },
    [syncDomain],
  )

  return {
    offlineMode: syncStatus.isOffline,
    addDbTransaction,
    replaceDbTransaction,
    removeDbTransaction,
  }
}
