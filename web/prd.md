# Feature: Web Frontend

## Overview

A sophisticated React TypeScript frontend that provides a complete offline-first personal budgeting application with real-time synchronization, multi-currency support, and intelligent user experience design for comprehensive financial management.

## Functionality

### Core Application Experience

- **Progressive Web App**: Full PWA capabilities with offline functionality, responsive design, and mobile-optimized interactions
- **Offline-First Architecture**: Complete application functionality without internet connection, with automatic synchronization when connectivity is restored
- **Multi-Currency Financial Management**: Comprehensive support for multiple currencies with configurable exchange rates and automatic conversion across all features
- **Real-time Data Synchronization**: Bidirectional sync between local storage and remote backend with conflict resolution and intelligent change detection

### User Interface & Navigation

- **Responsive Design**: Mobile-first interface with adaptive layouts optimized for all device sizes and orientations
- **Touch-Friendly Interactions**: Long-press detection, swipe gestures, and optimized touch targets for enhanced mobile experience
- **Intelligent Navigation**: React Router integration with protected routes, deep linking, and navigation state management
- **Visual Feedback Systems**: Real-time loading indicators, status overlays, and toast notifications for optimal user experience

### Financial Transaction Management

- **Advanced Transaction Interface**: Comprehensive transaction viewing with virtualized lists, advanced filtering (account, payee, comment, category, budget_name), and intelligent search capabilities (see [Transactions PRD](./src/components/Transactions/prd.md))
- **Step-by-Step Transaction Entry**: Guided transaction creation with intelligent field suggestions, validation, and automatic budget name assignment (see [TransactionForm PRD](./src/components/TransactionForm/prd.md))
- **Smart Data Input**: Intelligent autocomplete for categories, payees, and comments based on historical transaction patterns
- **Budget Name Assignment**: Transactions carry a `budget_name` linking them to a specific budget; auto-assigned from category on entry, visible as a badge in the transaction list, and editable via dropdown
- **Cross-Language Search**: Advanced search functionality supporting English/Russian text matching for international users

### Budget Management & Analytics

- **Visual Budget Tracking**: Sophisticated budget management with color-coded progress indicators, multi-segment progress bars, and real-time spending analytics (see [Budgets PRD](./src/components/Budgets/prd.md))
- **Monthly Budget Planning**: Comprehensive month-by-month budget management with historical tracking and expectation ratios
- **Budget-Name-Based Calculations**: Budget totals computed by matching transaction `budget_name` to budget name; transactions without a recognised budget name (empty or unknown) are collected under "Другое" (Rest)
- **Data Migration**: One-time migration assigns budget names to existing transactions based on category-to-budget mapping, ensuring continuity after feature rollout

### Account & Data Management

- **Multi-Account Dashboard**: Clean overview of all financial accounts with color-coded identification and real-time balance tracking (see [Home PRD](./src/components/Home/prd.md))
- **Data Export & Backup**: CSV export functionality with timestamped filenames for backup and external analysis
- **Configuration Management**: Flexible user preferences with persistent storage and automatic synchronization

### Authentication & Security

- **Secure Authentication**: Password-based authentication with token management and automatic session restoration
- **Protected Application State**: Comprehensive authentication flow with secure credential management and automatic logout handling
- **Error Recovery**: Robust error handling with user-friendly messages and automatic recovery mechanisms

## Technical Notes

- React 19 + TypeScript with strict type checking
- PouchDB/CouchDB for offline-first data synchronization
- Jotai for centralized reactive state management
- Domain-driven design with pure TypeScript domain services
- Container/presentation component pattern for clean separation
- Bulma CSS framework for responsive mobile-first design
- React virtualization for efficient large dataset rendering
- Progressive Web App with service worker support

## Component References

- **[State](./src/state/prd.md)**: Jotai atoms for centralized reactive state management
- **[Domain](./src/domain/prd.md)**: Pure TypeScript business logic services
- **[Hooks](./src/hooks/prd.md)**: Domain adapter hooks wiring services to state
- **[Services](./src/services/prd.md)**: Infrastructure services (backend, database, storage)
- **[App](./src/components/App/prd.md)**: Main application orchestrator with authentication and navigation
- **[Home](./src/components/Home/prd.md)**: Account dashboard providing clean overview of financial position
- **[Transactions](./src/components/Transactions/prd.md)**: Advanced transaction management with filtering and search
- **[TransactionForm](./src/components/TransactionForm/prd.md)**: Step-by-step transaction creation and editing
- **[Budgets](./src/components/Budgets/prd.md)**: Comprehensive budget management and tracking
