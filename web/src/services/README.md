# Services

Infrastructure layer providing API communication, local database management, typed local storage, and transaction aggregation.

## Key Design Decisions

**Service injection via React Context**: Services are instantiated at the app root and injected via `ServiceProvider` / `useServices()`. `useServices()` throws if called outside the provider to surface misconfiguration early.

**One-shot sync**: PouchDB↔CouchDB sync is intentionally one-shot (not live) to give the app explicit control over when data is pushed or pulled. `pushChanges` replicates local → remote; `pullChanges` replicates remote → local.

**Database reset handling**: When the server signals a data reset, `DbService` destroys and recreates the local PouchDB instance to mirror the server state.

**Settings storage convention**: Settings (category expansions, account properties, bucket definitions, spending limits, currency configs) use `cfg:`-prefixed keys in PouchDB, with snake_case ↔ camelCase mapping handled internally.

**Typed localStorage**: `StorageService` wraps `localStorage` with a `StorageKeys` type map enforcing correct key–value types at compile time.

**Aggregator as standalone class**: `TransactionAggregator` is a pure synchronous computation class (not a service) — it has no side effects, no async operations, and requires no injection.
