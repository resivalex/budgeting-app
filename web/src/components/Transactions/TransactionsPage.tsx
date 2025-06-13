import { AccountDetailsDTO, TransactionDTO } from '@/types'
import { FC, useState } from 'react'
import TransactionsContainer from './TransactionsContainer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'

export default function TransactionsPage({
  AccountSelect,
  filterAccountName,
  filterPayee,
  filterComment,
  transactions,
  onFilterAccountNameChange,
  onFilterPayeeChange,
  onFilterCommentChange,
  onRemove,
}: {
  AccountSelect: FC<{
    value: string
    onChange: (value: string) => void
  }>
  filterAccountName: string
  filterPayee: string
  filterComment: string
  transactions: TransactionDTO[]
  accountDetails: AccountDetailsDTO[]
  onFilterAccountNameChange: (accountName: string) => void
  onFilterPayeeChange: (payee: string) => void
  onFilterCommentChange: (comment: string) => void
  onRemove: (id: string) => Promise<void>
}) {
  const [isFilterExpanded, setIsFilterExpanded] = useState(false)
  const [localFilterPayee, setLocalFilterPayee] = useState(filterPayee)
  const [localFilterComment, setLocalFilterComment] = useState(filterComment)

  const handleSearchIconClick = () => {
    setIsFilterExpanded(!isFilterExpanded)
  }

  const handleApplyFilters = () => {
    onFilterPayeeChange(localFilterPayee)
    onFilterCommentChange(localFilterComment)
    setIsFilterExpanded(false)
  }

  const handleResetFilters = () => {
    setLocalFilterPayee('')
    setLocalFilterComment('')
    onFilterPayeeChange('')
    onFilterCommentChange('')
    setIsFilterExpanded(false)
  }

  const displayFilters = () => {
    let filters = []

    if (filterPayee) {
      filters.push(`Получатель: ${filterPayee}`)
    }

    if (filterComment) {
      filters.push(`Комментарий: ${filterComment}`)
    }

    return filters
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ flex: 1, marginRight: '8px' }}>
          <AccountSelect value={filterAccountName} onChange={onFilterAccountNameChange} />
        </div>
        <button onClick={handleSearchIconClick} style={{ background: 'none', border: 'none' }}>
          {/* @ts-ignore */}
          <FontAwesomeIcon icon={faSearch} size="lg" />
        </button>
      </div>
      {isFilterExpanded ? (
        <div className="box mt-3">
          <div className="field">
            <label className="label is-small">Получатель/Плательщик</label>
            <div className="control">
              <input
                className="input is-small"
                value={localFilterPayee}
                placeholder="Введите имя получателя или плательщика"
                onChange={(e) => setLocalFilterPayee(e.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <label className="label is-small">Комментарий</label>
            <div className="control">
              <input
                className="input is-small"
                value={localFilterComment}
                placeholder="Введите текст комментария"
                onChange={(e) => setLocalFilterComment(e.target.value)}
              />
            </div>
          </div>
          <div className="field is-grouped">
            <div className="control">
              <button className="button is-primary is-small" onClick={handleApplyFilters}>
                <span className="icon is-small">
                  {/* @ts-ignore */}
                  <FontAwesomeIcon icon={faSearch} />
                </span>
                <span>Найти</span>
              </button>
            </div>
            <div className="control">
              <button className="button is-light is-small" onClick={handleResetFilters}>
                <span className="icon is-small">
                  {/* @ts-ignore */}
                  <FontAwesomeIcon icon={faTimes} />
                </span>
                <span>Сбросить</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        displayFilters().length > 0 && (
          <div className="notification is-light is-small mt-2" style={{ padding: '0.75rem' }}>
            <div className="content is-small">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>Активные фильтры:</strong>
                <button 
                  className="delete is-small" 
                  onClick={handleResetFilters}
                  title="Сбросить все фильтры"
                ></button>
              </div>
              <div className="tags mt-1">
                {displayFilters().map((filter, index) => (
                  <span key={index} className="tag is-info is-light">
                    {filter}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )
      )}
      <div
        style={{
          width: '100%',
          height: '100%',
          overflow: 'auto',
        }}
      >
        <TransactionsContainer transactions={transactions} onRemove={onRemove} />
      </div>
    </div>
  )
}
