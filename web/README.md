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

**Infrastructure Layer** (`services/`):

- `DbService`: PouchDB operations (CRUD, sync, bulk updates)
- `BackendService`: API communication for configuration and exports
- `StorageService`: Typed localStorage abstraction
- `TransactionAggregator`: Balance calculations and suggestions
- `ServiceContext`: React context for dependency injection (`ServiceProvider`, `useServices`)

**Domain Layer** (`domain/`):

Pure TypeScript classes with no React dependencies:

- `TransactionDomain`: Transaction CRUD business logic + aggregations
- `SyncDomain`: Sync orchestration (pull/push, database reset)
- `SettingsDomain`: Settings loading and caching
- `BudgetsDomain`: Budget calculations by `budget_name`, currency conversion, month filtering
- `TransactionFormDomain`: Form validation, category extensions, suggestions, budget name lookup
- `TransactionFilterDomain`: Transaction filtering with cross-language matching
- `ExportDomain`: CSV export with blob handling
- `AuthDomain`: Login, logout, and session management

**State Layer** (`state/`):

Jotai atoms for centralized reactive state:

- `transactionsAtom`: Transaction list + derived aggregations
- `syncStatusAtom`: Sync state (offline, errors)
- `configAtom`: Settings (categoryExpansions, accountProperties)
- `spendingLimitsAtom`: Budget limits and currency configurations

**Hooks Layer** (`hooks/`):

React hooks that wire domains to atoms:

- `useTransactionsDomain`: Transaction state management
- `useSyncDomain`: Sync lifecycle management
- `useSettingsDomain`: Settings loading
- `useBudgetsDomain`: Budget calculations and month selection
- `useTransactionFormDomain`: Form data with category options and budget name options
- `useColoredAccounts`: Account coloring from atoms

**Component Structure**:

- Container components (`*Container.tsx`): Read atoms, call domain methods, render UI
- Presentational components: Pure UI rendering
- Path aliases via `@/` for clean imports

**Key Technical Choices**:

- React 19 + TypeScript for type safety
- Jotai for centralized state management
- Domain-driven design for business logic
- Bulma CSS for responsive design
- react-virtualized for large transaction lists
- Service workers for PWA offline support

## Setup 🚀

### Local Development

```shell
cd web
yarn install
cp .env.example .env
yarn start
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
- **Build**: Create React App with custom webpack config
- **PWA**: Service workers via `serviceWorkerRegistration.ts`

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
yarn start          # Dev server at :3000
yarn build          # Production build
yarn test           # Run tests
```

### Environment Variables

Create `.env` from `.env.example`:

```
REACT_APP_BACKEND_URL=http://localhost:8000
```

## License 📝

[MIT License](LICENSE)
