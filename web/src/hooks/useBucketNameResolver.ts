import { useCallback } from 'react'
import { useAtomValue } from 'jotai'
import { bucketIdToNameAtom } from '@/state'

export function useBucketNameResolver(): (id: string) => string {
  const idToName = useAtomValue(bucketIdToNameAtom)
  return useCallback((id: string) => idToName[id] || id, [idToName])
}
