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

type SyncProps = {
  isLoading: boolean
  offlineMode: boolean
  addDbTransaction: (t: TransactionDTO) => Promise<void>
  replaceDbTransaction: (t: TransactionDTO) => Promise<void>
  removeDbTransaction: (id: string) => Promise<void>
  onExport: () => Promise<void>
  onLogout: () => void
  onNotify: (text: string) => void
}

function AppWithTransactions({
  filterAccountName,
  filterPayee,
  filterComment,
  filterCategory,
  filterBucketId,
  onFilterAccountNameChange,
  onFilterPayeeChange,
  onFilterCommentChange,
  onFilterCategoryChange,
  onFilterBucketIdChange,
  lastNotificationText,
  onDismissNotification,
  isLoading,
  offlineMode,
  addDbTransaction,
  replaceDbTransaction,
  removeDbTransaction,
  onExport,
  onLogout,
  onNotify,
}: {
  filterAccountName: string
  filterPayee: string
  filterComment: string
  filterCategory: string
  filterBucketId: string
  onFilterAccountNameChange: (v: string) => void
  onFilterPayeeChange: (v: string) => void
  onFilterCommentChange: (v: string) => void
  onFilterCategoryChange: (v: string) => void
  onFilterBucketIdChange: (v: string) => void
  lastNotificationText: string
  onDismissNotification: () => void
} & SyncProps) {
  const navigate = useNavigate()

  const {
    transactions,
    transactionsAggregations,
    addTransaction: addLocalTransaction,
    updateTransaction: updateLocalTransaction,
    deleteTransaction: deleteLocalTransaction,
  } = useTransactionsDomain()

  async function addTransaction(t: TransactionDTO) {
    await addDbTransaction(t)
    await addLocalTransaction(t)
    onNotify('Запись добавлена')
    onFilterAccountNameChange(t.account)
    navigate('/transactions', { replace: true })
  }

  async function editTransaction(t: TransactionDTO) {
    await replaceDbTransaction(t)
    await updateLocalTransaction(t)
    onNotify('Запись изменена')
    navigate('/transactions', { replace: true })
  }

  async function removeTransaction(id: string) {
    await removeDbTransaction(id)
    await deleteLocalTransaction(id)
    onNotify('Запись удалена')
  }

  return (
    <App
      transactions={transactions}
      transactionAggregations={transactionsAggregations}
      filterAccountName={filterAccountName}
      filterPayee={filterPayee}
      filterComment={filterComment}
      filterCategory={filterCategory}
      filterBucketId={filterBucketId}
      onFilterAccountNameChange={onFilterAccountNameChange}
      onFilterPayeeChange={onFilterPayeeChange}
      onFilterCommentChange={onFilterCommentChange}
      onFilterCategoryChange={onFilterCategoryChange}
      onFilterBucketIdChange={onFilterBucketIdChange}
      isLoading={isLoading}
      offlineMode={offlineMode}
      lastNotificationText={lastNotificationText}
      onExport={onExport}
      onLogout={onLogout}
      onAddTransaction={addTransaction}
      onEditTransaction={editTransaction}
      onRemoveTransaction={removeTransaction}
      onDismissNotification={onDismissNotification}
    />
  )
}

export default function AuthorizedAppContainer() {
  const { backendService, dbService, storageService } = useServices()

  const [filterAccountName, setFilterAccountName] = useState('')
  const [filterPayee, setFilterPayee] = useState('')
  const [filterComment, setFilterComment] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterBucketId, setFilterBucketId] = useState('')

  const exportDomain = useMemo(() => new ExportDomain(backendService), [backendService])
  const authDomain = useMemo(() => new AuthDomain(storageService), [storageService])

  const { refreshSettings } = useSettingsDomain(dbService)

  const {
    isLoading,
    offlineMode,
    addDbTransaction,
    replaceDbTransaction,
    removeDbTransaction,
    forceRefresh,
  } = useSyncDomain(backendService, dbService, instanceId)

  const [lastNotificationText, setLastNotificationText] = useState('')

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
      <AppWithTransactions
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
        onDismissNotification={() => setLastNotificationText('')}
        onExport={handleExport}
        onLogout={handleLogout}
        addDbTransaction={addDbTransaction}
        replaceDbTransaction={replaceDbTransaction}
        removeDbTransaction={removeDbTransaction}
        onNotify={setLastNotificationText}
      />
    </RenderErrorBoundary>
  )
}
