import { ConfigDataDTO, CategoryExpansionsDTO, AccountPropertiesDTO } from '@/types'

type StorageKeys = {
  config: ConfigDataDTO
  transactionsUploadedAt: string
  categoryExpansions: CategoryExpansionsDTO
  accountProperties: AccountPropertiesDTO
}

type StorageKey = keyof StorageKeys

class StorageService {
  get<K extends StorageKey>(key: K): StorageKeys[K] | null {
    const value = localStorage.getItem(key)
    if (value === null) {
      return null
    }
    try {
      return JSON.parse(value) as StorageKeys[K]
    } catch {
      return value as StorageKeys[K]
    }
  }

  set<K extends StorageKey>(key: K, value: StorageKeys[K]): void {
    if (typeof value === 'string') {
      localStorage.setItem(key, value)
    } else {
      localStorage.setItem(key, JSON.stringify(value))
    }
  }

  remove(key: StorageKey): void {
    localStorage.removeItem(key)
  }

  has(key: StorageKey): boolean {
    return localStorage.getItem(key) !== null
  }
}

export default StorageService
