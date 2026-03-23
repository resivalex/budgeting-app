# Feature: Backend Exporting Module

## Overview

Allows users to download all their transaction data as a CSV file.

## Requirements

- **Fixed Column Set**: Exports exactly these fields: `datetime`, `account`, `category`, `type`, `amount`, `currency`, `payee`, `comment`, `bucket`
- **Chronological Ordering**: Records sorted newest first
- **Empty Dataset**: Returns a valid CSV with headers even when there are no transactions
- **Account Name Resolution**: Replaces account IDs with human-readable names; for transfer transactions, the destination account is also resolved

## User Workflows

- **Manual Export**: Users can download a full CSV backup of all transactions on demand
