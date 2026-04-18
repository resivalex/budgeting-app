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
import { TransactionDTO, TransactionsAggregations, ColoredAccountDetailsDTO } from '@/types'
import {
  convertToLocaleTime,
  convertToUtcTime,
  deriveTransactionType,
  TransactionType,
} from '@/utils'
import StepByStepTransactionForm from './StepByStepTransactionForm'
import { useNavigate, useParams } from 'react-router-dom'
import { useTransactionFormDomain } from '@/hooks'
import { useAtomValue } from 'jotai'
import { externalAccountIdsAtom, accountPropertiesAtom } from '@/state'

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
  const [payee, setPayee] = useState('')
  const [comment, setComment] = useState('')
  const [datetime, setDatetime] = useState(new Date().toISOString())
  const [accountFrom, setAccountFrom] = useState('')
  const [accountTo, setAccountTo] = useState('')
  const [bucketFrom, setBucketFrom] = useState('default')
  const [bucketTo, setBucketTo] = useState('default')

  const externalAccountIds = useAtomValue(externalAccountIdsAtom)
  const accountProperties = useAtomValue(accountPropertiesAtom)

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

  const allColoredAccounts = useMemo((): ColoredAccountDetailsDTO[] => {
    const externalColoredAccounts: ColoredAccountDetailsDTO[] = (accountProperties?.accounts ?? [])
      .filter((a) => a.owner === 'external')
      .map((a) => ({
        account: a.id,
        name: a.name,
        currency: a.currency,
        balance: 0,
        color: a.color,
      }))
    return [...coloredAccounts, ...externalColoredAccounts]
  }, [coloredAccounts, accountProperties])

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
      setBucketFrom(t.bucket_from || 'default')
      setBucketTo(t.bucket_to || 'default')
      setPayee(t.counterparty)
    } else {
      setAccountFrom(txType === 'income' ? '' : t.account_from)
      setAccountTo(txType === 'expense' ? '' : t.account_to)
      setBucketFrom(txType === 'income' ? t.bucket_from || 'default' : 'default')
      setBucketTo(txType === 'expense' ? t.bucket_to || 'default' : 'default')
      if (txType === 'transfer') {
        setPayee('')
      } else {
        setPayee(t.counterparty)
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
    setCurrency('')
    setCategory('')
    setPayee('')
    setComment('')
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
    () =>
      domain.getAvailableCurrenciesAndAccounts(
        currency,
        allCurrencies,
        type === 'custom' ? allColoredAccounts : coloredAccounts,
      ),
    [domain, type, currency, allCurrencies, coloredAccounts, allColoredAccounts],
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
    category,
    type,
    currency,
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
      category,
      type,
      amount,
      currency,
      payee,
      comment,
      accountFrom,
      accountTo,
      bucketFrom,
      bucketTo,
    })
    await onApply(transaction)
  }

  const adjustCurrencyAndAccounts = (newType: string, newCurrency: string) => {
    if (domain.shouldResetCurrency(newCurrency, allCurrencies, coloredAccounts)) {
      setCurrency('')
    }
    if (domain.shouldResetAccount(accountFrom, newCurrency, coloredAccounts)) {
      setAccountFrom('')
    }
    if (domain.shouldResetAccount(accountTo, newCurrency, coloredAccounts)) {
      setAccountTo('')
    }
  }

  const handleTypeChange = (newType: TransactionType) => {
    const oldType = type

    let newAccountFrom = accountFrom
    let newAccountTo = accountTo
    let newBucketFrom = bucketFrom
    let newBucketTo = bucketTo

    // Map main account between accountFrom/accountTo when the "visible" field changes
    if (oldType === 'income' && (newType === 'expense' || newType === 'transfer')) {
      if (!newAccountFrom && newAccountTo) {
        newAccountFrom = newAccountTo
        if (newType === 'expense') newAccountTo = ''
      }
    } else if ((oldType === 'expense' || oldType === 'transfer') && newType === 'income') {
      if (!newAccountTo && newAccountFrom) {
        newAccountTo = newAccountFrom
        newAccountFrom = ''
      }
    }

    // Map active bucket between bucketFrom (income) and bucketTo (expense)
    if (oldType === 'income' && newType === 'expense') {
      newBucketTo = newBucketFrom
      newBucketFrom = 'default'
    } else if (oldType === 'expense' && newType === 'income') {
      newBucketFrom = newBucketTo
      newBucketTo = 'default'
    }

    // Validate currency and accounts for the new type
    let newCurrency = currency
    if (domain.shouldResetCurrency(newCurrency, allCurrencies, coloredAccounts)) {
      newCurrency = ''
    }
    if (domain.shouldResetAccount(newAccountFrom, newCurrency, coloredAccounts)) {
      newAccountFrom = ''
    }
    if (domain.shouldResetAccount(newAccountTo, newCurrency, coloredAccounts)) {
      newAccountTo = ''
    }

    setType(newType)
    setCurrency(newCurrency)
    setAccountFrom(newAccountFrom)
    setAccountTo(newAccountTo)
    setBucketFrom(newBucketFrom)
    setBucketTo(newBucketTo)
  }

  const handleAmountChange = (amount: string) => setAmount(amount)

  const handlePayeeChange = (payee: string) => setPayee(payee)

  const handleCommentChange = (comment: string) => setComment(comment)

  const handleCurrencyChange = (currency: string) => {
    setCurrency(currency)
    adjustCurrencyAndAccounts(type, currency)
  }

  const handleCategoryChange = (category: string) => setCategory(category)

  const matchingBucketIds = useMemo(
    () => domain.getBucketIdsForCategory(category, spendingLimits),
    [domain, category, spendingLimits],
  )

  const activeBucket = type === 'income' ? bucketFrom : type === 'expense' ? bucketTo : 'default'

  const orderedCategoryOptions = useMemo(() => {
    if (activeBucket === 'default') {
      return categoryOptions
    }
    const spendingLimit = spendingLimits.limits.find((l) => l.bucketId === activeBucket)
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
  }, [categoryOptions, activeBucket, spendingLimits])

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
      currency={currency}
      category={category}
      payee={payee}
      comment={comment}
      datetime={viewDatetime}
      // Custom type fields
      accountFrom={accountFrom}
      accountTo={accountTo}
      bucketFrom={bucketFrom}
      bucketTo={bucketTo}
      allBucketOptions={allBucketOptions}
      onAccountFromChange={handleAccountFromChange}
      onAccountToChange={handleAccountToChange}
      onBucketFromChange={handleBucketFromChange}
      onBucketToChange={handleBucketToChange}
      // Event handlers for basic transaction details
      onTypeChange={handleTypeChange}
      onAmountChange={handleAmountChange}
      onCategoryChange={handleCategoryChange}
      onPayeeChange={handlePayeeChange}
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
