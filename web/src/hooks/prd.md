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
- **Automatic Sorting**: Leverages atom's automatic sorting for consistent transaction ordering
- **Service Memoization**: Prevents unnecessary domain recreations using useMemo

### useSyncDomain

- **Sync State Management**: Manages syncStatusAtom with offline status, push errors, and pull completion
- **Transactions Integration**: Updates transactionsAtom when sync pulls new data from server
- **SyncDomain Lifecycle**: Instantiates domain with BackendService, DbService, and StorageService
- **Callback Wiring**: Connects domain callbacks to atom updates for status and transaction changes
- **Automated Sync Intervals**: Manages pull and retry intervals with proper cleanup on unmount
- **First Pull Logic**: Ensures immediate first pull followed by regular interval pulls
- **Retry Mechanism**: Automatically retries failed push operations on interval
- **Instance Scoping**: Uses instanceId for multi-tab synchronization coordination
- **Ref-Based Updates**: Uses refs to avoid stale closures in interval callbacks
- **Proper Cleanup**: Clears all intervals and timeouts on component unmount

### useSettingsDomain

- **Settings Loading**: Loads categoryExpansions and accountProperties on mount
- **Atom Updates**: Updates configAtom with fetched settings data
- **Error Handling**: Falls back to cached values when network requests fail
- **SettingsDomain Creation**: Instantiates domain with BackendService and StorageService
- **Automatic Initialization**: Loads settings immediately on hook mount
- **Cache Fallback**: Uses cached values from localStorage when backend is unavailable
- **Independent Loading**: Handles categoryExpansions and accountProperties independently
- **Effect-Based Loading**: Uses useEffect for lifecycle-aware settings initialization

## Technical Notes

- Built with React hooks (useState, useEffect, useCallback, useMemo, useRef)
- Jotai integration via useAtom, useAtomValue, and useSetAtom
- Proper dependency arrays for all hooks preventing stale closures
- Memoization strategies using useMemo and useCallback for performance
- Ref pattern for accessing latest values in intervals without recreating them
- Type-safe with full TypeScript integration for all hook signatures
- Follows React best practices for custom hook composition
- Proper cleanup patterns for intervals, timeouts, and subscriptions
- Separation of concerns - hooks only wire, domains contain logic
- ReturnType<typeof setInterval> for proper interval typing
- Void operators for intentionally ignoring promises in fire-and-forget scenarios
- Error boundary compatible with proper error propagation
- Supports React's concurrent features and strict mode
