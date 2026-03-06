# Feature: Backend Exporting Module

## Overview

Allows users to download all their transaction data as a CSV file.

## Requirements

- **Fixed Column Set**: Exports exactly these fields: `datetime`, `account`, `category`, `type`, `amount`, `currency`, `payee`, `comment`, `budget_name`
- **Chronological Ordering**: Records sorted newest first
- **Empty Dataset**: Returns a valid CSV with headers even when there are no transactions

## User Workflows

- **Manual Export**: User calls `GET /exporting` to download a full CSV backup of all transactions
- **Pre-Import Backup**: System automatically exports current data before overwriting the database during an import

## Integration Points

- **[Importing Module](../importing/PRD.md)**: Calls exporting as a pre-import backup step
