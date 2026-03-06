# Feature: App

## Overview

Main application orchestrator providing authentication, navigation, data synchronization, and the primary UI shell for the offline-first budgeting application.

## Functionality

- **Authentication System**: Login/logout workflow with secure credential management and automatic session restoration
- **Service Initialization**: Initializes BackendService and DbService after authentication
- **Navigation**: React Router integration with protected routes
- **Offline Detection**: Offline mode overlay with graceful degradation when backend is unreachable
- **Loading Indicators**: Progress bars and connection status feedback
- **Global Notifications**: Toast notifications for transaction operations (add, edit, delete) with automatic dismissal
- **Account Selection**: Color-coded account selectors with balance display
- **Menu System**: Hamburger menu with navigation links, version display, and admin functions
- **Data Export**: CSV export with timestamped filenames
- **Filter Management**: Transaction filtering by account, payee, comment, category, and budget_name
- **Transaction Operations**: CRUD operations with optimistic updates and background synchronization

### Application Flow

- **Unauthenticated**: Login form with backend URL and password
- **Authenticated**: Initializes services, loads data via domain hooks, renders main interface
- **Offline**: Overlay shown when backend connectivity is lost

### Data Synchronization

Integrates with domain hooks (see [hooks PRD](../../hooks/PRD.md)) for data management via Jotai atoms.
