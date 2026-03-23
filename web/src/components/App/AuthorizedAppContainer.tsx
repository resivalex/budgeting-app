import { useCallback, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import App from './App'
import RenderErrorBoundary from './RenderErrorBoundary'
import { useServices } from '@/services'
import { TransactionDTO } from '@/types'
import { useTransactionsDomain, useSyncDomain, useSettingsDomain } from '@/hooks'
import { ExportDomain, AuthDomain } from '@/domain'
import { v4 as uuidv4 } from 'uuid'

const instanceId = uuidv4()

export default function AuthorizedAppContainer() {
  const { backendService, dbService, storageService } = useServices()

  const [filterAccountName, setFilterAccountName] = useState('')
  const [filterPayee, setFilterPayee] = useState('')
  const [filterComment, setFilterComment] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterBucketId, setFilterBucketId] = useState('')

  const exportDomain = useMemo(() => new ExportDomain(backendService), [backendService])
  const authDomain = useMemo(() => new AuthDomain(storageService), [storageService])

  const navigate = useNavigate()

  const { refreshSettings } = useSettingsDomain(dbService)

  const {
    transactions,
    transactionsAggregations,
    addTransaction: addLocalTransaction,
    updateTransaction: updateLocalTransaction,
    deleteTransaction: deleteLocalTransaction,
  } = useTransactionsDomain()

  const {
    isLoading,
    offlineMode,
    addDbTransaction,
    replaceDbTransaction,
    removeDbTransaction,
    forceRefresh,
  } = useSyncDomain(backendService, dbService, instanceId)

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

  const refreshAllData = useCallback(async () => {
    await forceRefresh()
    await refreshSettings()
  }, [forceRefresh, refreshSettings])

  return (
    <RenderErrorBoundary onForceRefresh={refreshAllData}>
      <App
        transactions={transactions}
        transactionAggregations={transactionsAggregations}
        filterAccountName={filterAccountName}
        filterPayee={filterPayee}
        filterComment={filterComment}
        filterCategory={filterCategory}
        filterBucketId={filterBucketId}
        onFilterAccountNameChange={setFilterAccountName}
        onFilterPayeeChange={setFilterPayee}
        onFilterCommentChange={setFilterComment}
        onFilterCategoryChange={setFilterCategory}
        onFilterBucketIdChange={setFilterBucketId}
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
    </RenderErrorBoundary>
  )
}
