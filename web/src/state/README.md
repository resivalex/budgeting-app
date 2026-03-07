# State Management

Jotai atoms for application-wide reactive state. All atoms are exported from `index.ts`.

## Atoms

### `transactionsAtom` / `rawTransactionsAtom` / `transactionsAggregationsAtom`

`transactionsAtom` is a writable atom that auto-sorts by `datetime` descending on write; the raw storage is `rawTransactionsAtom`. `transactionsAggregationsAtom` is a read-only derived atom that recomputes aggregations (accounts, categories, currencies, payees, comments) via `TransactionDomain.getAggregations` whenever transactions change.

### `syncStatusAtom` / `isOfflineAtom`

`syncStatusAtom` holds `{ isOffline }`. `isOfflineAtom` is a derived read-only shortcut.

### `configAtom` / `categoryExpansionsAtom` / `accountPropertiesAtom`

`configAtom` holds `{ categoryExpansions, accountProperties }`. The two slice atoms provide focused read/write access to each field while keeping the base atom consistent.

### `spendingLimitsAtom`

Plain atom holding the full `SpendingLimitsDTO` (`limits[]` + `monthCurrencyConfigs[]`).

## Pattern

- **Base + derived**: heavy data lives in a raw atom; consumers use a writable wrapper or derived read-only atom.
- **Slice atoms**: sub-fields of a composite atom are exposed as independent writable atoms that write back to the parent, avoiding prop-drilling without duplicating state.
