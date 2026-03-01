import { SpendingLimitsDTO } from '@/types'

const MIGRATION_VERSION_KEY = 'budgeting_migration_version'
const CURRENT_VERSION = 1

export default class MigrationDomain {
  needsMigration(): boolean {
    const version = parseInt(localStorage.getItem(MIGRATION_VERSION_KEY) || '0', 10)
    return version < CURRENT_VERSION
  }

  async migrateBudgetNames(
    allDocs: any[],
    spendingLimits: SpendingLimitsDTO,
    bulkUpdate: (docs: any[]) => Promise<void>,
  ): Promise<void> {
    if (!this.needsMigration()) return

    const categoryToBudget: Record<string, string> = {}
    for (const limit of spendingLimits.limits) {
      for (const cat of limit.categories) {
        categoryToBudget[cat] = limit.name
      }
    }

    const docsToUpdate = allDocs.filter(
      (doc) => !doc.budget_name && doc.category && categoryToBudget[doc.category],
    )

    if (docsToUpdate.length > 0) {
      const updatedDocs = docsToUpdate.map((doc) => ({
        ...doc,
        budget_name: categoryToBudget[doc.category],
      }))
      await bulkUpdate(updatedDocs)
    }

    localStorage.setItem(MIGRATION_VERSION_KEY, String(CURRENT_VERSION))
  }
}
