import { useColoredAccounts } from '@/hooks'
import Home from './Home'

export default function HomeContainer() {
  const coloredAccounts = useColoredAccounts()

  const accounts = coloredAccounts.map((account) => ({
    name: account.account,
    currency: account.currency,
    balance: account.balance,
    color: account.color,
  }))

  return <Home accounts={accounts} />
}
