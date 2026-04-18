# Hooks

React hooks that bridge domain classes and Jotai atoms. Components stay declarative — all coordination with services and state atoms is encapsulated here.

## Key Patterns

**Stable callbacks** — `useCallback` prevents domain re-instantiation caused by referential inequality:

```ts
const onStatusChange = useCallback((status) => setSyncStatus(...), [setSyncStatus])
const syncDomain = useMemo(() => new SyncDomain(..., { onStatusChange }), [..., onStatusChange])
```

**Ref forwarding for timeouts** — `useSyncDomain` uses `useRef` to keep timeout callbacks pointing at the latest domain instance without restarting the pull cycle. The push retry interval reads `syncDomainRef.current.hasPushError` directly instead of routing through the atom.

**Sequential setTimeout for pull** — The pull loop uses sequential `setTimeout` (each pull schedules the next only after completing) to prevent pile-up under poor network conditions. Push operations use an `isPushing` guard flag in `SyncDomain` to skip concurrent pushes; unflushed local changes are picked up by the next attempt.

**Optimistic updates** — `useTransactionsDomain` updates the transactions atom immediately with no DB dependency; the actual DB write is handled by `useSyncDomain`.
