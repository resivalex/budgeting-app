import { useState, useCallback } from 'react'
import { BackendService, DbService } from '@/services'
import { useInterval } from './useInterval'
import { TransactionDTO } from '@/types'

export function useSyncService(
  backendService: BackendService,
  dbService: DbService,
  instanceId: string,
  onTransactionsPull: (transactions: TransactionDTO[]) => void,
) {
  const [hasPushError, setHasPushError] = useState(false)
  const [isOffline, setIsOffline] = useState(false)
  const [isFirstPullComplete, setIsFirstPullComplete] = useState(false)

  const pullFromLocalDb = useCallback(
    async function pullFromLocalDbImpl() {
      const transactions = await dbService.readAllDocs()
      onTransactionsPull(transactions)
    },
    [dbService, onTransactionsPull],
  )

  const pullFromRemote = useCallback(
    async function pullFromRemoteImpl() {
      if (!isFirstPullComplete) {
        await pullFromLocalDb()
        setIsFirstPullComplete(true)
      }

      try {
        const remoteSettings = await backendService.getSettings()

        const needsDatabaseReset =
          localStorage.transactionsUploadedAt !== remoteSettings.transactionsUploadedAt

        if (needsDatabaseReset) {
          await dbService.reset()
          localStorage.transactionsUploadedAt = remoteSettings.transactionsUploadedAt
        }

        const hasChangesFromRemote = await dbService.pullChanges()
        if (hasChangesFromRemote) {
          await pullFromLocalDb()
        }

        setIsOffline(false)
      } catch (error: any) {
        setIsOffline(true)
      }
    },
    [backendService, dbService, pullFromLocalDb, isFirstPullComplete],
  )

  const pushToRemote = useCallback(
    async function pushToRemoteImpl() {
      try {
        await dbService.pushChanges()
        setHasPushError(false)
      } catch (error) {
        setHasPushError(true)
      }
    },
    [dbService],
  )

  const retryFailedPush = useCallback(
    async function retryFailedPushImpl() {
      if (!hasPushError) {
        return
      }
      void pushToRemote()
    },
    [hasPushError, pushToRemote],
  )

  const immediateFirstPull = 0 // Run first pull immediately
  const retryPushDelay = 3000 // Wait 3s before first retry
  const syncIntervalMs = 10000 // 10s between sync operations
  useInterval(pullFromRemote, immediateFirstPull, syncIntervalMs, instanceId)
  useInterval(retryFailedPush, retryPushDelay, syncIntervalMs, instanceId)

  // Transaction operations
  async function addTransaction(transaction: TransactionDTO) {
    await dbService.addTransaction(transaction)
    await pushToRemote()
  }

  async function updateTransaction(transaction: TransactionDTO) {
    await dbService.replaceTransaction(transaction)
    await pushToRemote()
  }

  async function deleteTransaction(transactionId: string) {
    await dbService.removeTransaction(transactionId)
    await pushToRemote()
  }

  // Public API
  return {
    offlineMode: isOffline,
    addDbTransaction: addTransaction,
    replaceDbTransaction: updateTransaction,
    removeDbTransaction: deleteTransaction,
  }
}
