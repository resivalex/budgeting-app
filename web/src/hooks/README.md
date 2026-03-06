# Hooks

React hooks that bridge domain classes and Jotai atoms, providing components with reactive business logic.

## Architecture

Each hook follows the same pattern:

1. Instantiate a domain class via `useMemo` (with injected services as dependencies)
2. Wire Jotai atom setters as callbacks passed into the domain
3. Manage side-effect lifecycles (`useEffect` with interval/timeout cleanup)
4. Return stable, memoized API surface to components

Services (`BackendService`, `DbService`, etc.) are injected as hook parameters — no global singletons.

## Hooks

| Hook                       | Domain Class            | Key Responsibility                                    |
| -------------------------- | ----------------------- | ----------------------------------------------------- |
| `useTransactionsDomain`    | `TransactionDomain`     | Load transactions, optimistic CRUD updates to atom    |
| `useSyncDomain`            | `SyncDomain`            | Pull/push intervals, retry logic, sync status atom    |
| `useSettingsDomain`        | —                       | Load category/account settings into `configAtom`      |
| `useBudgetsDomain`         | —                       | Spending limits, budget calculations, month selection |
| `useTransactionFormDomain` | `TransactionFormDomain` | Form options derived from atom aggregations           |
| `useColoredAccounts`       | —                       | Merge account list with color properties from atoms   |

## Key Patterns

**Stable callbacks** — `useCallback` prevents domain re-instantiation caused by referential inequality:

```ts
const onStatusChange = useCallback((status) => setSyncStatus(...), [setSyncStatus])
const syncDomain = useMemo(() => new SyncDomain(..., { onStatusChange }), [..., onStatusChange])
```

**Ref forwarding for intervals** — `useSyncDomain` uses `useRef` to keep interval callbacks pointing at the latest domain instance without restarting intervals.

**Optimistic updates** — `useTransactionsDomain` updates the atom immediately; the actual DB write is handled separately by the domain/sync layer.

## Exports

All hooks are re-exported from `index.ts` barrel for clean imports:

```ts
import { useSyncDomain, useTransactionsDomain } from '@/hooks'
```
