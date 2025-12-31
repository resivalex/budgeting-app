import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import App from './App'
import { BackendService, DbService } from '@/services'
import { TransactionDTO } from '@/types'
import { useTransactionsDomain, useSyncDomain, useSettingsDomain } from '@/hooks'
import { v4 as uuidv4 } from 'uuid'

const instanceId = uuidv4()

interface Props {
  backendService: BackendService
  dbService: DbService
  isLoading: boolean
}

export default function AuthorizedAppContainer({ backendService, dbService, isLoading }: Props) {
  const [filterAccountName, setFilterAccountName] = useState('')
  const [filterPayee, setFilterPayee] = useState('')
  const [filterComment, setFilterComment] = useState('')

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
    localStorage.removeItem('config')
    window.location.reload()
  }

  async function handleExport() {
    const csvString = await backendService.getExportingCsvString()
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    const fileName = new Date()
      .toISOString()
      .slice(0, 19)
      .replaceAll('-', '')
      .replaceAll(':', '')
      .replace('T', '-')
    link.setAttribute('download', `${fileName}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
