# Feature: Web Frontend

## Overview

Offline-first React PWA providing personal budget tracking, multi-currency support, and real-time sync for comprehensive financial management.

## Functionality

### Core Application Experience

- **Offline-First**: Full application functionality without internet connection; changes sync automatically when connectivity is restored
- **Progressive Web App**: PWA capabilities with responsive design and mobile-optimized interactions
- **Multi-Currency Financial Management**: Full support for multiple currencies with configurable exchange rates and automatic conversion
- **Real-time Data Synchronization**: Bidirectional sync between local and remote databases with conflict resolution and database reset detection
- **Render Error Recovery**: Automatic data refresh on UI rendering failure with graceful degradation to a technical error screen if the problem persists

### User Interface & Navigation

- **Responsive Design**: Mobile-first interface with adaptive layouts for all device sizes
- **Touch-Friendly Interactions**: Long-press detection and optimized touch targets for mobile
- **Protected Navigation**: React Router with authentication-gated routes
- **Offline Overlay**: Visual degradation indicator when backend connectivity is lost

### Financial Transaction Management

- **Advanced Transaction Interface**: Transaction list with filtering (account, payee, comment, category, bucket) and cross-language search (see [Transactions PRD](./src/components/Transactions/PRD.md))
- **Step-by-Step Transaction Entry**: Guided transaction creation with automatic bucket assignment from category (see [TransactionForm PRD](./src/components/TransactionForm/PRD.md))
- **Bucket Assignment**: Every transaction is assigned to a bucket; auto-assigned from category on entry, visible as a badge in the transaction list, and editable via dropdown

### Budget Management & Analytics

- **Visual Budget Tracking**: Budget management with color-coded progress indicators and spending analytics (see [Budgets PRD](./src/components/Budgets/PRD.md))
- **Monthly Budget Planning**: Month-by-month budget management with expectation ratios
- **Bucket-Based Calculations**: Budget totals computed by bucket assignment; transactions with no specific bucket aggregate under "Другое" (Rest)

### Account & Data Management

- **Bucket Balances**: Overview of all buckets with per-currency balance totals computed from transactions (see [Buckets PRD](./src/components/Buckets/PRD.md))
- **Account Dashboard**: Overview of all accounts with color-coded balances (see [Home PRD](./src/components/Home/PRD.md))
- **Data Export**: CSV export with timestamped filenames
- **Bucket & Spending Limits Configuration**: Bucket definitions and per-month spending limits are managed locally and synced with the remote database

### Authentication & Security

- **Password-Based Authentication**: Login with backend URL and password; token stored in localStorage for subsequent requests
- **Session Restoration**: Automatic login restoration on page reload from stored credentials

## Domain Responsibilities

Each domain service encapsulates a specific business capability: transaction management, data synchronization, settings, budget calculations, transaction form logic, filtering, export, and authentication.

## Component References

- **[State](./src/state/PRD.md)**: Centralized reactive state management
- **[Domain](./src/domain/PRD.md)**: Business logic services
- **[Hooks](./src/hooks/PRD.md)**: Domain adapter hooks wiring services to state
- **[Services](./src/services/PRD.md)**: Infrastructure services (backend, database, storage)
- **[App](./src/components/App/PRD.md)**: Main application orchestrator with authentication and navigation
- **[Home](./src/components/Home/PRD.md)**: Account dashboard
- **[Transactions](./src/components/Transactions/PRD.md)**: Transaction management with filtering and search
- **[TransactionForm](./src/components/TransactionForm/PRD.md)**: Step-by-step transaction creation and editing
- **[Budgets](./src/components/Budgets/PRD.md)**: Budget management and tracking
- **[Buckets](./src/components/Buckets/PRD.md)**: Bucket balances overview
