import { TransactionDTO } from '@/types'
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
