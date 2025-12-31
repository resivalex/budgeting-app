import { atom } from 'jotai'
import { CategoryExpansionsDTO, AccountPropertiesDTO } from '@/types'

export interface ConfigState {
  categoryExpansions: CategoryExpansionsDTO | null
  accountProperties: AccountPropertiesDTO | null
}

const initialConfigState: ConfigState = {
  categoryExpansions: null,
  accountProperties: null,
}

export const configAtom = atom<ConfigState>(initialConfigState)

export const categoryExpansionsAtom = atom(
  (get) => get(configAtom).categoryExpansions,
  (get, set, categoryExpansions: CategoryExpansionsDTO) => {
    set(configAtom, { ...get(configAtom), categoryExpansions })
  },
)

export const accountPropertiesAtom = atom(
  (get) => get(configAtom).accountProperties,
  (get, set, accountProperties: AccountPropertiesDTO) => {
    set(configAtom, { ...get(configAtom), accountProperties })
  },
)
