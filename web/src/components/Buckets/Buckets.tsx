import { convertCurrencyCodeToSymbol, formatFinancialAmount } from '@/utils'

interface AccountBalance {
  account: string
  currency: string
  balance: number
}

interface BucketWithBalances {
  id: string
  name: string
  color: string
  balances: AccountBalance[]
}

interface Props {
  buckets: BucketWithBalances[]
  accountInfoMap: Map<string, { name: string; color: string }>
}

export default function Buckets({ buckets, accountInfoMap }: Props) {
  return (
    <div className="box py-0 px-2">
      {buckets.length === 0 && (
        <div className="has-text-centered has-text-grey my-4">Нет назначений</div>
      )}
      {buckets.map((bucket) => (
        <div key={bucket.id} className="box my-2 py-0 pr-2 pl-0">
          <div className="is-flex is-align-content-stretch">
            <div
              className="is-align-self-stretch mr-2"
              style={{ backgroundColor: bucket.color, width: 5, borderBottomLeftRadius: 5 }}
            />
            <div className="is-flex-grow-1 py-2 px-1">
              <div className="pb-1">{bucket.name}</div>
              {bucket.balances.length === 0 ? (
                <p className="has-text-grey is-size-7">Нет транзакций</p>
              ) : (
                <div>
                  {bucket.balances.map((b) => {
                    const info = accountInfoMap.get(b.account)
                    const displayName = info?.name ?? b.account
                    const dotColor = info?.color ?? '#cccccc'
                    return (
                      <div
                        key={`${b.account}\0${b.currency}`}
                        className="is-flex is-align-items-center is-size-7 mb-1"
                      >
                        <span
                          style={{
                            display: 'inline-block',
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: dotColor,
                            flexShrink: 0,
                            marginRight: 6,
                          }}
                        />
                        <span>
                          {displayName}: {formatFinancialAmount(b.balance)}{' '}
                          {convertCurrencyCodeToSymbol(b.currency)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
