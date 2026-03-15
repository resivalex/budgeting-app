# App

Root component module — orchestrates authentication, service initialization, routing, and the main UI shell.

## Architecture

Three-level container pattern:

```
AppContainer
  └─ AuthorizedAppContainer
       └─ App (presentational)
```

**`AppContainer`** manages pre-auth lifecycle: reads persisted config from `localStorage`, instantiates `BackendService` and `DbService`, wraps the authenticated subtree in `ServiceProvider`.

**`AuthorizedAppContainer`** wires domain hooks and owns global interaction logic:

- `useTransactionsDomain` — local transaction list and aggregations
- `useSyncDomain` — CouchDB sync, offline detection, per-instance coordination via a `uuidv4` instance ID
- `useSettingsDomain` — app-wide settings loaded from PouchDB
- `ExportDomain` / `AuthDomain` — instantiated with `useMemo` to avoid recreation on re-render
- Implements two-phase transaction writes: db write first (sync layer), then local state update
- Wraps `App` in `RenderErrorBoundary` so that rendering failures don't kill the sync loop

**`App`** is a pure presentational shell: React Router `<Routes>`, layout structure, and prop-driven callbacks. No business logic.

**`RenderErrorBoundary`** isolates rendering crashes from the sync lifecycle:

- First failure: shows a spinner ("Синхронизация данных") and triggers a full data refresh (PouchDB reset + pull + settings reload)
- If the re-render still fails: shows an error screen ("Возникла ошибка") with scrollable technical details (type, message, stack trace)

## Key Patterns

- **Memoized account select components**: `LimitedAccountSelect` and `FullAccountSelect` are created via `useMemo` + `forwardRef` inside `AuthorizedAppContainer` so that account aggregation data is closed over rather than prop-drilled through routing boundaries.
- **Filter state**: Five filter fields (`account`, `payee`, `comment`, `category`, `budgetName`) live in `AuthorizedAppContainer` and are passed down to the transactions route.
- **Notifications**: `lastNotificationText` state drives a transient `<Notification>` toast after add/edit/delete.
