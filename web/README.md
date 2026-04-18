# Budgeting App Web

React PWA frontend. See [root README](../README.md) for full-stack setup and dev commands.

## Design Decisions

**Offline-First**: PouchDB for local storage with bidirectional sync to CouchDB. Full functionality works offline; changes sync automatically when online. Sync is intentionally one-shot (not live) to give the app explicit control over push/pull timing.

**Domain Services + Jotai Atoms**: Clean separation between business logic and UI. Domain classes are pure TypeScript with no React dependencies — they receive services via constructor injection and push state updates through callbacks. Jotai atoms hold reactive state; hooks wire domains to atoms. This allows unit-testing business logic without React and swapping state libraries without touching domain code.

**Key Technical Choices**:

- React 19 + TypeScript strict mode
- Jotai over Redux/Zustand: simpler atom-based model fits the app's independent state slices (transactions, sync, settings, budgets)
- react-virtualized for transaction lists — necessary for smooth scrolling with 1000+ rows
- Bulma CSS + styled-components for scoped overrides
- vite-plugin-pwa with Workbox for service worker generation

## Cache Strategy

`public/serve.json` configures HTTP cache headers for production (`serve`):

- **Hashed assets** (`assets/**`): `Cache-Control: public, max-age=31536000, immutable` — Vite content-hashes filenames so they change on every build
- **HTML & service worker files**: `Cache-Control: no-cache` — browsers always revalidate, ensuring they pick up the latest asset hashes after each deployment

## Environment Variables

Create `.env` from `.env.example`:

```
REACT_APP_BACKEND_URL=http://localhost:8000
```
