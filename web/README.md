# Budgeting App Web 💰

A sophisticated personal finance application that works seamlessly online and offline. Track expenses, manage budgets, and gain insights into your spending patterns across multiple currencies and accounts.

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

- **Frontend**: React 19 + TypeScript
- **Styling**: Bulma CSS with responsive design
- **Storage**: Offline-first architecture with real-time sync
- **PWA**: Full Progressive Web App capabilities

### Contributing

Create a branch, make changes, and submit a PR.

## License 📝

[MIT License](LICENSE)
