# App

Root component module — orchestrates authentication, service initialization, routing, and the main UI shell.

## Three-Level Container Pattern

```
AppContainer → AuthorizedAppContainer → App (presentational)
```

**Why three levels**: `AppContainer` handles pre-auth lifecycle (reading persisted config, instantiating services, wrapping in `ServiceProvider`). `AuthorizedAppContainer` wires all domain hooks and owns global interaction logic (two-phase transaction writes: DB write first via sync layer, then local state update). `App` is a pure presentational shell (routes + layout + callbacks). This separation keeps auth concerns, business orchestration, and rendering cleanly isolated.

**`RenderErrorBoundary`** wraps the presentational `App` so rendering crashes don't kill the sync loop. First failure triggers a full data refresh (PouchDB reset + pull + settings reload). Persistent failure shows an error screen with technical details.

## Key Patterns

- **Memoized account selects**: `LimitedAccountSelect` and `FullAccountSelect` are created via `useMemo` + `forwardRef` inside `AuthorizedAppContainer` so that account aggregation data is closed over rather than prop-drilled through routing boundaries.
- **Filter state**: Five filter fields (`account`, `payee`, `comment`, `category`, `bucketId`) live in `AuthorizedAppContainer` and are passed down to the transactions route.
- **Notifications**: `lastNotificationText` state drives a transient toast after add/edit/delete.
