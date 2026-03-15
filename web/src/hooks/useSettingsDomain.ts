import { useEffect, useMemo } from 'react'
import { useSetAtom } from 'jotai'
import { categoryExpansionsAtom, accountPropertiesAtom, spendingLimitsAtom } from '@/state'
import { SettingsDomain, BudgetsDomain } from '@/domain'
import { BackendService, DbService, StorageService } from '@/services'

export function useSettingsDomain(backendService: BackendService, dbService: DbService) {
  const setCategoryExpansions = useSetAtom(categoryExpansionsAtom)
  const setAccountProperties = useSetAtom(accountPropertiesAtom)
  const setSpendingLimits = useSetAtom(spendingLimitsAtom)

  const storageService = useMemo(() => new StorageService(), [])

  const settingsDomain = useMemo(() => new SettingsDomain(dbService), [dbService])

  const budgetsDomain = useMemo(
    () => new BudgetsDomain(backendService, storageService),
    [backendService, storageService],
  )

  useEffect(() => {
    async function loadSettings() {
      setCategoryExpansions(await settingsDomain.loadCategoryExpansions())
      setAccountProperties(await settingsDomain.loadAccountProperties())

      try {
        const spendingLimits = await budgetsDomain.loadSpendingLimits()
        setSpendingLimits(spendingLimits)
      } catch {
        // spending limits unavailable; migration will wait
      }
    }

    void loadSettings()
  }, [
    settingsDomain,
    budgetsDomain,
    setCategoryExpansions,
    setAccountProperties,
    setSpendingLimits,
  ])
}
