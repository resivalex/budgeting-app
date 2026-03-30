import { convertCurrencyCodeToSymbol, formatFinancialAmount } from '@/utils'

interface AccountBalance {
  account: string
  currency: string
  balance: number
  owner: string
}

interface BucketWithBalances {
  id: string
  name: string
  color: string
  ownerTotals: Record<string, number | null>
  balances: AccountBalance[]
}

interface LatestRate {
  currency: string
  rate: number
  date: string
}

interface Props {
  buckets: BucketWithBalances[]
  accountInfoMap: Map<string, { name: string; color: string; owner: string }>
  availableCurrencies: string[]
  mainCurrency: string
  onMainCurrencyChange: (currency: string) => void
  latestRates: LatestRate[]
}

export default function Buckets({
  buckets,
  accountInfoMap,
  availableCurrencies,
  mainCurrency,
  onMainCurrencyChange,
  latestRates,
}: Props) {
  const mainCurrencySymbol = convertCurrencyCodeToSymbol(mainCurrency)

  return (
    <div className="box py-0 px-2">
      <div className="py-2">
        <div className="field">
          <div className="control">
            <div className="select is-small">
              <select value={mainCurrency} onChange={(e) => onMainCurrencyChange(e.target.value)}>
                {availableCurrencies.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {latestRates.length > 0 && (
          <div className="mb-2">
            {latestRates.map((r) => (
              <div key={r.currency} className="is-size-7 has-text-grey">
                {convertCurrencyCodeToSymbol(r.currency)}/{mainCurrencySymbol}: {r.rate.toFixed(2)}{' '}
                <span className="has-text-grey-light">({r.date})</span>
              </div>
            ))}
          </div>
        )}
      </div>
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
              <div className="is-flex is-justify-content-space-between is-align-items-center pb-1">
                <span>{bucket.name}</span>
                {(() => {
                  const values = Object.values(bucket.ownerTotals)
                  const nonNullValues = values.filter((v): v is number => v != null)
                  if (nonNullValues.length === 0) return null
                  const total = nonNullValues.reduce((sum, v) => sum + v, 0)
                  return (
                    <span className="has-text-weight-semibold is-size-7">
                      {formatFinancialAmount(total)} {mainCurrencySymbol}
                    </span>
                  )
                })()}
              </div>
              {bucket.balances.length === 0 ? (
                <p className="has-text-grey is-size-7">Нет транзакций</p>
              ) : (
                <div>
                  {[...new Set(bucket.balances.map((b) => b.owner))]
                    .sort((a, b) => {
                      if (a === 'external') return 1
                      if (b === 'external') return -1
                      return a.localeCompare(b)
                    })
                    .map((owner) => {
                      const groupBalances = bucket.balances.filter((b) => b.owner === owner)
                      if (groupBalances.length === 0) return null
                      const groupTotal = bucket.ownerTotals[owner] ?? null
                      const displayName = owner.charAt(0).toUpperCase() + owner.slice(1)
                      return (
                        <div key={owner} className="mb-2">
                          <div className="is-flex is-justify-content-space-between is-align-items-center mb-1">
                            <span className="is-size-7 has-text-grey">{displayName}</span>
                            {groupTotal != null && (
                              <span className="is-size-7 has-text-grey">
                                {formatFinancialAmount(groupTotal)} {mainCurrencySymbol}
                              </span>
                            )}
                          </div>
                          {groupBalances.map((b) => {
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
