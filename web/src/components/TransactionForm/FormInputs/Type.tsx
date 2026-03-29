import { useEffect, useRef, ReactNode } from 'react'
import styled from 'styled-components'
import { TransactionType } from '@/utils'

interface Props {
  value: string
  isExpanded: boolean
  alwaysShowOptionsIfEmpty: boolean
  onChange: (type: TransactionType) => void
  onExpand: () => void
  onComplete: () => void
}

const TypeDot = styled.span<{ $dotColor: string }>`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${(props) => props.$dotColor};
  border: 1px solid white;
  margin-right: 6px;
  flex-shrink: 0;
`

const Option = styled.div<{ $isActive: boolean }>`
  background-color: ${(props) => (props.$isActive ? '#3273dc' : '#fff')};
  color: ${(props) => (props.$isActive ? '#fff' : '#3273dc')};
  border: 1px solid #3273dc;
  border-radius: 4px;
  padding: 0.4rem 0.8rem;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;

  &:not(:first-child) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-left: none;
  }

  &:not(:last-child) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
`

const Container = styled.div`
  outline: none;
  display: inline-flex;
  flex-grow: 1;

  &:focus {
    border-radius: 4px;
    box-shadow: 0 0 0 2px rgba(50, 115, 220, 0.3);
  }
`

export default function Type({
  value,
  isExpanded,
  alwaysShowOptionsIfEmpty,
  onChange,
  onExpand,
  onComplete,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  function renderSelectedOption(): ReactNode {
    switch (value) {
      case 'expense':
        return (
          <>
            <TypeDot $dotColor="red" />
            Расход
          </>
        )
      case 'income':
        return (
          <>
            <TypeDot $dotColor="green" />
            Доход
          </>
        )
      case 'transfer':
        return (
          <>
            <TypeDot $dotColor="orange" />
            Перевод
          </>
        )
      case 'custom':
        return (
          <>
            <TypeDot $dotColor="purple" />
            Кастомный
          </>
        )
      default:
        return 'Тип?'
    }
  }

  useEffect(() => {
    if (isExpanded) {
      containerRef.current?.focus()
    }
  }, [isExpanded])

  const handleOptionClick = (type: TransactionType) => {
    if (!isExpanded) {
      onExpand()
      // to prevent calling onComplete before onExpand
      setTimeout(() => {
        onChange(type)
        onComplete()
      }, 0)
    } else {
      onChange(type)
      onComplete()
    }
  }

  const renderOptions = () => (
    <>
      <Option $isActive={value === 'expense'} onClick={() => handleOptionClick('expense')}>
        <TypeDot $dotColor="red" />
        Расход
      </Option>
      <Option $isActive={value === 'income'} onClick={() => handleOptionClick('income')}>
        <TypeDot $dotColor="green" />
        Доход
      </Option>
      <Option $isActive={value === 'transfer'} onClick={() => handleOptionClick('transfer')}>
        <TypeDot $dotColor="orange" />
        Перевод
      </Option>
      <Option $isActive={value === 'custom'} onClick={() => handleOptionClick('custom')}>
        <TypeDot $dotColor="purple" />
        Кастомный
      </Option>
    </>
  )

  if (!isExpanded) {
    return (
      <div className="field">
        <Container ref={containerRef} tabIndex={0} onClick={onExpand}>
          {alwaysShowOptionsIfEmpty && !value ? (
            renderOptions()
          ) : (
            <Option $isActive={true}>{renderSelectedOption()}</Option>
          )}
        </Container>
      </div>
    )
  }

  return (
    <div className="field">
      <Container ref={containerRef} tabIndex={0}>
        {renderOptions()}
      </Container>
    </div>
  )
}
