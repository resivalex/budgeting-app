# Feature: Transactions

## Overview

A comprehensive transaction management interface that provides efficient viewing, searching, and management of financial transactions with virtualized scrolling, intelligent grouping, and detailed transaction operations.

## Functionality

- **Virtualized Transaction List**: High-performance scrolling through large transaction datasets using react-virtualized for optimal memory usage
- **Date-Based Grouping**: Automatic grouping of transactions by date with clear visual headers showing formatted dates in Russian locale
- **Transaction Tiles**: Compact transaction display showing essential information (category, account, payee, amount, currency) with visual indicators for transaction types
- **Long Press Interaction**: Touch-friendly long press detection to focus on specific transactions for detailed operations
- **Transaction Details Modal**: Comprehensive modal displaying all transaction fields with edit and delete capabilities in Russian interface
- **Advanced Filtering System**: Multi-field filtering by account, payee, and comment with cross-language search matching for English/Russian text
- **Expandable Filter Interface**: Collapsible search panel with dedicated inputs for payee and comment filtering
- **Active Filter Display**: Visual indication of applied filters with tag-based display and quick reset functionality
- **Account-Based Filtering**: Smart account filtering that handles both regular transactions and transfers (searches both source and destination accounts)
- **Transaction Type Visualization**: Color-coded amounts (green for income, red for expenses) with proper formatting and currency symbols
- **Transfer Display**: Special handling for transfer transactions showing source and destination accounts with arrow indicators
- **Time Display Toggle**: Click-to-reveal transaction time information for detailed timing context
- **Dynamic Height Calculation**: Automatic calculation and caching of transaction tile heights for smooth scrolling
- **Empty State Handling**: Clear messaging when no transactions match current filters or when dataset is empty
- **Responsive Design**: Adaptive layout that works across different screen sizes and orientations
- **Edit Navigation**: Seamless integration with React Router for transaction editing workflows
- **Two-Step Deletion**: Safe deletion with confirmation step requiring second click to prevent accidental data loss
- **Filter State Management**: Persistent filter states with local input management and apply/reset functionality
- **Cross-Language Support**: Full Russian localization with cross-language search capabilities for mixed-language datasets

The interface efficiently handles large transaction datasets while providing intuitive interaction patterns for both viewing and managing individual transactions.

## Technical Notes

- Built with React TypeScript using functional components and hooks for optimal performance
- Implements react-virtualized List component with AutoSizer for efficient rendering of large datasets
- Uses react-measure for dynamic height calculation and responsive layout management
- Integrates use-long-press library for touch-friendly interaction patterns with configurable thresholds
- Leverages dayjs with Russian locale for proper date formatting and localization throughout
- Implements memoization strategies for performance optimization of derived data (date headers, focused transactions)
- Uses React Router for navigation and URL-based transaction editing with replace navigation
- Integrates with FontAwesome for consistent iconography (edit, delete, search, close icons)
- Implements cross-language text matching utility for English/Russian search functionality
- Supports both controlled and uncontrolled filter states with local state management
- Implements proper event handling for modal interactions and background dismissal
- Uses classNames utility for conditional styling based on transaction types and states
- Features hierarchical component architecture: Page → PageContainer → Container → Core Components
- Implements proper TypeScript interfaces for all props and component contracts
- Uses Bulma CSS framework classes for consistent styling and responsive design
