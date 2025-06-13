import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { formatFinancialAmount, convertCurrencyCodeToSymbol } from '@/utils'
import { TransactionsContainer } from '@/components/Transactions'
import { BudgetDTO } from './BudgetDTO'

interface Props {
  budget: BudgetDTO
  onClose: () => void
  onTransactionRemove: (id: string) => Promise<void>
  onBudgetChange: (amount: number, currency: string) => void
  availableCurrencies: { value: string; label: string }[]
}

export default function BudgetInfoModal({
  budget,
  onClose,
  onTransactionRemove,
  onBudgetChange,
  availableCurrencies,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [newAmount, setNewAmount] = useState(budget.amount)
  const [newCurrency, setNewCurrency] = useState(budget.currency)

  if (!budget) return null

  const { name, currency, amount, categories, transactions, spentAmount, isEditable } = budget

  let displayCategories = categories.join(', ')
  const initialDisplayCategoryLength = 2
  if (categories.length > initialDisplayCategoryLength && !isExpanded) {
    displayCategories =
      categories.slice(0, initialDisplayCategoryLength).join(', ') +
      ' и ещё ' +
      (categories.length - initialDisplayCategoryLength) +
      '...'
  }
  const toggleButton = categories.length > initialDisplayCategoryLength && (
    <button onClick={() => setIsExpanded(!isExpanded)}>
      {/* @ts-ignore */}
      <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} />
    </button>
  )

  const handleAmountChange = () => {
    onBudgetChange(newAmount, newCurrency)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setNewAmount(budget.amount)
    setNewCurrency(budget.currency)
    setIsEditing(false)
  }

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card p-2">
        <header className="modal-card-head">
          <p className="modal-card-title">{name}</p>
          <button className="delete" onClick={onClose} aria-label="close"></button>
        </header>
        <section className="modal-card-body">
          <p>
            Всего:{' '}
            {isEditing ? (
              <span>
                <input
                  type="number"
                  value={newAmount}
                  onChange={(e) => setNewAmount(Number(e.target.value))}
                  style={{ width: '100px', marginRight: '5px' }}
                />
                <select
                  value={newCurrency}
                  onChange={(e) => setNewCurrency(e.target.value)}
                  style={{ marginRight: '5px' }}
                >
                  {availableCurrencies.map((currencyOption) => (
                    <option key={currencyOption.value} value={currencyOption.value}>
                      {currencyOption.label}
                    </option>
                  ))}
                </select>
                <button onClick={handleAmountChange} style={{ marginRight: '5px' }}>
                  ✓
                </button>
                <button onClick={handleCancelEdit}>✕</button>
              </span>
            ) : (
              <strong>
                {formatFinancialAmount(amount)} {convertCurrencyCodeToSymbol(currency)}{' '}
                {isEditable && (
                  <button onClick={() => setIsEditing(true)}>
                    {/* @ts-ignore */}
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </button>
                )}
              </strong>
            )}
          </p>
          <p>
            Потрачено:{' '}
            <strong>
              {formatFinancialAmount(spentAmount)} {convertCurrencyCodeToSymbol(currency)}
            </strong>
          </p>
          <p>
            Осталось:{' '}
            <strong>
              {formatFinancialAmount(amount - spentAmount)} {convertCurrencyCodeToSymbol(currency)}
            </strong>
          </p>
          <p>
            Категории: <strong>{displayCategories}</strong> {toggleButton}
          </p>
          <div style={{ height: 300, display: 'flex' }}>
            <TransactionsContainer transactions={transactions} onRemove={onTransactionRemove} />
          </div>
        </section>
      </div>
    </div>
  )
}
