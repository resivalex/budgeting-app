import { FC, useState, Ref, useCallback, useEffect } from 'react'
import { convertCurrencyCodeToSymbol, formatFinancialAmount, TransactionType } from '@/utils'
import { ColoredAccountDetailsDTO } from '@/types'
import {
  Type,
  Currency,
  Amount,
  Account,
  Category,
  BudgetName,
  Payee,
  Comment,
  Datetime,
  SaveButton,
} from './FormInputs'
import FormLayout, {
  AmountStepProps,
  CurrencyStepProps,
  TypeStepProps,
  AccountStepProps,
  CategoryStepProps,
  BudgetNameStepProps,
  PayeeStepProps,
  AccountFromStepProps,
  AccountToStepProps,
  BucketFromStepProps,
  BucketToStepProps,
  CommentStepProps,
  DatetimeStepProps,
} from './StepByStepTransactionForm/FormLayout'

// Types

interface SelectOption {
  value: string
  label: string
}

function StepByStepTransactionForm({
  AccountSelect,
  type,
  onTypeChange,
  amount,
  onAmountChange,
  account,
  currency,
  category,
  onCategoryChange,
  budgetName,
  onBudgetNameChange,
  budgetNameOptions,
  payee,
  onPayeeChange,
  comment,
  onCommentChange,
  datetime,
  onAccountChange,
  onDatetimeChange,
  onSave,
  accounts,
  categoryOptions,
  currencies,
  onCurrencyChange,
  isValid,
  payees,
  comments,
  accountFrom,
  accountTo,
  bucketFrom,
  bucketTo,
  onAccountFromChange,
  onAccountToChange,
  onBucketFromChange,
  onBucketToChange,
  allBucketOptions,
}: {
  // Functional components
  AccountSelect: FC<{
    value: string
    onChange: (value: string) => void
    ref?: Ref<{ focus: () => void }>
  }>
  type: TransactionType | ''
  currency: string
  amount: string
  account: string
  category: string
  budgetName: string
  payee: string
  comment: string
  datetime: Date
  accountFrom: string
  accountTo: string
  bucketFrom: string
  bucketTo: string

  accounts: ColoredAccountDetailsDTO[]
  categoryOptions: SelectOption[]
  budgetNameOptions: SelectOption[]
  currencies: string[]
  payees: string[]
  comments: string[]
  allBucketOptions: SelectOption[]

  onTypeChange: (type: TransactionType) => void
  onCurrencyChange: (currency: string) => void
  onAmountChange: (amount: string) => void
  onAccountChange: (account: string) => void
  onCategoryChange: (category: string) => void
  onBudgetNameChange: (budgetName: string) => void
  onPayeeChange: (payee: string) => void
  onCommentChange: (comment: string) => void
  onDatetimeChange: (datetime: Date | null) => void
  onAccountFromChange: (accountFrom: string) => void
  onAccountToChange: (accountTo: string) => void
  onBucketFromChange: (bucketFrom: string) => void
  onBucketToChange: (bucketTo: string) => void

  // Save event
  isValid: boolean
  onSave: () => Promise<void>
}) {
  const [isLoading, setIsLoading] = useState(false)

  const currencyOptions = currencies.map((currency) => ({
    value: currency,
    label: currency,
  }))

  const accountOptions = accounts.map((a) => ({
    value: a.account,
    label: `${formatFinancialAmount(a.balance)} ${convertCurrencyCodeToSymbol(a.currency)} | ${a.name}`,
    color: a.color,
  }))

  function AmountStep({ isExpanded, onExpand, onComplete }: AmountStepProps) {
    return (
      <Amount
        amount={amount}
        onAmountChange={onAmountChange}
        isExpanded={isExpanded}
        onExpand={onExpand}
        onComplete={onComplete}
      />
    )
  }

  function CurrencyStep({
    alwaysShowOptionsIfEmpty,
    isExpanded,
    onExpand,
    onComplete,
  }: CurrencyStepProps) {
    return (
      <Currency
        value={currency}
        options={currencyOptions}
        onChange={onCurrencyChange}
        alwaysShowOptionsIfEmpty={alwaysShowOptionsIfEmpty}
        isExpanded={isExpanded}
        onExpand={onExpand}
        onComplete={onComplete}
      />
    )
  }

  function TypeStep({ alwaysShowOptionsIfEmpty, isExpanded, onExpand, onComplete }: TypeStepProps) {
    return (
      <Type
        value={type}
        onChange={onTypeChange}
        alwaysShowOptionsIfEmpty={alwaysShowOptionsIfEmpty}
        isExpanded={isExpanded}
        onExpand={onExpand}
        onComplete={onComplete}
      />
    )
  }

  function AccountStep({ isExpanded, onExpand, onComplete, onCollapse }: AccountStepProps) {
    return (
      <Account
        AccountSelect={AccountSelect}
        account={account}
        accountOptions={accountOptions}
        onAccountChange={onAccountChange}
        isExpanded={isExpanded}
        onExpand={onExpand}
        onComplete={onComplete}
        onCollapse={onCollapse}
      />
    )
  }

  function CategoryStep({ isExpanded, onExpand, onComplete, onCollapse }: CategoryStepProps) {
    return (
      <Category
        category={category}
        categoryOptions={categoryOptions}
        onCategoryChange={onCategoryChange}
        isExpanded={isExpanded}
        onExpand={onExpand}
        onComplete={onComplete}
        onCollapse={onCollapse}
      />
    )
  }

  function BudgetNameStep({ isExpanded, onExpand, onComplete, onCollapse }: BudgetNameStepProps) {
    return (
      <BudgetName
        budgetName={budgetName}
        budgetNameOptions={budgetNameOptions}
        onBudgetNameChange={onBudgetNameChange}
        isExpanded={isExpanded}
        onExpand={onExpand}
        onComplete={onComplete}
        onCollapse={onCollapse}
      />
    )
  }

  function PayeeStep({ isExpanded, onExpand, onComplete, onCollapse }: PayeeStepProps) {
    return (
      <Payee
        type={type}
        payee={payee}
        payees={payees}
        onPayeeChange={onPayeeChange}
        isExpanded={isExpanded}
        onExpand={onExpand}
        onComplete={onComplete}
        onCollapse={onCollapse}
      />
    )
  }

  function AccountFromStep({ isExpanded, onExpand, onComplete, onCollapse }: AccountFromStepProps) {
    return (
      <Account
        AccountSelect={AccountSelect}
        account={accountFrom}
        accountOptions={accountOptions}
        onAccountChange={onAccountFromChange}
        isExpanded={isExpanded}
        onExpand={onExpand}
        onComplete={onComplete}
        onCollapse={onCollapse}
        label="Со счёта"
      />
    )
  }

  function AccountToStep({ isExpanded, onExpand, onComplete, onCollapse }: AccountToStepProps) {
    return (
      <Account
        AccountSelect={AccountSelect}
        account={accountTo}
        accountOptions={accountOptions}
        onAccountChange={onAccountToChange}
        isExpanded={isExpanded}
        onExpand={onExpand}
        onComplete={onComplete}
        onCollapse={onCollapse}
        label="На счёт"
      />
    )
  }

  function BucketFromStep({ isExpanded, onExpand, onComplete, onCollapse }: BucketFromStepProps) {
    return (
      <BudgetName
        budgetName={bucketFrom}
        budgetNameOptions={allBucketOptions}
        onBudgetNameChange={onBucketFromChange}
        isExpanded={isExpanded}
        onExpand={onExpand}
        onComplete={onComplete}
        onCollapse={onCollapse}
        label="Из назначения"
      />
    )
  }

  function BucketToStep({ isExpanded, onExpand, onComplete, onCollapse }: BucketToStepProps) {
    return (
      <BudgetName
        budgetName={bucketTo}
        budgetNameOptions={allBucketOptions}
        onBudgetNameChange={onBucketToChange}
        isExpanded={isExpanded}
        onExpand={onExpand}
        onComplete={onComplete}
        onCollapse={onCollapse}
        label="В назначение"
      />
    )
  }

  function CommentStep({ isExpanded, onExpand, onComplete, onCollapse }: CommentStepProps) {
    return (
      <Comment
        comment={comment}
        comments={comments}
        isExpanded={isExpanded}
        onCommentChange={onCommentChange}
        onExpand={onExpand}
        onComplete={onComplete}
        onCollapse={onCollapse}
      />
    )
  }

  function DatetimeStep({ isExpanded, onExpand }: DatetimeStepProps) {
    return (
      <Datetime
        datetime={datetime}
        onDatetimeChange={onDatetimeChange}
        isExpanded={isExpanded}
        onExpand={onExpand}
      />
    )
  }

  const handleSave = useCallback(async () => {
    setIsLoading(true)
    await onSave()
    setIsLoading(false)
  }, [onSave])

  const SaveButtonWrapper = () => (
    <SaveButton isValid={isValid} isLoading={isLoading} onSave={handleSave} />
  )

  return (
    <FormLayout
      type={type}
      AmountStep={AmountStep}
      CurrencyStep={CurrencyStep}
      TypeStep={TypeStep}
      AccountStep={AccountStep}
      CategoryStep={CategoryStep}
      BudgetNameStep={BudgetNameStep}
      PayeeStep={PayeeStep}
      AccountFromStep={AccountFromStep}
      AccountToStep={AccountToStep}
      BucketFromStep={BucketFromStep}
      BucketToStep={BucketToStep}
      CommentStep={CommentStep}
      DatetimeStep={DatetimeStep}
      SaveButton={SaveButtonWrapper}
    />
  )
}

export default StepByStepTransactionForm
