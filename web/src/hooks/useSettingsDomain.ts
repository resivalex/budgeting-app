import { useCallback, useEffect, useMemo } from 'react'
import { useSetAtom } from 'jotai'
import {
  categoryExpansionsAtom,
  accountPropertiesAtom,
  spendingLimitsAtom,
  currencyConfigsAtom,
} from '@/state'
import { SettingsDomain, BudgetsDomain } from '@/domain'
import { DbService } from '@/services'

export function useSettingsDomain(dbService: DbService) {
  const setCategoryExpansions = useSetAtom(categoryExpansionsAtom)
  const setAccountProperties = useSetAtom(accountPropertiesAtom)
  const setSpendingLimits = useSetAtom(spendingLimitsAtom)
  const setCurrencyConfigs = useSetAtom(currencyConfigsAtom)

  const settingsDomain = useMemo(() => new SettingsDomain(dbService), [dbService])

  const budgetsDomain = useMemo(() => new BudgetsDomain(dbService), [dbService])

  const refreshSettings = useCallback(async () => {
    await dbService.pullSettingsChanges()
    setCategoryExpansions(await settingsDomain.loadCategoryExpansions())
    setAccountProperties(await settingsDomain.loadAccountProperties())
    setSpendingLimits(await budgetsDomain.loadSpendingLimits())
    setCurrencyConfigs(await budgetsDomain.loadCurrencyConfigs())
  }, [
    dbService,
    settingsDomain,
    budgetsDomain,
    setCategoryExpansions,
    setAccountProperties,
    setSpendingLimits,
    setCurrencyConfigs,
  ])

  useEffect(() => {
    void refreshSettings()
  }, [refreshSettings])

  return { refreshSettings }
}
