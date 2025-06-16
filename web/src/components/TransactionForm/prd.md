# Feature: Transaction Form

## Overview

A comprehensive transaction creation and editing interface that provides a guided step-by-step experience for entering financial transactions with intelligent defaults, validation, and seamless integration with the budgeting system.

## Functionality

- **Step-by-Step Flow**: Progressive form completion that guides users through transaction entry one field at a time
- **Transaction Types**: Support for income, expense, and transfer transactions with conditional field display
- **Smart Initialization**: Automatically populates form fields when editing existing transactions
- **Intelligent Defaults**: Pre-fills fields based on transaction history and user patterns
- **Real-time Validation**: Validates form completeness and enables save functionality only when all required fields are valid
- **Route Integration**: Seamlessly integrates with React Router for transaction editing via URL parameters
- **State Management**: Centralized form state with proper data flow to child components
- **Historical Data Integration**: Leverages transaction aggregations for smart suggestions and autocomplete
- **Multi-currency Support**: Handles different currencies with proper conversion and display
- **Account Management**: Integrates with colored account system for visual identification
- **Category Extensions**: Supports expanded category names for better organization
- **Date/Time Handling**: Proper timezone conversion between local and UTC times
- **Save Operations**: Async save handling with loading states and error management

The form orchestrates all individual input components (see [FormInputs PRD](./FormInputs/prd.md)) within a cohesive step-by-step interface that adapts based on transaction type and user progress.

## Technical Notes

- Built with React TypeScript using functional components and hooks
- Manages complex form state through useState hooks with proper type safety
- Integrates with TransactionAggregator service for historical data and suggestions
- Uses React Router for navigation and transaction editing via URL parameters
- Implements proper timezone handling for datetime fields
- Leverages TransactionDTO interface for consistent data structure
- Supports both creation and editing modes with automatic form initialization
- Implements memoization for performance optimization of derived data
- Integrates with localStorage for user preferences (category expansions, account properties)
- Provides proper error handling and loading states for async operations
