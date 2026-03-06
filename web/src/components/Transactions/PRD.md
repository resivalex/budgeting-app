# Feature: Transactions

## Overview

Transaction management interface with virtualized scrolling, date-based grouping, advanced filtering, and inline transaction operations.

## Functionality

- **Virtualized Transaction List**: High-performance scrolling through large transaction datasets
- **Date-Based Grouping**: Automatic grouping of transactions by date with formatted date headers in Russian locale
- **Transaction Tiles**: Compact display showing category, account, payee, amount, currency; non-empty `budget_name` shown as a colored badge
- **Long Press Interaction**: Touch-friendly long press to focus on a specific transaction for detail operations
- **Transaction Details Modal**: Modal displaying all transaction fields with edit and delete capabilities in Russian interface
- **Advanced Filtering**: Multi-field filtering by account, payee, comment, category, and budget_name with cross-language search matching (English/Russian)
- **Expandable Filter Interface**: Collapsible search panel with text inputs and select dropdowns
- **Active Filter Display**: Visual tag-based display of applied filters with quick reset
- **Account-Based Filtering**: Handles both regular transactions and transfers (searches both source and destination accounts)
- **Transaction Type Visualization**: Color-coded amounts (green for income, red for expenses)
- **Transfer Display**: Special handling for transfer transactions with source/destination account arrows
- **Time Display Toggle**: Click-to-reveal transaction time information
- **Empty State Handling**: Clear messaging when no transactions match filters or dataset is empty
- **Edit Navigation**: Integration with React Router for transaction editing
- **Two-Step Deletion**: Confirmation step requiring a second click to prevent accidental deletion
