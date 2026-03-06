# Services

Infrastructure layer providing API communication, local database management, typed local storage, and transaction aggregation.

## Architecture

Services are instantiated at the app root and injected via `ServiceContext` / `ServiceProvider`. Components access them through the `useServices()` hook.

```
ServiceProvider
  ├── BackendService   — axios wrapper for REST API
  ├── DbService        — PouchDB local ↔ CouchDB remote
  └── StorageService   — typed localStorage wrapper (created inside provider)
```

`TransactionAggregator` is a standalone computation class, not a service — it receives a `TransactionDTO[]` snapshot and derives derived data synchronously.

## Key Classes

### `BackendService`

Wraps `axios` with a 5-second timeout and a `Bearer` token header. All requests target a configurable `backendUrl`. Snake_case API responses are mapped to camelCase DTOs before returning.

### `DbService`

Uses PouchDB locally (`budgeting` database) and connects to a remote CouchDB at `<dbUrl>/budgeting`. Sync is one-shot (not live): `pushChanges` replicates local → remote, `pullChanges` replicates remote → local. Database reset destroys and recreates the local PouchDB instance.

### `StorageService`

Generic typed wrapper over `localStorage`. The `StorageKeys` type map constrains both keys and their value types at compile time. Values that are not plain strings are JSON-serialized on write and deserialized on read.

### `ServiceContext`

React Context providing `{ backendService, dbService, storageService }`. `StorageService` is instantiated with `useMemo` inside the provider. `useServices()` throws if called outside the provider.

### `TransactionAggregator`

Pure computation helper. Derives account balances (handles income/expense/transfer without double-counting), category frequency ranking, currency list, and payee/comment suggestions from a transaction array.
