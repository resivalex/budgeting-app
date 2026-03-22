import { useCallback } from 'react'
import { useAtomValue } from 'jotai'
import { accountIdToNameAtom } from '@/state'

export function useAccountNameResolver(): (id: string) => string {
  const idToName = useAtomValue(accountIdToNameAtom)
  return useCallback((id: string) => idToName[id] || id, [idToName])
}
