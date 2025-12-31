import {
  useState,
  useMemo,
  FC,
  Ref,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from 'react'
import { v4 as uuidv4 } from 'uuid'
import _ from 'lodash'
import { TransactionDTO, TransactionsAggregations } from '@/types'
import { convertToLocaleTime, convertToUtcTime } from '@/utils'
import StepByStepTransactionForm from './StepByStepTransactionForm'
import { useNavigate, useParams } from 'react-router-dom'
import { useTransactionFormDomain } from '@/hooks'

export default function TransactionFormContainer({
  LimitedAccountSelect,
  onApply,
}: {
  LimitedAccountSelect: FC<{
    value: string
    onChange: (value: string) => void
    availableNames: string[]
    ref?: Ref<{ focus: () => void }>
  }>
  onApply: (t: TransactionDTO) => Promise<void>
}) {
  const [type, setType] = useState<'income' | 'expense' | 'transfer' | ''>('expense')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('')
  const [category, setCategory] = useState('')
  const [account, setAccount] = useState('')
  const [payeeTransferAccount, setPayeeTransferAccount] = useState('')
  const [payee, setPayee] = useState('')
  const [comment, setComment] = useState('')
  const [datetime, setDatetime] = useState(new Date().toISOString())

  const {
    categoryOptions,
    coloredAccounts,
    transactions,
    allCurrencies,
    allPayees,
    allComments,
    domain,
  } = useTransactionFormDomain()

  const navigate = useNavigate()
  const { transactionId } = useParams()
  const curTransaction = useMemo(
    () => transactions.find((t: TransactionDTO) => t._id === transactionId),
    [transactions, transactionId],
  )
  const lastSerializedTransactionRef = useRef('')

  const initializeFormFromTransaction = (t: TransactionDTO) => {
    setType(t.type)
    setAmount(`${parseFloat(t.amount)}`.replace(',', '.'))
    setAccount(t.account)
    setCurrency(t.currency)
    setCategory(t.category)
    if (t.type === 'transfer') {
      setPayeeTransferAccount(t.payee)
    } else {
      setPayee(t.payee)
    }
    setComment(t.comment)
    setDatetime(convertToLocaleTime(t.datetime))
  }

  useEffect(() => {
    if (!transactionId) {
      return
    }

    if (!curTransaction) {
      navigate('/', { replace: true })
      return
    }

    const serializedTransaction = JSON.stringify(curTransaction)

    if (serializedTransaction !== lastSerializedTransactionRef.current) {
      initializeFormFromTransaction(curTransaction)
      lastSerializedTransactionRef.current = serializedTransaction
    }
  }, [navigate, curTransaction, transactionId])

  const resetForm = () => {
    setType('')
    setAmount('')
    setAccount('')
    setCurrency('')
    setCategory('')
    setPayee('')
    setPayeeTransferAccount('')
    setComment('')
    setDatetime(new Date().toISOString())
  }

  useEffect(() => {
    if (!transactionId) {
      resetForm()
    }
  }, [transactionId])

  const { availableCurrencies, availableColoredAccounts } = useMemo(
    () => domain.getAvailableCurrenciesAndAccounts(type, currency, allCurrencies, coloredAccounts),
    [domain, type, currency, allCurrencies, coloredAccounts],
  )

  const availableAccountNames = useMemo(
    () => availableColoredAccounts.map((a) => a.account),
    [availableColoredAccounts],
  )

  const AccountSelect: FC<{
    value: string
    onChange: (value: string) => void
    ref?: Ref<{ focus: () => void }>
  }> = useMemo(
    () =>
      forwardRef(({ value, onChange }: { value: string; onChange: (v: string) => void }, ref) => {
        const limitedAccountSelectRef = useRef<any>(null)

        useImperativeHandle(ref, () => ({
          focus: () => {
            if (limitedAccountSelectRef.current && limitedAccountSelectRef.current.focus) {
              limitedAccountSelectRef.current.focus()
            }
          },
        }))

        return (
          <LimitedAccountSelect
            ref={limitedAccountSelectRef}
            value={value}
            onChange={onChange}
            availableNames={availableAccountNames}
          />
        )
      }),
    [LimitedAccountSelect, availableAccountNames],
  )

  const payees = useMemo(
    () => domain.getPayeesByCategory(category, transactions, allPayees),
    [domain, category, transactions, allPayees],
  )

  const comments = useMemo(
    () => domain.getCommentsByCategory(category, transactions, allComments),
    [domain, category, transactions, allComments],
  )

  const handleDatetimeChange = (value: Date | null) => {
    if (value) {
      setDatetime(value.toISOString())
    } else {
      setDatetime(new Date().toISOString())
    }
  }

  const isValid = domain.validateTransaction({
    datetime,
    amount,
    account,
    category,
    type,
    currency,
    payeeTransferAccount,
  })

  const handleSave = async () => {
    if (type === '') {
      return
    }
    if (!isValid) {
      return
    }
    const transaction = domain.buildTransactionDTO({
      id: transactionId || uuidv4(),
      datetime: convertToUtcTime(datetime),
      account,
      category,
      type,
      amount,
      currency,
      payee,
      payeeTransferAccount,
      comment,
    })
    await onApply(transaction)
  }

  const adjustCurrencyAndAccounts = (newType: string, newCurrency: string) => {
    if (domain.shouldResetCurrency(newType, newCurrency, allCurrencies, coloredAccounts)) {
      setCurrency('')
    }
    if (domain.shouldResetAccount(account, newCurrency, coloredAccounts)) {
      setAccount('')
    }
    if (domain.shouldResetAccount(payeeTransferAccount, newCurrency, coloredAccounts)) {
      setPayeeTransferAccount('')
    }
  }

  const handleTypeChange = (type: 'income' | 'expense' | 'transfer') => {
    setType(type)
    adjustCurrencyAndAccounts(type, currency)
  }

  const handleAmountChange = (amount: string) => setAmount(amount)

  const handlePayeeChange = (payee: string) => setPayee(payee)

  const handlePayeeTransferAccountChange = (value: string) => {
    // account and payeeTransferAccount should not be the same
    if (account === value) {
      setAccount(payeeTransferAccount)
    }
    setPayeeTransferAccount(value)
  }

  const handleCommentChange = (comment: string) => setComment(comment)

  const handleAccountChange = (value: string) => {
    // account and payeeTransferAccount should not be the same
    if (payeeTransferAccount === value) {
      setPayeeTransferAccount(account)
    }
    setAccount(value)
  }

  const handleCurrencyChange = (currency: string) => {
    setCurrency(currency)
    adjustCurrencyAndAccounts(type, currency)
  }

  const handleCategoryChange = (category: string) => {
    setCategory(category)
  }

  const viewDatetime = new Date(datetime)

  if (coloredAccounts.length === 0) {
    return null
  }

  return (
    <StepByStepTransactionForm
      // Functional components
      AccountSelect={AccountSelect}
      // Basic transaction details
      type={type}
      amount={amount}
      account={account}
      currency={currency}
      category={category}
      payee={payee}
      payeeTransferAccount={payeeTransferAccount}
      comment={comment}
      datetime={viewDatetime}
      // Event handlers for basic transaction details
      onTypeChange={handleTypeChange}
      onAmountChange={handleAmountChange}
      onAccountChange={handleAccountChange}
      onCategoryChange={handleCategoryChange}
      onPayeeChange={handlePayeeChange}
      onPayeeTransferAccountChange={handlePayeeTransferAccountChange}
      onCommentChange={handleCommentChange}
      onDatetimeChange={handleDatetimeChange}
      // Dropdown options
      accounts={availableColoredAccounts}
      categoryOptions={categoryOptions}
      currencies={availableCurrencies}
      payees={payees}
      comments={comments}
      // Event handlers for dropdown options
      onCurrencyChange={handleCurrencyChange}
      // Validation and Save event
      isValid={isValid}
      onSave={handleSave}
    />
  )
}
