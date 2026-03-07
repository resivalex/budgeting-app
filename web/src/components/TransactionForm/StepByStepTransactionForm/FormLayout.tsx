import React, { useState } from 'react'

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

export interface PayeeTransferAccountStepProps {
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
const payeeTransferAccountStep = 'payeeTransferAccount'
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
  PayeeTransferAccountStep,
  CommentStep,
  DatetimeStep,
  SaveButton,
}: {
  type: 'expense' | 'income' | 'transfer' | ''
  AmountStep: (props: AmountStepProps) => React.ReactNode
  CurrencyStep: (props: CurrencyStepProps) => React.ReactNode
  TypeStep: (props: TypeStepProps) => React.ReactNode
  AccountStep: (props: AccountStepProps) => React.ReactNode
  CategoryStep: (props: CategoryStepProps) => React.ReactNode
  BudgetNameStep: (props: BudgetNameStepProps) => React.ReactNode
  PayeeStep: (props: PayeeStepProps) => React.ReactNode
  PayeeTransferAccountStep: (props: PayeeTransferAccountStepProps) => React.ReactNode
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
        onComplete: () => setCurrentStep(accountStep),
      })}
      {AccountStep({
        isExpanded: currentStep === accountStep,
        onExpand: () => setCurrentStep(accountStep),
        onComplete: () =>
          setCurrentStep(type === 'transfer' ? payeeTransferAccountStep : categoryStep),
        onCollapse: collapseStep,
      })}
      {type === 'transfer' ? (
        PayeeTransferAccountStep({
          isExpanded: currentStep === payeeTransferAccountStep,
          onExpand: () => setCurrentStep(payeeTransferAccountStep),
          onComplete: () => {
            const nextStep = type === 'transfer' ? '' : commentStep
            setCurrentStep(nextStep)
          },
          onCollapse: collapseStep,
        })
      ) : (
        <>
          {CategoryStep({
            isExpanded: currentStep === categoryStep,
            onExpand: () => setCurrentStep(categoryStep),
            onComplete: () => setCurrentStep(payeeStep),
            onCollapse: collapseStep,
          })}
          {BudgetNameStep({
            isExpanded: currentStep === budgetNameStep,
            onExpand: () => setCurrentStep(budgetNameStep),
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
