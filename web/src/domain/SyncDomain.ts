import { TransactionDTO } from '@/types'
import { BackendService, DbService, StorageService } from '@/services'
import { SyncStatus } from '@/state'

export interface SyncCallbacks {
  onStatusChange: (status: Partial<SyncStatus>) => void
  onTransactionsLoaded: (transactions: TransactionDTO[]) => void
}

class SyncDomain {
  private backendService: BackendService
  private dbService: DbService
  private storageService: StorageService
  private callbacks: SyncCallbacks
  private isFirstPullComplete: boolean = false

  constructor(
    backendService: BackendService,
    dbService: DbService,
    storageService: StorageService,
    callbacks: SyncCallbacks,
  ) {
    this.backendService = backendService
    this.dbService = dbService
    this.storageService = storageService
    this.callbacks = callbacks
  }

  async pullFromLocalDb(): Promise<void> {
    const transactions = await this.dbService.readAllDocs()
    this.callbacks.onTransactionsLoaded(transactions)
  }

  async pullFromRemote(): Promise<void> {
    if (!this.isFirstPullComplete) {
      await this.pullFromLocalDb()
      this.isFirstPullComplete = true
      this.callbacks.onStatusChange({ isFirstPullComplete: true })
    }

    try {
      const remoteSettings = await this.backendService.getSettings()

      const storedUploadedAt = this.storageService.get('transactionsUploadedAt')
      const needsDatabaseReset = storedUploadedAt !== remoteSettings.transactionsUploadedAt

      if (needsDatabaseReset) {
        await this.dbService.reset()
        this.storageService.set('transactionsUploadedAt', remoteSettings.transactionsUploadedAt)
      }

      const hasChangesFromRemote = await this.dbService.pullChanges()
      if (hasChangesFromRemote) {
        await this.pullFromLocalDb()
      }

      this.callbacks.onStatusChange({ isOffline: false })
    } catch (error: unknown) {
      this.callbacks.onStatusChange({ isOffline: true })
    }
  }

  async pushToRemote(): Promise<boolean> {
    try {
      await this.dbService.pushChanges()
      this.callbacks.onStatusChange({ hasPushError: false })
      return true
    } catch (error) {
      this.callbacks.onStatusChange({ hasPushError: true })
      return false
    }
  }

  async addTransaction(transaction: TransactionDTO): Promise<void> {
    await this.dbService.addTransaction(transaction)
    void this.pushToRemote()
  }

  async updateTransaction(transaction: TransactionDTO): Promise<void> {
    await this.dbService.replaceTransaction(transaction)
    void this.pushToRemote()
  }

  async deleteTransaction(transactionId: string): Promise<void> {
    await this.dbService.removeTransaction(transactionId)
    void this.pushToRemote()
  }
}

export default SyncDomain
