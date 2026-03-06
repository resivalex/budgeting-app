# Feature: Budgets

## Overview

A comprehensive budget management system that provides visual tracking of spending limits across categories with multi-currency support, progress visualization, and detailed transaction analysis for effective financial planning and monitoring.

## Functionality

- **Monthly Budget Overview**: Visual dashboard displaying all budget categories for a selected month with color-coded progress indicators
- **Interactive Budget Tiles**: Individual budget cards showing name, total amount, spent amount, remaining balance, and visual progress bars
- **Advanced Progress Visualization**: Multi-segment progress bars displaying spent amounts, remaining balances, overdrafts, and profit scenarios with distinct color coding
- **Month Selection Interface**: Dropdown selector with formatted month/year display for navigating between different budget periods
- **Long Press Budget Details**: Touch-friendly interaction to access detailed budget information and management options
- **Budget Detail Modal**: Comprehensive modal showing complete budget information including category breakdown, transaction list, and editing capabilities
- **Inline Budget Editing**: Direct editing of budget amounts and currencies for editable budgets with validation and persistence
- **Category Management**: Expandable/collapsible category lists with intelligent truncation for budgets covering multiple categories
- **Embedded Transaction View**: Integrated transaction list within budget details showing all transactions contributing to the budget
- **Multi-Currency Support**: Full support for different currencies with automatic conversion and proper symbol display
- **Common Expectation Ratio**: Visual indicator showing expected spending progress based on current date within the month
- **Automatic Budget Calculation**: Dynamic calculation of budgets based on spending limits configuration and transaction data; each transaction belongs to exactly one named budget or falls into the uncategorized pool
- **Total Budget Aggregation**: Automatic "ОБЩИЙ" (Total) budget showing combined spending across all named budgets
- **Uncategorized Spending**: "Другое" (Rest) budget collecting all transactions not assigned to any named budget category
- **Real-time Updates**: Live recalculation of spent amounts and remaining balances as transactions are modified or deleted
- **Currency Conversion System**: Sophisticated multi-currency conversion with configurable exchange rates for accurate cross-currency budget tracking
- **Transfer Transaction Filtering**: Transfer transactions excluded from budget calculations to avoid double-counting
