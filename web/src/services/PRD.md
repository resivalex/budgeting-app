# Feature: Services

## Overview

Infrastructure service layer providing backend API communication, local database management, data aggregation, and typed configuration storage for the offline-first budgeting application.

## Functionality

### StorageService

- **Typed Configuration Storage**: Persists user config (backendUrl, backendToken, dbUrl), category expansions, account properties, and the `transactionsUploadedAt` timestamp in localStorage
- **JSON Serialization**: Automatic serialization/deserialization for complex objects
- **Null-Safe Access**: Returns `null` for missing keys instead of throwing

### BackendService

- **Authentication**: Login with backend URL and password; subsequent requests use bearer token authorization
- **Settings Retrieval**: Fetches `transactionsUploadedAt` timestamp for database reset detection
- **Spending Limits Management**: Retrieves and updates budget configuration with multi-currency support
- **Category Expansions**: Loads category display name mappings from backend
- **Account Properties**: Retrieves per-account visual properties (colors)
- **CSV Export**: Requests transaction CSV from backend for download

### DbService

- **Offline-First Storage**: Local PouchDB database with automatic CouchDB replication
- **Transaction CRUD**: Create, read, update, and delete transactions with local persistence
- **Bidirectional Sync**: Push/pull synchronization with the remote CouchDB database
- **Database Reset**: Destroys and recreates local database when a server-side reset is detected
- **Change Detection**: Detects remote changes to trigger UI updates

### TransactionAggregator

- **Account Balances**: Calculates current balance per account across all transactions, handling income, expense, and transfer types without double-counting transfers
- **Category Analytics**: Sorts categories by frequency of use for smart suggestions
- **Currency Detection**: Identifies all currencies used in transactions
- **Payee Suggestions**: Returns recent payees filtered by category for autocomplete
- **Comment Suggestions**: Provides historical comments for autocomplete

### ServiceContext

- **Dependency Injection**: React Context providing service instances (`BackendService`, `DbService`, `StorageService`) to the component tree
- **`useServices` Hook**: Type-safe access to all services from any component within the provider
