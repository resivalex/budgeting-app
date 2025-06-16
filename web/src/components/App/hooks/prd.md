# Feature: App Hooks

## Overview

A collection of specialized React hooks that provide core application functionality including data synchronization, transaction management, configuration loading, and interval-based operations for seamless offline-first budgeting app experience.

## Functionality

- **useTransactions Hook**: Comprehensive transaction state management with real-time aggregation of account details, categories, currencies, payees, and comments
- **useSyncService Hook**: Sophisticated offline-first synchronization system handling bidirectional data sync between local PouchDB and remote backend
- **useAccountProperties Hook**: Automatic loading and caching of account visual properties (colors) from backend to localStorage for persistent user preferences
- **useCategoryExpansions Hook**: Backend integration for loading category expansion mappings that allow extended category names for better organization
- **useInterval Hook**: Robust interval management with initial delay support, automatic cleanup, and dependency-based restart functionality

### Transaction Management:

- **Local State Management**: Maintains sorted transaction list with automatic datetime-based sorting (newest first)
- **Real-time Aggregations**: Dynamic calculation of account balances, category lists, currency options, and recent payees/comments
- **CRUD Operations**: Complete transaction lifecycle management (add, update, delete) with immediate local state updates
- **Optimistic Updates**: Instant UI updates followed by background synchronization for responsive user experience

### Synchronization System:

- **Offline-First Architecture**: Prioritizes local database operations with background sync to remote services
- **Intelligent Sync Strategy**: Automatic pull on startup, periodic sync intervals, and immediate push on data changes
- **Error Handling**: Robust error recovery with automatic retry mechanisms for failed push operations
- **Database Reset Logic**: Smart detection of server-side data resets with automatic local database reconstruction
- **Connection Status**: Real-time offline/online status tracking with appropriate user feedback

### Configuration Management:

- **Persistent Settings**: Automatic loading and caching of user preferences in localStorage
- **Backend Integration**: Seamless integration with BackendService for configuration retrieval
- **Session Persistence**: Maintains user preferences across browser sessions and app restarts

## Technical Notes

- Built with React hooks pattern using useEffect, useState, useCallback, and useRef for optimal performance
- Implements sophisticated PouchDB integration for offline-first data storage with CouchDB synchronization
- Uses lodash for efficient data sorting and manipulation operations
- Features automatic cleanup mechanisms for intervals and timeouts to prevent memory leaks
- Implements proper dependency arrays for useEffect optimization and preventing unnecessary re-renders
- Uses TypeScript interfaces for type-safe data handling across all hooks
- Implements debounced and throttled operations for performance optimization during frequent updates
- Features error boundary integration with proper error state management
- Uses TransactionAggregator service for complex data aggregation and analysis
- Implements proper async/await patterns with error handling for all backend operations
- Features configurable timing parameters for sync intervals and retry mechanisms
- Uses instance-based dependency tracking for proper hook lifecycle management in multi-instance scenarios
- Implements proper cleanup in useEffect return functions for robust memory management
