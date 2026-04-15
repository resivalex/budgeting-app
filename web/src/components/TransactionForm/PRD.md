# Feature: Transaction Form

## Overview

Step-by-step transaction creation and editing interface with intelligent defaults, validation, and bucket assignment.

## Functionality

- **Step-by-Step Flow**: Progressive form completion that guides users through transaction entry one field at a time
- **Mobile Fullscreen Selection**: On mobile devices (≤768px), dropdown and suggestion fields open as fullscreen overlays instead of inline dropdowns, ensuring all options remain visible and accessible above the virtual keyboard. The overlay dynamically resizes to the visible viewport when the software keyboard is shown. Fields requiring explicit confirmation (free-text inputs and fields without auto-close on selection) display a floating confirm button at the bottom-right corner for comfortable one-handed use.
- **Transaction Types**: Support for income, expense, transfer, and **custom** transactions with conditional field display. Custom transactions allow free selection of both account_from/account_to and bucket_from/bucket_to from all accounts (including external); account lists are filtered by the selected currency, same as other transaction types. Custom amounts display in purple.
- **Smart Initialization**: Automatically populates form fields when editing existing transactions
- **Intelligent Defaults**: Pre-fills fields based on transaction history and user patterns
- **Real-time Validation**: Validates form completeness and enables save only when all required fields are valid
- **Edit Mode**: Users can navigate directly to a transaction's edit URL to modify an existing transaction; navigating to an invalid transaction ID redirects to the home screen
- **Historical Data Integration**: Leverages past transaction history for smart suggestions and autocomplete
- **Multi-currency Support**: Handles different currencies with proper conversion and display
- **Category Extensions**: Supports expanded category names for better organization
- **Budget-First Flow**: The budget (bucket) field is filled before category. After selecting an account, the user selects a budget first, then a category.
- **Budget-Aware Category Ordering**: After a budget is selected, the category dropdown shows the categories belonging to that budget at the top, followed by all other categories.
- **Bucket Dropdown**: Users can manually expand and change the bucket; the dropdown lists buckets matching the current category first, then non-matching buckets, with the default bucket always last.
- **Transfer Account Swap**: If the user selects the same account for both source and destination in a transfer, they are automatically swapped to prevent duplicates. Transfers reuse the `accountTo` field (shared with custom type) for the destination account
- **Date/Time Handling**: Proper timezone conversion between local and UTC times

The form orchestrates all individual input components (see [FormInputs PRD](./FormInputs/PRD.md)) within a cohesive step-by-step interface that adapts based on transaction type and user progress.
