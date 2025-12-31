# Feature: Domain Services

## Overview

Pure TypeScript business logic layer providing framework-agnostic domain services for transactions, synchronization, and settings management with clear separation from UI concerns.

## Functionality

### TransactionDomain

- **Transaction Loading**: Retrieves all transactions from local database with automatic sorting by datetime
- **Transaction Creation**: Adds new transactions to local database with proper validation
- **Transaction Updates**: Modifies existing transactions with atomic replace operations
- **Transaction Deletion**: Removes transactions by ID with proper cleanup
- **Automatic Sorting**: Ensures transactions are always sorted in descending chronological order
- **No State Coupling**: Returns data without directly updating application state for clean separation

### SyncDomain

- **Local Database Pull**: Loads transactions from local PouchDB and notifies via callbacks
- **Remote Synchronization**: Orchestrates pull operations from remote backend with error handling
- **Database Reset Detection**: Compares local and remote timestamps to detect server-side data resets
- **Automatic Database Reset**: Destroys and recreates local database when remote reset is detected
- **Change Detection**: Identifies when remote changes exist and triggers local database updates
- **Offline Status Management**: Tracks connection status and updates sync state via callbacks
- **Push Operations**: Manages push to remote with error tracking for retry mechanisms
- **Transaction Persistence**: Provides transaction CRUD operations with automatic push triggers
- **Callback-Based Updates**: Uses callback pattern to decouple from specific state management solutions

### SettingsDomain

- **Category Expansions Loading**: Fetches category expansion mappings from backend with caching
- **Account Properties Loading**: Retrieves account visual properties with local storage persistence
- **Cache Management**: Stores fetched settings in localStorage for offline access
- **Cached Value Retrieval**: Provides methods to access cached settings without network calls
- **Error Recovery**: Gracefully handles network errors by falling back to cached values

## Technical Notes

- Pure TypeScript classes with no React dependencies for maximum testability
- Constructor dependency injection for BackendService, DbService, and StorageService
- Promise-based async/await patterns for all asynchronous operations
- Callback interfaces for state updates enabling framework-agnostic integration
- Lodash integration for efficient sorting and data manipulation
- Proper error propagation allowing callers to handle exceptions
- Single Responsibility Principle - each domain handles one aspect of business logic
- Immutable data patterns - domains return new data rather than mutating state
- Type-safe interfaces using TypeScript generics and strict typing
- No side effects beyond service calls - all state changes via callbacks
- Easily unit testable without React rendering or state management mocking
