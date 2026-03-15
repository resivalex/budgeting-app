import { CategoryExpansionsDTO, AccountPropertiesDTO } from '@/types'
import { DbService } from '@/services'

class SettingsDomain {
  private dbService: DbService

  constructor(dbService: DbService) {
    this.dbService = dbService
  }

  async loadCategoryExpansions(): Promise<CategoryExpansionsDTO> {
    return this.dbService.getCategoryExpansions()
  }

  async loadAccountProperties(): Promise<AccountPropertiesDTO> {
    return this.dbService.getAccountProperties()
  }
}

export default SettingsDomain
