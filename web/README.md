# Budgeting App Web 💰

A sophisticated personal finance application that works seamlessly online and offline. Track expenses, manage budgets, and gain insights into your spending patterns across multiple currencies and accounts.

## Architecture

**Offline-First Design**: Uses PouchDB for local storage with bidirectional sync to CouchDB. Full functionality works offline; changes sync automatically when online.

**Domain Services + Jotai Atoms Pattern**:

Clean separation between business logic and UI using a layered architecture:

```
React Components (UI)
    ↓ useAtom, domain.method()
Jotai Atoms (State)
    ↓ atom.set()
Domain Services (Business Logic)
    ↓ service.method()
Infrastructure Services (DB, API)
```

- **Infrastructure Layer** (`services/`): PouchDB wrapper, backend API client, typed localStorage, balance aggregation, React context for dependency injection
- **Domain Layer** (`domain/`): Pure TypeScript classes encapsulating all business logic with no React dependencies
- **State Layer** (`state/`): Jotai atoms holding transactions, sync status, settings config, and spending limits
- **Hooks Layer** (`hooks/`): React hooks that wire domain services to atoms, providing components with reactive state
- **Component Layer** (`components/`): Container components read atoms and call domain methods; presentational components handle pure rendering

**Key Technical Choices**:

- React 19 + TypeScript for type safety
- Jotai for centralized state management
- Domain-driven design isolates all business logic from UI
- Bulma CSS for responsive design
- react-virtualized for large transaction lists
- Service workers for PWA offline support

## Setup 🚀

### Local Development

```shell
cd web
yarn install
cp .env.example .env
yarn dev
```

### Docker Development

```shell
cd web
cp .env.example .env
docker-compose -f docker-compose.dev.yml up
```

## Production 🏗️

```shell
docker-compose up
```

## Development 💻

### Tech Stack

- **Framework**: React 19 + TypeScript (strict mode)
- **Styling**: Bulma CSS framework with styled-components for custom elements
- **Storage**: PouchDB (local) → CouchDB (remote sync)
- **State**: Jotai for global state, React hooks for local
- **Routing**: React Router v7
- **Build**: Vite with vite-plugin-pwa for service worker support
- **PWA**: Service workers via vite-plugin-pwa with Workbox

### Project Structure

```
src/
  state/              # Jotai atoms (reactive state holders)
  domain/             # Domain services (pure business logic)
  hooks/              # Domain adapter hooks
  services/           # Infrastructure (API, DB, Storage)
  components/
    App/              # Main app container with auth
    TransactionForm/  # Guided transaction entry
    Transactions/     # Transaction list with virtualization
    Budgets/          # Budget tracking and planning
    Home/             # Account dashboard
  types/              # TypeScript DTOs and interfaces
  utils/              # Date formatting, account coloring
```

### Development Workflow

```bash
yarn dev             # Dev server at :3000
yarn build           # Production build
yarn preview         # Preview production build
```

### Environment Variables

Create `.env` from `.env.example`:

```
REACT_APP_BACKEND_URL=http://localhost:8000
```

## License 📝

[MIT License](LICENSE)
