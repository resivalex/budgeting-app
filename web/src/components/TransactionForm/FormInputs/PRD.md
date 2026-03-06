# Feature: Transaction Form Input Components

## Overview

Specialized form input components providing a step-by-step transaction entry experience with intelligent suggestions, validation, and seamless data handling.

## Functionality

- **Type Selection**: Three-option button group (income/expense/transfer) with visual active state
- **Amount Input**: Numeric input with decimal support
- **Account Selection**: Dropdown with color-coded account options
- **Category Input**: Smart category selection with autocomplete based on transaction history
- **Payee Input**: Autocomplete payee field based on previous transactions
- **Transfer Account**: Secondary account selector that excludes the primary account
- **Comment Field**: Free-text input for additional transaction context
- **Currency Selection**: Currency picker integrated with account and system currency settings
- **Date/Time Picker**: Full datetime selection with timezone handling and locale formatting
- **Budget Name Selection**: Dropdown for selecting the `budget_name` linking the transaction to a named budget; auto-populated when a category is chosen; lists budgets matching the current category first, then remaining budgets, then "(без бюджета)" last; does not auto-receive focus when advancing from category
- **Save Button**: Validation-aware save control that activates when all required fields are complete

Each component supports expand/collapse states for guided step-by-step form completion.
