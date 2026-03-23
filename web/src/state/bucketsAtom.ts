import { atom } from 'jotai'
import { BucketsDTO } from '@/types'

const emptyBuckets: BucketsDTO = {
  buckets: [],
}

export const bucketsAtom = atom<BucketsDTO>(emptyBuckets)

export const bucketIdToNameAtom = atom((get) => {
  const buckets = get(bucketsAtom)
  const map: Record<string, string> = {}
  buckets.buckets.forEach((b) => {
    map[b.id] = b.name
  })
  return map
})
