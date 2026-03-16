import { atom } from 'jotai'
import { SpendingLimitsDTO } from '@/types'

const emptySpendingLimits: SpendingLimitsDTO = {
  limits: [],
}

export const spendingLimitsAtom = atom<SpendingLimitsDTO>(emptySpendingLimits)
