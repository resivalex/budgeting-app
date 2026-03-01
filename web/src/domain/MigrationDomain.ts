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

    console.log(
      '[Migration] categoryToBudget entries:',
      Object.keys(categoryToBudget).length,
      categoryToBudget,
    )

    if (Object.keys(categoryToBudget).length === 0) {
      console.warn('[Migration] Spending limits empty — skipping, will retry when limits load')
      return
    }

    const docsToUpdate = allDocs.filter(
      (doc) => !doc.budget_name && doc.category && categoryToBudget[doc.category],
    )

    console.log('[Migration] docs to update:', docsToUpdate.length, '/ total docs:', allDocs.length)

    if (docsToUpdate.length > 0) {
      const updatedDocs = docsToUpdate.map((doc) => ({
        ...doc,
        budget_name: categoryToBudget[doc.category],
      }))
      await bulkUpdate(updatedDocs)
      console.log('[Migration] bulkUpdate complete')
    } else {
      console.log(
        '[Migration] No docs needed updating (already migrated or no matching categories)',
      )
    }

    localStorage.setItem(MIGRATION_VERSION_KEY, String(CURRENT_VERSION))
    console.log('[Migration] Done — version key set to', CURRENT_VERSION)
  }
}
