import {
  TransactionDTO,
  CategoryExpansionsDTO,
  AccountPropertiesDTO,
  SpendingLimitsDTO,
  CurrencyConfigsDTO,
  BucketsDTO,
} from '@/types'
import PouchDB from 'pouchdb'

function initializeLocalPouchDB() {
  return new PouchDB('budgeting')
}

function initializeRemotePouchDB(dbUrl: string) {
  return new PouchDB(dbUrl + '/budgeting')
}

interface DbServiceProps {
  dbUrl: string
}

export default class DbService {
  private localDB: any
  private readonly remoteDB: any

  constructor(props: DbServiceProps) {
    this.localDB = initializeLocalPouchDB()
    this.remoteDB = initializeRemotePouchDB(props.dbUrl)
  }

  async reset() {
    await this.localDB.destroy()
    this.localDB = initializeLocalPouchDB()
  }

  async addTransaction(t: TransactionDTO) {
    await this.localDB.put({ ...t, kind: 'transaction' })
  }

  async replaceTransaction(transaction: TransactionDTO) {
    const doc = await this.localDB.get(transaction._id)
    const updatedDoc = { ...doc, ...transaction, kind: 'transaction' }

    await this.localDB.put(updatedDoc)
  }

  async removeTransaction(id: string) {
    const doc = await this.localDB.get(id)
    await this.localDB.remove(doc)
  }

  async readAllTransactions(): Promise<TransactionDTO[]> {
    const result = await this.localDB.allDocs({
      include_docs: true,
      startkey: 'tx:',
      endkey: 'tx:\uffff',
    })
    return result.rows.map((row: any) => row.doc as TransactionDTO)
  }

  async getCategoryExpansions(): Promise<CategoryExpansionsDTO> {
    try {
      const doc = await this.localDB.get('cfg:category_expansions')
      return doc.value as CategoryExpansionsDTO
    } catch {
      return { expansions: [] }
    }
  }

  async getAccountProperties(): Promise<AccountPropertiesDTO> {
    try {
      const doc = await this.localDB.get('cfg:account_properties')
      return doc.value as AccountPropertiesDTO
    } catch {
      return { accounts: [] }
    }
  }

  async getBuckets(): Promise<BucketsDTO> {
    try {
      const doc = await this.localDB.get('cfg:buckets')
      return doc.value as BucketsDTO
    } catch {
      return { buckets: [] }
    }
  }

  async getSpendingLimits(): Promise<SpendingLimitsDTO> {
    try {
      const doc = await this.localDB.get('cfg:spending_limits')
      const data = doc.value
      return {
        commonBucketIds: data.common_bucket_ids || [],
        limits: (data.limits || []).map((limit: any) => ({
          bucketId: limit.bucket_id,
          categories: limit.categories || [],
          monthLimits: (limit.month_limits || []).map((ml: any) => ({
            date: ml.date,
            currency: ml.currency,
            amount: ml.amount,
          })),
        })),
      }
    } catch {
      return { commonBucketIds: [], limits: [] }
    }
  }

  async getCurrencyConfigs(): Promise<CurrencyConfigsDTO> {
    try {
      const doc = await this.localDB.get('cfg:currency_configs')
      const data = doc.value
      return {
        monthCurrencyConfigs: (data.month_currency_configs || []).map((mcc: any) => ({
          date: mcc.date,
          config: {
            mainCurrency: mcc.config.main_currency,
            conversionRates: mcc.config.conversion_rates,
          },
        })),
      }
    } catch {
      return { monthCurrencyConfigs: [] }
    }
  }

  async saveSpendingLimits(spendingLimits: SpendingLimitsDTO): Promise<void> {
    const snakeCaseValue = {
      common_bucket_ids: spendingLimits.commonBucketIds,
      limits: spendingLimits.limits.map((limit) => ({
        bucket_id: limit.bucketId,
        categories: limit.categories,
        month_limits: limit.monthLimits.map((ml) => ({
          date: ml.date,
          currency: ml.currency,
          amount: ml.amount,
        })),
      })),
    }

    try {
      const existing = await this.localDB.get('cfg:spending_limits')
      await this.localDB.put({ ...existing, value: snakeCaseValue })
    } catch {
      await this.localDB.put({
        _id: 'cfg:spending_limits',
        value: snakeCaseValue,
        kind: 'setting',
      })
    }
    await this.localDB.replicate.to(this.remoteDB, {
      live: false,
      retry: false,
      timeout: 5000,
    })
  }

  async pushChanges(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.localDB.replicate
        .to(this.remoteDB, {
          live: false,
          retry: false,
          timeout: 5000,
        })
        .on('complete', () => {
          resolve(true)
        })
        .on('error', (err: any) => {
          reject(err)
        })
    })
  }

  async pullChanges(): Promise<boolean> {
    let hasChanges = false

    return new Promise<boolean>((resolve, reject) => {
      this.localDB.replicate
        .from(this.remoteDB, {
          live: false,
          retry: false,
          timeout: 5000,
        })
        .on('change', (info: any) => {
          if (info.docs_read > 0) {
            hasChanges = true
          }
        })
        .on('complete', () => {
          resolve(hasChanges)
        })
        .on('error', (err: any) => {
          reject(err)
        })
    })
  }
}
