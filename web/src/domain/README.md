# Domain Services

Pure TypeScript business logic layer. Framework-agnostic classes that sit between the UI and the service layer (`DbService`, `BackendService`, `StorageService`).

## Architecture

Each domain is a plain class that receives its dependencies via constructor injection. No framework coupling — domains can be unit-tested without React. State updates flow out through callbacks rather than direct state access.

All domains are re-exported from `index.ts` as a barrel.

## Domains

| Class                     | Responsibility                                                                                                                                                                                                                                  |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TransactionDomain`       | Pure static utility: computes aggregations (accounts, categories, currencies) from a transaction list. Account balances are computed from `account_from`/`account_to` flows, excluding external accounts.                                    |
| `SyncDomain`              | Orchestrates local→remote sync; detects server-side DB resets via `transactionsUploadedAt` timestamp; manages offline status; fires `onLoadingChange` during network replication; provides `forceRefresh()` for full database reset and re-pull |
| `SettingsDomain`          | Reads category expansions and account properties directly from PouchDB (`DbService`)                                                                                                                                                            |
| `BudgetsDomain`           | Loads spending limits and currency configs independently from CouchDB; computes budget totals with multi-currency conversion; generates synthetic summary and total budget entries; writes budget item updates directly to CouchDB. Receives `externalAccountIds: Set<string>` to derive transaction types during filtering. |
| `TransactionFormDomain`   | Derives form options (categories, bucket IDs, payees) from aggregations and spending limits; validates and builds `TransactionDTO` with `account_from`/`account_to`/`bucket_from`/`bucket_to` fields mapped from form inputs; supports custom transaction type with free account/bucket selection. Receives `externalAccountIds: Set<string>` for type derivation. |
| `TransactionFilterDomain` | Filters transactions by multiple criteria (matching `account_from`/`account_to`); supports cross-layout (EN/RU keyboard) matching. Receives `externalAccountIds: Set<string>` for bucket-based filter logic.                                   |
| `ExportDomain`            | Fetches CSV from backend and triggers browser download                                                                                                                                                                                          |
| `AuthDomain`              | Login/logout; persists backend config in localStorage                                                                                                                                                                                           |

## Transaction Type Derivation

Types are derived from `account_from`/`account_to` and `bucket_from`/`bucket_to`:

- **Income**: `account_from` is external, `account_to` is internal, `bucket_to = 'default'`
- **Expense**: `account_to` is external, `account_from` is internal, `bucket_from = 'default'`
- **Transfer**: both accounts are internal, both buckets are `default`
- **Custom**: everything else (mixed buckets, both accounts internal, etc.)

External accounts are identified by the `external: true` flag in `cfg:account_properties` (not by a name prefix).

## Key Patterns

- **Dependency injection**: services passed to constructors, not imported as singletons
- **Callback-based output**: `SyncDomain` uses `SyncCallbacks` (`onOfflineChange`, `onTransactionsLoaded`, `onLoadingChange`) to push updates without coupling to Jotai or any state library
- **Static helpers**: `TransactionDomain.getAggregations()` is a pure static method usable without an instance
- **`externalAccountIds` threading**: The `externalAccountIdsAtom` (Jotai) is derived from `accountPropertiesAtom` and passed down to `BudgetsDomain.calculateBudgets`, `TransactionFilterDomain.filterTransactions`, `TransactionFormDomain` methods, and transaction-display utilities wherever type derivation is needed.
