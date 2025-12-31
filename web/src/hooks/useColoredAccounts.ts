import { useMemo } from 'react'
import { useAtomValue } from 'jotai'
import { accountPropertiesAtom, transactionsAggregationsAtom } from '@/state'
import { ColoredAccountDetailsDTO, AccountPropertiesDTO } from '@/types'
import { mergeAccountDetailsAndProperties } from '@/utils'

const emptyAccountProperties: AccountPropertiesDTO = {
  accounts: [] as unknown as AccountPropertiesDTO['accounts'],
}

export function useColoredAccounts(): ColoredAccountDetailsDTO[] {
  const accountProperties = useAtomValue(accountPropertiesAtom)
  const aggregations = useAtomValue(transactionsAggregationsAtom)

  return useMemo(
    () =>
      mergeAccountDetailsAndProperties(
        aggregations.accountDetails,
        accountProperties || emptyAccountProperties,
      ),
    [aggregations.accountDetails, accountProperties],
  )
}
