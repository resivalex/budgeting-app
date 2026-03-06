# Feature: State Management (Jotai Atoms)

## Overview

Centralized reactive state management using Jotai atoms that provide a clean, type-safe interface for application-wide state access and updates without prop drilling.

## Functionality

### Transactions State (`transactionsAtom.ts`)

- **Transaction List**: Primary atom holding all transactions, sorted by datetime (newest first) on each update
- **Derived Aggregations**: Computed atom providing real-time aggregations (account details, categories, currencies, payees, comments) recalculated whenever transactions change

### Sync Status State (`syncStatusAtom.ts`)

- **Offline Status**: Boolean flag indicating whether the application has lost connection to the backend
- **Push Error Detection**: Tracks failed push operations for retry mechanisms and user feedback
- **First Pull Completion**: Tracks whether the initial data load has completed

### Configuration State (`configAtom.ts`)

- **Category Expansions**: Holds category expansion mappings for enhanced category display
- **Account Properties**: Stores per-account visual properties (colors)

### Spending Limits State (`spendingLimitsAtom.ts`)

- **Budget Configuration**: Holds spending limits with per-month and per-currency configurations
- **Month Currency Configs**: Stores currency conversion configurations for each budget month
