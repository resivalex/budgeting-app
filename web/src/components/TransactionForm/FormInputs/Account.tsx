import { useEffect, FC, Ref, useRef } from 'react'
import styled from 'styled-components'
import { useIsMobile } from '@/hooks'
import FullscreenOverlay, { OverlayOption } from '@/components/FullscreenOverlay'

const SelectContainer = styled.div<{ $isExpanded: boolean }>`
  font-size: ${(props) => (props.$isExpanded ? '1rem' : '0.8rem')};
`

const AccountLabel = styled.div<{ $isExpanded: boolean }>`
  font-size: 1rem;
  color: ${(props) => (props.$isExpanded ? 'black' : 'gray')};
`

const SelectedOption = styled.div<{ color?: string }>`
  font-size: 1.2rem;
  background: ${(props) => props.color};
  padding: 2px 5px;
`

export default function Account({
  AccountSelect,
  account,
  isExpanded,
  onAccountChange,
  onExpand,
  onComplete,
  onCollapse,
  accountOptions,
}: {
  AccountSelect: FC<{
    value: string
    onChange: (value: string) => void
    ref?: Ref<{ focus: () => void }>
  }>
  account: string
  isExpanded: boolean
  onAccountChange: (account: string) => void
  onComplete: () => void
  onExpand: () => void
  onCollapse: () => void
  accountOptions: { value: string; label: string; color: string }[]
}) {
  const accountSelectRef = useRef<{ focus: () => void }>(null)
  const isMobile = useIsMobile()

  const selectedOption = accountOptions.find((option) => option.value === account)

  const handleAccountChange = (value: string) => {
    onAccountChange(value)
    onComplete()
  }

  useEffect(() => {
    if (isExpanded && !isMobile && accountSelectRef.current) {
      accountSelectRef.current.focus()
    }
  }, [isExpanded, isMobile])

  if (!isExpanded) {
    return (
      <div className="field" onClick={onExpand}>
        {!selectedOption && (
          <AccountLabel className="is-size-7" $isExpanded={isExpanded}>
            Счёт
          </AccountLabel>
        )}
        <SelectedOption color={selectedOption?.color}>
          {selectedOption ? selectedOption.label : '(пусто)'}
        </SelectedOption>
      </div>
    )
  }

  if (isMobile) {
    return (
      <FullscreenOverlay title="Счёт" onClose={onCollapse}>
        {accountOptions.map((option) => (
          <OverlayOption
            key={option.value}
            $color={option.color}
            $isSelected={option.value === account}
            onClick={() => handleAccountChange(option.value)}
          >
            {option.label}
          </OverlayOption>
        ))}
      </FullscreenOverlay>
    )
  }

  return (
    <div className="field">
      <AccountLabel className="is-size-7" $isExpanded={isExpanded}>
        Счёт
      </AccountLabel>
      <SelectContainer className="control" $isExpanded={isExpanded}>
        <AccountSelect value={account} onChange={handleAccountChange} ref={accountSelectRef} />
      </SelectContainer>
    </div>
  )
}
