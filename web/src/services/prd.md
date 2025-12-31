# Feature: Services

## Overview

A comprehensive service layer providing backend communication, local database management, and data aggregation capabilities for the offline-first budgeting application with robust error handling and synchronization mechanisms.

## Functionality

### StorageService

- **Typed LocalStorage Access**: Type-safe abstraction over localStorage with compile-time key validation
- **JSON Serialization**: Automatic JSON serialization/deserialization for complex objects
- **Configuration Storage**: Manages config object (backendUrl, backendToken, dbUrl)
- **Transaction Timestamp Storage**: Stores transactionsUploadedAt for database reset detection
- **Category Expansions Cache**: Persists category expansion mappings for offline access
- **Account Properties Cache**: Stores account visual properties for consistent theming
- **Null-Safe Operations**: Graceful handling of missing keys returning null instead of throwing
- **Remove Operations**: Clean key removal with proper cleanup
- **Existence Checking**: Has method for checking key presence without reading values

### BackendService

- **Authentication Management**: Secure login with password-based authentication and token-based authorization for subsequent requests
- **Configuration Retrieval**: Dynamic configuration loading including backend tokens and database URLs for service initialization
- **Settings Synchronization**: Backend settings retrieval for database reset detection and synchronization state management
- **Spending Limits Management**: Complete budget configuration retrieval and modification with multi-currency support and monthly variations
- **Category Expansions**: Loading of category expansion mappings for enhanced category display names and organization
- **Account Properties**: Retrieval of account visual properties (colors) for consistent UI theming across the application
- **Data Export**: CSV export generation with proper formatting for backup and external analysis
- **Budget Item Updates**: Real-time budget limit modifications with immediate backend persistence
- **Error Handling**: Comprehensive error management with user-friendly error messages and proper exception handling

### DbService

- **Offline-First Architecture**: Local PouchDB database with automatic CouchDB synchronization for seamless offline operation
- **Database Lifecycle**: Complete database management including initialization, reset, and cleanup operations
- **Transaction CRUD**: Full transaction lifecycle management (create, read, update, delete) with local persistence
- **Bidirectional Sync**: Sophisticated push/pull synchronization with conflict resolution and change detection
- **Loading State Management**: Real-time loading indicators during sync operations for optimal user experience
- **Change Detection**: Intelligent detection of remote changes for efficient synchronization and UI updates
- **Error Recovery**: Robust error handling with automatic retry mechanisms for failed sync operations
- **Database Reset Logic**: Smart handling of server-side data resets with automatic local database reconstruction

### TransactionAggregator

- **Account Balance Calculation**: Dynamic calculation of account balances across all transactions with multi-currency support
- **Balance Change Processing**: Sophisticated handling of different transaction types (income, expense, transfer) for accurate balance computation
- **Category Analytics**: Frequency-based category sorting for intelligent suggestions and usage patterns
- **Currency Management**: Automatic currency detection and sorting for multi-currency transaction support
- **Payee Intelligence**: Recent payee tracking with category-specific suggestions for enhanced user experience
- **Comment Suggestions**: Historical comment analysis for intelligent autocomplete and suggestion systems
- **Transfer Logic**: Special handling of transfer transactions to prevent double-counting in balance calculations
- **Data Sorting**: Efficient sorting algorithms for optimal performance with large transaction datasets
- **Deduplication**: Smart deduplication logic for suggestions and analytics to maintain data quality

## Technical Notes

- **BackendService**: Built with axios for HTTP communication with proper authentication headers and error handling
- **DbService**: Implements PouchDB for local storage with CouchDB replication for offline-first architecture
- **TransactionAggregator**: Uses lodash for efficient data manipulation and sorting operations
- **Type Safety**: Comprehensive TypeScript interfaces for all service methods and data structures
- **Promise-Based Architecture**: Consistent async/await patterns for all asynchronous operations
- **Error Boundary Integration**: Proper error propagation and handling for robust application stability
- **Memory Management**: Efficient data processing algorithms to handle large transaction datasets
- **Performance Optimization**: Memoization and caching strategies for frequently accessed data
- **Configuration-Driven**: Dynamic service initialization based on user configuration and environment
- **Replication Strategy**: Sophisticated PouchDB replication with live sync capabilities and conflict resolution
- **Bearer Token Authentication**: Secure token-based authentication for all backend communications
- **Blob Handling**: Proper binary data handling for CSV export functionality
- **Currency Validation**: Cross-transaction currency consistency checking and validation
- **Change Tracking**: Event-based change detection for real-time UI updates and synchronization
