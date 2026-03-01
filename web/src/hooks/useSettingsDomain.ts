import { useEffect, useMemo } from 'react'
import { useSetAtom } from 'jotai'
import { categoryExpansionsAtom, accountPropertiesAtom, spendingLimitsAtom } from '@/state'
import { SettingsDomain, BudgetsDomain } from '@/domain'
import { BackendService, StorageService } from '@/services'

export function useSettingsDomain(backendService: BackendService) {
  const setCategoryExpansions = useSetAtom(categoryExpansionsAtom)
  const setAccountProperties = useSetAtom(accountPropertiesAtom)
  const setSpendingLimits = useSetAtom(spendingLimitsAtom)

  const storageService = useMemo(() => new StorageService(), [])

  const settingsDomain = useMemo(
    () => new SettingsDomain(backendService, storageService),
    [backendService, storageService],
  )

  const budgetsDomain = useMemo(
    () => new BudgetsDomain(backendService, storageService),
    [backendService, storageService],
  )

  useEffect(() => {
    async function loadSettings() {
      try {
        const categoryExpansions = await settingsDomain.loadCategoryExpansions()
        setCategoryExpansions(categoryExpansions)
      } catch (error) {
        const cached = settingsDomain.getCachedCategoryExpansions()
        if (cached) {
          setCategoryExpansions(cached)
        }
      }

      try {
        const accountProperties = await settingsDomain.loadAccountProperties()
        setAccountProperties(accountProperties)
      } catch (error) {
        const cached = settingsDomain.getCachedAccountProperties()
        if (cached) {
          setAccountProperties(cached)
        }
      }

      try {
        const spendingLimits = await budgetsDomain.loadSpendingLimits()
        setSpendingLimits(spendingLimits)
      } catch (error) {
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
