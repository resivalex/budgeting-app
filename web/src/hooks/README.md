# Hooks

React hooks that bridge domain classes and Jotai atoms, providing components with reactive business logic. Components stay declarative and free of service-level concerns — all coordination with `BackendService`, `DbService`, and state atoms is encapsulated here.

## Architecture

Each hook follows the same pattern:

1. Instantiate a domain class via `useMemo` (with injected services as dependencies)
2. Wire Jotai atom setters as callbacks passed into the domain
3. Manage side-effect lifecycles (`useEffect` with interval/timeout cleanup)
4. Return stable, memoized API surface to components

Services (`BackendService`, `DbService`, etc.) are injected as hook parameters — no global singletons.

## Hooks

| Hook                       | Domain Class            | Key Responsibility                                                                                  |
| -------------------------- | ----------------------- | --------------------------------------------------------------------------------------------------- |
| `useTransactionsDomain`    | —                       | Optimistic in-memory CRUD updates to transactions atom                                              |
| `useSyncDomain`            | `SyncDomain`            | Sequential pull scheduling, push guard, retry logic, sync status atom, loading state, force refresh |
| `useSettingsDomain`        | `SettingsDomain`        | Load category/account settings from PouchDB into atoms; exposes `refreshSettings` callback          |
| `useBudgetsDomain`         | `BudgetsDomain`         | Spending limits from CouchDB, budget calculations, month selection                                  |
| `useTransactionFormDomain` | `TransactionFormDomain` | Form options derived from atom aggregations                                                         |
| `useColoredAccounts`       | —                       | Merge account list with color properties from atoms                                                 |
| `useIsMobile`              | —                       | Responsive breakpoint detection via `matchMedia`                                                    |

## Key Patterns

**Stable callbacks** — `useCallback` prevents domain re-instantiation caused by referential inequality:

```ts
const onStatusChange = useCallback((status) => setSyncStatus(...), [setSyncStatus])
const syncDomain = useMemo(() => new SyncDomain(..., { onStatusChange }), [..., onStatusChange])
```

**Ref forwarding for timeouts** — `useSyncDomain` uses `useRef` to keep timeout callbacks pointing at the latest domain instance without restarting the pull cycle. The push retry interval reads `syncDomainRef.current.hasPushError` directly instead of routing through the atom.

**Concurrency control** — The pull loop uses sequential `setTimeout` (each pull schedules the next only after completing) to prevent pile-up under poor network conditions. Push operations use an `isPushing` guard flag in `SyncDomain` to skip concurrent pushes; any unflushed local changes are picked up by the next push attempt.

**Optimistic updates** — `useTransactionsDomain` updates the transactions atom immediately with no DB dependency; the actual DB write is handled by `useSyncDomain`.

## Exports

All hooks are re-exported from `index.ts` barrel for clean imports:

```ts
import { useSyncDomain, useTransactionsDomain } from '@/hooks'
```
