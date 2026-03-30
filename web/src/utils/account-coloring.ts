import { AccountDetailsDTO, AccountPropertiesDTO, ColoredAccountDetailsDTO } from '@/types'

const defaultColor = '#ffffff'

export function mergeAccountDetailsAndProperties(
  accountDetails: AccountDetailsDTO[],
  accountProperties: AccountPropertiesDTO,
): ColoredAccountDetailsDTO[] {
  const coloredAccounts: ColoredAccountDetailsDTO[] = []
  const uncoloredAccounts: ColoredAccountDetailsDTO[] = []
  const nonExternalAccounts = accountProperties.accounts.filter((a) => a.owner !== 'external')
  nonExternalAccounts.forEach((account) => {
    const accountDetail = accountDetails.find((a) => a.account === account.id)
    coloredAccounts.push({
      account: account.id,
      name: account.name,
      currency: account.currency,
      balance: accountDetail?.balance ?? 0,
      color: account.color,
    })
  })
  accountDetails.forEach((detail) => {
    const properties = accountProperties.accounts.find((a) => a.id === detail.account)

    if (properties) {
      return
    }

    uncoloredAccounts.push({
      account: detail.account,
      name: detail.account,
      currency: detail.currency,
      balance: detail.balance,
      color: defaultColor,
    })
  })

  return [...coloredAccounts, ...uncoloredAccounts]
}
