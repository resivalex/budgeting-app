import { TransactionDTO } from '@/types'
import { BackendService, DbService, StorageService } from '@/services'

export interface SyncCallbacks {
  onOfflineChange: (isOffline: boolean) => void
  onTransactionsLoaded: (transactions: TransactionDTO[]) => void
  onLoadingChange: (isLoading: boolean) => void
}

class SyncDomain {
  private backendService: BackendService
  private dbService: DbService
  private storageService: StorageService
  private callbacks: SyncCallbacks
  private initialized: boolean = false
  private isPushing: boolean = false
  hasPushError: boolean = false

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
    if (!this.initialized) {
      await this.pullFromLocalDb()
      this.initialized = true
    }

    try {
      const remoteSettings = await this.backendService.getSettings()

      const storedUploadedAt = this.storageService.get('transactionsUploadedAt')
      const needsDatabaseReset = storedUploadedAt !== remoteSettings.transactionsUploadedAt

      if (needsDatabaseReset) {
        await this.dbService.reset()
        this.storageService.set('transactionsUploadedAt', remoteSettings.transactionsUploadedAt)
      }

      this.callbacks.onLoadingChange(true)
      try {
        const hasChangesFromRemote = await this.dbService.pullChanges()
        if (hasChangesFromRemote) {
          await this.pullFromLocalDb()
        }
      } finally {
        this.callbacks.onLoadingChange(false)
      }

      this.callbacks.onOfflineChange(false)
    } catch (error: unknown) {
      this.callbacks.onOfflineChange(true)
    }
  }

  async pushToRemote(): Promise<void> {
    if (this.isPushing) return
    this.isPushing = true
    this.callbacks.onLoadingChange(true)
    try {
      await this.dbService.pushChanges()
      this.hasPushError = false
    } catch (error) {
      this.hasPushError = true
    } finally {
      this.callbacks.onLoadingChange(false)
      this.isPushing = false
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
