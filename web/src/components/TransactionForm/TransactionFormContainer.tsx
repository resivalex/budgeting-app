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
import {
  convertToLocaleTime,
  convertToUtcTime,
  deriveTransactionType,
  deriveAccount,
  deriveBucketId,
  TransactionType,
} from '@/utils'
import StepByStepTransactionForm from './StepByStepTransactionForm'
import { useNavigate, useParams } from 'react-router-dom'
import { useTransactionFormDomain } from '@/hooks'
import { useAtomValue } from 'jotai'
import { externalAccountIdsAtom } from '@/state'

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
  const [type, setType] = useState<TransactionType | ''>('expense')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('')
  const [category, setCategory] = useState('')
  const [account, setAccount] = useState('')
  const [payeeTransferAccount, setPayeeTransferAccount] = useState('')
  const [payee, setPayee] = useState('')
  const [comment, setComment] = useState('')
  const [bucketId, setBucketId] = useState('default')
  const [datetime, setDatetime] = useState(new Date().toISOString())
  const [accountFrom, setAccountFrom] = useState('')
  const [accountTo, setAccountTo] = useState('')
  const [bucketFrom, setBucketFrom] = useState('default')
  const [bucketTo, setBucketTo] = useState('default')

  const externalAccountIds = useAtomValue(externalAccountIdsAtom)

  const {
    categoryOptions,
    bucketOptions,
    coloredAccounts,
    transactions,
    allCurrencies,
    allPayees,
    allComments,
    buckets,
    spendingLimits,
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
    const txType = deriveTransactionType(t, externalAccountIds)
    setType(txType)
    setAmount(`${parseFloat(t.amount)}`.replace(',', '.'))
    setCurrency(t.currency)
    setCategory(t.category)
    setComment(t.comment)
    setDatetime(convertToLocaleTime(t.datetime))

    if (txType === 'custom') {
      setAccountFrom(t.account_from)
      setAccountTo(t.account_to)
      setBucketFrom(t.bucket_from)
      setBucketTo(t.bucket_to)
      setPayee(t.counterparty)
      setAccount('')
      setPayeeTransferAccount('')
      setBucketId('default')
    } else {
      setAccount(deriveAccount(t, externalAccountIds))
      setBucketId(deriveBucketId(t, externalAccountIds))
      setAccountFrom('')
      setAccountTo('')
      setBucketFrom('default')
      setBucketTo('default')
      if (txType === 'transfer') {
        setPayeeTransferAccount(t.account_to)
        setPayee('')
      } else {
        setPayee(t.counterparty)
        setPayeeTransferAccount('')
      }
    }
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
    setBucketId('default')
    setDatetime(new Date().toISOString())
    setAccountFrom('')
    setAccountTo('')
    setBucketFrom('default')
    setBucketTo('default')
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
    () => domain.getPayeesByCategory(category, transactions, allPayees, externalAccountIds),
    [domain, category, transactions, allPayees, externalAccountIds],
  )

  const comments = useMemo(
    () => domain.getCommentsByCategory(category, transactions, allComments, externalAccountIds),
    [domain, category, transactions, allComments, externalAccountIds],
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
    accountFrom,
    accountTo,
  })

  const handleSave = async () => {
    if (type === '') {
      return
    }
    if (!isValid) {
      return
    }
    const transaction = domain.buildTransactionDTO({
      id: transactionId || 'tx:' + uuidv4(),
      datetime: convertToUtcTime(datetime),
      account,
      category,
      type,
      amount,
      currency,
      payee,
      payeeTransferAccount,
      comment,
      bucket_id: bucketId,
      accountFrom,
      accountTo,
      bucketFrom,
      bucketTo,
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

  const handleTypeChange = (type: TransactionType) => {
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

  const handleCategoryChange = (category: string) => setCategory(category)

  const handleBucketIdChange = (id: string) => setBucketId(id)

  const matchingBucketIds = useMemo(
    () => domain.getBucketIdsForCategory(category, spendingLimits),
    [domain, category, spendingLimits],
  )

  const orderedCategoryOptions = useMemo(() => {
    if (bucketId === 'default') {
      return categoryOptions
    }
    const spendingLimit = spendingLimits.limits.find((l) => l.bucketId === bucketId)
    if (!spendingLimit) {
      return categoryOptions
    }
    const budgetCategories = categoryOptions.filter((o) =>
      spendingLimit.categories.includes(o.value),
    )
    const otherCategories = categoryOptions.filter(
      (o) => !spendingLimit.categories.includes(o.value),
    )
    return [...budgetCategories, ...otherCategories]
  }, [categoryOptions, bucketId, spendingLimits])

  const orderedBucketOptions = useMemo(() => {
    const matching = bucketOptions.filter(
      (o) => o.value !== 'default' && matchingBucketIds.includes(o.value),
    )
    const nonMatching = bucketOptions.filter(
      (o) => o.value !== 'default' && !matchingBucketIds.includes(o.value),
    )
    const defaultOption = bucketOptions.find((o) => o.value === 'default')
    return [...matching, ...nonMatching, ...(defaultOption ? [defaultOption] : [])]
  }, [bucketOptions, matchingBucketIds])

  const allAccountOptions = useMemo(() => coloredAccounts, [coloredAccounts])

  const allBucketOptions = useMemo(() => bucketOptions, [bucketOptions])

  const handleAccountFromChange = (value: string) => setAccountFrom(value)
  const handleAccountToChange = (value: string) => setAccountTo(value)
  const handleBucketFromChange = (value: string) => setBucketFrom(value)
  const handleBucketToChange = (value: string) => setBucketTo(value)

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
      budgetName={bucketId}
      payee={payee}
      payeeTransferAccount={payeeTransferAccount}
      comment={comment}
      datetime={viewDatetime}
      // Custom type fields
      accountFrom={accountFrom}
      accountTo={accountTo}
      bucketFrom={bucketFrom}
      bucketTo={bucketTo}
      allAccounts={allAccountOptions}
      allBucketOptions={allBucketOptions}
      onAccountFromChange={handleAccountFromChange}
      onAccountToChange={handleAccountToChange}
      onBucketFromChange={handleBucketFromChange}
      onBucketToChange={handleBucketToChange}
      // Event handlers for basic transaction details
      onTypeChange={handleTypeChange}
      onAmountChange={handleAmountChange}
      onAccountChange={handleAccountChange}
      onCategoryChange={handleCategoryChange}
      onBudgetNameChange={handleBucketIdChange}
      onPayeeChange={handlePayeeChange}
      onPayeeTransferAccountChange={handlePayeeTransferAccountChange}
      onCommentChange={handleCommentChange}
      onDatetimeChange={handleDatetimeChange}
      // Dropdown options
      accounts={availableColoredAccounts}
      categoryOptions={orderedCategoryOptions}
      budgetNameOptions={orderedBucketOptions}
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
