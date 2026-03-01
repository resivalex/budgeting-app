import React, { useRef, useState, useEffect } from 'react'
import { reactSelectSmallStyles } from '@/utils'
import Select from 'react-select'
import styled from 'styled-components'

interface Props {
  budgetName: string
  isExpanded: boolean
  onBudgetNameChange: (budgetName: string) => void
  onExpand: () => void
  onComplete: () => void
  budgetNameOptions: { value: string; label: string }[]
}

const BudgetNameLabel = styled.div<{ $isExpanded: boolean }>`
  font-size: 1rem;
  color: ${(props) => (props.$isExpanded ? 'black' : 'gray')};
`

const SelectedBudgetName = styled.div`
  font-size: 0.8rem;
`

export default function BudgetName({
  budgetName,
  isExpanded,
  onBudgetNameChange,
  onExpand,
  onComplete,
  budgetNameOptions,
}: Props) {
  const [menuIsOpen, setMenuOpen] = useState(false)
  const selectRef = useRef<any>(null)

  useEffect(() => {
    if (isExpanded && selectRef.current) {
      selectRef.current.focus()
      setMenuOpen(true)
    }
  }, [isExpanded])

  const allOptions = [{ value: '', label: '(без бюджета)' }, ...budgetNameOptions]
  const selectedOption = allOptions.find((option) => option.value === budgetName)

  const handleBudgetNameChange = (value: string) => {
    onBudgetNameChange(value)
    onComplete()
  }

  if (!isExpanded) {
    return (
      <div className="field" onClick={onExpand}>
        <BudgetNameLabel className="is-size-7" $isExpanded={isExpanded}>
          Бюджет
        </BudgetNameLabel>
        <SelectedBudgetName>
          {selectedOption ? selectedOption.label : '(без бюджета)'}
        </SelectedBudgetName>
      </div>
    )
  }

  return (
    <div className="field">
      <BudgetNameLabel className="is-size-7" $isExpanded={isExpanded}>
        Бюджет
      </BudgetNameLabel>
      <div className="control">
        {/* @ts-ignore */}{' '}
        <Select
          ref={selectRef}
          menuIsOpen={menuIsOpen}
          onMenuOpen={() => setMenuOpen(true)}
          onMenuClose={() => setMenuOpen(false)}
          className="basic-single"
          classNamePrefix="select"
          value={selectedOption}
          // @ts-ignore
          onChange={(selectedOption) => {
            if (!selectedOption) return
            handleBudgetNameChange(selectedOption.value)
          }}
          options={allOptions}
          styles={reactSelectSmallStyles}
          placeholder="Выберите из списка..."
        />
      </div>
    </div>
  )
}
