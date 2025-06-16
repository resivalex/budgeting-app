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
- **Automatic Budget Calculation**: Dynamic calculation of budgets based on spending limits configuration and transaction data
- **Total Budget Aggregation**: Automatic "ОБЩИЙ" (Total) budget showing combined spending across all categories
- **Uncategorized Spending**: "Другое" (Other) budget tracking spending in categories not covered by specific budgets
- **Real-time Updates**: Live recalculation of spent amounts and remaining balances as transactions are modified or deleted
- **Currency Conversion System**: Sophisticated multi-currency conversion with configurable exchange rates for accurate cross-currency budget tracking
- **Transfer Transaction Filtering**: Intelligent exclusion of transfer transactions from budget calculations to avoid double-counting

The system provides complete budget lifecycle management from setup through monitoring to adjustment, with sophisticated currency handling and visual feedback.

## Technical Notes

- Built with React TypeScript using functional components and hooks for optimal state management
- Implements sophisticated currency conversion system with configurable exchange rates and cross-currency calculations
- Uses styled-components for custom progress bar visualization with multiple segments and external ratio indicators
- Integrates react-select for enhanced month selection with formatted date display using dayjs
- Leverages use-long-press library for touch-friendly budget tile interactions with configurable thresholds
- Implements complex budget calculation algorithms handling category mapping, currency conversion, and transaction filtering
- Uses SpendingLimitsDTO interface for configuration-driven budget management with monthly limit variations
- Integrates with TransactionsContainer for seamless transaction management within budget context
- Implements memoization and useEffect optimization for performance with large transaction datasets
- Supports dynamic budget modification with backend persistence through API integration
- Uses FontAwesome for consistent iconography (edit, expand/collapse indicators)
- Implements proper TypeScript interfaces for all budget-related data structures and component contracts
- Features hierarchical component architecture: BudgetsContainer → Budgets → Budget → BudgetProgressBar
- Integrates with date utilities for month-based filtering and expectation ratio calculations
- Uses lodash for efficient data transformation and sorting operations
