# Feature: Home

## Overview

A dashboard that provides a clean, visual overview of all user accounts with their current balances, displaying essential financial information at a glance with color-coded account identification for quick account recognition.

## Functionality

- **Account Balance Overview**: Clean display of all user accounts with current balance information in a card-based layout
- **Color-Coded Account Cards**: Each account is displayed with its associated color for visual identification and quick recognition
- **Multi-Currency Display**: Proper formatting and currency symbol display for accounts in different currencies
- **Responsive Card Layout**: Mobile-friendly two-column layout showing account names on the left and balances on the right
- **Financial Amount Formatting**: Consistent number formatting for monetary values with appropriate decimal places
- **Account Properties Integration**: Merges account details with user-defined properties (colors) stored in localStorage
- **Visual Account Identification**: Uses background colors on account cards to match user's color preferences for each account
- **Clean Dashboard Design**: Minimalist interface focusing on essential account information without clutter

The home screen serves as the primary landing page providing users with immediate visibility into their financial position across all accounts.

## Technical Notes

- Built with React TypeScript using functional components for optimal performance
- Integrates with localStorage for persistent account properties (colors) across sessions
- Uses utility functions for financial formatting (formatFinancialAmount, convertCurrencyCodeToSymbol)
- Implements mergeAccountDetailsAndProperties utility for combining account data with user preferences
- Uses Bulma CSS framework for responsive grid layout (columns, is-mobile classes)
- Leverages ColoredAccountDetailsDTO and AccountPropertiesDTO interfaces for type-safe data handling
- Features simple component hierarchy: HomeContainer → Home for separation of data logic and presentation
- Implements consistent styling patterns with box containers and margin/padding utilities
- Uses array mapping for efficient rendering of account list without external state management
