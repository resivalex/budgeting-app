# Feature: Transaction Form Input Components

## Overview

A complete set of specialized form input components that provide an intuitive step-by-step transaction entry experience with intelligent suggestions, validation, and seamless data handling.

## Functionality

- **Type Selection**: Three-option button group (income/expense/transfer) with visual active state styling
- **Amount Input**: Numeric input with decimal support and automatic focus management
- **Account Selection**: Dropdown with color-coded account options and balance display integration
- **Category Input**: Smart category selection with autocomplete based on transaction history
- **Payee Input**: Autocomplete payee field that learns from previous transactions
- **Transfer Account**: Secondary account selector that excludes the primary account for transfers
- **Comment Field**: Free-text input for additional transaction context and notes
- **Currency Selection**: Currency picker integrated with account and system currency settings
- **Date/Time Picker**: Full datetime selection with timezone handling and locale formatting
- **Save Button**: Validation-aware save control that activates when all required fields are complete

Each component supports expand/collapse states for guided step-by-step form completion, keyboard navigation, and provides immediate visual feedback for user interactions.

## Technical Notes

- Built with React TypeScript and styled-components for consistent design system integration
- Implements consistent interface pattern: `isExpanded`, `onExpand`, `onComplete` props for flow control
- Integrates with TransactionAggregator service for intelligent suggestions and historical data
- Manages state through parent TransactionFormContainer component
- Supports accessibility standards with proper ARIA labels and keyboard navigation
- Leverages TransactionDTO interface for type-safe data handling
