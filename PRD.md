# Feature: Personal Budgeting Application

## Overview

A comprehensive offline-first personal financial management application providing sophisticated budget tracking, multi-currency support, and intelligent transaction management with real-time synchronization, automated backups, and a modern responsive web interface designed for complete financial control and analysis.

## Data Flows

- **Transaction Data**: Lives in CouchDB and syncs bidirectionally with the browser's local storage for offline-first capability. The backend reads transactions from CouchDB for exports and backups.
- **Configuration Data**: Spending limits, account properties, and category expansions are stored as `cfg:`-prefixed documents in the same `budgeting` database, synced to the frontend alongside transactions.
- **Backups**: Automated daily backups (transactions + settings) to Google Drive. Manual backup and restore are also available.

## Functionality

### Personal Financial Management

- **Comprehensive Transaction Tracking**: Complete financial transaction management with intelligent categorization, explicit budget assignment per transaction, multi-currency support, and historical analysis
- **Advanced Budget Planning**: Sophisticated budget creation and tracking with named budgets, spending limits, color-coded categories, and real-time progress monitoring. Budget calculation uses the transaction's `budget_name` field as the single source of truth
- **Multi-Account Management**: Unified management of multiple financial accounts with color-coded identification and real-time balance tracking
- **Multi-Currency Operations**: Full support for multiple currencies with configurable exchange rates and automatic conversion across all features
- **Spending Analytics**: Account balance dashboards and budget spending analysis by month

### Offline-First Experience

- **Complete Offline Functionality**: Full application functionality without internet connection including transaction entry, budget management, and data analysis
- **Automatic Synchronization**: Seamless bidirectional data sync when connectivity is restored with intelligent conflict resolution
- **Progressive Web App**: Modern PWA capabilities with responsive design, touch-friendly interactions, and mobile optimization
- **Real-time Updates**: Instant UI updates with optimistic updates and background synchronization for responsive user experience
- **Data Persistence**: Robust local data storage ensuring no data loss during offline periods

### Data Management & Security

- **Automated Cloud Backup**: Scheduled daily backups to Google Drive with manual trigger capabilities for comprehensive data protection
- **Export Capabilities**: CSV data export functionality (including budget_name) with account IDs resolved to human-readable names for backup, migration, and external system integration
- **Secure Authentication**: Password-based authentication with token management and automatic session restoration
- **Data Integrity**: Comprehensive data validation, error handling, and consistency checks across all operations
- **Privacy Protection**: Local-first data architecture with optional cloud synchronization ensuring user data privacy

### User Experience & Interface

- **Intuitive Transaction Entry**: Step-by-step guided transaction creation with automatic budget assignment from category, manual budget name selection, and intelligent suggestions based on historical patterns
- **Advanced Search & Filtering**: Powerful search capabilities with cross-language support and sophisticated filtering options
- **Visual Budget Tracking**: Color-coded budget progress indicators with multi-segment progress bars and expectation ratios
- **Responsive Design**: Mobile-first interface with adaptive layouts optimized for all device sizes and orientations
- **Touch-Friendly Interactions**: Long-press detection, swipe gestures, and optimized touch targets for enhanced mobile experience

### Integration

- **Google Drive Backup**: Automated daily backup uploads to Google Drive; manual trigger also available
- **CSV Export**: Full-fidelity export including `budget_name` field with account IDs resolved to names, compatible with external tools
- **Web-Based**: Accessible on desktop and mobile browsers without installation

## Component References

- **[Web Frontend](./web/PRD.md)**: User interface and offline-first experience
- **[Backend API](./backend/PRD.md)**: Data management, authentication, and cloud integration
- **[Database](./db/PRD.md)**: Transaction storage and synchronization
