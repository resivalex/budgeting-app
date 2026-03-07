import { useRef, useState, useEffect } from 'react'
import { reactSelectSmallStyles } from '@/utils'
import Select from 'react-select'
import styled from 'styled-components'
import { useIsMobile } from '@/hooks'
import { OverlayOption, OverlayWithSearch } from '@/components/FullscreenOverlay'

interface Props {
  category: string
  isExpanded: boolean
  onCategoryChange: (category: string) => void
  onExpand: () => void
  onComplete: () => void
  onCollapse: () => void
  categoryOptions: { value: string; label: string }[]
}

const CategoryLabel = styled.div<{ $isExpanded: boolean }>`
  font-size: 1rem;
  color: ${(props) => (props.$isExpanded ? 'black' : 'gray')};
`

const SelectedCategory = styled.div`
  font-size: 0.8rem;
`

export default function Category({
  category,
  isExpanded,
  onCategoryChange,
  onExpand,
  onComplete,
  onCollapse,
  categoryOptions,
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

  const selectedOption = categoryOptions.find((option) => option.value === category)

  const handleCategoryChange = (value: string) => {
    onCategoryChange(value)
    onComplete()
  }

  if (!isExpanded) {
    return (
      <div className="field" onClick={onExpand}>
        <CategoryLabel className="is-size-7" $isExpanded={isExpanded}>
          Категория
        </CategoryLabel>
        <SelectedCategory>{selectedOption ? selectedOption.label : '(пусто)'}</SelectedCategory>
      </div>
    )
  }

  if (isMobile) {
    const filteredOptions = search
      ? categoryOptions.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
      : categoryOptions

    return (
      <OverlayWithSearch
        title="Категория"
        onClose={onCollapse}
        searchRef={searchInputRef}
        searchValue={search}
        onSearchChange={setSearch}
      >
        {filteredOptions.map((option) => (
          <OverlayOption
            key={option.value}
            $isSelected={option.value === category}
            onClick={() => handleCategoryChange(option.value)}
          >
            {option.label}
          </OverlayOption>
        ))}
      </OverlayWithSearch>
    )
  }

  return (
    <div className="field">
      <CategoryLabel className="is-size-7" $isExpanded={isExpanded}>
        Категория
      </CategoryLabel>
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
            handleCategoryChange(selectedOption.value)
          }}
          options={categoryOptions}
          styles={reactSelectSmallStyles}
          placeholder="Выберите из списка..."
        />
      </div>
    </div>
  )
}
