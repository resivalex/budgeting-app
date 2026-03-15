# Domain Services

Pure TypeScript business logic layer. Framework-agnostic classes that sit between the UI and the service layer (`DbService`, `BackendService`, `StorageService`).

## Architecture

Each domain is a plain class that receives its dependencies via constructor injection. No framework coupling — domains can be unit-tested without React. State updates flow out through callbacks rather than direct state access.

All domains are re-exported from `index.ts` as a barrel.

## Domains

| Class                     | Responsibility                                                                                                                                                                                                                                  |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TransactionDomain`       | Pure static utility: computes aggregations (accounts, categories, currencies) from a transaction list                                                                                                                                           |
| `SyncDomain`              | Orchestrates local→remote sync; detects server-side DB resets via `transactionsUploadedAt` timestamp; manages offline status; fires `onLoadingChange` during network replication; provides `forceRefresh()` for full database reset and re-pull |
| `SettingsDomain`          | Reads category expansions and account properties directly from PouchDB (`DbService`)                                                                                                                                                            |
| `BudgetsDomain`           | Loads spending limits; computes budget totals with multi-currency conversion; generates synthetic summary and total budget entries                                                                                                              |
| `TransactionFormDomain`   | Derives form options (categories, budget names, payees) from aggregations and spending limits; validates and builds `TransactionDTO`                                                                                                            |
| `TransactionFilterDomain` | Filters transactions by multiple criteria; supports cross-layout (EN/RU keyboard) matching                                                                                                                                                      |
| `ExportDomain`            | Fetches CSV from backend and triggers browser download                                                                                                                                                                                          |
| `AuthDomain`              | Login/logout; persists backend config in localStorage                                                                                                                                                                                           |

## Key Patterns

- **Dependency injection**: services passed to constructors, not imported as singletons
- **Callback-based output**: `SyncDomain` uses `SyncCallbacks` (`onOfflineChange`, `onTransactionsLoaded`, `onLoadingChange`) to push updates without coupling to Jotai or any state library
- **Static helpers**: `TransactionDomain.getAggregations()` is a pure static method usable without an instance
