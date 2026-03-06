# Feature: Transaction Form

## Overview

Step-by-step transaction creation and editing interface with intelligent defaults, validation, and budget name assignment.

## Functionality

- **Step-by-Step Flow**: Progressive form completion that guides users through transaction entry one field at a time
- **Transaction Types**: Support for income, expense, and transfer transactions with conditional field display
- **Smart Initialization**: Automatically populates form fields when editing existing transactions
- **Intelligent Defaults**: Pre-fills fields based on transaction history and user patterns
- **Real-time Validation**: Validates form completeness and enables save only when all required fields are valid
- **Edit Mode**: Users can navigate directly to a transaction's edit URL to modify an existing transaction
- **Historical Data Integration**: Leverages past transaction history for smart suggestions and autocomplete
- **Multi-currency Support**: Handles different currencies with proper conversion and display
- **Category Extensions**: Supports expanded category names for better organization
- **Budget Name Auto-Assignment**: When a category is selected, the form automatically resolves and assigns the corresponding `budget_name` by looking up which budget owns that category in spending limits
- **Budget Name Dropdown**: Users can manually expand and change the `budget_name`; the dropdown lists budgets matching the current category first, then unmatching budgets, then "(без бюджета)" at the end; completing the category step advances focus directly to payee, skipping budget_name
- **Date/Time Handling**: Proper timezone conversion between local and UTC times

The form orchestrates all individual input components (see [FormInputs PRD](./FormInputs/PRD.md)) within a cohesive step-by-step interface that adapts based on transaction type and user progress.
