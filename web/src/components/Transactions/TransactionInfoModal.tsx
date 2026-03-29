import { useState } from 'react'
import {
  convertToLocaleTime,
  convertCurrencyCodeToSymbol,
  formatFinancialAmount,
  deriveTransactionType,
  deriveAccount,
  deriveBucketId,
} from '@/utils'
import { TransactionDTO } from '@/types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useAccountNameResolver, useBucketNameResolver } from '@/hooks'
import { useAtomValue } from 'jotai'
import { externalAccountIdsAtom } from '@/state'

interface Props {
  transaction: TransactionDTO
  onEdit: (id: string) => void
  onRemove: (id: string) => Promise<void>
  onClose: () => void
}

export default function TransactionInfoModal({ transaction, onClose, onRemove, onEdit }: Props) {
  const [isRemoveActive, setIsRemoveActive] = useState(false)
  const resolveAccountName = useAccountNameResolver()
  const resolveBucketName = useBucketNameResolver()
  const externalAccountIds = useAtomValue(externalAccountIdsAtom)
  if (!transaction) return null

  const { datetime, category, amount, currency, comment } = transaction
  const type = deriveTransactionType(transaction, externalAccountIds)
  const accountId = deriveAccount(transaction, externalAccountIds)
  const bucketId = deriveBucketId(transaction, externalAccountIds)

  const datetimeString = convertToLocaleTime(datetime)
  const accountName = resolveAccountName(accountId)
  const payeeDisplay =
    type === 'transfer' ? resolveAccountName(transaction.account_to) : transaction.counterparty

  async function handleRemoveClick(transactionId: string) {
    if (isRemoveActive) {
      await onRemove(transactionId)
    } else {
      setIsRemoveActive(true)
    }
  }

  function translateType(type: string) {
    if (type === 'expense') return 'Расход'
    if (type === 'income') return 'Доход'
    if (type === 'transfer') return 'Перевод'
    if (type === 'custom') return 'Кастомный'
    return type
  }

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card p-2">
        <header className="modal-card-head">
          <p className="modal-card-title">Запись</p>
          <button className="delete" onClick={onClose} aria-label="close"></button>
        </header>
        <section className="modal-card-body">
          <p>
            <strong>Дата и время:</strong> {datetimeString}
          </p>
          {type === 'custom' ? (
            <>
              <p>
                <strong>Счёт откуда:</strong> {resolveAccountName(transaction.account_from)}
              </p>
              <p>
                <strong>Счёт куда:</strong> {resolveAccountName(transaction.account_to)}
              </p>
              {transaction.bucket_from && transaction.bucket_from !== 'default' && (
                <p>
                  <strong>Бюджет откуда:</strong> {resolveBucketName(transaction.bucket_from)}
                </p>
              )}
              {transaction.bucket_to && transaction.bucket_to !== 'default' && (
                <p>
                  <strong>Бюджет куда:</strong> {resolveBucketName(transaction.bucket_to)}
                </p>
              )}
            </>
          ) : (
            <>
              <p>
                <strong>Счёт:</strong> {accountName}
              </p>
              {bucketId && bucketId !== 'default' && (
                <p>
                  <strong>Бюджет:</strong> {resolveBucketName(bucketId)}
                </p>
              )}
            </>
          )}
          <p>
            <strong>Категория:</strong> {category}
          </p>
          <p>
            <strong>Тип:</strong> {translateType(type)}
          </p>
          <p>
            <strong>Сумма:</strong> {formatFinancialAmount(parseFloat(amount))}{' '}
            {convertCurrencyCodeToSymbol(currency)}
          </p>
          <p>
            <strong>Получатель:</strong> {payeeDisplay}
          </p>
          <p>
            <strong>Комментарий:</strong> {comment}
          </p>
        </section>
        <footer className="modal-card-foot">
          <button className="button is-info" onClick={() => onEdit(transaction._id)}>
            {/* @ts-ignore */}
            <FontAwesomeIcon icon={faEdit} style={{ color: 'white' }} />
          </button>

          <button
            className="button is-danger"
            style={{ marginLeft: 'auto' }}
            onClick={() => handleRemoveClick(transaction._id)}
          >
            {isRemoveActive ? (
              <span>Подтвердите удаление</span>
            ) : (
              // @ts-ignore
              <FontAwesomeIcon icon={faTrash} style={{ color: 'white' }} />
            )}
          </button>
        </footer>
      </div>
    </div>
  )
}
