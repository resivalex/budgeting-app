import { useImperativeHandle, forwardRef, useRef, MutableRefObject, useState, useMemo } from 'react'
import Select from 'react-select'
import { convertCurrencyCodeToSymbol, reactSelectColorStyles, formatFinancialAmount } from '@/utils'
import { useColoredAccounts } from '@/hooks'
import { useAtomValue } from 'jotai'
import { accountPropertiesAtom } from '@/state'

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
    const accountProperties = useAtomValue(accountPropertiesAtom)

    const allColoredAccounts = useMemo(() => {
      const externalAccounts = (accountProperties?.accounts ?? [])
        .filter((a) => a.external)
        .map((a) => ({
          account: a.id,
          name: a.name,
          currency: a.currency,
          balance: 0,
          color: a.color,
        }))
      return [...coloredAccounts, ...externalAccounts]
    }, [coloredAccounts, accountProperties])

    const availableColoredAccounts = allColoredAccounts.filter((a) =>
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
