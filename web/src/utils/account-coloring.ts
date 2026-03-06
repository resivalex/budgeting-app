import { AccountDetailsDTO, AccountPropertiesDTO, ColoredAccountDetailsDTO } from '@/types'

const defaultColor = '#ffffff'

export function mergeAccountDetailsAndProperties(
  accountDetails: AccountDetailsDTO[],
  accountProperties: AccountPropertiesDTO,
): ColoredAccountDetailsDTO[] {
  const coloredAccounts: ColoredAccountDetailsDTO[] = []
  const uncoloredAccounts: ColoredAccountDetailsDTO[] = []
  accountProperties.accounts.forEach((account) => {
    const accountDetail = accountDetails.find((a) => a.account === account.name)
    if (!accountDetail) {
      return
    }
    coloredAccounts.push({
      account: account.name,
      currency: accountDetail.currency,
      balance: accountDetail.balance,
      color: account.color,
    })
  })
  accountDetails.forEach((detail) => {
    const properties = accountProperties.accounts.find((a) => a.name === detail.account)

    if (properties) {
      return
    }

    uncoloredAccounts.push({
      account: detail.account,
      currency: detail.currency,
      balance: detail.balance,
      color: defaultColor,
    })
  })

  return [...coloredAccounts, ...uncoloredAccounts]
}
