import { atom } from 'jotai'
import { CurrencyConfigsDTO } from '@/types'

const emptyCurrencyConfigs: CurrencyConfigsDTO = {
  monthCurrencyConfigs: [],
}

export const currencyConfigsAtom = atom<CurrencyConfigsDTO>(emptyCurrencyConfigs)
