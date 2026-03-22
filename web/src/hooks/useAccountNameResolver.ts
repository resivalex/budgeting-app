import { useMemo, useCallback } from 'react'
import { useAtomValue } from 'jotai'
import { accountPropertiesAtom } from '@/state'

export function useAccountNameResolver(): (id: string) => string {
  const accountProperties = useAtomValue(accountPropertiesAtom)

  const idToName = useMemo(() => {
    const map: Record<string, string> = {}
    if (accountProperties) {
      accountProperties.accounts.forEach((a) => {
        map[a.id] = a.name
      })
    }
    return map
  }, [accountProperties])

  return useCallback((id: string) => idToName[id] || id, [idToName])
}
