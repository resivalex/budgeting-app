# Budgeting App Web 💰

A sophisticated personal finance application that works seamlessly online and offline. Track expenses, manage budgets, and gain insights into your spending patterns across multiple currencies and accounts.

## Architecture

**Offline-First Design**: Uses PouchDB for local storage with bidirectional sync to CouchDB. Full functionality works offline; changes sync automatically when online.

**Service Layer Pattern**:

- `DbService`: Wraps PouchDB operations (CRUD, sync)
- `BackendService`: API communication for configuration and exports
- `TransactionAggregator`: Derives balances and suggestions from transaction data

**Component Structure**:

- Container components (`*Container.tsx`): Handle logic, state, and service calls
- Presentational components: Pure UI rendering
- Custom hooks (`hooks/`): Reusable state logic (sync, intervals, data fetching)

**State Management**:

- Jotai atoms for global state (spending limits, category expansions, account properties)
- React hooks for local component state
- Path aliases via `@/` for clean imports

**Key Technical Choices**:

- React 19 + TypeScript for type safety
- Bulma CSS for responsive design
- react-virtualized for large transaction lists
- Service workers for PWA offline support

## Key Features 🌟

### 💸 **Smart Transaction Management**

- Step-by-step transaction entry with intelligent suggestions
- Advanced filtering and search (including cross-language support)
- Real-time balance tracking across multiple accounts
- Support for income, expenses, and account transfers

### 📊 **Visual Budget Tracking**

- Color-coded budget categories with progress indicators
- Monthly budget planning with spending analytics
- Automatic budget calculations and alerts
- Visual progress bars showing spending vs. limits

### 🌍 **Multi-Currency Support**

- Full support for multiple currencies with automatic conversion
- Configurable exchange rates for accurate tracking
- Currency-aware budgets and reporting

### 📱 **Offline-First Design**

- Complete functionality without internet connection
- Automatic synchronization when online
- Touch-friendly mobile interface with responsive design

### 🎨 **Intelligent User Experience**

- Color-coded accounts for quick identification
- Smart suggestions based on your transaction history
- One-tap transaction entry with historical data
- Clean, intuitive interface optimized for daily use

### 📈 **Data & Analytics**

- CSV export for backup and external analysis
- Account balance dashboards
- Spending pattern analysis
- Transaction history with date grouping

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
  components/
    App/              # Main app container with auth
      hooks/          # Custom hooks (sync, intervals, etc.)
    TransactionForm/  # Guided transaction entry
    Transactions/     # Transaction list with virtualization
    Budgets/          # Budget tracking and planning
    Home/             # Account dashboard
  services/           # Backend API, DB, and aggregation
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
