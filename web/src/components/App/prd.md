# Feature: App

## Overview

The main application orchestrator that provides a complete offline-first budgeting application with authentication, navigation, data synchronization, and comprehensive user interface management for seamless financial tracking experience.

## Functionality

- **Authentication System**: Complete login/logout workflow with secure credential management and automatic session restoration
- **Application Container Architecture**: Multi-layered container pattern separating concerns between authentication, authorization, and core application logic
- **Service Initialization**: Dynamic initialization of BackendService and DbService based on user configuration with proper dependency injection
- **Navigation Framework**: React Router integration with protected routes and navigation state management
- **Offline-First Experience**: Comprehensive offline mode detection with visual overlay and graceful degradation of functionality
- **Real-time Status Indicators**: Loading progress bars and connection status feedback for optimal user experience
- **Global Notification System**: Toast notifications for user actions (add, edit, delete transactions) with automatic dismissal
- **Account Selection Components**: Sophisticated color-coded account selectors with balance display and filtering capabilities
- **Menu System**: Responsive hamburger menu with navigation links, version display, and administrative functions
- **Data Export Functionality**: CSV export generation with timestamped filenames for backup and analysis
- **Filter Management**: Comprehensive filtering system for transactions by account, payee, and comment with persistent state
- **Transaction Operations**: Complete CRUD operations with optimistic updates and background synchronization
- **Error Handling**: Robust error management with user-friendly error messages and recovery mechanisms
- **Configuration Management**: Secure configuration storage and retrieval with localStorage persistence

### Core Application Flow:

- **Unauthenticated State**: Login interface with backend URL and password authentication
- **Service Setup**: Automatic initialization of backend and database services upon successful authentication
- **Data Synchronization**: Integration with sophisticated hooks system (see [hooks PRD](./hooks/prd.md)) for real-time data management
- **Main Interface**: Full-featured budgeting interface with navigation, filtering, and transaction management
- **Offline Handling**: Graceful degradation with offline overlay when backend connectivity is lost

### User Interface Components:

- **Responsive Design**: Mobile-first interface with adaptive layouts across device sizes
- **Color-Coded Accounts**: Visual account identification with custom colors and balance display
- **Interactive Elements**: Touch-friendly interactions with proper feedback and state management
- **Accessibility**: Proper keyboard navigation and screen reader support throughout the interface

## Technical Notes

- Built with React TypeScript using modern functional components and hooks architecture
- Implements sophisticated authentication flow with localStorage-based session management
- Uses React Router for client-side routing with protected route patterns
- Integrates comprehensive hook system for data management (useTransactions, useSyncService, etc.)
- Features dynamic service initialization with proper dependency injection patterns
- Implements forwardRef and useImperativeHandle for advanced component composition
- Uses react-select with custom styling for enhanced account selection components
- Leverages styled-components for custom overlay and status indicator styling
- Implements proper TypeScript interfaces for all data structures and component props
- Features sophisticated error boundary patterns for robust error handling
- Uses UUID generation for unique instance identification in multi-tab scenarios
- Implements proper cleanup patterns for intervals, timeouts, and event listeners
- Features memoization strategies for performance optimization of complex selectors
- Uses Bulma CSS framework for consistent styling and responsive design patterns
- Implements proper async/await patterns for all backend operations with error handling
- Features configurable timing and retry mechanisms for robust network operations
- Uses proper React patterns for state lifting and component composition
- Implements localStorage integration for persistent user preferences and session management
