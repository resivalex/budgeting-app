import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import SuggestingInput from '@/components/SuggestingInput'
import { useIsMobile } from '@/hooks'
import { filterSuggestions } from '@/utils/en-ru-matching'
import { OverlayOption, OverlayWithSearch } from '@/components/FullscreenOverlay'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'

interface Props {
  comment: string
  isExpanded: boolean
  onCommentChange: (comment: string) => void
  onExpand: () => void
  onComplete: () => void
  onCollapse: () => void
  comments: string[]
}

const CommentLabel = styled.div<{ $isExpanded: boolean }>`
  font-size: 1rem;
  color: ${(props) => (props.$isExpanded ? 'black' : 'gray')};
`

const SelectedComment = styled.div`
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

export default function Comment({
  comment,
  isExpanded,
  onCommentChange,
  onExpand,
  onComplete,
  onCollapse,
  comments,
}: Props) {
  const inputRef = useRef<any>(null)
  const mobileInputRef = useRef<HTMLInputElement>(null)
  const isMobile = useIsMobile()
  const [localValue, setLocalValue] = useState(comment)

  useEffect(() => {
    if (isExpanded && !isMobile && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isExpanded, isMobile])

  useEffect(() => {
    if (isExpanded && isMobile) {
      setLocalValue(comment)
      setTimeout(() => mobileInputRef.current?.focus(), 100)
    }
  }, [isExpanded, isMobile, comment])

  if (!isExpanded) {
    return (
      <div className="field" onClick={onExpand}>
        <CommentLabel className="is-size-7" $isExpanded={isExpanded}>
          Комментарий
        </CommentLabel>
        <SelectedComment>{comment || '(пусто)'}</SelectedComment>
      </div>
    )
  }

  if (isMobile) {
    const filtered = filterSuggestions(comments, localValue)

    const handleConfirm = () => {
      onCommentChange(localValue)
      onComplete()
    }

    const handleSuggestionClick = (suggestion: string) => {
      onCommentChange(suggestion)
      onComplete()
    }

    return (
      <OverlayWithSearch
        title="Комментарий"
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
      <CommentLabel className="is-size-7" $isExpanded={isExpanded}>
        Комментарий
      </CommentLabel>
      <div className="control">
        <SuggestingInput
          ref={inputRef}
          suggestions={comments}
          value={comment}
          onChange={onCommentChange}
          onConfirm={onComplete}
        />
      </div>
    </div>
  )
}
