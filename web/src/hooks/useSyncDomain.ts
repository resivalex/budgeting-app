import { useEffect, useCallback, useMemo, useRef, useState } from 'react'
import { useAtom } from 'jotai'
import { syncStatusAtom, transactionsAtom } from '@/state'
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
  const [loadingCount, setLoadingCount] = useState(0)
  const isLoading = loadingCount > 0

  const storageService = useMemo(() => new StorageService(), [])

  const onOfflineChange = useCallback(
    (isOffline: boolean) => {
      setSyncStatus((prev) => ({ ...prev, isOffline }))
    },
    [setSyncStatus],
  )

  const onTransactionsLoaded = useCallback(
    (transactions: TransactionDTO[]) => {
      setTransactions(transactions)
    },
    [setTransactions],
  )

  const onLoadingChange = useCallback((loading: boolean) => {
    setLoadingCount((c) => (loading ? c + 1 : Math.max(0, c - 1)))
  }, [])

  const syncDomain = useMemo(
    () =>
      new SyncDomain(backendService, dbService, storageService, {
        onOfflineChange,
        onTransactionsLoaded,
        onLoadingChange,
      }),
    [
      backendService,
      dbService,
      storageService,
      onOfflineChange,
      onTransactionsLoaded,
      onLoadingChange,
    ],
  )

  const syncDomainRef = useRef(syncDomain)
  syncDomainRef.current = syncDomain

  useEffect(() => {
    let cancelled = false
    let pullIntervalId: ReturnType<typeof setTimeout> | null = null
    let retryIntervalId: ReturnType<typeof setInterval> | null = null

    const retryFailedPush = () => {
      if (syncDomainRef.current.hasPushError) {
        void syncDomainRef.current.pushToRemote()
      }
    }

    const schedulePull = () => {
      void syncDomainRef.current.pullFromRemote().finally(() => {
        if (!cancelled) {
          pullIntervalId = setTimeout(schedulePull, SYNC_INTERVAL_MS)
        }
      })
    }

    const initialPullTimeout = setTimeout(schedulePull, IMMEDIATE_FIRST_PULL)

    const retryTimeout = setTimeout(() => {
      retryFailedPush()
      retryIntervalId = setInterval(retryFailedPush, SYNC_INTERVAL_MS)
    }, RETRY_PUSH_DELAY)

    return () => {
      cancelled = true
      clearTimeout(initialPullTimeout)
      clearTimeout(retryTimeout)
      if (pullIntervalId) {
        clearTimeout(pullIntervalId)
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

  const forceRefresh = useCallback(async () => {
    await syncDomain.forceRefresh()
  }, [syncDomain])

  return {
    isLoading,
    offlineMode: syncStatus.isOffline,
    addDbTransaction,
    replaceDbTransaction,
    removeDbTransaction,
    forceRefresh,
  }
}
