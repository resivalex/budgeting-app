import { useImperativeHandle, forwardRef, useRef, MutableRefObject, useState } from 'react'
import Select from 'react-select'
import { convertCurrencyCodeToSymbol, reactSelectColorStyles, formatFinancialAmount } from '@/utils'
import { useColoredAccounts } from '@/hooks'

const ColoredAccountSelect = forwardRef(
  (
    {
      value,
      onChange,
      availableAccountNames,
      emptyOption,
    }: {
      value: string
      onChange: (value: string) => void
      availableAccountNames: string[]
      emptyOption: string | null
    },
    ref,
  ) => {
    const [menuIsOpen, setMenuOpen] = useState(false)
    const coloredAccounts = useColoredAccounts()
    const availableColoredAccounts = coloredAccounts.filter((a) =>
      availableAccountNames.includes(a.account),
    )
    const emptyOptions = emptyOption ? [{ value: '', label: emptyOption, color: '#ffffff' }] : []
    const accountOptions = availableColoredAccounts.map((a) => ({
      value: a.account,
      label: `${formatFinancialAmount(a.balance)} ${convertCurrencyCodeToSymbol(a.currency)} | ${
        a.name
      }`,
      color: a.color,
    }))
    const options = [...emptyOptions, ...accountOptions]

    const selectRef: MutableRefObject<any> = useRef(null)

    useImperativeHandle(ref, () => ({
      focus: () => {
        if (selectRef.current) {
          selectRef.current.focus()
          setMenuOpen(true)
        }
      },
    }))

    return (
      // @ts-ignore
      <Select
        ref={selectRef}
        menuIsOpen={menuIsOpen}
        onMenuOpen={() => setMenuOpen(true)}
        onMenuClose={() => setMenuOpen(false)}
        className="basic-single"
        classNamePrefix="select"
        value={options.find((option) => option.value === value) || null}
        // @ts-ignore
        onChange={(selectedOption) => {
          if (!selectedOption) return
          onChange(selectedOption.value)
        }}
        options={options}
        isSearchable={false}
        placeholder="Выберите из списка..."
        styles={reactSelectColorStyles}
      />
    )
  },
)

export default ColoredAccountSelect
