import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import App from './App'
import { useServices } from '@/services'
import { TransactionDTO } from '@/types'
import { useTransactionsDomain, useSyncDomain, useSettingsDomain } from '@/hooks'
import { ExportDomain, AuthDomain } from '@/domain'
import { v4 as uuidv4 } from 'uuid'

const instanceId = uuidv4()

interface Props {
  isLoading: boolean
}

export default function AuthorizedAppContainer({ isLoading }: Props) {
  const { backendService, dbService, storageService } = useServices()

  const [filterAccountName, setFilterAccountName] = useState('')
  const [filterPayee, setFilterPayee] = useState('')
  const [filterComment, setFilterComment] = useState('')

  const exportDomain = useMemo(() => new ExportDomain(backendService), [backendService])
  const authDomain = useMemo(() => new AuthDomain(storageService), [storageService])

  const navigate = useNavigate()

  useSettingsDomain(backendService)

  const {
    transactions,
    transactionsAggregations,
    addTransaction: addLocalTransaction,
    updateTransaction: updateLocalTransaction,
    deleteTransaction: deleteLocalTransaction,
  } = useTransactionsDomain(dbService)

  const { offlineMode, addDbTransaction, replaceDbTransaction, removeDbTransaction } =
    useSyncDomain(backendService, dbService, instanceId)

  const [lastNotificationText, setLastNotificationText] = useState('')

  async function addTransaction(t: TransactionDTO) {
    await addDbTransaction(t)
    await addLocalTransaction(t)
    setLastNotificationText('Запись добавлена')
    setFilterAccountName(t.account)
    navigate('/transactions', { replace: true })
  }

  async function editTransaction(t: TransactionDTO) {
    await replaceDbTransaction(t)
    await updateLocalTransaction(t)
    setLastNotificationText('Запись изменена')
    navigate('/transactions', { replace: true })
  }

  async function removeTransaction(id: string) {
    await removeDbTransaction(id)
    await deleteLocalTransaction(id)
    setLastNotificationText('Запись удалена')
  }

  function handleLogout() {
    authDomain.logout()
  }

  async function handleExport() {
    await exportDomain.exportToCsv()
  }

  return (
    <App
      transactions={transactions}
      transactionAggregations={transactionsAggregations}
      filterAccountName={filterAccountName}
      filterPayee={filterPayee}
      filterComment={filterComment}
      onFilterAccountNameChange={setFilterAccountName}
      onFilterPayeeChange={setFilterPayee}
      onFilterCommentChange={setFilterComment}
      isLoading={isLoading}
      offlineMode={offlineMode}
      lastNotificationText={lastNotificationText}
      onExport={handleExport}
      onLogout={handleLogout}
      onAddTransaction={addTransaction}
      onEditTransaction={editTransaction}
      onRemoveTransaction={removeTransaction}
      onDismissNotification={() => setLastNotificationText('')}
    />
  )
}
