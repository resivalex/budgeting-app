import { useState, useMemo } from 'react'
import Transactions from './Transactions'
import { useNavigate, useLocation } from 'react-router-dom'
import { TransactionDTO } from '@/types'

export default function TransactionsContainer({
  transactions,
  onRemove,
}: {
  transactions: TransactionDTO[]
  onRemove: (id: string) => Promise<void>
}) {
  const location = useLocation()
  const [focusedTransactionId, setFocusedTransactionId] = useState<string>('')
  const [scrollToTransactionId] = useState<string>(() => location.state?.focusTransactionId || '')

  const navigate = useNavigate()

  const focusedTransaction = useMemo(
    () => transactions.find((transaction) => transaction._id === focusedTransactionId),
    [transactions, focusedTransactionId]
  )

  const handleEdit = (id: string) => {
    navigate(`/transactions/${id}`, { replace: true })
  }

  const handleUnfocus = () => {
    setFocusedTransactionId('')
  }

  return (
    <Transactions
      transactions={transactions}
      focusedTransaction={focusedTransaction}
      scrollToTransactionId={scrollToTransactionId}
      onRemove={onRemove}
      onEdit={handleEdit}
      onFocus={setFocusedTransactionId}
      onUnfocus={handleUnfocus}
    />
  )
}
