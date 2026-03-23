import { useRef, useState, useEffect } from 'react'
import { reactSelectSmallStyles } from '@/utils'
import Select from 'react-select'
import styled from 'styled-components'
import { useIsMobile } from '@/hooks'
import { OverlayOption, OverlayWithSearch } from '@/components/FullscreenOverlay'

interface Props {
  budgetName: string
  isExpanded: boolean
  onBudgetNameChange: (budgetName: string) => void
  onExpand: () => void
  onComplete: () => void
  onCollapse: () => void
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
  onCollapse,
  budgetNameOptions,
}: Props) {
  const [menuIsOpen, setMenuOpen] = useState(false)
  const selectRef = useRef<any>(null)
  const isMobile = useIsMobile()
  const [search, setSearch] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isExpanded && !isMobile && selectRef.current) {
      selectRef.current.focus()
      setMenuOpen(true)
    }
  }, [isExpanded, isMobile])

  useEffect(() => {
    if (isExpanded && isMobile) {
      setSearch('')
      setTimeout(() => searchInputRef.current?.focus(), 100)
    }
  }, [isExpanded, isMobile])

  const selectedOption = budgetNameOptions.find((option) => option.value === budgetName)

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
        <SelectedBudgetName>{selectedOption?.label || budgetName}</SelectedBudgetName>
      </div>
    )
  }

  if (isMobile) {
    const filteredOptions = search
      ? budgetNameOptions.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
      : budgetNameOptions

    return (
      <OverlayWithSearch
        title="Бюджет"
        onClose={onCollapse}
        searchRef={searchInputRef}
        searchValue={search}
        onSearchChange={setSearch}
        onConfirm={onComplete}
      >
        {filteredOptions.map((option) => (
          <OverlayOption
            key={option.value || '__empty__'}
            $isSelected={option.value === budgetName}
            onClick={() => handleBudgetNameChange(option.value)}
          >
            {option.label}
          </OverlayOption>
        ))}
      </OverlayWithSearch>
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
          options={budgetNameOptions}
          styles={reactSelectSmallStyles}
          placeholder="Выберите из списка..."
        />
      </div>
    </div>
  )
}
