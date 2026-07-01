import { useRef, useState, useEffect, useMemo } from 'react'
import { TransactionTile } from './Transaction'
import { TransactionDTO } from '@/types'
import { List, AutoSizer } from 'react-virtualized'
import TransactionInfoModal from './TransactionInfoModal'
import { convertToLocaleTime } from '@/utils'
import dayjs from 'dayjs'

interface Props {
  transactions: TransactionDTO[]
  focusedTransaction?: TransactionDTO
  scrollToTransactionId?: string
  onRemove: (id: string) => Promise<void>
  onEdit: (id: string) => void
  onFocus: (id: string) => void
  onUnfocus: () => void
}

export default function Transactions({
  transactions,
  focusedTransaction,
  scrollToTransactionId,
  onRemove,
  onEdit,
  onFocus,
  onUnfocus,
}: Props) {
  const [heights, setHeights] = useState<any>({})
  const listRef: any = useRef(null)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.recomputeRowHeights(0)
    }
  }, [transactions, heights])

  const hasDateHeaderMap = useMemo(() => {
    const headerMap: { [transactionId: string]: boolean } = {}
    let lastDate = 'There will be a fresher transaction date'
    transactions.forEach((t) => {
      const localDate = convertToLocaleTime(t.datetime)
      const currentDate = dayjs(localDate).startOf('day').toISOString()
      if (currentDate !== lastDate) {
        headerMap[t._id] = true
      }
      lastDate = currentDate
    })

    return headerMap
  }, [transactions])

  const [scrollConsumed, setScrollConsumed] = useState(false)

  const scrollToIndex = useMemo(() => {
    if (scrollConsumed || !scrollToTransactionId) return undefined
    const index = transactions.findIndex((t) => t._id === scrollToTransactionId)
    return index >= 0 ? index : undefined
  }, [scrollConsumed, scrollToTransactionId, transactions])

  useEffect(() => {
    // Rows measure their real height lazily (react-measure), so the first scroll uses 80px
    // estimates and lands on the wrong row. react-virtualized re-snaps to scrollToIndex on
    // every recomputeRowHeights, so keep it alive until heights stop changing, then release
    // so the user can scroll freely. ponytail: 300ms settle window, bump if tall rows drift.
    if (scrollConsumed || scrollToIndex === undefined) return
    const id = setTimeout(() => setScrollConsumed(true), 300)
    return () => clearTimeout(id)
  }, [scrollConsumed, scrollToIndex, heights])

  if (transactions.length === 0) {
    return <div className="box">Empty</div>
  }

  const rowRenderer = ({ index, key, style }: any) => {
    const transaction = transactions[index]
    return (
      <div key={key} style={style}>
        <TransactionTile
          key={index}
          t={transaction}
          hasDateHeader={hasDateHeaderMap[transaction._id]}
          onDimensionsChange={(dimensions: any) => {
            setHeights((prevHeights: any) => {
              return { ...prevHeights, [index]: dimensions.height }
            })
          }}
          onLongPress={() => {
            onFocus(transaction._id)
          }}
        />
      </div>
    )
  }

  const handleRemove = async (id: string) => {
    await onRemove(id)
    onUnfocus()
  }

  return (
    <>
      {/* @ts-ignore */}
      <AutoSizer>
        {({ height, width }: any) => (
          // @ts-ignore
          <List
            ref={listRef}
            height={height}
            rowCount={transactions.length}
            rowHeight={({ index }) => {
              if (heights[index]) {
                return heights[index]
              }
              return 80
            }}
            rowRenderer={rowRenderer}
            scrollToIndex={scrollToIndex}
            width={width}
          />
        )}
      </AutoSizer>
      {focusedTransaction && (
        <TransactionInfoModal
          transaction={focusedTransaction}
          onClose={() => onUnfocus()}
          onRemove={handleRemove}
          onEdit={onEdit}
        />
      )}
    </>
  )
}
