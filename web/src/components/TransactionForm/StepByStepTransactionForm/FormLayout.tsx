import React, { useState } from 'react'
import { TransactionType } from '@/utils'

export interface AmountStepProps {
  isExpanded: boolean
  onExpand: () => void
  onComplete: () => void
}

export interface CurrencyStepProps {
  alwaysShowOptionsIfEmpty: boolean
  isExpanded: boolean
  onExpand: () => void
  onComplete: () => void
}

export interface TypeStepProps {
  alwaysShowOptionsIfEmpty: boolean
  isExpanded: boolean
  onExpand: () => void
  onComplete: () => void
}

export interface AccountStepProps {
  isExpanded: boolean
  onExpand: () => void
  onComplete: () => void
  onCollapse: () => void
}

export interface CategoryStepProps {
  isExpanded: boolean
  onExpand: () => void
  onComplete: () => void
  onCollapse: () => void
}

export interface BudgetNameStepProps {
  isExpanded: boolean
  onExpand: () => void
  onComplete: () => void
  onCollapse: () => void
}

export interface PayeeStepProps {
  isExpanded: boolean
  onExpand: () => void
  onComplete: () => void
  onCollapse: () => void
}

export interface AccountFromStepProps {
  isExpanded: boolean
  onExpand: () => void
  onComplete: () => void
  onCollapse: () => void
}

export interface AccountToStepProps {
  isExpanded: boolean
  onExpand: () => void
  onComplete: () => void
  onCollapse: () => void
}

export interface BucketFromStepProps {
  isExpanded: boolean
  onExpand: () => void
  onComplete: () => void
  onCollapse: () => void
}

export interface BucketToStepProps {
  isExpanded: boolean
  onExpand: () => void
  onComplete: () => void
  onCollapse: () => void
}

export interface CommentStepProps {
  isExpanded: boolean
  onExpand: () => void
  onComplete: () => void
  onCollapse: () => void
}

export interface DatetimeStepProps {
  isExpanded: boolean
  onExpand: () => void
}

export interface SaveButtonProps {}

const typeStep = 'type'
const currencyStep = 'currency'
const amountStep = 'amount'
const accountStep = 'account'
const categoryStep = 'category'
const budgetNameStep = 'budgetName'
const payeeStep = 'payee'
const accountFromStep = 'accountFrom'
const accountToStep = 'accountTo'
const bucketFromStep = 'bucketFrom'
const bucketToStep = 'bucketTo'
const commentStep = 'comment'
const datetimeStep = 'datetime'

function FormLayout({
  type,
  AmountStep,
  CurrencyStep,
  TypeStep,
  AccountStep,
  CategoryStep,
  BudgetNameStep,
  PayeeStep,
  AccountFromStep,
  AccountToStep,
  BucketFromStep,
  BucketToStep,
  CommentStep,
  DatetimeStep,
  SaveButton,
}: {
  type: TransactionType | ''
  AmountStep: (props: AmountStepProps) => React.ReactNode
  CurrencyStep: (props: CurrencyStepProps) => React.ReactNode
  TypeStep: (props: TypeStepProps) => React.ReactNode
  AccountStep: (props: AccountStepProps) => React.ReactNode
  CategoryStep: (props: CategoryStepProps) => React.ReactNode
  BudgetNameStep: (props: BudgetNameStepProps) => React.ReactNode
  PayeeStep: (props: PayeeStepProps) => React.ReactNode
  AccountFromStep: (props: AccountFromStepProps) => React.ReactNode
  AccountToStep: (props: AccountToStepProps) => React.ReactNode
  BucketFromStep: (props: BucketFromStepProps) => React.ReactNode
  BucketToStep: (props: BucketToStepProps) => React.ReactNode
  CommentStep: (props: CommentStepProps) => React.ReactNode
  DatetimeStep: (props: DatetimeStepProps) => React.ReactNode
  SaveButton: (props: SaveButtonProps) => React.ReactNode
}) {
  const [currentStep, setCurrentStep] = useState(amountStep)
  const collapseStep = () => setCurrentStep('')
  const combineAmountAndCurrency = currentStep !== amountStep && currentStep !== currencyStep

  return (
    <div className="field p-2">
      {combineAmountAndCurrency ? (
        <div className="field is-flex is-flex-direction-row">
          <div>
            {CurrencyStep({
              alwaysShowOptionsIfEmpty: true,
              isExpanded: currentStep === currencyStep,
              onExpand: () => setCurrentStep(currencyStep),
              onComplete: () => setCurrentStep(typeStep),
            })}
          </div>
          <div className="is-flex-grow-1">
            {AmountStep({
              isExpanded: currentStep === amountStep,
              onExpand: () => setCurrentStep(amountStep),
              onComplete: () => setCurrentStep(currencyStep),
            })}
          </div>
        </div>
      ) : (
        <>
          {AmountStep({
            isExpanded: currentStep === amountStep,
            onExpand: () => setCurrentStep(amountStep),
            onComplete: () => setCurrentStep(currencyStep),
          })}
          {CurrencyStep({
            alwaysShowOptionsIfEmpty: true,
            isExpanded: currentStep === currencyStep,
            onExpand: () => setCurrentStep(currencyStep),
            onComplete: () => setCurrentStep(typeStep),
          })}
        </>
      )}
      {TypeStep({
        alwaysShowOptionsIfEmpty: true,
        isExpanded: currentStep === typeStep,
        onExpand: () => setCurrentStep(typeStep),
        onComplete: () => setCurrentStep(type === 'custom' ? accountFromStep : accountStep),
      })}
      {type === 'custom' ? (
        <>
          {AccountFromStep({
            isExpanded: currentStep === accountFromStep,
            onExpand: () => setCurrentStep(accountFromStep),
            onComplete: () => setCurrentStep(accountToStep),
            onCollapse: collapseStep,
          })}
          {AccountToStep({
            isExpanded: currentStep === accountToStep,
            onExpand: () => setCurrentStep(accountToStep),
            onComplete: () => setCurrentStep(bucketFromStep),
            onCollapse: collapseStep,
          })}
          {BucketFromStep({
            isExpanded: currentStep === bucketFromStep,
            onExpand: () => setCurrentStep(bucketFromStep),
            onComplete: () => setCurrentStep(bucketToStep),
            onCollapse: collapseStep,
          })}
          {BucketToStep({
            isExpanded: currentStep === bucketToStep,
            onExpand: () => setCurrentStep(bucketToStep),
            onComplete: () => setCurrentStep(categoryStep),
            onCollapse: collapseStep,
          })}
          {CategoryStep({
            isExpanded: currentStep === categoryStep,
            onExpand: () => setCurrentStep(categoryStep),
            onComplete: () => setCurrentStep(payeeStep),
            onCollapse: collapseStep,
          })}
          {PayeeStep({
            isExpanded: currentStep === payeeStep,
            onExpand: () => setCurrentStep(payeeStep),
            onComplete: () => setCurrentStep(commentStep),
            onCollapse: collapseStep,
          })}
        </>
      ) : (
        <>
          {AccountStep({
            isExpanded: currentStep === accountStep,
            onExpand: () => setCurrentStep(accountStep),
            onComplete: () =>
              setCurrentStep(type === 'transfer' ? accountToStep : budgetNameStep),
            onCollapse: collapseStep,
          })}
          {type === 'transfer' ? (
            AccountToStep({
              isExpanded: currentStep === accountToStep,
              onExpand: () => setCurrentStep(accountToStep),
              onComplete: () => setCurrentStep(commentStep),
              onCollapse: collapseStep,
            })
          ) : (
            <>
              {BudgetNameStep({
                isExpanded: currentStep === budgetNameStep,
                onExpand: () => setCurrentStep(budgetNameStep),
                onComplete: () => setCurrentStep(categoryStep),
                onCollapse: collapseStep,
              })}
              {CategoryStep({
                isExpanded: currentStep === categoryStep,
                onExpand: () => setCurrentStep(categoryStep),
                onComplete: () => setCurrentStep(payeeStep),
                onCollapse: collapseStep,
              })}
              {PayeeStep({
                isExpanded: currentStep === payeeStep,
                onExpand: () => setCurrentStep(payeeStep),
                onComplete: () => setCurrentStep(commentStep),
                onCollapse: collapseStep,
              })}
            </>
          )}
        </>
      )}
      {CommentStep({
        isExpanded: currentStep === commentStep,
        onExpand: () => setCurrentStep(commentStep),
        onComplete: () => setCurrentStep(datetimeStep),
        onCollapse: collapseStep,
      })}
      {DatetimeStep({
        isExpanded: currentStep === datetimeStep,
        onExpand: () => setCurrentStep(datetimeStep),
      })}
      {SaveButton({})}
    </div>
  )
}

export default FormLayout
