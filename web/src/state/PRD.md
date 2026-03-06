# Feature: State Management (Jotai Atoms)

## Overview

Centralized reactive state management using Jotai atoms that provide a clean, type-safe interface for application-wide state access and updates without prop drilling.

## Functionality

### Transactions State (`transactionsAtom.ts`)

- **Transaction List Management**: Primary atom holding sorted array of all transactions with automatic descending chronological ordering
- **Derived Aggregations**: Computed atom providing real-time aggregations (account details, categories, currencies, payees, comments) automatically recalculated when transactions change
- **Automatic Sorting**: Transactions automatically sorted by datetime in reverse order on every update
- **TransactionAggregator Integration**: Leverages TransactionAggregator service for consistent aggregation logic across the application

### Sync Status State (`syncStatusAtom.ts`)

- **Offline Status Tracking**: Boolean flag indicating whether the application has lost connection to the backend
- **Push Error Detection**: Tracks failed push operations for retry mechanisms and user feedback
- **First Pull Completion**: State tracking for initial data load completion to prevent duplicate pulls
- **Derived Offline Indicator**: Convenience atom providing direct access to offline status for UI components

### Configuration State (`configAtom.ts`)

- **Category Expansions Storage**: Holds category expansion mappings for enhanced category display throughout the application
- **Account Properties Management**: Stores account visual properties (colors) for consistent UI theming
- **Granular Atom Access**: Separate derived atoms for categoryExpansions and accountProperties enabling selective subscriptions
- **Null-Safe Defaults**: Proper initialization with null values for graceful handling of unloaded configuration

### Spending Limits State (`spendingLimitsAtom.ts`)

- **Budget Configuration Storage**: Holds spending limits with per-month and per-currency configurations
- **Month Currency Configs**: Stores currency conversion configurations for each budget month
- **Empty State Defaults**: Proper initialization with empty arrays for unloaded state
- **Reactive Updates**: Automatic UI updates when spending limits are fetched or modified

## Technical Notes

- Built with Jotai for atomic state management with minimal boilerplate
- Uses atom() for writable state and computed atoms for derived values
- Implements proper TypeScript interfaces for all state shapes
- Derived atoms automatically recompute when dependencies change
- Atoms can be read and written from any component without prop drilling
- State updates are batched and optimized by Jotai's internal mechanisms
- Supports atomic updates preventing race conditions
- Integrates seamlessly with React's concurrent features
- Provides DevTools integration for state inspection and debugging
