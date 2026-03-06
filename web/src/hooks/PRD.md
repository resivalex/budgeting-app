# Feature: Domain Hooks

## Overview

React hooks that bridge domain services and Jotai atoms, managing lifecycle, orchestrating service calls, and wiring business logic to reactive state for clean component integration.

## Functionality

### useTransactionsDomain

- **Atom Integration**: Provides read/write access to transactionsAtom and read-only access to aggregations
- **TransactionDomain Instantiation**: Creates and memoizes domain instance with DbService dependency
- **Transaction Loading**: Fetches transactions from domain and updates atom state
- **Local State Updates**: Provides add/update/delete methods that update atoms without DB operations
- **Optimistic Updates**: Immediately updates UI state while DB operations happen asynchronously

### useSyncDomain

- **Sync State Management**: Manages syncStatusAtom with offline status, push errors, and pull completion
- **Transactions Integration**: Updates transactionsAtom when sync pulls new data from server
- **Automated Sync Intervals**: Manages pull and retry intervals with proper cleanup on unmount
- **First Pull Logic**: Ensures immediate first pull followed by regular interval pulls
- **Retry Mechanism**: Automatically retries failed push operations on interval
- **Instance Scoping**: Uses instanceId for multi-tab synchronization coordination

### useSettingsDomain

- **Settings Loading**: Loads categoryExpansions and accountProperties on mount
- **Atom Updates**: Updates configAtom with fetched settings data
- **Cache Fallback**: Uses cached values from localStorage when backend is unavailable

### useBudgetsDomain

- **Spending Limits State**: Manages spendingLimitsAtom for budget data
- **Budget Calculations**: Computes budgets from transactions, categories, and limits
- **Month Selection**: Tracks selected month with automatic latest-month selection
- **Expectation Ratio**: Calculates current month progress for visualization
- **Budget Updates**: Persists budget item changes and refreshes limits

### useTransactionFormDomain

- **Category Options**: Provides category options with expanded labels from atoms
- **Transaction Access**: Exposes transactions from atom for form initialization
- **Aggregation Data**: Provides currencies, payees, and comments from aggregations
- **Domain Instance**: Provides TransactionFormDomain for form logic methods

### useColoredAccounts

- **Account Coloring**: Merges account details with user-defined color properties from atoms
- Supports React's concurrent features and strict mode
