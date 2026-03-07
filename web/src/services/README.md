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

## Key Design Decisions

### `BackendService`

Authenticated HTTP client targeting a configurable backend URL. API responses are normalized to camelCase DTOs before returning to callers.

### `DbService`

PouchDB-based local store synced with a remote CouchDB instance. Sync is intentionally one-shot (not live) to give the app explicit control over when data is pushed or pulled. `pushChanges` replicates local → remote; `pullChanges` replicates remote → local. Database reset destroys and recreates the local instance to mirror a server-side data reset. `DbService` has no UI dependencies — it is a pure data service with no knowledge of React state or loading indicators.

### `StorageService`

Typed wrapper over `localStorage`. The `StorageKeys` type map enforces correct key–value types at compile time.

### `ServiceContext`

React Context distributing `{ backendService, dbService, storageService }` to the component tree. `useServices()` throws if called outside the provider to surface misconfiguration early.

### `TransactionAggregator`

Pure, synchronous computation over a transaction snapshot. Designed as a standalone class (not a service) because it has no side effects and requires no async operations.
