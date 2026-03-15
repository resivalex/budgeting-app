import {
  TransactionDTO,
  CategoryExpansionsDTO,
  AccountPropertiesDTO,
  SpendingLimitsDTO,
} from '@/types'
import PouchDB from 'pouchdb'

function initializeLocalPouchDB() {
  return new PouchDB('budgeting')
}

function initializeRemotePouchDB(dbUrl: string) {
  return new PouchDB(dbUrl + '/budgeting')
}

function initializeRemoteSettingsDB(dbUrl: string) {
  return new PouchDB(dbUrl + '/budgeting-settings')
}

interface DbServiceProps {
  dbUrl: string
}

export default class DbService {
  private localDB: any
  private readonly remoteDB: any
  private readonly remoteSettingsDB: any

  constructor(props: DbServiceProps) {
    this.localDB = initializeLocalPouchDB()
    this.remoteDB = initializeRemotePouchDB(props.dbUrl)
    this.remoteSettingsDB = initializeRemoteSettingsDB(props.dbUrl)
  }

  async reset() {
    await this.localDB.destroy()
    this.localDB = initializeLocalPouchDB()
  }

  async addTransaction(t: TransactionDTO) {
    await this.localDB.put(t)
  }

  async replaceTransaction(transaction: TransactionDTO) {
    const doc = await this.localDB.get(transaction._id)
    const updatedDoc = { ...doc, ...transaction }

    await this.localDB.put(updatedDoc)
  }

  async removeTransaction(id: string) {
    const doc = await this.localDB.get(id)
    await this.localDB.remove(doc)
  }

  async readAllDocs(): Promise<TransactionDTO[]> {
    console.log('readAllDocs')
    const result = await this.localDB.allDocs({ include_docs: true })
    return result.rows.map((row: any) => row.doc as TransactionDTO)
  }

  async getCategoryExpansions(): Promise<CategoryExpansionsDTO> {
    try {
      const doc = await this.remoteSettingsDB.get('category_expansions')
      return doc.value as CategoryExpansionsDTO
    } catch {
      return { expansions: [] }
    }
  }

  async getAccountProperties(): Promise<AccountPropertiesDTO> {
    try {
      const doc = await this.remoteSettingsDB.get('account_properties')
      return doc.value as AccountPropertiesDTO
    } catch {
      return { accounts: [] }
    }
  }

  async getSpendingLimits(): Promise<SpendingLimitsDTO> {
    try {
      const doc = await this.remoteSettingsDB.get('spending_limits')
      const data = doc.value
      return {
        limits: (data.limits || []).map((limit: any) => ({
          name: limit.name,
          color: limit.color,
          categories: limit.categories,
          monthLimits: (limit.month_limits || []).map((ml: any) => ({
            date: ml.date,
            currency: ml.currency,
            amount: ml.amount,
          })),
        })),
        monthCurrencyConfigs: (data.month_currency_configs || []).map((mcc: any) => ({
          date: mcc.date,
          config: {
            mainCurrency: mcc.config.main_currency,
            conversionRates: mcc.config.conversion_rates,
          },
        })),
      }
    } catch {
      return { limits: [], monthCurrencyConfigs: [] }
    }
  }

  async saveSpendingLimits(spendingLimits: SpendingLimitsDTO): Promise<void> {
    const snakeCaseValue = {
      limits: spendingLimits.limits.map((limit) => ({
        name: limit.name,
        color: limit.color,
        categories: limit.categories,
        month_limits: limit.monthLimits.map((ml) => ({
          date: ml.date,
          currency: ml.currency,
          amount: ml.amount,
        })),
      })),
      month_currency_configs: spendingLimits.monthCurrencyConfigs.map((mcc) => ({
        date: mcc.date,
        config: {
          main_currency: mcc.config.mainCurrency,
          conversion_rates: mcc.config.conversionRates,
        },
      })),
    }

    try {
      const existing = await this.remoteSettingsDB.get('spending_limits')
      await this.remoteSettingsDB.put({ ...existing, value: snakeCaseValue })
    } catch {
      await this.remoteSettingsDB.put({ _id: 'spending_limits', value: snakeCaseValue })
    }
  }

  async pushChanges(): Promise<boolean> {
    console.log('pushChanges')
    return new Promise<boolean>((resolve, reject) => {
      this.localDB.replicate
        .to(this.remoteDB, {
          live: false,
          retry: false,
          timeout: 5000,
        })
        .on('complete', () => {
          console.log('pushChanges complete')
          resolve(true)
        })
        .on('error', (err: any) => {
          console.log('pushChanges error')
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
          console.error('pullChanges error')
          reject(err)
        })
    })
  }
}
