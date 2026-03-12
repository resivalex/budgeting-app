import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import SuggestingInput from '@/components/SuggestingInput'
import { useIsMobile } from '@/hooks'
import { filterSuggestions } from '@/utils/en-ru-matching'
import { OverlayOption, OverlayWithSearch } from '@/components/FullscreenOverlay'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'

interface Props {
  payee: string
  isExpanded: boolean
  onPayeeChange: (payee: string) => void
  onExpand: () => void
  onComplete: () => void
  onCollapse: () => void
  payees: string[]
  type: 'expense' | 'income' | 'transfer' | ''
}

const PayeeLabel = styled.div<{ $isExpanded: boolean }>`
  font-size: 1rem;
  color: ${(props) => (props.$isExpanded ? 'black' : 'gray')};
`

const SelectedPayee = styled.div`
  font-size: 0.8rem;
`

const ConfirmButton = styled.button`
  font-size: 1.8rem;
  background-color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
`

export default function Payee({
  payee,
  isExpanded,
  onPayeeChange,
  onExpand,
  onComplete,
  onCollapse,
  payees,
  type,
}: Props) {
  const inputRef = useRef<any>(null)
  const mobileInputRef = useRef<HTMLInputElement>(null)
  const isMobile = useIsMobile()
  const [localValue, setLocalValue] = useState(payee)

  useEffect(() => {
    if (isExpanded && !isMobile && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isExpanded, isMobile])

  useEffect(() => {
    if (isExpanded && isMobile) {
      setLocalValue(payee)
      setTimeout(() => mobileInputRef.current?.focus(), 100)
    }
  }, [isExpanded, isMobile, payee])

  function labelText() {
    return type === 'income' ? 'Плательщик' : 'Получатель'
  }

  if (!isExpanded) {
    return (
      <div className="field" onClick={onExpand}>
        <PayeeLabel className="is-size-7" $isExpanded={isExpanded}>
          {labelText()}
        </PayeeLabel>
        <SelectedPayee>{payee || '(пусто)'}</SelectedPayee>
      </div>
    )
  }

  if (isMobile) {
    const filtered = filterSuggestions(payees, localValue)

    const handleConfirm = () => {
      onPayeeChange(localValue)
      onComplete()
    }

    const handleSuggestionClick = (suggestion: string) => {
      onPayeeChange(suggestion)
      onComplete()
    }

    return (
      <OverlayWithSearch
        title={labelText()}
        onClose={onCollapse}
        searchRef={mobileInputRef}
        searchValue={localValue}
        onSearchChange={setLocalValue}
        searchPlaceholder="Введите или выберите..."
        floatingAction={
          <ConfirmButton onClick={handleConfirm}>
            {/* @ts-ignore */}
            <FontAwesomeIcon icon={faCheckCircle} color="rgb(50, 115, 220)" />
          </ConfirmButton>
        }
      >
        {filtered.map((suggestion, index) => (
          <OverlayOption key={index} onClick={() => handleSuggestionClick(suggestion)}>
            {suggestion}
          </OverlayOption>
        ))}
      </OverlayWithSearch>
    )
  }

  return (
    <div className="field">
      <PayeeLabel className="is-size-7" $isExpanded={isExpanded}>
        {labelText()}
      </PayeeLabel>
      <div className="control">
        <SuggestingInput
          ref={inputRef}
          value={payee}
          suggestions={payees}
          onChange={onPayeeChange}
          onConfirm={onComplete}
        />
      </div>
    </div>
  )
}
