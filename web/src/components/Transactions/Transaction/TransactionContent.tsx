import { useState } from 'react'
import classNames from 'classnames'
import { convertCurrencyCodeToSymbol, formatFinancialAmount } from '@/utils'
import dayjs from 'dayjs'
import ruLocale from 'dayjs/locale/ru'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons'

dayjs.locale(ruLocale)

interface Props {
  category: string
  payee: string
  comment: string
  type: string
  amount: string
  currency: string
  localTime: string
  budgetName: string
  accountFrom: string
  accountTo: string
  bucketFrom?: string
  bucketTo?: string
}

export default function TransactionContent({
  category,
  payee,
  comment,
  type,
  amount,
  currency,
  localTime,
  budgetName,
  accountFrom,
  accountTo,
  bucketFrom,
  bucketTo,
}: Props) {
  const [showTime, setShowTime] = useState(false)

  const toggleShowTime = () => {
    setShowTime(!showTime)
  }

  const internalAccount = type === 'income' ? accountTo : accountFrom

  return (
    <div className="is-flex is-justify-content-space-between is-flex-grow-1">
      <div>
        {type === 'income' || type === 'expense' ? (
          <>
            <div className="has-text-weight-semibold">{budgetName || category}</div>
            <div>{internalAccount}</div>
            {budgetName && category && <div className="is-size-7 has-text-grey">{category}</div>}
            {payee && <div className="is-size-7 has-text-weight-semibold">{payee}</div>}
          </>
        ) : type === 'transfer' ? (
          <>
            <div className="has-text-weight-semibold">
              {/* @ts-ignore */}
              {accountFrom} <FontAwesomeIcon icon={faArrowRightLong} /> {accountTo}
            </div>
            {category && <div className="is-size-7 has-text-grey">{category}</div>}
          </>
        ) : (
          <>
            <div className="has-text-weight-semibold">
              {/* @ts-ignore */}
              {bucketFrom || '—'} <FontAwesomeIcon icon={faArrowRightLong} /> {bucketTo || '—'}
            </div>
            <div>
              {accountFrom}
              {/* @ts-ignore */} <FontAwesomeIcon icon={faArrowRightLong} /> {accountTo}
            </div>
            {category && <div className="is-size-7 has-text-grey">{category}</div>}
            {payee && <div className="is-size-7 has-text-weight-semibold">{payee}</div>}
          </>
        )}
        <div className="is-size-7">{comment}</div>
      </div>
      <div className="has-text-right">
        <div
          className={classNames('is-size-5', {
            'has-text-success': type === 'income',
            'has-text-danger': type === 'expense',
          })}
          style={{ whiteSpace: 'nowrap', ...(type === 'custom' ? { color: 'purple' } : {}) }}
          onClick={toggleShowTime}
        >
          {type === 'expense' && '-'}
          {type === 'income' && '+'}
          {formatFinancialAmount(parseFloat(amount))} {convertCurrencyCodeToSymbol(currency)}
        </div>
        {showTime && (
          <div className="is-size-7">
            <div className="has-text-grey">{localTime}</div>
          </div>
        )}
      </div>
    </div>
  )
}
