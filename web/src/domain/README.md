# Domain Services

Pure TypeScript business logic layer. Framework-agnostic classes between the UI and the service layer.

## Key Patterns

- **Dependency injection**: Services passed to constructors, not imported as singletons. Domains can be unit-tested without React.
- **Callback-based output**: `SyncDomain` uses `SyncCallbacks` (`onOfflineChange`, `onTransactionsLoaded`, `onLoadingChange`) to push updates without coupling to Jotai or any state library.
- **Static helpers**: `TransactionDomain.getAggregations()` is a pure static method usable without an instance.
- **`externalAccountIds` threading**: The `externalAccountIdsAtom` (Jotai) is derived from `accountPropertiesAtom` by checking `owner === 'external'` and threaded through `BudgetsDomain`, `TransactionFilterDomain`, `TransactionFormDomain`, and display utilities wherever type derivation is needed.

## Transaction Type Derivation

See [Domain PRD](./PRD.md) for the canonical derivation rules.
