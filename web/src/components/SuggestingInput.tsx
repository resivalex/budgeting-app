import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'

// Transliteration mappings organized alphabetically
const rusToEngMap: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'e',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'h',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'sch',
  ъ: '',
  ы: 'y',
  ь: '',
  э: 'e',
  ю: 'yu',
  я: 'ya',
}

const engToRusMap: Record<string, string> = {
  a: 'а',
  b: 'б',
  c: 'ц',
  d: 'д',
  e: 'е',
  f: 'ф',
  g: 'г',
  h: 'х',
  i: 'и',
  j: 'ж',
  k: 'к',
  l: 'л',
  m: 'м',
  n: 'н',
  o: 'о',
  p: 'п',
  q: 'к',
  r: 'р',
  s: 'с',
  t: 'т',
  u: 'у',
  v: 'в',
  w: 'в',
  x: 'кс',
  y: 'й',
  z: 'з',
}

function transliterate(text: string, map: Record<string, string>): string {
  return text
    .toLowerCase()
    .split('')
    .map((char) => map[char] || char)
    .join('')
}

function matchesCrossLanguage(suggestion: string, searchText: string): boolean {
  if (!searchText) return true

  const suggestionLower = suggestion.toLowerCase()
  const searchLower = searchText.toLowerCase()

  // Direct match (same language)
  if (suggestionLower.includes(searchLower)) return true

  // Russian search text to English, check against suggestion
  const searchAsEng = transliterate(searchLower, rusToEngMap)
  if (suggestionLower.includes(searchAsEng)) return true

  // English search text to Russian, check against suggestion
  const searchAsRus = transliterate(searchLower, engToRusMap)
  if (suggestionLower.includes(searchAsRus)) return true

  // Transliterate suggestion and check cross-language matches
  const suggestionAsEng = transliterate(suggestionLower, rusToEngMap)
  const suggestionAsRus = transliterate(suggestionLower, engToRusMap)

  if (suggestionAsEng.includes(searchLower) || suggestionAsRus.includes(searchLower)) return true
  if (suggestionLower.includes(searchAsEng) || suggestionLower.includes(searchAsRus)) return true

  return false
}

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

const InputGroup = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
`

const Input = styled.input`
  flex: 1;
  height: 30px;
  box-sizing: border-box;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
`

const Suggestion = styled.div`
  padding: 10px 10px;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    background-color: #f1f1f1;
  }
`

const Suggestions = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  z-index: 1;
  background-color: white;
  border-radius: 5px;
  margin-top: 2px;
`

const ConfirmButton = styled.button`
  font-size: 20px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: 10px;
`

interface SuggestingInputProps {
  suggestions: string[]
  value: string
  onChange: (value: string) => void
  onConfirm: () => void
}

const SuggestingInput = forwardRef((props: SuggestingInputProps, ref) => {
  const { suggestions, value, onChange, onConfirm } = props
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [delayHideDropdown, setDelayHideDropdown] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useImperativeHandle(ref, () => ({
    focus: () => {
      if (inputRef.current) {
        inputRef.current.focus()
        setShowSuggestions(true)
      }
    },
  }))

  const filteredSuggestions = (() => {
    if (!value) {
      return suggestions
    }
    return suggestions.filter(
      (suggestion) => matchesCrossLanguage(suggestion, value) && suggestion !== value,
    )
  })()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    onChange(value)
  }

  const handleFocus = () => {
    setShowSuggestions(true)
  }

  const handleBlur = () => {
    if (!delayHideDropdown) {
      setTimeout(() => {
        setShowSuggestions(false)
      }, 150)
    } else {
      setDelayHideDropdown(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion)
    onConfirm()
    setDelayHideDropdown(true)
    setShowSuggestions(false)
  }

  return (
    <Wrapper ref={wrapperRef}>
      <InputGroup>
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <ConfirmButton onClick={onConfirm}>
          {/* @ts-ignore */}
          <FontAwesomeIcon icon={faCheckCircle} color={'rgb(50, 115, 220)'} />
        </ConfirmButton>
      </InputGroup>
      {showSuggestions && (
        <Suggestions>
          {filteredSuggestions.map((suggestion, index) => (
            <Suggestion key={index} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion}
            </Suggestion>
          ))}
        </Suggestions>
      )}
    </Wrapper>
  )
})

export default SuggestingInput
