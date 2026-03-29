import Measure from 'react-measure'
import { convertToLocaleTime, deriveTransactionType, deriveBucketId } from '@/utils'
import { useLongPress, LongPressDetectEvents } from 'use-long-press'
import dayjs from 'dayjs'
import ruLocale from 'dayjs/locale/ru'
import { TransactionDTO } from '@/types'
import TransactionContent from './TransactionContent'
import { useAccountNameResolver, useBucketNameResolver } from '@/hooks'
import { useAtomValue } from 'jotai'
import { externalAccountIdsAtom } from '@/state'

dayjs.locale(ruLocale)

interface Props {
  t: TransactionDTO
  hasDateHeader?: boolean
  onDimensionsChange: any
  onLongPress: () => void
}

export default function TransactionTile({
  t,
  hasDateHeader,
  onDimensionsChange,
  onLongPress,
}: Props) {
  const resolveAccountName = useAccountNameResolver()
  const resolveBucketName = useBucketNameResolver()
  const externalAccountIds = useAtomValue(externalAccountIdsAtom)
  const longPressBind = useLongPress(onLongPress, {
    onFinish: onLongPress,
    threshold: 500,
    captureEvent: true,
    cancelOnMovement: true,
    detect: LongPressDetectEvents.BOTH,
  })

  return (
    // @ts-ignore
    <Measure
      bounds
      onResize={(contentRect: any) => {
        onDimensionsChange({
          width: contentRect.bounds?.width || 300,
          height: contentRect.bounds?.height || 100,
        })
      }}
    >
      {({ measureRef }: any) => {
        const datetimeString = convertToLocaleTime(t.datetime)
        const currentDate = dayjs(datetimeString)

        const formattedDate = currentDate.format('D MMMM YYYY, dddd')
        return (
          <div ref={measureRef}>
            {hasDateHeader && (
              <div className="has-text-weight-semibold py-1 px-3" style={{ background: '#f3f3f3' }}>
                {formattedDate}
              </div>
            )}
            <div {...longPressBind()} className="box m-0 is-flex">
              <TransactionContent
                category={t.category}
                payee={t.counterparty}
                comment={t.comment}
                type={deriveTransactionType(t, externalAccountIds)}
                amount={t.amount}
                currency={t.currency}
                localTime={datetimeString.split(' ')[1]}
                budgetName={(() => {
                  const bid = deriveBucketId(t, externalAccountIds)
                  return bid && bid !== 'default' ? resolveBucketName(bid) : ''
                })()}
                accountFrom={resolveAccountName(t.account_from)}
                accountTo={resolveAccountName(t.account_to)}
                bucketFrom={
                  t.bucket_from && t.bucket_from !== 'default'
                    ? resolveBucketName(t.bucket_from)
                    : ''
                }
                bucketTo={
                  t.bucket_to && t.bucket_to !== 'default' ? resolveBucketName(t.bucket_to) : ''
                }
              />
            </div>
          </div>
        )
      }}
    </Measure>
  )
}
