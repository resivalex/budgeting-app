import { CategoryExpansionsDTO, AccountPropertiesDTO } from '@/types'
import { BackendService, StorageService } from '@/services'

class SettingsDomain {
  private backendService: BackendService
  private storageService: StorageService

  constructor(backendService: BackendService, storageService: StorageService) {
    this.backendService = backendService
    this.storageService = storageService
  }

  async loadCategoryExpansions(): Promise<CategoryExpansionsDTO> {
    const categoryExpansions = await this.backendService.getCategoryExpansions()
    this.storageService.set('categoryExpansions', categoryExpansions)
    return categoryExpansions
  }

  async loadAccountProperties(): Promise<AccountPropertiesDTO> {
    const accountProperties = await this.backendService.getAccountProperties()
    this.storageService.set('accountProperties', accountProperties)
    return accountProperties
  }

  getCachedCategoryExpansions(): CategoryExpansionsDTO | null {
    return this.storageService.get('categoryExpansions')
  }

  getCachedAccountProperties(): AccountPropertiesDTO | null {
    return this.storageService.get('accountProperties')
  }
}

export default SettingsDomain
